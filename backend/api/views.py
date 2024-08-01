from django.shortcuts import render
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
        return Response(status=status.HTTP_400_BAD_REQUEST)


class GetUser(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user.id
        return User.objects.filter(pk=user)


class ItemListCreate(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated,]

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
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated,]

    def destroy(self, request, *args, **kwargs):
        itemID = self.request.query_params.get("id")
        user = self.request.user

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
