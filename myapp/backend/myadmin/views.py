from django.http import JsonResponse
from iot.models import Site, Inverter
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.core.exceptions import ValidationError
import requests
import os
from base64 import b64encode
import json
from django.db.models import Max

# def unknown_view(request, unknown_path):
#     # Handle the request for unknown URLs
#     response_data = {
#         'message': 'Unknown path',
#         'path': unknown_path
#     }
#     return JsonResponse(response_data)

# def all_sites(request):
#     # Query all site instances
#     sites = Site.objects.all()
    
#     # Serialize site instances into JSON format
#     data = list(sites.values())
    
#     # Return JSON response
#     return JsonResponse(data, safe=False)

def my_view(request, resource_id):
    if request.method == 'GET':
        # Logic for handling GET requests
        return JsonResponse({'message': 'This is a GET request'})

    elif request.method == 'POST':
        # Logic for handling POST requests
        return JsonResponse({'message': 'This is a POST request'})

    elif request.method == 'PUT':
        # Logic for handling PUT requests
        return JsonResponse({'message': 'This is a PUT request'})

    elif request.method == 'DELETE':
        # Logic for handling DELETE requests
        return JsonResponse({'message': 'This is a DELETE request'})

    else:
        # Return an error response for unsupported methods
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

@csrf_exempt
def get_sites(request, site_id=None):
    if request.method == 'GET':
        # Logic for handling GET requests
    # Handle GetOne
        if site_id is not None:
            site = get_object_or_404(Site, pk=site_id)
            data = {
                'id': site.siteID,
                'siteName': site.siteName,
                'location': site.location,
                # Add other fields as needed
            }
            return JsonResponse(data)
        
        # Handle GetList
        # Parse query parameters
        start = int(request.GET.get('_start', 0))
        end = int(request.GET.get('_end', 10))
        sort_field = request.GET.get('_sort', 'id')
        if sort_field == 'id':
            sort_field = 'siteID'
        print(sort_field)
        order = request.GET.get('_order', 'ASC')

        # Define sorting order
        if order == 'DESC':
            sort_field = '-' + sort_field

        # Query sites
        sites = Site.objects.order_by(sort_field)[start:end]
    
        # Serialize data
        data = list(sites.values())
    
        for item in data:
            new_item = {}
            for key, value in item.items():  # Iterate over key-value pairs of the dictionary
                if key == 'siteID':
                    new_item['id'] = value
                else:
                    new_item[key] = value
            # Update the original dictionary with the modified one
            item.clear()
            item.update(new_item)
            
        response = JsonResponse(data, safe=False)
        response['Access-Control-Expose-Headers'] = 'X-Total-Count'
        response['X-Total-Count'] = len(data)
        
        # Return JSON response
        return response
    elif request.method == 'POST':
        print(request.body.decode("utf-8"))
        post_data = json.loads(request.body)
        latest_id = Site.objects.aggregate(Max('siteID'))['siteID__max']
        print("last id", latest_id)
        
        # Increment the ID for the new record
        new_id = latest_id + 1 if latest_id is not None else 1
        print("new_id id", new_id)


        # Extract relevant fields
        site_name = post_data.get('siteName')
        location = post_data.get('location')

        # Create a new Site instance with the extracted data
        site = Site(siteID=new_id, siteName=site_name, location=location)

        # Save the new Site instance to the database
        try:
            site.full_clean()  # Validate the model fields
            site.save()  # Save the record
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)

        return JsonResponse({'message': 'Site created successfully'})

    elif request.method == 'PUT':
        # Parse the JSON data from the request body
        put_data = json.loads(request.body)

        # Extract relevant fields
        site_id = put_data.get('id')
        site_name = put_data.get('siteName')
        location = put_data.get('location')

        # Retrieve the existing record from the database
        try:
            site = Site.objects.get(pk=site_id)
        except Site.DoesNotExist:
            return JsonResponse({'error': 'Site not found'}, status=404)

        # Update the record with new values
        site.siteName = site_name
        site.location = location

        try:
            site.full_clean()  # Validate the model fields
            site.save()  # Save the record
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)
        
        response = {
            'id': site_id,
            'siteName': site_name,
            'location': location
        }

        return JsonResponse(response)
        
    elif request.method == 'DELETE':
        # There's no request body in a DELETE request
        print("No body in DELETE request")
        # However, you can still access parameters in the URL
        print("Request parameters:", request.GET)
        # Or you can access parts of the URL path if you're using path parameters
        print("Path parameters:", request.path)
        site = get_object_or_404(Site, pk=site_id)
        # Delete the site
        site.delete()
        return JsonResponse({'message': 'Site deleted successfully.'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
@csrf_exempt
def get_inverters(request, inverter_id=None):
    if request.method == 'GET':
        
        if inverter_id is not None:
            try: 
                inverter = get_object_or_404(Inverter, pk=inverter_id)
                print(inverter)
                # Printing all attributes of the inverter object
                data = {
                    'id': inverter.inverterID,
                    'manufacturer': inverter.manufacturer,
                    'model': inverter.model,
                    'serialNumber': inverter.serialNumber,
                    'location': inverter.location,
                    'site_id' : inverter.site_id
                }
                return JsonResponse(data)
            except Http404:
                # If the object is not found, handle the exception here
                # For example, return a custom response or redirect to another page
                return JsonResponse({"error":"Inverter not found"}, status=404)
        # Parse query parameters
        start = int(request.GET.get('_start', 0))
        end = int(request.GET.get('_end', 10))
        sort_field = request.GET.get('_sort', 'id')
        site_id = request.GET.get('site_id')

        # Checking if site_id is provided and valid
        if site_id is not None:
            try:
                site_id = int(site_id)
                # Filtering inverters based on site_id
                if site_id != 0:
                    inverters = Inverter.objects.filter(site_id=site_id)
                else:
                    inverters = Inverter.objects.all()
            except ValueError:
                return JsonResponse({'error': 'Invalid site_id. Please provide a valid integer value.'}, status=400)
        else:
            # Handling case where site_id is missing
            inverters = Inverter.objects.all()

        if sort_field == 'id':
            sort_field = 'inverterID'
        print(sort_field)
        order = request.GET.get('_order', 'ASC')

        # Define sorting order
        if order == 'DESC':
            sort_field = '-' + sort_field

        # Query inverter
        inverters = inverters.order_by(sort_field)[start:end]

        # Serialize data
        data = list(inverters.values())
    
        for item in data:
            new_item = {}
            for key, value in item.items():  # Iterate over key-value pairs of the dictionary
                if key == 'inverterID':
                    new_item['id'] = value
                else:
                    new_item[key] = value
            # Update the original dictionary with the modified one
            item.clear()
            item.update(new_item)
            
        response = JsonResponse(data, safe=False)
        response['Access-Control-Expose-Headers'] = 'X-Total-Count'
        response['X-Total-Count'] = len(data)
        
        # Return JSON response
        return response
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        print(body)

        return JsonResponse({'message': 'This is a DELETE request'})
    elif request.method == 'PUT':
        # Logic for handling PUT requests
        return JsonResponse({'message': 'This is a PUT request'})

    elif request.method == 'DELETE':
        # Logic for handling DELETE requests
        return JsonResponse({'message': 'This is a DELETE request'})

    else:
        # Return an error response for unsupported methods
        return JsonResponse({'error': 'Method not allowed'}, status=405)

def handle_request(a, start, end, order_by, sort_order):
    try:
        # Sort the list based on the specified field
        sorted_a = sorted(a, key=lambda x: x.get(order_by))

        # Order the sorted list in ascending or descending order
        if sort_order == 'ASC':
            sorted_a = sorted_a
        elif sort_order == 'DESC':
            sorted_a = sorted_a[::-1]

        # Perform pagination to return only the specified range of items
        paginated_a = sorted_a[start:end]

        return paginated_a
    except Exception as e:
        print(f"An error occurred: {e}")
        return []  # Return an empty list as a default value


# resource : connection direct to ditto (no database)
@csrf_exempt
def get_connection(request, connection_id=None):
    target_url = os.getenv("BASE_URL_GET_ALL_CONNECTION")
    username = os.getenv("USERNAME_DEVOPS")
    password = os.getenv("PASSWORD_DEVOPS")
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + b64encode((username + ':' + password).encode()).decode('utf-8'),
    }

    response = requests.get(target_url, headers=headers)

    # Checking if the request was successful (status code 200)
    if response.status_code == 200:
        result = []
        try:
            # Parsing the JSON response
            data = response.json()

            # Handle parameters
            # Parse query parameters
            start = int(request.GET.get('_start', 0))
            end = int(request.GET.get('_end', 10))
            sort_field = request.GET.get('_sort', 'id')
            site_id = request.GET.get('site_id')

            # Checking if site_id is provided and valid
            if site_id is not None:
                try:
                    site_id = int(site_id)
                    # Filtering inverters based on site_id
                    if site_id != 0:
                        for item in data:
                            # # Extracting relevant data from each item
                            site = item.get('tags', [])[0]


                            numeric_part = int(site[len("site"):])

                            if numeric_part == site_id:
                                print(f"numeric_part == clled")
                                connection_id = item.get('id')
                                uri = item.get('uri')
                                # Accessing nested structures safely with get() to avoid KeyError
                                source_address = item.get('sources', [{}])[0].get('addresses', [])[0]
                                site = item.get('tags', [])[0]


                                # Constructing dictionary for each item
                                connection_data = {
                                    'id': connection_id,
                                    'uri': uri,
                                    'source': source_address,
                                    'site_id': int(numeric_part),
                                }
                                result.append(connection_data)
                        print("result")
                        print(result)
                except ValueError:
                    return JsonResponse({'error': 'Invalid site_id. Please provide a valid integer value.'}, status=400)
            else:
                # Handling case where site_id is missing
                ####
                #### get all connections
                # Iterating over items in the JSON data
                for item in data:
                    # Extracting relevant data from each item
                    connection_id = item.get('id')
                    uri = item.get('uri')
                    # Accessing nested structures safely with get() to avoid KeyError
                    source_address = item.get('sources', [{}])[0].get('addresses', [])[0]
                    site = item.get('tags', [])[0]
                    numeric_part = site[len("site"):]

                    # Constructing dictionary for each item
                    connection_data = {
                        'id': connection_id,
                        'uri': uri,
                        'source': source_address,
                        'site_id': int(numeric_part),
                    }
                    result.append(connection_data)

            # Handle sorting, 
            order = request.GET.get('_order', 'ASC')
            print(result)
            result = handle_request(result, start, end, sort_field, order)

          
            response = JsonResponse(result, safe=False)
            response['Access-Control-Expose-Headers'] = 'X-Total-Count'
            response['X-Total-Count'] = len(result)
            return response



            print(sort_field)
            order = request.GET.get('_order', 'ASC')

            # Define sorting order
            if order == 'DESC':
                sort_field = '-' + sort_field

           

            # Query inverter
            inverters = inverters.order_by(sort_field)[start:end]

            result = []
            # Iterating over items in the JSON data
            for item in data:
                # Extracting relevant data from each item
                connection_id = item.get('id')
                uri = item.get('uri')
                # Accessing nested structures safely with get() to avoid KeyError
                source_address = item.get('sources', [{}])[0].get('addresses', [])[0]
                site = item.get('tags', [])[0]
                numeric_part = site[len("site"):]

                # Constructing dictionary for each item
                connection_data = {
                    'id': connection_id,
                    'uri': uri,
                    'source': source_address,
                    'site_id': int(numeric_part),
                }
                result.append(connection_data)

            response = JsonResponse(result, safe=False)
            response['Access-Control-Expose-Headers'] = 'X-Total-Count'
            response['X-Total-Count'] = len(result)

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)
        return response

    else:
        # Handling errors if any
        return JsonResponse({'error': f"Error fetching data. Status code: {response.status_code}"}, status=200)

    # Sending GET request to the API endpoint
    response = requests.get(api_url)

    # Checking if the request was successful (status code 200)
    if response.status_code == 200:
        # Parsing the JSON response
        connections_data = response.json()
        # You can further process the data as needed
        return JsonResponse(connections_data)
    else:
        # Handling errors if any
        error_message = f"Error fetching connections. Status code: {response.status_code}"
        return JsonResponse({'error': error_message}, status=500)





    
    if connection_id is not None:
        inverter = get_object_or_404(Inverter, pk=connection_id)
        data = {
            'id': inverter.inverterID,
            'inverter manufacturer': inverter.manufacturer,
            'invertersd': inverter.location,
            # Add other fields as needed
        }
        return JsonResponse(data)
    # Parse query parameters
    start = int(request.GET.get('_start', 0))
    end = int(request.GET.get('_end', 10))
    sort_field = request.GET.get('_sort', 'id')
    if sort_field == 'id':
        sort_field = 'inverterID'
    print(sort_field)
    order = request.GET.get('_order', 'ASC')

    # Define sorting order
    if order == 'DESC':
        sort_field = '-' + sort_field

    # Query inverter
    inverter = Inverter.objects.order_by(sort_field)[start:end]
    # Get the total count of objects

    # Serialize data
    data = list(inverter.values())
   
    for item in data:
        new_item = {}
        for key, value in item.items():  # Iterate over key-value pairs of the dictionary
            if key == 'inverterID':
                new_item['id'] = value
            else:
                new_item[key] = value
        # Update the original dictionary with the modified one
        item.clear()
        item.update(new_item)
        
    response = JsonResponse(data, safe=False)
    response['Access-Control-Expose-Headers'] = 'X-Total-Count'
    response['X-Total-Count'] = len(data)
    
    # Return JSON response
    return response

def get_list_view(request):
    # Create some sample objects
    data = [
    {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "address": {
            "street": "Kulas Light",
            "suite": "Apt. 556",
            "city": "Gwenborough",
            "zipcode": "92998-3874",
            "geo": {
                "lat": "-37.3159",
                "lng": "81.1496"
            }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
            "name": "Romaguera-Crona",
            "catchPhrase": "Multi-layered client-server neural-net",
            "bs": "harness real-time e-markets"
        }
    },
    {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "address": {
            "street": "Victor Plains",
            "suite": "Suite 879",
            "city": "Wisokyburgh",
            "zipcode": "90566-7771",
            "geo": {
                "lat": "-43.9509",
                "lng": "-34.4618"
            }
        },
        "phone": "010-692-6593 x09125",
        "website": "anastasia.net",
        "company": {
            "name": "Deckow-Crist",
            "catchPhrase": "Proactive didactic contingency",
            "bs": "synergize scalable supply-chains"
        }
    }
]

    print(data)
     # Return the data as JSON response
    response = JsonResponse(data, safe=False)
  
    # Add Content-Range header
    # response['Content-Range'] = f'bytes 0-{len(data) - 1}/{len(data)}'
    response['Access-Control-Expose-Headers'] = 'X-Total-Count'
    response['X-Total-Count'] = 4



    # Return the data as JSON response
    return response