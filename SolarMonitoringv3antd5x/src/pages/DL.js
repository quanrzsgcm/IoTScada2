import React, { useState, useEffect } from 'react';
import '../assets/styles/SiteView.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import App from '../components/testcustom';
import TypeOfDeviceTab from '../components/Tab';
import PowerMeterDetails from '../components/PowerMeterDetails';
import { Button } from 'antd';
import LVDeviceList from '../components/LVDeviceList';
import LVDeviceDetail from '../components/LVDeviceDetail';


export default function DeviceList() {
  useEffect(() => {
    document.title = "Device List";
  }, []);
  const [showTable, setshowTable] = useState(true);
  const [selectedThing, setSelectedThing] = useState(null);

  const updateThing = (value) => {
    setSelectedThing(value);
    console.log("from DL " + value);
  }

  const [showDetail, setShowDetail] = useState(false);

  const toggle = () => {
    setShowDetail(!showDetail);
  };

  return (
    <MainviewLayout>
      {selectedThing ? <LVDeviceDetail selectedThing={selectedThing} setSelectedThing={setSelectedThing}/> : <LVDeviceList setSelectedThing={setSelectedThing}/>}
    </MainviewLayout>
  );
}

      {/* </div> */}
      {/* <div> <TypeOfDeviceTab showState={showTable} selectedThing={selectedThing} updateThing={updateThing} toggleShow={toggle}/></div> */}
      {/* <div> <PowerMeterDetails showState={showDetail} selectedThing={selectedThing} updateThing={updateThing}/></div> */}