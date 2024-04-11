import React from 'react';
import Chart from 'react-apexcharts';
import './apexChartsStyles.css'; 


const Chart1 = () => {
    // Sample data
    const rawData = [
        { Period: '0:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        { Period: '1:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        { Period: '2:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        { Period: '3:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        { Period: '4:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        { Period: '5:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 3.09 },
        { Period: '6:00', 'Production (kWh)': 73.56, 'Irradiation (Wh/㎡)': 77.1 },
        { Period: '7:00', 'Production (kWh)': 283.41, 'Irradiation (Wh/㎡)': 270.06 },
        { Period: '8:00', 'Production (kWh)': 492, 'Irradiation (Wh/㎡)': 482.78 },
        { Period: '9:00', 'Production (kWh)': 690.22, 'Irradiation (Wh/㎡)': 710.71 },
        { Period: '10:00', 'Production (kWh)': 453.47, 'Irradiation (Wh/㎡)': 481.08 }
    ];
    
    if (!rawData || rawData.length === 0) {
        return <div>No data</div>;
    }

    // Extract data from rawData
    const period = rawData.map(item => item.Period);
    const production = rawData.map(item => parseFloat(item['Production (kWh)']));
    const irradiation = rawData.map(item => parseFloat(item['Irradiation (Wh/㎡)']));

    // Construct chart options
    const options = {
        chart: {
          type: 'bar',
          height: 200
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#F44336'],
        series: [{
          name: 'Production',
          data: [44, 55, 41, 67, 22, 43, 21, 49, 64, 70]
        }],
        xaxis: {
          categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.8,
            stops: [0, 100]
          }
        },
      }
      
      
    
    
    return (
        <div>
            <Chart options={options} series={options.series} type="bar" height={200} />
        </div>
    );
};

export default Chart1;