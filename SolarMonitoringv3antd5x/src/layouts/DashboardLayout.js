import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Outlet } from 'react-router-dom';
import MyBreadcrumb from '../components/Breadcrumb';

export default function DashboardLayout({ children }) {
  const [toggled, setToggled] = useState(true);
  const handleToggleSidebar = (value) => {
    setToggled(!toggled);
    setCollapsed(!collapsed);
  };
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <Topbar handleToggleSidebar={handleToggleSidebar} />
      <div
        className='w-100 d-flex'
        style={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}
      >
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
        />
        <div className='w-100 h-100' style={{ overflow: 'auto' }}>        
          <Outlet />
        </div>
      </div>
      {/*<div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
      <div className='w-100'>
        <Topbar handleToggleSidebar={handleToggleSidebar} />
        <div style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>*/}
    </div>
  );
}
