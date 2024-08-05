from .models import *
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """
    Create a new User instance using the validated data.

    Parameters:
    validated_data (dict): The validated data containing user information.

    Returns:
    User: The newly created User instance.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', "phone", "status", "is_banned", "ban_reason", "first_name"]
        extra_kwargs = {"password": {"write_only": True}, "status": {"read_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "house_address", "entrance", "floor", "flat"]

    def create(self, validated_data):
        address = Address.objects.create_address(**validated_data)
        return address


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payments
        fields = "__all__"
        extra_kwargs = {"cvv": {"write_only": True}, "date_to": {"read_only": True}}

    def create(self, validated_data):
        payment = Payments.objects.create_payments(**validated_data)
        return payment


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "status", "total", "payment", "address"]

    def create(self, validated_data):
        order = Order.objects.create_order(**validated_data)
        return order


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', "title", "description", "price", "photo", "category", "rating"]


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', "item", "quantity"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', "name"]


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', "name", "address", "rating", "category_id", "image"]


class RestaurantCatSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantCat
        fields = ['id', "name"]


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ("id", "title", "valid_to", "value", "enabled_times", "category")

    def create(self, validated_data):
        coupon = Coupon.objects.create_coupon(**validated_data)
        return coupon


class CouponCatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponCategory
        fields = "__all__"
