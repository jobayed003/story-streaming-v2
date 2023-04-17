import {
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
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
  InputGroup,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import { FaArrowLeft, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../components/Icons/StorySaloon_Logo.svg';
import AuthProvider from '../context/AuthContext';
import './Settings.css';
import Header from './UI/Header';
import Footer from './util/Footer';

const Settings = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, userCredentials } = useContext(AuthProvider);
  const navigate = useNavigate();

  const handleShow = () => setShow(true);

  if (!isAuthenticated) {
    navigate('/');
    return (
      <Row className='mb-5 mt-5 justify-content-center'>
        <Spinner animation='border' role='status' style={{ width: '50px', height: '50px' }}>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </Row>
    );
  }

  return (
    <>
      <ResetPass show={show} setShow={setShow} userDetails={userCredentials} />
      {/* nav-start */}
      <Header />
      {/* nav-end */}

      {/* main-section-start */}
      <Container
        as='section'
        className='mainsection'
        style={{ marginBlock: '5rem', marginTop: '6rem' }}
      >
        {/* <Row>
          <Col className='brdr customText'>
            <h1>Account</h1>
          </Col>
        </Row> */}

        <Row className='brdr py-3'>
          <Col xs={4} className='py-3'>
            <h2>MEMBERSHIP </h2>
            {/* & BILLING */}
          </Col>
          <Col className='py-3 d-flex justify-content-between'>
            <div>
              <p className='text-content'>Email: {userCredentials.email}</p>
              <p className='text-content'>Password: ********</p>
            </div>

            {/* <Button variant='link' className='link-item mb-2'>
              Change email
            </Button> */}
            <Button variant='link' className='link-item mb-2' onClick={handleShow}>
              Change password
            </Button>
            {/* <Button variant='link' className='link-item mb-2'>
              Add phone number
            </Button> */}
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

export default Settings;

const ResetPass = ({ show, setShow, userDetails }) => {
  const [passwords, setPasswords] = useState({ newpass: '', confirmpass: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleClose = () => setShow(false);

  // const { newPass: oldPassword, newpass: newPassword } = passwords;

  const handleChange = ({ target }) => {
    const targetId = target.id.replace('floating', '').toLowerCase();
    setPasswords((prevstate) => ({
      ...prevstate,
      [targetId]: target.value,
    }));
  };

  const changePassword = () => {
    if (passwords.newpass !== passwords.confirmpass) {
      toast.error('Password doesnt match');
      return;
    }
    // sendPasswordResetEmail(auth, userDetails.email)
    //   .then(() => {
    //     // Password reset email sent!
    //     // ..
    //   })
    //   .catch((error) => {
    //     toast.error();
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   });

    // reauthenticateWithCredential(user, oldPassword)
    //   .then(() => {
    setIsLoading(true);
    updatePassword(user, passwords.newpass)
      .then(async () => {
        setIsLoading(false);
        handleClose();
        toast.success('Password changed successfully!');
      })
      .catch((error) => {
        toast.error('An error ocurred! Try again');
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);

        // ...
      });

    // })
    // .catch((error) => {
    //   // An error ocurred
    //   // ...
    // });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby='contained-modal-title-vcenter'
      centered
      className='custom-modal'
    >
      <Modal.Header closeButton className='border-0'>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-4' controlId='formGroupPassword'>
            <InputGroup>
              <FloatingLabel controlId='floatingNewPass' label='New Password'>
                <Form.Control
                  type={isClicked ? 'text' : 'password'}
                  placeholder='New Password'
                  controlId='password'
                  onChange={handleChange}
                />
              </FloatingLabel>
              <InputGroup.Text
                className={passwords.newpass === '' ? 'pe-none' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsClicked(!isClicked)}
              >
                <FaEye />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId='formGroupPassword'>
            <InputGroup>
              <FloatingLabel controlId='floatingConfirmPass' label='Confirm Password'>
                <Form.Control
                  type={isClicked ? 'text' : 'password'}
                  placeholder='Confirm Password'
                  controlId='password'
                  onChange={handleChange}
                />
              </FloatingLabel>
              <InputGroup.Text
                className={passwords.confirmpass === '' ? 'pe-none' : 'pe-auto'}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsClicked(!isClicked)}
              >
                <FaEye />
              </InputGroup.Text>
            </InputGroup>
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
              // background: '#',
              border: 'none',
              height: '2.5rem',
            }}
            variant='success'
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
  );
};

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
