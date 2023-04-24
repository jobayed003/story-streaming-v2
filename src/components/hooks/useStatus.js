import { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';

const useStatus = (dependency) => {
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(
      <Row className='mt-5 justify-content-center'>
        <div class='snippet' data-title='dot-pulse' className='d-flex justify-content-center'>
          <div class='dot-pulse'></div>
        </div>
      </Row>
    );

    setTimeout(() => {
      setStatus(<h1 className='mb-5 mt-5 text-center'>No Videos Found</h1>);
    }, 2500);
  }, [dependency]);

  return status;
};

export default useStatus;
