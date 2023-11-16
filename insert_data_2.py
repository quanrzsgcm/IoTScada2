import psycopg2
from psycopg2 import sql

# Define your database connection parameters
dbname = "test"
user = "postgres"
password = "123456"
host = "localhost"
port = "5432"


# Create a connection to the database
connection = psycopg2.connect(
    dbname=dbname, user=user, password=password, host=host, port=port
)

# Create a cursor
cursor = connection.cursor()

# Define the data to be inserted
data = {
    'power': 100.0,
    'voltage': 220.0,
    'current': 5.0,
    'timestamp': '2023-10-27 08:00:00+00',
    'meter_id': 1,
}

# Create the INSERT statement
insert_query = sql.SQL("INSERT INTO iot_powermeterdata ({}) VALUES ({})").format(
    sql.SQL(', ').join(map(sql.Identifier, data.keys())),
    sql.SQL(', ').join(map(sql.Placeholder, data.values()))
)

# Execute the INSERT statement
cursor.execute(insert_query, data)

# Commit the transaction
connection.commit()

# Close the cursor and connection
cursor.close()
connection.close()
