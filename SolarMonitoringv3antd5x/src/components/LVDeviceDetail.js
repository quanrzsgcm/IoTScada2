import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Checkbox, Input, Button } from 'antd';

import '../assets/styles/customscrollbar2.css'
import { IoChevronForward } from "react-icons/io5";
import { MdOutlineNewLabel } from "react-icons/md";


const LVDeviceDetail = ({ deviceid }) => {
    const device_name = "FULUH_INVERTER_1"
    const device_state = "Night State"

    const [isRotated, setIsRotated] = useState(false);

    // Function to handle click event
    const handleClick = () => {
        // Update state to toggle rotation
        setIsRotated(!isRotated);
    };



    return (
        <>
            <span style={{ marginRight: '20px', fontSize: '14px' }}>List</span>
            <span style={{ marginRight: '20px', fontSize: '14px' }}>&gt;</span>
            <span style={{ fontSize: '14px' }}>Details</span>
            <div style={{
                display: 'flex', height: '200px', // Set the height of the flex container
                border: '1px solid #ccc', // Just for visualization
            }}>
                <div style={{
                    flex: 1, // Each child div takes up equal space
                    border: '1px solid #333', // Just for visualization
                }}>
                    <div> <IoChevronForward style={{ verticalAlign: 'middle', marginBottom: '3px', transform: 'rotate(180deg)' }} />
                        {device_name}
                        <IoChevronForward style={{ verticalAlign: 'middle', marginBottom: '3px' }} onClick={handleClick} /> {device_state}</div>
                    <div>
                        <span style={{ marginRight: '20px', fontSize: '14px' }}>Manufacturer: </span>
                        <span style={{ marginRight: '20px', fontSize: '14px' }}>Models:  </span>
                        <span style={{ marginRight: '20px', fontSize: '14px' }}>Serial Number:  </span>




                    </div>
                    <div>

                        <MdOutlineNewLabel />
                    </div>


                </div>
                <div style={{
                    flex: 1, // Each child div takes up equal space
                    border: '1px solid #333', // Just for visualization
                }}>
                <span style={{ marginRight: '20px', fontSize: '14px' }}>Capacity111.78kWpInternal Temp.45.1°CEfficiency0%String Current Deviation--%  </span>
                    
                    </div>
            </div>


        </>
    );
};
export default LVDeviceDetail;