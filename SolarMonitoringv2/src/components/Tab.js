import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import Chart from "react-apexcharts";
import LineChart from './chart1';
import DataTable from './PowerMeterRanking';
import DataTableFull from './PowerMeterFull';

const { TabPane } = Tabs;

const TypeOfDeviceTab = ({ showState, selectedThing, updateThing, toggleShow }) => {
  const [size, setSize] = useState('small');
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(showState);
  }, [showState]);

  const onChange = (e) => {
    setSize(e.target.value);
  };

  const items = [
    {
      key: '1',
      label: 'Power meter',
      content: <DataTableFull selectedThing={selectedThing} updateThing={updateThing} toggleShow={toggleShow}/>, // Replace this with the component you want to render
    },
    {
      key: '2',
      label: 'Weather Station',
      content: <p>There is no weather station yet</p>, // Replace this with the component you want to render
    },
    // {
    //   key: '3',
    //   label: 'Tab 3',
    //   content: <Chart />, // Replace this with the component you want to render
    // },
  ];

  return (
    <div>
      {show && (
        <div>
          <Tabs
            defaultActiveKey="1"
            size={size}
            style={{
              marginBottom: 32,
            }}
          >
            {items.map(item => (
              <TabPane tab={item.label} key={item.key}>
                {item.content}
              </TabPane>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TypeOfDeviceTab;
