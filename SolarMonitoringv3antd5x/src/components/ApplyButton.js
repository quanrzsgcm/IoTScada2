import React from 'react';
import { Button, ConfigProvider } from 'antd';

const ApplyButton = ({ onClick }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: '#009bc4',
            defaultBorderColor: '#009bc4',
            borderRadius: '0px',
            defaultHoverBg: '#009bc4',
            colorText: 'white',
            defaultHoverBorderColor: '#009bc4',
            defaultHoverColor: 'white'
          },
        },
      }}
    >
      <Button onClick={onClick}>Apply</Button>
    </ConfigProvider>
  );
};

export default ApplyButton;
