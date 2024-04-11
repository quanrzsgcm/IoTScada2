import React, { useEffect, useState } from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip, ConfigProvider } from 'antd';
import { DatePicker } from 'antd';
import '../assets/styles/SiteView.scss'; // Import SCSS file
//test
import App2 from './droptest';

import moment from 'moment'

const App = ({ setDateString, uppersetSelectedLabel }) => {
    const [selectedLabel, setSelectedLabel] = useState('Day');
    const handleButtonClick = (e) => {
        console.log('click left button', e);
    };
    const handleMenuClick = (e) => {
        const selectedItem = items.find(item => item.key === e.key);
        if (selectedItem) {
            setSelectedLabel(selectedItem.label);
            uppersetSelectedLabel(selectedItem.label);
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
            {/* <Dropdown  menu={menuProps} style={{ backgroundColor: 'lightblue'}}> */}
            <Dropdown menu={menuProps} type="primary" className="custom-dropdown">
                <Button style={{ backgroundColor: '#043b3e', color: 'white' }}>
                    <Space>
                        {selectedLabel}

                    </Space>
                </Button>
            </Dropdown>
            <App2 value={selectedLabel} setValue={setSelectedLabel} />
            <MyDatePicker unitsOfTime={selectedLabel} setDateString={setDateString} />
        </Space>
    );
}
export default App;

const MyDatePicker = ({ unitsOfTime, setDateString }) => {
    const [m_unitsOfTime, setunitsOfTime] = useState(unitsOfTime);
    const now = moment();

    useEffect(() => {
        setunitsOfTime(unitsOfTime);
    }, [unitsOfTime])

    const onChange = (date, dateString) => {
        setDateString(JSON.parse(JSON.stringify(date)));
    };
    useEffect(() => {
        setDateString(JSON.parse(JSON.stringify(now)));
    }, [])

    const renderDatePicker = () => {
        switch (m_unitsOfTime) {
            case 'Day':
                return (
                    <ConfigProvider
                      theme={{
                        components: {
                          DatePicker: {
                            activeBg: "#043b3e",
                            colorBgContainer: "#043b3e",
                            colorBgElevated: "rgba(0, 0, 0, 0.95)",
                            colorText: "white",
                            colorTextHeading: "grey",
                            colorIcon: "#009bc4"


                          }
                        }
                      }}
                    >
                      <DatePicker onChange={onChange} allowClear={false}/>
                    </ConfigProvider>
                  );
            case 'Week':
                return <DatePicker onChange={onChange} picker="week" style={{ backgroundColor: 'red' }} />;
            case 'Month':
                return <DatePicker onChange={onChange} picker="month" style={{ backgroundColor: '#043b3e' }} cellHeight={1000}/>;
            case 'Year':
                return <DatePicker onChange={onChange} picker="year" style={{ backgroundColor: '#043b3e' }} />;
            default:
                return null;
        }
    };

    return <Space direction="vertical">{renderDatePicker()}</Space>;
};
