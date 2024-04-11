import React, { useEffect, useState, useContext } from 'react';
import '../assets/styles/SiteView.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import SelectTime from '../components/SelectTime';
import { Row, Col } from 'antd';
import Chart from "react-apexcharts";
import LineChart from '../components/chart1';
import DataTable from '../components/PowerMeterRanking';
import App from '../components/DropDownButtonTime';
import { Button, Tooltip } from 'antd'
import AuthContext from '../context/AuthContext';
import MyChart2e from '../components/Chart_Templatetotale';
import { FaHome } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseSignal } from '@fortawesome/free-solid-svg-icons';
import { faSignal } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { BsAirplaneFill } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { IoInformationCircleOutline } from "react-icons/io5";
import Chart1 from '../assets/charts/Chart_Templatetotale';
import Chart2 from '../assets/charts/Chart2';


export default function SiteView() {
  const [placeholdervalue, setPlaceholdervalue] = useState(149);
  const [numberOfInverter, setnumberOfInverter] = useState(12);
  const [dateString, setDateString] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('Day');
  const [eData, seteData] = useState(null);
  const { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Site View";
  }, []);
  const fetcheData = (dateString) => {
    // const startTime = '2023-10-27 10:46:30+07';  // example format
    // const endTime = '2023-10-27 11:16:08+07'; 
    let t_unitoftime = ""
    if (selectedLabel === "Day") {
      t_unitoftime = "Week";
    }
    else { t_unitoftime = selectedLabel }

    const requestData = {
      unitoftime: t_unitoftime,
      dateString: dateString,
    };
    console.log('requestData');
    console.log(requestData);

    // Get method 
    // const url = `http://127.0.0.1:8000/api2/my-api/?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`;
    // post method, the body store json data

    // const url = process.env.REACT_APP_API_URL_2;
    const url = `http://127.0.0.1:8000/api2/my-api/total-energy/`

    console.log(url);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(requestData)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const jsonElement = JSON.stringify(data, null, 2);
        console.log(jsonElement);
        // it looks like this
        // {
        //     "meter_id": "pm08",
        //     "timestamp": "2024-01-02T10:40:00+07:00",
        //     "power": "26.00",
        //     "voltage": "51.00",
        //     "current": "39.00"
        //   },
        seteData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  const [showInfo, setShowInfo] = useState(false);

  const handleMouseEnter = () => {
    setShowInfo(true);
    console.log("true")
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  return (
    <MainviewLayout>
      {/* <div style={{ height: '200px', display: 'flex' }}> */}
      <div className='flex-container'>

        <div style={{ flex: '0 0 250px', display: 'flex', alignItems: 'center', backgroundColor: '#1c80ba', height: '100px', padding: '50px' }}>
          <FontAwesomeIcon icon={faSignal} /> &nbsp;&nbsp;&nbsp;
          <div>
            <div className="formatted-text">Self-consumption</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faCircle} style={{ color: 'green', fontSize: '10px', marginRight: '5px' }} />
              Normal
            </div>
          </div>
        </div>

        <div className="vertical-line"></div> {/* Vertical line */}


        <div style={{ flex: '1 0 10px', marginLeft: '10px' }}>Inverters ({numberOfInverter})
          <div >Info Not Available 0  &nbsp;&nbsp;&nbsp;
            Partial Capability 0  &nbsp;&nbsp;&nbsp;
            Non-Operative 0 </div>
        </div>

        <div className="vertical-line"></div> {/* Vertical line */}

        <div style={{ flex: '1 0 10px' }}>Alarm ({numberOfInverter}) <div>
          Fault 0
          Warning 0
        </div>
        </div>
      </div>


      <div style={{ display: "flex", alignItems: "center" }}>
        <App setDateString={setDateString} uppersetSelectedLabel={setSelectedLabel} />
        <Button onClick={() => { fetcheData(dateString); }}> Get Data </Button>
        <div style={{ marginLeft: 'auto', display: "flex", alignItems: "center" }}>
          <IoLocationOutline color="#9fbbc4" style={{ marginRight: '8px' }} />
          <span>Location placeholder</span>
        </div>
      </div>

      <div style={{ backgroundColor: '#043b3e', height: '50px', width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center' }}>
        &nbsp;
        &nbsp;
        &nbsp;

        <span style={{ color: '#9cafb0' }}>Capacity</span>
        <span style={{ color: 'white' }}>{placeholdervalue}</span>
        <span style={{ color: '#9cafb0' }}>Temperature</span>
        <span style={{ color: '#9cafb0' }}>Irradiation </span>
        <span style={{ color: '#9cafb0' }}>Yield</span>
        <span style={{ color: '#9cafb0' }}>Production</span>
        <span style={{ color: '#9cafb0' }}>Power Ratio</span>

        <span style={{ marginLeft: 'auto' }}>

          <Tooltip placement="rightTop" tooltipColor="red" title="prompt text" key="green" overlayInnerStyle={{ backgroundColor: "black" }} overlayStyle={{ border: "red" }}>
            <IoInformationCircleOutline />
          </Tooltip>

        </span>
        &nbsp;
        &nbsp;
        &nbsp;
      </div>
      < MyChart2e rawData={eData}></MyChart2e>
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#0a4e5e', height: '300px' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <Chart1/>
        </div>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <Chart2/>
        </div>
      </div>
      &nbsp;
      <div style={{ flex: '1 0 10px' }}>Inverter Ranking </div>



      <div> <DataTable /> </div>
    </MainviewLayout>
  );
}
