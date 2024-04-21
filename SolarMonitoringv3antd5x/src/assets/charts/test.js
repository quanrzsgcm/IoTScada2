import React from 'react';
import Chart from 'react-apexcharts';

const ChartComponent = ({ seriesData }) => {
  const options = {
    chart: {
      toolbar: {
        show: true,
        offsetX: 0,
        // Add other toolbar options as needed
      },
    },
    // Add other chart options as needed
  };

  return (
    <div>
      <Chart options={options} series={seriesData} type="line" height={350} />
    </div>
  );
};

const App3 = () => {
  const series = [{ data: [10, 20, 30, 40, 50, 60, 70] }];
  
  return <ChartComponent seriesData={series} />;
};

export default App3;
