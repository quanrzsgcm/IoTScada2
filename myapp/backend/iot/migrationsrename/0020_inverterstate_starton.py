# Generated by Django 4.2.6 on 2024-05-23 04:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iot', '0019_inverterstate'),
    ]

    operations = [
        migrations.AddField(
            model_name='inverterstate',
            name='starton',
            field=models.DateTimeField(null=True),
        ),
    ]
