import React, { useState } from 'react';
import '../assets/styles/SiteKPI.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import SelectTime from '../components/SelectTime';
import { Row, Col } from 'antd';
import Chart from "react-apexcharts";
import LineChart from '../components/chart1';
import AnimatedSVGBackground from '../components/testcustom';

export default function SiteKPI() {
  return (
    <MainviewLayout>
      {/* <div> <AnimatedSVGBackground/></div> */}
      {/* <div> REal content</div> */}
      <div className="grid-container">
        <div className="grid-item item-span1">1</div>
        <div className="grid-item item-span2">
          <div className="nested-div"></div>
        </div>
        <div className="grid-item">
        <div className="nested-div"></div>
        </div>  
        <div className="grid-item"><div className="nested-div"></div></div>
        <div className="grid-item"><div className="nested-div"></div></div>
        <div className="grid-item item-span6"><div className="nested-div"></div></div>  
        <div className="grid-item item-span7"><div className="nested-div"></div></div>
        <div className="grid-item"><div className="nested-div"></div></div>
      </div>
    </MainviewLayout>
  );
}
