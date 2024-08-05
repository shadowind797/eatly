from django.urls import path
from . import views

urlpatterns = [
    path('access/', views.GetAccess.as_view(), name='access'),
    path('user/', views.GetUser.as_view(), name='user'),
    path('user/change/', views.GetUser.as_view(), name='user-change'),

    path('items/', views.ItemListCreate.as_view(), name='item-list'),
    path('items/category/', views.CategoriesList.as_view(), name='item-category-list'),

    path('items/cart/', views.CartItemListCreate.as_view(), name='item-cart-list'),
    path('items/cart/add', views.CartItemListCreate.as_view(), name='item-cart-list'),
    path('items/cart/delete', views.DeleteCartItem.as_view(), name='item-cart-list'),
    path('items/cart/check', views.CheckInCart.as_view(), name='item-cart-list'),

    path("items/delete/<int:pk>/", views.ItemDelete.as_view(), name='item-delete'),

    path("restaurants/", views.RestaurantListCreate.as_view(), name='restaurant-list'),
    path("restaurants/categories/", views.RestaurantCategories.as_view(), name='restaurant-cats-list'),

    path("address/", views.AddressList.as_view(), name='address-list'),
    path("address/add/", views.AddressList.as_view(), name='restaurant-cats-list'),

    path("order/", views.OrderView.as_view(), name='order'),
    path("order/add/", views.OrderView.as_view(), name='order'),

    path("payment/", views.PaymentView.as_view(), name='order'),
    path("payment/add/", views.PaymentView.as_view(), name='order'),
]
