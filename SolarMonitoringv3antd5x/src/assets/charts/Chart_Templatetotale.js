import React from 'react';
import Chart from 'react-apexcharts';
import './apexChartsStyles.css';

const Chart1 = () => {
    // Sample data
    const rawData = [
        // { Period: '0:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        // { Period: '1:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        // { Period: '2:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        // { Period: '3:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        // { Period: '4:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 0 },
        // { Period: '5:00', 'Production (kWh)': 0, 'Irradiation (Wh/㎡)': 3.09 },
        // { Period: '6:00', 'Production (kWh)': 73.56, 'Irradiation (Wh/㎡)': 77.1 },
        // { Period: '7:00', 'Production (kWh)': 283.41, 'Irradiation (Wh/㎡)': 270.06 },
        // { Period: '8:00', 'Production (kWh)': 492, 'Irradiation (Wh/㎡)': 482.78 },
        // { Period: '9:00', 'Production (kWh)': 690.22, 'Irradiation (Wh/㎡)': 710.71 },
        // { Period: '10:00', 'Production (kWh)': 453.47, 'Irradiation (Wh/㎡)': 481.08 },        
        {
            "Period": "0:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "1:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "2:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "3:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "4:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "5:00",
            "Production (kWh)": 3.75,
            "Irradiation (Wh/㎡)": 3.49
        },
        {
            "Period": "6:00",
            "Production (kWh)": 66.75,
            "Irradiation (Wh/㎡)": 72.69
        },
        {
            "Period": "7:00",
            "Production (kWh)": 256.88,
            "Irradiation (Wh/㎡)": 250.96
        },
        {
            "Period": "8:00",
            "Production (kWh)": 486.63,
            "Irradiation (Wh/㎡)": 477.86
        },
        {
            "Period": "9:00",
            "Production (kWh)": 687.31,
            "Irradiation (Wh/㎡)": 688.44
        },
        {
            "Period": "10:00",
            "Production (kWh)": 739.22,
            "Irradiation (Wh/㎡)": 831.39
        },
        {
            "Period": "11:00",
            "Production (kWh)": 761.84,
            "Irradiation (Wh/㎡)": 834.8
        },
        {
            "Period": "12:00",
            "Production (kWh)": 826,
            "Irradiation (Wh/㎡)": 913.28
        },
        {
            "Period": "13:00",
            "Production (kWh)": 730.09,
            "Irradiation (Wh/㎡)": 834.39
        },
        {
            "Period": "14:00",
            "Production (kWh)": 608.5,
            "Irradiation (Wh/㎡)": 675.93
        },
        {
            "Period": "15:00",
            "Production (kWh)": 435.34,
            "Irradiation (Wh/㎡)": 495.3
        },
        {
            "Period": "16:00",
            "Production (kWh)": 213.59,
            "Irradiation (Wh/㎡)": 250.36
        },
        {
            "Period": "17:00",
            "Production (kWh)": 46.5,
            "Irradiation (Wh/㎡)": 55.62
        },
        {
            "Period": "18:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0.63
        },
        {
            "Period": "19:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "20:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "21:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "22:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        },
        {
            "Period": "23:00",
            "Production (kWh)": 0,
            "Irradiation (Wh/㎡)": 0
        }
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
            height: 300,
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
            labels: {
                style: {
                    colors: '#5f8e95' // Change to the desired color (e.g., red)
                }
            }
        },
        yaxis: [
            {
                title: {
                    text: 'kWh',
                    rotate: 0,
                    style: {
                        color: "#5f8e95",
                        fontSize: '12px',
                        fontWeight: 700,
                    },
                    offsetX: 50, // Set the left offset for the y-axis title
                    offsetY: -110, // Set the left offset for the y-axis title

                },
                labels: {
                    style: {
                        colors: '#5f8e95',
                        fontSize: '12px',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontWeight: 700,
                    }
                },
                decimalsInFloat: 0,
            },

            {
                opposite: true,
                title: {
                    text: 'Irradiation (Wh/㎡)'
                },
                labels: {
                    style: {
                        colors: '#5f8e95'
                    }
                },
                decimalsInFloat: 0,
            }
        ],
        colors: ['#eba134', '#66DA26'], // Customize colors for Production and Irradiation
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            labels: {
                colors: '#fff'
            }
        },
        tooltip: {
            style: {
                background: 'rgba(255, 0, 0, 0.5)', // Red color with 50% opacity
                color: '#fff' // Text color
            },
            shared: true,
            intersect: false,

            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const xAxisValue = options.xaxis.categories[dataPointIndex];

                return (
                    '<div class="arrow_box" style="background-color: rgba(0, 0, 0, 0.9);">' +
                    '<span style="color: white;">' + xAxisValue + '</span>' +
                    '<br>' +
                    '<span style="color: #5f8e95;">' + 'Production: ' + '</span>' +
                    '<span style="color: white;">' + series[0][dataPointIndex] + '</span>' +
                    '<span style="color: white;">' + ' kWh' + '</span>' +
                    '<br>' +
                    '<span style="color: #5f8e95;">Irradiation: </span>' +
                    '<span style="color: white;">' + series[1][dataPointIndex] + '</span>' +
                    '<span style="color: white;">' + ' Wh/m&sup2;' + '</span>' +
                    '</div>'
                )

            }

        },

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
                type="bar"
                height={300}
            />
        </div>
    );
};

export default Chart1;