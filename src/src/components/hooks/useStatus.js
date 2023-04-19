import { useEffect, useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';

const useStatus = (dependency) => {
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(
      <Row className='mb-5 mt-5 justify-content-center'>
        <Spinner animation='border' role='status' style={{ width: '100px', height: '100px' }}>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </Row>
    );

    setTimeout(() => {
      setStatus(<h1 className='mb-5 mt-5 text-center'>No Videos Found</h1>);
    }, 500);
  }, [dependency]);

  return status;
};

export default useStatus;
