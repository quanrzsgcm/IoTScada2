import React, { useState } from 'react';
import '../assets/styles/SiteView.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import SelectTime from '../components/SelectTime';
import { Row, Col } from 'antd';
import Chart from "react-apexcharts";
import LineChart from '../components/chart1';
import App from '../components/testcustom';

export default function SiteKPI() {
  return (
    <MainviewLayout>
      <div className='siteview'>Site KPI</div>
      <div> <App/></div>
    </MainviewLayout>
  );
}
