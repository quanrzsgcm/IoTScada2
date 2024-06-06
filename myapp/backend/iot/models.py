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
    capacity = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    temp = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    irradiation = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    irradiance = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    m_yield = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    irradiance = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    production = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    powerratio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    revenue = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    activepower = models.DecimalField(max_digits=10, decimal_places=2, null=True)

    def __str__(self):
        return f"Measurement at {self.timestamp} for Site {self.site.siteName}"
    
class Inverter(models.Model):
    inverterID = models.AutoField(primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)  # ForeignKey reference to Site model
    manufacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serialNumber = models.CharField(max_length=100)

    def __str__(self):
        return f"Inverter {self.model} at Site {self.site.siteName}"
    
class InverterState(models.Model):
    inverter = models.ForeignKey(Inverter, on_delete=models.CASCADE)  # Foreign key to Inverter model
    state = models.CharField(max_length=50)
    timestamp = models.DateTimeField()
    starton = models.DateTimeField(null=True)
    duration = models.IntegerField(null=True)  # Duration in seconds

    def __str__(self):
        return f"State: {self.state} at {self.timestamp} for Inverter {self.inverter.inverterID}"

class InverterMeasurement(models.Model):
    measurementID = models.AutoField(primary_key=True)
    inverter = models.ForeignKey(Inverter, on_delete=models.CASCADE)  # ForeignKey reference to Inverter model
    timestamp = models.DateTimeField()
    meterReadTotalEnergy = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    activePower = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    inputPower = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    efficiency = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    internalTemp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gridFrequency = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    productionToday = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    yieldToday = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    reactivePower = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    apparentPower = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    powerFactor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Measurement at {self.timestamp} for Inverter {self.inverter.model}"  
    
class WeatherStation(models.Model):
    weatherstationid = models.AutoField(primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE) 
    manufacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serialNumber = models.CharField(max_length=100)

    def __str__(self):
        return f"Weather Station {self.model} at Site {self.site.siteName}"

class WeatherStationMeasurement(models.Model):
    measurementID = models.AutoField(primary_key=True)
    inverter = models.ForeignKey(Inverter, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    irradiation = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    irradiance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    temperature = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"Measurement at {self.timestamp} for Weather Station {self.inverter.model}"  
    

    
class InverterAlarm(models.Model):
    alarmID = models.AutoField(primary_key=True)
    inverter = models.ForeignKey(Inverter, on_delete=models.CASCADE)  # ForeignKey reference to Inverter model
    timestamp = models.DateTimeField()
    activePower = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    inputPower = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    internalTemp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration = models.IntegerField(null=True)  # Duration in minutes
    
    NORMAL = 'normal'
    WARNING = 'warning'
    FAULT = 'fault'

    THRESHOLD_CHOICES = [
        (NORMAL, 'Normal'),
        (WARNING, 'Warning'),
        (FAULT, 'Fault'),
    ]

    activePowerStatus = models.CharField(max_length=10, choices=THRESHOLD_CHOICES, default=NORMAL)
    inputPowerStatus = models.CharField(max_length=10, choices=THRESHOLD_CHOICES, default=NORMAL)
    internalTempStatus = models.CharField(max_length=10, choices=THRESHOLD_CHOICES, default=NORMAL)

    def __str__(self):
        return f"InverterAlarm {self.alarmID} for Inverter {self.inverter.name} at {self.timestamp}"
    

# class InverterAlarmPerventer(models.Model):
#     alarmID = models.AutoField(primary_key=True)
#     inverter = models.ForeignKey(Inverter, on_delete=models.CASCADE)  # ForeignKey reference to Inverter model
#     timestamp = models.DateTimeField()
#     latesttimestamp = models.DateTimeField()
#     activePower = models.CharField(max_digits=10, decimal_places=2, null=True, blank=True)
#     inputPower = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     internalTemp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     duration = models.IntegerField(null=True)  # Duration in minutes
    
#     SENDED = 'sended'
#     WAITING = 'waiting'

#     THRESHOLD_CHOICES = [
#         (SENDED, 'Sended'),
#         (WAITING, 'Waiting'),
#     ]

#     alarmStatus = models.CharField(max_length=10, choices=THRESHOLD_CHOICES, default=WAITING)

    
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