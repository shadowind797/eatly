from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=120, unique=True)
    password = models.CharField(max_length=120)
    phone = models.CharField(max_length=120, blank=True)
    status = models.ForeignKey('Status', on_delete=models.PROTECT, default=5)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True)
    passwd_change_link = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.username


class Item(models.Model):
    title = models.CharField(max_length=120, unique=True)
    description = models.TextField()
    price = models.FloatField()
    photo = models.ImageField(upload_to='img')
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)
    restaurant = models.ForeignKey('Restaurant', on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.FloatField()

    def __str__(self):
        return self.title


class Restaurant(models.Model):
    name = models.CharField(max_length=120, unique=True)
    address = models.CharField(max_length=120)
    rating = models.FloatField()
    image = models.ImageField(upload_to='img/rests', null=True)
    category = models.ForeignKey('RestaurantCat', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class Address(models.Model):
    house_address = models.CharField(max_length=120)
    entrance = models.CharField(max_length=120)
    floor = models.CharField(max_length=120)
    flat = models.CharField(max_length=120)
    owner = models.ForeignKey('User', on_delete=models.CASCADE)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.house_address


class Order(models.Model):
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    payment = models.ForeignKey('Payments', on_delete=models.SET_NULL, null=True)
    address = models.ForeignKey('Address', on_delete=models.SET_NULL, null=True)
    total = models.FloatField()
    status = models.ForeignKey('OrderStatus', on_delete=models.SET_NULL, null=True)
    restaurant = models.ForeignKey('Restaurant', on_delete=models.SET_NULL, null=True)
    coupon = models.ForeignKey('Coupon', on_delete=models.SET_NULL, null=True)
    comment = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user


class OrderStatus(models.Model):
    name = models.CharField(max_length=120, unique=True)


class Coupon(models.Model):
    title = models.CharField(max_length=120, unique=True)
    valid_from = models.DateField(auto_now_add=True)
    valid_to = models.DateField()
    is_valid = models.BooleanField(default=True)
    value = models.FloatField()
    times_activated = models.IntegerField(default=0)
    enabled_times = models.IntegerField()
    category = models.ForeignKey('CouponCategory', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class CouponCategory(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Payments(models.Model):
    number = models.CharField(max_length=120, unique=True)
    date_to = models.CharField(max_length=100)
    cvv = models.IntegerField()
    owner = models.ForeignKey('User', on_delete=models.CASCADE)
    active = models.BooleanField(default=False)
    name = models.CharField(max_length=120, default="")

    def __str__(self):
        return self.number


class CartItem(models.Model):
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    owner = models.ForeignKey('User', on_delete=models.CASCADE)

    def __str__(self):
        return self.item.title


class Reviews(models.Model):
    author = models.ForeignKey('User', on_delete=models.CASCADE)
    time = models.CharField(max_length=120)
    text = models.TextField()
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.username


class RestaurantCat(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Status(models.Model):
    name = models.CharField(max_length=120)

    def __str__(self):
        return self.name
