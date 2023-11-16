import React from 'react';
import { ConfigProvider, Button, Space, Input, Divider } from 'antd';

const App = () => (
  <>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#0003b9',
            algorithm: true, // Enable algorithm
          },
          Input: {
            colorPrimary: '#eb2f96',
            algorithm: true, // Enable algorithm
          }
        },
      }}
    >
      <Space>
        <div style={{ fontSize: 14 }}>Enable algorithm: </div>
        <Input placeholder="Please Input" />
        <Button type="primary">Submit</Button>
      </Space>
    </ConfigProvider>
    <Divider />
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#1fb900',
          },
          Input: {
            colorPrimary: '#eb2f96',
          }
        },
      }}
    >
      <Space>
        <div style={{ fontSize: 14 }}>Disable algorithm: </div>
        <Input placeholder="Please Input" />
        <Button type="primary">Submit</Button>
      </Space>
    </ConfigProvider>
  </>
);

export default App;