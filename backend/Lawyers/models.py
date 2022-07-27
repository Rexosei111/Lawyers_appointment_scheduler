from tabnanny import verbose
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
# Create your models here.

GENDERS = (("MALE", "Male"), ("FEMALE", "Female"))

class Lawyer(models.Model):
    email = models.EmailField(verbose_name="Email", max_length=254, unique=True)
    email_verified = models.BooleanField(default=False, editable=False)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    other_names = models.CharField(max_length=100)
    gender = models.CharField(max_length=6, choices=GENDERS, null=True, blank=True)
    phone_number = PhoneNumberField(null=True, blank=True)
    password = models.CharField(blank=True, null=True, editable=False, max_length=300)
    picture = models.URLField(blank=True, null=True)
    
    
    def __str__(self):
        return self.email
    

class Profile(models.Model):
    lawyer = models.OneToOneField(Lawyer, to_field="email", limit_choices_to={"email_verified": True}, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, blank=True, null=True)
    Biography = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.lawyer.email
    

types_of_lawyers = (
    ("Bankruptcy Lawyer", "Bankruptcy Lawyer"),
    ("Business Lawyer", "Business Lawyer"),
("Constitutional Lawyer", "Constitutional Lawyer"),
("Criminal Defense Lawyer", "Criminal Defense Lawyer"),
("Employment and Labor Lawyer", "Employment and Labor Lawyer"),
("Entertainment Lawyer", "Entertainment Lawyer"),
("Estate Planning Lawyer", "Entertainment Lawyer"),
("Family Lawyer", "Family Lawyer"),
("Immigration Lawyer", "Immigration Lawyer"),
("Intellectual Property", "Intellectual Property"),
("Personal Injury Lawyer", "Personal Injury Lawyer"),
("Tax Lawyer", "Tax Lawyer")


)

class Category(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE, to_field="email")
    type_of_lawyer = models.CharField(max_length=50, choices=types_of_lawyers, verbose_name="type_of_lawyer")
    certificate = models.URLField()
    years_of_experience = models.PositiveIntegerField(null=True, blank=True)
    verified = models.BooleanField(default=False, null=True)
    
    class Meta:
        verbose_name_plural = "types"
        
    def __str__(self):
        return f"{self.lawyer} - {self.type_of_lawyer}"
    

class Testimonial(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
    email = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=200, null=True, blank=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    testimony = models.TextField()
    date_created = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    