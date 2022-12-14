from tabnanny import verbose
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
# Create your models here.

GENDERS = (("MALE", "Male"), ("FEMALE", "Female"))


class Lawyer(models.Model):
    email = models.EmailField(verbose_name="Email",
                              max_length=254, unique=True)
    email_verified = models.BooleanField(default=False, editable=False)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    other_names = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDERS)
    phone_number = PhoneNumberField(null=True, blank=True)
    password = models.CharField(blank=True, null=True, max_length=500)
    picture = models.URLField(blank=True, null=True)
    biography = models.TextField(null=True, blank=True)
    location = models.CharField(null=True, blank=True, max_length=50)

    def type_of_lawyer(self):
        category = Category.objects.filter(
            lawyer__email=self.email, verified=True).first()
        return category

    def __str__(self):
        return self.email


LINKS = (
    ("Facebook", "Facebook"),
    ("Twitter", "Twitter"),
    ("Instagram", "Instagram"),
    ("LinkedIn", "LinkedIn")
)


class SocialLinks(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
    link = models.URLField()
    name = models.CharField(max_length=20, choices=LINKS)

    def __str__(self):
        return self.name


class Profile(models.Model):
    lawyer = models.OneToOneField(Lawyer, to_field="email", limit_choices_to={
                                  "email_verified": True}, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, blank=True, null=True)
    Biography = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.lawyer.email


types_of_lawyers = (
    ("Bankruptcy", "Bankruptcy"),
    ("Business", "Business"),
    ("Constitutional", "Constitutional"),
    ("Criminal Defense", "Criminal Defense"),
    ("Employment and Labor", "Employment and Labor"),
    ("Entertainment", "Entertainment"),
    ("Estate Planning", "Estate Planning"),
    ("Family", "Family"),
    ("Immigration", "Immigration"),
    ("Intellectual Property", "Intellectual Property"),
    ("Personal Injury", "Personal Injury"),
    ("Tax", "Tax")
)


class Category(models.Model):
    lawyer = models.ForeignKey(
        Lawyer, on_delete=models.CASCADE, to_field="email")
    type_of_lawyer = models.CharField(
        max_length=50, choices=types_of_lawyers, verbose_name="type_of_lawyer")
    certificate = models.URLField()
    years_of_experience = models.PositiveIntegerField(null=True, blank=True)
    verified = models.BooleanField(default=False, null=True)

    class Meta:
        verbose_name_plural = "types"

    def __str__(self):
        return f"{self.type_of_lawyer}"


class Testimonial(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
    email = models.EmailField()
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=200, null=True, blank=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    testimony = models.TextField(blank=True, null=True)
    date_created = models.DateField(auto_now_add=True)
    replied = models.BooleanField(default=False)

    def __str__(self):
        return self.name


STATUS = [
    ("Pending", "Pending"),
    ("Accepted", "Accepted"),
    ("Declined", "Declined"),
    ("Completed", "Completed")
]


class Bookings(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    work_at = models.CharField(null=True, blank=True, max_length=100)
    location = models.CharField(max_length=100)
    booking_date = models.DateField()
    appointment_time = models.TimeField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS, default="Pending")

    def __str__(self):
        return self.name


class Reviews(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
    appointment = models.ForeignKey(
        Bookings, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.PositiveIntegerField(null=True, blank=True)
    review = models.TextField()
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

class File(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    url = models.URLField()
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title
