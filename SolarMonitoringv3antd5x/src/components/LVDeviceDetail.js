import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Checkbox, Input, Button, ConfigProvider } from 'antd';
import { Dropdown, message, Tooltip } from 'antd';
import '../assets/styles/customscrollbar2.css'
import { IoChevronForward } from "react-icons/io5";
import { MdOutlineNewLabel } from "react-icons/md";
import { FaCircle } from "react-icons/fa";


const LVDeviceDetail = ({ selectedThing, setSelectedThing }) => {

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
            fetch('http://localhost:8080/api/2/search/things?namespaces=my.inverter&fields=thingId&option=size(200)', {
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
            fetch(`http://localhost:8080/api/2/things/${selectedThing}`, {
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

    const device_name = "FULUH_INVERTER_1"
    const device_state = "Full capacity"

    const [deviceState, setDeviceState] = useState('running');
    const changeDeviceState = (newState) => {
        setDeviceState(newState);
    };

    // Determine colors based on device state
    let iconColor = '';
    let textColor = '';
    if (deviceState === 'running' || deviceState === 'night') {
        iconColor = 'rgb(7, 201, 136)'; // Green
        textColor = 'rgb(7, 201, 136)';
    } else if (deviceState === 'error') {
        iconColor = 'red';
        textColor = 'red';
    }

    const [isRotated, setIsRotated] = useState(false);
    const placeholder = 5.55

    // Function to handle click event
    const handleClick = () => {
        // Update state to toggle rotation
        setIsRotated(!isRotated);
    };
    const manufacturer = 'Example Manufacturer';
    const models = 'Example Models';
    const serialNumber = '123456789';

    const items = [
        {
            label: '1st menu item',
            key: '1',
        },
        {
            label: '2nd menu item',
            key: '2',
        },
        {
            label: '3rd menu item',
            key: '3',
        }
    ]
    const handleMenuClick = (e) => {
        message.info('Click on menu item.');
        console.log('click', e);
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };





    return (
        <>
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
                        {device_state}
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
                        background: 'linear-gradient(to right, rgb(2,75,76), rgb(13,67,96))', // Define the gradient
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kW</span>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kWh</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center'}}>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kW</span>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} Hz</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', background: 'transparent'}}>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kVar</span>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder}</span>
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
                        height: '45px', // Set the height of the flex container
                        alignItems: 'center', // Center vertically
                        // border: '1px solid green', // Just for visualization
                        background: 'linear-gradient(to right, rgb(13,70,99), rgb(27,54,77)'
                    }}>
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid red', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Input Power: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kWh</span>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kWh</span>
                        </div>
                    </div>

                    <div style={{ marginLeft: '10px', width: '600px', borderBottom: '1px solid rgb(53,110,116)' }}></div> {/* Vertical line */}

                    <div style={{
                        display: 'flex',
                        height: '45px', // Set the height of the flex container
                        alignItems: 'center', // Center vertically
                        // border: '1px solid green', // Just for visualization
                        background: 'linear-gradient(to right, rgb(13,70,99), rgb(27,54,77)'
                    }}>
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid red', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Input Power: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kWh</span>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kWh</span>
                        </div>
                    </div>

                    <div style={{ marginLeft: '10px', width: '600px', borderBottom: '1px solid rgb(53,110,116)' }}></div> {/* Vertical line */}

                    <div style={{
                        display: 'flex',
                        height: '45px', // Set the height of the flex container
                        alignItems: 'center', // Center vertically
                        // border: '1px solid green', // Just for visualization
                        background: 'linear-gradient(to right, rgb(13,70,99), rgb(27,54,77)'
                    }}>
                        <div style={{
                            flex: '1', // Each child div takes half of the available space
                            // border: '1px solid red', // Just for visualization
                            height: '45px',
                            display: 'flex', // Set display to flex
                            alignItems: 'center', // Center vertically    
                        }}>
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: 'rgb(29, 204, 204)' }}>Input Power: </span>
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kWh</span>
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
                            <span style={{ marginLeft: '5px', fontSize: '14px', color: 'white' }}>{placeholder} kWh</span>
                        </div>
                    </div>
                </div>
            </div>



            <div style={{
                height: '45px', // specify your desired height
                width: '100%',
                display: 'flex', // Use flexbox
                alignItems: 'center', // Vertically center items
                background: 'linear-gradient(to right, rgb(1, 105, 104), rgb(21, 59, 106)',
                marginTop: '20px'
            }}>
                <span style={{ marginLeft: '20px', fontSize: '16px', color: 'white' }}>Production</span>

                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                defaultBg: '#043b3e',
                                defaultBorderColor: '#009bc4',
                                borderRadius: '0px',
                                defaultHoverBg: '#043b3e'
                            },
                            Dropdown: {
                                // colorBgElevated: "rgb(2,7,10)",
                                colorBgElevated: "black",
                                controlItemBgHover: 'rgb(2,36,46)',
                                controlItemBgActive: 'red',
                                colorText: 'white'
                            },
                        },
                    }}
                >
                    <Dropdown menu={menuProps} >
                        <Button >
                            <Space>
                                Day
                                <DownOutlined color="red" />
                            </Space>
                        </Button>
                    </Dropdown>

                </ConfigProvider>
            </div>
            <div style={{
                height: '700px', // specify your desired height
                width: '100%',
                display: 'flex', // Use flexbox
                alignItems: 'center', // Vertically center items
                background: 'linear-gradient(to right, rgb(6, 64, 67), rgb(9, 56, 80), rgb(26, 71, 102), rgb(29, 68, 92))'

            }}>

            </div>





        </>
    );
};
export default LVDeviceDetail;