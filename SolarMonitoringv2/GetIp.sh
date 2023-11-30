#!/bin/bash

# Get the IPv4 address associated with the enp0s3 interface
ip_address=$(ip addr show enp0s3 | awk '/inet / {print $2}' | cut -d '/' -f 1)

# Print the result
echo "IPv4 Address: ${ip_address}"

# Your new base URL
new_base_url_1="http://${ip_address}:8080"
new_base_url_2="http://${ip_address}:8000"

echo $new_base_url_1
echo $new_base_url_2

# Use sed to replace the first line with the new base URL
sed -i "1s|.*|REACT_APP_API_BASE_URL_1=${new_base_url_1}|" .env
sed -i "2s|.*|REACT_APP_API_BASE_URL_2=${new_base_url_2}|" .env

echo "First line updated in .env file."
