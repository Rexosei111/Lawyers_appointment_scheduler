from functools import partial
from django.shortcuts import render

from .utils import authenticate, decode_token, get_tokens_for_user
from .serializers import LawyerSerializer, UpdateLawyerSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from .models import Lawyer
# Create your views here.

@api_view(["POST"])
def register(request):
    data = request.data
    password = make_password(data["password"])
    data = {**data, "password": password}
    print(data)
    serializer = LawyerSerializer(data=data)
    if(serializer.is_valid()):
        lawyer = serializer.save()
        print(lawyer.id)
        token = get_tokens_for_user(lawyer)
        return Response(status=200, data={"access": token})
    return Response(serializer.errors, status=400)    

@api_view(["PATCH"])
def update_lawyer(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
       lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    print(lawyer)
    serializer = UpdateLawyerSerializer(lawyer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)
    
