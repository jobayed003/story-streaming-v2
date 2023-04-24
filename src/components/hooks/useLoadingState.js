import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Image, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../Icons/StorySaloon_Logo.svg';

const useLoadingState = () => {
  const [loadingState, setLoadingState] = useState();
  const [user, userLoading] = useAuthState(getAuth());
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingState(
      <Row className='justify-content-center align-items-center' style={{ height: '100vh' }}>
        <Image src={logo} alt='' style={{ width: '300px', height: '80px' }} />
      </Row>
    );

    !userLoading &&
      setTimeout(() => {
        navigate('/');
      }, 800);
  }, [userLoading]);

  return loadingState;
};

export default useLoadingState;
