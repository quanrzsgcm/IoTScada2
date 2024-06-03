#!/bin/bash

# Loop from 2 to 101 (100 iterations)
for ((i=36; i<=36; i++)); do
    # Replace {iterationno} with current iterator value
    url="http://localhost:8080/api/2/things/my.inverter:inv${i}"

    # Execute curl command with replaced URL
    curl -X DELETE "${url}" -u 'ditto:ditto' -H 'Content-Type: application/json' -d @inverter.json

    # Add a newline for clarity between each iteration
    echo "Iteration ${i} completed."
done
