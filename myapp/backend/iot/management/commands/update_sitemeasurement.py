# myapp/management/commands/mqtt_subscriber.py
from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import json
from iot.models import InverterMeasurement, Inverter, Site, SiteMeasurements
import queue
import threading
import time
from django.utils import timezone
from django.db.models import Max, Sum


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # # Get the current timestamp
        # current_timestamp = timezone.now()
        # print("Current timestamp:", current_timestamp)

        # # Get the latest measurement for each inverter
        # latest_measurements = (
        #     InverterMeasurement.objects
        #     .values('inverter')
        #     .annotate(latest_timestamp=Max('timestamp'))
        #     .values('inverter', 'latest_timestamp')
        # )

        # # Now, sum up the productionToday values for these latest measurements
        # total_production_today = (
        #     InverterMeasurement.objects
        #     .filter(inverter__in=[m['inverter'] for m in latest_measurements], timestamp__in=[m['latest_timestamp'] for m in latest_measurements])
        #     .aggregate(total_production=Sum('productionToday'))
        # )['total_production']

        # print("Total production today:", total_production_today)


        # Step 1: Annotate each inverter with the latest timestamp of its measurements
        # latest_measurements = InverterMeasurement.objects.values('inverter').annotate(latest_timestamp=Max('timestamp'))
        latest_measurements = InverterMeasurement.objects.values('inverter')
        print(latest_measurements)

        # # Step 2: Join with the original InverterMeasurement to get the full records of these latest measurements
        # latest_measurements = InverterMeasurement.objects.filter(
        #     timestamp__in=[lm['latest_timestamp'] for lm in latest_measurements]
        # )

        # # Step 3: Aggregate the sum of meterReadTotalEnergy from these latest measurements
        # total_energy_sum = latest_measurements.aggregate(Sum('meterReadTotalEnergy'))['meterReadTotalEnergy__sum']

        # print(total_energy_sum)
