import json

# Your JSON data
data = '{"topic":"my.power/pm0122/things/twin/events/modified","headers":{"correlation-id":"e74a6b21-798a-45d8-95c5-ee0c7ede983b","mqtt.topic":"my.powers","mqtt.retain":"false","mqtt.qos":"0","ditto-originator":"nginx:ditto","response-required":false,"version":2,"requested-acks":[],"content-type":"application/json"},"path":"/features","value":{"measurements":{"properties":{"power":47,"voltage":74,"current":36}}},"revision":5,"timestamp":"2023-10-26T01:51:19.739549793Z"}'

# Parse the JSON data
parsed_data = json.loads(data)

# Extract and print the "topic" field
topic = parsed_data["topic"]

# The substring you want to check for
substring_to_check = "things/twin/events/modified"

# Check if the "topic" ends with the desired substring
if topic.endswith(substring_to_check):
    print("The 'topic' ends with the substring.")
else:
    print("The 'topic' does not end with the substring.")

power = parsed_data["value"]["measurements"]["properties"]["power"]
voltage = parsed_data["value"]["measurements"]["properties"]["voltage"]
current = parsed_data["value"]["measurements"]["properties"]["current"]
timestamp = parsed_data["timestamp"]

try:
    # Split the "topic" string by '/'
    parts = topic.split('/')
    
    # Access the relevant element (in this case, the second element, which is "pm01")
    thingID = parts[1]
except IndexError:
    # Handle the case where there is no second element (e.g., if the "topic" is not in the expected format)
    print("Error: Unable to extract 'pm01' from the topic.")

print(thingID)
print(power)
print(voltage)
print(current)
print(timestamp)
