import asyncio
import websockets

class YourWebSocketClient:
    def __init__(self):
        self.ws = None
        self.response_queue = asyncio.Queue()  # Create a queue for responses

    async def connect(self, connection_config, callback):
        base_url = f"ws://{connection_config.get_username()}:{connection_config.get_password()}@{connection_config.get_host()}/ws/2"
        self.ws = await websockets.connect(base_url)
        await self.on_open(callback)
        print("1")

    async def on_open(self, callback):
        # Implement your onOpen logic here
        await callback(self)
        print("2")


    async def start_response_handling(self):
        print("3")

        while True:
            print(f"in:")
            response = await self.response_queue.get()
            # Handle the response here
            print(f"Handling response:")

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
    connection_config = ConnectionConfig("ditto", "ditto", "localhost:8080")
    client = YourWebSocketClient()
    await client.connect(connection_config, callback)

    # Start the response handling process
    print("here1")
    asyncio.create_task(client.start_response_handling())
    print("here2")


async def callback(client):
    print("WebSocket connection is open!")
    await client.ws.send("START-SEND-EVENTS")  # Send the "START-SEND-EVENTS" message

    while True:
        print(f"befr:")

        response = await client.ws.recv()
        print(f"Received:")
        
        await client.response_queue.put(response)  # Put the response into the queue
        print(f"putted:")

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
