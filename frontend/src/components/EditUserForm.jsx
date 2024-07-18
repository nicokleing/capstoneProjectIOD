// src/components/EditUserForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditUserForm = ({ userId, onUserUpdated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(data.name);
        setEmail(data.email);
        setUserType(data.isSuperAdmin ? 'SuperAdmin' : data.isAdmin ? 'Admin' : 'User');
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/users/${userId}`,
        {
          name,
          email,
          isAdmin: userType === 'Admin',
          isSuperAdmin: userType === 'SuperAdmin'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUserUpdated();
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
        Update
      </Button>
    </Form>
  );
};

export default EditUserForm;
