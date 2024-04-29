import { calc } from "antd/es/theme/internal";
import React, { useState } from "react";
import Chart from "react-apexcharts";

const RadialBarChart = () => {
    const [seriesValue, setSeriesValue] = useState(72.13); // Initial series value
    const [series, setSeries] = useState([seriesValue]);

    const handleIncrease = () => {
        const newValue = seriesValue + 10; // Increment series value by 10
        setSeriesValue(newValue);
        setSeries([newValue]);
    };

    const handleDecrease = () => {
        const newValue = seriesValue - 10; // Decrement series value by 10
        setSeriesValue(newValue);
        setSeries([newValue]);
    };

    const options = {
        chart: {
            height: "100%",
            type: "radialBar",
            offsetY: -20
        },
        colors: [function ({ value, seriesIndex, w }) {
            if (value < 10) {
                return 'rgb(11,199,255)'
            } else if (value < 20) {
                return 'rgb(21,195,255)'

            } else if (value < 30) {
                return 'rgb(49,181,255)'

            } else if (value < 40) {
                return 'rgb(76,171,255)'

            } else if (value < 50) {
                return 'rgb(94,165,255)'

            } else if (value < 60) {
                return 'rgb(120,159,255)'

            } else if (value < 70) {
                return 'rgb(141,160,245)'

            } else if (value < 80) {
                return 'rgb(177,171,207)'

            } else if (value < 90) {
                return 'rgb(202,180,174)'

            } else if (value < 100){
                return 'rgb(222,189,147)'
            }
            else if (value = 100){
                return 'rgb(252, 20, 20)'
            }
        }],
        fill: {
            type: 'gradient',
            opacity: 0.4,
            gradient: {
                shade: 'dark',
                type: "diagonal1",
                shadeIntensity: 0.5,
                // gradientToColors: ["rgb(245, 237, 10)","rgb(11,199,255)", "rgb(94,165,255)"], // optional, if not defined - uses the shades of same color in series
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 100],
                colorStops: []
              }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                    size: "40%",
                    background: "transparent",
                },
                dataLabels: {
                    name: {
                        fontSize: "22px",
                        color: "red",
                    },
                    value: {
                        fontSize: "20px",
                        color: "white", // Specify the color of the chart bars
                        formatter: function (val) {
                            return val + '%'
                          }
                    },
                    total: {
                        show: false,
                        label: "",
                        color: "green",
                        formatter: function (w) {
                            // Calculate the sum of the series values
                            const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            return sum;
                        },
                    },
                },
            },
        },
        labels: [""],
    };

    return (
<div style={{ height: 'calc(100% - 50px)', 
// border: '1px solid red', 
overflow: 'hidden' }}>
    <Chart options={options} series={series} type="radialBar" height="170%"  />
</div>





    );
};

export default RadialBarChart;
