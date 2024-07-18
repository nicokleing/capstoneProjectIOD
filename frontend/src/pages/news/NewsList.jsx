import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, ListGroup, Button, Modal } from 'react-bootstrap';
import UserContext from '../../context/AuthContext';

const NewsList = () => {
  const { user } = useContext(UserContext);
  const [newsList, setNewsList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await axios.get('/api/news');
      setNewsList(data);
    };

    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (newsToDelete) {
      await axios.delete(`/api/news/${newsToDelete._id}`);
      setNewsList(newsList.filter((n) => n._id !== newsToDelete._id));
      setShowConfirmModal(false);
    }
  };

  return (
    <Container>
      <h1>News</h1>
      <ListGroup>
        {newsList.map((newsItem) => (
          <ListGroup.Item key={newsItem._id}>
            <Link to={`/news/${newsItem._id}`}>{newsItem.title}</Link>
            {(user?.isAdmin || user?.isSuperAdmin || user?._id === newsItem.user) && (
              <>
                <Button variant="danger" onClick={() => { setNewsToDelete(newsItem); setShowConfirmModal(true); }}>
                  Delete
                </Button>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

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
    </Container>
  );
};

export default NewsList;
