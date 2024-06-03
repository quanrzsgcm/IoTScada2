import React from 'react';
import { Button, ConfigProvider } from 'antd';

const DeleteButton = ({ enableDelete, onClick }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: 'transparent',
            defaultBorderColor: '#fa2f2f',
            borderRadius: '0px',
            defaultHoverBg: 'transparent',
            colorText: '#fa2f2f',
            defaultHoverBorderColor: '#fa2f2f',
            defaultHoverColor: 'rgb(250, 7, 7)'
          },
        },
      }}
    >
      <Button onClick={()=>onClick(enableDelete)}>
        {enableDelete ? 'Delete' : 'Delete Mode'}
      </Button>
    </ConfigProvider>
  );
};

export default DeleteButton;
