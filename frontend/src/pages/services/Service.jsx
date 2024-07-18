// src/pages/Service.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image, ListGroup } from 'react-bootstrap';
import AddToCartButton from '../../components/AddToCartButton';

const Service = () => {
  const { id } = useParams();
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`/api/services/${id}`);
        setService(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service:', error);
        setError('Error fetching service');
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={6}>
          {service.image && <Image src={`http://localhost:5000/${service.image}`} alt={service.name} fluid />}
        </Col>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{service.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: ${service.price}
            </ListGroup.Item>
            <ListGroup.Item>
              Description: {service.description}
            </ListGroup.Item>
            <ListGroup.Item>
              Subcategory: {service.subcategory}
            </ListGroup.Item>
            <ListGroup.Item>
              <AddToCartButton service={service} />
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Service;
