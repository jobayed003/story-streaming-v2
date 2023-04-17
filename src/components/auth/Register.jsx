import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthProvider from '../../context/AuthContext';

import { db } from '../../firebase.config';

const Register = ({ show, setShow }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setShow(false);

  const { authenticateUser, setAuthStep } = useContext(AuthProvider);

  const [userCred, setUserCred] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

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
      authenticateUser();
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
      authenticateUser();
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
              />
            </Form.Group>
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
