import paho.mqtt.client as mqtt
import json
import random

# Define the MQTT broker and topic
broker_address = "test.mosquitto.org"
broker_port = 1883
topic = "my.powers"

# Generate random numbers between 1 and 100 (inclusive)
random_number_1 = random.randint(1, 100)
random_number_2 = random.randint(1, 100)
random_number_3 = random.randint(1, 100)

# Define the JSON payload
payload = {
    "power": random_number_1,
    "voltage": random_number_2,
    "current": random_number_3,
    "thingId": "my.power:pm01"
}
payload_json = json.dumps(payload)

# Create an MQTT client
client = mqtt.Client()

# Connect to the broker
client.connect(broker_address, broker_port)

# Publish the JSON payload to the specified topic
client.publish(topic, payload_json)
print(f'Published {random_number_1} {random_number_2} {random_number_3}')
# Disconnect from the broker
client.disconnect()
