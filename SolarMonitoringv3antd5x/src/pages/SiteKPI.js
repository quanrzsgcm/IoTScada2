import React, { useState } from 'react';
import '../assets/styles/SiteKPI.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import SelectTime from '../components/SelectTime';
import { Row, Col } from 'antd';
import Chart from "react-apexcharts";
import LineChart from '../components/chart1';
import AnimatedSVGBackground from '../components/testcustom';
import ScrollableDiv from '../components/MiniInverterRanking';
import CanvasComponent from '../components/TestCanvas';
import RadialBarChart from '../components/RadialChart';
import SiteMetric from '../components/SiteMetric';

export default function SiteKPI() {
  const data = [
    { "inverter": "FULUH_Canteen 1_Inverter 1", "yield": "1.29" },
    { "inverter": "FULUH_Canteen 1_Inverter 2", "yield": "1.31" },
    { "inverter": "FULUH_Canteen 1_Inverter 3", "yield": "1.31" },
    { "inverter": "FULUH_Canteen 1_Inverter 4", "yield": "1.36" },
    { "inverter": "FULUH_Canteen 1_Inverter 5", "yield": "1.34" },
    { "inverter": "FULUH_Canteen 2_Inverter 1", "yield": "1.3" },
    { "inverter": "FULUH_Canteen 4_Inverter 1", "yield": "1.12" },
    { "inverter": "FULUH_Canteen 4_Inverter 2", "yield": "1.29" },
    { "inverter": "FULUH_Canteen 4_Inverter 3", "yield": "1.2" },
    { "inverter": "FULUH_Parking Lot 1_Inverter 1", "yield": "1.35" },
    { "inverter": "FULUH_Parking Lot 1_Inverter 2", "yield": "1.33" },
    { "inverter": "FULUH_Parking Lot 1_Inverter 3", "yield": "1.36" }
  ];

  return (
    <MainviewLayout>
      <div> <AnimatedSVGBackground /></div>
      {/* <div> REal content</div> */}
      <div className="grid-container">
        <div className="grid-item item-span1">1</div>
        <div className="grid-item item-span2">
          <div className="nested-div">
            <span className="title">Production & Irradiation</span>
          </div>
        </div>
        <div className="grid-item">
          <div className="nested-div">
            <span className="title">Inverter Yield Ranking</span>
          </div>
          <ScrollableDiv data={data} />
        </div>
        <div className="grid-item">
          <div className="nested-div">
            <span className="title">Real-time Performance</span>
          </div>
          <RadialBarChart />
        </div>
        <div className="grid-item">
          <div className="nested-div">
            <span className="title">Site Metrics</span>
          </div>
          <SiteMetric />
        </div>
        <div className="grid-item item-span6">
          <div className="nested-div">
            <span className="title">Inverter production</span>
          </div>
        </div>
        <div className="grid-item item-span7">
          <div className="nested-div">
            <span className="title">Active Power & Irradiance</span>
          </div>
        </div>
        <div className="grid-item">
          <div className="nested-div">
            <span className="title">Production</span>
          </div>
        </div>
      </div>
    </MainviewLayout>
  );
}
