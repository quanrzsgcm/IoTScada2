from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class Site(models.Model):
    siteID = models.AutoField(primary_key=True)  # AutoField for primary key
    siteName = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.siteName

class SiteMeasurements(models.Model):
    siteMeasurementID = models.AutoField(primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)  # ForeignKey reference to Site model
    timestamp = models.DateTimeField()
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    production = models.DecimalField(max_digits=10, decimal_places=2)
    revenue = models.DecimalField(max_digits=10, decimal_places=2)
    irradiation = models.DecimalField(max_digits=5, decimal_places=2)
    activePower = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Measurement at {self.timestamp} for Site {self.site.siteName}"
class Inverter(models.Model):
    inverterID = models.AutoField(primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)  # ForeignKey reference to Site model
    manufacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serialNumber = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"Inverter {self.model} at Site {self.site.siteName}"

class InverterMeasurement(models.Model):
    measurementID = models.AutoField(primary_key=True)
    inverter = models.ForeignKey(Inverter, on_delete=models.CASCADE)  # ForeignKey reference to Inverter model
    timestamp = models.DateTimeField()
    capacity = models.DecimalField(max_digits=10, decimal_places=2)
    internalTemp = models.DecimalField(max_digits=5, decimal_places=2)
    inputPower = models.DecimalField(max_digits=10, decimal_places=2)
    gridFrequency = models.DecimalField(max_digits=5, decimal_places=2)
    powerFactor = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Measurement at {self.timestamp} for Inverter {self.inverter.model}"
    
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