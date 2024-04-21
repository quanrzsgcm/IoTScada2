import React from 'react';
import Chart from 'react-apexcharts';
import './apexChartsStyles.css'; 
import rawData from '../../sampledata/chart2data'

import { useRef, useEffect, useState } from 'react';

// x =< 10 show all x

const Chart1 = () => {
    const [chartWidth, setChartWidth] = useState('100%');


    // Sample data
  
    if (!rawData || rawData.length === 0) {
        return <div>No data</div>;
    }

    // Extract data from rawData
    const period = rawData.map(item => item.period);
    const activePower = rawData.map(item => parseFloat(item['activePower']));
    const irradiance = rawData.map(item => parseFloat(item['irradiance']));

    // Construct chart options
    const options = {
        chart: {
            type: 'line',
            height: 300,
            toolbar: {
                show: false
            },
            width: '100%'
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
        grid: {
            show: true,
            borderColor: 'rgb(25,85,108)',
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
                lines: {
                    show: false
                }
            },   
            yaxis: {
                lines: {
                    show: true
                }
            },
           
        },
        xaxis: {
            categories: period,
            labels: {
                style: {
                    colors: '#5f8e95'
                },
                // formatter: function(value, timestamp, opts) {
                //     let splitTime = value.split(':');
                //     // Parse the hour part into an integer
                //     let hour = parseInt(splitTime[0]);

                //     // Define the interval at which you want to show labels
                //     const interval = 2; // Show label for every 2rd index (0, 3, 6, 9, ...)
                    
                //     // Show label for the first and every `interval` index
                //     if (hour % interval === 0) {
                //         return value;
                //     } else {
                //         return ''; // Return an empty string for labels you want to hide
                //     }
                // },
            },
            axisTicks: {
                show: false,
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
        colors: ['rgb(0,217,254)', 'rgb(253,201,24)'], // Customize colors for Production and Irradiation
        fill: {
            type: 'gradient',
            gradient: {
            //   shade: 'light',
            type: 'vertical',
              shadeIntensity: 0.1,
              gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 0.9,
              stops: [0, 100],
              colorStops: []
            }
        },

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

            // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            //     const xAxisValue = options.xaxis.categories[dataPointIndex];
            //     if (series[0][dataPointIndex] === undefined){
            //         return (                 
            //             '<div class="arrow_box" style="background: rgba(0, 0, 0, 0.9);">' +
            //             '<span style="color: white;">' + ' ' + xAxisValue + '</span>' +
            //             '<br>' +               
            //             '<span style="color: #5f8e95;">Irradiation: </span>' +
            //             '<span style="color: white;">' + series[1][dataPointIndex] + '</span>' +
            //             '<span style="color: white;">' + ' Wh/m&sup2;' + '</span>' +            
            //             '</div>'
            //         )
            //     }
            //     else if (series[1][dataPointIndex] === undefined){
            //         return (                 
            //             '<div class="arrow_box" style="background: rgba(0, 0, 0, 0.9);">' +
            //             '<span style="color: white;">' + ' ' + xAxisValue + '</span>' +
            //             '<br>' +
            //             '<span style="color: #5f8e95;">' + 'Production: ' + '</span>' +
            //             '<span style="color: white;">' + series[0][dataPointIndex] + '</span>' +
            //             '<span style="color: white;">' + ' kWh' + '</span>' +                           
            //             '</div>'
            //         )
            //     }


            //     return (                 
            //         '<div class="arrow_box" style="background: rgba(0, 0, 0, 0.9);">' +
            //         '<span style="color: white;">' + ' ' + xAxisValue + '</span>' +
            //         '<br>' +
            //         '<span style="color: #5f8e95;">' + 'Production: ' + '</span>' +
            //         '<span style="color: white;">' + series[0][dataPointIndex] + '</span>' +
            //         '<span style="color: white;">' + ' kWh' + '</span>' +
            //         '<br>' +
            //         '<span style="color: #5f8e95;">Irradiation: </span>' +
            //         '<span style="color: white;">' + series[1][dataPointIndex] + '</span>' +
            //         '<span style="color: white;">' + ' Wh/m&sup2;' + '</span>' +            
            //         '</div>'
            //     )
            // }

        },

    };

    // Construct chart series
    const series = [
        {
            name: 'activePower',
            data: activePower
        },

        {
            name: 'irradiance',
            data: irradiance
        }
    ];

    return (
        <div>
            <Chart
                options={options}
                series={series}
                type="line"
                height={300}
                width={chartWidth} // Set the width dynamically
            />
        </div>
    );
};
export default Chart1;