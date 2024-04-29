# myapp/management/commands/mqtt_subscriber.py
from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import json
from iot.models import InverterMeasurement, Inverter

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        def on_connect(client, userdata, flags, reason_code, properties):
            print("Connected with result code "+str(reason_code))
            client.subscribe("chondaitopicnaodo")

        def on_message(client, userdata, msg):
            print(msg.topic + " " + str(msg.payload.decode()))
            try:
                payload = json.loads(msg.payload.decode())
                topic = payload["topic"]
                parts = topic.split('/')
                thing = parts[0]
                if thing == 'my.inverter':
                    inverter_id = parts[1]  # This will give 'inv1'
                    inverter_id = int(inverter_id[3:])
                    inv_instance = Inverter.objects.get(inverterID=inverter_id)
                    if "value" in payload:
                        value = payload["value"]
                        # Create InverterMeasurement object and save it to the database
                        InverterMeasurement.objects.create(
                            inverter=inv_instance,
                            timestamp=payload["timestamp"],
                            meterReadTotalEnergy=value.get("meterReadTotalEnergy"),
                            activePower=value.get("activePower"),
                            inputPower=value.get("inputPower"),
                            efficiency=value.get("efficiency"),
                            internalTemp=value.get("internalTemp"),
                            gridFrequency=value.get("gridFrequency"),
                            productionToday=value.get("productionToday"),
                            yieldToday=value.get("yieldToday"),
                            reactivePower=value.get("reactivePower"),
                            apparentPower=value.get("apparentPower"),
                            powerFactor=value.get("powerFactor"),
                            stage=value.get("stage")
                        )
            except Exception as e:
                print("Error processing message:", e)

        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.on_connect = on_connect
        client.on_message = on_message

        client.connect("broker.emqx.io", 1883, 60)

        client.loop_forever()
