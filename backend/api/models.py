from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=120, unique=True)
    password = models.CharField(max_length=120)
    phone = models.CharField(max_length=120, blank=True)
    status = models.ForeignKey('Status', on_delete=models.PROTECT)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True)

    def __str__(self):
        return self.username


class Item(models.Model):
    title = models.CharField(max_length=120, unique=True)
    description = models.TextField()
    price = models.FloatField()
    photo = models.ImageField(upload_to='img')
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.FloatField()

    def __str__(self):
        return self.title


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Status(models.Model):
    name = models.CharField(max_length=120)

    def __str__(self):
        return self.name
