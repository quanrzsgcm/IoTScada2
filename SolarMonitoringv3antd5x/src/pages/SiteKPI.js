import React, { useState, useEffect } from 'react';
import '../assets/styles/SiteKPI.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import SelectTime from '../components/SelectTime';
import { Row, Col } from 'antd';
import Chart from "react-apexcharts";
import LineChart from '../components/chart1';
import AnimatedSVGBackground from '../components/testcustom';
import ScrollableDiv from '../components/MiniInverterRanking';
import ScrollableDiv2 from '../components/MiniInverterRankingP';
import CanvasComponent from '../components/TestCanvas';
import RadialBarChart from '../components/RadialChart';
import SiteMetric from '../components/SiteMetric';
import Chart1 from '../assets/charts/KPIChart1';
import Chart2 from '../assets/charts/KPIChart2';
import { BsFillHouseCheckFill } from "react-icons/bs";

export default function SiteKPI() {
  // const data = [
  //   { "inverter": "SolarPark_Canteen 1_Inverter 1", "yield": "1.29" },
  //   { "inverter": "SolarPark_Canteen 1_Inverter 2", "yield": "1.31" },
  //   { "inverter": "SolarPark_Canteen 1_Inverter 3", "yield": "1.31" },
  //   { "inverter": "SolarPark_Canteen 1_Inverter 4", "yield": "1.36" },
  //   { "inverter": "SolarPark_Canteen 1_Inverter 5", "yield": "1.34" },
  //   { "inverter": "SolarPark_Canteen 2_Inverter 1", "yield": "1.3" },
  //   { "inverter": "SolarPark_Canteen 4_Inverter 1", "yield": "1.12" },
  //   { "inverter": "SolarPark_Canteen 4_Inverter 2", "yield": "1.29" },
  //   { "inverter": "SolarPark_Canteen 4_Inverter 3", "yield": "1.2" },
  //   { "inverter": "SolarPark_Parking Lot 1_Inverter 1", "yield": "1.35" },
  //   { "inverter": "SolarPark_Parking Lot 1_Inverter 2", "yield": "1.33" },
  //   { "inverter": "SolarPark_Parking Lot 1_Inverter 3", "yield": "1.36" }
  // ];
  
  const [data,setData] = useState(null);

  
  const data2 = [
    { "inverter": "SolarPark_Canteen 1_Inverter 1", "production": "1.29" },
    { "inverter": "SolarPark_Canteen 1_Inverter 2", "production": "1.31" },
    { "inverter": "SolarPark_Canteen 1_Inverter 3", "production": "1.31" },
    { "inverter": "SolarPark_Canteen 1_Inverter 4", "production": "1.36" },
    { "inverter": "SolarPark_Canteen 1_Inverter 5", "production": "1.34" },
    { "inverter": "SolarPark_Canteen 2_Inverter 1", "production": "1.3" },
    { "inverter": "SolarPark_Canteen 4_Inverter 1", "production": "1.12" },
    { "inverter": "SolarPark_Canteen 4_Inverter 2", "production": "1.29" },
    { "inverter": "SolarPark_Canteen 4_Inverter 3", "production": "1.2" },
    { "inverter": "SolarPark_Parking Lot 1_Inverter 1", "production": "1.35" },
    { "inverter": "SolarPark_Parking Lot 1_Inverter 2", "production": "1.33" },
    { "inverter": "SolarPark_Parking Lot 1_Inverter 3", "production": "1.36" }
  ];
  const siteData = { name: "SolarPark", temp: 45, irradiance: 77, stage: "Normal", activepower: 99, capacity: 99 }
  var number = 99
  const HomeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-home"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
  const InverterIcon = (<svg
    xmlns="http://www.w3.org/2000/svg"
    className="svg-icon"
    style={{ width: '50%', height: '50%', verticalAlign: "middle" }}
    fill="currentColor"
    overflow="hidden"
    viewBox="0 0 1024 1024"
  >
    <path d="M999.771 905.029H24.686c-13.257 0-24-10.743-24-24V224.8c0-13.257 10.743-24 24-24h69.028v45.714H46.4v612.8h931.543v-612.8h-52.457V200.8h74.171c13.257 0 24 10.743 24 24v656.229c.114 13.257-10.628 24-23.886 24z"></path>
    <path d="M365.829 200.8H656.57v45.714H365.83zM120.57 372.686H451.43V418.4H120.57zM540.8 739.314c-3.886 0-7.771-1.028-11.314-3.085-10.972-6.286-14.743-20.229-8.457-31.2 1.828-3.2 45.6-78.172 113.828-87.315 36.457-4.8 71.657 9.372 104.572 42.4 22.971 22.972 44.457 32.8 64 29.257 38.4-6.971 64.114-61.485 64.342-61.942a22.787 22.787 0 0130.286-11.315 22.787 22.787 0 0111.314 30.286c-1.371 3.086-35.542 76.8-97.828 88.114-5.486 1.029-10.972 1.486-16.457 1.486-29.6 0-59.2-14.514-88-43.429-22.629-22.628-44.343-32.342-66.286-29.371-45.486 6.057-79.886 64.114-80.229 64.686a22.823 22.823 0 01-19.771 11.428zM315.429 246.286h-45.715V164.57H169.143v81.715h-45.714V142.857c0-13.257 10.742-24 24-24h144c13.257 0 24 10.743 24 24v103.429zm586.285 0H856v-83.2H755.429v83.2h-45.715V141.37c0-13.257 10.743-24 24-24h144c13.257 0 24 10.743 24 24v104.915z"></path>
  </svg>
  )

  const EnergyMeterIcon = (<svg
    xmlns="http://www.w3.org/2000/svg"
    width="50%"
    height="50%"
    fill="currentColor"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    viewBox="0 0 462 511.93"
  >
    <path d="M22.37 0h417.26C451.94 0 462 10.06 462 22.37V423.1c0 12.3-10.06 22.37-22.37 22.37h-32.27v19.01c0 6.2-5.06 11.27-11.26 11.27H371v32.03c0 2.28-1.87 4.15-4.15 4.15h-32.33c-4.56 0-8.29-3.73-8.29-8.29v-27.89H292.8v32.03c0 2.28-1.86 4.15-4.14 4.15h-32.34c-4.56 0-8.28-3.73-8.28-8.29v-27.89h-33.43v32.03c0 2.28-1.86 4.15-4.14 4.15h-32.34c-4.56 0-8.28-3.73-8.28-8.29v-27.89h-33.43v32.03c0 2.28-1.86 4.15-4.14 4.15H99.94c-4.56 0-8.28-3.73-8.28-8.29v-27.89H65.9c-6.2 0-11.26-5.07-11.26-11.27v-19.01H22.37C10.06 445.47 0 435.4 0 423.1V22.37C0 10.06 10.06 0 22.37 0zm61.36 103.62h294.54c3.34 0 6.38 1.38 8.57 3.57a12.11 12.11 0 013.56 8.57v53.77c0 3.33-1.37 6.37-3.56 8.56-2.2 2.2-5.23 3.57-8.57 3.57H83.73c-3.34 0-6.38-1.37-8.57-3.57a12.105 12.105 0 01-3.56-8.56v-53.77c0-3.34 1.36-6.37 3.56-8.57 2.2-2.21 5.23-3.57 8.57-3.57zm159 210.98h15.79c2.29.01 4.15 1.87 4.15 4.16 0 .83-.25 1.63-.7 2.32l-37.64 64.27a4.136 4.136 0 01-3.53 1.98 4.15 4.15 0 01-4.07-4.95l5.55-39.45-18.73.32h-.08c-2.25 0-4.09-1.81-4.13-4.06v-.02c0-.75.2-1.5.58-2.15l37.06-64.26c.75-1.24 2.1-2 3.55-2 2.29 0 4.15 1.85 4.15 4.15 0 .18-.02.36-.04.54l-1.91 39.15zM394.07 58.67c5.79 0 10.49 4.95 10.49 11.06 0 6.1-4.7 11.05-10.49 11.05-5.8 0-10.5-4.95-10.5-11.05 0-6.11 4.7-11.06 10.5-11.06zm-326.13 0c5.8 0 10.5 4.95 10.5 11.06 0 6.1-4.7 11.05-10.5 11.05s-10.5-4.95-10.5-11.05c0-6.11 4.7-11.06 10.5-11.06zm0 307.96c5.8 0 10.5 4.96 10.5 11.06 0 6.11-4.7 11.06-10.5 11.06s-10.5-4.95-10.5-11.06c0-6.1 4.7-11.06 10.5-11.06zm326.13 0c5.79 0 10.49 4.96 10.49 11.06 0 6.11-4.7 11.06-10.49 11.06-5.8 0-10.5-4.95-10.5-11.06 0-6.1 4.7-11.06 10.5-11.06zM355.13 160.6c-3.07 0-5.53-.96-7.39-2.88-1.85-1.92-2.77-4.45-2.77-7.59v-14.98c0-3.15.92-5.67 2.77-7.59 1.86-1.92 4.32-2.88 7.39-2.88 3.08 0 5.55.96 7.4 2.88 1.85 1.92 2.78 4.44 2.78 7.59v14.98c0 3.14-.93 5.67-2.78 7.59-1.85 1.92-4.32 2.88-7.4 2.88zm0-7.1c.6 0 1.08-.26 1.42-.79.35-.53.52-1.22.52-2.08v-15.98c0-.86-.17-1.56-.52-2.09-.34-.52-.82-.79-1.42-.79-.59 0-1.06.27-1.41.79-.34.53-.52 1.23-.52 2.09v15.98c0 .86.18 1.55.52 2.08.35.53.82.79 1.41.79zm-61.12 7.1c-3.07 0-5.54-.96-7.39-2.88-1.85-1.92-2.78-4.45-2.78-7.59v-14.98c0-3.15.93-5.67 2.78-7.59 1.85-1.92 4.32-2.88 7.39-2.88 3.08 0 5.55.96 7.4 2.88 1.85 1.92 2.77 4.44 2.77 7.59v14.98c0 3.14-.92 5.67-2.77 7.59s-4.32 2.88-7.4 2.88zm0-7.1c.6 0 1.07-.26 1.42-.79.35-.53.52-1.22.52-2.08v-15.98c0-.86-.17-1.56-.52-2.09-.35-.52-.82-.79-1.42-.79-.59 0-1.07.27-1.41.79-.35.53-.52 1.23-.52 2.09v15.98c0 .86.17 1.55.52 2.08.34.53.82.79 1.41.79zm-63.81 7.1c-3.07 0-5.54-.96-7.39-2.88-1.85-1.92-2.77-4.45-2.77-7.59v-14.98c0-3.15.92-5.67 2.77-7.59s4.32-2.88 7.39-2.88c3.08 0 5.54.96 7.4 2.88 1.85 1.92 2.77 4.44 2.77 7.59v14.98c0 3.14-.92 5.67-2.77 7.59-1.86 1.92-4.32 2.88-7.4 2.88zm0-7.1c.6 0 1.07-.26 1.42-.79.35-.53.52-1.22.52-2.08v-15.98c0-.86-.17-1.56-.52-2.09-.35-.52-.82-.79-1.42-.79-.59 0-1.06.27-1.41.79-.35.53-.52 1.23-.52 2.09v15.98c0 .86.17 1.55.52 2.08s.82.79 1.41.79zm-61.33 7.1c-3.07 0-5.54-.96-7.39-2.88-1.85-1.92-2.77-4.45-2.77-7.59v-14.98c0-3.15.92-5.67 2.77-7.59s4.32-2.88 7.39-2.88c3.08 0 5.55.96 7.4 2.88 1.85 1.92 2.77 4.44 2.77 7.59v14.98c0 3.14-.92 5.67-2.77 7.59s-4.32 2.88-7.4 2.88zm0-7.1c.6 0 1.07-.26 1.42-.79.35-.53.52-1.22.52-2.08v-15.98c0-.86-.17-1.56-.52-2.09-.35-.52-.82-.79-1.42-.79-.59 0-1.06.27-1.41.79-.35.53-.52 1.23-.52 2.09v15.98c0 .86.17 1.55.52 2.08s.82.79 1.41.79zm-61.16 7.1c-3.08 0-5.54-.96-7.39-2.88-1.85-1.92-2.78-4.45-2.78-7.59v-14.98c0-3.15.93-5.67 2.78-7.59 1.85-1.92 4.31-2.88 7.39-2.88 3.07 0 5.54.96 7.39 2.88 1.85 1.92 2.78 4.44 2.78 7.59v14.98c0 3.14-.93 5.67-2.78 7.59-1.85 1.92-4.32 2.88-7.39 2.88zm0-7.1c.6 0 1.07-.26 1.41-.79.35-.53.53-1.22.53-2.08v-15.98c0-.86-.18-1.56-.53-2.09-.34-.52-.81-.79-1.41-.79-.6 0-1.07.27-1.41.79-.35.53-.52 1.23-.52 2.09v15.98c0 .86.17 1.55.52 2.08.34.53.81.79 1.41.79zm58.85 102.29c-4.25 0-7.69-3.45-7.69-7.69s3.44-7.68 7.69-7.68h128.88c4.25 0 7.69 3.44 7.69 7.68s-3.44 7.69-7.69 7.69H166.56zm-50.58-38.85c-4.24 0-7.69-3.44-7.69-7.68s3.45-7.69 7.69-7.69h230.04c4.24 0 7.68 3.45 7.68 7.69s-3.44 7.68-7.68 7.68H115.98zm212.57-103.71v58.82h49.72c.69 0 1.32-.29 1.78-.75.46-.45.75-1.09.75-1.77v-53.77a2.543 2.543 0 00-2.53-2.53h-49.72zm-9.61 58.82v-58.82h-52.26v58.82h52.26zm-61.87 0v-58.82h-52.14v58.82h52.14zm-61.75 0v-58.82h-52.3v58.82h52.3zm-61.91 0v-58.82H83.73c-.7 0-1.33.29-1.79.74-.45.46-.74 1.09-.74 1.79v53.77c0 .69.29 1.32.74 1.77.46.46 1.1.75 1.79.75h49.68zM59.33 38.91h343.34c12.31 0 22.37 10.07 22.37 22.37v324.85c0 12.3-10.07 22.37-22.37 22.37H59.33c-12.3 0-22.37-10.06-22.37-22.37V61.28c0-12.31 10.06-22.37 22.37-22.37z"></path>
  </svg>)

useEffect(() => {
  // Function to fetch data from the API
  const fetchData = () => {            
      console.log(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/realtimesitekpi?siteId=1`);
      fetch(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/realtimesitekpi?siteId=1`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': 'Bearer ' + String(authTokens.access)
          },
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              // Update the state with the fetched data
              console.log('Fetched data:', data);
              // setRealTimeSiteData({
              //     capacity: data.features.measurements.properties.capacity,
              //     temp: data.features.measurements.properties.temp,
              //     irradiation: data.features.measurements.properties.irradiation,
              //     yield: data.features.measurements.properties.yield,
              //     production: data.features.measurements.properties.production,
              //     powerratio: data.features.measurements.properties.powerratio,
              // });
          })
          .catch(error => {
              console.error('Error fetching data:', error);
          });
  };

  const fetchData2 = () => {            
    console.log(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/inverterlist2`);
    fetch(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/inverterlist2`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + String(authTokens.access)
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update the state with the fetched data
            console.log('Fetched data:', data);
            setData(data);
            // setRealTimeSiteData({
            //     capacity: data.features.measurements.properties.capacity,
            //     temp: data.features.measurements.properties.temp,
            //     irradiation: data.features.measurements.properties.irradiation,
            //     yield: data.features.measurements.properties.yield,
            //     production: data.features.measurements.properties.production,
            //     powerratio: data.features.measurements.properties.powerratio,
            // });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};

  // Call fetchData initially
  fetchData();
  fetchData2();

  // Set interval to call fetchData every 10 seconds
  const interval = setInterval(fetchData, 15000);

  // Cleanup function to clear the interval when the component unmounts
  return () => clearInterval(interval);
}, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <MainviewLayout>
      <div> <AnimatedSVGBackground /></div>
      {/* <div> REal content</div> */}
      <div className="grid-container">
        <div className="grid-item1 item-span1">
          <div class="inner-grid-item inner-item-span1">{siteData.name}</div>
          <div class="inner-grid-item inner-item-span2" style={{ border: '0px solid pink' }}>
            <div style={{ marginLeft: '10px', border: '2px solid orange', height: '70%' }}></div>
            <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', border: '0px solid blue' }}>
              <div>
                <span style={{ fontSize: '20px' }}>{siteData.temp} &deg;C</span>
              </div>

              <div>
                <span style={{ fontSize: '14px', color: 'rgb(104,158,169)', fontWeight: 500 }}>Temperature</span>
              </div>
            </div>
          </div>
          <div class="inner-grid-item inner-item-span2" style={{ border: '0px solid pink' }}>
            <div style={{ marginLeft: '10px', border: '2px solid blue', height: '70%', marginLeft: '40%' }}></div>
            <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', border: '0px solid blue' }}>
              <div>
              <span style={{ fontSize: '20px' }}>{siteData.irradiance} W/m²</span>

              </div>

              <div>
              <span style={{ fontSize: '14px', color: 'rgb(104,158,169)', fontWeight: 500 }}>Irradiance</span>
              </div>
            </div>
          </div>
          <div class="inner-grid-item inner-item-span4">
            <div style={{ border: '0px solid green', height: '100%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <BsFillHouseCheckFill color='green' size={60} />
              <div style={{ border: '0px solid cyan', height: '50%', width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ border: '0px solid yellow', height: '50%', display: 'flex' }}>
                  <span style={{ fontSize: '14px', color: 'rgb(104,158,169)', fontWeight: 600 }}>Site status</span>
                </div>
                <div style={{ border: '0px solid yellow', height: '50%', display: 'flex' }}>
                  <span style={{ fontSize: '14px', }}>Normal</span>

                </div>

              </div>

            </div>

          </div>
          <div class="inner-grid-item">
            <div style={{ display: 'flex', flexDirection: 'column', border: '0px solid pink', height: '100%', width: '100%' }}>
              <div style={{ border: '0px solid red', height: '100%', width: '100%' }}>
                <span style={{ fontSize: '14px', color: 'rgb(104,158,169)', fontWeight: 500 }}>Active Power</span>


              </div>
              <div style={{ border: '0px solid green', height: '100%', width: '100%' }}>
                <span style={{ fontSize: '20px', }}>999 KW</span>

              </div>

            </div>
          </div>
          <div class="inner-grid-item">
            <div style={{ display: 'flex', flexDirection: 'column', border: '0px solid pink', height: '100%', width: '100%' }}>
              <div style={{ border: '0px solid red', height: '100%', width: '100%' }}>
                <span style={{ fontSize: '14px', color: 'rgb(104,158,169)', fontWeight: 500 }}>Capacity</span>


              </div>
              <div style={{ border: '0px solid green', height: '100%', width: '100%' }}>
                <span style={{ fontSize: '20px', }}>999 MWp</span>

              </div>

            </div>
          </div>


        </div>
        <div className="grid-item item-span2" style={{ overflow: 'hidden' }}>
          <div className="nested-div">
            <span className="title">Production & Irradiation</span>
          </div>
          <Chart1 />
        </div>
        <div className="grid-item">
          <div className="nested-div">
            <span className="title">Inverter Yield Ranking</span>
          </div>
          {data ? <ScrollableDiv data={data} /> : null}
          
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
            <span className="title">Inverter Production</span>
          </div>

          {data ? <ScrollableDiv2 data={data} /> : null}

          {/* <ScrollableDiv2 data={data2} /> */}
        </div>
        <div className="grid-item item-span7">
          <div className="nested-div">
            <span className="title">Active Power & Irradiance</span>
          </div>
          <Chart2/>
        </div>
        <div className="grid-item">
          <div className="nested-div">
            <span className="title">Production</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', border: '0px solid green', height: 'calc(100% - 50px)', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', border: '0px solid red', height: '33%', width: '100%', alignItems: 'flex-end' }}>
              <div style={{ border: '0px solid green', height: '100%', width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '14px', marginLeft: '20%' }}>Inverter</span>
              </div>
              <div style={{ border: '0px solid blue', height: '100%', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {InverterIcon}

              </div>
              <div style={{ border: '0px solid white', height: '100%', width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '14px', marginLeft: '20%' }}>999 MWh</span>
              </div>

            </div>
            <div style={{ display: 'flex', flexDirection: 'row', border: '0px solid red', height: '33%', width: '100%', }}>
              <div style={{ border: '0px solid green', height: '100%', width: '100%' }}>
                <span style={{ fontSize: '14px' }}></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', border: '0px solid blue', height: '100%', width: '100%', alignItems: 'center', }}>
                <div style={{ border: '0px solid white', height: '100%', width: '0px', marginLeft: '50%' }}>
                </div>
                <span style={{ fontSize: '14px', marginLeft: '10px' }}>- {number}%</span>

              </div>
              <div style={{ border: '0px solid white', height: '100%', width: '100%' }}>
                <span style={{ fontSize: '14px' }}></span>
              </div>

            </div>
            <div style={{ display: 'flex', flexDirection: 'row', border: '0px solid red', height: '33%', width: '100%', marginTop: '5px' }}>
              <div style={{ border: '0px solid green', height: '100%', width: '100%', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', marginLeft: '20%' }}>Energy Meter</span>


              </div>
              <div style={{ border: '0px solid blue', height: '100%', width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                {EnergyMeterIcon}

              </div>
              <div style={{ border: '0px solid white', height: '100%', width: '100%', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', marginLeft: '20%' }}>999 MWh</span>
              </div>

            </div>



          </div>
        </div>
      </div>
    </MainviewLayout>
  );
}
