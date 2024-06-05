import React, { useState, useEffect } from 'react';
import '../assets/styles/SiteKPI.scss';
import MainviewLayout from '../layouts/MainviewLayout';
import { Slider, InputNumber, ConfigProvider } from "antd";
import YesNoSwitch from '../components/MySwitch';
import CancelButton from '../components/CancelButton';
import ApplyButton from '../components/ApplyButton';


export default function SettingsPage() {
    const applySetting = () => {
        console.log('TRIGGERED')
        console.log(`${process.env.REACT_APP_DJANGO_URL}/myadmin/threshold/`);
        fetch(`${process.env.REACT_APP_DJANGO_URL}/myadmin/threshold/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update the state with the fetched data
                console.log('Response from server', data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });           
    };
    
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
    const [value, setValue] = useState([0, 10, 20]);
    const start = value[0] / 100;
    const end = value[value.length - 1] / 100;
    const [switch1, setSwitch1] = useState(null);
    const [inputValue, setInputValue] = useState(1);
    const onChange = (newValue) => {
        setInputValue(newValue);
    };

    const [Input7, setInput7] = useState(null);
    const onChangeInput7 = (newValue) => {
        setInput7(newValue)
        setDefaultValueminutes(newValue)
    }
    const [Input1, setInput1] = useState(null);
    const onChangeInput1 = (newValue) => {
        setInput1(newValue)        
    }

    const [Input2, setInput2] = useState(null);
    const onChangeInput2 = (newValue) => {
        setInput2(newValue)        
    }    

    const [Input3, setInput3] = useState(null);
    const onChangeInput3 = (newValue) => {
        setInput3(newValue)        
    }

    const [Input4, setInput4] = useState(null);
    const onChangeInput4 = (newValue) => {
        setInput4(newValue)       
    }  

    const [Input5, setInput5] = useState(null);
    const onChangeInput5 = (newValue) => {
        setInput5(newValue)        
    } 

    const [Input6, setInput6] = useState(null);
    const onChangeInput6 = (newValue) => {
        setInput6(newValue)        
    }     

    const [fetchedData,setFetchedData] = useState(null);

    const [defaultValueminutes, setDefaultValueminutes] = useState(null);

    const [requestBody, setRequestBody] = useState({
        internalTempWarning: null,
        internalTempFault: null,

        inputPowerWarning: null,
        inputPowerFault: null,

        outputPowerWarning: null,
        outputPowerFault: null,
        
        on: null,
        minutesToAlarm: null
    });

    useEffect(() => {
        // Update requestBody whenever Input1, Input2, or Input3 changes
        setRequestBody({
            internalTempWarning: Input1,
            internalTempFault: Input2,

            inputPowerWarning: Input3,
            inputPowerFault: Input4,

            outputPowerWarning: Input5,
            outputPowerFault: Input6,

            on: switch1,
            minutesToAlarm: Input7
        });
    }, [Input1, Input2, Input3, Input4, Input5, Input6, Input7, switch1]);


    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = () => {            
            console.log(`${process.env.REACT_APP_DJANGO_URL}/myadmin/threshold`);
            fetch(`${process.env.REACT_APP_DJANGO_URL}/myadmin/threshold`, {
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
                    setFetchedData(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });           
        };

        // Call fetchData initially
        fetchData();

    }, []); // Empty dependency array means this effect runs once after the initial render

    useEffect(() => {
        if (fetchedData) {
            setSwitch1(fetchedData.features?.idlealarm?.properties?.on ?? '')
            setDefaultValueminutes(fetchedData.features?.idlealarm?.properties?.minutesToAlarm ?? '');
            setInput1(fetchedData.features?.thresholds?.properties?.internalTempWarning ?? '');
            setInput2(fetchedData.features?.thresholds?.properties?.internalTempFault ?? '');
            setInput3(fetchedData.features?.thresholds?.properties?.inputPowerWarning ?? '');
            setInput4(fetchedData.features?.thresholds?.properties?.inputPowerFault ?? '');
            setInput5(fetchedData.features?.thresholds?.properties?.outputPowerWarning ?? '');
            setInput6(fetchedData.features?.thresholds?.properties?.outputPowerFault ?? '');
        }
    }, [fetchedData]);


    return (
        <MainviewLayout>
            <ConfigProvider
                theme={{
                    components: {                        
                        InputNumber: {
                            colorText: 'white',
                            colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
                        }
                    },
                }}
            >
            <div style={{ height: 'auto', border: '0px solid red' }}>
                <span style={{color: 'rgb(64,240,215)', fontSize: '20px'}}>
                Alarm
                    </span>
                <div style={{ height: '1px', border: '1px solid rgb(64,240,215)' }}></div>

                <span style={{ marginRight: '10px' }}>Notify when inverter is not communicating: </span>
                <YesNoSwitch value={switch1} setValue={setSwitch1} />

                <span style={{ marginLeft: '10px', marginRight: '10px' }}>after </span>
                <InputNumber 
                        onChange={onChangeInput7} min={1} max={100}
                        controls={false} 
                        value={defaultValueminutes}
                        disabled={!switch1}
                        style={{marginLeft:'0px', backgroundColor: '#043b3e', color: 'white', border: "0px solid #009bc4", borderRadius: 0 , width: '40px'}} />
                <span style={{ marginLeft: '10px' }}>minutes </span>


                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '0px solid blue',
                    flexDirection: 'row',
                    height: '30px',
                    marginTop: '20px',
                    alignItems: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        border: '0px solid red',
                        flex: '1 1 200px',
                    }}>
                    <span style={{ fontWeight: 'bold' }}>
                        Attributes
                    </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                    }}>
                        <span style={{ fontWeight: 'bold' }}>
                        Value in
                    </span>
                        
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                    }}>
                        <span style={{ fontWeight: 'bold' }}>
                        Warning at
                    </span>
                        
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid black',
                        flex: '1 1 200px',
                    }}>
                        <span style={{ fontWeight: 'bold' }}>
                        Fault after
                    </span>                        
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '0px solid blue',
                    flexDirection: 'row',
                    height: 'auto',
                    alignItems: 'center'                                        
                }}>
                    <div style={{
                        display: 'flex',
                        border: '0px solid red',
                        flex: '1 1 200px',
                    }}>
                        Temperature
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                    }}>
                        °C
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                        justifyContent: 'space-between',
                        alignItems: 'center'                        
                    }}>
                        
                        <InputNumber 
                        onChange={onChangeInput1} min={1} max={100} 
                        controls={false} 
                        value={Input1 ? Input1 : null} 
                        style={{marginLeft:'0px', backgroundColor: '#043b3e', color: 'white', border: "0px solid #009bc4", borderRadius: 0 }} />
                        to
                        <InputNumber 
                        onChange={onChangeInput2} min={Input1} max={100} 
                        controls={false} 
                        value={Input2 ? Input2 : null} 
                        style={{marginRight:'50px', backgroundColor: '#043b3e', color: 'white', border: "0px solid #009bc4", borderRadius: 0 }} />
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid black',
                        flex: '1 1 200px',
                    }}>
                        {Input2}
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '0px solid blue',
                    flexDirection: 'row',
                    height: 'auto',
                    
                }}>
                    <div style={{
                        display: 'flex',
                        border: '0px solid red',
                        flex: '1 1 200px',
                    }}>
                        Input Power
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                    }}>
                        kW
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                        justifyContent: 'space-between',
                        alignItems: 'center'   
                    }}>
                        
                        <InputNumber 
                        onChange={onChangeInput3} min={1} max={100} 
                        controls={false} 
                        value={Input3 ? Input3 : null} 
                        style={{marginLeft:'0px', backgroundColor: '#043b3e', color: 'white', border: "0px solid #009bc4", borderRadius: 0 }} />
                        to
                        <InputNumber 
                        onChange={onChangeInput4} min={Input3} max={100} 
                        controls={false} 
                        value={Input4 ? Input4 : null} 
                        style={{marginRight:'50px', backgroundColor: '#043b3e', color: 'white', border: "0px solid #009bc4", borderRadius: 0 }} />                  

                    


                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid black',
                        flex: '1 1 200px',
                    }}>
                        {Input4}
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '0px solid blue',
                    flexDirection: 'row',
                    height: 'auto',
                    
                }}>
                    <div style={{
                        display: 'flex',
                        border: '0px solid red',
                        flex: '1 1 200px',
                    }}>
                        Active Power
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                    }}>
                        kW
                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid white',
                        flex: '1 1 200px',
                        justifyContent: 'space-between',
                        alignItems: 'center'   
                    }}>
                        
                        <InputNumber 
                        onChange={onChangeInput5} min={1} max={100} 
                        controls={false} 
                        value={Input5 ? Input5 : null} 
                        style={{marginLeft:'0px', backgroundColor: '#043b3e', color: 'white', border: "0px solid #009bc4", borderRadius: 0 }} />
                        to
                        <InputNumber 
                        onChange={onChangeInput6} min={Input5} max={100} 
                        controls={false} 
                        value={Input6 ? Input6 : null} 
                        style={{marginRight:'50px', backgroundColor: '#043b3e', color: 'white', border: "0px solid #009bc4", borderRadius: 0 }} />                  

                    </div>
                    <div style={{
                        display: 'flex',
                        border: '0px solid black',
                        flex: '1 1 200px',
                    }}>
                        {Input6}
                    </div>
                </div>

                <div style={{
                        display: 'flex',
                        border: '0px solid black',
                        marginTop: '20px'

                    }}>
                <span style={{
                        marginLeft: '45%',
                        marginRight: '40px'

                    }}>
                <CancelButton/>
                </span>
                <span>
                <ApplyButton onClick={applySetting}/>

                </span>
                </div>
            </div>
            </ConfigProvider>
        </MainviewLayout>
    );
}
