import 'antd/dist/antd.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './utils/PublicRoute';
import PrivateRoute from './utils/PrivateRoute';
import SignIn from './pages/SignIn';
import DashboardLayout from './layouts/DashboardLayout';
import SiteView from './pages/SiteView';
import SiteKPI from './pages/SiteKPI';
import DeviceList from './pages/DL';
import TypeOfDeviceTab from './components/Tab';


function App() {
  const windowHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--window-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', windowHeight);
  windowHeight();
  return (
    <BrowserRouter>
      <Routes>
       {/* <Route path='/' element={<Navigate to='/sign-in' />} /> */}
        <Route path='/' element={<Navigate to='/site-monitor/siteview' />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route element={<DashboardLayout />}>
          <Route path='/site-monitor/siteview' element={<SiteView />} />
          <Route path='/site-monitor/sitekpi' element={<SiteKPI />} />
          <Route path='/site-monitor/dashboard' element={<DeviceList />} />
          <Route path='/site-monitor/devicelist' element={<DeviceList />} />
          
          {/* <Route path='/site-monitor/devicelist' element={<SiteKPI />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
