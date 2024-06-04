import time
import os

os.chdir("..")
# Check if we are now in the desired directory
print("Current working directory:", os.getcwd())
# Write events to a file
def send_event():
    with open('event.txt', 'w') as f:
        f.write('event')
    time.sleep(2)  # Adjust the interval as needed

send_event()