import React from 'react';
import Chart from 'react-apexcharts';
import './apexChartsStyles.css'; 

const Chart2 = () => {
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
            type: 'line',
            height: 200,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'flat'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: period,
            title: {
                text: 'Period'
            }
        },
        yaxis: {
            title: {
                text: 'Value'
            }
        },
        colors: ['#eba134', '#66DA26'], // Customize colors for Production and Irradiation
        legend: {
            position: 'bottom',
            horizontalAlign: 'middle',
            labels: {
                colors: '#fff'
            }
        }
       
    };

    // Construct chart series
    const series = [
        {
            name: 'Production',
            data: production
        },
        {
            name: 'Irradiation',
            data: irradiation
        }
    ];

    return (
        <div>
            <Chart
                options={options}
                series={series}
                type="line"
                height={200}
            />
        </div>
    );
};

export default Chart2;