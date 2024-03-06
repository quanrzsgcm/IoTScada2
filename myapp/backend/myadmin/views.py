from django.http import JsonResponse
from iot.models import Site, Inverter
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import requests
import os
from base64 import b64encode

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


@csrf_exempt
def get_sites(request, site_id=None):
    if request.method == 'PUT':
        print("Called")
        return JsonResponse({'data': "ok"})
    

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

@csrf_exempt
def get_inverters(request, inverter_id=None):
    print("Call")
    if inverter_id is not None:
        inverter = get_object_or_404(Inverter, pk=inverter_id)
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
        try:
            # Parsing the JSON response
            data = response.json()
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
            return JsonResponse({'error': str(e)}, status=500)
        return response

    else:
        # Handling errors if any
        return JsonResponse({'error': f"Error fetching data. Status code: {response.status_code}"}, status=500)

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