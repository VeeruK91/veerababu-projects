from django.urls import path
from .views import (
    register_api, login_api, user_page_api,
    admin_page_api, admin_users_api, admin_providers_api,
    approve_user_api, approve_provider_api,
    user_details_api,
    provider_details_api,
    add_service_api,
    all_services_api,
    book_service_api,
    rating_api,
    provider_bookings_api,
    provider_ratings_api,
    user_booked_providers_api
)

urlpatterns = [
    # Authentication
    path("register/", register_api),
    path("login/", login_api),

    # User Details
    path("user/", user_page_api),
    path("userdetails/", user_details_api),
    path("providerdetails/", provider_details_api),

    # Admin
    path("admin/", admin_page_api),
    path("admin/users/", admin_users_api),
    path("admin/providers/", admin_providers_api),
    path("approve/user/", approve_user_api),
    path("approve/provider/", approve_provider_api),

    # Provider Add Service
    path("addservice/", add_service_api),

    # All Services for User Page
    path("services/", all_services_api),

    # Booking API 
    path("book/", book_service_api),

    # Ratings API 
    path("rating/", rating_api),
    path("provider-bookings/", provider_bookings_api),
    path("provider-ratings/", provider_ratings_api),
    path("booked-providers/", user_booked_providers_api),

]
