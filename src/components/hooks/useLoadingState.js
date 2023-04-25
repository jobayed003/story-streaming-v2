import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Image, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import logo from '../../assets/Icons/StorySaloon_Logo.svg';

const useLoadingState = () => {
  const [loadingState, setLoadingState] = useState();
  const [user] = useAuthState(getAuth());

  useEffect(() => {
    setLoadingState(
      <Row className='justify-content-center align-items-center' style={{ height: '100vh' }}>
        <Image src={logo} alt='' style={{ width: '300px', height: '80px' }} />
      </Row>
    );

    !user &&
      setTimeout(() => {
        setLoadingState(<Navigate to='/' />);
      }, 800);
  }, []);

  return loadingState;
};

export default useLoadingState;
