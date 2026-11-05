from django.urls import path
from .views import*

urlpatterns = [
    # Authentication
    path("register/", register_api),
    path("login/", login_api),

    # User Details
    path("user/", user_page_api),
    path("userdetails/", user_details_api),
    path("staffdetails/", staff_details_api),

    # Admin
    path("admin/", admin_page_api),
    path("admin/users/",admin_users_api),
    path("admin/staff/", admin_staff_api),
    path("approve/user/", approve_user_api),
    path("approve/staff/", approve_staff_api),

    path("add-product/", add_product_api),
    path("products/", products_api),
    path("update-product/", update_product_api),
    path("delete-product/", delete_product_api),
    path("all-sales/", all_sales_api),
    
    path("products/sell/", sell_product_api),
    path("sales/staff/", staff_sales_api),
    path("sales/user/", user_sales_api),

]
