import { getAuth } from 'firebase/auth';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Dropdown, Form, Image, Nav, Navbar } from 'react-bootstrap';
import { FaBars, FaBell, FaSearch } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Scroll, { Link } from 'react-scroll';
import logo from '../../assets/Icons/StorySaloon_Logo.svg';
import AuthProvider from '../../context/AuthContext';
import StateContextProvider from '../../context/StateContext';
import { ManageUser } from '../util/ManageUser';
import classes from './Header.module.css';

const Header = ({ headerRef }) => {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollId, setScrollId, searchedText, setSearchedText, fitlerSearchResult } =
    useContext(StateContextProvider);
  const { isAdmin, users, userCredentials } = useContext(AuthProvider);

  const navigate = useNavigate();
  const navRef = useRef();
  const location = useLocation();
  const path = location.pathname.replace('/', '');

  const handleLogout = () => {
    const auth = getAuth();
    localStorage.removeItem('videoID');
    auth.signOut();
  };

  const scrollToElement = (offset) => {
    const element = document.getElementById(scrollId);
    path === 'dashboard' &&
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    // path === 'dashboard' && window.scrollTo({ top: y, behavior: 'smooth' });
    // window.document.body.scrollTo({
    //   top:
    //     element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset,
    //   behavior: 'smooth',
    // });
    setScrollId('');
  };

  const navLinks = [
    { name: 'My List', link: 'my-list' },
    { name: 'Tv Shows', link: 'tv-shows' },
    { name: 'Movies', link: 'movies' },
    { name: 'Environment', link: 'environment' },
  ];

  useEffect(() => {
    scrollId !== '' && scrollToElement(-100);
  }, []);

  return (
    <Navbar
      expand='lg'
      collapseOnSelect
      className='fontFamily'
      fixed='top'
      // sticky='top'
      style={{
        background: '#303030',
      }}
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
        <Navbar.Collapse ref={navRef} className={`justify-content-center`} id='navbarScroll'>
          <Nav className='align-items-center me-auto mb-2 mb-lg-0'>
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
            role='search'
            onSubmit={(e) => {
              e.preventDefault();
              window.scrollTo(0, 0);
              navigate('/dashboard');
              fitlerSearchResult(searchedText);
              navRef.current.classList.remove('show');
            }}
          >
            <Form.Control
              className='form-control me-2'
              type='search'
              value={searchedText}
              placeholder='Search for videos'
              aria-label='Search for videos'
              onChange={(e) => {
                window.scrollTo(0, 0);
                setSearchedText(e.target.value);
                fitlerSearchResult(e.target.value);
              }}
            />
            <Button
              variant='light'
              type='button'
              style={{ paddingBlock: '0' }}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/dashboard');
                fitlerSearchResult(searchedText);
                navRef.current.classList.remove('show');
              }}
            >
              <FaSearch color='gray' />
            </Button>
          </Form>
          <div className='d-flex justify-content-center align-items-center ms-3'>
            <NavLink className={'nav-link '}>
              <FaBell fontSize={'1.5rem'} />
            </NavLink>
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
                <div style={{ borderRadius: '50px' }}>
                  <img
                    src={userCredentials.avatarDetails.avatar}
                    alt='avatar img'
                    height={'45px'}
                  />
                </div>
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
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
