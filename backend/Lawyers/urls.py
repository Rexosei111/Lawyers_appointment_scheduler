from django.urls import path

from .views import register, update_lawyer
urlpatterns = [
    path("auth/register", register, name="register_lawyer"),
    path("lawyers/me", update_lawyer)
]