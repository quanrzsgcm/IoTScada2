import React, { useEffect, useState, useContext } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Checkbox, Input, Button, ConfigProvider, Modal } from 'antd';
import { Dropdown, message, Tooltip, InputNumber } from 'antd';
import '../assets/styles/customscrollbar2.css'
import { IoChevronForward } from "react-icons/io5";
import { MdOutlineNewLabel } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import Chart1 from '../assets/charts/DetailChart';
import ChartLeft from '../assets/charts/DetailChartLeft';
import AuthContext from '../context/AuthContext';
import App from './DropDownButtonTimeDL';

const LVDeviceDetail = ({ selectedThing, setSelectedThing }) => {
    const { authTokens, logoutUser } = useContext(AuthContext);

    const [thingData, setThingData] = useState(null);
    const [listname, setlistname] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isFirstIndex, setIsFirstIndex] = useState(false);
    const [isLastIndex, setIsLastIndex] = useState(false);

    const handleClickForward = () => {
        if (currentIndex < listname.length - 1) {
            var temp = currentIndex
            setCurrentIndex(currentIndex + 1);
            setSelectedThing(listname[temp + 1].thingId)
        }
    };

    const handleClickBackward = () => {
        if (currentIndex > 0) {
            var temp = currentIndex
            setCurrentIndex(currentIndex - 1);
            setSelectedThing(listname[temp - 1].thingId)
        }
    };

    // Test fetching directly into Ditto (in production must fetch via Backend)
    const username = "ditto";
    const password = "ditto";

    const basicAuth = btoa(`${username}:${password}`);    
    
    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = () => {
            console.log(`${process.env.REACT_APP_DITTO_URL}/api/2/search/things?namespaces=my.inverter&fields=thingId&option=size(200)`);
            fetch(`${process.env.REACT_APP_DITTO_URL}/api/2/search/things?namespaces=my.inverter&fields=thingId&option=size(200)`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched data from details:', data);

                    const flattenedData = data.items.map(item => {
                        return {
                            thingId: item.thingId,
                        };
                    });
                    setlistname(flattenedData);
                    const initialIndex = flattenedData.findIndex(item => item.thingId === selectedThing);
                    setCurrentIndex(initialIndex);
                    setIsFirstIndex(initialIndex === 0);
                    setIsLastIndex(initialIndex === flattenedData.length - 1);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        // Call fetchData initially
        fetchData();

    }, []); // Empty dependency array means this effect runs once after the initial render

    useEffect(() => {
        setIsFirstIndex(currentIndex === 0);
        setIsLastIndex(currentIndex === listname?.length - 1);
    }, [currentIndex, listname]);

    useEffect(() => {
        const fetchData = () => {            
            fetch(`${process.env.REACT_APP_DITTO_URL}/api/2/things/${selectedThing}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched data one thing:', data);
                    setThingData(data);
                    setDeviceState(data.features.measurements.properties.state);
                    console.log('set device state ' + data.features.measurements.properties.state)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

            fetch(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/invertergetpr/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
                },
                body: JSON.stringify({
                    thingId: selectedThing,
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('FETCH PR', data);
                    setValuePollingRate(data.pollingrate)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        // Call fetchData initially
        fetchData();

        // Set interval to call fetchData every 15 seconds
        const interval = setInterval(fetchData, 15000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);

    }, [selectedThing]);


    const [deviceState, setDeviceState] = useState(null);

    // Determine colors based on device state
    let iconColor = '';
    let textColor = '';
    if (deviceState === 'Full Capability' || deviceState === 'night') {
        iconColor = 'rgb(7, 201, 136)'; // Green
        textColor = 'rgb(7, 201, 136)';
    } else if (deviceState === 'Connection Fail' || deviceState === 'No Communication') {
        iconColor = 'rgb(141,166,187)';
        textColor = 'rgb(141,166,187)';
    }

    const [isRotated, setIsRotated] = useState(false);

    // Function to handle click event
    const handleClick = () => {
        // Update state to toggle rotation
        setIsRotated(!isRotated);
    };


    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
        if (valueofFanSpeed){
            setValueofFanSpeedinModal(valueofFanSpeed);
            console.log('set when open modal '+ valueofFanSpeed);
        }
        if (valueofPollingRate){
            setValueofPollingRateinModal(valueofPollingRate);
            console.log('set when open modal '+ valueofPollingRate);
        }
    };
    const handleOk = () => {
        setIsModalOpen(false);
        sendControlMessage();
        console.log('sendControlMessage');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [valueofFanSpeed, setValueFanSpeed] = useState(null);

    const [valueofFanSpeedinModal, setValueofFanSpeedinModal] = useState(null);
    const [valueofPollingRateinModal, setValueofPollingRateinModal] = useState(null);

    const [inverter_id, setInverter_id] = useState(null);


    const onChangeFanSpeed = (e) => {
        setValueFanSpeed(e.target.value);
        setValueofFanSpeedinModal(e.target.value);
        console.log(e.target.value);
        console.log('fanspeedchanged');
    };

    const [valueofPollingRate, setValuePollingRate] = useState(null);

    const onChangePollingRate = (e) => {
        setValuePollingRate(e.target.value);
        setValueofPollingRateinModal(e.target.value);
        console.log(e.target.value);
        console.log('pRatechanged');
    };

    useEffect(() => {
        if (thingData) {
            setValueFanSpeed(fanSpeedMap[thingData.features.measurements.properties.fanSpeed]);
            setInverter_id(extractNumberFromString(thingData.thingId));
            console.log('set fan speed')
            console.log(extractNumberFromString(thingData.thingId));
        }

    }, [thingData]);

    // Mapping object for fan speed values
    const fanSpeedMap = {
        0: 'off',
        1: 'slow',
        2: 'medium',
        3: 'fast'
    };

    const fanSpeedMapsending = (fanSpeed) => {
        const map = {
            'off': 0,
            'slow': 1,
            'medium': 2,
            'fast': 3
        };
        return map[fanSpeed];
    };

    function extractNumberFromString(str) {
        const parts = str.split(':');
        const number = parseInt(parts[1].replace(/\D/g, ''), 10); // Convert to integer
        return number;
    }

    const sendControlMessage = () => {                
        fetch(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/invertercontrol/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({
                valueofFanSpeed: fanSpeedMapsending(valueofFanSpeedinModal),
                pollingrate: valueofPollingRateinModal,
                limitOutput: limitOutputInModal,
                inverter_id: inverter_id
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }

    const [limitOutputInModal, setLimitOutputInModal] = useState(null);

    useEffect(() => {
        if (thingData && !isModalOpen) {
            setLimitOutputInModal(thingData.features.measurements.properties.limitOutput)
            console.log('set limit output in modal')
            console.log(thingData.features.measurements.properties.limitOutput);
        }

    }, [thingData]);

    const onChangeInput = (value) => {
        console.log('changed', value);
        setLimitOutputInModal(value);
    };

    const [dateString, setDateString] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState('Day');

    useEffect(() => {
        console.log("unit of changes " + selectedLabel);
        console.log("datestring changes " + dateString);
    },[dateString, selectedLabel])

    return (
        <>            
            <ConfigProvider
                theme={{
                    components: {
                        Modal: {
                            contentBg: "rgba(0, 0, 0, 0.82)",
                            headerBg: 'rgba(0, 0, 0, 0.82)',
                            titleColor: 'white',
                            colorText: 'white',
                            borderRadiusLG: '0',
                            padding: 0,
                        },
                        Radio: {
                            buttonBg: "red",
                            colorBorder: "#009bc4",
                            borderRadius: 0
                        },
                        InputNumber: {
                            colorText: 'white',

                        }
                    },
                }}
            >
                <Modal title="Control" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={{ border: '1px solid rgb(1,183,225)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '0px solid white' }}>
                        <span style={{ backgroundColor: 'transparent', border: '0px solid #009bc4' }}>Fan Speed: </span>
                        <Radio.Group
                            onChange={onChangeFanSpeed}
                            value={valueofFanSpeedinModal}
                            style={{ backgroundColor: '#043b3e', border: '1px solid #009bc4' }}
                        >
                            <Radio.Button value="off" style={{ backgroundColor: valueofFanSpeedinModal === 'off' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Off</Radio.Button>
                            <Radio.Button value="slow" style={{ backgroundColor: valueofFanSpeedinModal === 'slow' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Slow</Radio.Button>
                            <Radio.Button value="medium" style={{ backgroundColor: valueofFanSpeedinModal === 'medium' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Medium</Radio.Button>
                            <Radio.Button value="fast" style={{ backgroundColor: valueofFanSpeedinModal === 'fast' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Fast</Radio.Button>
                        </Radio.Group>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '0px solid white' }}>

                        <span style={{ backgroundColor: 'transparent' }}>Polling Rate: </span>
                        <Radio.Group
                            onChange={onChangePollingRate}
                            value={valueofPollingRateinModal}
                            style={{ backgroundColor: '#043b3e', border: '1px solid #009bc4', }}
                        >
                            <Radio.Button value="1s" style={{ backgroundColor: valueofPollingRateinModal === '1s' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>1s</Radio.Button>
                            <Radio.Button value="5s" style={{ backgroundColor: valueofPollingRateinModal === '5s' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>5s</Radio.Button>
                            <Radio.Button value="10s" style={{ backgroundColor: valueofPollingRateinModal === '10s' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>10s</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '0px solid white' }}>

                        <span style={{ backgroundColor: 'transparent' }}>Limit Output (kW): </span>

                        <InputNumber onChange={onChangeInput} min={1} max={100} controls={false} value={limitOutputInModal ? limitOutputInModal : null} style={{ backgroundColor: '#043b3e', color: 'white', border: "1px solid #009bc4", borderRadius: 0 }} />
                    </div>
                </Modal>
            </ConfigProvider>

            <span style={{ marginRight: '20px', fontSize: '14px' }} onClick={() => setSelectedThing(null)}>List</span>
            <span style={{ marginRight: '20px', fontSize: '14px' }}>&gt;</span>
            <span style={{ fontSize: '14px' }}>Details</span>

            <div style={{
                height: '150px', // specify your desired height
                width: '100%',
                backgroundColor: 'black', // just for demonstration
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // align items vertically center
                background: 'linear-gradient(to right, rgb(1,105,104), rgb(21,59,106)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px', // Add margin bottom to create space between this div and the next one
                }}>
                    <IoChevronForward style={{
                        verticalAlign: 'middle', marginBottom: '3px', transform: 'rotate(180deg)',
                        color: isFirstIndex ? 'rgb(1,143,155)' : 'rgb(8,184,250)',
                        cursor: isFirstIndex ? 'default' : 'pointer' // Change cursor to pointer when hovering
                    }}
                        onClick={handleClickBackward}
                    />
                    <span style={{ fontWeight: '600' }}>
                        {thingData ? thingData.attributes.name : null}
                    </span>
                    <IoChevronForward style={{
                        verticalAlign: 'middle', marginBottom: '3px',
                        color: isLastIndex ? 'rgb(1,143,155)' : 'rgb(8,184,250)',
                        cursor: isLastIndex ? 'default' : 'pointer' // Change cursor to pointer when hovering
                    }}
                        onClick={handleClickForward}
                    />
                    <FaCircle style={{ width: '8px', height: '8px', color: iconColor, marginLeft: '15px', marginRight: '5px' }} />
                    <span style={{ color: textColor }}>
                        {thingData ? thingData.features.measurements.properties.state : null}
                    </span>
                    <span style={{ marginLeft: 'auto', color: 'rgb(1,183,225)' }} onClick={showModal}>
                        Control Inverter
                    </span>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '20px', fontSize: '14px', color: 'rgb(155,194,195)' }}>Manufacturer: {thingData ? thingData.attributes.manufacturer : null}</span>
                            <span style={{ marginRight: '20px', fontSize: '14px', color: 'rgb(155,194,195)' }}>Models:  {thingData ? thingData.attributes.model : null}</span>
                            <span style={{ marginRight: '20px', fontSize: '14px', color: 'rgb(155,194,195)' }}>Serial Number:  {thingData ? thingData.attributes.serialNumber : null}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgb(29, 204, 204)', textAlign: 'right', height: '30px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>Capacity</span>
                            <span style={{ color: 'white' }}> {thingData ? thingData.features.measurements.properties.capacity : null} kWp </span>
                            <span style={{ borderLeft: '1px solid rgb(53,110,116)', height: '30px', marginLeft: '10px', marginRight: '10px' }}></span>
                            <span style={{ marginRight: '10px' }}>Internal Temp</span>
                            <span style={{ color: 'white' }}>{thingData ? thingData.features.measurements.properties.internalTemp : null}°C </span>
                            <span style={{ borderLeft: '1px solid rgb(53,110,116)', height: '30px', marginLeft: '10px', marginRight: '10px' }}></span>
                            <span style={{ marginRight: '10px' }}>Efficiency</span>
                            <span style={{ color: 'white' }}> {thingData ? thingData.features.measurements.properties.efficiency : null}% </span>
                        </div>



                    </div>
                </div>
                <div>
                    <MdOutlineNewLabel />
                </div>
            </div>

            <div style={{
                display: 'flex',
                height: '185px',
                width: '100%',
                marginTop: '10px',
                justifyContent: 'space-between',
            }}>
                <div style={{
                    flexBasis: '49.4%', // Adjusted flex-basis to make each inner div take less width
                    height: '45px',
                    height: '100%',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', // Center vertically
                        flex: 1, // Each child div takes up equal space
                        height: '45px',
                        background: 'linear-gradient(to right, rgb(10, 57, 82), rgb(16, 40, 66))', // Define the gradient

                    }}>
                        <span style={{ marginLeft: '20px', fontSize: '16px', color: 'white' }}>General</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        height: '45px', // Set the height of the flex container
                        alignItems: 'center', // Center vertically
                        background: 'linear-gradient(to right, rgb(2,81,83), rgb(16,70,103))'
                    }}>
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid red', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Input Power: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{thingData ? thingData.features.measurements.properties.inputPower : null} kW</span>
                        </div>
                        <div style={{ height: '20px', borderRight: '1px solid rgb(53,110,116)' }}></div> {/* Vertical line */}
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid blue', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Apparent Power: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{thingData ? thingData.features.measurements.properties.apparentPower : null} VA</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '95%', borderBottom: '1px solid rgb(53,110,116)' }}></div> {/* Horizontal line */}
                    </div>

                    <div style={{
                        display: 'flex',
                        height: '45px', // Set the height of the flex container
                        alignItems: 'center', // Center vertically
                        // border: '1px solid green', // Just for visualization
                        background: 'linear-gradient(to right, rgb(2,81,83), rgb(16,70,103))'
                    }}>
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid red', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Active Power: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{thingData ? thingData.features.measurements.properties.activePower : null} kW</span>
                        </div>
                        <div style={{ height: '20px', borderRight: '1px solid rgb(53,110,116)' }}></div> {/* Vertical line */}
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid blue', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Grid Frequency: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{thingData ? thingData.features.measurements.properties.gridFrequency : null} Hz</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', background: 'transparent' }}>
                        <div style={{ width: '95%', borderBottom: '1px solid rgb(53,110,116)' }}></div> {/* Horizontal line */}
                    </div>

                    <div style={{
                        display: 'flex',
                        height: '45px', // Set the height of the flex container
                        alignItems: 'center', // Center vertically
                        // border: '1px solid green', // Just for visualization
                        background: 'linear-gradient(to right, rgb(2,81,83), rgb(16,70,103))'
                    }}>
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid red', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Reactive Power: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{thingData ? thingData.features.measurements.properties.reactivePower : null} kVar</span>
                        </div>
                        <div style={{ height: '20px', borderRight: '1px solid rgb(53,110,116)' }}></div> {/* Vertical line */}
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid blue', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Power Factor: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{thingData ? thingData.features.measurements.properties.powerFactor : null}</span>
                        </div>
                    </div>



                </div>
                <div style={{
                    flexBasis: '49.4%',
                    height: '45px',
                    border: '1px solid blue',
                    height: '100%',

                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', // Center vertically
                        flex: 1, // Each child div takes up equal space
                        // border: '1px solid red', // Just for visualization
                        height: '45px',
                        background: 'linear-gradient(to right, rgb(10, 57, 82), rgb(16, 40, 66))', // Define the gradient
                    }}>
                        <span style={{ marginLeft: '20px', fontSize: '16px', color: 'white' }}>Alarm</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        height: 'calc(100% - 45px)',
                        alignItems: 'center', // Center vertically
                        // border: '1px solid green', // Just for visualization
                        background: 'linear-gradient(to right, rgb(13,70,99), rgb(27,54,77)'
                    }}>
                    </div>

                </div>
            </div>


            <div style={{
                height: '500px', // specify your desired height
                width: '100%',
                display: 'flex', // Use flexbox
                alignItems: 'flex-start', // Vertically center items
                justifyContent: 'space-between',
                background: 'transparent',
                marginTop: '20px'
            }}>
                <div style={{
                    height: '500px', // specify your desired height
                    width: '49.4%',
                    // background: 'linear-gradient(to right, rgb(1, 105, 104), rgb(21, 59, 106)',
                    background: 'transparent', // Define the gradient
                }}>

                    <div style={{
                        height: '45px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center', // Vertically center items
                        justifyContent: 'space-between', // Distribute items with space between them
                        // background: 'linear-gradient(to right, rgb(1, 105, 104), rgb(21, 59, 106)',
                        background: 'linear-gradient(to right, rgb(10, 57, 82), rgb(16, 40, 66))', // Define the gradient
                    }}>
                        <span style={{ marginLeft: '20px', fontSize: '16px', color: 'white' }}>Production</span>
                        <div style={{ marginRight: '20px'}} >
                        <App  setDateString={setDateString} selectedLabel={selectedLabel} uppersetSelectedLabel={setSelectedLabel} />
                        </div>
                    </div>
                    <div style={{
                        height: '400px', // specify your desired height
                        width: '100%',
                        border: '1px solid blue',
                        background: 'linear-gradient(to right, rgb(6, 64, 67), rgb(9, 56, 80), rgb(26, 71, 102), rgb(29, 68, 92))',
                        // background: 'rgb(121, 181, 162)'

                    }}>
                        <Chart1 dateString={dateString} unitoftime={selectedLabel} inverter_id={selectedThing}/>
                    </div>
                </div>

                <div style={{ width: '49.4%', height: '500px', border: '0px solid red' }}>
                    <div style={{
                        height: '45px', // specify your desired height
                        width: '100%',
                        display: 'flex', // Use flexbox
                        alignItems: 'center', // Vertically center items
                        // background: 'linear-gradient(to right, rgb(1, 105, 104), rgb(21, 59, 106)',
                        background: 'linear-gradient(to right, rgb(10, 57, 82), rgb(16, 40, 66))', // Define the gradient
                    }}>
                        <span style={{ marginLeft: '20px', fontSize: '16px', color: 'white' }}>Active Power & Irradiance</span>                        
                    </div>
                    <div style={{
                        height: '400px', // specify your desired height
                        width: '100%',
                        border: '1px solid blue',
                        background: 'linear-gradient(to right, rgb(6, 64, 67), rgb(9, 56, 80), rgb(26, 71, 102), rgb(29, 68, 92))'
                    }}>
                        <ChartLeft dateString={dateString} unitoftime={selectedLabel} inverter_id={selectedThing}/>

                    </div>
                </div>
            </div>
        </>
    );
};
export default LVDeviceDetail;