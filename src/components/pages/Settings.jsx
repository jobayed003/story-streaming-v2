import { getAuth, sendPasswordResetEmail, updatePassword } from 'firebase/auth';

import { useContext, useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthProvider from '../../context/AuthContext';
import StateContextProvider from '../../context/StateContext';
import useLoadingState from '../hooks/useLoadingState';

import Layout from '../UI/Layout';
import { updateUserDoc } from '../util/firebaseUtil';
import './Settings.css';

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Context Management
  const { userCredentials } = useContext(AuthProvider);

  // Custom Hooks
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();

  return (
    <>
      {!user && loadingState}
      {user && (
        <Layout>
          <ResetPass
            showPasswordModal={showPasswordModal}
            setShowPasswordModal={setShowPasswordModal}
            userDetails={userCredentials}
          />

          {/* nav-start */}

          {/* nav-end */}
          {/* xs={8} md={8} sm={8} */}
          {/* main-section-start */}
          <Container
            as='section'
            className='mainsection'
            style={{ marginBlock: '5rem', marginTop: '8rem' }}
          >
            <Row className='py-3 align-items-center settings-container'>
              <Col className='py-2 d-flex justify-content-around gap-4 flex-wrap'>
                <h2>ACCOUNT SETTINGS</h2>
                <div>
                  <p className='text-content'>Email: {userCredentials.email}</p>
                  <div className='d-flex align-items-center'>
                    <p className='text-content'>Password: ********</p>
                    <Button
                      variant='link'
                      className='link-item mb-2'
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change password
                    </Button>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <p className='text-content m-0'>Avatar: </p>
                    <img
                      src={userCredentials.avatarDetails.avatar}
                      alt='avatar img'
                      width={'40px'}
                      style={{ borderRadius: '50%' }}
                    />
                  </div>
                  <div className='avatar-container hide-scroll'>
                    <ChangeAvatar />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          {/* main-secction-end */}
        </Layout>
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
    const targetId = target.id.replace('formGroup', '').toLowerCase();
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
        toast.dark('Password changed successfully!', {
          theme: 'dark',
        });
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
        toast.dark('Password reset email has been sent, please check your inbox', {
          theme: 'dark',
        });
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
      <Modal.Body
        className='rounded'
        style={{
          background: 'var(--form-bg)',
        }}
      >
        <Modal.Title className='text-center pb-3  form-label'>Change Password</Modal.Title>
        <Form>
          <Form.Group className='mb-3' controlId='formGroupNewPass'>
            <Form.Label>New password</Form.Label>
            <InputGroup className={'inputBg'}>
              <Form.Control
                type={isClicked ? 'text' : 'password'}
                placeholder='New Password'
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
          <Form.Group className='mb-3' controlId='formGroupConfirmPass'>
            <Form.Label>Confirm password</Form.Label>
            <InputGroup className={'inputBg'}>
              <Form.Control
                type={isClicked ? 'text' : 'password'}
                placeholder='Confirm Password'
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
        </Form>
        <Button
          style={{
            background: 'none',
            color: '#f2e6d2',
            textDecoration: 'underline',
            border: 'none',
            paddingLeft: '0',
            paddingTop: '1rem',
            height: '2.5rem',
          }}
          onClick={(e) => {
            sendResetMail();
            e.currentTarget.style.color = 'var(--text-color)';
          }}
        >
          Or get a password reset email
        </Button>

        <div className='d-flex flex-column justify-content-between align-items-center pt-2'>
          <Button
            style={{
              background: 'var(--button-color)',
              border: 'none',
              height: '2.5rem',
            }}
            type='submit'
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
      </Modal.Body>
    </Modal>
  );
};

const ChangeAvatar = () => {
  const avatarDetails = [];
  const { userCredentials, avatarUrls } = useContext(AuthProvider);

  avatarUrls.map((el, idx) => avatarDetails.push({ id: idx + 1, avatar: el }));

  return (
    <div className='d-flex flex-wrap mt-3'>
      {avatarUrls.length > 0 &&
        avatarDetails.map((el) => <Avatar avatarDetails={el} uid={userCredentials.uid} />)}
    </div>
  );
};

const Avatar = (props) => {
  const { selectedAvatar, setSelectedAvatar } = useContext(StateContextProvider);

  const {
    avatarDetails: { id, avatar },
    uid,
  } = props;

  const changeAvatar = async () => {
    const details = { id: id, avatar: avatar };
    setSelectedAvatar(details);

    try {
      await updateUserDoc(uid, { avatarDetails: details });
      toast.dark('Avatar updated successfully!');
    } catch (err) {
      toast.error('Something went wrong! Try again');
    }
  };

  return (
    <div
      style={{
        borderRadius: '50%',
        background: selectedAvatar.id === id && 'rgba(255, 255, 255, 0.2)',
      }}
      className='cursor-pointer p-2'
      onClick={changeAvatar}
    >
      <img
        src={avatar}
        alt='avatar img'
        width={'70px'}
        height={'70px'}
        style={{ borderRadius: '40px' }}
      />
    </div>
  );
};

// const avatars = [
//   '🤠',
//   '🙂',
//   '😀',
//   '😁',
//   '😉',
//   '😎',
//   '👨',

//   '👧',
//   '👦',
//   '👶',
//   '👶',
//   '👴',
//   '🧓',
//   '👧',
//   '👵',
//   '👩‍🦱',

//   '🧑‍🦱',
//   '🧑‍🦳',
//   '👱‍♀️',
//   '👩‍🦲',
//   '👱‍♂️',
//   '🧑‍🦲',
//   '👱',
//   '👸',
//   '🫅',
//   '🤴',
//   '👳‍♂️',
//   '🧔‍♀️',
//   '👼',
//   '👮‍♀️',
//   '👩‍⚕️',
//   '🧑‍🎓',
//   '👩‍🏫',
//   '🧑‍🍳',
//   '👩‍🔧',
//   '👩‍🔬',
//   '🧑‍🔬',
//   '👩‍💻',
//   '👨‍💻',
//   '👨‍🎤',
//   '👩‍🚀',
//   '🧑‍🚒',
//   '🧕',
//   '🏃‍♀️',
//   '👍',
//   '🫱🏽‍🫲🏽',
//   '👩‍💻',
// ];
