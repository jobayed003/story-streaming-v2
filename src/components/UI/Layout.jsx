import React from 'react';
import { Container } from 'react-bootstrap';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Container as='main' style={{ overflow: 'hidden' }}>
      <Header />
      {children}
      <Footer />
    </Container>
  );
};

export default Layout;
