from datetime import datetime, timedelta
import pytz
import random
import psycopg2
import insert_data_3
import os
from dotenv import load_dotenv, set_key, get_key

# Load environment variables from the .env file
load_dotenv()

conn = psycopg2.connect(**insert_data_3.db_params)

def generate_samples():
    energy = os.getenv("ENERGY_VAL")
    energy = int(energy)
    # Set the timezone to Vietnam (Asia/Ho_Chi_Minh)
    local_timezone = pytz.timezone('Asia/Ho_Chi_Minh')

    # Get the current year
    current_year = datetime.now().year

    # Create a datetime object for November 1st of the current year with your local timezone
    current_timestamp = local_timezone.localize(datetime(2023, 11, 28))
    print(current_timestamp)

    for _ in range(5000):
        meter_id = 'pm03'
        power = random.randint(1, 100)
        voltage = random.randint(1, 100)
        current = random.randint(1, 100)
        energy = energy + random.randint(1, 100)

        timestamp_str = current_timestamp.strftime('%Y-%m-%dT%H:%M:%S.%f%z')
        yield (meter_id, power, voltage, current, timestamp_str, energy)

        # # Increment timestamp by 1 minute
        # current_timestamp += timedelta(minutes=1)
        # Add 1 minute and 1 second
        current_timestamp += timedelta(minutes=20, seconds=1)
        current_time = datetime.now(local_timezone)
        if current_timestamp >= current_time:
            print("Stopping the loop as current timestamp is equal to the current time.")
            break
    

    
    # Set or update a key-value pair in the .env file
    set_key(".env", "ENERGY_VAL", str(energy))

# Print the generated samples
for sample in generate_samples():
    print(sample[5])
    # print(sample[4])
    insert_data_3.insertData(conn,sample)

conn.close()  # Close the database connection



