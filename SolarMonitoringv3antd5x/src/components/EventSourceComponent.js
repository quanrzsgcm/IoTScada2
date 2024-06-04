import React, { useEffect } from 'react';

const EventSourceComponent = () => {
    useEffect(() => {

        console.log(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/sse`);
        
        const eventSource = new EventSource(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/sse`);


        eventSource.onmessage = (event) => {
            const notification = event.data;
            console.log(notification)
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return <div>EventSource component</div>;
};

export default EventSourceComponent;
