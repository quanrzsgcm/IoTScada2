from django.shortcuts import render
from django.http import JsonResponse
# import view sets from the REST framework
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime, timezone, timedelta
from django.utils import timezone as django_timezone
import pytz
import calendar
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
    # with the PowerMeterData list objects
    queryset = PowerMeterData.objects.all()

def convert_and_extract_date(date_string, local_timezone='Asia/Ho_Chi_Minh'):
    # Parse the input date string
    original_date = timezone.datetime.fromisoformat(date_string[:-1])

    # Convert to local time
    local_tz = pytz.timezone(local_timezone)
    local_date = original_date.replace(tzinfo=timezone.utc).astimezone(tz=local_tz)

    # Extract the date part
    local_date_part = local_date.date()

    return local_date_part

def time_range_extract(dateString, unitoftime, local_timezone='Asia/Ho_Chi_Minh'):
    date_object = datetime.strptime(dateString, "%Y-%m-%dT%H:%M:%S.%fZ")

    # Convert the date_object to the local time zone
    date_object = date_object.replace(tzinfo=pytz.UTC)
    date_object_local = date_object.astimezone(pytz.timezone(local_timezone))
    print(f'date_object_local = {date_object_local}')

    start_of_day = date_object_local.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = (start_of_day + timedelta(days=1)) - timedelta(microseconds=1)

    if unitoftime == 'Day':
        print("First time of the day:", start_of_day)
        print("Last time of the day:", end_of_day)
        return {'start': start_of_day, 'end': end_of_day}

    if unitoftime == 'Week':
        start_of_week = start_of_day - timedelta(days=start_of_day.weekday())
        end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59, microseconds=999999)
        print("Start of the week (Monday):", start_of_week)
        print("End of the week (Sunday):", end_of_week)
        return {'start': start_of_week, 'end': end_of_week}

    elif unitoftime == 'Month':
        start_of_month = start_of_day.replace(day=1)
        _, last_day_of_month = calendar.monthrange(start_of_month.year, start_of_month.month)
        end_of_month = start_of_month.replace(day=last_day_of_month, hour=23, minute=59, second=59, microsecond=999999)
        print("Start of the month:", start_of_month)
        print("End of the month:", end_of_month)
        return {'start': start_of_month, 'end': end_of_month}

    elif unitoftime == 'Year':
        start_of_year = start_of_day.replace(month=1, day=1)
        end_of_year = start_of_year.replace(month=12, day=31, hour=23, minute=59, second=59, microsecond=999999)
        print("Start of the year:", start_of_year)
        print("End of the year:", end_of_year)
        return {'start': start_of_year, 'end': end_of_year}

    else:
        raise ValueError(f"Invalid unitoftime: {unitoftime}")


@csrf_exempt 
def specific_element_test(request):
    if request.method == 'POST':    
        try:
            data = json.loads(request.body.decode('utf-8'))
            print(data)
            thingid = data.get('thingid').split(':')
            thingid = thingid[1]
            typeofmeasurement = data.get('typeofmeasurement')
            typeofmeasurement_values = [value.lower() for value in typeofmeasurement]
            user_input_timezone = data.get('user_input_timezone')
            try:
                user_timezone = pytz.timezone(user_input_timezone)
            except pytz.UnknownTimeZoneError:
            # Use a default time zone if the user-provided time zone is invalid
                user_timezone = pytz.timezone('Asia/Ho_Chi_Minh')

            unitoftime = data.get('unitoftime')
            dateString = data.get('dateString')
            timeRange = time_range_extract(dateString, unitoftime)
            print(timeRange['start'])
            print(timeRange['end'])

            result_list = []

            # Query PowerMeterData for the specified time range
            if unitoftime == 'Day':
                query = PowerMeterData.objects.filter(
                meter_id=thingid,
                timestamp__gte=timeRange['start'],
                timestamp__lte=timeRange['end'],
                ).values('meter_id', 'timestamp', *typeofmeasurement_values)
                result_list = list(query)                               

            elif unitoftime == 'Week':
                query = PowerMeterData.objects.filter(
                meter_id=thingid,
                timestamp__gte=timeRange['start'],
                timestamp__lte=timeRange['end'],
                ).values('meter_id', 'timestamp', *typeofmeasurement_values)
                result_list = list(query)                

            elif unitoftime == 'Month':
                query = PowerMeterData.objects.filter(
                meter_id=thingid,
                timestamp__gte=timeRange['start'],
                timestamp__lte=timeRange['end'],
                ).values('meter_id', 'timestamp', *typeofmeasurement_values)
                result_list = list(query)               

            elif unitoftime == 'Year':
                query = PowerMeterData.objects.filter(
                meter_id=thingid,
                timestamp__gte=timeRange['start'],
                timestamp__lte=timeRange['end'],
                ).values('meter_id', 'timestamp', *typeofmeasurement_values)
                result_list = list(query)
            else:
                return JsonResponse({"error": "Invalid unit of time"})
            
            for result in result_list:
                result['timestamp'] = result['timestamp'].astimezone(user_timezone)
                print(result)
            return JsonResponse(result_list, safe = False)
                                                         
        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=200)


@csrf_exempt 
def specific_element_depricated(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            print(data)
            thingid = data.get('thingid').split(':')
            thingid = thingid[1]
            typeofmeasurement = data.get('typeofmeasurement')
            unitoftime = data.get('unitoftime')
            dateString = data.get('dateString')
            
            
            # Convert the string to a datetime object in UTC
            date_utc = datetime.strptime(dateString, "%Y-%m-%dT%H:%M:%S.%fZ")
            date_utc = date_utc.replace(tzinfo=pytz.UTC)

            # Convert to your local time zone
            local_timezone = pytz.timezone('Asia/Ho_Chi_Minh')  # Replace 'YourLocalTimeZone' with your actual time zone
            date_local = date_utc.astimezone(local_timezone)

            # Get the first time of that day in your local time zone
            first_time_of_day = date_local.replace(hour=0, minute=0, second=0, microsecond=0)

            # Get the last time of that day in your local time zone
            last_time_of_day = (first_time_of_day + timedelta(days=1)) - timedelta(microseconds=1)

            print("First time of the day:", first_time_of_day)
            print("Last time of the day:", last_time_of_day)

            # Assuming dateString is provided as '2023-11-02T03:16:55.677Z'
            date_object = datetime.strptime(dateString, "%Y-%m-%dT%H:%M:%S.%fZ")

            # Replace 'YourLocalTimeZone' with your actual time zone
            local_timezone = 'Asia/Ho_Chi_Minh'

            # Convert the date_object to the local time zone
            date_object = date_object.replace(tzinfo=pytz.UTC)
            date_object_local = date_object.astimezone(pytz.timezone(local_timezone))

            # Calculate the start and end of the day in the local time zone
            start_of_day = date_object_local.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = (start_of_day + timedelta(days=1)) - timedelta(microseconds=1)

            print("First time of the day:", start_of_day)
            print("Last time of the day:", end_of_day)

            # Query PowerMeterData for the specified time range
            query = PowerMeterData.objects.filter(
                meter_id=thingid,
                timestamp__gte=start_of_day,
                timestamp__lte=end_of_day
            ).values('timestamp', typeofmeasurement)
            result_list = list(query)

            return JsonResponse(result_list, safe = False)     

        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=200)


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

@csrf_exempt
def create_powermeter_twin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            # Access the values in the JSON data
            id_value = data.get('id')
            policy_id_value = data.get('policyId')
            attributes = data.get('attributes', {})
            manufacturer_value = attributes.get('manufacturer')
            location_value = attributes.get('location')
            serial_number_value = attributes.get('serial number')

            # Do something with the values
            print("Policy ID:", policy_id_value)
            print("ID:", id_value)
            print("Manufacturer:", manufacturer_value)
            print("Location:", location_value)
            print("Serial Number:", serial_number_value)

            data.pop("id", None)
            print(json.dumps(data, indent=2))

            target_url = f"http://localhost:8080/api/2/things/my.power:pm{id_value}"
            print("Target URL:", target_url)
            
            # Extract authentication headers from the incoming request
            auth_headers = {}
            for header, value in request.headers.items():
                if header.startswith('Authorization'):
                    auth_headers[header] = value

            # Forward the request to the target URL with authentication headers
            response = requests.put(target_url, headers=auth_headers, json=data)

            # Handle the response as needed
            print("Response status code:", response.status_code)

            if response.status_code == 200:
                # Successful response
                response_data = response.json()
                print("Response content:", response_data)
                return JsonResponse({'success': True, 'data': response_data})

            elif response.status_code == 201:
                # Resource created successfully
                response_data = response.json()
                print("Response content:", response_data)
                return JsonResponse({'success': True, 'data': response_data}, status=201)

            elif response.status_code == 204:
                # No content
                return JsonResponse({'success': True, 'message': 'Updated thing'}, status=200)
            
            else:
                # Handle other status codes as needed
                print("Error: Unexpected status code")
                return JsonResponse({'error': 'Unexpected status code'}, status=500)                      

        except:
            return JsonResponse({'error': 'Bad Request'}, status=400)
