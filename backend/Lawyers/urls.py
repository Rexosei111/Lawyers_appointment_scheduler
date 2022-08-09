from urllib import request
from django.urls import path

from .views import add_new_category, delete_category, delete_testimonial, get_bio, get_my_profile, register, request_testimonial, update_lawyer, login
urlpatterns = [
    path("auth/register", register, name="register_lawyer"),
    path("auth/login", login),
    # path("lawyers/me", update_lawyer),
    path("lawyers/me", get_my_profile),
    path("lawyers/me/category", add_new_category),
    path("lawyers/me/category/<int:pk>", delete_category),
    path("lawyers/me/bio", get_bio),
    path("lawyers/me/testimonials", request_testimonial),
    path("lawyers/me/testimonials/<int:pk>", delete_testimonial),
    
]