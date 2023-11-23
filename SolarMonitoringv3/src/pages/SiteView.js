import React, { useEffect, useState } from 'react';
import '../assets/styles/SiteView.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import SelectTime from '../components/SelectTime';
import { Row, Col } from 'antd';
import Chart from "react-apexcharts";
import LineChart from '../components/chart1';
import DataTable from '../components/PowerMeterRanking';

export default function SiteView() {
  useEffect(() => {
    document.title = "Site View";
  },[]);

  return (
    <MainviewLayout>
      <div className='siteview'>SiteView</div>
      <div> <SelectTime /> </div>
      <div> <LineChart />
      </div>
      
      <div> <DataTable /> </div>
    </MainviewLayout>
  );
}
