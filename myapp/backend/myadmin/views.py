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
import logging
import uuid
import pprint
import re


logger = logging.getLogger(__name__)

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


def is_valid_ip(ip):
    # Regular expression for validating an IP address
    ip_pattern = re.compile(r'^(\d{1,3}\.){3}\d{1,3}$')
    if ip_pattern.match(ip):
        # Check each part of the IP address to ensure it's in the range 0-255
        parts = ip.split('.')
        for part in parts:
            if not (0 <= int(part) <= 255):
                return False
        return True
    return False

def my_view(request, resource_id):
    if request.method == "GET":
        # Logic for handling GET requests
        return JsonResponse({"message": "This is a GET request"})

    elif request.method == "POST":
        # Logic for handling POST requests
        return JsonResponse({"message": "This is a POST request"})

    elif request.method == "PUT":
        # Logic for handling PUT requests
        return JsonResponse({"message": "This is a PUT request"})

    elif request.method == "DELETE":
        # Logic for handling DELETE requests
        return JsonResponse({"message": "This is a DELETE request"})

    else:
        # Return an error response for unsupported methods
        return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def get_sites(request, site_id=None):
    if request.method == "GET":
        # Logic for handling GET requests
        # Handle GetOne
        if site_id is not None:
            site = get_object_or_404(Site, pk=site_id)
            data = {
                "id": site.siteID,
                "siteName": site.siteName,
                "location": site.location,
                # Add other fields as needed
            }
            return JsonResponse(data)

        # Handle GetList
        # Parse query parameters
        start = int(request.GET.get("_start", 0))
        end = int(request.GET.get("_end", 10))
        sort_field = request.GET.get("_sort", "id")
        if sort_field == "id":
            sort_field = "siteID"
        print(sort_field)
        order = request.GET.get("_order", "ASC")

        # Define sorting order
        if order == "DESC":
            sort_field = "-" + sort_field

        # Query sites
        sites = Site.objects.order_by(sort_field)[start:end]

        # Serialize data
        data = list(sites.values())

        for item in data:
            new_item = {}
            for (
                key,
                value,
            ) in item.items():  # Iterate over key-value pairs of the dictionary
                if key == "siteID":
                    new_item["id"] = value
                else:
                    new_item[key] = value
            # Update the original dictionary with the modified one
            item.clear()
            item.update(new_item)

        response = JsonResponse(data, safe=False)
        response["Access-Control-Expose-Headers"] = "X-Total-Count"
        response["X-Total-Count"] = len(data)

        # Return JSON response
        return response
    elif request.method == "POST":
        print(request.body.decode("utf-8"))
        post_data = json.loads(request.body)
        latest_id = Site.objects.aggregate(Max("siteID"))["siteID__max"]
        print("last id", latest_id)

        # Increment the ID for the new record
        new_id = latest_id + 1 if latest_id is not None else 1
        print("new_id id", new_id)

        # Extract relevant fields
        site_name = post_data.get("siteName")
        location = post_data.get("location")

        # Create a new Site instance with the extracted data
        site = Site(siteID=new_id, siteName=site_name, location=location)

        # Save the new Site instance to the database
        try:
            site.full_clean()  # Validate the model fields
            site.save()  # Save the record
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)

        return JsonResponse({"message": "Site created successfully"})

    elif request.method == "PUT":
        # Parse the JSON data from the request body
        put_data = json.loads(request.body)

        # Extract relevant fields
        site_id = put_data.get("id")
        site_name = put_data.get("siteName")
        location = put_data.get("location")

        # Retrieve the existing record from the database
        try:
            site = Site.objects.get(pk=site_id)
        except Site.DoesNotExist:
            return JsonResponse({"error": "Site not found"}, status=404)

        # Update the record with new values
        site.siteName = site_name
        site.location = location

        try:
            site.full_clean()  # Validate the model fields
            site.save()  # Save the record
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)

        response = {"id": site_id, "siteName": site_name, "location": location}

        return JsonResponse(response)

    elif request.method == "DELETE":
        # There's no request body in a DELETE request
        print("No body in DELETE request")
        # However, you can still access parameters in the URL
        print("Request parameters:", request.GET)
        # Or you can access parts of the URL path if you're using path parameters
        print("Path parameters:", request.path)
        site = get_object_or_404(Site, pk=site_id)
        # Delete the site
        site.delete()
        return JsonResponse({"message": "Site deleted successfully."})
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def get_inverters(request, inverter_id=None):
    if request.method == "GET":
        if inverter_id is not None:
            try:
                inverter = get_object_or_404(Inverter, pk=inverter_id)
                print(inverter)
                # Printing all attributes of the inverter object
                data = {
                    "id": inverter.inverterID,
                    "manufacturer": inverter.manufacturer,
                    "model": inverter.model,
                    "serialNumber": inverter.serialNumber,
                    "location": inverter.location,
                    "site_id": inverter.site_id,
                }
                return JsonResponse(data)
            except Http404:
                # If the object is not found, handle the exception here
                # For example, return a custom response or redirect to another page
                return JsonResponse({"error": "Inverter not found"}, status=404)
        # Parse query parameters
        start = int(request.GET.get("_start", 0))
        end = int(request.GET.get("_end", 10))
        sort_field = request.GET.get("_sort", "id")
        site_id = request.GET.get("site_id")

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
                return JsonResponse(
                    {"error": "Invalid site_id. Please provide a valid integer value."},
                    status=400,
                )
        else:
            # Handling case where site_id is missing
            inverters = Inverter.objects.all()

        if sort_field == "id":
            sort_field = "inverterID"
        print(sort_field)
        order = request.GET.get("_order", "ASC")

        # Define sorting order
        if order == "DESC":
            sort_field = "-" + sort_field

        # Query inverter
        inverters = inverters.order_by(sort_field)[start:end]

        # Serialize data
        data = list(inverters.values())

        for item in data:
            new_item = {}
            for (
                key,
                value,
            ) in item.items():  # Iterate over key-value pairs of the dictionary
                if key == "inverterID":
                    new_item["id"] = value
                else:
                    new_item[key] = value
            # Update the original dictionary with the modified one
            item.clear()
            item.update(new_item)

        response = JsonResponse(data, safe=False)
        response["Access-Control-Expose-Headers"] = "X-Total-Count"
        response["X-Total-Count"] = len(data)

        # Return JSON response
        return response
    elif request.method == "POST":
        try:        
            # Retrieve the base URL from the environment
            target_url = os.getenv("BASE_URL_DITTO")

            username = os.getenv("USERNAME")
            password = os.getenv("PASSWORD")

            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }

            # Forward the request to the target URL with authentication headers
            # response = requests.get(target_url, headers=headers)
            post_data = json.loads(request.body)
            print(post_data)
            ip_address = post_data.get("ipaddress")
            print(ip_address)
            print('debug 1')

            if is_valid_ip(ip_address):
                host = ip_address
                print(f"IP address {ip_address} is valid.")
            else:
                print(f"IP address {ip_address} is not valid.")
                return JsonResponse({'error': 'Invalid IP address'})
            print('debug 2')
            
            port= post_data.get("port"),
           
            site_instance = get_object_or_404(Site, siteID=1)
            latest_id = Inverter.objects.aggregate(Max("inverterID"))["inverterID__max"]
            print("last id", latest_id)

            # Increment the ID for the new record
            new_id = latest_id + 1 if latest_id is not None else 1

            target_url_with_id = f"{target_url}/api/2/things/my.inverter:inv{new_id}"
            print("Target URL with ID:", target_url_with_id)

            new_inverters = {
                "policyId": "my.test:policy",
                "attributes": {
                    "name": post_data.get("name"),                    
                    "manufacturer": post_data.get("manufacturer"),
                    "model": post_data.get("model"),
                    "serial number": post_data.get("serialNumber"),
                    "location": post_data.get("location"),
                    "site": 1,
                },
                "features": {
                    "measurements": {
                        "properties": {
                            "capacity": 0,
                            "meterReadTotalEnergy": 0,
                            "activePower": 0,
                            "inputPower": 0,
                            "efficiency": 0,
                            "internalTemp": 0,
                            "gridFrequency": 0,
                            "productionToday": 0,
                            "yieldToday": 0,
                            "reactivePower": 0,
                            "apparentPower": 0,
                            "powerFactor": 0,
                            "fanSpeed": 0,
                            "limitOutput": 0,
                            "state": "Connection Fail"
                        }
                    },
                    "runningstatus": {
                        "properties": {
                            
                        }
                    },
                    "label": {
                        "properties": {
                            "labels": []
                        }
                    }
                },
            }

            json_data = json.dumps(new_inverters)

            response = requests.put(
                target_url_with_id, json=new_inverters, headers=headers
            )

            print(response.text)  # This prints the response content as a string
            print(response.status_code)  # This prints the HTTP status code
            if response.status_code == 201 or response.status_code == 204:
                # Request was successful
                print("PUT request was successful")
                # Save the new Site instance to the database
                try:
                    # Create a new Site instance with the extracted data
                    print(new_id)
                    print(site_instance)
                    print(post_data.get("manufacturer"))
                    print(post_data.get("model"))
                    print(post_data.get("serialNumber"))

                    inverter = Inverter(
                        inverterID=new_id,
                        site=site_instance,
                        manufacturer=post_data.get("manufacturer"),
                        model=post_data.get("model"),
                        serialNumber=post_data.get("serialNumber"),
                    )
                    inverter.full_clean()  # Validate the model fields
                    inverter.save()  # Save the record
                    

                except ValidationError as e:
                    return JsonResponse({"error": str(e)}, status=400)
                
                node = "inv" + f'{new_id}'
                temp = create_device(node, request, host, port)
                print(f'Status of create device {temp}')
                if temp == 0:
                    subscribe_to_new_node('invertersite1', node, "/neuron/invertersite1")


            else:
                # Print the status code if the request was not successful
                print(f"PUT request failed with status code {response.status_code}")
                return JsonResponse({"error": "Something went wrong"}, status=500)

            return JsonResponse({'response': 'ok'})
        except Exception as e:
            print(str(e))
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "PUT":
        try:
            # Logic for handling PUT requests
            put_data = json.loads(request.body)
            print("Request body:", put_data)

            # Extract relevant fields
            id = put_data.get("id")
            site_id = put_data.get("site_id")

            # Retrieve the existing record from the database
            try:
                inverter = Inverter.objects.get(pk=id)
            except Inverter.DoesNotExist:
                return JsonResponse({"error": "Inverter not found"}, status=404)

            # Retrieve the base URL from the environment
            target_url = os.getenv("BASE_URL_GET_ALL_THING")

            username = os.getenv("USERNAME")
            password = os.getenv("PASSWORD")

            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }
            target_url_with_id = f"{target_url}/my.inverter:inv{id}"
            print("Target URL with ID:", target_url_with_id)

            new_inverters = {
                "policyId": "my.test:policy",
                "attributes": {
                    "manufacturer": put_data.get("manufacturer"),
                    "model": put_data.get("model"),
                    "serial number": put_data.get("serialNumber"),
                    "location": put_data.get("location"),
                    "site": put_data.get("site_id"),
                },
                "features": {
                    "measurements": {
                        "properties": {
                            "capacity": 0,
                            "internal temp": 0,
                            "input power": 0,
                            "grid frequency": 0,
                            "power factor": 0,
                        }
                    }
                },
            }
            response = requests.put(
                target_url_with_id, json=new_inverters, headers=headers
            )

            print(response.text)  # This prints the response content as a string
            print(response.status_code)  # This prints the HTTP status code
            if response.status_code == 201 or response.status_code == 204:
                print("PUT request was successful")
                try:
                    # Get the site ID from the request data
                    site_id = int(put_data.get("site_id"))

                    # Fetch the Site instance corresponding to the site ID
                    site_instance = get_object_or_404(Site, siteID=site_id)

                    # Create or update the Inverter instance
                    inverter.inverterID=id
                    inverter.site=site_instance
                    inverter.manufacturer=put_data.get("manufacturer")
                    inverter.model=put_data.get("model")
                    inverter.serialNumber=put_data.get("serialNumber")
                    inverter.location=put_data.get("location")

                    # Validate the model fields
                    inverter.full_clean()

                    # Save the record
                    inverter.save()       

                except ValidationError as e:
                    logger.error("Validation Error: %s", str(e))
                    return JsonResponse({"error": str(e)}, status=400)

            else:
                print(f"PUT request failed with status code {response.status_code}")
                return JsonResponse({"error": "PUT request failed"}, status=400)
            
            response = {
                'id': put_data.get("id"),
                'site_id': put_data.get("site_id"),
                'manufacturer': put_data.get("manufacturer"),
                'model': put_data.get("model"),
                'serialNumber': put_data.get("serialNumber"),
                'location': put_data.get("location"),
            }
            return JsonResponse(response)

        except Exception as e:
            print(str(e))
            # logger.error("Validation Error: %s", str(e))
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            data = json.loads(request.body)
            print(data)
            for inverter in data:
                print(inverter) #DITTO
                parts = inverter.split(':')
                if len(parts) > 1:
                    invpart = parts[1]  #NEURON
                    print(invpart)
                    inverter_id = invpart[3:]
                    print(inverter_id) #DB      

                    # Logic for handling DELETE requests
                    inverter = get_object_or_404(Inverter, pk=inverter_id)
                    print(inverter)
                    inverter.delete()

                    # Retrieve the base URL from the environment
                    target_url = os.getenv("BASE_URL_DITTO")

                    username = os.getenv("USERNAME")
                    password = os.getenv("PASSWORD")

                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": "Basic "
                        + b64encode((username + ":" + password).encode()).decode("utf-8"),
                    }
                    target_url_with_id = f"{target_url}/api/2/things/my.inverter:inv{inverter_id}"
                    print("Target URL with ID:", target_url_with_id)
                    response = requests.delete(
                            target_url_with_id, headers=headers
                    )
                    print("Ditto start")
                    print(response.status_code)
                    print(response.text)
                    print("Ditto end")

                    # NEURON 
                    token = refresh_token(request)
                    headers = {
                        'Content-Type': 'application/json',
                        'Authorization': f'Bearer {token}'  
                    }

                    target_url = os.getenv("BASE_URL_NEURON")  
                    target_url = target_url + '/api/v2/node'

                    print("Target URL:", target_url)

                    # Define the JSON data
                    data = {
                        "name": invpart,
                    }
                    # Send the POST request
                    response = requests.delete(target_url, headers=headers, json=data)

                    # Print the response
                    print("Neuron start")
                    print(response.status_code)
                    print(response.text)
                    print("Neuron end")

                    if response.status_code == 409:
                        return JsonResponse({'Error':'Error deleting in Neuron'})
                    print("Neuron 2")        
        except Exception as e:
            print("Neuron 3")

            print(str(e))
            return JsonResponse({'not':'ok'})
        return JsonResponse({"message": "This is a DELETE request"})

    else:
        # Return an error response for unsupported methods
        return JsonResponse({"error": "Method not allowed"}, status=405)


def handle_request(a, start, end, order_by, sort_order):
    try:
        # Sort the list based on the specified field
        sorted_a = sorted(a, key=lambda x: x.get(order_by))

        # Order the sorted list in ascending or descending order
        if sort_order == "ASC":
            sorted_a = sorted_a
        elif sort_order == "DESC":
            sorted_a = sorted_a[::-1]

        # Perform pagination to return only the specified range of items
        paginated_a = sorted_a[start:end]

        return paginated_a
    except Exception as e:
        print(f"An error occurred: {e}")
        return []  # Return an empty list as a default value

def connection_factory(id, uri, address, siteId):
    origin_connection = {
        "targetActorSelection": "/system/sharding/connection",
        "headers": {
            "aggregate": False
        },
        "piggybackCommand": {
            "type": "connectivity.commands:createConnection",
            "connection": {
                "id": "mqtt-connection-source-1",
                "connectionType": "mqtt",
                "connectionStatus": "open",
                "failoverEnabled": True,
                "uri": "tcp://test.mosquitto.org:1883",
                "sources": [
                    {
                        "addresses": [
                            "my.inverters/#"
                        ],
                        "authorizationContext": [
                            "nginx:ditto"
                        ],
                        "qos": 0,
                        "filters": []
                    }
                ],
                "mappingContext": {
                    "mappingEngine": "JavaScript",
                    "options": {
                        "incomingScript": "function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload)); const jsonData = JSON.parse(jsonString);    const thingId = jsonData.thingId.split(':');    const value = {        measurements: {            properties: {                capacity: jsonData.capacity,                internalTemp: jsonData.internalTemp,                inputPower: jsonData.inputPower,                gridFrequency: jsonData.gridFrequency,                powerFactor: jsonData.powerFactor,            }        }    };    return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value);}",
                        "outgoingScript": "function mapFromDittoProtocolMsg(namespace, id, group, channel, criterion, action, path, dittoHeaders, value, status, extra) {return null;}",
                        "loadBytebufferJS": "false",
                        "loadLongJS": "false"
                    }
                },
                "tags": [
                    "site2"
                ]
            }
        }
    }    

    site = "site" + str(siteId)
    print(site)

    origin_connection["piggybackCommand"]["connection"]["id"] = id
    origin_connection["piggybackCommand"]["connection"]["uri"] = uri
    origin_connection["piggybackCommand"]["connection"]["sources"][0]["addresses"][0] = address
    origin_connection["piggybackCommand"]["connection"]["tags"][0] = site

    return origin_connection

# resource : connection direct to ditto (no database)
@csrf_exempt
def get_connection(request, connection_id=None):
    try:
        if request.method == 'GET':
            target_url = os.getenv("BASE_URL_GET_ALL_CONNECTION")
            username = os.getenv("USERNAME_DEVOPS")
            password = os.getenv("PASSWORD_DEVOPS")
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }

            response = requests.get(target_url, headers=headers)

            # Checking if the request was successful (status code 200)
            if response.status_code == 200:
                result = []
                # Parsing the JSON response
                data = response.json()

                # Handle parameters
                # Parse query parameters
                start = int(request.GET.get("_start", 0))
                end = int(request.GET.get("_end", 10))
                sort_field = request.GET.get("_sort", "id")
                site_id = request.GET.get("site_id")

                if connection_id is not None:
                    for item in data:
                        if item.get("id") == connection_id:
                            # Constructing dictionary for each item
                            site = item.get("tags", [])[0]
                            numeric_part = int(site[len("site") :])
                            connection_data = {
                                "id": connection_id,
                                "uri": item.get("uri"),
                                "source": item.get("sources", [{}])[0].get(
                                        "addresses", []
                                    )[0],
                                "site_id": int(numeric_part),
                            }
                            return JsonResponse(connection_data)
                    return JsonResponse({'error':'Not found'}, status=404)

                # Checking if site_id is provided and valid
                if site_id is not None:
                    try:
                        site_id = int(site_id)
                        # Filtering inverters based on site_id
                        if site_id != 0:
                            for item in data:
                                # # Extracting relevant data from each item
                                site = item.get("tags", [])[0]

                                numeric_part = int(site[len("site") :])

                                if numeric_part == site_id:
                                    print(f"numeric_part == clled")
                                    connection_id = item.get("id")
                                    uri = item.get("uri")
                                    # Accessing nested structures safely with get() to avoid KeyError
                                    source_address = item.get("sources", [{}])[0].get(
                                        "addresses", []
                                    )[0]
                                    site = item.get("tags", [])[0]

                                    # Constructing dictionary for each item
                                    connection_data = {
                                        "id": connection_id,
                                        "uri": uri,
                                        "source": source_address,
                                        "site_id": int(numeric_part),
                                    }
                                    result.append(connection_data)
                            print("result")
                            print(result)
                    except ValueError:
                        return JsonResponse(
                            {
                                "error": "Invalid site_id. Please provide a valid integer value."
                            },
                            status=400,
                        )
                else:
                    # Handling case where site_id is missing
                    ####
                    #### get all connections
                    # Iterating over items in the JSON data
                    for item in data:
                        # Extracting relevant data from each item
                        connection_id = item.get("id")
                        uri = item.get("uri")
                        # Accessing nested structures safely with get() to avoid KeyError
                        source_address = item.get("sources", [{}])[0].get("addresses", [])[
                            0
                        ]
                        site = item.get("tags", [])[0]
                        numeric_part = site[len("site") :]

                        # Constructing dictionary for each item
                        connection_data = {
                            "id": connection_id,
                            "uri": uri,
                            "source": source_address,
                            "site_id": int(numeric_part),
                        }
                        result.append(connection_data)

                # Handle sorting,
                order = request.GET.get("_order", "ASC")
                print(result)
                result = handle_request(result, start, end, sort_field, order)

                response = JsonResponse(result, safe=False)
                response["Access-Control-Expose-Headers"] = "X-Total-Count"
                response["X-Total-Count"] = len(result)
                return response
        elif request.method == 'POST':
            body_str = request.body.decode('utf-8')
            
            # Parse the string as JSON
            post_data = json.loads(body_str)
            
            # Print the JSON data
            print(post_data)
            connection_data = connection_factory(post_data.get("id"), post_data.get("uri"), post_data.get("source"), post_data.get("siteId"))
            print(json.dumps(connection_data, indent=4))
            # Send to ditto
            target_url = os.getenv("BASE_URL_CREATE_CONNECTION")
            username = os.getenv("USERNAME_DEVOPS")
            password = os.getenv("PASSWORD_DEVOPS")
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }

            response = requests.post(target_url, headers=headers, json=connection_data)

            print(response.text)
            response_data = response.json()
            if response_data['status'] == 409:
                data = {'message': 'The Connection with this ID was already created. If you need to update it, remove it first before creating it again.'}
                return JsonResponse(data, status=400)
            data = {'message': 'Created a new object'}
            return JsonResponse(data, status=201)
            
        elif request.method == 'PUT':
            pass
        elif request.method == 'DELETE':
            # Retrieve the base URL from the environment
            target_url = os.getenv("BASE_URL_GET_ALL_CONNECTION")

            username = os.getenv("USERNAME_DEVOPS")
            password = os.getenv("PASSWORD_DEVOPS")

            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }
            target_url_with_id = f"{target_url}/{connection_id}"
            print("Target URL with ID:", target_url_with_id)
            response = requests.delete(
                    target_url_with_id, headers=headers
            )
            print(response.status_code)

            return JsonResponse({"tset":"test"})            
            
    except Exception as e:
        error_message = str(e)
        print(error_message)  # Print the error message for debugging

        # Return a JSON response with the error message
        return JsonResponse({'error': error_message}, status=500)
        pass
        print(sort_field)
        order = request.GET.get("_order", "ASC")

        # Define sorting order
        if order == "DESC":
            sort_field = "-" + sort_field

        # Query inverter
        inverters = inverters.order_by(sort_field)[start:end]

        result = []
        # Iterating over items in the JSON data
        for item in data:
            # Extracting relevant data from each item
            connection_id = item.get("id")
            uri = item.get("uri")
            # Accessing nested structures safely with get() to avoid KeyError
            source_address = item.get("sources", [{}])[0].get("addresses", [])[0]
            site = item.get("tags", [])[0]
            numeric_part = site[len("site") :]

            # Constructing dictionary for each item
            connection_data = {
                "id": connection_id,
                "uri": uri,
                "source": source_address,
                "site_id": int(numeric_part),
            }
            result.append(connection_data)

        response = JsonResponse(result, safe=False)
        response["Access-Control-Expose-Headers"] = "X-Total-Count"
        response["X-Total-Count"] = len(result)

        # except Exception as e:
        #     print(f"An error occurred: {e}")
        #     return JsonResponse({"error": str(e)}, status=500)
        # return response


        return JsonResponse({"test":"er"})
    
    return JsonResponse({"broken":"heart"})
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
        error_message = (
            f"Error fetching connections. Status code: {response.status_code}"
        )
        return JsonResponse({"error": error_message}, status=500)

    if connection_id is not None:
        inverter = get_object_or_404(Inverter, pk=connection_id)
        data = {
            "id": inverter.inverterID,
            "inverter manufacturer": inverter.manufacturer,
            "invertersd": inverter.location,
            # Add other fields as needed
        }
        return JsonResponse(data)
    # Parse query parameters
    start = int(request.GET.get("_start", 0))
    end = int(request.GET.get("_end", 10))
    sort_field = request.GET.get("_sort", "id")
    if sort_field == "id":
        sort_field = "inverterID"
    print(sort_field)
    order = request.GET.get("_order", "ASC")

    # Define sorting order
    if order == "DESC":
        sort_field = "-" + sort_field

    # Query inverter
    inverter = Inverter.objects.order_by(sort_field)[start:end]
    # Get the total count of objects

    # Serialize data
    data = list(inverter.values())

    for item in data:
        new_item = {}
        for (
            key,
            value,
        ) in item.items():  # Iterate over key-value pairs of the dictionary
            if key == "inverterID":
                new_item["id"] = value
            else:
                new_item[key] = value
        # Update the original dictionary with the modified one
        item.clear()
        item.update(new_item)

    response = JsonResponse(data, safe=False)
    response["Access-Control-Expose-Headers"] = "X-Total-Count"
    response["X-Total-Count"] = len(data)

    # Return JSON response
    return response

@csrf_exempt
def get_connection_new(request, connection_id=None):
    if request.method == 'GET':
        try:
            target_url = os.getenv("BASE_URL_GET_ALL_CONNECTION")
            username = os.getenv("USERNAME_DEVOPS")
            password = os.getenv("PASSWORD_DEVOPS")
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }

            response = requests.get(target_url, headers=headers)
            print(response.text)

            # Handle GET request
            if connection_id is not None:
                # If a primary key is provided, return details of the specific object
                # Replace this with your logic to retrieve the object from the database
                data = {'message': f'Retrieving object with id {connection_id}'}
            else:
                # If no primary key is provided, return a list of objects

                data = {'message': 'Retrieving list of objects'}
            return JsonResponse(data)
        except:
            return JsonResponse(data)

    elif request.method == 'POST':
        # Handle POST request
        # Replace this with your logic to create a new object using request data
        data = {'message': 'Creating a new object'}
        return JsonResponse(data, status=201)  # Return 201 Created status code

    elif request.method == 'PUT':
        # Handle PUT request
        # Replace this with your logic to update an existing object with the provided primary key using request data
        data = {'message': f'Updating object with id {pk}'}
        return JsonResponse(data)

    elif request.method == 'DELETE':
        # Handle DELETE request
        # Replace this with your logic to delete an existing object with the provided primary key
        data = {'message': f'Deleting object with id {pk}'}
        return JsonResponse(data)

    else:
        # Return an error response for unsupported methods
        return JsonResponse({'error': 'Method not allowed'}, status=405)


    
    return JsonResponse({"ok":"bro"})

@csrf_exempt
def get_token(request):
    url = 'http://192.168.1.210:7000/api/v2/login'

    # Define the headers
    headers = {
        'Content-Type': 'application/json',
        # 'Authorization': 'Bearer <token>'
    }

    data = {
        "name": "admin",
        "pass": "0000"
    }

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        # Extract JWT token from response and store it in Django's session

        jwt_token = response.json().get('token')
        request.session['jwt_token'] = jwt_token
        print(jwt_token)

        # Process the response data
        data = response.json()
    return JsonResponse({"token": jwt_token})

def refresh_token(request):    
    target_url = os.getenv("BASE_URL_NEURON")  
    target_url = target_url + '/api/v2/login'
    print(target_url)

    # Define the headers
    headers = {
        'Content-Type': 'application/json',
        # 'Authorization': 'Bearer <token>'
    }

    data = {
        "name": "admin",
        "pass": "0000"
    }

    response = requests.post(target_url, headers=headers, json=data)
    if response.status_code == 200:
        jwt_token = response.json().get('token')
        print("get token successfully")


        return jwt_token
    return None

@csrf_exempt
def test_token(request):
    token = request.session.get('jwt_token')
    print(token)
    return JsonResponse({"token": token})

def create_device(node, request, host, port):
    token = refresh_token(request)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'  
    }

    target_url = os.getenv("BASE_URL_NEURON")  
    target_url = target_url + '/api/v2/node'
    print("Target URL:", target_url)
    print(node)

    # Define the JSON data
    data = {
        "name": node,
        "plugin": "Modbus TCP",
        # "params": {
        #     "param1": 1,
        #     "param2": "1.1.1.1",
        #     "param3": True,
        #     "param4": 11.22
        # }
    }
    # Send the POST request
    response = requests.post(target_url, headers=headers, json=data)

    # Print the response
    print(response.text)
    print(response.status_code)
    if response.status_code == 409:
        return 1
    device_setting(request, node, token, host, 502)
    return 0

def device_setting(request, node, token, host, port):
    print(f'host {host}')
    print(f'port {port}')
 

    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }
    
    # NODE SETTING
    target_url = os.getenv("BASE_URL_NEURON")  
    target_url = target_url + '/api/v2/node/setting'
    print("Target URL:", target_url)
    print(f'debug 1 {port}')
   

    data = {
        "node": node,
        "params": {
            # // required, 0 the neuron driver is used as the client, 1 the neuron driver is used as the server
            "connection_mode": 0,
            # // required, client: host means the ip of the remote device. server: it means the ip used by neuron locally
            "host": host, ### USER INPUT ###
            # // required, client: port means the tcp port of the remote device. server: it means the tcp port used by neuron locally
            "port": port, ### USER INPUT ###
            # // required, timeout for sending requests to the device
            "timeout": 3000, ### USER INPUT ###
            # // required, send reading instruction interval(ms)
            "interval": 20,
            # // required, TCP transfer(0) or UDP transfer(1)
            "transport_mode": 0,
            # // required, the maximum number of retries after a failed attempt to send a read command
            "max_retries": 0,
            # // required, resend reading instruction interval(ms) after a failed attempt to send a read command
            "retry_interval": 0
        }
    }
    print(f'debug 2 {port}')

    response = requests.post(target_url, headers=headers, json=data)
    print(f'debug 3 {port}')


    # Print the response
    print(response.text)
    print(response.status_code)
    if response.status_code == 404:
        return 1
    if response.status_code == 403 or response.status_code == 401:
        token = refresh_token(request)
        if token is not None:
            return device_setting(request, node, token, host, port)
        else :
            return 1

    # ### ADD GROUP ###
    # url = 'http://192.168.1.210:7000/api/v2/group'

    # data = {
    #     # group name
    #     "group": "defaultgroup",
    #     # node name
    #     "node": "modbus-tcp-node",
    #     # read/upload interval(ms)
    #     "interval": 10000 ### USER INPUT ###
    # }

    # response = requests.post(url, headers=headers, json=data)
    # # Print the response
    # print("group")
    # print(response.text)
    # print(response.status_code)
    # if response.status_code == 400:
    #     return JsonResponse({"something": "wrong"})
    # print("group")
    ### ADD TAG ###
    add_group(node, token, request)

    return 0

@csrf_exempt
def add_group(node, token, request):
    print("Executing ADD GROUP")
    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }
    
    base_url = os.getenv("BASE_URL_NEURON")
    target_url = base_url + f'/api/v2/group?node={node}'
    print("Target URL:", target_url)

    response = requests.get(target_url, headers=headers)
    # Print the response
    print(response.text)
    print(response.status_code)
    if response.status_code == 400:
        return JsonResponse({"something": "wrong"})
    elif response.status_code == 403:
        token = refresh_token(request)
        return add_group(node, token, request)
    elif response.status_code == 200:
        data = response.json()
        if len(data.get('groups', [])) == 0:
            print("The 'groups' key contains an empty list.")
            ### add default group
            target_url = base_url + f'/api/v2/group'
            data = {
                "group": "test",
                "node": node,
                "interval": 1000
            }
            response = requests.post(target_url, headers=headers, json=data)
            # Print the response
            print(response.text)
            print(response.status_code)
            if response.status_code == 400:
                return JsonResponse({"something": "wrong"})
            elif response.status_code == 403:
                token = refresh_token(request)
                return add_group(node, token, request)
            elif response.status_code == 200:

                ### continue to add tags
                add_tag(node, token, request)
                return 0

            ###
        else:
            return 0

    
    
    ### ADD TAG ###
    return JsonResponse({"good": "dfs"})


@csrf_exempt
def add_tag(node, token, request):
    ### ADD GROUP ###
    base_url = os.getenv("BASE_URL_NEURON")
    target_url = base_url + f'/api/v2/tags'
    print("Target URL:", target_url)

    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }

    data = {
    # //node name
        "node": node,
    # //group name
        "group": "test",
        "tags": [
        {
            "type": 9,
            "name": "meterReadTotalEnergy",
            "attribute": 3,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40001",
            "description": ""
        },
        {
            "type": 9,
            "name": "activePower",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40003",
            "description": ""
        },
        {
            "type": 9,
            "name": "inputPower",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40005",
            "description": ""
        },
        {
            "type": 9,
            "name": "efficiency",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40007",
            "description": ""
        },
        {
            "type": 9,
            "name": "internalTemp",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40009",
            "description": ""
        },
        {
            "type": 9,
            "name": "gridFrequency",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40011",
            "description": ""
        },
        {
            "type": 9,
            "name": "productionToday",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40013",
            "description": ""
        },
        {
            "type": 9,
            "name": "yieldToday",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40015",
            "description": ""
        },
        {
            "type": 9,
            "name": "reactivePower",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40017",
            "description": ""
        },
        {
            "type": 9,
            "name": "apparentPower",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40019",
            "description": ""
        },
        {
            "type": 9,
            "name": "powerFactor",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40021",
            "description": ""
        },
        {
            "type": 9,
            "name": "stage",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40023",
            "description": ""
        },
        {
            "type": 9,
            "name": "capacity",
            "attribute": 1,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40025",
            "description": ""
        },
        {
            "type": 9,
            "name": "fanSpeed",
            "attribute": 3,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40027",
            "description": ""
        },
        {
            "type": 9,
            "name": "limitOutput",
            "attribute": 3,
            "precision": 2,
            "decimal": 0.0,
            "address": "1!40029",
            "description": ""
        }
    ]
        
    }
    
    ## INT8 UINT8 INT16 UINT16 INT32 UINT32 INT64 UINT64 FLOAT DOUBLE BIT BOOL STRING BYTES ERROR WORD DWORD LWORD 
    ##   1    2    3      4      5       6    7     8       9    10    11   12   13    14     15   16   17     18

    response = requests.post(target_url, headers=headers, json=data)
    # Print the response
    print("group")
    print(response.text)
    print(response.status_code)
    print("group")
    if response.status_code == 400:
        return JsonResponse({"something": "wrong"})
    if response.status_code == 403:
        refresh_token(request)
        return add_tag(request)
    if response.status_code == 200:    
        return JsonResponse({"good": "dfs"})
        
        pass
    

    return JsonResponse({"good": "dfs"})

@csrf_exempt
def create_northapp(request):
    token = refresh_token('request')

    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }

    base_url = os.getenv("BASE_URL_NEURON")
    target_url = base_url + f'/api/v2/node'
    print("Target URL:", target_url)

    data = {
        "name": "invertersite1",
        "plugin": "MQTT"
    }

    response = requests.post(target_url, headers=headers, json=data)
    # Print the response
    print(response.text)
    print(response.status_code)


    if response.status_code == 400:
        return JsonResponse({"something": "wrong"})
    if response.status_code == 403:
        refresh_token(request)
        return create_northapp(request)
    
    setting_northapp("invertersite1", 'broker.emqx.io', 1883, token)

    return JsonResponse({"good": "dfs"})
    
def change_middle_string(original_string, new_middle):
    # Split the original string based on the delimiter '/'
    parts = original_string.split('/')
    
    # Replace the middle part with the new string
    middle_index = len(parts) // 2
    parts[middle_index] = new_middle
    
    # Join the parts back together using the delimiter '/'
    modified_string = '/'.join(parts)
    
    return modified_string


def setting_northapp(node, host, port, token):
    print('in setting north app')
    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }
    url = 'http://192.168.1.210:7000/api/v2/node/setting'


    client_id = str(uuid.uuid4())
    print(client_id)

    req_string = "/neuron/placeholder/write/req"
    new_node = node
    new_req_string = change_middle_string(req_string, new_node)
    req_string = "/neuron/placeholder/write/resp"
    new_node = node
    new_resp_string = change_middle_string(req_string, new_node)

    data = {
        "node": node,
        "params":{
            "client-id": client_id,
            "qos":0,
            "format":0,
            "write-req-topic": new_req_string,
            "write-resp-topic": new_resp_string,
            "offline-cache":False,
            "cache-sync-interval":100,
            "host": host,
            "port": int(port),
            "username":"",
            "password":"",
            "ssl":False
        }
    }

    response = requests.post(url, headers=headers, json=data)
    # Print the response
    print(response.text)
    print(response.status_code)


    if response.status_code == 400:
        return JsonResponse({"something": "wrong"})
    if response.status_code == 403:
        return JsonResponse({"something": "wrong"})

    return 0


def subscribe_to_new_node(app, node, topic ):
    token = refresh_token('request')
    base_url = os.getenv("BASE_URL_NEURON")
    target_url = base_url + f'/api/v2/subscribe'
    print("Target URL:", target_url)

    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }

    data = {
        "app": app,
        "driver": node,
        "group": "test",
        "params": {
            "topic": topic
        }
    }    


    response = requests.post(target_url, headers=headers, json=data)
    # Print the response
    print(response.text)
    print(response.status_code)
    if response.status_code == 400:
        return JsonResponse({"something": "wrong"})
    if response.status_code == 403:
        token = refresh_token('temp')
        return subscribe_to_new_node(app, node, token, topic)
    if response.status_code == 200:    
        print("success subcribe")
        return 0
    return 0

 




@csrf_exempt
def subscribe(siteId, node, topic, request, token):
    ### find all inverter has a siteId = 2
    inverters = Inverter.objects.filter(site=siteId)
    # 
    driver_list = []
    # Process the retrieved inverters
    for inverter in inverters:
        # Example action: Print inverter details
        print("Inverter ID:", inverter.inverterID)
        driver = "inv" + str(inverter.inverterID)
        driver_list.append(driver)
    group = []
    for entry in driver_list:
        group_template = {
            "driver": entry,  # Assign entry to 'driver' key
            "group": "defaultgroup",
            "params": {
                "topic": topic  # SAME AS DITTO
            }
        }
        group.append(group_template)  

    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }
    url = 'http://192.168.1.210:7000/api/v2/subscribes'

    data = {
        "app": node,
        "groups": group,
    }  
    print(data)
    try:
        response = requests.post(url, headers=headers, json=data)
        # Print the response
        print(response.text)
        print(response.status_code)

        if response.status_code == 400:
            return JsonResponse({"something": "wrong"})
        if response.status_code == 403:
            return JsonResponse({"good": "dfs"})
    except Exception as e:
        print(str(e))

    
@csrf_exempt
def get_devices(request, inverter_id=None):
    if request.method == "GET":

        if inverter_id is not None:
            try:
                inverter = get_object_or_404(Inverter, pk=inverter_id)
                print(inverter)
                # Printing all attributes of the inverter object
                data = {
                    "id": inverter.inverterID,
                    "manufacturer": inverter.manufacturer,
                    "model": inverter.model,
                    "serialNumber": inverter.serialNumber,
                    "location": inverter.location,
                    "site_id": inverter.site_id,
                }
                
                token = request.session.get('jwt_token')
                print(token)

                headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'  # Using f-string to insert the token
                }
                url = 'http://192.168.1.210:7000/api/v2/node/setting'
                param = f'?node=inv{inverter.inverterID}'

                # Concatenate the strings
                url = url + param
                print(url)              
                response = requests.get(url, headers=headers)
                # Print the response
                print(response.text)
                print(response.status_code)

                if response.status_code == 200:      
                             
                    data_dict = response.json()
                    if "error" in data_dict:
                        # "error" key exists in data_dict
                        print("Error exists:", data_dict["error"])
                    else:
                        # Nếu "error" tồn tại và có giá trị là 0, tiếp tục thêm dữ liệu
                        add_data = {
                            "host": data_dict["params"]["host"],
                            "port": data_dict["params"]["port"]
                        }
                        
                        data.update(add_data)  
                
                                                              

                if response.status_code == 400:
                    return JsonResponse({"something": "wrong"})
                if response.status_code == 403 or response.status_code == 401:
                    refresh_token(request)
                    return get_devices(request, inverter_id)

                return JsonResponse(data)
            except Http404:
                # If the object is not found, handle the exception here
                # For example, return a custom response or redirect to another page
                return JsonResponse({"error": "Inverter not found"}, status=404)
        # Parse query parameters
        start = int(request.GET.get("_start", 0))
        end = int(request.GET.get("_end", 10))
        sort_field = request.GET.get("_sort", "id")
        site_id = request.GET.get("site_id")

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
                return JsonResponse(
                    {"error": "Invalid site_id. Please provide a valid integer value."},
                    status=400,
                )
        else:
            # Handling case where site_id is missing
            inverters = Inverter.objects.all()

        if sort_field == "id":
            sort_field = "inverterID"
        print(sort_field)
        order = request.GET.get("_order", "ASC")

        # Define sorting order
        if order == "DESC":
            sort_field = "-" + sort_field

        # Query inverter
        inverters = inverters.order_by(sort_field)[start:end]

        # Serialize data
        data = list(inverters.values())

        for item in data:
            new_item = {}
            for (
                key,
                value,
            ) in item.items():  # Iterate over key-value pairs of the dictionary
                if key == "inverterID":
                    new_item["id"] = value
                else:
                    new_item[key] = value
            # Update the original dictionary with the modified one
            item.clear()
            item.update(new_item)

        response = JsonResponse(data, safe=False)
        response["Access-Control-Expose-Headers"] = "X-Total-Count"
        response["X-Total-Count"] = len(data)

        # Return JSON response
        return response
    elif request.method == "POST":
        try:
            # Retrieve the base URL from the environment
            target_url = os.getenv("BASE_URL_GET_ALL_THING")

            username = os.getenv("USERNAME")
            password = os.getenv("PASSWORD")

            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }

            # Forward the request to the target URL with authentication headers
            # response = requests.get(target_url, headers=headers)
            post_data = json.loads(request.body)
            site_id = int(post_data.get('siteId'))

            site_instance = get_object_or_404(Site, siteID=site_id)
            print(site_id)
            latest_id = Inverter.objects.aggregate(Max("inverterID"))["inverterID__max"]
            print("last id", latest_id)

            # Increment the ID for the new record
            new_id = latest_id + 1 if latest_id is not None else 1

            target_url_with_id = f"{target_url}/my.inverter:inv{new_id}"
            print("Target URL with ID:", target_url_with_id)

            new_inverters = {
                "policyId": "my.test:policy",
                "attributes": {
                    "manufacturer": post_data.get("manufacturer"),
                    "model": post_data.get("model"),
                    "serial number": post_data.get("serialNumber"),
                    "location": post_data.get("location"),
                    "site": post_data.get("siteId"),
                },
                "features": {
                    "measurements": {
                        "properties": {
                            "capacity": 0,
                            "internal temp": 0,
                            "input power": 0,
                            "grid frequency": 0,
                            "power factor": 0,
                        }
                    }
                },
            }

            print(type(new_inverters))
            json_data = json.dumps(new_inverters)
            print(type(json_data))

            response = requests.put(
                target_url_with_id, json=new_inverters, headers=headers
            )

            print(response.text)  # This prints the response content as a string
            print(response.status_code)  # This prints the HTTP status code
            if response.status_code == 201 or response.status_code == 204:
                # Request was successful
                print("PUT request was successful")
                # Save the new Site instance to the database
                try:
                    # Create a new Site instance with the extracted data
                    inverter = Inverter(
                        inverterID=new_id,
                        site=site_instance,
                        manufacturer=post_data.get("manufacturer"),
                        model=post_data.get("model"),
                        serialNumber=post_data.get("serialNumber"),
                        location=post_data.get("location"),
                    )
                    inverter.full_clean()  # Validate the model fields
                    inverter.save()  # Save the record
                    # Create in neuron
                    node = "inv" + f'{new_id}'
                    temp = create_device(node, request)
                    print(temp)

                except ValidationError as e:
                    return JsonResponse({"error": str(e)}, status=400)

            else:
                # Print the status code if the request was not successful
                print(f"PUT request failed with status code {response.status_code}")
                return JsonResponse({"error": "Something went wrong"}, status=500)
            response = {
                'id': new_id,
                'site_id': site_id,
                'manufacturer': post_data.get("manufacturer"),
                'model': post_data.get("model"),
                'serialNumber': post_data.get("serialNumber"),
                'location':  post_data.get("location"),
            }
            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "PUT":
        try:
            # Logic for handling PUT requests
            put_data = json.loads(request.body)
            print("Request body:", put_data)

            # Extract relevant fields
            id = put_data.get("id")
            site_id = put_data.get("site_id")
            node = str(id)
            node = "inv" + node
            host = put_data.get("host")
            port = int(put_data.get("port"))
            print("host")
            print(host)
            print("node")
            print(node)

            # Retrieve the existing record from the database
            try:
                inverter = Inverter.objects.get(pk=id)
            except Inverter.DoesNotExist:
                return JsonResponse({"error": "Inverter not found"}, status=404)

            # Retrieve the base URL from the environment
            target_url = os.getenv("BASE_URL_GET_ALL_THING")

            username = os.getenv("USERNAME")
            password = os.getenv("PASSWORD")

            headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic "
                + b64encode((username + ":" + password).encode()).decode("utf-8"),
            }
            target_url_with_id = f"{target_url}/my.inverter:inv{id}"
            print("Target URL with ID:", target_url_with_id)

            new_inverters = {
                "policyId": "my.test:policy",
                "attributes": {
                    "manufacturer": put_data.get("manufacturer"),
                    "model": put_data.get("model"),
                    "serial number": put_data.get("serialNumber"),
                    "location": put_data.get("location"),
                    "site": put_data.get("site_id"),
                },
                "features": {
                    "measurements": {
                        "properties": {
                            "capacity": 0,
                            "internal temp": 0,
                            "input power": 0,
                            "grid frequency": 0,
                            "power factor": 0,
                        }
                    }
                },
            }
            response = requests.put(
                target_url_with_id, json=new_inverters, headers=headers
            )

            print(response.text)  # This prints the response content as a string
            print(response.status_code)  # This prints the HTTP status code
            if response.status_code == 201 or response.status_code == 204:
                print("PUT request was successful")
                try:
                    # Get the site ID from the request data
                    site_id = int(put_data.get("site_id"))

                    # Fetch the Site instance corresponding to the site ID
                    site_instance = get_object_or_404(Site, siteID=site_id)

                    # Create or update the Inverter instance
                    inverter.inverterID=id
                    inverter.site=site_instance
                    inverter.manufacturer=put_data.get("manufacturer")
                    inverter.model=put_data.get("model")
                    inverter.serialNumber=put_data.get("serialNumber")
                    inverter.location=put_data.get("location")

                    # Validate the model fields
                    inverter.full_clean()

                    # Save the record
                    inverter.save()       
                    token = refresh_token(request)

                    temp = device_setting(request, node, token, host, port)
                    if temp == 1:
                        return JsonResponse({"error": "Internal Server Error. Please try again later."}, status=500)

                except ValidationError as e:
                    logger.error("Validation Error: %s", str(e))
                    return JsonResponse({"error": str(e)}, status=400)

            else:
                print(f"PUT request failed with status code {response.status_code}")
                return JsonResponse({"error": "PUT request failed"}, status=400)
            
            response = {
                'id': put_data.get("id"),
                'site_id': put_data.get("site_id"),
                'manufacturer': put_data.get("manufacturer"),
                'model': put_data.get("model"),
                'serialNumber': put_data.get("serialNumber"),
                'location': put_data.get("location"),
            }
            return JsonResponse(response)

        except Exception as e:
            print(str(e))
            # logger.error("Validation Error: %s", str(e))
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "DELETE":
        # Logic for handling DELETE requests
        inverter = get_object_or_404(Inverter, pk=inverter_id)
        print(inverter)
        # Retrieve the base URL from the environment
        target_url = os.getenv("BASE_URL_GET_ALL_THING")

        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")

        headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic "
            + b64encode((username + ":" + password).encode()).decode("utf-8"),
        }
        target_url_with_id = f"{target_url}/my.inverter:inv{inverter_id}"
        print("Target URL with ID:", target_url_with_id)
        response = requests.delete(
                target_url_with_id, headers=headers
        )
        print(response.status_code)
        # Delete the site
        inverter.delete()
        return JsonResponse({"message": "This is a DELETE request"})

    else:
        # Return an error response for unsupported methods
        return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def get_tags(request, inverter_id=None):
    if request.method == "GET":
        device_id = request.GET.get('deviceId')
        node = "inv" + str(device_id)
        token = refresh_token(request)
        add_group(node, token, request)
        headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'  # Using f-string to insert the token
        }
        url = f'http://192.168.1.210:7000/api/v2/tags?node={node}&group=defaultgroup'
        print(url)

    

        response = requests.get(url, headers=headers)
        # Print the response
        print(response.text)
        print(response.status_code)
        if response.status_code == 400:
            return JsonResponse({"something": "wrong"})
        elif response.status_code == 403:
            token = refresh_token(request)
            return get_tags(node, token, request)
        elif response.status_code == 200:
            data = response.json()
            data = data["tags"]
            print(data)
            id = 1
            for entry in data:
                add_data = {
                    "id": id
                }
                entry.update(add_data)
                id+=1
           
           
        
            response = JsonResponse(data, safe=False)
            response["Access-Control-Expose-Headers"] = "X-Total-Count"
            response["X-Total-Count"] = len(data)

            # Return JSON response
            return response

        # Optionally, you can return a response if needed
        return JsonResponse({"message": "GET request parameters printed"})
        
    elif request.method == "POST":
        json_data = json.loads(request.body)
        device_id = json_data.get('deviceId')

        node = "inv" + str(device_id)

        token = refresh_token(request)
        # add_group(node, token, request)
        # token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJuZXVyb24iLCJib2R5RW5jb2RlIjowLCJleHAiOjE3MTIyNjAwMjksImlhdCI6MTcxMjI1NjQyOSwiaXNzIjoibmV1cm9uIn0.nHFasAjzoPfkfy46YCutWoOA-QsyrMIXOg94CIoI_HYyLj8bxOftCyaGLJCdSw1bc6qe_jSk9h8s6Y_o4WswaqUNmPQ8nsspJ-kRkAGJWDGn22uVv996BSBCsiWY7zOBtRzfJXMTgRmxkkLhtawfHZVsGqbJyBSd0_5XnL_hD0KydMC8MiGgJdz6JcYr8YjHLL5ozh4F02_03wqSHxi3RVb2mowpRe3UPoHQRV9XpsGrnFO8LpQp5yVIJ6NeHvZKUpajfhgWAoB0DNGxWMDcqLaAno3RYcQKibsChg5HUm8YO9tKsHbuAatbG44ggbm8ZEVZQbdW3xp0bO-tKVXTJQ"

        headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'  # Using f-string to insert the token
        }
        url = f'http://192.168.1.210:7000/api/v2/tags'
        data = {
            "node": node,
            "group": "defaultgroup",
            "tags": [        
                {
                    "name": json_data.get('name'),
                    "address": json_data.get('address'),
                    "attribute": int(json_data.get('attribute')),
                    "type": int(json_data.get('type'))
                }
            ]
        }
        print(data)

        response = requests.post(url, headers=headers, json=data)
        # Print the response
        print(response.text)
        print(response.status_code)
        if response.status_code == 400:
            return JsonResponse({"error": "Bad Request"}, status=400)
        elif response.status_code == 403:
            return JsonResponse({"error": "Forbidden"}, status=403)
        elif response.status_code == 200:
            # data = {
            #     'siteId': ### TODO find siteId using deviceId later
            #     'deviceId':json_data.get('deviceId')
            # }
            return JsonResponse({"message": "Success"}, status=200)

    
    elif request.method == "PUT":
        add_group(node, None, request)
        pass
    elif request.method == "POST":
        pass
    else:
        # Handle other request methods or return a default response
        return JsonResponse({"error": "Method not allowed"}, status=405)

def connection_factory_ditto_neuron(id, siteId, brokeruri, port, uptopic, ):
    origin_connection = {
        "targetActorSelection": "/system/sharding/connection",
        "headers": {
            "aggregate": False
        },
        "piggybackCommand": {
            "type": "connectivity.commands:createConnection",
            "connection": {
                "id": "mqtt-connection-source-1",
                "connectionType": "mqtt",
                "connectionStatus": "open",
                "failoverEnabled": True,
                "uri": "tcp://test.mosquitto.org:1883",
                "sources": [
                    {
                        "addresses": [
                            "my.inverters/#"
                        ],
                        "authorizationContext": [
                            "nginx:ditto"
                        ],
                        "qos": 0,
                        "filters": []
                    }
                ],
                "mappingContext": {
                    "mappingEngine": "JavaScript",
                    "options": {
                        "incomingScript": "function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload));const jsonData = JSON.parse(jsonString);const thingId = [\"my.inverter\", \"inv01\"];const value = {measurements: {properties: {capacity: jsonData.values.capacity,internalTemp: jsonData.values.internalTemp,inputPower: jsonData.values.inputPower,gridFrequency: jsonData.values.gridFrequency,powerFactor: jsonData.values.powerFactor,}}};thingId[0]= 'my.inverter';thingId[1]= jsonData.node;return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value);}",
                        "outgoingScript": "function mapFromDittoProtocolMsg(namespace, id, group, channel, criterion, action, path, dittoHeaders, value, status, extra) {return null;}",
                        "loadBytebufferJS": "false",
                        "loadLongJS": "false"
                    }
                },
                "tags": [
                    "site2"
                ]
            }
        }
    }    

    site = "site" + str(siteId)
    print(site)
    print(brokeruri)
    uri = f"tcp://{brokeruri}:{port}"
    print(uri)

    origin_connection["piggybackCommand"]["connection"]["id"] = id
    origin_connection["piggybackCommand"]["connection"]["uri"] = uri
    origin_connection["piggybackCommand"]["connection"]["sources"][0]["addresses"][0] = uptopic
    origin_connection["piggybackCommand"]["connection"]["tags"][0] = site

    return origin_connection

def add_node(node, mytype, request, token):  

    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'  # Using f-string to insert the token
    }

    # Define the JSON data
    data = {
        "name": node,
        "plugin": mytype,
    }
    url = 'http://192.168.1.210:7000/api/v2/node'
    # Send the POST request
    response = requests.post(url, headers=headers, json=data)

    # Print the response
    print(response.text)
    print(response.status_code)
    if response.status_code == 409:
        return 409
    
    return 0


@csrf_exempt
def get_connection_ditto_neuron(request, connection_id=None):
    if request.method == 'GET':

        target_url = os.getenv("BASE_URL_GET_ALL_CONNECTION")
        username = os.getenv("USERNAME_DEVOPS")
        password = os.getenv("PASSWORD_DEVOPS")
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic "
            + b64encode((username + ":" + password).encode()).decode("utf-8"),
        }

        response = requests.get(target_url, headers=headers)

        # Checking if the request was successful (status code 200)
        if response.status_code == 200:
            result = []
            # Parsing the JSON response
            data = response.json()

            # Handle parameters
            # Parse query parameters
            start = int(request.GET.get("_start", 0))
            end = int(request.GET.get("_end", 10))
            sort_field = request.GET.get("_sort", "id")
            site_id = request.GET.get("site_id")

            if connection_id is not None:
                for item in data:
                    if item.get("id") == connection_id:
                        # Constructing dictionary for each item
                        site = item.get("tags", [])[0]
                        numeric_part = int(site[len("site") :])
                        connection_data = {
                            "id": connection_id,
                            "uri": item.get("uri"),
                            "source": item.get("sources", [{}])[0].get(
                                    "addresses", []
                                )[0],
                            "site_id": int(numeric_part),
                        }
                        return JsonResponse(connection_data)
                return JsonResponse({'error':'Not found'}, status=404)

            # Checking if site_id is provided and valid
            if site_id is not None:
                try:
                    site_id = int(site_id)
                    # Filtering inverters based on site_id
                    if site_id != 0:
                        for item in data:
                            # # Extracting relevant data from each item
                            site = item.get("tags", [])[0]

                            numeric_part = int(site[len("site") :])

                            if numeric_part == site_id:
                                print(f"numeric_part == clled")
                                connection_id = item.get("id")
                                uri = item.get("uri")
                                # Accessing nested structures safely with get() to avoid KeyError
                                source_address = item.get("sources", [{}])[0].get(
                                    "addresses", []
                                )[0]
                                site = item.get("tags", [])[0]

                                # Constructing dictionary for each item
                                connection_data = {
                                    "id": connection_id,
                                    "uri": uri,
                                    "source": source_address,
                                    "site_id": int(numeric_part),
                                }
                                result.append(connection_data)
                        print("result")
                        print(result)
                except ValueError:
                    return JsonResponse(
                        {
                            "error": "Invalid site_id. Please provide a valid integer value."
                        },
                        status=400,
                    )
            else:
                # Handling case where site_id is missing
                ####
                #### get all connections
                # Iterating over items in the JSON data
                for item in data:
                    # Extracting relevant data from each item
                    connection_id = item.get("id")
                    uri = item.get("uri")
                    # Accessing nested structures safely with get() to avoid KeyError
                    source_address = item.get("sources", [{}])[0].get("addresses", [])[
                        0
                    ]
                    site = item.get("tags", [])[0]
                    numeric_part = site[len("site") :]

                    # Constructing dictionary for each item
                    connection_data = {
                        "id": connection_id,
                        "uri": uri,
                        "source": source_address,
                        "site_id": int(numeric_part),
                    }
                    result.append(connection_data)

            # Handle sorting,
            order = request.GET.get("_order", "ASC")
            print(result)
            result = handle_request(result, start, end, sort_field, order)

            response = JsonResponse(result, safe=False)
            response["Access-Control-Expose-Headers"] = "X-Total-Count"
            response["X-Total-Count"] = len(result)
            return response
        else:
            result = []
            response = JsonResponse(result, safe=False)
            response["Access-Control-Expose-Headers"] = "X-Total-Count"
            response["X-Total-Count"] = len(result)
    elif request.method == "POST":
        token = refresh_token(request)
        body_str = request.body.decode('utf-8')
            
        # Parse the string as JSON
        post_data = json.loads(body_str)
        node = post_data.get("id")
        host = post_data.get("host")
        port = post_data.get("port")
        siteId = post_data.get("siteId")
        topic = post_data.get("topic")
        ### Create connection in Ditto
        connection_data = connection_factory_ditto_neuron(node, siteId, host, port, topic)

    
        # Send to ditto
        target_url = os.getenv("BASE_URL_CREATE_CONNECTION")
        username = os.getenv("USERNAME_DEVOPS")
        password = os.getenv("PASSWORD_DEVOPS")
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic "
            + b64encode((username + ":" + password).encode()).decode("utf-8"),
        }
        connection_data_json = json.dumps(connection_data)
        connection_data_json_beautified = json.dumps(connection_data, indent=4)

        # Print the beautified JSON string
        print(connection_data_json_beautified)

        response = requests.post(target_url, headers=headers, json=connection_data)
        print("Status code:", response.status_code)

        print(response.text)
        # response_data = response.json()
        # if response_data['status'] == 409:
        #     data = {'message': 'The Connection with this ID was already created. If you need to update it, remove it first before creating it again.'}
        #     return JsonResponse(data, status=400)

        ### Create connection in Neuron
        add_node(node, "MQTT",request, token)
        setting_northapp(node, host, port, request, token)
        subscribe(siteId, node, topic, request, token)
        return JsonResponse({"df": "df"})
    elif request.method == "PUT":
        pass
    elif request.method == "DELETE":
        pass


#     """
#    elif request.method == 'POST':
#             body_str = request.body.decode('utf-8')
            
#             # Parse the string as JSON
#             post_data = json.loads(body_str)
            
#             # Print the JSON data
#             print(post_data)
#             connection_data = connection_factory(post_data.get("id"), post_data.get("uri"), post_data.get("source"), post_data.get("siteId"))
#             print(json.dumps(connection_data, indent=4))
#             # Send to ditto
#             target_url = os.getenv("BASE_URL_CREATE_CONNECTION")
#             username = os.getenv("USERNAME_DEVOPS")
#             password = os.getenv("PASSWORD_DEVOPS")
#             headers = {
#                 "Content-Type": "application/json",
#                 "Authorization": "Basic "
#                 + b64encode((username + ":" + password).encode()).decode("utf-8"),
#             }

#             response = requests.post(target_url, headers=headers, json=connection_data)

#             print(response.text)
#             response_data = response.json()
#             if response_data['status'] == 409:
#                 data = {'message': 'The Connection with this ID was already created. If you need to update it, remove it first before creating it again.'}
#                 return JsonResponse(data, status=400)
#             data = {'message': 'Created a new object'}
#             return JsonResponse(data, status=201)
   
   
   
   
#    """
@csrf_exempt
def handle_threshold(request):
    if request.method == 'GET':
        target_url = os.getenv("BASE_URL_DITTO")

        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")

        headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic "
            + b64encode((username + ":" + password).encode()).decode("utf-8"),
        }
        target_url_with_id = f"{target_url}/api/2/things/my.threshold:th1"
        print("Target URL with ID:", target_url_with_id)
        try:
            response = requests.get(target_url_with_id, headers=headers)
            print("Ditto start")
            print(response.status_code)
            print(response.text)
            print("Ditto end")
            
            if response.status_code == 200:
                data = response.json()  # Parse JSON data from the response
                return JsonResponse(data)
            else:
                # Return an error response if the status code is not 200
                return JsonResponse({'error': 'Failed to fetch data from Ditto', 'status_code': response.status_code}, status=response.status_code)
        except requests.RequestException as e:
            # Handle any exceptions that occur during the request
            print(f"RequestException: {e}")
            return JsonResponse({'error': 'Request failed', 'details': str(e)}, status=500)
    elif request.method == 'PUT':
        # Parse JSON data from the request body
        data = json.loads(request.body)
        print(data)  # Print the JSON data

        target_url = os.getenv("BASE_URL_DITTO")

        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")

        headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic "
            + b64encode((username + ":" + password).encode()).decode("utf-8"),
        }
        target_url_with_id = f"{target_url}/api/2/things/my.threshold:th1"
        print("Target URL with ID:", target_url_with_id)
        try:
            response = requests.get(target_url_with_id, headers=headers)
            print("Ditto start")
            threshold = response.json()
            print(threshold['features']['thresholds']['properties']['internalTempWarning'])
            threshold['features']['thresholds']['properties']['internalTempWarning'] = data.get('internalTempWarning')
            threshold['features']['thresholds']['properties']['internalTempFault'] = data.get('internalTempFault')
            threshold['features']['thresholds']['properties']['inputPowerWarning'] = data.get('inputPowerWarning')
            threshold['features']['thresholds']['properties']['inputPowerFault'] = data.get('inputPowerFault')
            threshold['features']['thresholds']['properties']['outputPowerWarning'] = data.get('outputPowerWarning')
            threshold['features']['thresholds']['properties']['outputPowerFault'] = data.get('outputPowerFault')
            threshold['features']['idlealarm']['properties']['on'] = data.get('on')
            threshold['features']['idlealarm']['properties']['minutesToAlarm'] = data.get('minutesToAlarm')
           
            response2 = requests.put(target_url_with_id, headers=headers, json=threshold)
            print("Ditto end")
            
            if response2.status_code == 200:
                data = response2.json()  # Parse JSON data from the response
                return JsonResponse(data)
            elif response2.status_code == 204:
                return JsonResponse({'status':'success'})
            else:
                # Return an error response if the status code is not 200
                return JsonResponse({'error': 'Failed to fetch data from Ditto', 'status_code': response.status_code}, status=response.status_code)
        except requests.RequestException as e:
            # Handle any exceptions that occur during the request
            print(f"RequestException: {e}")
            return JsonResponse({'error': 'Request failed', 'details': str(e)}, status=500)
      
    