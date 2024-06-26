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

  const { setAuthStep } = useContext(AuthProvider);

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

      const userCopy = {
        ...userCred,
        role: 'user',
        avatarDetails: {
          id: 1,
          avatar:
            'https://firebasestorage.googleapis.com/v0/b/story-streaming-84a2e.appspot.com/o/avatar%2Favatar_1.png?alt=media&token=bc42b4b5-3712-4d97-a41a-fb7c53340a32',
        },
      };
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
        // backdrop='static'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        {/* <Modal.Header closeButton><Modal.Title>Register Now</Modal.Title></Modal.Header> */}
        <Modal.Body
          className='rounded'
          style={{
            background: 'var(--form-bg)',
          }}
        >
          <h1 className='text-center form-label'>Sign Up</h1>
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
              <InputGroup className={'inputBg'}>
                <Form.Control
                  type={isClicked ? 'text' : 'password'}
                  placeholder='Password'
                  controlId='password'
                  onChange={handleChange}
                  className='boxShadow'
                />
                <InputGroup.Text
                  style={{ cursor: 'pointer' }}
                  className={'inputBg'}
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
                disabled={
                  userCred.name === '' || userCred.email === '' || userCred.password === ''
                    ? true
                    : isLoading
                }
              >
                {isLoading ? (
                  <div className='d-flex align-items-center'>
                    <div>Signing Up </div>
                    <Spinner animation='border' style={{ width: '1.3rem', height: '1.3rem' }} />
                  </div>
                ) : (
                  'Sign Up'
                )}
              </Button>

              <p style={{ marginTop: '1rem', color: '#f2e6d2' }}>
                Already have an account?{' '}
                <NavLink
                  to='/'
                  onClick={() => setAuthStep('login')}
                  style={{ color: 'var(--button-color)', textDecoration: 'none' }}
                >
                  Sign In
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
