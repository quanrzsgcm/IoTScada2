import React, { useState, useEffect } from 'react';
import '../assets/styles/SiteView.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import App from '../components/testcustom';
import TypeOfDeviceTab from '../components/Tab';
import PowerMeterDetails from '../components/PowerMeterDetails';
import { Button } from 'antd';
import LVDeviceList from '../components/LVDeviceListAdmin';
import LVDeviceDetail from '../components/LVDeviceDetail';


export default function DeviceListAdmin() {
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
      <div>
        {showDetail ? (
          <Button onClick={toggle}>Back to List</Button>
        ) : (
          <Button onClick={toggle}>Show Detail</Button>
        )}
      </div>
      {showDetail ? <LVDeviceDetail /> : <LVDeviceList />}
    </MainviewLayout>
  );
}

      {/* </div> */}
      {/* <div> <TypeOfDeviceTab showState={showTable} selectedThing={selectedThing} updateThing={updateThing} toggleShow={toggle}/></div> */}
      {/* <div> <PowerMeterDetails showState={showDetail} selectedThing={selectedThing} updateThing={updateThing}/></div> */}