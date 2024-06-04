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
    meterReadTotalEnergy = os.getenv("ENERGY_VAL")
    meterReadTotalEnergy = int(meterReadTotalEnergy)
    yieldToday = os.getenv("YIELD_VAL")
    yieldToday = int(yieldToday)

    
    # Set the timezone to Vietnam (Asia/Ho_Chi_Minh)
    local_timezone = pytz.timezone('Asia/Ho_Chi_Minh')

    # Get the current year
    current_year = datetime.now().year

    # Create a datetime object for November 1st of the current year with your local timezone
    current_timestamp = local_timezone.localize(datetime(current_year, 6, 3)) # YYMMDD
    print(current_timestamp)

    for _ in range(200):
        # measurementID =  start_id
        timestamp = current_timestamp.strftime('%Y-%m-%dT%H:%M:%S.%f%z')
        internalTemp = random.randint(1, 100)
        inputPower = random.randint(1, 100)
        gridFrequency =  random.randint(1, 100)
        powerFactor = random.randint(1, 100)
        inverter_id = 1
        activePower = random.randint(1, 100)
        apparentPower = random.randint(1, 100)
        efficiency = random.randint(1, 100)
        meterReadTotalEnergy = meterReadTotalEnergy + random.randint(1, 100)
        productionToday = meterReadTotalEnergy
        reactivePower = random.randint(1, 100)
        yieldToday = yieldToday + random.randint(1, 100)

        yield (timestamp, internalTemp, inputPower, gridFrequency, powerFactor, inverter_id, activePower, apparentPower, efficiency, meterReadTotalEnergy, productionToday, reactivePower , yieldToday)

        # Add 1 minute and 1 second        
        current_timestamp += timedelta(minutes=20, seconds=1)
        # current_timestamp += timedelta(seconds=1, microseconds=100000)

    # Set or update a key-value pair in the .env file
    set_key(".env", "ENERGY_VAL", str(meterReadTotalEnergy))
    set_key(".env", "YIELD_VAL", str(yieldToday))


# Print the generated samples
for sample in generate_samples():
    insert_data_3.insertData(conn,sample)

conn.close()  # Close the database connection
