import React, { useState, useEffect } from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import {
  FaTachometerAlt,
  FaGem,
  FaList,
  FaGithub,
  FaRegLaughWink,
  FaHeart,
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import '../assets/styles/Sidebar.scss';


const Sidebar = ({ image, collapsed, rtl, toggled, handleToggleSidebar, userRole }) => {
  const [sidebarData, setSidebarData] = useState([
    // {
    //   title: 'Central Monitor',
    //   icon: <FaGem />,
    //   subNav: [
    //     {
    //       title: 'Fleetview',
    //       path: `/central-monitor/fleetview`,
    //     },
    //     {
    //       title: 'Site List',
    //       path: '/central-monitor/sitelist',
    //     },
    //     {
    //       title: 'Leaderboard',
    //       path: '/central-monitor/leaderboard',
    //     },
    //   ],
    // },
    {
      title: 'Site Monitor',
      icon: <FaGem />,
      subNav: [
        {
          title: 'Site View',
          path: `/site-monitor/siteview`,
        },
        {
          title: 'Site KPI',
          path: `/site-monitor/sitekpi`,
        },
        {
          title: 'Device List',
          path: `/site-monitor/devicelist`,
        },
      ],
    },
  ]);


  useEffect(() => {
    if (userRole === 'admin') {
      setSidebarData(prevData => [
        ...prevData,
        {
          title: 'Admin Panel',
          icon: <FaGem />,
          subNav: [
            {
              title: 'Manage Users',
              path: `/admin/manage-users`,
            },
            {
              title: 'Manage Devices',
              path: `/admin/manage-devices`,
            },
            {
              title: 'Settings',
              path: `/admin/settings`,
            },
          ],
        }
      ]);
    }
  }, [userRole]);


  const path = useLocation();
  return (
    <ProSidebar
      image={image}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint='md'
      onToggle={handleToggleSidebar}
      className='sidebar'
    >
      <SidebarContent>
        <Menu iconShape='circle'>
          {sidebarData.map((item, index) => {
            return (
              <SubMenu title={item.title} key={index} icon={item.icon}>
                {item.subNav.map((subItem, subIndex) => {
                  return (
                    <MenuItem
                      key={subIndex}
                      active={path?.pathname === subItem.path}
                    >
                      <NavLink to={subItem.path}>{subItem.title}</NavLink>
                    </MenuItem>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
