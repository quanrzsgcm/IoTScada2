import React, { useEffect, useState } from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';
import { DatePicker } from 'antd';

const App = ({ setDateString }) => {
    const [selectedLabel, setSelectedLabel] = useState('Day');
    
    const handleButtonClick = (e) => {

        console.log('click left button', e);
    };
    const handleMenuClick = (e) => {
        const selectedItem = items.find(item => item.key === e.key);
        if (selectedItem) {
            setSelectedLabel(selectedItem.label);
        }
        console.log('selectedItem', selectedItem);
        console.log('selectedLabel', selectedLabel);

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
        {
            label: 'Month',
            key: '3',
        },
        {
            label: 'Year',
            key: '4',
        },
        {
            label: 'Total',
            key: '5',
        },

    ];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <Space wrap>
            <Dropdown menu={menuProps}>
                <Button>
                    <Space>
                        {selectedLabel}
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
            <MyDatePicker unitsOfTime={selectedLabel} setDateString={setDateString}/>
        </Space>
    );
}
export default App;

const MyDatePicker = ({ unitsOfTime,setDateString }) => {
    const [m_unitsOfTime, setunitsOfTime] = useState(unitsOfTime);

    useEffect(() => {
        setunitsOfTime(unitsOfTime);
    }, [unitsOfTime])

    const onChange = (date, dateString) => {
        setDateString(JSON.parse(JSON.stringify(date)));
    };

    const renderDatePicker = () => {
        switch (m_unitsOfTime) {
            case 'Day':
                return <DatePicker onChange={onChange} />;
            case 'Week':
                return <DatePicker onChange={onChange} picker="week" />;
            case 'Month':
                return <DatePicker onChange={onChange} picker="month" />;
            case 'Year':
                return <DatePicker onChange={onChange} picker="year" />;
            default:
                return null;
        }
    };

    return <Space direction="vertical">{renderDatePicker()}</Space>;
};
