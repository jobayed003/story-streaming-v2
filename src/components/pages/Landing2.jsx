import React, { useState } from 'react';
import { Button, Col, Container, Form, Image, InputGroup, Row } from 'react-bootstrap';
import { FaRegEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Icons/StorySaloon_Logo.svg';
import classes from './Landing2.module.css';

const Landing2 = () => {
  const [email, setEmail] = useState('');

  const [isValidated, setIsValidated] = useState();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.includes('@')) {
      navigate('/test');
    }
  };

  return (
    <Container as='section' fluid className={classes.bgContainer}>
      <div
        style={{
          position: 'absolute',
          background: 'rgba(0,0,0,0.6)',
          width: '100%',
          height: '100%',
        }}
      />
      <Row className={classes.formContainer}>
        <Col style={{ maxWidth: '600px' }} className=' d-flex flex-column align-items-center'>
          <Image src={logo} alt='Logo' className={classes.logo} />
          <Form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--gray-color)',
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '5px',
              marginInline: '2rem',
            }}
          >
            <h1 className={classes.formTitle}>Premium Account Generator</h1>
            <Form.Label className={classes.formLabel}>Enter your email address</Form.Label>
            <Form.Group className='mb-3' controlId='formBasicEmail' style={{ background: '#fff' }}>
              <InputGroup className={`mb-3 ${classes.inputBg}`}>
                <InputGroup.Text className={classes.inputBg}>
                  <FaRegEnvelope fontSize={'1.5rem'} color='#929292' />
                </InputGroup.Text>
                <Form.Control
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  required
                  placeholder='Your Email...'
                  aria-label='Email'
                  aria-describedby='input-left-icon'
                />
              </InputGroup>
            </Form.Group>
            <Button
              type='submit'
              style={{ background: 'var(--button-color)', border: 'none' }}
              className='w-75'
              onClick={handleSubmit}
            >
              Get Premium
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing2;
