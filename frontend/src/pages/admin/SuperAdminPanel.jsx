import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import EditUserForm from '../../components/EditUserForm';
import RegisterUserForm from '../../components/RegisterUserForm';
import { useAuth } from '../../context/AuthContext';

const SuperAdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`/api/users/${userToDelete._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== userToDelete._id));
        setModalMessage('User deleted successfully');
      } catch (error) {
        console.error(error);
        setModalMessage('Error deleting user: ' + (error.response?.data?.message || error.message));
      }
      setShowConfirmModal(false);
      setShowMessageModal(true);
    }
  };

  const handleEdit = (id) => {
    setEditingUserId(id);
  };

  const handleUserUpdated = async () => {
    const { data } = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(data);
    setEditingUserId(null);
    setModalMessage('User updated successfully');
    setShowMessageModal(true);
  };

  const handleUserRegistered = async () => {
    const { data } = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(data);
    setShowRegisterForm(false);
    setModalMessage('User registered successfully');
    setShowMessageModal(true);
  };

  return (
    <Container>
      <h1 className="my-4">Super Admin Panel</h1>
      <Row className="mb-4">
        <Col>
          <Button variant="primary" onClick={() => setShowRegisterForm(true)}>
            Register New User
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isSuperAdmin ? 'Super Admin' : user.isAdmin ? 'Admin' : 'User'}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user._id)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => { setUserToDelete(user); setShowConfirmModal(true); }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de registro de nuevo usuario */}
      <Modal show={showRegisterForm} onHide={() => setShowRegisterForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterUserForm onUserRegistered={handleUserRegistered} />
        </Modal.Body>
      </Modal>

      {/* Modal de edición de usuario */}
      <Modal show={!!editingUserId} onHide={() => setEditingUserId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditUserForm userId={editingUserId} onUserUpdated={handleUserUpdated} />
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mostrar mensajes */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowMessageModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SuperAdminPanel;
