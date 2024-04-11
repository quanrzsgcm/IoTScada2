import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Button, Flex } from 'antd';
import PowerMeterDetails from './PowerMeterDetails';

const ThingDetails = ({ thingId }) => {
    return (
        <div>
            <p>Details for Thing ID: {thingId}</p>
            <PowerMeterDetails></PowerMeterDetails>
        </div>
    );
};

function DataTableFull({ selectedThing, updateThing, toggleShow }) {
    const [data, setData] = useState(null);
    const [m_selectedThing, setSelectedThing] = useState(selectedThing);

    const handleOneThingClick = (value) => {
        updateThing(value);
        toggleShow();
        console.log("set from table");
    }

    const fetchData = () => {
        // const url = process.env.REACT_APP_API_URL_1;  // can use if python manage.py runserver 0.0.0.0:8000 else just use
        const url = "http://localhost:8000/api2/my-api/things/";
        console.log(url);
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
            render: (text, record) => (
                <span style={{ cursor: 'pointer', textDecorationColor: 'red', }}
                    onClick={() => {
                        setSelectedThing(record["thingId"])
                        handleOneThingClick(record["thingId"]);
                        }
                    }
                >
                    {text}
                </span>
            )
        },
        {
            title: 'Manufacturer',
            dataIndex: ['attributes', 'manufacturer'],
            key: 'manufacturer',
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
                <p>PowerMeterFullDetails</p>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                // Handle row click
                                console.log('Row clicked:', record);
                            },
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default DataTableFull;
