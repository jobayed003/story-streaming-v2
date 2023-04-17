import { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Image, Nav, Navbar, Row } from 'react-bootstrap';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../components/Icons/StorySaloon_Logo.svg';
import AuthProvider from '../context/AuthContext';
import left from '../images/left.png';
import placeholder from '../images/placeholder.jpg';
import tv from '../images/tv.png';
import '../index.css';
import Login from './auth/Login';
import Register from './auth/Register';
import Footer from './util/Footer';

const Landing = () => {
  const [show, setShow] = useState(false);
  const { authStep, setAuthStep, isAuthenticated } = useContext(AuthProvider);
  const navigate = useNavigate();

  const handleShow = () => setShow(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }
  });

  return (
    <>
      {/* nav-start */}

      {authStep === 'register' ? (
        <Register show={show} setShow={setShow} />
      ) : (
        <Login show={show} setShow={setShow} />
      )}

      <Container
        fluid
        style={{
          backgroundImage: `url(${placeholder})`,
        }}
      >
        <Navbar>
          <Container>
            <Navbar.Brand href='/'>
              <Image src={logo} alt='' style={{ width: '350px', height: '50px' }} />
            </Navbar.Brand>
            <Nav className=''>
              <Nav.Link href='#'>
                <Button variant='danger' onClick={handleShow}>
                  Sign In
                </Button>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        {/* herosection-start */}
        <Container as='section' style={{ height: '50vh', zIndex: 100 }}>
          <Row className='my-5 text-center'>
            <h5 className='mb-3'>Welcome back!</h5>
            <h1 className='mb-3'>
              Unlimited movies, TV <br />
              shows, and more.
            </h1>
            <h5 className='mb-5'>Watch anywhere. Cancel anytime.</h5>
            <div>
              <Button
                className='py-2 px-4 custom-btn'
                variant='danger'
                // style={{ outline: 'none', border: 'none' }}
                onClick={(_) => {
                  setAuthStep('register');
                  handleShow();
                }}
              >
                Finish Sign Up <FaChevronRight />
              </Button>
            </div>
          </Row>
        </Container>
        {/* herosection-end */}
      </Container>
      {/* nav-end */}

      {/* first-slogansection-start */}
      <Container as={'section'}>
        <Row className='my-5 align-items-center'>
          <Col className='d-flex flex-column justify-content-center'>
            <h1>Enjoy on your TV.</h1>
            <h2>
              Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and
              more.
            </h2>
          </Col>

          <Col>
            <img style={{ width: '100%' }} src={tv} alt='tv' />
          </Col>
        </Row>
      </Container>
      {/* first-slogansection-end */}

      {/* second-slogansection-sttart */}
      <Container as='section'>
        <Row className='justify-content-xs-center align-items-center'>
          <Col>
            <div>
              <img style={{ width: '100%' }} src={left} alt='' />
            </div>
          </Col>
          <Col>
            <div className='right d-flex flex-column justify-content-center ps-lg-5 text-center text-lg-start h-100'>
              <h1>Download your shows to watch offline.</h1>
              <h2>Save your favorites easily and always have something to watch.</h2>
            </div>
          </Col>
        </Row>
      </Container>
      {/* second-slogansection-end */}

      {/* third-slogansectionn-start */}
      <Container as='section' className='py-5'>
        <Row className='justify-content-xs-center '>
          <Col xs lg='5'>
            <div className='left text-center text-lg-start'>
              <h1>Watch everywhere.</h1>
              <h2>Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</h2>
            </div>
          </Col>
        </Row>
      </Container>
      {/* third-slogansectionn-end */}

      {/* second-slogansection-sttart */}
      <Container as='section'>
        <Row className='justify-content-xs-center align-items-center'>
          <Col>
            <div className='left'>
              <img style={{ width: '100%' }} src={left} alt='' />
            </div>
          </Col>
          <Col>
            <div className='right d-flex flex-column justify-content-center ps-lg-5 text-center text-lg-start h-100'>
              <h1>Create profiles for kids.</h1>
              <h2>
                Send kids on adventures with their favorite characters in a space made just for
                them—free with your membership.
              </h2>
            </div>
          </Col>
        </Row>
      </Container>
      {/* second-slogansection-end */}

      {/* question-section-start */}
      <Container className='mt-5'>
        <Row>
          <Col className='text-center'>
            <h1>Frequently Asked Questions</h1>
          </Col>
        </Row>
        <Row className='mb-4'>
          <Col>
            <Accordion defaultActiveKey='0'>
              <Accordion.Item eventKey='0' className='mb-3' style={{ background: '#303030' }}>
                <Accordion.Header>What is StorySaloon?</Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='1' className='mb-3'>
                <Accordion.Header>How much does StorySaloon cost?</Accordion.Header>
                <Accordion.Body>
                  Watch StorySaloon on your smartphone, tablet, Smart TV, laptop, or streaming
                  device, all for one fixed monthly fee. Plans range from USD3.99 to USD11.99 a
                  month. No extra costs, no contracts.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey='2' className='mb-3'>
                <Accordion.Header>Where can I watch?</Accordion.Header>
                <Accordion.Body>
                  Watch anywhere, anytime. Sign in with your StorySaloon account to watch instantly
                  on the web at StorySaloon.com from your personal computer or on any
                  internet-connected device that offers the StorySaloon app, including smart TVs,
                  smartphones, tablets, streaming media players and game consoles. You can also
                  download your favorite shows with the iOS, Android, or Windows 10 app. Use
                  downloads to watch while you're on the go and without an internet connection. Take
                  StorySaloon with you anywhere.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='3' className='mb-3'>
                <Accordion.Header>How do I cancel?</Accordion.Header>
                <Accordion.Body>
                  StorySaloon is flexible. There are no pesky contracts and no commitments. You can
                  easily cancel your account online in two clicks. There are no cancellation fees –
                  start or stop your account anytime.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='4' className='mb-3'>
                <Accordion.Header>What can I watch on StorySaloon?</Accordion.Header>
                <Accordion.Body>
                  StorySaloon has an extensive library of feature films, documentaries, TV shows,
                  anime, award-winning StorySaloon originals, and more. Watch as much as you want,
                  anytime you want.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='5' className='mb-3'>
                <Accordion.Header>Is StorySaloon good for kids?</Accordion.Header>
                <Accordion.Body>
                  The StorySaloon Kids experience is included in your membership to give parents
                  control while kids enjoy family-friendly TV shows and movies in their own space.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        <Row>
          <Col className='text-center'>
            <Button
              className='py-2 px-4 custom-btn'
              variant='danger'
              onClick={(_) => {
                setAuthStep('register');
                handleShow();
              }}
            >
              Finish Sign Up <FaChevronRight />
            </Button>
          </Col>
        </Row>
      </Container>
      {/* question-section-end */}

      {/* footer-start */}
      <Footer />
      {/* footer-end */}
    </>
  );
};

export default Landing;
