# Generated by Django 4.2.6 on 2024-05-23 08:36

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('iot', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Connection',
            fields=[
                ('connection_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('connection_type', models.CharField(max_length=100)),
                ('uri', models.CharField(max_length=255)),
                ('source_addresses', models.CharField(max_length=255)),
                ('site', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='iot.site')),
            ],
        ),
    ]
