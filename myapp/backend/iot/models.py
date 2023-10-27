from django.db import models

# Create your models here.
class PowerMeterData(models.Model):
    meter_id = models.CharField(max_length=10, null=True)
    timestamp = models.DateTimeField() # Timestamp with time zone
    power = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    voltage = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    current = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"Power Meter Data - ID: {self.id}, Timestamp: {self.timestamp}"
