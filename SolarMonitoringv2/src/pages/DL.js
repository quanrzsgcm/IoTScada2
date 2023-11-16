import React, { useState, useEffect } from 'react';
import '../assets/styles/SiteView.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import App from '../components/testcustom';
import TypeOfDeviceTab from '../components/Tab';
import PowerMeterDetails from '../components/PowerMeterDetails';
import { Button } from 'antd';


export default function DeviceList() {
  useEffect(() => {
    document.title = "Device List";
  }, []);
  const [showTable, setshowTable] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedThing, setSelectedThing] = useState(null);

  const updateThing = (value) => {
    setSelectedThing(value);
    console.log("from DL " + value);
  }

  const toggle = () => {
    setshowTable(!showTable);
    setShowDetail(showTable);
  }

  return (
    <MainviewLayout>
      <div className='siteview'>Device List</div>
      <div>
        <Button onClick={toggle}> Toggle Data Table Visibility </Button>
      </div>
      <div> <TypeOfDeviceTab showState={showTable} selectedThing={selectedThing} updateThing={updateThing}/></div>
      <div> <PowerMeterDetails showState={showTable} selectedThing={selectedThing} updateThing={updateThing}/></div>
    </MainviewLayout>
  );
}
