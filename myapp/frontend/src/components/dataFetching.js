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
                console.log(data[2]);
                console.log(data[0]);
                console.log(data[1]);
                            
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <ChildComponent data={data} />
      );
        
}
function ChildComponent(props){
    const { data } = props;
  
    const thingid = data && data[0]["thingId"];
  
    // console.log(data);
    const formated = JSON.stringify(data, null, 5);
    console.log(thingid);

    return (
        <div>
          <pre>{formated}</pre>

        </div>
      );
}

export default DataFetchingComponent;
