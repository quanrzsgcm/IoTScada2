import { Radio, ConfigProvider, Space, Button } from 'antd';
import React, { useState } from 'react';

const DeviceStateRadio = ({ data, value, setValue }) => {
    const inverterState = {
        "noCom": 1,
        "connectionfail": 0,
        "nonoperative": 1,
        "FullCapability": 1
    };
    const totalSum = Object.values(inverterState).reduce((acc, curr) => acc + curr, 0);

    // Mapping object for more readable names
    const stateDisplayName = {
        "noCom": "No Communication",
        "connectionfail": "Connection Fail",
        "nonoperative": "Non-operative",
        "FullCapability": "Full Capability"
    };

    const [activeButton, setActiveButton] = useState('all');

    const onClickHandler = (key) => {
        setActiveButton(key);
        console.log(key);
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        defaultBg: 'rgb(3,119,137)',
                        defaultBorderColor: 'transparent',
                        defaultColor: 'white',
                        defaultActiveBg: 'rgb(0,167,219)',
                        defaultHoverBg: 'rgb(0,167,219)',
                        borderRadius: 0
                    },
                },
            }}
        >
            <Space>
                <Button onClick={() => onClickHandler('all')}
                    style={{
                        backgroundColor: activeButton === 'all' ? 'rgb(0,167,219)' : 'rgb(3,119,137)',
                        color: activeButton === 'all' ? 'white' : 'inherit',
                    }}>All&nbsp;&nbsp;&nbsp;&nbsp;{totalSum}</Button>
                {Object.entries(inverterState).map(([key, value]) => {
                    const isActive = activeButton === key;
                    if (value > 0) {
                        return (
                            <Button
                                key={key}
                                onClick={() => onClickHandler(key)}
                                style={{
                                    backgroundColor: isActive ? 'rgb(0,167,219)' : 'rgb(3,119,137)',
                                    color: isActive ? 'white' : 'inherit',
                                }}
                            >
                                {stateDisplayName[key]}&nbsp;&nbsp;&nbsp;&nbsp;{value}
                            </Button>
                        );
                    } else {
                        return null;
                    }
                })}
            </Space>
        </ConfigProvider>
    );
};

export default DeviceStateRadio;
