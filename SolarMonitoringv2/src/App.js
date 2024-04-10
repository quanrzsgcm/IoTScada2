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
import PmForm from './components/PMForm';
import HomePage from './pages/HomePage'
import Header from './components/Header'
import { AuthProvider } from './context/AuthContext'


function App() {
  const windowHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--window-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', windowHeight);
  windowHeight();
  // return (
  //   <BrowserRouter>
  //     <AuthProvider>
  //       <Routes>
  //         <Route path="/" element={
  //           <PrivateRoute>
  //             <HomePage />
  //           </PrivateRoute>} />
  //         <Route element={<DashboardLayout />}>
  //           <Route path='/site-monitor/siteview' element={<PrivateRoute><SiteView /></PrivateRoute>} />
  //           <Route path='/site-monitor/sitekpi' element={<PrivateRoute><SiteKPI /></PrivateRoute>} />
  //           <Route path='/site-monitor/addnewdevice' element={<PrivateRoute><PmForm /></PrivateRoute>} />
  //           <Route path='/site-monitor/devicelist' element={<PrivateRoute><DeviceList /></PrivateRoute>} />
  //         </Route>
  //         <Route path="/login" element={<SignIn />} />
  //       </Routes>
  //     </AuthProvider>
  //   </BrowserRouter>
  // );
return (
  <BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<DashboardLayout />}>
        <Route path='/site-monitor/siteview' element={<SiteView />} />
        <Route path='/site-monitor/sitekpi' element={<SiteKPI />} />
        <Route path='/site-monitor/addnewdevice' element={<PmForm />} />
        <Route path='/site-monitor/devicelist' element={<DeviceList />} />
      </Route>
      <Route path="/login" element={<SignIn />} />
    </Routes>
  </AuthProvider>
</BrowserRouter>

)



}

export default App;
