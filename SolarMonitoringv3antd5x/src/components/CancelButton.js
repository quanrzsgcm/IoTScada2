import React from 'react';
import { Button, ConfigProvider } from 'antd';

const CancelButton = ({ onClick }) => {
  return (
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
      <Button onClick={onClick}>Reset</Button>
    </ConfigProvider>
  );
};

export default CancelButton;
