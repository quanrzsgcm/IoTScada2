import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Button, Flex } from 'antd';


function DataTable() {
    const [data, setData] = useState(null);
    const fetchData = () => {
        // const url = process.env.REACT_APP_API_URL_1;  // can use if python manage.py runserver 0.0.0.0:8000 else just use localhost
        const url = "http://localhost:8000/api2/my-api/things/";
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        // fetch data first time
        fetchData();

        // set up a time interval
        const intervalID = setInterval(fetchData, 2000);

        // clean up the interval when the component unmounts
        return () => clearInterval(intervalID);
    }, []);

    const columns = [
        {
            title: 'Thing ID',
            dataIndex: 'thingId',
            key: 'thingId',
        },
        {
            title: 'Power',
            dataIndex: ['features', 'measurements', 'properties', 'power'],
            key: 'power',
        },
        {
            title: 'Voltage',
            dataIndex: ['features', 'measurements', 'properties', 'voltage'],
            key: 'voltage',
        },
        {
            title: 'Current',
            dataIndex: ['features', 'measurements', 'properties', 'current'],
            key: 'current',
        },
    ];

    return (
        <div>
            <div>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                />
            </div>
        </div>
    );
};

export default DataTable;
