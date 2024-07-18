// src/components/CartModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Row, Col, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CartModal = ({ show, handleClose }) => {
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (show) {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(storedCart);
      calculateTotalPrice(storedCart);
    }
  }, [show]);

  const calculateTotalPrice = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + item.service.price * item.qty, 0);
    setTotalPrice(total);
  };

  const handleRemove = (serviceId) => {
    const updatedCart = cart.filter(item => item.service._id !== serviceId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  const handleQtyChange = (serviceId, qty) => {
    const updatedCart = cart.map(item => {
      if (item.service._id === serviceId) {
        return { ...item, qty: Number(qty) };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  const handleRequestInfo = async () => {
    if (!email || !name || !phone || !date) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/info-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, date, cartItems: cart })
      });

      if (response.ok) {
        setSuccess('Information request sent successfully');
        localStorage.removeItem('cart');
        setCart([]);
        setEmail('');
        setName('');
        setPhone('');
        setDate('');
        setError('');
        setTimeout(() => {
          setSuccess('');
          handleClose();
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send information request');
      }
    } catch (error) {
      setError('Error sending information request');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>My Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {cart.length > 0 ? (
          <ListGroup variant="flush">
            {cart.map(item => (
              <ListGroup.Item key={item.service._id}>
                <Row>
                  <Col md={6}>
                    <Link to={`/service/${item.service._id}`} onClick={handleClose}>
                      {item.service.name}
                    </Link>
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.service._id, e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    ${item.service.price * item.qty}
                  </Col>
                  <Col md={2}>
                    <Button variant="danger" onClick={() => handleRemove(item.service._id)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Your cart is empty</p>
        )}
        <Form.Group className="mt-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="formPhone">
          <Form.Label>Phone number</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter phone number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="formDate">
          <Form.Label>Request date</Form.Label>
          <Form.Control 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </Form.Group>
        <div className="mt-3">
          <h5>Total Price: ${totalPrice}</h5>
        </div>
      </Modal.Body>
      {cart.length > 0 && (
        <Modal.Footer>
          <Button variant="primary" onClick={handleRequestInfo}>
            Request Information
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CartModal;
