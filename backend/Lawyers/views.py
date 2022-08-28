from functools import partial
from http.client import ResponseNotReady
from django.shortcuts import render
from rest_framework import generics, filters
from .utils import authenticate, decode_token, get_date, get_tokens_for_user
from .serializers import AppointmentSerializer, BookingSerializer, CategorySerializer, GetTestimonialSerializer, LawyerSerializer, PersonalInfoSerializer, SocialLinkSerializer, TestimonialSerializer, UpdateLawyerSerializer, loginSerializer, profileSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.response import Response
from .models import Bookings, Category, Lawyer, Profile, SocialLinks, Testimonial
from django.db.models import Q
from django.core.mail import send_mail
from .utils import ses_client, is_email_verified
# Create your views here.


@api_view(["POST"])
def register(request):
    data = request.data
    password = make_password(data["password"])
    data = {**data, "password": password}
    serializer = LawyerSerializer(data=data)
    if (serializer.is_valid()):
        lawyer = serializer.save()
        response = ses_client.verify_email_address(EmailAddress=lawyer.email)
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
    serializer = UpdateLawyerSerializer(
        lawyer, data=request.data, partial=True)
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
        serializer = CategorySerializer(
            category, data=request.data, partial=True)
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
    if (certificate.lawyer.email != lawyer.email):
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
        serializer = profileSerializer(
            profile, data=request.data, partial=True)
        if (serializer.is_valid()):
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
            if (is_email_verified()):
                lawyer.email_verified = True
                lawyer.save(updated_fields=["email_verified"])
                token = get_tokens_for_user(lawyer)
                serializer = PersonalInfoSerializer(lawyer)
                return Response(status=200, data={"access": token, **serializer.data})
            else:
                return Response(status=200, data={"message": "verify your email address"})
        else:
            return Response(status=401, data={"message": "Invalid Credentials"})
    return Response(serializer.errors, status=400)


@api_view(["GET", "PATCH"])
def get_my_profile(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
        lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)
    if request.method == "GET":
        serializer = PersonalInfoSerializer(lawyer)
        return Response(serializer.data)
    if request.method == "PATCH":
        serializer = UpdateLawyerSerializer(
            lawyer, data=request.data, partial=True)
        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


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
        testimonials = Testimonial.objects.filter(
            lawyer__email=lawyer.email, replied=True)
        serlz = GetTestimonialSerializer(testimonials, many=True)
        return Response(serlz.data)
    serializer = TestimonialSerializer(
        data={**request.data, "lawyer": lawyer_data["id"]})
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
    if (testimonial.lawyer.email != lawyer.email):
        return Response(status=403)
    testimonial.delete()
    return Response(status=200)


@api_view(["GET"])
def get_lawyers(request):
    queryset = Lawyer.objects.filter(category__verified=True)
    search_query = request.query_params.get("search")
    if (search_query is not None):
        search_query = search_query.strip()
        print(queryset)
        queryset = queryset.filter(Q(first_name__icontains=search_query) | Q(
            last_name__icontains=search_query) | Q(other_names__icontains=search_query))
        print(queryset)
        filter = request.query_params.get("filter", None)
        if (filter):
            queryset = queryset.filter(
                category__type_of_lawyer__icontains=filter)

    serializer = PersonalInfoSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_lawyer(request, pk):
    try:
        lawyer = Lawyer.objects.get(pk=pk)
    except Lawyer.DoesNotExist:
        return Response(status=404, data={"message": "lawyer not found"})
    serializer = PersonalInfoSerializer(lawyer)
    return Response(serializer.data)


@api_view(["GET"])
def get_lawyer_cert(request, email):
    try:
        certs = Category.objects.filter(lawyer__email=email, verified=True)
    except:
        return Response(status=404)
    serializer = CategorySerializer(certs, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def book_appointment(request, pk):
    try:
        lawyer = Lawyer.objects.get(pk=pk)
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)

    data = request.data
    booking = Bookings(lawyer=lawyer)
    booking_date = get_date(data["booking_date"])
    serializer = BookingSerializer(instance=booking, data={
                                   **data, "booking_date": booking_date}, partial=True)
    if serializer.is_valid():
        appointment = serializer.save()
        response = send_mail("New Appointment Booking",
                             f"{booking.name} is booking an appointment with you. Click on the link to view full details of this appointment. http://localhost:3000/lawyers/me/bookingss", "kyeisamuel931@gmail.com", [lawyer.email])
        response2 = send_mail("You Appointment",
                              f"You booked an appointment with Attorney, {lawyer.first_name} {lawyer.last_name}. Click on this link to check the status of your appointment. http://localhost:3000/appointments/{appointment.id}")
        print(response, response2)
        return Response(status=200, data={"link": f"http://localhost:3000/appointments/{appointment.id}"})
    return Response(serializer.errors)


@api_view(["GET"])
def get_bookingList(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
        lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)

    queryset = Bookings.objects.filter(
        lawyer__email=lawyer.email).order_by("-created_at")
    serializer = BookingSerializer(queryset, many=True)
    return Response(serializer.data)


class BookingList(generics.ListAPIView):
    serializer_class = BookingSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "email", "status"]

    def get_queryset(self):
        queryset = Bookings.objects.filter(
            lawyer__email=self.kwargs.get("email")).order_by("-created_at")
        return queryset


@api_view(["POST", "PATCH"])
def respond_to_booking(request, pk):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
        lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)

    booking = Bookings.objects.get(pk=pk)
    note = request.data["note"]
    if request.method == "POST":
        if (request.data["accepted"] is True):
            booking_time = request.data["time"]
            print(booking_time)
            if booking_time is None:
                return Response("You must set Appointment time", status=400)
            booking.status = "Accepted"
            booking.appointment_time = booking_time
            booking.save()
            bookingUpdate = Bookings.objects.get(pk=pk)
            return Response(status=200, data={"time": bookingUpdate.appointment_time})

        if (request.data["accepted"] is False):
            booking.status = "Declined"
            booking.save()
            return Response(status=200)

    if request.method == "PATCH":
        if (request.data["Cancel"] is True):
            booking.status = "Declined"
            booking.appointment_time = None
            booking.save()
            return Response(status=200)

        booking_time = request.data["time"]
        if booking_time is None:
            return Response("You must set Appointment time", status=400)
        booking.appointment_time = booking_time
        booking.save()
        bookingUpdate = Bookings.objects.get(pk=pk)
        return Response(status=200, data={"time": bookingUpdate.appointment_time})


@api_view(["GET", "DELETE", "PATCH"])
def view_appointment(request, pk):
    try:
        booking = Bookings.objects.get(pk=pk)
    except Bookings.DoesNotExist:
        return Response(status=404)

    if request.method == "GET":
        serializer = AppointmentSerializer(booking)
        print(serializer.data)
        return Response(serializer.data)
    if request.method == "DELETE":
        booking.delete()
        return Response(status=200)
    if request.method == "PATCH":
        booking.status = "Completed"
        booking.save()
        return Response(status=200)


@api_view(["GET", "POST", "DELETE"])
def get_links(request):
    lawyer_data = authenticate(request=request)
    if (lawyer_data is None):
        return Response(status=401, data={"message": "token has expired"})
    try:
        lawyer = Lawyer.objects.get(email=lawyer_data["email"])
    except Lawyer.DoesNotExist:
        return Response({"message": "Lawyer not found"}, status=404)

    if request.method == "GET":
        try:
            socialLinks = SocialLinks.objects.filter(lawyer__pk=lawyer.pk)
        except SocialLinks.DoesNotExist:
            return Response(status=404)
        serializer = SocialLinkSerializer(socialLinks, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        link = SocialLinks(lawyer=lawyer)
        serializer = SocialLinkSerializer(
            link, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    if request.method == "DELETE":
        query = request.query_params.get("linkId")
        link = SocialLinks.objects.get(pk=int(query))
        link.delete()
        return Response(status=200)


@api_view(["GET"])
def get_socialLinks(request, pk):
    try:
        socialLinks = SocialLinks.objects.filter(lawyer__pk=pk)
    except SocialLinks.DoesNotExist:
        return Response(status=404)
    serializer = SocialLinkSerializer(socialLinks, many=True)
    return Response(serializer.data)
