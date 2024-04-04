import requests

url = 'http://localhost:8080/api/2/things/my.inverter%3Ainv01/inbox/messages/test'
headers = {
    'accept': '*/*',
    'Authorization': 'Basic ZGl0dG86ZGl0dG8=',
    'Content-Type': 'application/json'
}
data = {
    "cups": 1,
    "strength": 0.8,
    "amount": 230,
    "captcha": ""
}

response = requests.post(url, headers=headers, json=data)

print(response.text)
