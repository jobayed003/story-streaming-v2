import { getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  FloatingLabel,
  Form,
  Image,
  Modal,
  Navbar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../components/Icons/StorySaloon_Logo.svg';
import AuthProvider from '../context/AuthContext';
import { db } from '../firebase.config';
import './Settings.css';
import Footer from './util/Footer';

const Settings = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthProvider);

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
  };

  if (!isAuthenticated) {
    navigate('/');
    return <Spinner></Spinner>;
  }

  return (
    <>
      <ResetPass show={show} setShow={setShow} />
      {/* nav-start */}

      <Navbar>
        <Container>
          <Navbar.Brand href='/'>
            <Image src={logo} alt='' style={{ width: '350px', height: '50px' }} />
          </Navbar.Brand>

          <Dropdown align='end'>
            <Dropdown.Toggle
              style={{
                background: 'none',
                border: 'none',
              }}
            >
              <img
                src='https://occ-0-58-64.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABZBe7K0DPia9LvzIkQ4yzqX9NocZlAjS1MOyEuBQD1WmFuLKZwvq0bxc4n4_EV73khqgwed0PYLNml0V8LCymt31e7x-8jQ.png?r=229'
                alt=''
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className={'dropLinks'} href='/profile'>
                Manage Profiles
              </Dropdown.Item>

              <Dropdown.Item className={'dropLinks'} href='/account'>
                Account
              </Dropdown.Item>

              <Dropdown.Item className={'dropLinks'} href='/help'>
                Help Center
              </Dropdown.Item>

              <Dropdown.Item className={'dropLinks'} href='/dashboard'>
                Dashboard
              </Dropdown.Item>

              <Dropdown.Item href='/' className={'customItem dropLinks'} onClick={handleLogout}>
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
      {/* nav-end */}
      {/* main-section-start */}
      <Container as='section' className='mainsection mt-4' style={{ marginBottom: '5rem' }}>
        <Row>
          <Col className='mb-4' onClick={() => navigate('/dashboard')}>
            <Button
              style={{
                fontFamily: 'Roboto',
                fontSize: '2rem',
                color: '#898989',
                background: 'none',
                paddingLeft: '0',
                border: 'none',
              }}
            >
              <FaArrowLeft fontSize={'1.5rem'} color='#898989' /> Back
            </Button>
          </Col>
        </Row>
        {/* <Row>
          <Col className='brdr customText'>
            <h1>Account</h1>
          </Col>
        </Row> */}

        <Row className='brdr py-3'>
          <Col xs={4} className='py-3'>
            <h2>MEMBERSHIP & BILLING</h2>
          </Col>
          <Col xs={5} className='py-3'>
            <p className='text-content'>Email: ********</p>
            <p className='text-content'>Password: ********</p>
          </Col>
          <Col>
            <Button variant='link' className='link-item mb-2'>
              Change email
            </Button>
            <Button variant='link' className='link-item mb-2' onClick={handleShow}>
              Change password
            </Button>
            <Button variant='link' className='link-item mb-2'>
              Add phone number
            </Button>
          </Col>
        </Row>

        <Row>
          <Col className='py-4' xs={4}>
            <h2>SETTINGS</h2>
          </Col>
          <Col xs={5} className='d-flex flex-column align-items-start py-3'>
            <Button variant='link' className='mb-2 p-0'>
              Marketing communications
            </Button>
            <Button variant='link' className='mb-2 p-0'>
              Download your personal information
            </Button>
          </Col>
        </Row>
      </Container>
      {/* main-secction-end */}
      {/* footer-start */}
      <Footer />
    </>
  );
};

const ResetPass = ({ show, setShow }) => {
  const [passwords, setPasswords] = useState({ oldpass: '', newpass: '' });
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleClose = () => setShow(false);

  const { oldpass: oldPassword, newpass: newPassword } = passwords;

  const handleChange = ({ target }) => {
    const targetId = target.id.replace('floating', '').toLowerCase();
    setPasswords((prevstate) => ({
      ...prevstate,
      [targetId]: target.value,
    }));
  };

  const changePassword = () => {
    // reauthenticateWithCredential(user, oldPassword)
    //   .then(() => {
    setIsLoading(true);
    updatePassword(user, newPassword)
      .then(async () => {
        setIsLoading(false);
        handleClose();
        toast.success('Password changed successfully!');
      })
      .catch((error) => {
        toast.error('An error ocurred! Try again');
        setIsLoading(true);

        // ...
      });

    // })
    // .catch((error) => {
    //   // An error ocurred
    //   // ...
    // });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton className='border-0'>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='formGroupPassword'>
              <FloatingLabel controlId='floatingOldPass' label='Old Password' className='mb-3'>
                <Form.Control
                  type='password'
                  placeholder='Old Password'
                  controlId='password'
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formGroupPassword'>
              <FloatingLabel controlId='floatingNewPass' label='New Password' className='mb-3'>
                <Form.Control
                  type='password'
                  placeholder='New Password'
                  controlId='password'
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className='border-0 justify-content-center'>
          {/* <Button variant='danger' onClick={changePassword}>
            Save Changes`
          </Button> */}

          <div className='d-flex flex-column justify-content-between align-items-center'>
            <Button
              style={{
                background: '#dc3545',
                border: 'none',
                height: '2.5rem',
              }}
              variant='danger'
              onClick={changePassword}
            >
              {isLoading ? (
                <Spinner animation='border' style={{ width: '1.3rem', height: '1.3rem' }} />
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Settings;

/* <div className='right'>
  <div className='dropdown'>
    <button
      className='btn dropdown-toggle'
      type='button'
      data-bs-toggle='dropdown'
      aria-expanded='false'
    >
      <img
        src='https://occ-0-58-64.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABZBe7K0DPia9LvzIkQ4yzqX9NocZlAjS1MOyEuBQD1WmFuLKZwvq0bxc4n4_EV73khqgwed0PYLNml0V8LCymt31e7x-8jQ.png?r=229'
        alt=''
      />
    </button>
    <ul className='dropdown-menu'>
      <li>
        <a className='dropdown-item' href='#'>
          Manage Profiles
        </a>
      </li>
      <li>
        <a className='dropdown-item' href='#'>
          Account
        </a>
      </li>
      <li className='mb-3'>
        <a className='dropdown-item' href='#'>
          Help Center
        </a>
      </li>
      <li className='custom-item'>
        <a className='dropdown-item' href='#'>
          Sign Out
        </a>
      </li>
    </ul>
  </div>
</div>;
 */
