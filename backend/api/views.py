from django.db.models import Q
from django.utils import timezone
from datetime import datetime
from rest_framework.response import Response

from .models import *
from rest_framework import generics, status
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny

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
                    return Response(data=[
                        {
                            "pageName": "admin",
                            "slug": "/admin/",
                            "name": "Admin"
                        },
                        {
                            "pageName": "manage",
                            "slug": "/manage/",
                            "name": "Manage"
                        },
                        {
                            "pageName": "orders",
                            "slug": "/orders/",
                            "name": "Orders"
                        }
                    ], status=status.HTTP_200_OK)
                elif user.status.id == 2:
                    return Response(data=[
                        {
                            "pageName": "admin",
                            "slug": "/admin/",
                            "name": "Admin"
                        }
                    ], status=status.HTTP_200_OK)
                elif user.status.id == 3:
                    return Response(data=[
                        {
                            "pageName": "manage",
                            "slug": "/manage/",
                            "name": "Manage"
                        },
                    ], status=status.HTTP_200_OK)
                elif user.status.id == 4:
                    return Response(data=[
                        {
                            "pageName": "orders",
                            "slug": "/orders/",
                            "name": "Orders"
                        }
                    ], status=status.HTTP_200_OK)
                elif user.status.id == 5 or user.status.id == 6:
                    return Response(data=[], status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


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

        payment = Payments.objects.filter(owner=self.request.user, number=number, date_to=date_to, cvv=cvv, name=name).exists()

        if payment:
            return Response(status=status.HTTP_409_CONFLICT)
        else:
            new_payment = Payments(owner=self.request.user, number=number, date_to=date_to, cvv=cvv, name=name)
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

        address = Address.objects.filter(owner=self.request.user, house_address=building_address, entrance=entrance, floor=floor, flat=flat).exists()

        if address:
            return Response(status=status.HTTP_409_CONFLICT)
        else:
            new_address = Address(owner=self.request.user, house_address=building_address, entrance=entrance, floor=floor, flat=flat)
            new_address.save()
            return Response(status=status.HTTP_201_CREATED)


class OrderView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        method = self.request.query_params.get("method")
        user = self.request.user

        if method == "for_complete":
            return Order.objects.filter(user=self.request.user, status=1)
        else:
            return Order.objects.filter(user=user)

    def post(self, request, *args, **kwargs):
        addressID = request.data.get('address')
        payment = request.data.get('payment')
        statusID = request.data.get('status')
        orderID = request.data.get('id')
        total = request.data.get('total')
        statusName = OrderStatus.objects.get(pk=statusID)

        if payment:
            order = Order.objects.get(pk=orderID, user=self.request.user)
            if payment == "Cash" or payment == "Card to courier":
                order.comment = f"Payment method: {payment}"
            else:
                paymentID = Payments.objects.get(number=payment, owner=self.request.user)
                order.payment = paymentID
            order.status = statusName
            order.save()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        else:
            address = Address.objects.get(pk=addressID, owner=self.request.user)
            exists = Order.objects.filter(user=self.request.user, status=statusName).exists()
            if exists:
                return Response(status=status.HTTP_303_SEE_OTHER)
            order = Order(user=self.request.user, address=address, total=total, status=statusName)
            order.save()
            return Response(status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ItemListCreate(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated,]

    def post(self, request, *args, **kwargs):
        method = self.request.data.get('method')
        cartItems = self.request.data.get('items')

        if len(cartItems) > 0:
            if method == "for_total":
                length = len(cartItems)
                total = 0

                for i in cartItems:
                    item = Item.objects.get(pk=i.get("item"))
                    total += item.price * i.get("quantity") + 0.99
                    total = float('{:.2f}'.format(total))
                    if i == cartItems[length - 1]:
                        return Response(status=status.HTTP_200_OK, data={"total": total})
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        itemID = self.request.query_params.get("id")

        if itemID:
            return Item.objects.filter(pk=itemID)
        else:
            return Item.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class CheckInCart(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated,]

    def list(self, request, *args, **kwargs):
        itemID = self.request.query_params.get("item")
        extra_status = self.request.query_params.get("extra")
        user = self.request.user

        if extra_status == "true":
            return Response(status=status.HTTP_200_OK)

        if itemID:
            isInCart = CartItem.objects.filter(item=itemID, owner=user).exists()

            if isInCart:
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class DeleteCartItem(generics.DestroyAPIView):
    """
    Deletes a cart item or clears all cart items for the authenticated user.

    Parameters:
    request (Request): The HTTP request object containing query parameters.
    *args: Additional positional arguments.
    **kwargs: Additional keyword arguments.

    Query Parameters:
    - id (str): The ID of the cart item to delete.
    - method (str): The method to use. If "clear", all cart items for the user will be deleted.

    Returns:
    Response:
    - HTTP 202 Accepted if the item(s) were successfully deleted.
    - HTTP 404 Not Found if the specified cart item does not exist.
    - HTTP 400 Bad Request if required query parameters are missing or invalid.
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated,]

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
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        user = self.request.user
        return CartItem.objects.filter(owner=user)

    def perform_create(self, serializer):
        method = self.request.query_params.get("method")

        if method == "addQuant":
            if serializer.is_valid():
                user = self.request.user
                item = CartItem.objects.get(owner=user, item_id=self.request.data["item"])
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
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        method = self.request.query_params.get('method')

        if method == "all":
            return Coupon.objects.all()

        return {"error": "Bad Request"}


    def post(self, request, *args, **kwargs):
        method = self.request.data.get("method")

        if method == "create":
            date = self.request.data.get('date_to')
            title = self.request.data.get('title')
            value = self.request.data.get('value')
            category = self.request.data.get('category')
            enabled_activations = self.request.data.get('ea')
            valid_to = datetime.strptime(date, "%Y-%m-%d").date()
            cat_obj = CouponCategory.objects.get(pk=category)

            check = Coupon.objects.filter(title=title).exists()
            if check:
                return Response(status=status.HTTP_409_CONFLICT)

            if title and value and cat_obj and enabled_activations and valid_to and check == False:
                new_coupon = Coupon(title=title, category=cat_obj, enabled_times=enabled_activations, value=value,
                                    valid_to=valid_to)
                new_coupon.save()
                return Response(status=status.HTTP_201_CREATED)

        if method == "apply":
            title = self.request.data.get('title')
            now = timezone.now().date()
            check = Coupon.objects.filter(title=title,valid_to__gt=now, is_valid=True, enabled_times__gt=0).exists()
            if check:
                coupon = Coupon.objects.get(title=title, valid_to__gt=now, is_valid=True, enabled_times__gt=0)
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
    permission_classes = [IsAuthenticated,]

    def post(self, request, *args, **kwargs):
        order_id = self.request.data.get('id')
        order_status = self.request.data.get('status')

        order = Order.objects.get(pk=order_id, user=self.request.user)
        status = OrderStatus.objects.get(pk=order_status)

        if order.status == status:
            new_status = OrderStatus.objects.get(pk=5)
            order.status = new_status
            order.save()
            return Response(status=200)
        else:
            return Response(status=400, data={"error": "No order with status " + status})


class RestaurantListCreate(generics.ListCreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Restaurant.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class SearchItems(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        query = self.request.query_params.get('q')
        return Item.objects.filter(name__icontains=query)


class CategoriesList(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Category.objects.all()


class RestaurantCategories(generics.ListCreateAPIView):
    serializer_class = RestaurantCatSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return RestaurantCat.objects.all()


class ItemDelete(generics.DestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Item.objects.all()
    

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny,]


class SearchView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated,]

    def get(self, request, *args, **kwargs):
        search = self.request.query_params.get('search', None)
        also = self.request.query_params.get('also', None)
        search_mode = self.request.query_params.get('search_mode')

        if search is not None:
            if also is not None:
                if search_mode == "food":
                    search1 = Item.objects.filter(Q(title__icontains=search) & Q(title__icontains=also) | Q(title__icontains=search) | Q(title__icontains=also))
                    serializer = ItemSerializer(search1, many=True)
                    return Response(serializer.data)
                else:
                    search1 = Restaurant.objects.filter(Q(name__icontains=search) & Q(name__icontains=also) | Q(name__icontains=search) | Q(name__icontains=also))
                    serializer = RestaurantSerializer(search1, many=True)
                    return Response(serializer.data)
            else:
                if search_mode == "food":
                    items = Item.objects.filter(Q(title__icontains=search))
                    serializer = ItemSerializer(items, many=True)
                    return Response(serializer.data)
                elif search_mode == "rests":
                    rests = Restaurant.objects.filter(Q(name__icontains=search))
                    serializer = RestaurantSerializer(rests, many=True)
                    return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


from .models import Category, Item  # Ensure Category and Item are imported

class FilterView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated,]

    def post(self, request, *args, **kwargs):
        data = self.request.data
        filters = data.get('filters')

        if filters:
            category_name = filters.get('category')
            min_cost, max_cost = filters.get('cost', [None, None])
            min_rating = filters.get('rating')

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
                serializer = ItemSerializer(items, many=True)
                return Response(status=status.HTTP_200_OK, data=serializer.data)
            else:
                return Response(status=status.HTTP_200_OK, data=[{"not_found": "no items"}])
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)