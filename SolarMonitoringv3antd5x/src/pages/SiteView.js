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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignal } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { IoLocationOutline } from "react-icons/io5";
import { IoInformationCircleOutline } from "react-icons/io5";
import Chart1 from '../assets/charts/Chart_Templatetotale';
import Chart2 from '../assets/charts/Chart2new';
import InverterRanking from '../components/LVInverterRanking';
import { GiElectric } from "react-icons/gi";
import { MdOutlineSolarPower } from "react-icons/md";
import App3 from '../assets/charts/test';
import EventSourceComponent from '../components/EventSourceComponent';

export default function SiteView() {
    const [placeholdervalue, setPlaceholdervalue] = useState(149);
    const [realtimesitedata, setRealTimeSiteData] = useState({
        capacity: 1.19,
        temp: 45,
        irradiation: 67.8,
        yield: 120,
        production: 45,
        powerratio: 99,
    });


    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = () => {            
            console.log(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/realtimesitedata?siteId=1`);
            fetch(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/realtimesitedata?siteId=1`, {
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
                    setRealTimeSiteData({ 
                        irradiation: data.irradiation,
                        capacity: data.capacity,
                        temp: data.temperature,
                        // production: data.production,
                        // powerratio: data.powerratio,
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

            console.log(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/invertercount/`);
            fetch(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/invertercount/`, {
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
                    console.log('Fetched inverter count:', data);
                    setnumberOfInverter(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        // Call fetchData initially
        fetchData();

        // Set interval to call fetchData every 10 seconds
        const interval = setInterval(fetchData, 15000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array means this effect runs once after the initial render



    const [numberOfInverter, setnumberOfInverter] = useState(null);
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
            {/* <div style={{        
                height: '110px',
                border: '1px solid red'                
            }}>
            {dateString} <br>
            </br>
            {selectedLabel}
            </div> */}
            {/* <div>
            <EventSourceComponent/>
            </div> */}

            <div style={{
                display: 'flex',
                height: '110px',
                alignItems: 'center',
                background: 'linear-gradient(to right, rgb(5, 78, 78), rgb(18, 57, 90))', // Adjusted gradient syntax,
                marginTop: '10px'
            }}>
                <div style={{ flex: '0 0 250px', display: 'flex', alignItems: 'center', background: 'linear-gradient(to right, rgb(5, 78, 78), rgb(18, 57, 90))', height: '110px', padding: '50px' }}>
                    {/* <FontAwesomeIcon icon={faSignal} /> &nbsp;&nbsp;&nbsp; */}
                    <MdOutlineSolarPower size={50} /> &nbsp;&nbsp;&nbsp;
                    <div>
                        <div className="formatted-text">Self-consumption</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faCircle} style={{ color: 'green', fontSize: '10px', marginRight: '5px' }} />
                            Normal
                        </div>
                    </div>
                </div>

                <div className="vertical-line"></div> {/* Vertical line */}


                <div style={{ flex: '1 0 10px', marginLeft: '50px', marginTop: '0px' }}>
                    Inverters ({numberOfInverter})
                    <div style={{ marginTop: '15px' }}>Info Not Available 0 &nbsp;&nbsp;&nbsp; Partial Capability 0 &nbsp;&nbsp;&nbsp; Non-Operative 0 </div>
                </div>


                <div className="vertical-line"></div> {/* Vertical line */}

                <div style={{ flex: '1 0 10px', marginLeft: '50px', marginTop: '0px' }}>Alarm ({0})
                    <div style={{ marginTop: '15px' }}>Info Not Available 0 &nbsp;&nbsp;&nbsp; Partial Capability 0 &nbsp;&nbsp;&nbsp; Non-Operative 0 </div>
                </div>
            </div>


            <div style={{ display: "flex", alignItems: "center", marginTop: '10px'}}>
                <App setDateString={setDateString} selectedLabel={selectedLabel} uppersetSelectedLabel={setSelectedLabel} />
                {/* <Button onClick={() => { fetcheData(dateString); }}> Get Data </Button> */}
                <div style={{ marginLeft: 'auto', display: "flex", alignItems: "center" }}>
                    <IoLocationOutline color="#9fbbc4" style={{ marginRight: '8px' }} />
                    <span>Location placeholder</span>
                </div>
            </div>

            <div style={{
                background: 'linear-gradient(to right, rgb(2,62,62), rgb(13,35,62))',
                height: '40px',
                width: '100%',
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center'
            }}>
                &nbsp;
                &nbsp;
                &nbsp;



                <span style={{ color: '#9cafb0', marginRight: '5px' }}>Capacity</span>
                <span style={{ color: 'white', marginRight: '5px' }}>{realtimesitedata.capacity}</span>
                <span style={{ color: 'white', marginRight: '40px' }}>MWp</span>

                <span style={{ color: '#9cafb0', marginRight: '5px' }}>Temperature</span>                
                <span style={{ color: 'white', marginRight: '5px' }}>{realtimesitedata.temp}</span>
                <span style={{ color: 'white', marginRight: '40px' }}>°C</span>

                <span style={{ color: '#9cafb0', marginRight: '5px' }}>Irradiation </span>
                <span style={{ color: 'white', marginRight: '5px' }}>{realtimesitedata.irradiation}</span>
                <span style={{ color: 'white', marginRight: '40px' }}>Wh/㎡</span>

               
                <span style={{ color: '#9cafb0', marginRight: '5px' }}>Production</span>
                <span style={{ color: 'white', marginRight: '5px' }}>{realtimesitedata.production}</span>
                <span style={{ color: 'white', marginRight: '40px' }}>MWh</span>               


                <span style={{ marginLeft: 'auto' }}>
                    <Tooltip placement="rightTop" tooltipColor="red" title="prompt text" key="green" overlayInnerStyle={{ backgroundColor: "black" }} overlayStyle={{ border: "red" }}>
                        <IoInformationCircleOutline />
                    </Tooltip>

                </span>
                &nbsp;
                &nbsp;
                &nbsp;
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'linear-gradient(to right, rgb(2,82,82) 0%, rgb(13,72,103) 25%, rgb(14,70,104) 50%, rgb(8,62,88) 75%, rgb(21,51,81) 100%)',
                height: '350px',
                // border: '2px solid black', // Border color for the parent div,
                overflow: 'hidden', // Prevents content from overflowing
            }}>
                <div style={{  flex: '0 0 50%' , marginRight: '0px', 
                border: '0px solid red',
                 overflow: 'hidden' }}> {/* Border color for the first child div */}
                    <Chart1 dateString={dateString} unitoftime={selectedLabel}/>
                </div>
                <div style={{ flex: '0 0 50%' ,marginLeft: '0px', 
                border: '0px solid blue', 
                overflow: 'hidden' }}> {/* Border color for the second child div */}
                    <Chart2 dateString={dateString} unitoftime={selectedLabel}/>
                </div>
            </div>

            <div style={{ display: 'flex' }}>
                <div className="custom-scrollbar" style={{ flex: '1', width: '700px', marginRight: '20px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', verticalAlign: 'center' }}>
                        <div>Inverter Ranking</div>
                        <div>
                            <a href="http://localhost:3000/site-monitor/devicelist" style={{ textDecoration: 'none', color: 'inherit', fontSize: '10px' }}>Details</a>
                        </div>
                    </div>



                    <div> <InverterRanking /> </div>
                </div>
                <div style={{ width: '500px' }}>


                </div>

            </div>

        </MainviewLayout>
    );
}
