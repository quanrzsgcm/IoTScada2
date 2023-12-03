from datetime import datetime, timedelta
import pytz
import random
import psycopg2
import insert_data_3

conn = psycopg2.connect(**insert_data_3.db_params)

def generate_samples():
    # Set the timezone to Vietnam (Asia/Ho_Chi_Minh)
    local_timezone = pytz.timezone('Asia/Ho_Chi_Minh')

    # Get the current year
    current_year = datetime.now().year

    # Create a datetime object for November 1st of the current year with your local timezone
    current_timestamp = local_timezone.localize(datetime(current_year, 11, 1))
    print(current_timestamp)

    for _ in range(15):
        meter_id = 'pm05'
        power = random.randint(1, 100)
        voltage = random.randint(1, 100)
        current = random.randint(1, 100)

        timestamp_str = current_timestamp.strftime('%Y-%m-%dT%H:%M:%S.%f%z')
        yield (meter_id, power, voltage, current, timestamp_str)

        # Increment timestamp by 1 minute
        current_timestamp += timedelta(minutes=1)

# Print the generated samples
for sample in generate_samples():
    print(sample[4])
    insert_data_3.insertData(conn,sample)

conn.close()  # Close the database connection



