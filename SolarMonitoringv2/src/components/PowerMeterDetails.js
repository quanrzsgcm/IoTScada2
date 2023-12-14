import React, { useEffect, useState } from 'react';
import { Button } from 'antd'
import { Space, Typography } from 'antd';
import App from './DropDownButtonTime';
import { getStartAndEndOfDay } from './testtime';
import ElectricalParameterCheckbox from './Checkbox_PVC';
import MyChart from './Chart_Template';
import MyChart2 from './Chart_Template2';

const { Text, Link } = Typography;

const PowerMeterDetails = ({ showState, selectedThing, updateThing }) => {
    const [show, setShow] = useState(showState);
    const [data, setData] = useState(null);
    const [powerTSData, setpowerTSData] = useState(null);
    const [localselectedThing, setlocalSelectedThing] = useState(selectedThing);
    const [dateString, setDateString] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState('Day');

    const plainOptions = ['Power', 'Voltage', 'Current'];
    const [defaultCheckedList, setdefaultCheckedList] = useState(['Power', 'Voltage', 'Current']);

    useEffect(() => {
        setShow(showState);
    }, [showState]);

    useEffect(() => {
        setlocalSelectedThing(selectedThing);
        console.log("from details", selectedThing);
        setpowerTSData(null);
        fetchDataOneThing(selectedThing);
    }, [selectedThing]);

    useEffect(() => {
        const timezoneOffset = 7;
        const result = getStartAndEndOfDay(dateString, timezoneOffset);
        if (result !== null) {
            let { startOfDay, endOfDay } = result;
            setStartTime(startOfDay);
            setEndTime(endOfDay);
            // fetchData(startOfDay, endOfDay);
        } else {
            console.log('Invalid date string from main');
        }
    }, [dateString])

    const fetchDataOneThing = (thingId) => {
        const url = `http://localhost:8080/api/2/things/${thingId}`;
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
                console.log(data);
                console.log("type of data: ", typeof (data));
                setData(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const fetchData = (localselectedThing, selectedLabel, dateString, typeofmeasurement) => {
        // const startTime = '2023-10-27 10:46:30+07';  // example format
        // const endTime = '2023-10-27 11:16:08+07';  

        const requestData = {
            thingid: localselectedThing,
            typeofmeasurement: typeofmeasurement,
            unitoftime: selectedLabel,
            dateString: dateString,
        };
        console.log(requestData);

        // Get method 
        // const url = `http://127.0.0.1:8000/api2/my-api/?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`;
        // post method, the body store json data

        // const url = process.env.REACT_APP_API_URL_2;
        const url = `http://127.0.0.1:8000/api2/my-api/test/`;
        console.log(url);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                // console.log(response);
                return response.json();
            })
            .then(data => {
                const jsonElement = JSON.stringify(data, null, 2);
                console.log(jsonElement);
                setpowerTSData(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    if (show === true) {
        return (
            <div>
                <div>PowerMeterDetails</div>
                <div style={{ display: 'inline-block' }}>
                    <h2>
                        <pre>{localselectedThing}</pre>
                    </h2>
                    <Space size="large">
                        <Text type="success">Running</Text>
                        <Text type="secondary">Manufacturer: </Text>
                        <Text type="secondary">Model:</Text>
                        <Text type="secondary">Serial Number:</Text>
                        <Text strong>Power: </Text>
                        <Text strong>Voltage: </Text>
                        <Text strong>Current: </Text>
                    </Space>

                </div>
                <div>
                    <Text strong>Production </Text>
                    <App setDateString={setDateString} uppersetSelectedLabel={setSelectedLabel} />
                    <Button onClick={() => fetchData(localselectedThing, selectedLabel, dateString, defaultCheckedList)}> TEST HERE </Button>
                </div>                                    
                <ElectricalParameterCheckbox defaultCheckedList={defaultCheckedList} setdefaultCheckedList={setdefaultCheckedList} plainOptions={plainOptions} />
                <div>
                    <MyChart data={powerTSData} />
                </div>
                <div>
                    <MyChart2  />
                </div>
            </div>
        )
    }
    else return null;
}

export default PowerMeterDetails