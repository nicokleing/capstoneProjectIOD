import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
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

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`/api/services/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServiceData(data);
      } catch (error) {
        console.error('Error fetching service', error);
      }
    };

    fetchService();
  }, [id, token]);

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
    const formData = new FormData();
    for (const key in serviceData) {
      formData.append(key, serviceData[key]);
    }
    try {
      await axios.put(`/api/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Service updated successfully');
      navigate('/manage-services');
    } catch (error) {
      console.error('Error updating service', error);
      alert('Error updating service: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container>
      <h1>Edit Service</h1>
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
          <Form.Group controlId="subcategory">
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

        <Form.Group controlId="name">
          <Form.Label>Service Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={serviceData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
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
          <Form.Group controlId="price">
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
          <Form.Group controlId="url">
            <Form.Label>Startup URL</Form.Label>
            <Form.Control
              type="url"
              name="url"
              value={serviceData.url}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        )}

        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group controlId="video">
          <Form.Label>Video</Form.Label>
          <Form.Control
            type="file"
            name="video"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Service
        </Button>
      </Form>
    </Container>
  );
};

export default EditService;
