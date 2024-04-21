import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Outlet } from 'react-router-dom';
import MyBreadcrumb from '../components/Breadcrumb';
import AuthContext from '../context/AuthContext';
import { useToggled, ToggledProvider } from '../context/ToggledContext'; // assuming you've created this context


export default function DashboardLayout({ children }) {

  const { toggled, setToggled } = useToggled(); // Using useContext to get toggled state
  const [userRole, setUserRole] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Set userRole based on user.is_staff when user changes
    if (user && user.is_staff === true) {
      setUserRole('admin');
    }
  }, [user]);

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
          userRole={userRole}
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
