// src/components/RegisterUserForm.jsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RegisterUserForm = ({ onUserRegistered }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('User');
  const { token } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/users',
        { name, email, password, userType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUserRegistered();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="userType">
        <Form.Label>User Type</Form.Label>
        <Form.Control
          as="select"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="SuperAdmin">Super Admin</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
};

export default RegisterUserForm;
