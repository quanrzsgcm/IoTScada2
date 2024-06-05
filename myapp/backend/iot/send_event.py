import time
import os
import json

os.chdir("..")

data_to_write = {
    "name": "John Doe",
    "age": 30,
    "city": "New York"
}
# Check if we are now in the desired directory
print("Current working directory:", os.getcwd())
# Write events to a file
def send_event():
    with open('event.txt', 'w') as f:
        # f.write('Inverter 1 has disconnected for 5123 minutes')
        json.dump(data_to_write, f)
    time.sleep(2)  # Adjust the interval as needed

send_event()