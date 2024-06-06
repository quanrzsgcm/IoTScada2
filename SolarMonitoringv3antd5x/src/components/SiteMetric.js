import { calc } from "antd/es/theme/internal";
import React, { useEffect, useRef } from "react";
import { GiElectric } from "react-icons/gi";
import { TiTime } from "react-icons/ti";
import { FaCoins } from "react-icons/fa";
import { BsTreeFill } from "react-icons/bs";

const data = {
  production: 6.14,
  yield: 5.2,
  revenue: 500,
  co2reduction: 5.1 
}

const SiteMetric = () => {
  return (
    <div style={{ 
      // border: '1px solid green', 
      overflow: 'hidden', height: `calc(100% - 50px)` }}>

<div style={{ display: 'flex', flexDirection: 'row', 
// border: '1px solid green', 
overflow: 'hidden', height: `calc(100%/4)`, justifyContent: 'flex-start' }}>
  <div style={{ 
    // border: '1px solid red', 
    flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '50px'}}>Production</span>
  </div>
  <div style={{ 
    // border: '1px solid yellow', 
    flex: 2 }}><GiElectric style={{ fill: 'blue' }} />
</div>
  <div style={{ 
    // border: '1px solid black',
     flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '10px'}}>{data.production} MWh</span>
  </div>
</div>

<div style={{ display: 'flex', flexDirection: 'row', 
// border: '1px solid green', 
overflow: 'hidden', height: `calc(100%/4)`, justifyContent: 'flex-start' }}>
  <div style={{ 
    // border: '1px solid red', 
    flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '50px'}}>Yield</span>
  </div>
  <div style={{ 
    // border: '1px solid yellow', 
    flex: 2 }}><TiTime  style={{ fill: 'green' }} />
</div>
  <div style={{ 
    // border: '1px solid black', 
    flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '10px'}}>{data.yield} h</span>
  </div>
</div>

<div style={{ display: 'flex', flexDirection: 'row', 
// border: '1px solid green', 
overflow: 'hidden', height: `calc(100%/4)`, justifyContent: 'flex-start' }}>
  <div style={{ 
    // border: '1px solid red', 
    flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '50px'}}>Revenue</span>
  </div>
  <div style={{ 
    // border: '1px solid yellow',
     flex: 2 }}><FaCoins  style={{ fill: 'orange' }} />
</div>
  <div style={{ 
    // border: '1px solid black',
     flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '10px'}}>{data.revenue} VND</span>
  </div>
</div>

<div style={{ display: 'flex', flexDirection: 'row', 
// border: '1px solid green', 
overflow: 'hidden', height: `calc(100%/4)`, justifyContent: 'flex-start' }}>
  <div style={{ 
    // border: '1px solid red', 
    flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '50px'}}>CO<sub style={{ fontSize: 'smaller' }}>2</sub>
    <span style={{ marginLeft: '5px' }}>Reduction</span></span>
  </div>
  <div style={{ 
    // border: '1px solid yellow',
     flex: 2 }}><BsTreeFill   style={{ fill: 'green' }} />
</div>
  <div style={{ 
    // border: '1px solid black',
     flex: 4, display: 'flex', alignItems: 'center' }}>
    <span style={{color: "white", fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '10px'}}>{data.co2reduction} t</span>
  </div>
</div>


    </div>

  )
}

export default SiteMetric