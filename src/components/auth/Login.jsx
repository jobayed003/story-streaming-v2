import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useContext, useState } from 'react';
import { Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthProvider from '../../context/AuthContext';

const Login = ({ show, setShow }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCred, setUserCred] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const { setAuthStep } = useContext(AuthProvider);

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

      await signInWithEmailAndPassword(auth, userCred.email, userCred.password);

      navigate('/dashboard');
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
        <Modal.Body
          style={{
            background: 'var(--form-bg)',
            borderRadius: '5px',
          }}
        >
          <h1 className='text-center form-label'>Sign In</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='formGroupEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email'
                controlId='email'
                onChange={handleChange}
                className='boxShadow'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formGroupPassword'>
              <Form.Label>Password</Form.Label>
              <InputGroup className={'inputBg'}>
                <Form.Control
                  type={isClicked ? 'text' : 'password'}
                  placeholder='Password'
                  controlId='password'
                  onChange={handleChange}
                  className='boxShadow'
                />
                <InputGroup.Text
                  className={'inputBg'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsClicked(!isClicked)}
                >
                  <FaEye />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <div className='d-flex flex-column justify-content-between align-items-center'>
              <Button
                type='submit'
                style={{
                  background: 'var(--button-color)',
                  border: 'none',
                  height: '2.5rem',
                }}
                disabled={userCred.email === '' || userCred.password === '' ? true : isLoading}
              >
                {isLoading ? (
                  <div className='d-flex align-items-center'>
                    <div>Signing In</div>
                    <Spinner animation='border' style={{ width: '1.3rem', height: '1.3rem' }} />
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              <p style={{ marginTop: '1rem', color: '#f2e6d2' }}>
                Don't have an account?{'  '}
                <NavLink
                  to='/'
                  onClick={() => setAuthStep('register')}
                  style={{ color: 'var(--button-color)', textDecoration: 'none' }}
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
