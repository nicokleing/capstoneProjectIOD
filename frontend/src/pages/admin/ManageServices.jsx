import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManageServices = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [startups, setStartups] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editType, setEditType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: serviceData } = await axios.get('/api/services', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServices(serviceData);

        const { data: startupData } = await axios.get('/api/services?category=Startups', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStartups(startupData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await axios.delete(`/api/services/${itemToDelete._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (itemToDelete.category === 'Startups') {
          setStartups(startups.filter((startup) => startup._id !== itemToDelete._id));
        } else {
          setServices(services.filter((service) => service._id !== itemToDelete._id));
        }
        setModalMessage('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item', error.response || error.message || error);
        setModalMessage('Error deleting item: ' + (error.response?.data?.message || error.message));
      }
      setShowConfirmModal(false);
      setShowMessageModal(true);
    }
  };

  const handleEdit = (item, type) => {
    setItemToEdit(item);
    setEditType(type);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', itemToEdit.name);
    if (itemToEdit.price) {
      formData.append('price', itemToEdit.price);
    }
    formData.append('description', itemToEdit.description);
    formData.append('category', itemToEdit.category);
    formData.append('subcategory', itemToEdit.subcategory);
    formData.append('url', itemToEdit.url);

    if (itemToEdit.image instanceof File) {
      formData.append('image', itemToEdit.image);
    }

    if (itemToEdit.video instanceof File) {
      formData.append('video', itemToEdit.video);
    }

    try {
      await axios.put(`/api/services/${itemToEdit._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (editType === 'service') {
        setServices(services.map(service => (service._id === itemToEdit._id ? itemToEdit : service)));
      } else {
        setStartups(startups.map(startup => (startup._id === itemToEdit._id ? itemToEdit : startup)));
      }
      setShowEditModal(false);
      setModalMessage('Item updated successfully');
    } catch (error) {
      console.error('Error updating item', error.response || error.message || error);
      setModalMessage('Error updating item: ' + (error.response?.data?.message || error.message));
    }
    setShowMessageModal(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedServices = [...services].sort((a, b) => {
    const aField = sortField === 'user' ? a.user?.name || 'N/A' : a[sortField];
    const bField = sortField === 'user' ? b.user?.name || 'N/A' : b[sortField];

    if (sortOrder === 'asc') {
      return aField > bField ? 1 : -1;
    } else {
      return aField < bField ? 1 : -1;
    }
  });

  const sortedStartups = [...startups].sort((a, b) => {
    const aField = sortField === 'user' ? a.user?.name || 'N/A' : a[sortField];
    const bField = sortField === 'user' ? b.user?.name || 'N/A' : b[sortField];

    if (sortOrder === 'asc') {
      return aField > bField ? 1 : -1;
    } else {
      return aField < bField ? 1 : -1;
    }
  });

  return (
    <Container>
      <h1 className="my-4">Manage Services and Startups</h1>
      <div className="mb-4">
        <Button as={Link} to="/upload-service" variant="primary">Add New Service</Button>
      </div>
      <h2>Services</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('price')}>Price {sortField === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('category')}>Category {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('subcategory')}>Subcategory {sortField === 'subcategory' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('user')}>User {sortField === 'user' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((service) => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td>{service.price}</td>
              <td>{service.category}</td>
              <td>{service.subcategory}</td>
              <td>{service.user ? `${service.user.name} (${service.user.email})` : 'N/A'}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(service, 'service')}>Edit</Button>
                <Button variant="danger" onClick={() => { setItemToDelete(service); setShowConfirmModal(true); }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>Startups</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('category')}>Category {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('subcategory')}>Subcategory {sortField === 'subcategory' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('user')}>User {sortField === 'user' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedStartups.map((startup) => (
            <tr key={startup._id}>
              <td>{startup.name}</td>
              <td>{startup.category}</td>
              <td>{startup.subcategory}</td>
              <td>{startup.user ? `${startup.user.name} (${startup.user.email})` : 'N/A'}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(startup, 'startup')}>Edit</Button>
                <Button variant="danger" onClick={() => { setItemToDelete(startup); setShowConfirmModal(true); }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
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

      {/* Modal para editar un servicio o startup */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit {editType === 'service' ? 'Service' : 'Startup'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemToEdit && (
            <form>
              <div className="mb-3">
                <label htmlFor="itemName" className="form-label">{editType === 'service' ? 'Service Name' : 'Startup Name'}</label>
                <input type="text" className="form-control" id="itemName" value={itemToEdit.name} onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })} />
              </div>
              {editType === 'service' && (
                <div className="mb-3">
                  <label htmlFor="itemPrice" className="form-label">Price</label>
                  <input type="number" className="form-control" id="itemPrice" value={itemToEdit.price} onChange={(e) => setItemToEdit({ ...itemToEdit, price: e.target.value })} />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="itemCategory" className="form-label">Category</label>
                <input type="text" className="form-control" id="itemCategory" value={itemToEdit.category} onChange={(e) => setItemToEdit({ ...itemToEdit, category: e.target.value })} />
              </div>
              <div className="mb-3">
                <label htmlFor="itemSubcategory" className="form-label">Subcategory</label>
                <input type="text" className="form-control" id="itemSubcategory" value={itemToEdit.subcategory} onChange={(e) => setItemToEdit({ ...itemToEdit, subcategory: e.target.value })} />
              </div>
              <div className="mb-3">
                <label htmlFor="itemDescription" className="form-label">Description</label>
                <textarea className="form-control" id="itemDescription" rows="3" value={itemToEdit.description} onChange={(e) => setItemToEdit({ ...itemToEdit, description: e.target.value })}></textarea>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageServices;
