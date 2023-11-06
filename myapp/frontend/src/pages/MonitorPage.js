    import React, { useState } from 'react';
    import { Routes, Route } from 'react-router-dom';
    import '../App.css';
    import VariationsExample from '../components/variationexample';
    import background from "../images/jojo.jpg";
    import DarkExample from '../components/darkTable';
    import DataFetchingComponent from '../components/dataFetching';
    import DatePickerValue from '../components/datetimepicker';

    function MonitorPage() {
        const [selectedTime, setselectedTime] = useState(null);
        const onTimeChange = (newValue) => {
            setselectedTime(newValue);
            console.log("loging from father:", newValue);
        }
    
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
                    {/* <DataFetchingComponent /> */}
                </div>
                <div>
                    <DatePickerValue importedFun = {onTimeChange}/>
                </div>
            </main>

        );
    }

    export default MonitorPage;
