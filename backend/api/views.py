from django.db.models import Q
from django.utils import timezone
from datetime import datetime
from rest_framework.response import Response
from .models import *
from rest_framework import generics, status
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .services import get_user_data
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.views import APIView
from .serializers import GoogleAuthSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import F, Sum
from django.db.models import F, Sum, FloatField
from django.db.models.functions import Cast
from django.core.mail import send_mail


class GoogleLoginApi(APIView):
    permission_classes = [
        AllowAny,
    ]

    def get(self, request, *args, **kwargs):
        auth_serializer = GoogleAuthSerializer(data=request.GET)
        auth_serializer.is_valid(raise_exception=True)

        validated_data = auth_serializer.validated_data
        user_data = get_user_data(validated_data, "google")

        user = User.objects.get(email=user_data["email"])

        token = TokenObtainPairSerializer.get_token(user)
        access_token = str(token.access_token)
        refresh_token = str(token)

        return redirect(
            f"{settings.BASE_APP_URL}/login?access={access_token}&refresh={refresh_token}"
        )


class GithubLoginApi(APIView):
    permission_classes = [
        AllowAny,
    ]

    def get(self, request, *args, **kwargs):
        auth_serializer = GithubAuthSerializer(data=request.GET)
        auth_serializer.is_valid(raise_exception=True)

        validated_data = auth_serializer.validated_data
        user_data = get_user_data(validated_data, "github")

        user = User.objects.get(username=user_data["username"])

        token = TokenObtainPairSerializer.get_token(user)
        access_token = str(token.access_token)
        refresh_token = str(token)

        return redirect(
            f"{settings.BASE_APP_URL}/login?access={access_token}&refresh={refresh_token}"
        )


class GetAccess(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        access_to = self.request.query_params.getlist("access_to")
        user = self.request.user

        if access_to:
            if "site" in access_to:
                is_banned = User.objects.filter(pk=user.id, is_banned=True).exists()
                if is_banned:
                    return Response(status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response(status=status.HTTP_200_OK)
            elif "admin" in access_to:
                search = User.objects.filter(pk=user.id, status=2).exists()
                search2 = User.objects.filter(pk=user.id, status=1).exists()
                if search or search2:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)
            elif "manage" in access_to:
                search = User.objects.filter(pk=user.id, status=3).exists()
                search2 = User.objects.filter(pk=user.id, status=1).exists()
                if search or search2:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)
            elif "orders" in access_to:
                search = User.objects.filter(pk=user.id, status=4).exists()
                search2 = User.objects.filter(pk=user.id, status=1).exists()
                if search or search2:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)
            elif "header_options" in access_to:
                if user.status.id == 1:
                    return Response(
                        data=[
                            {"pageName": "admin", "slug": "/admin/", "name": "Admin"},
                            {
                                "pageName": "manage",
                                "slug": "/manage/",
                                "name": "Manage",
                            },
                            {
                                "pageName": "orders",
                                "slug": "/orders/",
                                "name": "Orders",
                            },
                        ],
                        status=status.HTTP_200_OK,
                    )
                elif user.status.id == 2:
                    return Response(
                        data=[
                            {"pageName": "admin", "slug": "/admin/", "name": "Admin"}
                        ],
                        status=status.HTTP_200_OK,
                    )
                elif user.status.id == 3:
                    return Response(
                        data=[
                            {
                                "pageName": "manage",
                                "slug": "/manage/",
                                "name": "Manage",
                            },
                        ],
                        status=status.HTTP_200_OK,
                    )
                elif user.status.id == 4:
                    return Response(
                        data=[
                            {"pageName": "orders", "slug": "/orders/", "name": "Orders"}
                        ],
                        status=status.HTTP_200_OK,
                    )
                elif user.status.id == 5 or user.status.id == 6:
                    return Response(data=[], status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        method = self.request.data.get("method")
        user = request.user

        if method == "send_email":
            subject = "Change EATLY password"
            message = f"Hi {user.username}, "
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [
                user.email,
            ]
            send_mail(subject, message, email_from, recipient_list)


class GetUser(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        method = self.request.data.get("method")
        name = self.request.data.get("name")

        if method == "name":
            user = self.request.user
            userProfile = User.objects.get(pk=user.id)
            userProfile.first_name = name
            userProfile.save()
            return Response(status=status.HTTP_201_CREATED)

    def get_queryset(self):
        user = self.request.user.id
        return User.objects.filter(pk=user)


class PaymentView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        payment_id = self.request.query_params.get("payment_id")
        user = self.request.user

        if payment_id:
            return Payments.objects.filter(pk=payment_id, owner=user)
        else:
            return Payments.objects.filter(owner=user)

    def post(self, request, *args, **kwargs):
        number = self.request.data.get("number")
        date_to = self.request.data.get("date_to")
        cvv = self.request.data.get("cvv")
        name = self.request.data.get("name")

        payment = Payments.objects.filter(
            owner=self.request.user, number=number, date_to=date_to, cvv=cvv, name=name
        ).exists()

        if payment:
            return Response(status=status.HTTP_409_CONFLICT)
        else:
            new_payment = Payments(
                owner=self.request.user,
                number=number,
                date_to=date_to,
                cvv=cvv,
                name=name,
            )
            new_payment.save()
            return Response(status=status.HTTP_201_CREATED)


class AddressList(generics.ListAPIView):
    serializer_class = AddressSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        address_id = self.request.query_params.get("address_id")
        user = self.request.user

        if address_id:
            return Address.objects.filter(pk=address_id, owner=user)
        else:
            return Address.objects.filter(owner=user)

    def post(self, request, *args, **kwargs):
        building_address = self.request.data.get("house_address")
        entrance = self.request.data.get("entrance")
        floor = self.request.data.get("floor")
        flat = self.request.data.get("flat")

        address = Address.objects.filter(
            owner=self.request.user,
            house_address=building_address,
            entrance=entrance,
            floor=floor,
            flat=flat,
        ).exists()

        if address:
            return Response(status=status.HTTP_409_CONFLICT)
        else:
            new_address = Address(
                owner=self.request.user,
                house_address=building_address,
                entrance=entrance,
                floor=floor,
                flat=flat,
            )
            new_address.save()
            return Response(status=status.HTTP_201_CREATED)


class OrderView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        method = request.query_params.get("method")
        user = request.user

        if method == "for_complete":
            order = Order.objects.filter(user=user, status=1)[0]
            address = order.address
            rest_name = order.restaurant.name

            order_data = {
                "id": order.id,
                "total": order.total,
                "address_obj": {
                    "building": address.house_address,
                    "entrance": address.entrance,
                    "floor": address.floor,
                    "flat": address.flat,
                },
                "rest_name": rest_name,
                "rest_address": order.restaurant.address,
            }

            return Response(status=status.HTTP_200_OK, data=order_data)
        else:
            orders = Order.objects.filter(user=user)
            serializer = OrderSerializer(orders, many=True)
            return Response(status=status.HTTP_200_OK, data=serializer.data)

    def post(self, request, *args, **kwargs):
        addressID = request.data.get("address")
        payment = request.data.get("payment")
        statusID = request.data.get("status")
        orderID = request.data.get("id")
        statusName = OrderStatus.objects.get(pk=statusID)

        if payment:
            order = Order.objects.get(pk=orderID, user=self.request.user)
            exists = Order.objects.filter(
                user=self.request.user, status=statusName
            ).exists()
            if exists and statusID == 1:
                return Response(status=status.HTTP_303_SEE_OTHER)
            if payment == "Cash" or payment == "Card to courier":
                order.comment = f"Payment method: {payment}"
            else:
                paymentID = Payments.objects.get(
                    number=payment, owner=self.request.user
                )
                order.payment = paymentID
            order.status = statusName
            order.save()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        else:
            rest_id = request.data.get("rest_id")
            coupon_title = request.data.get("coupon")
            total = (
                CartItem.objects.filter(owner=request.user, item__restaurant_id=rest_id)
                .annotate(
                    item_total=Cast(
                        F("item__price") * F("quantity") + 0.99 * F("quantity"),
                        FloatField(),
                    )
                )
                .aggregate(total=Sum("item_total"))["total"]
                or 0
            )

            coupon = None
            if coupon_title:
                coupon = Coupon.objects.get(title=coupon_title)
            total *= 1.1
            if coupon:
                total *= coupon.value

            total = round(total, 2)

            exists = Order.objects.filter(user=self.request.user, status=1).exists()
            if exists:
                return Response(status=status.HTTP_303_SEE_OTHER)
            order = Order(
                user=self.request.user,
                address_id=addressID,
                total=total,
                status_id=1,
                coupon=coupon,
                restaurant_id=rest_id,
            )
            order.save()
            return Response(status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class Items(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        item_id = request.query_params.get("id")
        method = request.query_params.get("method")

        if item_id:
            item = Item.objects.filter(pk=item_id).first()
            return Response(status=status.HTTP_200_OK, data=ItemSerializer(item).data)

        if method == "top":
            items = Item.objects.order_by("-rating")[:5]
        else:
            items = Item.objects.all()

        rest_ids = list(items.values_list("restaurant_id", flat=True))
        rests = Restaurant.objects.filter(id__in=rest_ids).values("id", "name")

        cats = Category.objects.all()
        cart_items = CartItem.objects.filter(owner=request.user).select_related("item")

        serialized_items = ItemSerializer(items, many=True).data
        serialized_rests = list(rests)
        for i in serialized_items:
            rest_id = i["restaurant"]
            rest = next((r for r in serialized_rests if r["id"] == rest_id), None)
            i["rest_name"] = rest["name"]

        data = {
            "items": serialized_items,
            "cats": CategorySerializer(cats, many=True).data,
            "in_cart": CartItemSerializer(cart_items, many=True).data,
        }

        return Response(status=status.HTTP_200_OK, data=data)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class DeleteCartItem(generics.DestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def destroy(self, request, *args, **kwargs):
        itemID = self.request.query_params.get("id")
        method = self.request.query_params.get("method")
        user = self.request.user

        if method == "clear":
            items = CartItem.objects.filter(owner=user)
            for item in items:
                item.delete()
            return Response(status=status.HTTP_202_ACCEPTED)

        if itemID:
            cart_item = CartItem.objects.get(pk=itemID, owner=user)
            if cart_item:
                cart_item.delete()
                return Response(status=status.HTTP_202_ACCEPTED)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CartItemListCreate(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def perform_create(self, serializer):
        method = self.request.query_params.get("method")

        if method == "addQuant":
            if serializer.is_valid():
                user = self.request.user
                item = CartItem.objects.get(
                    owner=user, item_id=self.request.data["item"]
                )
                item.quantity = self.request.data["quantity"]
                item.save()
            else:
                print(serializer.errors)
        else:
            if serializer.is_valid():
                serializer.save(owner=self.request.user)
            else:
                print(serializer.errors)


class CouponListCreate(generics.ListCreateAPIView):
    """
    View to list all coupons and create a new coupon.

    - GET: Returns a list of all coupons.
    - POST: Creates a new coupon.

    Permissions:
    - Only authenticated users can access this view.
    """

    serializer_class = CouponSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        method = self.request.query_params.get("method")

        if method == "all":
            return Coupon.objects.all()

        return {"error": "Bad Request"}

    def post(self, request, *args, **kwargs):
        method = self.request.data.get("method")

        if method == "create":
            date = self.request.data.get("date_to")
            title = self.request.data.get("title")
            value = self.request.data.get("value")
            category = self.request.data.get("category")
            enabled_activations = self.request.data.get("ea")
            valid_to = datetime.strptime(date, "%Y-%m-%d").date()
            cat_obj = CouponCategory.objects.get(pk=category)

            check = Coupon.objects.filter(title=title).exists()
            if check:
                return Response(status=status.HTTP_409_CONFLICT)

            if (
                title
                and value
                and cat_obj
                and enabled_activations
                and valid_to
                and check == False
            ):
                new_coupon = Coupon(
                    title=title,
                    category=cat_obj,
                    enabled_times=enabled_activations,
                    value=value,
                    valid_to=valid_to,
                )
                new_coupon.save()
                return Response(status=status.HTTP_201_CREATED)

        if method == "apply":
            title = self.request.data.get("title")
            now = timezone.now().date()
            check = Coupon.objects.filter(
                title=title, valid_to__gt=now, is_valid=True, enabled_times__gt=0
            ).exists()
            if check:
                coupon = Coupon.objects.get(
                    title=title, valid_to__gt=now, is_valid=True, enabled_times__gt=0
                )
                coupon.enabled_times -= 1
                coupon.times_activated += 1
                coupon.save()
                return Response(status=status.HTTP_200_OK, data={"value": coupon.value})
            else:
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CancelOrder(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request, *args, **kwargs):
        order_id = self.request.data.get("id")

        order = Order.objects.get(pk=order_id, user=self.request.user)
        new_status = OrderStatus.objects.get(pk=5)
        order.status = new_status
        order.save()
        return Response(status=200)


class RestaurantListCreate(generics.ListCreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        method = self.request.query_params.get("method")

        if method == "top":
            rests = Restaurant.objects.order_by("-rating")[:3]
            rest_ids = list(rests.values_list("id", flat=True))
            items = Item.objects.filter(restaurant_id__in=rest_ids).values(
                "id", "restaurant_id"
            )

            cats = RestaurantCat.objects.all()

            serialized_items = list(items)
            serialized_rests = RestaurantSerializer(rests, many=True).data
            for i in serialized_rests:
                rest_id = i["id"]
                items_in_rest = [
                    r for r in serialized_items if r["restaurant_id"] == rest_id
                ]
                i["items_count"] = len(items_in_rest)

            data = {
                "items": serialized_rests,
                "cats": RestaurantCatSerializer(cats, many=True).data,
            }

            return Response(status=status.HTTP_200_OK, data=data)
        return Restaurant.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class GiveCartData(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        cart_items = CartItem.objects.filter(owner=user).values(
            "id", "quantity", "item_id"
        )
        item_ids = cart_items.values_list("item_id", flat=True)
        items = Item.objects.filter(id__in=item_ids).values(
            "id", "restaurant_id", "title", "price", "photo"
        )
        rest_ids = items.values_list("restaurant_id", flat=True)
        rests = Restaurant.objects.filter(id__in=rest_ids).values("id", "name")
        return Response(
            status=status.HTTP_200_OK,
            data={
                "rests": list(rests),
                "items": list(items),
                "cart_items": list(cart_items),
            },
        )


class CategoriesList(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return Category.objects.all()


class RestaurantCategories(generics.ListCreateAPIView):
    serializer_class = RestaurantCatSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return RestaurantCat.objects.all()


class ItemDelete(generics.DestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return Item.objects.all()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        AllowAny,
    ]


class SearchView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        search = request.query_params.get("search", None)
        also = request.query_params.get("also", None)
        search_mode = request.query_params.get("search_mode")

        if search is not None:
            if also is not None:
                if search_mode == "food":
                    search1 = Item.objects.filter(
                        Q(title__icontains=search) & Q(title__icontains=also)
                        | Q(title__icontains=search)
                        | Q(title__icontains=also)
                    )
                    if len(search1) > 0:
                        serialized_items = ItemSerializer(search1, many=True).data
                        cats = Category.objects.all()
                        serialized_cats = CategorySerializer(cats, many=True)
                        cart_items = CartItem.objects.filter(owner=self.request.user)
                        serialized_cart_items = CartItemSerializer(
                            cart_items, many=True
                        )

                        rest_ids = list(search1.values_list("restaurant_id", flat=True))
                        rests = Restaurant.objects.filter(id__in=rest_ids).values(
                            "id", "name"
                        )

                        cats = Category.objects.all()
                        cart_items = CartItem.objects.filter(
                            owner=request.user
                        ).select_related("item")

                        serialized_rests = list(rests)
                        for i in serialized_items:
                            rest_id = i["restaurant"]
                            rest = next(
                                (r for r in serialized_rests if r["id"] == rest_id),
                                None,
                            )
                            i["rest_name"] = rest["name"]

                        return Response(
                            status=status.HTTP_200_OK,
                            data={
                                "items": serialized_items,
                                "cats": serialized_cats.data,
                                "in_cart": serialized_cart_items.data,
                            },
                        )
                    else:
                        return Response(
                            status=status.HTTP_200_OK,
                            data={"items": [{"not_found": "no items"}]},
                        )
                else:
                    search1 = Restaurant.objects.filter(
                        Q(name__icontains=search) & Q(name__icontains=also)
                        | Q(name__icontains=search)
                        | Q(name__icontains=also)
                    )
                    if len(search1) > 0:
                        rest_ids = list(search1.values_list("id", flat=True))
                        items = Item.objects.filter(restaurant_id__in=rest_ids).values(
                            "id", "restaurant_id"
                        )

                        cats = RestaurantCat.objects.all()

                        serialized_items = list(items)
                        serialized_rests = RestaurantSerializer(search1, many=True).data
                        for i in serialized_rests:
                            rest_id = i["id"]
                            items_in_rest = [
                                r
                                for r in serialized_items
                                if r["restaurant_id"] == rest_id
                            ]
                            i["items_count"] = len(items_in_rest)

                        data = {
                            "items": serialized_rests,
                            "cats": RestaurantCatSerializer(cats, many=True).data,
                        }

                        return Response(status=status.HTTP_200_OK, data=data)
                    else:
                        return Response(
                            status=status.HTTP_200_OK,
                            data={"items": [{"not_found": "no items"}]},
                        )
            else:
                if search_mode == "food":
                    items = Item.objects.filter(Q(title__icontains=search))
                    if len(items) > 0:
                        serialized_items = ItemSerializer(items, many=True).data
                        cats = Category.objects.all()
                        serialized_cats = CategorySerializer(cats, many=True)
                        cart_items = CartItem.objects.filter(owner=self.request.user)
                        serialized_cart_items = CartItemSerializer(
                            cart_items, many=True
                        )

                        rest_ids = list(items.values_list("restaurant_id", flat=True))
                        rests = Restaurant.objects.filter(id__in=rest_ids).values(
                            "id", "name"
                        )

                        cats = Category.objects.all()
                        cart_items = CartItem.objects.filter(
                            owner=request.user
                        ).select_related("item")

                        serialized_rests = list(rests)
                        for i in serialized_items:
                            rest_id = i["restaurant"]
                            rest = next(
                                (r for r in serialized_rests if r["id"] == rest_id),
                                None,
                            )
                            i["rest_name"] = rest["name"]

                        return Response(
                            status=status.HTTP_200_OK,
                            data={
                                "items": serialized_items,
                                "cats": serialized_cats.data,
                                "in_cart": serialized_cart_items.data,
                            },
                        )
                    else:
                        return Response(
                            status=status.HTTP_200_OK,
                            data={"items": [{"not_found": "no items"}]},
                        )
                elif search_mode == "rests":
                    rests = Restaurant.objects.filter(Q(name__icontains=search))
                    if len(rests) > 0:
                        rest_ids = list(rests.values_list("id", flat=True))
                        items = Item.objects.filter(restaurant_id__in=rest_ids).values(
                            "id", "restaurant_id"
                        )

                        cats = RestaurantCat.objects.all()

                        serialized_items = list(items)
                        serialized_rests = RestaurantSerializer(rests, many=True).data
                        for i in serialized_rests:
                            rest_id = i["id"]
                            items_in_rest = [
                                r
                                for r in serialized_items
                                if r["restaurant_id"] == rest_id
                            ]
                            i["items_count"] = len(items_in_rest)

                        data = {
                            "items": serialized_rests,
                            "cats": RestaurantCatSerializer(cats, many=True).data,
                        }

                        return Response(status=status.HTTP_200_OK, data=data)
                    else:
                        return Response(
                            status=status.HTTP_200_OK,
                            data={"items": [{"not_found": "no items"}]},
                        )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FilterView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request, *args, **kwargs):
        data = self.request.data
        filters = data.get("filters")

        if filters:
            category_name = filters.get("category")
            min_cost, max_cost = filters.get("cost", [None, None])
            min_rating = filters.get("rating")

            query = Q()
            if category_name:
                category = Category.objects.get(name=category_name)
                query &= Q(category=category)
            if min_cost is not None and max_cost is not None:
                query &= Q(price__range=(min_cost, max_cost))
            if min_rating is not None:
                query &= Q(rating__gte=min_rating)

            items = Item.objects.filter(query)
            if len(items) > 0:
                serialized_items = ItemSerializer(items, many=True).data
                cats = Category.objects.all()
                serialized_cats = CategorySerializer(cats, many=True)
                cart_items = CartItem.objects.filter(owner=self.request.user)
                serialized_cart_items = CartItemSerializer(cart_items, many=True)

                rest_ids = list(items.values_list("restaurant_id", flat=True))
                rests = Restaurant.objects.filter(id__in=rest_ids).values("id", "name")

                cats = Category.objects.all()
                cart_items = CartItem.objects.filter(owner=request.user).select_related(
                    "item"
                )

                serialized_rests = list(rests)
                for i in serialized_items:
                    rest_id = i["restaurant"]
                    rest = next(
                        (r for r in serialized_rests if r["id"] == rest_id), None
                    )
                    i["rest_name"] = rest["name"]

                return Response(
                    status=status.HTTP_200_OK,
                    data={
                        "items": serialized_items,
                        "cats": serialized_cats.data,
                        "in_cart": serialized_cart_items.data,
                    },
                )
            else:
                return Response(
                    status=status.HTTP_200_OK,
                    data=[{"items": {"not_found": "no items"}}],
                )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetProfile(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        user = request.user
        method = request.data.get("method")

        if method == "orders":
            orders = Order.objects.filter(user=user)
            serializer = OrderSerializer(orders)
            return Response(serializer.data)
