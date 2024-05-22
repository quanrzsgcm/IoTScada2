import { Radio, ConfigProvider, Space, Button } from 'antd';
import React, { useState } from 'react';

const DeviceStateRadio = ({ deviceStageCount, value, setValue }) => {
    const totalSum =  Object.values(deviceStageCount).reduce((acc, curr) => acc + curr, 0);
    // Mapping object for more readable names
    const stateDisplayName = {
        "No Communication": "No Communication",
        "Connection Fail": "Connection Fail",
        "Non Operative": "Non Operative",
        "Full Capability": "Full Capability",
        "Night State": "Night State"
    };

    const [activeButton, setActiveButton] = useState('all');

    const onClickHandler = (key) => {
        setActiveButton(key);
        // setValue(key)
        console.log('key ' + key);
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
                {Object.entries(deviceStageCount).map(([key, value]) => {
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
