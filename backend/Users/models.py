from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager

GENDERS = (("MALE", "Male"), ("FEMALE", "Female"))

class User(AbstractUser):
    username = None
    email = models.EmailField(verbose_name="Email Address", unique=True)
    phone_number = models.CharField(max_length=12)
    gender = models.CharField(max_length=6, choices=GENDERS, null=True, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone_number"]

    objects = UserManager()

    class Meta:
        pass

    def __str__(self):
        return self.email
