import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const UploadService = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    image: null,
    video: null,
    url: ''
  });

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVariant, setModalVariant] = useState('primary');

  const categories = {
    'Web and App Development': [
      'Website Development',
      'Mobile App Development',
      'Web App Development'
    ],
    'Machine Learning Services': [
      'Machine Learning Consulting',
      'Model Implementation',
      'Predictive Analysis'
    ],
    'Business Intelligence': [
      'Data Visualization',
      'BI Implementation',
      'BI Consulting'
    ],
    'Digital Marketing and SEO': [
      'Social Media Marketing',
      'Search Engine Optimization (SEO)',
      'Online Advertising (PPC)'
    ],
    'Data Engineering': [
      'Data Pipeline Development',
      'ETL Processes',
      'Big Data Solutions'
    ],
    'Tech Consulting Services': [
      'Digital Transformation',
      'Cybersecurity',
      'General Tech Consulting'
    ],
    'Startups': [
      'Fintech',
      'Edtech',
      'Healthtech',
      'Biotech',
      'Agritech',
      'Foodtech',
      'Construction',
      'Others'
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceData({
      ...serviceData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setServiceData({
      ...serviceData,
      [name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setModalMessage('Authentication token is missing. Please log in.');
      setModalVariant('danger');
      setShowMessageModal(true);
      return;
    }

    if (serviceData.category === 'Startups' && !serviceData.url.startsWith('http')) {
      serviceData.url = 'http://' + serviceData.url;
    }

    const formData = new FormData();
    for (const key in serviceData) {
      formData.append(key, serviceData[key]);
    }

    try {
      const response = await axios.post('/api/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setModalMessage('Service uploaded successfully');
      setModalVariant('success');
      setShowMessageModal(true);
      console.log('Service uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading service', error.response || error.message || error);
      setModalMessage('Error uploading service: ' + (error.response?.data?.message || error.message));
      setModalVariant('danger');
      setShowMessageModal(true);
    }
  };

  const handleBack = () => {
    navigate('/manage-services');
  };

  return (
    <Container>
      <h1>Upload New Service</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={serviceData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {serviceData.category && (
          <Form.Group controlId="subcategory" className="mt-3">
            <Form.Label>Subcategory</Form.Label>
            <Form.Control
              as="select"
              name="subcategory"
              value={serviceData.subcategory}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Subcategory</option>
              {categories[serviceData.category].map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Form.Group controlId="name" className="mt-3">
          <Form.Label>Service Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={serviceData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={serviceData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {serviceData.category !== 'Startups' && (
          <Form.Group controlId="price" className="mt-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={serviceData.price}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        )}

        {serviceData.category === 'Startups' && (
          <Form.Group controlId="url" className="mt-3">
            <Form.Label>Startup URL Remember write with (http://)</Form.Label>
            <Form.Control
              type="url"
              name="url"
              value={serviceData.url}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        )}

        <Form.Group controlId="image" className="mt-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group controlId="video" className="mt-3">
          <Form.Label>Video</Form.Label>
          <Form.Control
            type="file"
            name="video"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Upload Service
        </Button>
        <Button variant="secondary" onClick={handleBack} className="mt-4 ms-2">
          Back to Manage Services
        </Button>
      </Form>

      {/* Modal to show messages */}
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

export default UploadService;
