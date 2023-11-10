import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../App.css';
import dayjs from 'dayjs'
import background from "../images/jojo.jpg";
import CustomDateTimeFormat from '../components/datetimepicker';
import DataFetchingComponent from '../components/dataFetching';
import DateTimeFieldValue from '../components/datetimepicker';
import Button from 'react-bootstrap/Button';
import { fetchData } from '../code/con';

function MonitorPage() {
    const [selectedTime1, setselectedTime1] = useState('');
    const [selectedTime2, setselectedTime2] = useState('');

    console.log('da set',selectedTime1);

    const onTimeChange = (newValue) => {
        setselectedTime1(newValue);
        console.log("Logging from beg:", newValue);
    }

    const onTimeChange2 = (newValue) => {
        setselectedTime2(newValue);
        console.log("Logging from end:", newValue);
    }
    const handleClick = (selectedTime1, selectedTime2) => { fetchData(selectedTime1, selectedTime2) }


    const backgroundImageStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'fill',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'filled',
    };

    return (
        <main className="content">
            <h1 className="text-success text-uppercase text-center my-4">
                Iot Management System
            </h1>
            <div>
                <DataFetchingComponent />
            </div>
            <div>
                <CustomDateTimeFormat importFunction={onTimeChange} />
                <CustomDateTimeFormat importFunction={onTimeChange2} />
            </div>
            <div>
                <Button variant="primary" onClick={() => handleClick(selectedTime1, selectedTime2)}>Fetch</Button>{' '}
            </div>


        </main>

    );
}

export default MonitorPage;
