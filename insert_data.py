import psycopg2

# Establish a database connection
conn = psycopg2.connect(
    database="test",
    user="postgres",
    password="123456",
    host="localhost",
    port="5432"
)

# Create a cursor for executing SQL statements
cursor = conn.cursor()

# Insert data
sql = "INSERT INTO iot_powermeterdata  (column1, column2) VALUES (%s, %s)"
data = {
    'power': 100.0,
    'voltage': 220.0,
    'current': 5.0,
    'timestamp': '2023-10-27 08:00:00+00',
    'meter_id': 1,
}
# data = ('value1', 'value2')
cursor.execute(sql, data)

# Commit the transaction
conn.commit()

# Close the cursor and the connection
cursor.close()
conn.close()
