import { useContext } from 'react';
import { Badge, Form, Modal, Spinner } from 'react-bootstrap';
import AuthProvider from '../../context/AuthContext';

export const ManageUser = ({ show, setShow, users }) => {
  const { userCredentials, updateUserRole } = useContext(AuthProvider);

  const handleClose = () => setShow(false);

  const handleClick = async (id, role) => {
    await updateUserRole(id, role);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='rounded'>
          <Modal.Title className='border-0 text-center text-dark p-1'>Manage Users</Modal.Title>
          <div className='px-4'>
            {users === undefined && (
              <Spinner animation='border' role='status' style={{ width: '100px', height: '100px' }}>
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            )}
            {users.map((el, idx) => (
              <div
                className='d-flex justify-content-between align-items-center gap-5 text-dark'
                key={idx}
              >
                <p>
                  {idx + 1 + '. ' + el.name}{' '}
                  {el.role === 'admin' && (
                    <Badge
                      bg='success'
                      style={{ fontSize: '.7rem', backgroundColor: 'var(--text-color)' }}
                    >
                      Admin
                    </Badge>
                  )}
                </p>

                {el.email !== 'admin@admin.com' && userCredentials.uid !== el.uid && (
                  <Form.Select
                    className='w-auto'
                    onChange={(e) => handleClick(el.uid, e.target.value)}
                    style={{ marginBlock: '.4rem' }}
                    value={el.role}
                  >
                    <option value={'admin'}>Admin</option>
                    <option value={'user'}>User</option>
                  </Form.Select>
                )}
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
