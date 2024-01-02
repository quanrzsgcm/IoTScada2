import React, { useEffect, useState, useContext} from 'react';
import '../assets/styles/SiteView.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import SelectTime from '../components/SelectTime';
import { Row, Col } from 'antd';
import Chart from "react-apexcharts";
import LineChart from '../components/chart1';
import DataTable from '../components/PowerMeterRanking';
import App from '../components/DropDownButtonTime';
import { Button } from 'antd'
import AuthContext from '../context/AuthContext';
import MyChart2e from '../components/Chart_Templatetotale';


export default function SiteView() {
  const [dateString, setDateString] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('Day');
  const [eData, seteData] = useState(null);
  const { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Site View";
  },[]);
  const fetcheData = (dateString) => {
    // const startTime = '2023-10-27 10:46:30+07';  // example format
    // const endTime = '2023-10-27 11:16:08+07'; 
    let t_unitoftime = ""
    if (selectedLabel === "Day"){
         t_unitoftime = "Week";
    }
    else {t_unitoftime = selectedLabel}

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

  return (
    <MainviewLayout>
      <div className='siteview'>SiteView</div>
      <div> <App setDateString={setDateString} uppersetSelectedLabel={setSelectedLabel} />
      <Button onClick={() => {
                            fetcheData(dateString);
                        }
                    }> Get Data </Button>
      </div>
      < MyChart2e rawData={eData}></MyChart2e>
      
      <div> <DataTable /> </div>
    </MainviewLayout>
  );
}
