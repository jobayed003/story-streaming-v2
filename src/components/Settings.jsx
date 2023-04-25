import { getAuth, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { useContext, useState } from 'react';
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthProvider from '../context/AuthContext';
import StateContextProvider from '../context/StateContext';
import './Settings.css';
import Footer from './UI/Footer';
import Header from './UI/Header';
import useLoadingState from './hooks/useLoadingState';
import { updateUserDoc } from './util/updateUserDoc';

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Context Management
  const { isUpdated, setIsUpdated, userCredentials } = useContext(AuthProvider);
  const { selectedAvatar } = useContext(StateContextProvider);

  // Custom Hooks
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();

  const changeAvatar = async () => {
    setIsLoading(true);

    try {
      await updateUserDoc(userCredentials.uid, { avatarDetails: { ...selectedAvatar } });
      toast.dark('Avatar updated successfully!');
      setIsUpdated(!isUpdated);
      setIsLoading(false);
    } catch (err) {
      toast.error('Something went wrong! Try again');
    }
  };

  return (
    <>
      {!user && loadingState}

      {user && (
        <>
          <ResetPass
            showPasswordModal={showPasswordModal}
            setShowPasswordModal={setShowPasswordModal}
            userDetails={userCredentials}
          />

          {/* nav-start */}
          <Header />
          {/* nav-end */}

          {/* main-section-start */}
          <Container
            as='section'
            className='mainsection'
            style={{ marginBlock: '5rem', marginTop: '8rem' }}
          >
            <Row className='brdr py-3'>
              <Col xs='4' className='d-flex align-items-center py-2'>
                <h2>ACCOUNT</h2>
              </Col>
              <Col className='py-2 d-flex justify-content-between align-items-center'>
                <div>
                  <p className='text-content'>Email: {userCredentials.email}</p>
                  <p className='text-content'>Password: ********</p>
                </div>

                <div className='d-flex flex-column align-items-start'>
                  <Button
                    variant='link'
                    className='link-item mb-2'
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change password
                  </Button>
                </div>
              </Col>
            </Row>

            <Row>
              <Col
                className='d-flex align-items-center justify-content-between flex-wrap  py-4'
                xs
                lg='4'
              >
                <h2>SETTINGS</h2>

                <div>
                  <p className='text-content m-0'>Avatar: {userCredentials.avatarDetails.avatar}</p>
                </div>
              </Col>
              <Col className='avatar-container hide-scroll'>
                <ChangeAvatar />
              </Col>
              <Col xs={1} className='d-flex align-items-center p-0'>
                <div className='d-flex flex-column justify-content-between align-items-center me-5'>
                  <Button
                    style={{
                      border: 'none',
                      height: '2.5rem',
                    }}
                    variant='success'
                    onClick={changeAvatar}
                    disabled={
                      selectedAvatar.id === userCredentials.avatarDetails.id ? true : isLoading
                    }
                  >
                    {isLoading ? (
                      <div className='d-flex align-items-center'>
                        <div>Saving...</div>
                        <Spinner animation='border' style={{ width: '1.3rem', height: '1.3rem' }} />
                      </div>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
          {/* main-secction-end */}

          <Footer />
        </>
      )}
    </>
  );
};

export default Settings;

const ResetPass = ({ showPasswordModal, setShowPasswordModal, userDetails }) => {
  const [passwords, setPasswords] = useState({ newpass: '', confirmpass: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

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
    setIsLoading(true);
    updatePassword(user, passwords.newpass)
      .then(async () => {
        setIsLoading(false);
        setShowPasswordModal(false);
        toast.success('Password changed successfully!');
      })
      .catch((error) => {
        toast.error('An error ocurred! Try again');
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
      });
  };

  const sendResetMail = () => {
    const actionCodeSettings = {
      url: `${window.location.origin}/?email=` + userDetails.email,
      // When multiple custom dynamic link domains are defined, specify which
      // one to use.
      // dynamicLinkDomain: 'example.page.link',
    };

    sendPasswordResetEmail(auth, userDetails.email, actionCodeSettings)
      .then(() => {
        toast.success('Password reset email has been sent, please check your inbox');
      })
      .catch((error) => {
        toast.error();
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  };
  return (
    <Modal
      show={showPasswordModal}
      onHide={() => setShowPasswordModal(false)}
      aria-labelledby='contained-modal-title-vcenter '
      centered
      className='settings-text-color'
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
                  className='boxShadow'
                />
              </FloatingLabel>
              <InputGroup.Text
                className={passwords.newpass === '' ? 'pe-none' : 'cursor-pointer'}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsClicked(!isClicked)}
                required
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
                  style={{ boxShadow: 'none' }}
                  className='boxShadow'
                  required
                />
              </FloatingLabel>
              <InputGroup.Text
                className={passwords.confirmpass === '' ? 'pe-none' : 'cursor-pointer'}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsClicked(!isClicked)}
              >
                <FaEye />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Form>
        <Button
          style={{
            background: 'none',
            color: 'blue',
            textDecoration: 'underline',
            border: 'none',
            paddingLeft: '0',
            paddingTop: '1rem',
            height: '2.5rem',
          }}
          onClick={(e) => {
            sendResetMail();
            e.currentTarget.style.color = 'darkblue';
          }}
        >
          or get a password reset email
        </Button>
      </Modal.Body>
      <Modal.Footer className='border-0 justify-content-center'>
        <div className='d-flex flex-column justify-content-between align-items-center'>
          <Button
            style={{
              // background: '#',
              border: 'none',
              height: '2.5rem',
            }}
            type='submit'
            variant='success'
            onClick={changePassword}
            disabled={passwords.newpass === '' || passwords.confirmpass === '' ? true : isLoading}
          >
            {isLoading ? (
              <div className='d-flex align-items-center'>
                <div>Saving...</div>
                <Spinner animation='border' style={{ width: '1.3rem', height: '1.3rem' }} />
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const ChangeAvatar = () => {
  const avatarDetails = [];

  const avatars = [
    '🤠',
    '🙂',
    '😀',
    '😁',
    '😉',
    '😎',
    '👨',

    '👧',
    '👦',
    '👶',
    '👶',
    '👴',
    '🧓',
    '👧',
    '👵',
    '👩‍🦱',

    '🧑‍🦱',
    '🧑‍🦳',
    '👱‍♀️',
    '👩‍🦲',
    '👱‍♂️',
    '🧑‍🦲',
    '👱',
    '👸',
    '🫅',
    '🤴',
    '👳‍♂️',
    '🧔‍♀️',
    '👼',
    '👮‍♀️',
    '👩‍⚕️',
    '🧑‍🎓',
    '👩‍🏫',
    '🧑‍🍳',
    '👩‍🔧',
    '👩‍🔬',
    '🧑‍🔬',
    '👩‍💻',
    '👨‍💻',
    '👨‍🎤',
    '👩‍🚀',
    '🧑‍🚒',
    '🧕',
    '🏃‍♀️',
    '👍',
    '🫱🏽‍🫲🏽',
    '👩‍💻',
  ];
  avatars.map((el, idx) => avatarDetails.push({ id: idx + 1, avatar: el }));

  return (
    <div className='d-flex flex-wrap mt-3'>
      {avatarDetails.map((el) => (
        <Avatar avatarDetails={el} />
      ))}
    </div>
  );
};

const Avatar = ({ avatarDetails }) => {
  const { selectedAvatar, setSelectedAvatar } = useContext(StateContextProvider);
  return (
    <div
      style={{
        // fontSize: '2rem',
        borderRadius: '30px',
        background: selectedAvatar.id === avatarDetails.id && 'rgba(255, 255, 255, 0.2)',
        // boxShadow:
        // selectedAvatar.id === avatarDetails.id && 'rgba(255, 255, 255, 0.2) 0px 7px 29px 0px',
      }}
      className='cursor-pointer p-2'
      onClick={() => {
        setSelectedAvatar(avatarDetails);
      }}
    >
      {avatarDetails.avatar}
    </div>
  );
};
