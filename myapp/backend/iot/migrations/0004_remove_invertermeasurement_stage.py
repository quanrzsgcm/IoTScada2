# Generated by Django 4.2.6 on 2024-06-03 14:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iot', '0003_remove_inverter_location'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invertermeasurement',
            name='stage',
        ),
    ]
