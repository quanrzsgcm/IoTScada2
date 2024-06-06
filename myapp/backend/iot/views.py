from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Max
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import make_aware, get_current_timezone
import os
import requests
import json
from base64 import b64encode
from dotenv import load_dotenv
from django.db.models import OuterRef, Subquery, Sum, F

# import view sets from the REST framework
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timezone, timedelta
from django.utils import timezone as django_timezone
import pytz
import calendar
from time import sleep
import paho.mqtt.client as mqtt
# import the PowerMeterDataSerializer from the serializer file
from .serializers import PowerMeterDataSerializer

from .models import PowerMeterData, DailyEnergySum, MonthlyEnergySum, Inverter, InverterMeasurement, InverterState, WeatherStationMeasurement, WeatherStation
from django.db.models import Sum
from django.http import StreamingHttpResponse

# Load environment variables from the .env file
load_dotenv()


# create a class for the Todo model viewsets
class PowerMeterDataView(viewsets.ModelViewSet):
    # create a serializer class and
    # assign it to the TodoSerializer class
    serializer_class = PowerMeterDataSerializer

    # define a variable and populate it
    # with the PowerMeterData list objects
    queryset = PowerMeterData.objects.all()

def time_range_extract(dateString, unitoftime, local_timezone="Asia/Ho_Chi_Minh"):
    try:
        # Attempt to parse with the format "%Y-%m-%dT%H:%M:%S.%fZ%z"
        date_object = datetime.strptime(dateString, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        try:
            # Attempt to parse with the format "%Y-%m-%dT%H:%M:%S.%fZ"
            date_object = datetime.strptime(dateString, "%Y-%m-%dT%H:%M:%S.%fZ%z")
        except ValueError:
            raise ValueError("Invalid date format")

    # Convert the date_object to the local time zone
    date_object = date_object.replace(tzinfo=pytz.UTC)
    date_object_local = date_object.astimezone(pytz.timezone(local_timezone))
    print(f"date_object_local = {date_object_local}")

    start_of_day = date_object_local.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = (start_of_day + timedelta(days=1)) - timedelta(microseconds=1)   

    if unitoftime == "Hour": ## This return 25 values for counting
        intervals = []
        current_start = start_of_day
        while current_start < end_of_day:
            current_end = current_start + timedelta(hours=1, microseconds=-1)
            intervals.append({
                'start': current_start.strftime('%Y-%m-%d %H:%M:%S.%f%z'),
                'end': current_end.strftime('%Y-%m-%d %H:%M:%S.%f%z')
            })
            current_start = current_start + timedelta(hours=1)
        intervals.append({
                'start': current_start.strftime('%Y-%m-%d %H:%M:%S.%f%z'),
                'end': current_start.strftime('%Y-%m-%d %H:%M:%S.%f%z')
            })
        current_start = current_start + timedelta(hours=1)

        return intervals


    if unitoftime == "Day":
        intervals = []
        current_start = start_of_day
        while current_start < end_of_day:
            current_end = current_start + timedelta(hours=1, microseconds=-1)
            intervals.append({
                'start': current_start.strftime('%Y-%m-%d %H:%M:%S.%f%z'),
                'end': current_end.strftime('%Y-%m-%d %H:%M:%S.%f%z')
            })
            current_start = current_start + timedelta(hours=1)
       
        return intervals

    if unitoftime == "OneDay":
        print("First time of the day:", start_of_day)
        print("Last time of the day:", end_of_day)
        return {"start": start_of_day, "end": end_of_day}

    if unitoftime == "Week":
        start_of_week = start_of_day - timedelta(days=start_of_day.weekday())
        end_of_week = start_of_week + timedelta(
            days=6, hours=23, minutes=59, seconds=59, microseconds=999999
        )
        print("Start of the week (Monday):", start_of_week)
        print("End of the week (Sunday):", end_of_week)
        return {"start": start_of_week, "end": end_of_week}

    if unitoftime == "OneWeek":
        intervals = []
        current_start = start_of_day - timedelta(days=start_of_day.weekday())
        for i in range(8):  # Iterate for 8 days
            day_start = current_start + timedelta(days=i)
            day_end = day_start + timedelta(hours=23, minutes=59, seconds=59, microseconds=999999)
            intervals.append({
                'start': day_start.strftime('%Y-%m-%d %H:%M:%S.%f%z'),
                'end': day_end.strftime('%Y-%m-%d %H:%M:%S.%f%z')
            })
        return intervals

    elif unitoftime == "Month":
        start_of_month = start_of_day.replace(day=1)
        _, last_day_of_month = calendar.monthrange(
            start_of_month.year, start_of_month.month
        )
        end_of_month = start_of_month.replace(
            day=last_day_of_month, hour=23, minute=59, second=59, microsecond=999999
        )
        print("Start of the month:", start_of_month)
        print("End of the month:", end_of_month)
        return {"start": start_of_month, "end": end_of_month}

    elif unitoftime == "Year":
        start_of_year = start_of_day.replace(month=1, day=1)
        end_of_year = start_of_year.replace(
            month=12, day=31, hour=23, minute=59, second=59, microsecond=999999
        )
        print("Start of the year:", start_of_year)
        print("End of the year:", end_of_year)
        return {"start": start_of_year, "end": end_of_year}

    else:
        raise ValueError(f"Invalid unitoftime: {unitoftime}")


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def specific_element_test(request):
    print(request.user)
    print(request.user.first_name)
    print(request.user.timezone)

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            print(data)
            user = request.user

            print(user.first_name)
            print(user.first_name)
            print(user.first_name)
            
            thingid = data.get("thingid").split(":")
            thingid = thingid[1]
            typeofmeasurement = data.get("typeofmeasurement")
            typeofmeasurement_values = [value.lower() for value in typeofmeasurement]
            user_input_timezone = request.user.timezone
            try:
                user_timezone = pytz.timezone(user_input_timezone)
            except pytz.UnknownTimeZoneError:
                # Use a default time zone if the user-provided time zone is invalid
                user_timezone = pytz.timezone("Asia/Ho_Chi_Minh")

            unitoftime = data.get("unitoftime")
            dateString = data.get("dateString")
            timeRange = time_range_extract(dateString, unitoftime, user_input_timezone)
            print(timeRange["start"])
            print(timeRange["end"])

            result_list = []

            # Query PowerMeterData for the specified time range
            if unitoftime == "Day":
                query = PowerMeterData.objects.filter(
                    meter_id=thingid,
                    timestamp__gte=timeRange["start"],
                    timestamp__lte=timeRange["end"],
                ).values("meter_id", "timestamp", *typeofmeasurement_values)
                result_list = list(query)

            elif unitoftime == "Week":
                query = PowerMeterData.objects.filter(
                    meter_id=thingid,
                    timestamp__gte=timeRange["start"],
                    timestamp__lte=timeRange["end"],
                ).values("meter_id", "timestamp", *typeofmeasurement_values)
                result_list = list(query)

            elif unitoftime == "Month":
                query = PowerMeterData.objects.filter(
                    meter_id=thingid,
                    timestamp__gte=timeRange["start"],
                    timestamp__lte=timeRange["end"],
                ).values("meter_id", "timestamp", *typeofmeasurement_values)
                result_list = list(query)

            elif unitoftime == "Year":
                query = PowerMeterData.objects.filter(
                    meter_id=thingid,
                    timestamp__gte=timeRange["start"],
                    timestamp__lte=timeRange["end"],
                ).values("meter_id", "timestamp", *typeofmeasurement_values)
                result_list = list(query)
            else:
                return JsonResponse({"error": "Invalid unit of time"})

            for result in result_list:
                result["timestamp"] = result["timestamp"].astimezone(user_timezone)
                print(result)
            return JsonResponse(result_list, safe=False)

        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=200)

@csrf_exempt
def my_api_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            start_time = data.get("start_time")
            end_time = data.get("end_time")
            print(start_time)
            print(end_time)

            # Handle the incoming request with the specified time range

            # Query the database for records within the specified time range
            power_data = PowerMeterData.objects.filter(
                timestamp__gte=start_time, timestamp__lte=end_time
            )

            # Serialize the query result to JSON
            serialized_data = [
                {
                    "id": entry.id,
                    "meter_id": entry.meter_id,
                    "power": entry.power,
                    "voltage": entry.voltage,
                    "current": entry.current,
                    "timestamp": entry.timestamp,
                }
                for entry in power_data
            ]
            # return JsonResponse({'empty': True})
            return JsonResponse(serialized_data, safe=False)

        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    elif request.method == "GET":
        return JsonResponse({"error": "Invalid request method"}, status=200)

@permission_classes([IsAuthenticated])
def proxy_view(request):
    # target_url = (
    #     "http://localhost:8080/api/2/things"  # Replace with your actual target URL
    # )
    # # Extract authentication headers from the incoming request
    # auth_headers = {}
    # for header, value in request.headers.items():
    #     if header.startswith("Authorization"):
    #         auth_headers[header] = value

    # Retrieve the base URL from the environment
    target_url = os.getenv("BASE_URL_GET_ALL_THING")
  
    print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)

    data = response.json()
    print(data)

    return JsonResponse(data, safe=False)


@csrf_exempt
@permission_classes([IsAuthenticated])
def create_powermeter_twin(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            # Access the values in the JSON data
            id_value = data.get("id")
            policy_id_value = data.get("policyId")
            attributes = data.get("attributes", {})
            manufacturer_value = attributes.get("manufacturer")
            location_value = attributes.get("location")
            serial_number_value = attributes.get("serial number")

            # Do something with the values
            print("Policy ID:", policy_id_value)
            print("ID:", id_value)
            print("Manufacturer:", manufacturer_value)
            print("Location:", location_value)
            print("Serial Number:", serial_number_value)

            data.pop("id", None)
            print(json.dumps(data, indent=2))

            # target_url = f"http://localhost:8080/api/2/things/my.power:pm{id_value}"

             # Retrieve the base URL from the environment
            base_url = os.getenv("BASE_URL_CREATE_PM")
          
            # Construct the target_url by concatenating base_url with id_value
            target_url = f"{base_url}{id_value}"

            print("Target URL:", target_url)

            username = os.getenv("USERNAME")
            password = os.getenv("PASSWORD")
       
            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
            }

            # Forward the request to the target URL with authentication headers
            response = requests.put(target_url, headers=headers, json=data)
            print("Response status code2:", response.status_code)

            response.raise_for_status()

            # Handle the response as needed
            print("Response status code3:", response.status_code)

            if response.status_code == 200:
                # Successful response
                response_data = response.json()
                print("Response content:", response_data)
                return JsonResponse({"success": True, "data": response_data})

            elif response.status_code == 201:
                # Resource created successfully
                response_data = response.json()
                print("Response content:", response_data)
                return JsonResponse(
                    {"success": True, "data": response_data}, status=201
                )

            elif response.status_code == 204:
                # No content
                return JsonResponse(
                    {"success": True, "message": "Updated thing"}, status=200
                )

            else:
                # Handle other status codes as needed
                print("Error: Unexpected status code")
                return JsonResponse({"error": "Unexpected status code"}, status=500)

        except:
            return JsonResponse({"error": "Bad Request"}, status=400)
        
def really_calculate_daily_energy(dateString):
    timeRange = time_range_extract(
            dateString, "Day", local_timezone="Asia/Ho_Chi_Minh"
        )
    start_timestamp = timeRange["start"]
    end_timestamp = timeRange["end"]

    # Check if an entry with the same end_timestamp already exists
    existing_entry = DailyEnergySum.objects.filter(end_of_day=end_timestamp).first()
    if existing_entry:
        print(f"Entry for {end_timestamp} = {existing_entry.total_energy} already exists. Skipping creation.")
        return {'total_energy': existing_entry.total_energy, 'end_timestamp': end_timestamp}

    print(f"start_timestamp: {start_timestamp}")

    # Query the latest entry for each meter_id
    latest_entries = PowerMeterData.objects.filter(
        timestamp__gte=start_timestamp, timestamp__lte=end_timestamp
    ).values('meter_id').annotate(latest_timestamp=Max('timestamp')).order_by('meter_id')

    print(latest_entries)
    
    total_energy_of_day = 0
    # Access the latest entries and print the details
    for entry in latest_entries:
        meter_id = entry['meter_id']
        latest_timestamp = entry['latest_timestamp']
        latest_entry = PowerMeterData.objects.filter(
            meter_id=meter_id, timestamp=latest_timestamp
        ).values('energy').first()

        total_energy_of_day += latest_entry['energy']

    # Create an instance of the DailyEnergySummary model
    daily_energy_summary = DailyEnergySum()

    # Set the fields with the calculated values
    daily_energy_summary.total_energy = total_energy_of_day
    daily_energy_summary.end_of_day = end_timestamp
    

    # Save the instance to the database
    daily_energy_summary.save()
    print(f"Entry for {end_timestamp} = {daily_energy_summary.total_energy} has been saved.")
    return {'total_energy': total_energy_of_day, 'end_timestamp': end_timestamp}

@csrf_exempt
@permission_classes([IsAuthenticated])
def calculate_daily_energy(request): # my-api/energy/
    if request.method == "POST":
        try:
            # Get the date from the form or request data
            data = json.loads(request.body.decode("utf-8"))
            dateString = data.get("dateString")
            data = really_calculate_daily_energy(dateString)
            return JsonResponse(data)
            
        except Exception as e:
            # Catch the exception and print the error
            print(f"An error occurred: {str(e)}")

    return JsonResponse({"error": "Invalid request method. Please use POST."})

def get_list_of_day(unitoftime, start_time, end_time):
    if unitoftime == "Day":
        pass

    elif unitoftime == "Week":
        days_in_week = [(start_time + timedelta(days=i)).strftime("%Y-%m-%dT%H:%M:%S.%fZ") for i in range(7)]
        days_in_week = [(start_time + timedelta(days=i)).strftime("%Y-%m-%dT%H:%M:%S.%fZ%z") for i in range(7)]
        print(days_in_week)
        return days_in_week

    elif unitoftime == "Month":
        days_in_month = [(start_time + timedelta(days=i)).strftime("%Y-%m-%dT%H:%M:%S.%fZ%z") for i in range((end_time - start_time).days + 1)]
        print(days_in_month)
        return days_in_month
    return None

def update_monthly_energy(list_of_day_in_month):
    total_energy_of_month = 0

    # Parse the date string
    date_object = datetime.strptime(list_of_day_in_month[-1], "%Y-%m-%dT%H:%M:%S.%fZ%z")

    # Extract the month in the format YYYY-MM-DD
    month = date_object.strftime("%Y-%m-%d")

    for entry in list_of_day_in_month:
        print(f'entry {entry}')
        # Convert the string to a datetime object
        entry_datetime = datetime.strptime(entry, "%Y-%m-%dT%H:%M:%S.%fZ%z")
        print(f'entry_datetime {entry_datetime}')
        entry_datetime = entry_datetime.replace(hour=23, minute=59, second=59, microsecond=999999)
        print(f'entry_datetime {entry_datetime}')

        # Access the latest entries and print the details
        entry_energy = DailyEnergySum.objects.filter(
            end_of_day=entry_datetime
        ).values('total_energy').first()

        print(f'entry_energy {entry_energy}')

        if entry_energy:
            total_energy_of_month += entry_energy['total_energy']
    
    print(f'total_energy_of_month {total_energy_of_month}')

    # Create an instance of the DailyEnergySummary model
    monthly_energy_summary = MonthlyEnergySum()

    # Set the fields with the calculated values
    monthly_energy_summary.total_energy = total_energy_of_month
    monthly_energy_summary.month = month
    
    # Save the instance to the database
    monthly_energy_summary.save()
    return total_energy_of_month

def check_energy_month(dateString):
    print(f'dateString = {dateString}')

    end_of_month = time_range_extract(dateString,"Month")

    print(f'end_of_month = {end_of_month}')

     # Access the latest entries and print the details
    entry_energy = MonthlyEnergySum.objects.filter(
        end_of_month=end_of_month
    ).values('total_energy').first()

    print(f'entry_energy {entry_energy}')

    if entry_energy:
        total_energy_of_month += entry_energy['total_energy']


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_energy_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            print(data)
            user_input_timezone = request.user.timezone
            try:
                user_timezone = pytz.timezone(user_input_timezone)
            except pytz.UnknownTimeZoneError:
                # Use a default time zone if the user-provided time zone is invalid
                user_timezone = pytz.timezone("Asia/Ho_Chi_Minh")

    
            meter_id = data.get("thingid").split(":")
            meter_id = meter_id[1]
            
            unitoftime = data.get("unitoftime")
            dateString = data.get("dateString")
            timeRange = time_range_extract(dateString, unitoftime, user_input_timezone)
            
            result = timeRange
            startTime = timeRange["start"]
            endTime = timeRange["end"]                                            

            if unitoftime == "Day":    

                # Query to get all unique meter_id values
                unique_meter_ids = PowerMeterData.objects.values('meter_id').distinct()

                # Extract the unique meter_id values from the queryset
                
                
                endTimeOfTheDayBefore = endTime - timedelta(days=1)
                print(endTime)           
                print(endTimeOfTheDayBefore)
                energy_query_end = PowerMeterData.objects.filter(
                    meter_id=meter_id,
                    timestamp__lte=endTime
                ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
           
               

                energy_query_start = PowerMeterData.objects.filter(
                    meter_id=meter_id,
                    timestamp__lte=endTimeOfTheDayBefore
                ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
                
                if energy_query_end is None or energy_query_end['energy'] is None:
                    energy_end = 0
                else :
                    energy_end = energy_query_end['energy']

                if energy_query_start is None or energy_query_start['energy'] is None:
                    energy_start = 0
                else :
                    energy_start = energy_query_start['energy']
                    
                temp = {
                    'energy_measured' : energy_end - energy_start,
                    'endOfDay' : endTime
                }
             
                return JsonResponse(temp)
                
            elif unitoftime == "Week":                
                result = get_energy("Week", startTime, endTime, meter_id)
                                                                           
                return JsonResponse(result, safe=False)
                
            elif unitoftime == "Month":
                print('endTime of month', endTime)                
                result = get_energy("Month", startTime, endTime, meter_id)
                return JsonResponse(result, safe=False)
                

            elif unitoftime == "Year":
                print('endTime of month', endTime)                
                result = get_energy("Year", startTime, endTime, meter_id)
                return JsonResponse(result, safe=False)

            return JsonResponse(result, safe=False)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"})
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=200)

def get_energy(unitoftime, startTime, endTime, meter_id):
    print('endTime')
    print(endTime)
    result = []
    if unitoftime == "Week":
        endTimeOfTheDayBefore = endTime - timedelta(days=7)
        print('endTimeOfTheDayBefore')
        print(endTimeOfTheDayBefore)
        
        for i in range(7):
            print(f"Loop : {i+1}")

            endOfNextDay = endTimeOfTheDayBefore + timedelta(days=1)
            print('endOfNextDay')
            print(endOfNextDay)

            energy_query_end = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endOfNextDay
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
            
           

            energy_query_start = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTimeOfTheDayBefore
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record

           

            if energy_query_end is None or energy_query_end['energy'] is None:
                energy_end = 0
            else :
                energy_end = energy_query_end['energy']

            if energy_query_start is None or energy_query_start['energy'] is None:
                energy_start = 0
            else :
                energy_start = energy_query_start['energy']
                
            temp = {
                'energy_measured' : energy_end - energy_start,
                'endOfDay' : endOfNextDay
            }
            
            
            result.append(temp)

            endTimeOfTheDayBefore = endOfNextDay
            print('endTimeOfTheDayBefore')
            print(endTimeOfTheDayBefore)
        return result

    if unitoftime == "Month":
        year = endTime.year
        month = endTime.month

        # Use the calendar module to get the number of days in the specified month
        num_days_in_month = calendar.monthrange(year, month)[1]
        print('num_days_in_month')
        print(num_days_in_month)

        endTimeOfTheDayBefore = endTime - timedelta(days=num_days_in_month)
        print('endTimeOfTheDayBefore')
        print(endTimeOfTheDayBefore)
        
        for i in range(num_days_in_month):
            print(f"Loop : {i+1}")

            endOfNextDay = endTimeOfTheDayBefore + timedelta(days=1)
            print('endOfNextDay')
            print(endOfNextDay)

            energy_query_end = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endOfNextDay
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
            
            energy_query_start = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTimeOfTheDayBefore
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record


            if energy_query_end is None or energy_query_end['energy'] is None:
                energy_end = 0
            else :
                energy_end = energy_query_end['energy']

            if energy_query_start is None or energy_query_start['energy'] is None:
                energy_start = 0
            else :
                energy_start = energy_query_start['energy']
                
            temp = {
                'energy_measured' : energy_end - energy_start,
                'endOfDay' : endOfNextDay
            }
            
            
            result.append(temp)

            endTimeOfTheDayBefore = endOfNextDay
            print('endTimeOfTheDayBefore')
            print(endTimeOfTheDayBefore)

        return result

    if unitoftime == "Year":
        year = endTime.year
        num_days_in_year = calendar.isleap(year) and 366 or 365
        print('num_days_in_year')
        print(num_days_in_year)

        endTimeOfTheDayBefore = endTime - timedelta(days=num_days_in_year)
        print('endTimeOfTheDayBefore')
        print(endTimeOfTheDayBefore)
        
        for i in range(num_days_in_year):
            print(f"Loop : {i+1}")

            endOfNextDay = endTimeOfTheDayBefore + timedelta(days=1)
            print('endOfNextDay')
            print(endOfNextDay)

            energy_query_end = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endOfNextDay
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
            
            

            energy_query_start = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTimeOfTheDayBefore
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record

            
            if energy_query_end is None or energy_query_end['energy'] is None:
                energy_end = 0
            else :
                energy_end = energy_query_end['energy']

            if energy_query_start is None or energy_query_start['energy'] is None:
                energy_start = 0
            else :
                energy_start = energy_query_start['energy']
                
            temp = {
                'energy_measured' : energy_end - energy_start,
                'endOfDay' : endOfNextDay
            }
            
            result.append(temp)

            endTimeOfTheDayBefore = endOfNextDay
            print('endTimeOfTheDayBefore')
            print(endTimeOfTheDayBefore)

        return result

    return result

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_total_energy_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            print(data)
            user_input_timezone = request.user.timezone
            try:
                user_timezone = pytz.timezone(user_input_timezone)
            except pytz.UnknownTimeZoneError:
                # Use a default time zone if the user-provided time zone is invalid
                user_timezone = pytz.timezone("Asia/Ho_Chi_Minh")
                       
            unitoftime = data.get("unitoftime")
            dateString = data.get("dateString")
            timeRange = time_range_extract(dateString, unitoftime, user_input_timezone)
            
            result = timeRange
            startTime = timeRange["start"]
            endTime = timeRange["end"]       

            # Query to get all unique meter_id values
            unique_meter_ids = PowerMeterData.objects.values('meter_id').distinct().order_by('meter_id')

            # Extract the unique meter_id values from the queryset
            unique_meter_ids_list = [entry['meter_id'] for entry in unique_meter_ids]

            print(unique_meter_ids_list)

            if unitoftime == "Day":

                endTimeOfTheDayBefore = endTime - timedelta(days=1)
                print(endTime)           
                print(endTimeOfTheDayBefore)

                # Initialize a variable to store the total energy sum
                total_energy_sum = 0
                
                for meter_id in unique_meter_ids_list:

                    energy_query_end = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTime
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
                 
                 
                    energy_query_start = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTimeOfTheDayBefore
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record

                     

                    if energy_query_end is None or energy_query_end['energy'] is None:
                        energy_end = 0
                    else :
                        energy_end = energy_query_end['energy']

                    if energy_query_start is None or energy_query_start['energy'] is None:
                        energy_start = 0
                    else :
                        energy_start = energy_query_start['energy']
                        
                    temp = {
                        'total_energy_measured' : energy_end - energy_start,
                        'endOfDay' : endTime
                    }  

                                     
                    energy_measured = energy_end - energy_start

                    total_energy_sum += energy_measured

                return JsonResponse({"total_energy_measured": total_energy_sum,"endOfDay": endTime})
                
            elif unitoftime == "Week":
                total_energy_sum = 0
                result = []
                week_day = []
                
            
                for meter_id in unique_meter_ids_list:       
                    temp = get_total_energy("Week", startTime, endTime, meter_id)
                    print(temp)
                    result.append(temp)
                    

                # Create a dictionary to store cumulative energy values for each endOfDay
                cumulative_energy_dict = {}

                # Iterate through the nested lists and update the cumulative values
                for nested_list in result:
                    for entry in nested_list:
                        end_of_day = entry["endOfDay"]
                        energy_measured = float(entry["total_energy_measured"])

                        # Check if the key exists in the dictionary
                        if end_of_day in cumulative_energy_dict:
                            cumulative_energy_dict[end_of_day] += energy_measured
                        else:
                            cumulative_energy_dict[end_of_day] = energy_measured

                # Convert the dictionary back to the desired list format
                result_list = [{"total_energy_measured": str(value), "endOfDay": key} for key, value in cumulative_energy_dict.items()]

                # Create a list containing the result_list
                final_result = [result_list]

                return JsonResponse(final_result,safe=False)                                                                       
                
                
            elif unitoftime == "Month":
                result = []
                print('endTime of month', endTime)    
                for meter_id in unique_meter_ids_list:       
                    temp = get_total_energy("Month", startTime, endTime, meter_id)
                    print(temp)
                    result.append(temp)

                # Create a dictionary to store cumulative energy values for each endOfDay
                cumulative_energy_dict = {}

                # Iterate through the nested lists and update the cumulative values
                for nested_list in result:
                    for entry in nested_list:
                        end_of_day = entry["endOfDay"]
                        energy_measured = float(entry["total_energy_measured"])

                        # Check if the key exists in the dictionary
                        if end_of_day in cumulative_energy_dict:
                            cumulative_energy_dict[end_of_day] += energy_measured
                        else:
                            cumulative_energy_dict[end_of_day] = energy_measured

                # Convert the dictionary back to the desired list format
                result_list = [{"total_energy_measured": str(value), "endOfDay": key} for key, value in cumulative_energy_dict.items()]

                # Create a list containing the result_list
                final_result = [result_list]

                return JsonResponse(final_result,safe=False)        
                        

            elif unitoftime == "Year":
                print('endTime of month', endTime)      
                result = []
                for meter_id in unique_meter_ids_list:       
                    temp = get_total_energy("Year", startTime, endTime, meter_id)
                    print(temp)
                    result.append(temp)
                
                # Create a dictionary to store cumulative energy values for each endOfDay
                cumulative_energy_dict = {}

                # Iterate through the nested lists and update the cumulative values
                for nested_list in result:
                    for entry in nested_list:
                        end_of_day = entry["endOfDay"]
                        energy_measured = float(entry["total_energy_measured"])

                        # Check if the key exists in the dictionary
                        if end_of_day in cumulative_energy_dict:
                            cumulative_energy_dict[end_of_day] += energy_measured
                        else:
                            cumulative_energy_dict[end_of_day] = energy_measured

                # Convert the dictionary back to the desired list format
                result_list = [{"total_energy_measured": str(value), "endOfDay": key} for key, value in cumulative_energy_dict.items()]

                # Create a list containing the result_list
                final_result = [result_list]

                return JsonResponse(final_result,safe=False)     

            return JsonResponse(result, safe=False)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"})
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=200)

def get_total_energy(unitoftime, startTime, endTime, meter_id):
    print('endTime')
    print(endTime)
    result = []
    if unitoftime == "Week":
        endTimeOfTheDayBefore = endTime - timedelta(days=7)
        print('endTimeOfTheDayBefore')
        print(endTimeOfTheDayBefore)
        
        for i in range(7):
            print(f"Loop : {i+1}")

            endOfNextDay = endTimeOfTheDayBefore + timedelta(days=1)
            print('endOfNextDay')
            print(endOfNextDay)

            energy_query_end = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endOfNextDay
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
                                 
            energy_query_start = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTimeOfTheDayBefore
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
                      
            
            if energy_query_end is None or energy_query_end['energy'] is None:
                energy_end = 0
            else :
                energy_end = energy_query_end['energy']

            if energy_query_start is None or energy_query_start['energy'] is None:
                energy_start = 0
            else :
                energy_start = energy_query_start['energy']
                
            temp = {
                'total_energy_measured' : energy_end - energy_start,
                'endOfDay' : endOfNextDay
            }
            result.append(temp)

            endTimeOfTheDayBefore = endOfNextDay
            print('endTimeOfTheDayBefore')
            print(endTimeOfTheDayBefore)
        return result

    if unitoftime == "Month":
        year = endTime.year
        month = endTime.month

        # Use the calendar module to get the number of days in the specified month
        num_days_in_month = calendar.monthrange(year, month)[1]
        print('num_days_in_month')
        print(num_days_in_month)

        endTimeOfTheDayBefore = endTime - timedelta(days=num_days_in_month)
        print('endTimeOfTheDayBefore')
        print(endTimeOfTheDayBefore)
        
        for i in range(num_days_in_month):
            print(f"Loop : {i+1}")

            endOfNextDay = endTimeOfTheDayBefore + timedelta(days=1)
            print('endOfNextDay')
            print(endOfNextDay)

            energy_query_end = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endOfNextDay
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
                

            energy_query_start = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTimeOfTheDayBefore
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record

            if energy_query_end is None or energy_query_end['energy'] is None:
                energy_end = 0
            else :
                energy_end = energy_query_end['energy']

            if energy_query_start is None or energy_query_start['energy'] is None:
                energy_start = 0
            else :
                energy_start = energy_query_start['energy']
                
            temp = {
                'total_energy_measured' : energy_end - energy_start,
                'endOfDay' : endOfNextDay
            }
            
        
            result.append(temp)

            endTimeOfTheDayBefore = endOfNextDay
            print('endTimeOfTheDayBefore')
            print(endTimeOfTheDayBefore)

        return result

    if unitoftime == "Year":
        year = endTime.year
        num_days_in_year = calendar.isleap(year) and 366 or 365
        print('num_days_in_year')
        print(num_days_in_year)

        endTimeOfTheDayBefore = endTime - timedelta(days=num_days_in_year)
        print('endTimeOfTheDayBefore')
        print(endTimeOfTheDayBefore)
        
        for i in range(num_days_in_year):
            print(f"Loop : {i+1}")

            endOfNextDay = endTimeOfTheDayBefore + timedelta(days=1)
            print('endOfNextDay')
            print(endOfNextDay)

            energy_query_end = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endOfNextDay
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record
            
    
            energy_query_start = PowerMeterData.objects.filter(
                        meter_id=meter_id,
                        timestamp__lte=endTimeOfTheDayBefore
                    ).order_by('-timestamp').values("meter_id", "energy","timestamp").first()  # Order by timestamp in descending order and take the first record

           

            if energy_query_end is None or energy_query_end['energy'] is None:
                energy_end = 0
            else :
                energy_end = energy_query_end['energy']

            if energy_query_start is None or energy_query_start['energy'] is None:
                energy_start = 0
            else :
                energy_start = energy_query_start['energy']
                
            temp = {
                'total_energy_measured' : energy_end - energy_start,
                'endOfDay' : endOfNextDay
            }
            
            
            result.append(temp)

            endTimeOfTheDayBefore = endOfNextDay
            print('endTimeOfTheDayBefore')
            print(endTimeOfTheDayBefore)

        return result

    return result


@csrf_exempt
def realtimesitekpi(request):
    # Retrieve the base URL from the environment
    target_url = os.getenv("BASE_URL_DITTO")  
    target_url = target_url + '/api/2/search/things?namespaces=my.inverter&option=size(200)'
    print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)
    data = response.json()
    print(json.dumps(data, indent=4))
    # Initialize total capacity
    total_capacity = 0

    # Loop through items and sum up the capacity for each item
    for item in data["items"]:
        total_capacity += item["features"]["measurements"]["properties"]["capacity"]

    print("Total Capacity:", total_capacity)

    total_activePower = 0

    for item in data["items"]:
        total_activePower += item["features"]["measurements"]["properties"]["activePower"]

    print("Total Active Power:", total_activePower)


    # Retrieve the base URL from the environment
    target_url = os.getenv("BASE_URL_DITTO")  
    target_url = target_url + '/api/2/search/things?namespaces=my.ws&option=size(200)'
    print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)
    data = response.json()
    print(json.dumps(data, indent=4))

    site_temp_total = 0
    site_irradiance_total = 0
    num_items = len(data["items"])

    for item in data["items"]:
        site_temp_total += item["features"]["measurements"]["properties"]["temperature"]
        site_irradiance_total += item["features"]["measurements"]["properties"]["irradiance"]

    if num_items > 0:
        average_temp = site_temp_total / num_items
        average_irradiance = site_irradiance_total / num_items
    else:
        average_temp = 0
        average_irradiance = 0

    print("Total temp:", site_temp_total)
    print("Average temp:", average_temp)
    print("Total irradiance:", site_irradiance_total)
    print("Average irradiance:", average_irradiance)
    return JsonResponse({'dev': 'siteId parameter is missing'})
   

@csrf_exempt
def realtimesitedata(request):
    site_id = request.GET.get('siteId')
    if site_id:
        # Retrieve the base URL from the environment
        target_url = os.getenv("BASE_URL_DITTO")
        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")

        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
        }

        tempurl = "/api/2/things/my.inverter:inv"
        tempurl = target_url + tempurl   
        unique_inverter_ids = Inverter.objects.values_list('inverterID', flat=True).distinct()
        print(unique_inverter_ids)

        # Converting the result to a list of IDs
        unique_inverter_ids = list(unique_inverter_ids)
        print(unique_inverter_ids) 

        print("Target URL:", target_url)

        total_capacity = 0

        for inverter_id in unique_inverter_ids:
            target_url = tempurl + str(inverter_id)

            
            # Forward the request to the target URL with authentication headers
            response = requests.get(target_url, headers=headers)
            data = response.json()
            total_capacity += data['features']['measurements']['properties']['capacity']
            print(total_capacity)
            print(total_capacity)
            print(total_capacity)

        target_url = os.getenv("BASE_URL_DITTO")

        tempurl = "/api/2/things/my.ws:ws1"
        tempurl = target_url + tempurl 

        response = requests.get(tempurl, headers=headers)
        print(response.text)
        print(response.status_code)
        data = response.json()
        site_temp = data['features']['measurements']['properties']['temperature']
        print(site_temp)
        print(site_temp)
        print(site_temp)

        irradiation = data['features']['measurements']['properties']['irradiation']
        print(irradiation)
        print(irradiation)
        print(irradiation)    

        irradiance = data['features']['measurements']['properties']['irradiance']
        
        result = {
            'irradiation' : irradiation,
            'temperature': site_temp,
            'capacity': total_capacity,
            'irradiance': irradiance                       
        }

        return JsonResponse(result)
    else:
        return JsonResponse({'error': 'siteId parameter is missing'}, status=400)

def total_energy_view(request):
    # 1. Get the intervals from the dateString send by Frontend
    # 2. Do calculate for one inverter with ID for all the intervals


    # Define the target datetime
    input_str = '2024-05-13T17:00:00.000Z'
    intervals = time_range_extract(input_str,"Day")
    # for interval in intervals:
    #     print(interval['end'])
    # Perform the ORM query
    for interval in intervals:
        print('==================')
        start_target_datetime = interval['start']
        start_measurements = InverterMeasurement.objects.filter(
        inverter_id=1,  # Assuming '1' is the ID of the desired inverter
        timestamp__gte=start_target_datetime
        ).order_by('timestamp').first()

        ho_chi_minh_tz = pytz.timezone('Asia/Ho_Chi_Minh')
        converted_time = start_measurements.timestamp.astimezone(ho_chi_minh_tz)
        print(converted_time)

        end_target_datetime = interval['end']        
        end_measurements = InverterMeasurement.objects.filter(
        inverter_id=1,  # Assuming '1' is the ID of the desired inverter
        timestamp__lte=end_target_datetime
        ).order_by('-timestamp').first()

        converted_time = end_measurements.timestamp.astimezone(ho_chi_minh_tz)
        print(converted_time)
    return JsonResponse({"result": "latest_measurement"})
    

def test_function_for_active(dateString):
    interval = time_range_extract(dateString, "Hour")
    for mini in interval:
        print(mini)
    print("end")

def one_inverter_production_and_irradiation_week(dateString, inverter_id):
    intervals = time_range_extract(dateString, "OneWeek")
    list_of_days = ['T2','T3','T4','T5','T6','T7','CN']
    result = []
    i = 0
    for interval in intervals:
        print(interval)
        if i >= 7:
            break

        latest_measurement = InverterMeasurement.objects.filter(
            timestamp__gte=intervals[i+1]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('meterReadTotalEnergy').first()

        latest_measurement_irradiation = WeatherStationMeasurement.objects.filter(
            timestamp__gte=intervals[i+1]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('irradiation').first()

        # If you want the value directly
        if latest_measurement is None:
            break

        if latest_measurement_irradiation is None:
            break


        meter_read_total_energy_start_next = latest_measurement['meterReadTotalEnergy'] if latest_measurement else None
        print(meter_read_total_energy_start_next)

        irradiation_start_next = latest_measurement_irradiation['irradiation'] if latest_measurement_irradiation else None
        print(irradiation_start_next)

        # Assuming you have a model InverterMeasurement
        latest_measurement = InverterMeasurement.objects.filter(
            timestamp__gte=intervals[i]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('meterReadTotalEnergy').first()

        latest_measurement_irradiation = WeatherStationMeasurement.objects.filter(
            timestamp__gte=intervals[i]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('irradiation').first()

        # If you want the value directly
        meter_read_total_energy_start = latest_measurement['meterReadTotalEnergy'] if latest_measurement else None
        print(meter_read_total_energy_start)

        irradiation_start = latest_measurement_irradiation['irradiation'] if latest_measurement_irradiation else None
        print(irradiation_start)

        new_point = {
            'period': list_of_days[i],
            'production': meter_read_total_energy_start_next - meter_read_total_energy_start,
            'irradiation': irradiation_start_next - irradiation_start 
        }

        result.append(new_point)
        print('---------------------------')      
        i+=1

    return result 

def one_inverter_production_and_irradiation(dateString, inverter_id):
    intervals = time_range_extract(dateString, "Hour")  

    list_of_hours = [f"{hour}:00" for hour in range(24)]

    # print(list_of_hours)

    result = []
    i = 0
    for interval in intervals:
        if i >= 24:
            break
        # print(intervals[i])
        # print(f'i = {i}')

        # print(intervals[i+1]['start'])
        # print(intervals[i]['start'])

        latest_measurement = InverterMeasurement.objects.filter(
            timestamp__gte=intervals[i+1]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('meterReadTotalEnergy').first()

        latest_measurement_irradiation = WeatherStationMeasurement.objects.filter(
            timestamp__gte=intervals[i+1]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('irradiation').first()

        # If you want the value directly
        if latest_measurement is None:
            break

        if latest_measurement_irradiation is None:
            break


        meter_read_total_energy_start_next = latest_measurement['meterReadTotalEnergy'] if latest_measurement else None
        # print(meter_read_total_energy_start_next)

        irradiation_start_next = latest_measurement_irradiation['irradiation'] if latest_measurement_irradiation else None
        # print(irradiation_start_next)

        # Assuming you have a model InverterMeasurement
        latest_measurement = InverterMeasurement.objects.filter(
            timestamp__gte=intervals[i]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('meterReadTotalEnergy').first()

        latest_measurement_irradiation = WeatherStationMeasurement.objects.filter(
            timestamp__gte=intervals[i]['start'],
            inverter_id=inverter_id
        ).order_by('timestamp').values('irradiation').first()

        # If you want the value directly
        meter_read_total_energy_start = latest_measurement['meterReadTotalEnergy'] if latest_measurement else None
        # print(meter_read_total_energy_start)

        irradiation_start = latest_measurement_irradiation['irradiation'] if latest_measurement_irradiation else None
        # print(irradiation_start)

        new_point = {
            'period': list_of_hours[i],
            'production': meter_read_total_energy_start_next - meter_read_total_energy_start,
            'irradiation': irradiation_start_next - irradiation_start 
        }

        result.append(new_point)
        i+=1
        continue
    return result

@csrf_exempt   
def inverter_productionirradiation(request):
    body = json.loads(request.body)
    print(body)  # Print the whole body for debugging
    inverter_id = body.get('inverter_id')
    parts = inverter_id.split(":")
    inverter_id = parts[1][3:]
    inverter_id = int(inverter_id)
    print(inverter_id) 
    # Extract the date string
    date_string = body.get('date')
    unitoftime = body.get('unitoftime')
    if unitoftime == 'Week':
        result = one_inverter_production_and_irradiation_week(date_string, inverter_id)
        result = list(result)
        return JsonResponse(result, safe=False)


    elif unitoftime == 'Day':
        result = one_inverter_production_and_irradiation(date_string, inverter_id)
        result = list(result)
        return JsonResponse(result, safe=False)

    return JsonResponse({'error':'Internal Server Error'})

@csrf_exempt
def get_site_history_right(request):
    body = json.loads(request.body)
    print(body)  # Print the whole body for debugging
    # Extract the date string
    date_string = body.get('date')
    unitoftime = body.get('unitoftime')
    if unitoftime == 'Week':
        # result = one_inverter_production_and_irradiation_week(date_string, inverter_id)
        result = list(result)
        return JsonResponse(result, safe=False)


    elif unitoftime == 'Day':
        # Querying for unique inverter IDs
        unique_inverter_ids = Inverter.objects.values_list('inverterID', flat=True).distinct()
        print(unique_inverter_ids)

        # Converting the result to a list of IDs
        unique_inverter_ids = list(unique_inverter_ids)
        print(unique_inverter_ids)        
       
        result1 = one_inverter_production_and_irradiation(date_string, 1)
        print(result1)
        result2 = one_inverter_production_and_irradiation(date_string, 2)
        print(result2)


        result = list(result1)
        return JsonResponse(result, safe=False)    

    return JsonResponse({'error': 'Out of bound unit of time'}, status=500)


@csrf_exempt
def get_site_history_right_really(request):
    print("called")
    body = json.loads(request.body)
    print(body)  # Print the whole body for debugging
    # Extract the date string
    date_string = body.get('date')
    unitoftime = body.get('unitoftime')
    
    if date_string:
        if unitoftime == 'Day':
            time_range = time_range_extract(date_string, "OneDay")
            start, end = time_range['start'], time_range['end']
            print("Start:", start)
            print("End:", end)

            measurements = InverterMeasurement.objects.filter(
                        inverter_id=1,
                        timestamp__gte=start,
                        timestamp__lte=end,
                    ).order_by('timestamp')
            
            # Serialize the queryset into a list of dictionaries
            measurement_list = list(measurements.values())

            # Convert the timestamp to UTC+7
            for measurement in measurement_list:
                utc_timestamp = measurement['timestamp']
                # Assuming the timestamps are already aware and in UTC, adjust by 7 hours
                utc_plus_7_timestamp = utc_timestamp + timedelta(hours=7)
                measurement['timestamp'] = utc_plus_7_timestamp.isoformat()
                utc_timestamp = measurement['timestamp']
                # Extract only the time part (hours and minutes)
                time_part = utc_timestamp.split('T')[1][:5]
                measurement['timestamp'] = time_part


            return JsonResponse(measurement_list, safe=False)     

        if unitoftime == "Week":
            time_range = time_range_extract(date_string, unitoftime)
            start, end = time_range['start'], time_range['end']
            print("Start:", start)
            print("End:", end)

            measurements = InverterMeasurement.objects.filter(
                        inverter_id=1,
                        timestamp__gte=start,
                        timestamp__lte=end,
                    ).order_by('timestamp')
            
            # Serialize the queryset into a list of dictionaries
            measurement_list = list(measurements.values())

            # Convert the timestamp to UTC+7
            for measurement in measurement_list:
                utc_timestamp = measurement['timestamp']
                # Assuming the timestamps are already aware and in UTC, adjust by 7 hours
                utc_plus_7_timestamp = utc_timestamp + timedelta(hours=7)
                measurement['timestamp'] = utc_plus_7_timestamp.isoformat()
                # utc_timestamp = measurement['timestamp']
                # # Extract only the time part (hours and minutes)
                # time_part = utc_timestamp.split('T')[1][:5]
                # measurement['timestamp'] = time_part


            return JsonResponse(measurement_list, safe=False)   

        return JsonResponse({'error': 'Out of bound unit of time'}, status=500)

    return JsonResponse({'error': 'Not found datestring'}, status=500)
  

@csrf_exempt
def inverter_activepower(request):
    body = json.loads(request.body)
    date_string = body.get('date')
    unitoftime = body.get('unitoftime')
    inverter_id = body.get('inverter_id')
    parts = inverter_id.split(":")
    inverter_id = parts[1][3:]
    inverter_id = int(inverter_id)
    print(inverter_id)    

    if date_string:
        if unitoftime == 'Day':

            time_range = time_range_extract(date_string, "OneDay")
            start, end = time_range['start'], time_range['end']
            print("Start:", start)
            print("End:", end)

            measurements = InverterMeasurement.objects.filter(
                        inverter_id=inverter_id,
                        timestamp__gte=start,
                        timestamp__lte=end,
                    ).order_by('timestamp')
            
            # Serialize the queryset into a list of dictionaries
            measurement_list = list(measurements.values())

            # Convert the timestamp to UTC+7
            for measurement in measurement_list:
                utc_timestamp = measurement['timestamp']
                # Assuming the timestamps are already aware and in UTC, adjust by 7 hours
                utc_plus_7_timestamp = utc_timestamp + timedelta(hours=7)
                measurement['timestamp'] = utc_plus_7_timestamp.isoformat()
                utc_timestamp = measurement['timestamp']
                # Extract only the time part (hours and minutes)
                time_part = utc_timestamp.split('T')[1][:5]
                measurement['timestamp'] = time_part


            return JsonResponse(measurement_list, safe=False)     

        if unitoftime == "Week":
            time_range = time_range_extract(date_string, unitoftime)
            start, end = time_range['start'], time_range['end']
            print("Start:", start)
            print("End:", end)

            measurements = InverterMeasurement.objects.filter(
                        inverter_id=inverter_id,
                        timestamp__gte=start,
                        timestamp__lte=end,
                    ).order_by('timestamp')
            
            # Serialize the queryset into a list of dictionaries
            measurement_list = list(measurements.values())

            # Convert the timestamp to UTC+7
            for measurement in measurement_list:
                utc_timestamp = measurement['timestamp']
                # Assuming the timestamps are already aware and in UTC, adjust by 7 hours
                utc_plus_7_timestamp = utc_timestamp + timedelta(hours=7)
                measurement['timestamp'] = utc_plus_7_timestamp.isoformat()
                # utc_timestamp = measurement['timestamp']
                # # Extract only the time part (hours and minutes)
                # time_part = utc_timestamp.split('T')[1][:5]
                # measurement['timestamp'] = time_part


            return JsonResponse(measurement_list, safe=False)  
            
        if unitoftime == "Month":
            time_range = time_range_extract(date_string, unitoftime)
            start, end = time_range['start'], time_range['end']
            print("Start:", start)
            print("End:", end)

            measurements = InverterMeasurement.objects.filter(
                        inverter_id=inverter_id,
                        timestamp__gte=start,
                        timestamp__lte=end,
                    ).order_by('timestamp')
            
            # Serialize the queryset into a list of dictionaries
            measurement_list = list(measurements.values())

            # Convert the timestamp to UTC+7
            for measurement in measurement_list:
                utc_timestamp = measurement['timestamp']
                # Assuming the timestamps are already aware and in UTC, adjust by 7 hours
                utc_plus_7_timestamp = utc_timestamp + timedelta(hours=7)
                measurement['timestamp'] = utc_plus_7_timestamp.isoformat()
                # utc_timestamp = measurement['timestamp']
                # # Extract only the time part (hours and minutes)
                # time_part = utc_timestamp.split('T')[1][:5]
                # measurement['timestamp'] = time_part


            return JsonResponse(measurement_list, safe=False)  

        elif unitoftime == "Year":
            time_range = time_range_extract(date_string, unitoftime)
            start, end = time_range['start'], time_range['end']
            print("Start:", start)
            print("End:", end)

            measurements = InverterMeasurement.objects.filter(
                        inverter_id=inverter_id,
                        timestamp__gte=start,
                        timestamp__lte=end,
                    ).order_by('timestamp')
            
            # Serialize the queryset into a list of dictionaries
            measurement_list = list(measurements.values())

            # Convert the timestamp to UTC+7
            for measurement in measurement_list:
                utc_timestamp = measurement['timestamp']
                # Assuming the timestamps are already aware and in UTC, adjust by 7 hours
                utc_plus_7_timestamp = utc_timestamp + timedelta(hours=7)
                measurement['timestamp'] = utc_plus_7_timestamp.isoformat()
                # utc_timestamp = measurement['timestamp']
                # # Extract only the time part (hours and minutes)
                # time_part = utc_timestamp.split('T')[1][:5]
                # measurement['timestamp'] = time_part

            return JsonResponse(measurement_list, safe=False)
    return JsonResponse({"here":"there"})

@csrf_exempt   
def inverter_control_get_polling_rate(request):
    request_body = request.body.decode('utf-8')
    data = json.loads(request_body)
    
    # Print the raw request body and the parsed data
    parts = data['thingId'].split(':')
    # Get the part after the colon
    inv_value = parts[1]
    print(inv_value)  # Output: inv1

    token = refresh_token()

    target_url = os.getenv("BASE_URL_NEURON")

    target_url = f"{target_url}/api/v2/group?node={inv_value}"

    print("Target URL:", target_url)

    # Define the headers
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    response = requests.get(target_url, headers=headers)
    print(response.status_code)
    print(response.text)
    if response.status_code == 200:       
        print(response.text)
        response_dict = response.json()
        result = response_dict["groups"][0]["interval"]
        text_result = str(result // 1000) + "s"

        return JsonResponse({'pollingrate': text_result})
    return JsonResponse({'error': 'internal server error'}, status=500)



@csrf_exempt   
def inverter_control(request): 
    counter = 2
    print(f'counter is {counter}')
    # Load the JSON data from the request body
    body = json.loads(request.body)
    print(body)  # Print the whole body for debugging

    # Extract the control string and inverter ID from the JSON data
    fanSpeed = body.get('valueofFanSpeed')
    inverter_id = int(body.get('inverter_id'))
    pollingratestr = body.get('pollingrate')
    pollingrateint = int(pollingratestr.replace('s', ''))
    pollingrateint = pollingrateint * 1000
    inverter_control_set_polling_rate(inverter_id, pollingrateint)
    limitOutput = body.get('limitOutput')
    inv_value = "inv" + str(inverter_id)
    print(inv_value)
    
    # MQTT Broker
    broker_address = "broker.emqx.io"  # Update with your MQTT broker's address
    port = 1883  # MQTT default port

    # Topics
    subscribe_topic = "/neuron/invertersite1/write/resp"  # Topic to subscribe to
    publish_topic = "/neuron/invertersite1/write/req"  # Topic to publish to

    # Callback function for MQTT client when connection is established
    def on_connect(client, userdata, flags, reason_code, properties):
        print("Connected with result code " + str(reason_code))
        client.subscribe(subscribe_topic)

    # Callback function for MQTT client when a message is received
    def on_message(client, userdata, msg):
        payload = msg.payload.decode()
        try:
            parsed_payload = json.loads(payload)
            print("Received message:")
            print(json.dumps(parsed_payload, indent=2))  # Print JSON with indentation for readability
        except json.JSONDecodeError as e:
            print("Received message (not JSON): " + payload)
        
        if counter == 0:
            print("Exiting because counter == 0...")
            # Stop the MQTT client loop
            client.loop_stop()
            # Disconnect from MQTT broker
            client.disconnect()

    # Create MQTT client instance
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

    # Assign callback functions
    client.on_connect = on_connect
    client.on_message = on_message

    # Connect to MQTT broker
    client.connect(broker_address, port, 60)

    # Start the MQTT client loop
    client.loop_start()

    # Construct payload for MQTT message
    payload = {
        "uuid": "cd32be1b-c8b1-3257-94af-77f847b1ed3e",
        "node": "inv1",  # Assuming the node is always "inv1", you can adjust this if needed
        "group": "test",
        "tag": "fanSpeed",
        "value": fanSpeed,
    }
    payload2 = {
        "uuid": "cd32be1b-c8b1-3257-94af-77f847b1ed3e",
        "node": "inv1",  
        "group": "test",
        "tag": "limitOutput",
        "value": limitOutput,
    }

    try:
        sleep(1)  # Wait for a few seconds before publishing (optional)
        # Publish user input to MQTT topic
        client.publish(publish_topic, json.dumps(payload))
        counter -= 1
        print(f'counter is {counter}')
        print("Published message to " + publish_topic)
        client.publish(publish_topic, json.dumps(payload2))
        counter -= 1
        print(f'counter is {counter}')
    
    except:
        print("Exiting...")
        client.loop_stop()  # Stop the MQTT client loop
        client.disconnect()  # Disconnect from MQTT broker
  
    # Return a JSON response indicating success (or you can return other relevant data)
    return JsonResponse({"message": "Data published to MQTT topic successfully."})
    




@csrf_exempt
# @permission_classes([IsAuthenticated])
def inverter_count(request): 
    target_url = os.getenv("BASE_URL_DITTO")
  
    target_url = target_url + '/api/2/search/things/count?namespaces=my.inverter'

    print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)

    data = response.json()
    print(data)
    print(data)
    print(data)

    return JsonResponse(data, safe=False)

@csrf_exempt
# @permission_classes([IsAuthenticated])
def inverter_list(request): 
    # Retrieve the base URL from the environment
    target_url = os.getenv("BASE_URL_DITTO")  
    target_url = target_url + '/api/2/search/things?namespaces=my.inverter&option=size(200)'   
    print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)

    data = response.json()
    # Pretty print the JSON data
    pretty_data = json.dumps(data, indent=4)
    
    # Print the pretty JSON to the console

    for item in data['items']:
        parts = item['thingId'].split(":")
        number = parts[1][3:]
        number = int(number)
        print(number)
        inverter_states = InverterState.objects.filter(inverter_id=number).order_by('-timestamp').first()
        # Check if inverter_states is not None before accessing its attributes
        if inverter_states:
            print(inverter_states.starton)
            # Define the target timezone (GMT+7)
            target_timezone = pytz.timezone('Asia/Bangkok')
            temp = django_timezone.localtime(inverter_states.starton, target_timezone) if inverter_states.starton else None
            print(temp)
            print(type(temp))

            # Get the current time
            current_time = datetime.now(timezone.utc)

            # Calculate the duration
            duration = current_time - inverter_states.starton

            # Convert the duration to hours
            duration_hours = duration.total_seconds() / 3600

            print("Duration:", duration_hours, "hours")
            rounded_duration = round(duration_hours, 2)
            print("Duration:", rounded_duration, "hours")

        
            # Format the datetime object to remove microseconds and timezone information
            simplified = temp.strftime("%Y-%m-%d %H:%M:%S")

            print("Simplified timestamp:", simplified)
            if 'measurements' in item['features'] and 'properties' in item['features']['measurements']:
                properties = item['features']['measurements']['properties']
                properties['starton'] = simplified
                properties['duration'] = rounded_duration

        else:
            print("No inverter state found for the given inverter_id.")

    return JsonResponse(data, safe=False)

def inverter_list2(request): 
    # Retrieve the base URL from the environment
    target_url = os.getenv("BASE_URL_DITTO")  
    target_url = target_url + '/api/2/search/things?namespaces=my.inverter&option=size(200)'   
    print("Target URL:", target_url)

    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    # Forward the request to the target URL with authentication headers
    response = requests.get(target_url, headers=headers)

    data = response.json()
    # Pretty print the JSON data
    pretty_data = json.dumps(data, indent=4)
    print(pretty_data)
    
    # Print the pretty JSON to the console
    result = []

    for item in data['items']:
        parts = item['thingId'].split(":")
        number = parts[1][3:]
        number = int(number)
        print(number)

        new_entry = {
            'inverter' : item['attributes']['name'],
            'production': item['features']['measurements']['properties']['productionToday'],
            'yield' : item['features']['measurements']['properties']['yieldToday']
        }

        result.append(new_entry)            

    return JsonResponse(result, safe=False)


def refresh_token():
    # Retrieve the base URL from the environment
    target_url = os.getenv("BASE_URL_NEURON")  

    target_url = target_url + '/api/v2/login'

    print("Target URL:", target_url)

    # Define the headers
    headers = {
        'Content-Type': 'application/json',
    }
    data = {
        "name": "admin",
        "pass": "0000"
    }

    response = requests.post(target_url, headers=headers, json=data)
    if response.status_code == 200:
        # Extract JWT token from response and store it in Django's session

        jwt_token = response.json().get('token')
        # print(jwt_token)
        return jwt_token
    return None

def inverter_control_set_polling_rate(inv_value, pollingrate):    
    print(inv_value)
    inv_value = "inv" + str(inv_value)
    print(inv_value)

    print(pollingrate)
    token = refresh_token()

    target_url = os.getenv("BASE_URL_NEURON")

    target_url = f"{target_url}/api/v2/group"

    print("Target URL:", target_url)

    # Define the headers
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    data = {
        "node": inv_value,
        "group": "test",
        "interval": pollingrate
    }    

    response = requests.put(target_url, headers=headers, json=data)
    if response.status_code == 200:       
        print(response.text)
        response_dict = response.json()          

    return JsonResponse({'pollingrate': 'okj'})

@csrf_exempt
def sse_stream(request):
    print(os.path.exists('event.txt'))
    current_dir = os.getcwd()
    print("Current working directory:", current_dir)
    print("sse hooked")
    def event_stream():
        i = 1
        while True:
            while not os.path.exists('event.txt'):
                sleep(1)  # Check every 0.1 seconds
            # Read the event file and clear it
            sleep(1)  # Check every 0.1 seconds
            with open('event.txt', 'r') as f:
                content = f.read()
                # data_read = json.load(f)
            os.remove('event.txt')

            notification = "New notification " + content
            i+=1
            yield f"data: {notification}\n\n"
            print("sending sse")
            sleep(2)  # Adjust the sleep time as needed

    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    return response
