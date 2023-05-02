import { getAuth } from 'firebase/auth';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Dropdown, Form, Image, Nav, Navbar } from 'react-bootstrap';
import { FaBars, FaBell, FaSearch } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-scroll';
import logo from '../../assets/Icons/StorySaloon_Logo.svg';
import AuthProvider from '../../context/AuthContext';
import StateContextProvider from '../../context/StateContext';
import { ManageUser } from '../util/ManageUser';
import classes from './Header.module.css';

const Header = ({ headerRef }) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const { scrollId, setScrollId, fitlerSearchResult } = useContext(StateContextProvider);
  const { isAdmin, users, userCredentials } = useContext(AuthProvider);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.replace('/', '');

  const handleLogout = () => {
    const auth = getAuth();
    localStorage.removeItem('video');
    auth.signOut();
  };

  const scrollToElement = (offset) => {
    const element = document.getElementById(scrollId);
    if (path === 'dashboard') {
      window.scrollTo({
        behavior: 'smooth',
        top:
          element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset,
      });
    }
    setScrollId('');
  };

  const navLinks = [
    { name: 'My List', link: 'my-list' },
    { name: 'Tv Shows', link: 'tv-shows' },
    { name: 'Movies', link: 'movies' },
    { name: 'Environment', link: 'environment' },
  ];

  useEffect(() => {
    if (scrollId !== '') {
      scrollToElement(-80);
    }
  }, []);

  return (
    <Navbar
      expand='lg'
      className='fontFamily'
      style={{ width: '100%', position: 'fixed', zIndex: '1000', background: '#303030' }}
      ref={headerRef}
    >
      <Container>
        <Navbar.Brand href='/'>
          <HashLink to='/dashboard#'>
            <Image src={logo} alt='' className={classes.logo} />
          </HashLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll'>
          <FaBars />
        </Navbar.Toggle>
        <Navbar.Collapse className='justify-content-center' id='navbarScroll'>
          <Nav className='align-items-center me-auto mb-2 mb-lg-0' navbarScroll>
            {navLinks.map((lnk) => (
              <Link
                to={lnk.link}
                activeClass={classes.customLink}
                spy={false}
                smooth={true}
                offset={-80}
                duration={0}
                key={Math.random()}
              >
                <NavLink
                  to={'/dashboard'}
                  className={classes.customLink}
                  onClick={(e) => setScrollId(e.target.textContent.toLowerCase().replace(' ', '-'))}
                >
                  {lnk.name}
                </NavLink>
              </Link>
            ))}
          </Nav>

          <Form
            className='d-flex'
            style={{ fontFamily: 'Roboto', color: '#fff' }}
            onSubmit={(e) => {
              e.preventDefault();
              fitlerSearchResult(text);
            }}
          >
            <Form.Control
              className='form-control me-2'
              type='text'
              placeholder='Search for videos'
              aria-label='Search for videos'
              onChange={(e) => setText(e.target.value)}
            />

            <Button
              variant='light'
              type='button'
              style={{ paddingBlock: '0' }}
              onClick={() => fitlerSearchResult(text)}
            >
              <FaSearch color='gray' />
            </Button>
          </Form>
          <Nav className='align-items-center ms-3 mb-2 mb-lg-0'>
            <Nav.Item className='px-2'>
              <NavLink className={'nav-link'}>
                <FaBell fontSize={'1.5rem'} />
              </NavLink>
            </Nav.Item>
          </Nav>
          <Nav className='align-items-center'>
            <Dropdown
              style={{ fontFamily: 'Roboto' }}
              className='d-flex flex-column align-items-center'
              align='end'
            >
              <Dropdown.Toggle
                className='d-flex align-items-center'
                style={{
                  background: 'none',
                  border: 'none',
                }}
              >
                {!userCredentials.avatarDetails.avatar ? (
                  <img
                    src='https://occ-0-58-64.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABZBe7K0DPia9LvzIkQ4yzqX9NocZlAjS1MOyEuBQD1WmFuLKZwvq0bxc4n4_EV73khqgwed0PYLNml0V8LCymt31e7x-8jQ.png?r=229'
                    alt=''
                  />
                ) : (
                  <div style={{ borderRadius: '50px' }}>
                    <img
                      src={userCredentials.avatarDetails.avatar}
                      alt='avatar img'
                      width={'80px'}
                      height={'50px'}
                    />
                  </div>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  className={'dropLinks'}
                  onClick={() => navigate(path === 'dashboard' ? '/settings' : '/dashboard')}
                >
                  <NavLink
                    style={{ color: 'black' }}
                    to={path === 'dashboard' ? '/settings' : '/dashboard'}
                  >
                    {path === 'dashboard' ? 'Settings' : 'Dashboard'}
                  </NavLink>
                </Dropdown.Item>
                {path === 'upload' && (
                  <Dropdown.Item className={'dropLinks'} onClick={() => navigate('/settings')}>
                    <NavLink style={{ color: 'black' }} to={'/settings'}>
                      Settings
                    </NavLink>
                  </Dropdown.Item>
                )}

                {isAdmin && (
                  <>
                    <Dropdown.Item className={'dropLinks'} onClick={() => navigate('/upload')}>
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
  );
};

export default Header;
