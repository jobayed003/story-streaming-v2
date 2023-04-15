import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  Modal,
  Nav,
  Navbar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaBars, FaBell } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import logo from '../components/Icons/StorySaloon_Logo.svg';
import AuthProvider from '../context/AuthContext';
import VideoContextProvider from '../context/VideoContext';
import { createCheckoutSession } from '../stripe/createCheckoutSession';
import { updateUserRole } from '../youtubeUtils';
import './Dashboard.css';
import useOutsideHover from './hooks/useOutsideHover';
import useThumbnail from './hooks/useThumbnail';
import Footer from './util/Footer';
import Slide from './util/Slide';

const Dashboard = () => {
  const { isAdmin, users, isAuthenticated } = useContext(AuthProvider);
  const navigate = useNavigate();

  const { videos, videoUrls, setClickedVideo } = useContext(VideoContextProvider);
  // const [hoverRef, isHovered] = useHover();
  const [show, setShow] = useState(false);

  // custom hook for generating thumbnail from url
  const thumbnail = useThumbnail(videoUrls);

  const handleClick = (el) => {
    setClickedVideo(el);
    localStorage.removeItem('video');
    localStorage.setItem('video', JSON.stringify(el));
    navigate(`/watch/${el.uniqueId}`);
  };

  const handleLogout = () => {
    const auth = getAuth();
    localStorage.removeItem('video');
    auth.signOut();
  };

  if (!isAuthenticated) {
    navigate('/');
    return <Spinner></Spinner>;
  }

  return (
    <div>
      {/* nav-start */}
      <Navbar
        expand='lg'
        className='fontFamily'
        style={{ width: '100%', position: 'fixed', zIndex: '1000', background: '#303030' }}
      >
        <Container>
          <Navbar.Brand href='/'>
            <Image src={logo} alt='' style={{ width: '300px', height: '50px' }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll'>
            <FaBars />
          </Navbar.Toggle>
          <Navbar.Collapse className='justify-content-center' id='navbarScroll'>
            <Nav className='align-items-center me-auto mb-2 mb-lg-0' navbarScroll>
              <Nav.Link href='#home'>Home</Nav.Link>
              <Nav.Link href='#footer'>Link</Nav.Link>
              <Nav.Link href='/tv-shows'>Tv Shows</Nav.Link>
              <Nav.Link href='#movies'>Movies</Nav.Link>
              <Nav.Link href='#my-list'>My List</Nav.Link>
            </Nav>

            <Form className='d-flex' role='search' style={{ fontFamily: 'Roboto', color: '#fff' }}>
              <Form.Control
                className='form-control me-2'
                type='search'
                placeholder='Search'
                aria-label='Search'
              />

              <Button variant='light' type='submit'>
                Search
              </Button>
            </Form>
            <Nav className='align-items-center ms-3 mb-2 mb-lg-0'>
              <Nav.Item>
                <Button
                  variant='light'
                  className='nav-link'
                  href='#'
                  style={{
                    fontFamily: 'Roboto',
                    color: '#fff',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Kids
                </Button>
              </Nav.Item>
              <Nav.Item className='px-2'>
                <NavLink className={'nav-link'}>
                  <FaBell />
                </NavLink>
              </Nav.Item>
            </Nav>
            <Nav className='align-items-center'>
              <Dropdown style={{ fontFamily: 'Roboto' }} className='d-flex flex-column' align='end'>
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
                  {/* <Dropdown.Item className={'dropLinks'} href='/'>
                    Home
                  </Dropdown.Item> */}

                  <Dropdown.Item className={'dropLinks'}>
                    <NavLink style={{ color: 'black' }} to={'/settings'}>
                      Settings
                    </NavLink>
                  </Dropdown.Item>

                  {isAdmin && (
                    <>
                      <Dropdown.Item className={'dropLinks'}>
                        <NavLink style={{ color: 'black' }} to={'/upload'}>
                          Upload Series
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item className={'dropLinks'} href='' onClick={() => setShow(true)}>
                        Manage Users
                      </Dropdown.Item>

                      <ManageUser show={show} setShow={setShow} users={users} />
                    </>
                  )}

                  <Dropdown.Item href='/' className={'customItem dropLinks'} onClick={handleLogout}>
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* nav-end */}
      {/* list-start */}
      <Container
        as='section'
        id='movies'
        className='listsection py-2 fontFamily'
        style={{ position: 'relative' }}
      >
        <Row className='mt-5'>
          <Col className='mt-5'>
            <h1>Top Trending</h1>
          </Col>
        </Row>

        <Slide videosCount={videos.length}>
          {videos.map((el, idx) => (
            <div
              className='slide'
              key={Math.random() + idx}
              style={{ width: '400px' }}
              onClick={() => handleClick(el)}
            >
              <ListCard
                imgSrc={thumbnail[idx]}
                videoId={el.episodes[0].id}
                desc={el.description}
                title={el.title}
              />
            </div>
          ))}
        </Slide>
        <Row>
          <Col>
            <h1>My List</h1>
          </Col>
        </Row>

        <Slide videosCount={videos.length}>
          {videos.map((el, idx) => (
            <div
              className='slide'
              key={Math.random() + idx}
              style={{ width: '400px' }}
              onClick={() => handleClick(el)}
              id='my-list'
            >
              <ListCard
                imgSrc={thumbnail[idx]}
                videoId={el.episodes[0].id}
                desc={el.description}
                title={el.title}
              />
            </div>
          ))}
        </Slide>
      </Container>
      {/* list-end */}
      {/* footer-start */}
      <Footer />
    </div>
  );
};

export default Dashboard;

const ManageUser = ({ show, setShow, users }) => {
  const { isUpdated, setIsUpdated, isDefaultAdmin } = useContext(AuthProvider);

  const handleClose = () => setShow(false);

  const handleClick = async (id, role) => {
    await updateUserRole(id, role);
    setIsUpdated(!isUpdated);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <div className='px-4 my-4'>
          {users === undefined && (
            <Spinner animation='border' role='status' style={{ width: '100px', height: '100px' }}>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          )}
          {users.map((el, idx) => (
            <div className='d-flex justify-content-between gap-5 text-dark' key={idx}>
              <p>
                {idx + 1 + '. ' + el.name}{' '}
                {el.role === 'admin' && <Badge bg='success'>Admin</Badge>}
              </p>

              {el.email !== 'admin@admin.com' && (
                <Button
                  variant='light'
                  className='bg-success'
                  onClick={() => handleClick(el.id, el.role === 'admin' ? 'user' : 'admin')}
                  style={{
                    color: '#fff',
                    width: '',
                    paddingBlock: '10px',
                    fontSize: '.8rem',
                  }}
                >
                  {el.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

const ListCard = ({ imgSrc, title, videoId, desc }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();

  // useOutsideHover(ref, () => setHovered(false));

  const opts = {
    height: '300',
    width: '450',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div>
      {!hovered && (
        <motion.div
          className='box'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: 0,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <img
            src={imgSrc}
            alt='thumbnail'
            width={'300px'}
            onMouseEnter={() => {
              setHovered(true);
            }}
          />
        </motion.div>
      )}
      {hovered && (
        <motion.div
          className='box'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: 0,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          style={{ width: '100%', position: 'relative' }}
        >
          <Card
            style={{
              width: '100%',
              fontFamily: 'Roboto',
              background: 'gray',
              zIndex: '1000000',
              fontSize: '1.5rem',
            }}
            onMouseLeave={() => setHovered(false)}
          >
            <YouTube videoId={videoId} opts={opts} />
            <Card.Body>
              <div className='d-flex align-items-center justify-content-between'>
                <div>
                  <Card.Title className='display-6' style={{ fontWeight: 'bold' }}>
                    {title}
                  </Card.Title>
                  <Card.Text style={{ margin: 0 }}>{desc}</Card.Text>
                </div>
                <Button
                  variant='success'
                  style={{
                    color: '#fff',
                    fontSize: '1.5rem',
                  }}
                >
                  Fullscreen
                </Button>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export const Test = () => {
  const [user, userLoading] = useAuthState(getAuth());

  return (
    <div>
      {user && !userLoading && (
        <>
          <h1>Hello, {user.displayName}</h1>
          <button onClick={() => createCheckoutSession(user.uid)}>Upgrade to premium!</button>
        </>
      )}
    </div>
  );
};

// https://github.com/jobayed003/story-streaming-v2.git
// https://github.com/Hunter84/story-streaming.git
