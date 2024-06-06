import psycopg2
# Database connection parameters
db_params = {
    "database": "test",
    "user": "postgres",
    "password": "123456",
    "host": "localhost",
    "port": "5432",
}

# Establish a database connection
conn = psycopg2.connect(**db_params)

def insertData(conn, data_to_insert):
    try:
        # Create a cursor for executing SQL statements
        cursor = conn.cursor()

        # Define the SQL query with placeholders for data
        insert_query = """
            INSERT INTO iot_invertermeasurement  (
timestamp ,
"internalTemp" , 
"inputPower" , 
"gridFrequency" , 
"powerFactor" ,
inverter_id ,
"activePower" ,
"apparentPower" ,
efficiency ,
"meterReadTotalEnergy" ,
"productionToday" ,
"reactivePower" ,
"yieldToday")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """

        # Execute the query with the data tuple
        cursor.execute(insert_query, data_to_insert)

        # Commit the transaction
        conn.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        # Close the cursor (do not close the connection here)
        cursor.close()

def insertDataWS(conn, data_to_insert):
    try:
        # Create a cursor for executing SQL statements
        cursor = conn.cursor()

        # Define the SQL query with placeholders for data
        insert_query = """
            INSERT INTO iot_weatherstationmeasurement  (
            timestamp ,
            "irradiation" , 
            "irradiance" , 
            "temperature" , 
            "inverter_id"
            )
            VALUES (%s, %s, %s, %s, %s);
        """

        # Execute the query with the data tuple
        cursor.execute(insert_query, data_to_insert)

        # Commit the transaction
        conn.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        # Close the cursor (do not close the connection here)
        cursor.close()




# Never call this function or everything will be gone forever
def deleteAllRowsFromTable(conn, table_name):
    try:
        # Create a cursor for executing SQL statements
        cursor = conn.cursor()

        # Define the SQL query to delete all rows from the table
        delete_query = f"DELETE FROM {table_name}"

        # Execute the query to delete all rows
        cursor.execute(delete_query)

        # Commit the transaction
        conn.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        # Close the cursor (do not close the connection here)
        cursor.close()

if __name__ == "__main__":
    # This is sample of data that will insert to SQL
    data = ('pm01', 76, 73, 42, '2023-10-27T03:46:30.689973564Z', 500)
    insertData(conn, data)
    print('Data inserted into database')

   # Close the database connection when you're done
    conn.close()
