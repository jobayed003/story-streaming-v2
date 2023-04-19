import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';

import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthProvider from '../../context/AuthContext';

import { FaEye } from 'react-icons/fa';
import { db } from '../../firebase.config';

const Register = ({ show, setShow }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [userCred, setUserCred] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const { authenticateUser, setAuthStep } = useContext(AuthProvider);

  const handleChange = ({ target }) => {
    const targetId = target.id.replace('formGroup', '').toLowerCase();

    setUserCred((prevstate) => ({
      ...prevstate,
      [targetId]: target.value,
    }));
  };
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate('/dashboard');
    }
  });

  const { name, email, password } = userCred;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const userCopy = { ...userCred, role: 'user' };
      delete userCopy.password;

      userCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), userCopy);

      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      toast.error('Sign up failed. Please try again!');
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        {/* <Modal.Header closeButton><Modal.Title>Register Now</Modal.Title></Modal.Header> */}
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='formGroupName'>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type='text'
                autoFocus
                placeholder='Enter your name'
                controlId='name'
                onChange={handleChange}
                className='boxShadow'
              />
            </Form.Group>
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
              <InputGroup>
                <Form.Control
                  type={isClicked ? 'text' : 'password'}
                  placeholder='Password'
                  controlId='password'
                  onChange={handleChange}
                  className='boxShadow'
                />
                <InputGroup.Text
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
                variant='success'
                style={{
                  // background: '#',
                  border: 'none',
                  height: '2.5rem',
                }}
                disabled={
                  userCred.name === '' || userCred.email === '' || userCred.password === ''
                    ? true
                    : isLoading
                }
              >
                {isLoading ? (
                  <div className='d-flex align-items-center'>
                    <div>Loading...</div>
                    <Spinner animation='border' style={{ width: '1.3rem', height: '1.3rem' }} />
                  </div>
                ) : (
                  'Continue'
                )}
              </Button>

              <p style={{ marginTop: '1rem', color: '#000' }}>
                Already have an account?{' '}
                <NavLink
                  to='/'
                  onClick={() => setAuthStep('login')}
                  style={{ color: '#000', textDecoration: 'underline' }}
                >
                  Login
                </NavLink>
              </p>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Register;
