import { Breadcrumb } from 'antd';
import React from 'react';

const MyBreadcrumb = () => {
  const breadcrumbItemStyle = {
    color: 'white', // Set the text color to white
  };

  return (
    <Breadcrumb>
      <Breadcrumb.Item style={breadcrumbItemStyle}>TotalEnergies</Breadcrumb.Item>
      <Breadcrumb.Item style={breadcrumbItemStyle}>
        <a href="">Application Center</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item style={breadcrumbItemStyle}>
        <a href="">Application List</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item style={breadcrumbItemStyle}>An Application</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default MyBreadcrumb;
