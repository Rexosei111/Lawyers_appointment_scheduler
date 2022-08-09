from functools import partial
from django.shortcuts import render

from .utils import authenticate, decode_token, get_tokens_for_user
from .serializers import CategorySerializer, GetTestimonialSerializer, LawyerSerializer, PersonalInfoSerializer, TestimonialSerializer, UpdateLawyerSerializer, loginSerializer, profileSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.response import Response
from .models import Category, Lawyer, Profile, Testimonial
# Create your views here.

@api_view(["POST"])
def register(request):
    data = request.data
    password = make_password(data["password"])
    data = {**data, "password": password}
    serializer = LawyerSerializer(data=data)
    if(serializer.is_valid()):
        lawyer = serializer.save()
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
    
@api_view(["GET", "POST"])
def add_new_category(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
       lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    
    if request.method == "POST":
        category = Category(lawyer=lawyer)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    if request.method == "GET":
        certificates = Category.objects.filter(lawyer__email=lawyer.email)
        serializer = CategorySerializer(certificates, many=True)
        return Response(serializer.data)
        # return Response(serializer.errors, status=400)
        

@api_view(["DELETE"])
def delete_category(request, pk):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
       lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    
    certificate = Category.objects.get(pk=pk)
    if(certificate.lawyer.email != lawyer.email):
        return Response(status=409)
    certificate.delete()
    return Response(status=200)


@api_view(["GET", "POST"])
def get_bio(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
       lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    
    profile, rest = Profile.objects.get_or_create(lawyer=lawyer)
    if request.method == "GET":
        return Response(data={"Bio": profile.Biography})
    if request.method == "POST":
        print(request.data)
        serializer = profileSerializer(profile, data=request.data, partial=True)
        if(serializer.is_valid()):
            serializer.save()
            return Response({"Bio": serializer.data["Biography"]})
        return Response(serializer.errors, status=400)


@api_view(["POST"])
def login(request):
    data = request.data
    serializer = loginSerializer(data=data)
    if serializer.is_valid():
        lawyer = Lawyer.objects.get(email=data["email"])
        password_checked = check_password(data["password"], lawyer.password)
        if password_checked:
            token = get_tokens_for_user(lawyer)
            return Response(status=200, data={"access": token})
        else:
            return Response(status=401, data={"message": "Invalid Credentials"})
    return Response(serializer.errors, status=400)    
        
@api_view(["GET"])
def get_my_profile(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
       lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    serializer = PersonalInfoSerializer(lawyer)
    print(serializer.data)
    return Response(serializer.data)

@api_view(["GET", "POST", "PATCH"])
def request_testimonial(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
       lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    if request.method == "GET":
        testimonials = Testimonial.objects.filter(lawyer__email = lawyer.email, replied=True)
        serlz = GetTestimonialSerializer(testimonials, many=True)
        return Response(serlz.data)
    serializer = TestimonialSerializer(data={**request.data, "lawyer": lawyer_data["id"]})
    if request.method == "PATCH":
        serializer.instance = lawyer
        serializer.partial = True
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(["DELETE"])
def delete_testimonial(request, pk):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
       lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    
    testimonial = Testimonial.objects.get(pk=pk)
    if(testimonial.lawyer.email != lawyer.email):
        return Response(status=403)
    testimonial.delete()
    return Response(status=200)