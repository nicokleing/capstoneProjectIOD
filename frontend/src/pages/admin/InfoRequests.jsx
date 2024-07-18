// src/pages/InfoRequests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const InfoRequests = () => {
  const { token, user } = useAuth();
  const [infoRequests, setInfoRequests] = useState([]);

  useEffect(() => {
    const fetchInfoRequests = async () => {
      try {
        const { data } = await axios.get('/api/info-requests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInfoRequests(data);
      } catch (error) {
        console.error('Error fetching info requests', error);
      }
    };

    if (user.isAdmin) {
      fetchInfoRequests();
    }
  }, [token, user]);

  return (
    <Container>
      <h1 className="my-4">Information Requests</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Request Date</th>
            <th>Cart Items</th>
            <th>Requested At</th>
          </tr>
        </thead>
        <tbody>
          {infoRequests.map(request => (
            <tr key={request._id}>
              <td>{request.name}</td>
              <td>{request.email}</td>
              <td>{request.phone}</td>
              <td>{new Date(request.date).toLocaleDateString()}</td>
              <td>
                <ul>
                  {request.cartItems.map(item => (
                    <li key={item._id}>
                      {item.service.name} - {item.qty} x ${item.service.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{new Date(request.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default InfoRequests;
