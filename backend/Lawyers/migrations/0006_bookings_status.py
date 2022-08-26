# Generated by Django 4.0.6 on 2022-08-21 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Lawyers', '0005_lawyer_biography_lawyer_location_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookings',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Declined', 'Declined')], default='Accepted', max_length=10),
        ),
    ]