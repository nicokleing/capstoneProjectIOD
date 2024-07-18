// src/pages/ServiceList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ServiceList = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServices(data);
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };

    fetchServices();
  }, [token]);

  return (
    <Container>
      <h1 className="my-4">Services</h1>
      <Row>
        {services.map(service => (
          <Col key={service._id} sm={12} md={6} lg={4}>
            <Card className="my-3">
              <Card.Img variant="top" src={service.image} />
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Card.Text>Price: {service.price}</Card.Text>
                <Link to={`/service/${service._id}`} className="btn btn-primary">View Details</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ServiceList;
