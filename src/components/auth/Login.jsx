import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useContext, useState } from 'react';
import { Button, Col, Form, Modal, Spinner } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthProvider from '../../context/AuthContext';

const Login = ({ show, setShow }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setShow(false);

  const { authenticateUser, setAuthStep } = useContext(AuthProvider);
  const navigate = useNavigate();

  const [userCred, setUserCred] = useState({ email: '', password: '' });

  const handleChange = ({ target }) => {
    const targetId = target.id.replace('formGroup', '').toLowerCase();

    setUserCred((prevstate) => ({
      ...prevstate,
      [targetId]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        userCred.email,
        userCred.password
      );

      if (userCredential.user) {
        authenticateUser();
        navigate('/dashboard');
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(
        'Authentication failed. Please make sure you have entered your login details correctly.'
      );
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        {/* <Modal.Header closeButton><Modal.Title>Register Now</Modal.Title></Modal.Header> */}
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='formGroupEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email'
                controlId='email'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formGroupPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                controlId='password'
                onChange={handleChange}
              />
            </Form.Group>

            <div className='d-flex flex-column justify-content-between align-items-center'>
              <Button
                type='submit'
                style={{
                  background: '#dc3545',
                  border: 'none',
                  height: '2.5rem',
                }}
              >
                {isLoading ? (
                  <Spinner animation='border' style={{ width: '1.3rem', height: '1.3rem' }} />
                ) : (
                  'Login'
                )}
              </Button>

              <p style={{ marginTop: '1rem', color: '#000' }}>
                Don't have an account?{'  '}
                <NavLink
                  to='/'
                  onClick={() => setAuthStep('register')}
                  style={{ color: '#000', textDecoration: 'underline' }}
                >
                  Sign up
                </NavLink>
              </p>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
