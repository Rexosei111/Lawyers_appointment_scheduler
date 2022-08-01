from django.contrib import admin
from .models import Category, Lawyer, Profile, Testimonial
from backend.admin import admin_site
# Register your models here.

class ProfileInline(admin.StackedInline):
    model = Profile
    
class CategoryInline(admin.TabularInline):
    model = Category
    extra = 0
    readonly_fields = ["certificate", "years_of_experience"]
    
class TestimonialInline(admin.StackedInline):
    model = Testimonial
    extra = 1
    readonly_fields = ["name", "email", "company", "role", "testimony"]
    
class CustomLawyerAdmin(admin.ModelAdmin):
    inlines = [ProfileInline, CategoryInline, TestimonialInline]
    list_display = ["email", "first_name", "type_of_lawyer"]
    list_filter = ["email", "first_name"]
    search_fields =  ["email"]
    
# admin_site.register()

admin_site.register(Lawyer, CustomLawyerAdmin)