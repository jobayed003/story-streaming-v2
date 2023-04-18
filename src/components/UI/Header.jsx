import { getAuth } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Image, Nav, Navbar, Row } from 'react-bootstrap';
import { FaArrowLeft, FaBars, FaBell } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import AuthProvider from '../../context/AuthContext';
import logo from '../Icons/StorySaloon_Logo.svg';
import { ManageUser } from '../util/ManageUser';
import classes from './Header.module.css';

const Header = () => {
  const [show, setShow] = useState(false);

  const { isAdmin, users, userCredentials } = useContext(AuthProvider);
  const navigate = useNavigate();
  const pathName = useLocation().pathname.replace('/', '');

  const handleLogout = () => {
    const auth = getAuth();
    localStorage.removeItem('video');
    auth.signOut();
  };

  return (
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
            <NavLink className={classes.customLink} to='/dashboard#home'>
              Home
            </NavLink>
            <Nav.Link className={classes.customLink} href='#footer'>
              Link
            </Nav.Link>
            <NavLink className={classes.customLink} to='/tv-shows'>
              Tv Shows
            </NavLink>
            <NavLink className={classes.customLink} to='/dashboard#movies'>
              Movies
            </NavLink>
            <NavLink className={classes.customLink} to='/dashboard#my-list'>
              My List
            </NavLink>
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
                  <div style={{ fontSize: '2rem' }}>{userCredentials.avatarDetails.avatar}</div>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {/* <Dropdown.Item className={'dropLinks'} href='/'>
                Home
              </Dropdown.Item> */}

                <Dropdown.Item className={'dropLinks'}>
                  <NavLink
                    style={{ color: 'black' }}
                    to={pathName === 'dashboard' ? '/settings' : '/dashboard'}
                  >
                    {pathName === 'dashboard' ? 'Settings' : 'Dashboard'}
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
  );
};

export default Header;
/* <Navbar>
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
      </Navbar> */
