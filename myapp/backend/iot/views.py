from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Max
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
import os
import requests
import json
from base64 import b64encode
from dotenv import load_dotenv

# import view sets from the REST framework
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime, timezone, timedelta
from django.utils import timezone as django_timezone
import pytz
import calendar

# import the PowerMeterDataSerializer from the serializer file
from .serializers import PowerMeterDataSerializer

from .models import PowerMeterData, DailyEnergySum, MonthlyEnergySum
from django.db.models import Sum

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
        date_object = datetime.strptime(dateString, "%Y-%m-%dT%H:%M:%S.%fZ%z")
    except ValueError:
        try:
            # Attempt to parse with the format "%Y-%m-%dT%H:%M:%S.%fZ"
            date_object = datetime.strptime(dateString, "%Y-%m-%dT%H:%M:%S.%fZ")
        except ValueError:
            raise ValueError("Invalid date format")

    # Convert the date_object to the local time zone
    date_object = date_object.replace(tzinfo=pytz.UTC)
    date_object_local = date_object.astimezone(pytz.timezone(local_timezone))
    print(f"date_object_local = {date_object_local}")

    start_of_day = date_object_local.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = (start_of_day + timedelta(days=1)) - timedelta(microseconds=1)

    if unitoftime == "Day":
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
