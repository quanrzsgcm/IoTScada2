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
    irradiation = os.getenv("IRRADIATION_VAL")
    irradiation = int(irradiation)
    
    # Set the timezone to Vietnam (Asia/Ho_Chi_Minh)
    local_timezone = pytz.timezone('Asia/Ho_Chi_Minh')

    # Get the current year
    current_year = datetime.now().year

    # Create a datetime object for November 1st of the current year with your local timezone
    current_timestamp = local_timezone.localize(datetime(current_year, 6, 5)) # YYMMDD
    print(current_timestamp)

    for _ in range(200):
        # measurementID =  start_id
        timestamp = current_timestamp.strftime('%Y-%m-%dT%H:%M:%S.%f%z')
        inverter_id = 1
        irradiation = irradiation + random.randint(1, 100)
        irradiance = random.randint(1, 100)
        temperature = random.randint(1, 100)

        yield (timestamp, irradiation, irradiance, temperature,  inverter_id)

        # Add 1 minute and 1 second        
        current_timestamp += timedelta(minutes=20, seconds=1)
        # current_timestamp += timedelta(seconds=1, microseconds=100000)

    # Set or update a key-value pair in the .env file
    set_key(".env", "IRRADIATION_VAL", str(irradiation))

# Print the generated samples
for sample in generate_samples():
    insert_data_3.insertDataWS(conn,sample)

conn.close()  # Close the database connection
