from .models import Bookings, Category, Lawyer, Profile, Testimonial
from rest_framework import serializers


class LawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawyer
        fields = ["first_name", "last_name", "email", "password"]
        
class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawyer
        # fields = ["first_name", "last_name", "email", "other_names", "phone_number", "gender", "picture"]
        exclude = ["password", "email_verified"]
class UpdateLawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawyer
        fields = "__all__"
        
class CategorySerializer(serializers.ModelSerializer):
    lawyer = serializers.StringRelatedField()
    class Meta:
        model = Category
        fields = "__all__"
        
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
        exclude = ["testimony", "role","replied"]
        
class GetTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        exclude = ["role"]
        
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        exclude = ["created_at"]