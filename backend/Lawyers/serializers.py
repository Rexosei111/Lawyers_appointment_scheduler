from .models import Lawyer
from rest_framework import serializers


class LawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawyer
        fields = ["first_name", "last_name", "email", "password"]
        
class UpdateLawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawyer
        fields = "__all__"