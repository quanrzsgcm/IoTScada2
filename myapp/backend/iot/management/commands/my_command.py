# myapp/management/commands/mqtt_subscriber.py
from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import json
from iot.models import InverterMeasurement, Inverter, Site, SiteMeasurements
import queue
import threading
import time

# INSERT INTO iot_invertermeasurement (
#     timestamp, 
#     "internalTemp", 
#     "inputPower", 
#     "gridFrequency", 
#     "powerFactor", 
#     inverter_id, 
#     "activePower", 
#     "apparentPower", 
#     efficiency, 
#     "meterReadTotalEnergy", 
#     "productionToday", 
#     "reactivePower", 
#     stage, 
#     "yieldToday"
# ) VALUES (
#     '2024-05-17T07:44:00.000000+07:00', 
#     25, 
#     1500, 
#     50, 
#     0.98, 
#     1, 
#     1450, 
#     1600, 
#     92, 
#     100000, 
#     500, 
#     200, 
#     1, 
#     450
# );



class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        message_queue = queue.Queue()

        def process_messages():
            while True:
                msg = message_queue.get()
                try:
                    payload = json.loads(msg.payload.decode())
                    print("Payload: ", payload)
                    topic = payload["topic"]
                    parts = topic.split('/')
                    thing = parts[0]
                    if thing == 'my.inverter':
                        inverter_id = parts[1]  # This will give 'inv1'
                        inverter_id = int(inverter_id[3:])
                        inv_instance = Inverter.objects.get(inverterID=inverter_id)
                        if "value" in payload:
                            value = payload["value"]
                            # Check for None or missing values
                            meter_read_total_energy = value.get("meterReadTotalEnergy")
                            if meter_read_total_energy is None:
                                # Handle the None case here if needed
                                print("meterReadTotalEnergy is None")
                                # continue
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
                    elif thing == 'my.site':
                        site_id = parts[1]  # This will give 'site1'
                        site_id = int(site_id[4:])
                        site_instance = Site.objects.get(siteID=site_id)
                        if "value" in payload:
                            value = payload["value"]
                            # Create SiteMeasurement object and save it to the database
                            SiteMeasurements.objects.create(
                                site=site_instance,
                                timestamp=payload["timestamp"],
                                capacity=value.get("capacity"),
                                temp=value.get("temp"),
                                irradiation=value.get("irradiation"),
                                irradiance=value.get("irradiance"),
                                m_yield=value.get("yield"),
                                production=value.get("production"),
                                activepower=value.get("activePower"),
                                powerratio=value.get("powerRatio"),
                            )                    
                except Exception as e:
                    print("Error processing message:", e)
                finally:
                    message_queue.task_done()
                    print("Done message")

        def on_connect(client, userdata, flags, reason_code, properties):
            print("Connected with result code "+str(reason_code))
            client.subscribe("chondaitopicnaodo")

        def on_message(client, userdata, msg):
            message_queue.put(msg)

            # print(msg.topic + " " + str(msg.payload.decode()))
            # try:
            #     payload = json.loads(msg.payload.decode())
            #     topic = payload["topic"]
            #     parts = topic.split('/')
            #     thing = parts[0]
            #     if thing == 'my.inverter':
            #         inverter_id = parts[1]  # This will give 'inv1'
            #         inverter_id = int(inverter_id[3:])
            #         inv_instance = Inverter.objects.get(inverterID=inverter_id)
            #         if "value" in payload:
            #             value = payload["value"]
            #             # Create InverterMeasurement object and save it to the database
            #             InverterMeasurement.objects.create(
            #                 inverter=inv_instance,
            #                 timestamp=payload["timestamp"],
            #                 meterReadTotalEnergy=value.get("meterReadTotalEnergy"),
            #                 activePower=value.get("activePower"),
            #                 inputPower=value.get("inputPower"),
            #                 efficiency=value.get("efficiency"),
            #                 internalTemp=value.get("internalTemp"),
            #                 gridFrequency=value.get("gridFrequency"),
            #                 productionToday=value.get("productionToday"),
            #                 yieldToday=value.get("yieldToday"),
            #                 reactivePower=value.get("reactivePower"),
            #                 apparentPower=value.get("apparentPower"),
            #                 powerFactor=value.get("powerFactor"),
            #                 stage=value.get("stage")
            #             )
            #     elif thing == 'my.site':
            #         print("site site")
            # except Exception as e:
            #     print("Error processing message:", e)

        
        # Start a separate thread to process messages
        threading.Thread(target=process_messages, daemon=True).start()
        
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.on_connect = on_connect
        client.on_message = on_message

        client.connect("broker.emqx.io", 1883, 60)
        client.loop_forever()
