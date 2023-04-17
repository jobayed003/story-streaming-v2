import { useContext } from 'react';
import { Badge, Button, Modal, Spinner } from 'react-bootstrap';
import AuthProvider from '../../context/AuthContext';
import { updateUserRole } from '../../youtubeUtils';

export const ManageUser = ({ show, setShow, users }) => {
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
        closeButton
      >
        <Modal.Header closeButton className='border-0'>
          <Modal.Title>Manage Users</Modal.Title>
        </Modal.Header>
        <div className='px-4 my-4' closeButton>
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
