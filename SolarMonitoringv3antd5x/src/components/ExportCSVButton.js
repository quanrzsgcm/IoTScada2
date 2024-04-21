import React from 'react';
import { Button, ConfigProvider } from 'antd';
import { CSVLink } from 'react-csv';

const ExportCSVButton = ({ data }) => {
  const headers = [
    // Define headers for your CSV file
    { label: 'Name', key: 'name' },
    { label: 'Label', key: 'label' },
    { label: 'Stage', key: 'stage' },
    { label: 'Stage Start On', key: 'stage_start_on' },
    { label: 'Stage Duration', key: 'stage_duration' },
    { label: 'Meter-read Total Energy', key: 'meter_read_total_energy' },
    { label: 'Active Power', key: 'active_power' },
    { label: 'Input Power', key: 'input_power' },
    { label: 'Efficiency', key: 'efficiency' },
    { label: 'Grid Freq.', key: 'grid_freq' },
    { label: 'Production Today', key: 'production_today' },
    { label: 'Yield Today', key: 'yield_today' },
    // Add more headers as needed
  ];


  return (
    <CSVLink data={data} headers={headers} filename={'data.csv'}>
        <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: 'transparent',
            defaultBorderColor: '#009bc4',
            borderRadius: '0px',
            defaultHoverBg: 'transparent',
            colorText: '#009bc4',
            defaultHoverBorderColor: '#009bc4',
            defaultHoverColor: 'rgb(0,204,255)'
          },

        },
      }}  >

      <Button>Export</Button>
      </ConfigProvider>
    </CSVLink>
  );
};

export default ExportCSVButton;
