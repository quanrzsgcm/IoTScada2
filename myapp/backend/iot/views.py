from django.shortcuts import render
from django.http import JsonResponse
# import view sets from the REST framework
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
import json

import requests
# import the PowerMeterDataSerializer from the serializer file
from .serializers import PowerMeterDataSerializer
 
# import the Todo model from the models file
from .models import PowerMeterData
 
# create a class for the Todo model viewsets
class PowerMeterDataView(viewsets.ModelViewSet):
 
    # create a serializer class and 
    # assign it to the TodoSerializer class
    serializer_class = PowerMeterDataSerializer
 
    # define a variable and populate it 
    # with the Todo list objects
    queryset = PowerMeterData.objects.all()

@csrf_exempt
def my_api_view(request):
    if request.method == 'POST':
        try: 
            data = json.loads(request.body.decode('utf-8'))
            start_time = data.get('start_time')
            end_time = data.get('end_time')
            print(start_time)
            print(end_time)

            # Handle the incoming request with the specified time range
            # You can perform queries or other operations based on the time range

            response_data = {
                "start_time": start_time,
                "end_time": end_time,
                "message": "Data from time range received."
            }
            # Query the database for records within the specified time range
            power_data = PowerMeterData.objects.filter(timestamp__gte=start_time, timestamp__lte=end_time)
        
            # Serialize the query result to JSON
            serialized_data = [{'id': entry.id, 'meter_id': entry.meter_id, 'power': entry.power, 'voltage': entry.voltage, 'current': entry.current, 'timestamp': entry.timestamp} for entry in power_data]
            # return JsonResponse({'empty': True})
            return JsonResponse(serialized_data, safe=False)
        
        except json.JSONDecodeError as e:
    
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    elif request.method == 'GET':
        return JsonResponse({"error": "Invalid request method"}, status=200)

def proxy_view(request):
    target_url = "http://localhost:8080/api/2/things"  # Replace with your actual target URL

    # Extract authentication headers from the incoming request
    auth_headers = {}
    for header, value in request.headers.items():
        if header.startswith('Authorization'):
            auth_headers[header] = value

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=auth_headers)
  
    data = response.json()
    print(data)

    return JsonResponse(data, safe=False)
