import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'antd'
import { Space, Typography } from 'antd';
import App from './DropDownButtonTime';
import { getStartAndEndOfDay } from './testtime';
import ElectricalParameterCheckbox from './Checkbox_PVC';
import MyChart2 from './Chart_Template2';
import MyChart2c from './Chart_Template2c';
import MyChart2v from './Chart_Template2v';
import AuthContext from '../context/AuthContext';
import MyChart2e from './Chart_Templatee';

const { Text, Link } = Typography;

const PowerMeterDetails = ({ showState, selectedThing, updateThing }) => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [show, setShow] = useState(showState);
    const [data, setData] = useState(null);
    const [TSData, setTSData] = useState(null);
    const [eData, seteData] = useState(null);
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
        setTSData(null);
        seteData(null);
        fetchDataOneThing(selectedThing);
    }, [selectedThing]);

    const chartComponents = {
        'Power': MyChart2,
        'Voltage': MyChart2v,
        'Current': MyChart2c,
    };

    // setTSVoltageData = TSData.map(item => ({
    //     x: item.timestamp,
    //     y: parseFloat(item.power)  // Assuming 'power' is a string, convert it to a floating-point number
    //   }));

    // const transformedvoltageData = TSData.map(item => ({
    //     x: item.timestamp,
    //     y: parseFloat(item.voltage)  // Assuming 'voltage' is a string, convert it to a floating-point number
    //   }));

    // const transformedcurrentData = TSData.map(item => ({
    //     x: item.timestamp,
    //     y: parseFloat(item.current)  // Assuming 'voltage' is a string, convert it to a floating-point number
    //   }));

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
                setData(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    useEffect(() => {
        // Fetch data initially when the component mounts
        fetchDataOneThing();
    
        // Set up an interval to fetch data every 10 seconds
        const intervalId = setInterval(() => {
          fetchDataOneThing();
        }, 5000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
      }, []); // Empty dependency array ensures that the effect runs only once on mount

    const fetchData = (localselectedThing, selectedLabel, dateString, typeofmeasurement) => {
        // const startTime = '2023-10-27 10:46:30+07';  // example format
        // const endTime = '2023-10-27 11:16:08+07';  

        const requestData = {
            thingid: localselectedThing,
            typeofmeasurement: typeofmeasurement,
            unitoftime: selectedLabel,
            dateString: dateString,
        };
        console.log('requestData');
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                const jsonElement = JSON.stringify(data, null, 2);
                // console.log(jsonElement);
                // it looks like this
                // {
                //     "meter_id": "pm08",
                //     "timestamp": "2024-01-02T10:40:00+07:00",
                //     "power": "26.00",
                //     "voltage": "51.00",
                //     "current": "39.00"
                //   },
                setTSData(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    const fetcheData = (localselectedThing, dateString) => {
        // const startTime = '2023-10-27 10:46:30+07';  // example format
        // const endTime = '2023-10-27 11:16:08+07'; 
        let t_unitoftime = ""
        if (selectedLabel === "Day"){
             t_unitoftime = "Week";
        }
        else {t_unitoftime = selectedLabel}


        const requestData = {
            thingid: localselectedThing,
            unitoftime: t_unitoftime,
            dateString: dateString,
        };
        console.log('requestData');
        console.log(requestData);

        // Get method 
        // const url = `http://127.0.0.1:8000/api2/my-api/?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`;
        // post method, the body store json data

        // const url = process.env.REACT_APP_API_URL_2;
        const url = `http://127.0.0.1:8000/api2/my-api/main-energy/`
       
        console.log(url);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                const jsonElement = JSON.stringify(data, null, 2);
                console.log(jsonElement);
                // it looks like this
                // {
                //     "meter_id": "pm08",
                //     "timestamp": "2024-01-02T10:40:00+07:00",
                //     "power": "26.00",
                //     "voltage": "51.00",
                //     "current": "39.00"
                //   },
                seteData(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    if (show === true) {
        return (
            <div>
                <div>PowerMeter Details</div>
                <div style={{ display: 'inline-block' }}>
                    <h2>
                        <pre>{localselectedThing}</pre>
                    </h2>
                    <Space size="large">
                        <Text type="success">Running</Text>
                        <Text type="secondary">Manufacturer: {data.attributes?.manufacturer || 'N/A'}</Text>
                        <Text type="secondary">Model: {data.attributes?.model || 'N/A'}</Text>
                        <Text type="secondary">Serial Number: {data.attributes?.['serial number'] || 'N/A'}</Text>
                        <Text strong>Power: {data.features?.measurements?.properties?.power || 'N/A'}</Text>
                        <Text strong>Voltage: {data.features?.measurements?.properties?.voltage || 'N/A'}</Text>
                        <Text strong>Current: {data.features?.measurements?.properties?.current || 'N/A'}</Text>
                    </Space>

                </div>
                <div>
                    {/* <Text strong>Production </Text> */}
                    <Space size="large">
                        <App setDateString={setDateString} uppersetSelectedLabel={setSelectedLabel} />
                        <Button onClick={() => {
                            fetchData(localselectedThing, selectedLabel, dateString, defaultCheckedList)
                            fetcheData(localselectedThing, dateString);
                        }
                    }> Get Data </Button>
                    </Space>
                </div>
                <ElectricalParameterCheckbox defaultCheckedList={defaultCheckedList} setdefaultCheckedList={setdefaultCheckedList} plainOptions={plainOptions} />
                {/* <div>
                    <MyChart data={TSData} />
                </div> */}
                <div>
                    {defaultCheckedList.map((chartName, index) => {
                        const ChartComponent = chartComponents[chartName];
                        return (
                            <div key={index}>
                                <ChartComponent rawData={TSData} />
                            </div>
                        );
                    })}
                </div>
                <MyChart2e rawData={eData}/>
            </div>
        )
    }
    else return null;
}

export default PowerMeterDetails