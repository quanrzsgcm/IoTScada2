import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import './apexChartsStyles.css';
import { ToggledProvider, useToggled } from '../../context/ToggledContext';

// x =< 10 show all x

const ChartLeft = ({ dateString, unitoftime, inverter_id }) => {
    console.log("from chart left: " + dateString);
    const [chartWidth, setChartWidth] = useState('200%');

    const { toggled, setToggled } = useToggled()

    // useEffect(() => {
    //     console.log("Toggled state changed:", toggled);
    //     if (toggled) {
    //         setChartWidth('110%');
    //     } else {
    //         setChartWidth('110%');
    //     }
    // }, [toggled]);    
    // const getCurrentDate = () => {
    // Get the current date and time in UTC
    // const currentDate = new Date();

    // // Extract the components in UTC
    // const year = currentDate.getUTCFullYear();
    // const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    // const day = String(currentDate.getUTCDate()).padStart(2, '0');
    // const hours = String(currentDate.getUTCHours()).padStart(2, '0');
    // const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
    // const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');
    // const milliseconds = String(currentDate.getUTCMilliseconds()).padStart(3, '0');

    // // Construct the date string
    // const dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    // console.log("datestring from chart left " + dateString);
    // return dateString;
    // }
    const [rawData, setRawData] = useState(null);

    useEffect(() => {
        if (dateString) { // Check if dateString is not null
            console.log(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/inverterdata`);
            fetch(`${process.env.REACT_APP_DJANGO_URL}/api2/my-api/inverterdata/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: dateString, unitoftime: unitoftime, inverter_id: inverter_id }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Log the data
                    setRawData(data);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [dateString, unitoftime, inverter_id]); // Dependencies array includes dateString and unitoftime

    const ExportCSV = () => {
        // Construct CSV content
        let csvContent = 'Time,Active Power (kW),Irradiance (W/㎡)\n';
        rawData.forEach(item => {
            csvContent += `${item.Time},${item['ActivePower']},${item['Irradiance']}\n`;
        });

        // Create a Blob object containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a temporary anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = 'rawData.csv';

        // Simulate a click event to initiate the download
        anchor.click();

        // Clean up the URL.createObjectURL() resource
        URL.revokeObjectURL(anchor.href);
    }


    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return <div>No data</div>;
    }

    // Extract data from rawData
    const period = rawData.map(item => item['timestamp']);
    const production = rawData.map(item => parseFloat(item['activePower']));
    const irradiation = rawData.map(item => parseFloat(item['internalTemp']));
    const svgIcon = `
<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="rgb(161,171,182)"/>
  <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="rgb(161,171,182)"/>
</svg>
`;
    const svgMarkup = `<svg fill="rgb(161,171,182)" width="16px" height="16px" viewBox="0 0 24 24" id="export-2" xmlns="http://www.w3.org/2000/svg" class="icon line"><polyline id="primary" points="15 3 21 3 21 9" style="fill: none; stroke: rgb(161,171,182); stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5;"></polyline><path id="primary-2" data-name="primary" d="M21,13v7a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3h7" style="fill: none; stroke: rgb(161,171,182); stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5;"></path><line id="primary-3" data-name="primary" x1="11" y1="13" x2="21" y2="3" style="fill: none; stroke: rgb(161,171,182); stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5;"></line></svg>`;

    var counter = 1;

    // Construct chart options
    const options = {
        chart: {
            type: 'line',
            height: 300,
            // width: chartWidth,
            fontFamily: 'Arial, Helvetica, sans-serif',
            offsetX: -40,
            offsetY: 40,
            toolbar: {
                show: true,
                offsetX: -100,
                offsetY: 15,
                tools: {
                    download: false,
                    customIcons: [{
                        // <img width="50" height="50" src="https://img.icons8.com/ios/50/export.png" alt="export"/>            
                        icon: svgIcon,
                        index: 0,
                        title: 'Download PNG',
                        class: 'custom-icon',
                        click: async function (chart, options, e) {
                            // Get the PNG data URI of the chart
                            const base64 = await chart.dataURI();

                            // Create a temporary anchor element to trigger the download
                            const downloadLink = document.createElement("a");
                            downloadLink.href = base64.imgURI;
                            downloadLink.download = "chart.png";

                            // Add the anchor element to the document
                            document.body.appendChild(downloadLink);

                            // Simulate a click event to initiate the download
                            downloadLink.click();

                            // Remove the anchor element from the document
                            document.body.removeChild(downloadLink);
                        }

                    },
                    {
                        // <img width="50" height="50" src="https://img.icons8.com/ios/50/export.png" alt="export"/>
                        icon: svgMarkup,
                        index: 1,
                        title: 'Export CSV',
                        class: 'custom-icon',
                        click: function (chart, options, e) {
                            ExportCSV();
                        }
                    }]
                },
            },
        },
        // plotOptions: {
        //     bar: {
        //         horizontal: false,
        //         columnWidth: '50%',
        //         endingShape: 'flat'
        //     },
        // },
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
        stroke: {
            width: 2,
        },
        xaxis: {
            categories: period,
            labels: {
                rotate: 0,
                style: {
                    colors: '#5f8e95' // Change to the desired color (e.g., red)
                },
                formatter: function (value, timestamp, opts) {
                    return value;
                    if (value === undefined) {
                        return null;
                    }
                    let splitTime = value.split(':');
                    // Parse the hour part into an integer
                    let hour = parseInt(splitTime[0]);
                    let minute = parseInt(splitTime[1]);
                    let totalminute = hour * 60 + minute;

                    // Define the interval at which you want to show labels
                    const interval = 120; // Show label for every 120 minute

                    // Show label for the first and every `interval` index
                    if (totalminute % interval === 0) {
                        return value;
                    } else {
                        return ''; // Return an empty string for labels you want to hide
                    }
                },
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
                    offsetY: -150, // Set the left offset for the y-axis title

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
                    text: 'Wh/㎡',
                    rotate: 0,
                    style: {
                        color: "#5f8e95",
                        fontSize: '12px',
                        fontWeight: 700,
                    },
                    offsetX: -50, // Set the left offset for the y-axis title
                    offsetY: -150, // Set the left offset for the y-axis title

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
            }
        ],
        colors: ['rgb(178,224,88)', 'rgb(128,159,255)'], // Customize colors for Production and Irradiation
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
        markers: {
            size: 0,
            hover: {
                size: 1,
            }
        },
        tooltip: {
            style: {
                background: 'rgba(255, 0, 0, 0.5)', // Red color with 50% opacity
                color: '#fff' // Text color
            },
            shared: true,
            intersect: false,
            followCursor: true,
            x: {
                show: true,
            },
            marker: {
                show: false,
            },

            // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            //     const xAxisValue = options.xaxis.categories[dataPointIndex];
            //     if (series[0][dataPointIndex] === undefined) {
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
            //     else if (series[1][dataPointIndex] === undefined) {
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
            name: 'Active Power',
            data: production,
            type: 'line',
        },
        {
            name: 'Irradiance',
            data: irradiation,
            type: 'line',

        }
    ];

    // const handleWidthChange = (width) => {
    //     console.log('handleWidthChange called');
    //     setChartWidth(width);
    //     console.log('called')
    // };

    return (
        <Chart
            options={options}
            series={series}
            type="line"
            height="90%"
            width="110%"
            max-width="110%"
            min-width="110%"
            maxWidth="110%"
            minWidth="110%"
        />
    );
}

export default ChartLeft;
