import { getAuth } from 'firebase/auth';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createCheckoutSession } from '../../stripe/createCheckoutSession';

const Upgrade = () => {
  const [user, userLoading] = useAuthState(getAuth());

  return (
    <Container>
      {user && !userLoading && (
        <>
          <h1>Hello, {user.displayName}</h1>
          <button onClick={() => createCheckoutSession(user.uid)}>Upgrade to premium!</button>
        </>
      )}
    </Container>
  );
};

export default Upgrade;
