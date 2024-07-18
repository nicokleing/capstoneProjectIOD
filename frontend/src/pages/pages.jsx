// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup, Form } from 'react-bootstrap';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleRemove = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/request-info', {
        cartItems,
        contactInfo
      });
      alert('Request submitted successfully');
      setCartItems([]);
      setContactInfo({ name: '', email: '', phone: '' });
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error submitting request', error);
      alert('Error submitting request');
    }
  };

  return (
    <Container>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {cartItems.map(item => (
              <ListGroup.Item key={item.id}>
                <Row>
                  <Col md={2}>
                    <img src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={6}>
                    {item.name}
                  </Col>
                  <Col md={2}>
                    ${item.price}
                  </Col>
                  <Col md={2}>
                    <Button variant="danger" onClick={() => handleRemove(item.id)}>Remove</Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <h2>Contact Information</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={contactInfo.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={contactInfo.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                name="phone"
                value={contactInfo.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">Submit Request</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
