import React from 'react';
import { Container } from 'react-bootstrap';
import '../assets/styles/MainviewLayout.scss';
import MyBreadcrumb from '../components/Breadcrumb';

export default function MainviewLayout({ children }) {
  return (
    <Container fluid className='mainview-layout'>
      <MyBreadcrumb />
      {children}
    </Container>
  );
}
