# Generated by Django 4.2.6 on 2024-05-23 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iot', '0020_inverterstate_starton'),
    ]

    operations = [
        migrations.AddField(
            model_name='inverterstate',
            name='duration',
            field=models.DateTimeField(null=True),
        ),
    ]