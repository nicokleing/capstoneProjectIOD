import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const NewsForm = ({ news }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState(news ? news.title : '');
  const [content, setContent] = useState(news ? news.content : '');
  const [category, setCategory] = useState(news ? news.category : '');
  const [tags, setTags] = useState(news ? news.tags : []);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [githubUrl, setGithubUrl] = useState(news ? news.githubUrl : '');
  const [sourceUrl, setSourceUrl] = useState(news ? news.sourceUrl : '');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVariant, setModalVariant] = useState('primary');
  const navigate = useNavigate();

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar URLs
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if ((githubUrl && !urlPattern.test(githubUrl)) || (sourceUrl && !urlPattern.test(sourceUrl))) {
      setModalMessage('Please enter valid URLs for GitHub and Source fields.');
      setModalVariant('danger');
      setShowMessageModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags.join(','));
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    additionalImages.forEach((image, index) => {
      formData.append(`additionalImages`, image);
    });
    formData.append('githubUrl', githubUrl);
    formData.append('sourceUrl', sourceUrl);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (news) {
        await axios.put(`/api/news/${news._id}`, formData, config);
        setModalMessage('News updated successfully');
      } else {
        await axios.post('/api/news', formData, config);
        setModalMessage('News created successfully');
      }
      setModalVariant('success');
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error saving news:', error);
      setModalMessage('Error saving news: ' + (error.response?.data?.message || error.message));
      setModalVariant('danger');
      setShowMessageModal(true);
    }
  };

  return (
    <Container>
      <h1>{news ? 'Edit News' : 'Create News'}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="tags">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value.split(','))}
          />
        </Form.Group>

        <Form.Group controlId="mainImage">
          <Form.Label>Main Image</Form.Label>
          <Form.Control type="file" onChange={handleMainImageChange} />
        </Form.Group>

        <Form.Group controlId="additionalImages">
          <Form.Label>Additional Images</Form.Label>
          <Form.Control type="file" multiple onChange={handleAdditionalImagesChange} />
        </Form.Group>

        <Form.Group controlId="githubUrl">
          <Form.Label>GitHub URL Remember write with (http://)</Form.Label>
          <Form.Control
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="sourceUrl">
          <Form.Label>Source URL Remember write with (http://)</Form.Label>
          <Form.Control
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {news ? 'Update' : 'Save'}
        </Button>
        <Button variant="secondary" as={Link} to="/manage-news" className="ms-2">Back to Manage News</Button>
      </Form>

      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant={modalVariant} onClick={() => setShowMessageModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewsForm;
