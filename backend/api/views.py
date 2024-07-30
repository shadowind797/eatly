from django.shortcuts import render
from .models import *
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny


class ItemListCreate(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Item.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
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
