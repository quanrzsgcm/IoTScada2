import { Radio } from 'antd';
import React, { useState } from 'react';

const App2 = ({value, setValue}) => {

    const onChange = (e) => {
        console.log(`radio checked: ${e.target.value}`);
        setValue(e.target.value);
    };

    return (
        <>
            <Radio.Group
                onChange={onChange}
                value={value}
                style={{ backgroundColor: '#043b3e', color: 'white' }}
            >
                <Radio.Button value="Day" style={{ backgroundColor: value === 'Day' ? '#009bc4' : '#043b3e', color: 'white', border: '1px solid #009bc4' }}>Day</Radio.Button>
                <Radio.Button value="Month" style={{ backgroundColor: value === 'Month' ? '#009bc4' : '#043b3e', color: 'white', border: '1px solid #009bc4' }}>Month</Radio.Button>
                <Radio.Button value="Year" style={{ backgroundColor: value === 'Year' ? '#009bc4' : '#043b3e', color: 'white', border: '1px solid #009bc4' }}>Year</Radio.Button>
                <Radio.Button value="Total" style={{ backgroundColor: value === 'Total' ? '#009bc4' : '#043b3e', color: 'white', border: '1px solid #009bc4' }}>Total</Radio.Button>
            </Radio.Group>
        </>
    );
};

export default App2;
