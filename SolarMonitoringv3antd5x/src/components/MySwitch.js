import { Radio, ConfigProvider } from 'antd';
import React, { useState } from 'react';

const YesNoSwitch = ({ value, setValue }) => {

    const onChange = (e) => {
        console.log(`radio checked: ${e.target.value}`);
        setValue(e.target.value);
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Radio: {
                            buttonBg: "red",
                            colorBorder: "#009bc4",
                            borderRadius: 0
                        },
                    },
                }}
            >
                <Radio.Group
                    onChange={onChange}
                    value={value}
                    style={{ backgroundColor: '#043b3e', border: '1px solid #009bc4' }}
                >
                    <Radio.Button value={true} style={{ backgroundColor: value === true ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Yes</Radio.Button>
                    <Radio.Button value={false} style={{ backgroundColor: value === false ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>No</Radio.Button>
                </Radio.Group>
            </ConfigProvider>

        </>
    );
};

export default YesNoSwitch;
