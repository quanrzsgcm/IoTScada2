import React from 'react';
import Chart from 'react-apexcharts';

const MyChart2e = ({ rawData }) => {
    if (rawData === null) {
        return <div>No data</div>;
    }
    // Transform the data for the chart
    const transformedData = {
        options: {
            tooltip: {
                enabled: true,
                theme: 'dark',
                x: {
                    show: true,
                    format: 'HH:mm',
                    formatter: undefined,
                },
            },
            // tooltip: {
            //     enabled: true,
            //     enabledOnSeries: undefined,
            //     shared: true,
            //     followCursor: false,
            //     intersect: false,
            //     inverseOrder: false,
            //     custom: undefined,
            //     fillSeriesColor: false,
            //     theme: false,
            //     style: {
            //       fontSize: '12px',
            //       fontFamily: undefined
            //     },
            //     onDatasetHover: {
            //         highlightDataSeries: false,
            //     },
            //     x: {
            //         show: true,
            //         format: 'dd MMM',
            //         formatter: undefined,
            //     },
            //     y: {
            //         formatter: undefined,
            //         title: {
            //             formatter: (seriesName) => seriesName,
            //         },
            //     },
            //     z: {
            //         formatter: undefined,
            //         title: 'Size: '
            //     },
            //     marker: {
            //         show: true,
            //     },
            //     items: {
            //        display: 'flex',
            //     },
            //     fixed: {
            //         enabled: false,
            //         position: 'topRight',
            //         offsetX: 0,
            //         offsetY: 0,
            //     },
            // },
            chart: {
                id: 'bar-chart',
            },
            colors: ['#eba134', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            legend: {
                show: true,
                position: 'top',
                showForSingleSeries: true,
                labels: {
                    colors: '#fff',
                    useSeriesColors: false
                },
            },
            markers: {
                size: 0,
                colors: undefined,
                strokeColors: '#fff',
                strokeWidth: 2,
                strokeOpacity: 0.9,
                strokeDashArray: 0,
                fillOpacity: 1,
                discrete: [],
                shape: "circle",
                radius: 2,
                offsetX: 0,
                offsetY: 0,
                onClick: undefined,
                onDblClick: undefined,
                showNullDataPoints: true,
                hover: {
                    size: 1,
                    sizeOffset: 3
                }
            },

            stroke: {
                curve: 'straight',
                width: 1,
            },
            xaxis: {
                type: "datetime",
                labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: false,
                    hideOverlappingLabels: false,
                    showDuplicates: true,
                    trim: false,
                    minHeight: undefined,
                    maxHeight: 120,
                    style: {
                        colors: [],
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                    offsetX: 0,
                    offsetY: 0,
                    format: undefined,
                    formatter: undefined,
                    datetimeUTC: false,
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: "MMM 'yy",
                        day: 'dd MMM',
                        hour: 'HH:mm',
                    },
                },
            }
        },
        series: [
            {
                name: "Energy",
                // data: [
                //     { x: '2023-12-01T00:00:00+07:00', y: '75.00' },
                //     { x: '2023-12-01T00:15:00+07:00', y: '75.00' },
                //     { x: '2023-12-01T00:30:00+07:00', y: '67.00' },
                //     { x: '2023-12-01T00:45:00+07:00', y: '5.00' },
                //     { x: '2023-12-01T01:00:00+07:00', y: '10.00' },
                //     { x: '2023-12-01T01:15:00+07:00', y: '15.00' },
                // ],
                data: rawData.map(item => ({
                    x: item.endOfDay,
                    y: parseFloat(item['energy_measured'])  // Assuming 'power' is a string, convert it to a floating-point number
                  })),
                

            }
        ],
    };

    return (
        <div>
            <Chart
                options={transformedData.options}
                series={transformedData.series}
                type="bar"
                width="1000"
            />

        </div>
    );
};

export default MyChart2e;
