from .models import *
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', "phone", "status", "is_banned", "ban_reason"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', "title", "description", "price", "photo", "category"]

    def create(self, validated_data):
        item = Item.objects.create_item(**validated_data)
        return item


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', "name", "address", "rating", "category_id", "image"]

    def create(self, validated_data):
        restaurant = Restaurant.objects.create_item(**validated_data)
        return restaurant


class RestaurantCatSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantCat
        fields = ['id', "name"]

    def create(self, validated_data):
        restaurantcat = RestaurantCat.objects.create_item(**validated_data)
        return restaurantcat
