import React from 'react';
import Chart from 'react-apexcharts';

const MyChart = ({ data }) => {
    if (data === null) {
        return <div>No data</div>;
    }
    // Transform the data for the chart
    const transformedData = {
        options: {
            tooltip: {
                enabled: true,
                theme: 'dark',
            },
           
            chart: {
                id: 'line-chart',
            },
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
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
                categories: data.map((item) =>
                    new Date(item.timestamp).toLocaleTimeString()
                ),
                labels: {
                    format: 'dd',
                }
            },
        },
        series: [
            {
                name: 'power',
                data: data.map((item) => parseFloat(item.power)),
            },
        ],
    };

    return (
        <div>
            <Chart
                options={transformedData.options}
                series={transformedData.series}
                type="line"
                width="1000"
            />
            
        </div>
    );
};

export default MyChart;
