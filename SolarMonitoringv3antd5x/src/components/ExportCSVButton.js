import React from 'react';
import { Button, ConfigProvider } from 'antd';
import { CSVLink } from 'react-csv';

const ExportCSVButton = ({ data }) => {
  const headers = [
    // Define headers for your CSV file
    { label: 'Name', key: 'name' },
    { label: 'Label', key: 'labels' },
    { label: 'Stage', key: 'state' },
    { label: 'Stage Start On', key: 'stageStartOn' },
    { label: 'Stage Duration', key: 'duration' },
    { label: 'Meter-read Total Energy', key: 'meterReadTotalEnergy' },
    { label: 'Active Power', key: 'activePower' },
    { label: 'Input Power', key: 'inputPower' },
    { label: 'Efficiency', key: 'efficiency' },
    // { label: 'Grid Freq.', key: 'grid_freq' },
    { label: 'Production Today', key: 'productionToday' },
    { label: 'Yield Today', key: 'yieldToday' },

  ];

  // Render the export button only if data is available
  return (
    data && data.length > 0 ? (
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
          }}
        >
          <Button>Export</Button>
        </ConfigProvider>
      </CSVLink>
    ) : null
  );
};

export default ExportCSVButton;
