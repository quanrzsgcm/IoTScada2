# myapp/management/commands/mqtt_subscriber.py
from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import json
from iot.models import InverterMeasurement, Inverter, Site, SiteMeasurements, InverterState
import queue
import threading
import time
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from datetime import datetime
import pytz

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
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


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
                            state = ""
                            value = payload["value"]
                            path = payload["path"]
                            if path == "/features/measurements/properties":
                                state = value["state"]
                            elif path == "/features/measurements/properties/state":
                                state = value
                            
                            print(f'State: {state}')
                            timestamp=payload["timestamp"]
                            print(f'Timestamp: {timestamp}')

                            state_start_on = ""
                            last_state = InverterState.objects.filter(inverter__inverterID=inverter_id).order_by('-timestamp').first()
                            if last_state:
                                last_state_value = last_state.state
                                last_state_timestamp = last_state.timestamp
                                last_state_inverterID = last_state.inverter.inverterID
                                last_state_starton = last_state.starton
                                
                                print(f"Last State: {last_state_value}, Timestamp: {last_state_timestamp}, Inverter ID: {last_state_inverterID}")
                                print(f"Current State: {state}, Timestamp: {timestamp}, Inverter ID: {inverter_id}")
                                if state != last_state_value:
                                    print("diff state")
                                    print(type(timestamp))
                                    state_start_on = timestamp                      
                             
                                    # Truncate the string to include only up to microseconds
                                    state_start_on_str = timestamp[:26] + "Z"
                                    # Define the format of the date string
                                    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"

                                    # Parse the string to a datetime object
                                    state_start_on = datetime.strptime(state_start_on_str, date_format)

                                    # Add timezone information (UTC)
                                    state_start_on = state_start_on.replace(tzinfo=pytz.UTC)
                                    print(type(state_start_on))

                                else: 
                                    print("same state")
                                    print(type(last_state_starton))
                                    state_start_on = last_state_starton
                            else: 
                                print("not found state")
                                print(type(timestamp))
                                state_start_on = timestamp         
                            
                            print(f"Start On: {state_start_on}")
                            print("debug")
                            
                            duration = timezone.now() - state_start_on
                            print("debug2")
                            
                            print(f"Duration : {duration}")
                            print("debug3")


                            InverterState.objects.create(
                                inverter=inv_instance,
                                state=state,
                                timestamp=payload["timestamp"],
                                starton= state_start_on
                            )
                            print("debug4")


                            if path == "/features/measurements/properties/state":
                                continue

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
