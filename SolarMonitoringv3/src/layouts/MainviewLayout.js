import React from 'react';
import { Container } from 'react-bootstrap';
import '../assets/styles/MainviewLayout.scss';
export default function MainviewLayout({ children }) {
  return (
    <Container fluid className='mainview-layout'>
      {children}
    </Container>
  );
}
