import React from 'react';
import { Col, Container, NavLink, Row } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className='footersection'>
      <Container className='pdy' id='footer'>
        <Row>
          <Col className='mb-5'>
            <NavLink href='#' className='footer-header'>
              Questions? Contact us.
            </NavLink>
          </Col>
        </Row>
        <Row>
          <Col>
            <NavLink href='#' className='footer-link mb-3'>
              Investor Relations
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Privacy
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Speed Test
            </NavLink>
          </Col>
          <Col>
            <NavLink href='#' className='footer-link mb-3'>
              Account
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Ways to Watch
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Corporate Information
            </NavLink>
          </Col>
          <Col>
            <NavLink href='#' className='footer-link mb-3'>
              Help Center
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Ways to Watch
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Only on StorySaloon
            </NavLink>
          </Col>
          <Col>
            <NavLink href='#' className='footer-link mb-3'>
              Media Center
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Terms of Use
            </NavLink>
            <NavLink href='#' className='footer-link mb-3'>
              Help Center
            </NavLink>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
