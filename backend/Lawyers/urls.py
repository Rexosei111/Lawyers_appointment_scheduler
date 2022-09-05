from urllib import request
from django.urls import path

from .views import BookingList, add_new_category, add_review, book_appointment, check_email, delete_category, delete_testimonial, get_bio, get_bookingList, get_lawyer, get_lawyer_cert, get_lawyer_reviews, get_lawyers, get_links, get_my_profile, get_reviews, get_socialLinks, get_summary, register, request_testimonial, respond_to_booking, update_lawyer, login, view_appointment, handle_files

urlpatterns = [
    path("auth/register", register, name="register_lawyer"),
    path("auth/login", login),
    # path("lawyers/me", update_lawyer),
    path("lawyers/me", get_my_profile),
    path("lawyers/me/files", handle_files),
    path("lawyers/me/category", add_new_category),
    path("lawyers/me/category/<int:pk>", delete_category),
    path("lawyers/me/bio", get_bio),
    path("lawyers/me/links", get_links),
    path("lawyers/me/reviews", get_reviews),
    path("lawyers/me/testimonials", request_testimonial),
    path("lawyers/me/testimonials/<int:pk>", delete_testimonial),
    path("lawyers", get_lawyers),
    path("lawyers/profile/<int:pk>", get_lawyer),
    path("lawyers/profile/<int:pk>/reviews", get_lawyer_reviews),
    path("lawyers/profile/<str:email>/certs", get_lawyer_cert),
    path("lawyers/<int:pk>/book", book_appointment),
    path("lawyers/me/booking", get_bookingList),
    path("lawyers/me/booking/<int:pk>", respond_to_booking),
    path("appointments/<int:pk>", view_appointment),
    path("lawyers/profile/<int:pk>/links", get_socialLinks),
    path("check", check_email),
    path("appointments/<int:pk>/reviews", add_review),
    path("summary", get_summary)

]
