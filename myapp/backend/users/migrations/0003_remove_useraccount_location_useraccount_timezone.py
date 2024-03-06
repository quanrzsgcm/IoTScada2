# Generated by Django 4.2.6 on 2023-12-18 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_useraccount_location'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useraccount',
            name='location',
        ),
        migrations.AddField(
            model_name='useraccount',
            name='timezone',
            field=models.CharField(default='Asia/Ho_Chi_Minh', max_length=255),
        ),
    ]