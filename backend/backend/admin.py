from django.contrib import admin

class CustomAdminSite(admin.AdminSite):
    site_header = "Admin Panel"
    site_title = "Lawyers Appointment Scheduler"
    
admin_site = CustomAdminSite(name="myadmin")