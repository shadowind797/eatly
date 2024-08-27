from django.urls import path, include

from . import views

urlpatterns = [
    path('access/', views.GetAccess.as_view(), name='access'),
    path('user/', views.GetUser.as_view(), name='user'),
    path('user/change/', views.GetUser.as_view(), name='user-change'),

    path("login/google/", views.GoogleLoginApi.as_view(), name='google-login'),
    path("login/github/", views.GithubLoginApi.as_view(), name='github-login'),

    path('items/', views.ItemListCreate.as_view(), name='item-list'),
    path('items/top/', views.ItemListCreate.as_view(), name='item-list'),
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
    path("order/add/", views.OrderView.as_view(), name='order-create'),
    path("order/cancel/", views.CancelOrder.as_view(), name='order-cancel'),

    path("payment/", views.PaymentView.as_view(), name='payment'),
    path("payment/add/", views.PaymentView.as_view(), name='payment-create'),

    path("coupon/", views.CouponListCreate.as_view(), name='coupon-list'),
    path("coupon/add/", views.CouponListCreate.as_view(), name='coupon-create'),

    path("items/search/", views.SearchView.as_view(), name='search'),
    path("items/search/filters/", views.FilterView.as_view(), name='filter'),

    path("profile/orders", views.GetProfile.as_view(), name='all-user-orders'),
]
