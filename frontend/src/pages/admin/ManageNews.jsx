import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EditNewsModal from '../../components/EditNewsModal';

const ManageNews = () => {
  const { token } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get('/api/news', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNewsList(data);
      } catch (error) {
        console.error('Error fetching news', error);
      }
    };

    fetchNews();
  }, [token]);

  const handleDelete = async () => {
    if (newsToDelete) {
      try {
        await axios.delete(`/api/news/${newsToDelete._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNewsList(newsList.filter((news) => news._id !== newsToDelete._id));
        setModalMessage('News deleted successfully');
      } catch (error) {
        console.error('Error deleting news', error.response || error.message || error);
        setModalMessage('Error deleting news: ' + (error.response?.data?.message || error.message));
      }
      setShowConfirmModal(false);
      setShowMessageModal(true);
    }
  };

  const handleEdit = (news) => {
    setNewsToEdit(news);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (editedNews) => {
    try {
      await axios.put(`/api/news/${editedNews._id}`, editedNews, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewsList(newsList.map((news) => (news._id === editedNews._id ? editedNews : news)));
      setModalMessage('News updated successfully');
    } catch (error) {
      console.error('Error updating news', error.response || error.message || error);
      setModalMessage('Error updating news: ' + (error.response?.data?.message || error.message));
    }
    setShowEditModal(false);
    setShowMessageModal(true);
  };

  return (
    <Container>
      <h1>Manage News</h1>
      <div className="mb-4">
        <Button as={Link} to="/create-news" variant="primary">Add News</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((newsItem) => (
            <tr key={newsItem._id}>
              <td>{newsItem.title}</td>
              <td>{newsItem.category}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(newsItem)}>Edit</Button>
                <Button variant="danger" onClick={() => { setNewsToDelete(newsItem); setShowConfirmModal(true); }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this news?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowMessageModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <EditNewsModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        news={newsToEdit}
        onSave={handleSaveEdit}
      />
    </Container>
  );
};

export default ManageNews;
