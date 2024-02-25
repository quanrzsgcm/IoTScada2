import json

# Your JSON data
def get_data(response):
    try:
        data = response

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
        energy = parsed_data["value"]["measurements"]["properties"]["energy"]
        timestamp = parsed_data["timestamp"]

        try:
            # Split the "topic" string by '/'
            parts = topic.split('/')
            
            # Access the relevant element (in this case, the second element, which is "pm01")
            thingID = parts[1]
        except IndexError:
            # Handle the case where there is no second element (e.g., if the "topic" is not in the expected format)
            print("Error: Unable to extract 'pm01' from the topic.")

        result = (thingID, power, voltage, current, timestamp, energy)
        print(result)
        return result
        
    except:
        pass
    return None
