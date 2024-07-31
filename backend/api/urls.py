from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.GetUser.as_view(), name='user'),
    path('items/', views.ItemListCreate.as_view(), name='item-list'),
    path('items/category/', views.CategoriesList.as_view(), name='item-category-list'),
    path('items/cart/', views.CartItemListCreate.as_view(), name='item-cart-list'),
    path('items/cart/add', views.CartItemListCreate.as_view(), name='item-cart-list'),
    path("items/delete/<int:pk>/", views.ItemDelete.as_view(), name='item-delete'),
    path("restaurants/", views.RestaurantListCreate.as_view(), name='restaurant-list'),
    path("restaurants/categories/", views.RestaurantCategories.as_view(), name='restaurant-cats-list'),
]
