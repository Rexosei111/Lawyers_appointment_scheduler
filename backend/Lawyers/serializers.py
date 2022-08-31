from dataclasses import fields
from .models import Bookings, Category, Lawyer, Profile, Reviews, SocialLinks, Testimonial
from rest_framework import serializers


class LawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawyer
        fields = ["first_name", "last_name", "email", "password"]


class CategorySerializer(serializers.ModelSerializer):
    lawyer = serializers.StringRelatedField()

    class Meta:
        model = Category
        fields = "__all__"


class PersonalInfoSerializer(serializers.ModelSerializer):
    category_set = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Lawyer
        # fields = ["first_name", "last_name", "email", "other_names", "phone_number", "gender", "picture"]
        exclude = ["password", "email_verified"]


class UpdateLawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawyer
        exclude = ["password", "email_verified"]


class loginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class profileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        exclude = ["testimony", "role", "replied"]


class GetTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        exclude = ["role"]


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        exclude = ["appointment_time"]

class GetBookingSerializer(serializers.ModelSerializer):
     class Meta:
        model = Bookings
        fields = "__all__"
class AppointmentSerializer(serializers.ModelSerializer):
    lawyer = PersonalInfoSerializer()

    class Meta:
        model = Bookings
        fields = "__all__"


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLinks
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = "__all__"
