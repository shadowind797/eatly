from django.urls import path
from . import views

urlpatterns = [
    path('items/', views.ItemListCreate.as_view(), name='item-list'),
    path("items/delete/<int:pk>/", views.ItemDelete.as_view(), name='item-delete'),
    path("restaurants/", views.RestaurantListCreate.as_view(), name='restaurant-list'),
    path("restaurants/categories/", views.RestaurantCategories.as_view(), name='restaurant-cats-list'),
]
