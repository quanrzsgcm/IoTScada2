import paho.mqtt.client as mqtt
import json
import random
import os
from dotenv import load_dotenv, set_key, get_key

# Load environment variables from the .env file
load_dotenv()

energy = os.getenv("ENERGY_VAL_03")
energy = int(energy)

energy = energy + random.randint(1, 100)

# Define the MQTT broker and topic
broker_address = "test.mosquitto.org"
broker_port = 1883
topic = "my.inverters"

# Generate random numbers between 1 and 100 (inclusive)
random_number_1 = random.randint(1, 100)
random_number_2 = random.randint(1, 100)
random_number_3 = random.randint(1, 100)

# Define the JSON payload


payload = {
    "capacity": random_number_1,
    "internalTemp": random_number_1,
    "inputPower": random_number_1,
    "gridFrequency": random_number_1,
    "powerFactor": random_number_1,
    "thingId": "my.inverter:inv01",
}


payload_json = json.dumps(payload)

# Create an MQTT client
client = mqtt.Client()

# Connect to the broker
client.connect(broker_address, broker_port)

# Publish the JSON payload to the specified topic
client.publish(topic, payload_json)
print(f'Published {random_number_1} {random_number_2} {random_number_3} {energy}')
# Disconnect from the broker
client.disconnect()
# Set or update a key-value pair in the .env file
set_key(".env", "ENERGY_VAL_03", str(energy))
print("store ",energy)
