from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    password = models.CharField(max_length=120)
    phone = models.CharField(max_length=120)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True)
