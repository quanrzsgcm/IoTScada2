import React, { useEffect } from 'react';
import { Button, notification, Space } from 'antd';


const EventSourceComponent = () => {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        console.log(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/sse`);
        const eventSource = new EventSource(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/sse`);

        eventSource.onmessage = (event) => {
            const notification = event.data;
            console.log(notification)

            const key = `open${Date.now()}`;
            const btn = (
                <Space>
                    <Button type="link" size="small" onClick={() => api.destroy()}>
                        Destroy All
                    </Button>
                    <Button type="primary" size="small" onClick={() => api.destroy(key)}>
                        Confirm
                    </Button>
                </Space>
            );

            api.open({
                message: 'Notification Title',
                description: notification,
                btn,
                key,
                onClose: close,
            });
        };

        return () => {
            eventSource.close();
        };
    }, [api]);

    const close = () => {
        console.log(
            'Notification was closed. Either the close button was clicked or duration time elapsed.',
        );
    };

    const openNotification = () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => api.destroy()}>
                    Destroy All
                </Button>
                <Button type="primary" size="small" onClick={() => api.destroy(key)}>
                    Confirm
                </Button>
            </Space>
        );
        api.open({
            message: 'Notification Title',
            description:
                'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
            btn,
            key,
            onClose: close,
        });
    };
    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={openNotification}>
                Open the notification box
            </Button>
        </>
    );
};

export default EventSourceComponent;
