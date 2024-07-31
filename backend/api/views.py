from django.shortcuts import render
from .models import *
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny


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
