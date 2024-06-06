# myapp/management/commands/mqtt_subscriber.py
from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import json
from iot.models import InverterMeasurement, Inverter, Site, SiteMeasurements, InverterState, InverterAlarm
import queue
import threading
import time
from django.utils import timezone
from django.utils.dateparse import parse_datetime
import pytz
import os
from base64 import b64encode
import requests
from datetime import datetime
from dateutil import parser

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

def get_inverter_name(myinv):
    target_url = os.getenv("BASE_URL_DITTO")  
    target_url = target_url + '/api/2/things/' + myinv
    # print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)
    data = response.json()
    name = data['attributes']['name']    
    return name
    

def get_thresholds():
    target_url = os.getenv("BASE_URL_DITTO")  
    target_url = target_url + '/api/2/things/my.threshold:th1'
    # print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)

    data = response.json()
    # Pretty print the JSON data
    # pretty_data = json.dumps(data, indent=4)
    # print(pretty_data)


    internalTempWarning = data['features']['thresholds']['properties']['internalTempWarning']    
    internalTempFault = data['features']['thresholds']['properties']['internalTempFault']
    inputPowerWarning = data['features']['thresholds']['properties']['inputPowerWarning']    
    inputPowerFault = data['features']['thresholds']['properties']['inputPowerFault']
    outputPowerWarning = data['features']['thresholds']['properties']['outputPowerWarning']    
    outputPowerFault = data['features']['thresholds']['properties']['outputPowerFault']
    return internalTempWarning, internalTempFault, inputPowerWarning, inputPowerFault, outputPowerWarning, outputPowerFault

def send_events(data_to_write): 
    # data_to_write = {
    #     "name": "John Doe",
    #     "age": 30,
    #     "city": "New York"
    # }
    # Check if we are now in the desired directory
    print("Current working directory:", os.getcwd())
    # # Write events to a file
    with open('event.txt', 'w') as f:
        f.write(data_to_write)
        # json.dump(data_to_write, f)
    # time.sleep(2)  # Adjust the interval as needed

    # send_event()

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        message_queue = queue.Queue()
        message_value_queue = queue.Queue()

        def check_for_thresh_hold():
            while True:
                try:
                    payload = message_value_queue.get()
                    topic = payload["topic"]
                    parts = topic.split('/')
                    thing = parts[0]
                    inverter_id = parts[1]  # This will give 'inv1'
                    inverter_id = int(inverter_id[3:])
                    inverter_name = get_inverter_name('my.inverter:inv' + str(inverter_id))
                    inv_instance = Inverter.objects.get(inverterID=inverter_id)
                    timestamp = payload["timestamp"]

                    if "value" in payload:
                        value = payload["value"]

                    print(bcolors.WARNING + str(value) + bcolors.ENDC)

                    internalTemp = value.get('internalTemp')
                    inputPower = value.get('inputPower')
                    outputPower = value.get('activePower')

                    (internalTempWarning, internalTempFault,
                    inputPowerWarning, inputPowerFault,
                    outputPowerWarning, outputPowerFault) = get_thresholds()

                    internalTempStatus = InverterAlarm.NORMAL
                    inputPowerStatus = InverterAlarm.NORMAL
                    outputPowerStatus = InverterAlarm.NORMAL

                    # Checking internalTemp
                    if internalTemp is not None:
                        if internalTemp >= internalTempFault:
                            internalTempStatus = InverterAlarm.FAULT
                            print(bcolors.FAIL + f"{inverter_name} Temperature is too high: " + str(internalTemp) + bcolors.ENDC)
                            send_events(f"{inverter_name} Temperature is too high: " + str(internalTemp))
                        elif internalTemp >= internalTempWarning:
                            internalTempStatus = InverterAlarm.WARNING
                            print(bcolors.WARNING + "Set alarm for internalTemp warning! Temperature is elevated: " + str(internalTemp) + bcolors.ENDC)
                            send_events("Set alarm for internalTemp warning! Temperature is elevated: " + str(internalTemp))
                        else:
                            print(bcolors.OKCYAN + "internalTemp is within normal range: " + str(internalTemp) + bcolors.ENDC)
                    else:
                        print("Internal temperature value is not available.")

                    # Checking inputPower
                    if inputPower is not None:
                        if inputPower >= inputPowerFault:
                            inputPowerStatus = InverterAlarm.FAULT
                            print(bcolors.FAIL + "Set alarm for inputPower fault! Power is too high: " + str(inputPower) + bcolors.ENDC)
                        elif inputPower >= inputPowerWarning:
                            inputPowerStatus = InverterAlarm.WARNING
                            print(bcolors.WARNING + "Set alarm for inputPower warning! Power is elevated: " + str(inputPower) + bcolors.ENDC)
                        else:
                            print(bcolors.OKCYAN + "inputPower is within normal range: " + str(inputPower) + bcolors.ENDC)
                    else:
                        print("Input power value is not available.")

                    # Checking outputPower
                    if outputPower is not None:
                        if outputPower >= outputPowerFault:
                            outputPowerStatus = InverterAlarm.FAULT
                            print(bcolors.FAIL + "Set alarm for outputPower fault! Power is too high: " + str(outputPower) + bcolors.ENDC)
                        elif outputPower >= outputPowerWarning:
                            outputPowerStatus = InverterAlarm.WARNING
                            print(bcolors.WARNING + "Set alarm for outputPower warning! Power is elevated: " + str(outputPower) + bcolors.ENDC)
                        else:
                            print(bcolors.OKCYAN + "outputPower is within normal range: " + str(outputPower) + bcolors.ENDC)
                    else:
                        print("Output power value is not available.")

                    # Save the alarm record
                    alarm = InverterAlarm(
                        inverter=inv_instance,
                        timestamp=timestamp,
                        activePower=outputPower,
                        inputPower=inputPower,
                        internalTemp=internalTemp,
                        activePowerStatus=outputPowerStatus,
                        inputPowerStatus=inputPowerStatus,
                        internalTempStatus=internalTempStatus,
                        duration=0  # Adjust this as necessary
                    )
                    alarm.save()


                except Exception as e:
                    print("Error in check_for_thresh_hold:", e)
                finally:
                    message_value_queue.task_done()


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
                            print(f'Type of Timestamp of msg: {type(timestamp)}')
                            # The datetime string
                            # timestamp = "2024-06-05T14:01:50.110956980Z"

                            # Parsing the string to a datetime object
                            datetime_obj = parser.isoparse(timestamp)
                            print(f'Timestamp after parse: {datetime_obj}')
                            print(f'Type of Timestamp after parse: {type(datetime_obj)}')

                            state_start_on = ""
                            last_state = InverterState.objects.filter(inverter__inverterID=inverter_id).order_by('-timestamp').first()
                            if last_state:
                                last_state_value = last_state.state
                                last_state_timestamp = last_state.timestamp
                                last_state_inverterID = last_state.inverter.inverterID
                                last_state_starton = last_state.starton
                                
                                print(f"Last State: {last_state_value}, Timestamp: {last_state_timestamp}, Inverter ID: {last_state_inverterID}")
                                print(f'Type of Timestamp of last state: {type(last_state_timestamp)}')
                                print(f"Current State: {state}, Timestamp: {timestamp}, Inverter ID: {inverter_id}")
                                print(f'Type of Timestamp of current: {type(timestamp)}')


                                if state != last_state_value:
                                    print("State has changed")
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
                                print("Not found last state")
                                print("Use timestamp of msg to be start on")
                                print(type(datetime_obj))
                                state_start_on = datetime_obj
                            
                            print(f"Start On: {state_start_on}")                            
                            duration = timezone.now() - state_start_on                            
                            print(f"Duration : {duration}")                            

                            InverterState.objects.create(
                                inverter=inv_instance,
                                state=state,
                                timestamp=payload["timestamp"],
                                starton= state_start_on
                            )

                            if path == "/features/measurements/properties/state":
                                print('path == /features/measurements/properties/state')
                                continue

                            # Check for None or missing values
                            meter_read_total_energy = value.get("meterReadTotalEnergy")

                            if meter_read_total_energy is None:
                                # Handle the None case here if needed
                                print("meterReadTotalEnergy is None")
                                # continue
                            message_value_queue.put(payload)
                            
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
        
        # Start a separate thread to process messages
        threading.Thread(target=process_messages, daemon=True).start()
        threading.Thread(target=check_for_thresh_hold, daemon=True).start()
        
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.on_connect = on_connect
        client.on_message = on_message

        client.connect("broker.emqx.io", 1883, 60)
        client.loop_forever()
