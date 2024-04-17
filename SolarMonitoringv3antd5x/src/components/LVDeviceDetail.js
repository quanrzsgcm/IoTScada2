import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Checkbox, Input, Button, ConfigProvider } from 'antd';
import { Dropdown, message, Tooltip } from 'antd';

import '../assets/styles/customscrollbar2.css'
import { IoChevronForward } from "react-icons/io5";
import { MdOutlineNewLabel } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

const LVDeviceDetail = ({ deviceid }) => {
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
            <span style={{ marginRight: '20px', fontSize: '14px' }}>List</span>
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
                    <IoChevronForward style={{ verticalAlign: 'middle', marginBottom: '3px', transform: 'rotate(180deg)' }} />
                    <span style={{ fontWeight: '600' }}>
                        {device_name}
                    </span>
                    <IoChevronForward style={{ verticalAlign: 'middle', marginBottom: '3px' }} onClick={handleClick} />
                    <FaCircle style={{ width: '8px', height: '8px', color: iconColor, marginLeft: '15px', marginRight: '5px' }} />
                    <span style={{ color: textColor }}>
                        {device_state}
                    </span>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '20px', fontSize: '14px', color: 'rgb(155,194,195)' }}>Manufacturer: {manufacturer}</span>
                            <span style={{ marginRight: '20px', fontSize: '14px', color: 'rgb(155,194,195)' }}>Models:  {models}</span>
                            <span style={{ marginRight: '20px', fontSize: '14px', color: 'rgb(155,194,195)' }}>Serial Number:  {serialNumber}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgb(29, 204, 204)', textAlign: 'right', height: '30px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>Capacity</span>
                            <span style={{ color: 'white' }}> 111.78 kWp </span>
                            <span style={{ borderLeft: '1px solid rgb(53,110,116)', height: '30px', marginLeft: '10px', marginRight: '10px' }}></span>
                            <span style={{ marginRight: '10px' }}>Internal Temp</span>
                            <span style={{ color: 'white' }}> 45.1°C </span>
                            <span style={{ borderLeft: '1px solid rgb(53,110,116)', height: '30px', marginLeft: '10px', marginRight: '10px' }}></span>
                            <span style={{ marginRight: '10px' }}>Efficiency</span>
                            <span style={{ color: 'white' }}> 99% </span>
                        </div>



                    </div>
                </div>
                <div>
                    <MdOutlineNewLabel />
                </div>
            </div>

            <div style={{
                display: 'flex', height: '185px', // Set the height of the flex container
                width: '100%',
                border: '1px solid #ccc', // Just for visualization
                marginTop: '10px'
            }}>
                <div style={{
                    flex: 1, // Each child div takes up equal space
                    // border: '1px solid #333', // Just for visualization
                    height: '45px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', // Center vertically
                        flex: 1, // Each child div takes up equal space
                        // border: '1px solid red', // Just for visualization
                        height: '45px',
                        background: 'linear-gradient(to right, rgb(2,75,76), rgb(13,67,96))', // Define the gradient
                    }}>
                        <span style={{ marginLeft: '20px', fontSize: '16px', color: 'white' }}>General</span>
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
                <div style={{
                    flex: 1, // Each child div takes up equal space
                    // border: '1px solid #333', // Just for visualization
                    height: '45px',
                    backgroundColor: 'black',
                    marginLeft: '20px'
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
                                <DownOutlined color="red"/>
                            </Space>
                        </Button>
                    </Dropdown>

                </ConfigProvider>
            </div>




        </>
    );
};
export default LVDeviceDetail;