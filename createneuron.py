import requests

# Define the URL
url = 'http://192.168.1.210:7000/api/v2/login'

# Define the headers
headers = {
    'Content-Type': 'application/json',
    # 'Authorization': 'Bearer <token>'
}

# Define the JSON data
data = {
    "name": "modbus-tcp-node",
    "plugin": "Modbus TCP",
    "params": {
        "param1": 1,
        "param2": "1.1.1.1",
        "param3": True,
        "param4": 11.22
    }
}

data = {
    "name": "admin",
    "pass": "0000"
}

# Send the POST request
response = requests.post(url, headers=headers, json=data)

# Print the response
print(response.text)
