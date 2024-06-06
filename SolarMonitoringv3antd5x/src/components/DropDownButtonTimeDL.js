import React, { useEffect, useState } from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { CalendarOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip, ConfigProvider } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import '../assets/styles/SiteView.scss'; // Import SCSS file
//test
import App2 from './droptest';

import moment from 'moment'

const App = ({ setDateString, selectedLabel, uppersetSelectedLabel }) => {
    // const [selectedLabel, setSelectedLabel] = useState('Day');
    const handleButtonClick = (e) => {
        console.log('click left button', e);
    };

    const handleMenuClick = (e) => {
        const selectedItem = items.find(item => item.key === e.key);
        if (selectedItem) {
            uppersetSelectedLabel(selectedItem.label);
            console.log(selectedItem.label)
        }
        //   setSelectedLabel(e.label);
    };
    const items = [
        {
            label: 'Day',
            key: '1',
        },
        {
            label: 'Week',
            key: '2',
        },        

    ];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };


    return (
        <Space wrap>
            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            defaultBg: 'rgb(16,56,85)',
                            defaultBorderColor: '#009bc4',
                            borderRadius: '0px',
                            defaultHoverBg: '#043b3e',
                            colorText: 'white',

                        },
                        Dropdown: {
                            colorBgElevated: 'black',
                            colorText: 'white',
                            borderRadiusLG: 0,
                            // controlItemBgActive:'red' //No impact
                            // controlItemBgActiveHover: 'red', //No impact
                            controlItemBgHover: 'rgb(2,36,46)',
                        },
                    },
                }}
            >
                <Dropdown menu={menuProps}>
                    <Button style={{ width:'80px' }}>
                        <Space>
                            {selectedLabel}
                        </Space>
                    </Button>
                </Dropdown>
            </ConfigProvider>

            <MyDatePicker unitsOfTime={selectedLabel} setDateString={setDateString} />
        </Space>
    );
}
export default App;

const MyDatePicker = ({ unitsOfTime, setDateString }) => {
    const [m_unitsOfTime, setunitsOfTime] = useState(unitsOfTime);
    const defaultValue = dayjs(); // Create a dayjs object representing the current date and time

    const now = moment();

    useEffect(() => {
        setunitsOfTime(unitsOfTime);
    }, [unitsOfTime])

    const onChange = (date, dateString) => {
        console.log(date)
        console.log(date)
        setDateString(JSON.parse(JSON.stringify(date)));
    };
    useEffect(() => {
        setDateString(JSON.parse(JSON.stringify(now)));
    }, [])

    const suffixIcon = <CalendarOutlined style={{ color: 'white' }} />; // Create the icon element

    // useEffect(() => {
    //     // Remove ant-picker-suffix element and add icon
    //     const pickerInput = document.querySelector('.ant-picker-input');
    //     if (pickerInput) {
    //         const suffixElement = pickerInput.querySelector('.ant-picker-suffix');
    //         if (suffixElement) {
    //             suffixElement.innerHTML = ''; // Remove existing content

    //             // Create and append new icon with styling
    //             const iconElement = document.createElement('span');
    //             iconElement.className = 'ant-picker-suffix';
    //             iconElement.innerHTML = '<CalendarOutlined style="color: white;" />'; // Icon with white color
    //             suffixElement.appendChild(iconElement);
    //         }
    //     }
    // }, []);


    const renderDatePicker = () => {
        switch (m_unitsOfTime) {
            case 'Day':
                return (
                    <ConfigProvider
                        theme={{
                            components: {
                                DatePicker: {
                                    activeBg: 'rgb(16,56,85)',
                                    borderRadius: '0px',
                                    colorBgContainer: 'rgb(16,56,85)',
                                    colorBgElevated: "rgba(0, 0, 0, 0.95)",
                                    colorText: "white",
                                    colorTextHeading: "grey",
                                    colorIcon: "#009bc4",
                                    defaultBorderColor: 'red',
                                    colorBorder: '#009bc4',
                                    defaultGhostColor: 'red',
                                    colorTextDisabled: 'rgb(77,91,94)',

                                    // controlHeight: '40px'
                                }
                            }
                        }}
                    >
                        <DatePicker onChange={onChange} allowClear={false} defaultValue={defaultValue} style={{ height: '34px', width: '200px' }} suffixIcon={suffixIcon} />
                    </ConfigProvider>
                );
            case 'Week':
                return (
                    <ConfigProvider
                        theme={{
                            components: {
                                DatePicker: {
                                    activeBg: 'rgb(16,56,85)',
                                    borderRadius: '0px',
                                    colorBgContainer: 'rgb(16,56,85)',
                                    colorBgElevated: "rgba(0, 0, 0, 0.95)",
                                    colorText: "white",
                                    colorTextHeading: "grey",
                                    colorIcon: "#009bc4",
                                    defaultBorderColor: 'red',
                                    colorBorder: '#009bc4',
                                    defaultGhostColor: 'red',
                                    colorTextDisabled: 'rgb(77,91,94)',

                                    // controlHeight: '40px'
                                }
                            }
                        }}
                    >
                        <DatePicker onChange={onChange} picker="week" allowClear={false} defaultValue={defaultValue} style={{ height: '34px', width: '200px' }} suffixIcon={suffixIcon} />
                    </ConfigProvider>
            );
            case 'Month':
                return (
                    <ConfigProvider
                        theme={{
                            components: {
                                DatePicker: {
                                    activeBg: 'rgb(16,56,85)',
                                    borderRadius: '0px',
                                    colorBgContainer: 'rgb(16,56,85)',
                                    colorBgElevated: "rgba(0, 0, 0, 0.95)",
                                    colorText: "white",
                                    colorTextHeading: "grey",
                                    colorIcon: "#009bc4",
                                    defaultBorderColor: 'red',
                                    colorBorder: '#009bc4',
                                    defaultGhostColor: 'red',
                                    colorTextDisabled: 'rgb(77,91,94)',

                                    // controlHeight: '40px'
                                }
                            }
                        }}
                    >
                        <DatePicker onChange={onChange} picker="month" allowClear={false} defaultValue={defaultValue} style={{ height: '34px', width: '200px' }} suffixIcon={suffixIcon} />
                    </ConfigProvider>
                );
            case 'Year':
                return (
                    <ConfigProvider
                        theme={{
                            components: {
                                DatePicker: {
                                    activeBg: 'rgb(16,56,85)',
                                    borderRadius: '0px',
                                    colorBgContainer: 'rgb(16,56,85)',
                                    colorBgElevated: "rgba(0, 0, 0, 0.95)",
                                    colorText: "white",
                                    colorTextHeading: "grey",
                                    colorIcon: "#009bc4",
                                    defaultBorderColor: 'red',
                                    colorBorder: '#009bc4',
                                    defaultGhostColor: 'red',
                                    colorTextDisabled: 'rgb(77,91,94)',

                                    // controlHeight: '40px'
                                }
                            }
                        }}
                    >
                        <DatePicker onChange={onChange} picker="year" allowClear={false} defaultValue={defaultValue} style={{ height: '34px', width: '200px' }} suffixIcon={suffixIcon} />
                    </ConfigProvider>
                );

            default:
                return null;
        }
    };

    return <Space direction="vertical">{renderDatePicker()}</Space>;
};
