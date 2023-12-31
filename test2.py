from datetime import datetime, timezone

# Get the current date and time in UTC
current_datetime_utc = datetime.now(timezone.utc)

# Format the datetime in ISO 8601 format
iso_8601_string = current_datetime_utc.isoformat()

print(iso_8601_string)

# Get the current time in UTC
current_time = datetime.utcnow()

# Format it in ISO 8601 with milliseconds and Z indicating UTC
formatted_time = current_time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

print(formatted_time)

# Input datetime string
input_datetime_str = "2023-12-01T00:00:00.000000Z+0700"

# Step 1: Parse the input string
input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%dT%H:%M:%S.%fZ%z")

# Step 2: Convert to UTC
utc_datetime = input_datetime.astimezone(timezone.utc)

# Step 3: Format in ISO 8601
utc_iso8601_str = utc_datetime.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

print(utc_iso8601_str)
