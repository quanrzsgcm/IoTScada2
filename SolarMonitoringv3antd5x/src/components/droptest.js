import { Radio, ConfigProvider } from 'antd';
import React, { useState } from 'react';

const App2 = ({ value, setValue }) => {

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
                    <Radio.Button value="Day" style={{ backgroundColor: value === 'Day' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Day</Radio.Button>
                    <Radio.Button value="Month" style={{ backgroundColor: value === 'Month' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Month</Radio.Button>
                    <Radio.Button value="Year" style={{ backgroundColor: value === 'Year' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Year</Radio.Button>
                    <Radio.Button value="Total" style={{ backgroundColor: value === 'Total' ? '#009bc4' : '#043b3e', color: 'white', borderWidth: 0 }}>Total</Radio.Button>
                </Radio.Group>
            </ConfigProvider>

        </>
    );
};

export default App2;
