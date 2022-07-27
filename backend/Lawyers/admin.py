from django.contrib import admin
from .models import Category, Lawyer, Profile, Testimonial
from backend.admin import admin_site
# Register your models here.

class ProfileInline(admin.StackedInline):
    model = Profile
    
class CategoryInline(admin.TabularInline):
    model = Category
    extra = 0
    readonly_fields = ["type_of_lawyer", "certificate", "years_of_experience"]
    
class TestimonialInline(admin.StackedInline):
    model = Testimonial
    extra = 1
    readonly_fields = ["name", "email", "testimony", "company", "role"]
    
class CustomLawyerAdmin(admin.ModelAdmin):
    inlines = [ProfileInline, CategoryInline, TestimonialInline]
    
# admin_site.register()

admin_site.register(Lawyer, CustomLawyerAdmin)