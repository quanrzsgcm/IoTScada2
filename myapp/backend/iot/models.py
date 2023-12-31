from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class PowerMeterData(models.Model):
    meter_id = models.CharField(max_length=10, null=True)
    timestamp = models.DateTimeField() # Timestamp with time zone
    power = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    voltage = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    current = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    energy = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"Power Meter Data - ID: {self.id}, Timestamp: {self.timestamp}"

class HourlyEnergy(models.Model):
    timestamp = models.DateTimeField(unique=True)
    energy = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f'{self.timestamp} - {self.energy} kWh'
    
class DailyEnergySum(models.Model):
    total_energy = models.DecimalField(max_digits=10, decimal_places=2)
    end_of_day = models.DateTimeField(unique=True)

    def __str__(self):
        return f'Daily Energy Sum - {self.end_of_day} - {self.total_energy} kWh'
    
class MonthlyEnergySum(models.Model):
    total_energy = models.DecimalField(max_digits=10, decimal_places=2)
    end_of_month = models.DateField(unique=True)  # Use DateField

    def __str__(self):
        return f'Monthly Energy Sum - {self.month} - {self.end_of_month} kWh'