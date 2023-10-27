import sys
import asyncio
import websockets
import parse_json
import psycopg2
import insert_data_3

conn = None

class YourWebSocketClient:
    def __init__(self):
        self.ws = None

    async def connect(self, connection_config, callback):
        base_url = f"ws://{connection_config.get_username()}:{connection_config.get_password()}@{connection_config.get_host()}/ws/2"
        self.ws = await websockets.connect(base_url)
        await self.on_open(callback)

    async def on_open(self, callback):
        # Implement your onOpen logic here
        await callback(self)

# Example usage:
class ConnectionConfig:
    def __init__(self, username, password, host):
        self.username = username
        self.password = password
        self.host = host

    def get_username(self):
        return self.username

    def get_password(self):
        return self.password

    def get_host(self):
        return self.host

async def main():
    conn = psycopg2.connect(**insert_data_3.db_params)
    connection_config = ConnectionConfig("ditto", "ditto", "localhost:8080")
    client = YourWebSocketClient()
    await client.connect(connection_config, callback)

async def callback(client):
    print("WebSocket connection is open!")
    await client.ws.send("START-SEND-EVENTS")  # Send the "START-SEND-EVENTS" message

    while True:
        response = await client.ws.recv()
        print(f"Received: {response}")
        
        # Add your message processing logic here
        data = parse_json.get_data(response)
        if data is not None:
            insert_data_3.insertData(conn, data)

if __name__ == "__main__":
    try:
        conn = psycopg2.connect(**insert_data_3.db_params)
        asyncio.get_event_loop().run_until_complete(main())
    except KeyboardInterrupt:
        if conn:
            conn.close()  # Close the database connection
            print("KeyboardInterrupt received. Cleaning up connection...")
            sys.exit(0)






