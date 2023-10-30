import React, { useEffect, useState } from 'react';

function DataFetchingComponent() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        // Make a GET request to the desired URL
        const url = `http://localhost:8080/api/2/things`;
        const username = 'ditto';
        const password = 'ditto';
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ':' + password),
        });
        fetch(url, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return    (<div>
    {data ? (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    ) : (
      <p>Loading data...</p>
    )}
  </div>);
}

export default DataFetchingComponent;
