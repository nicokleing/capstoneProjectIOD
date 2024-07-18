import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const SearchResults = () => {
  const { keyword } = useParams();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await axios.get(`/api/services/search/${keyword}`);
      setServices(data);
    };

    fetchServices();
  }, [keyword]);

  return (
    <Container>
      <h1>Search Results</h1>
      {services.length === 0 ? (
        <h3>No services found</h3>
      ) : (
        <Row>
          {services.map((service) => (
            <Col key={service._id} sm={12} md={6} lg={4} xl={3}>
              <Card className="my-3 p-3 rounded">
                <Card.Img src={service.image} variant="top" />
                <Card.Body>
                  <Card.Title as="div">
                    <strong>{service.name}</strong>
                  </Card.Title>
                  <Card.Text as="div">
                    <div className="my-3">
                      ${service.price}
                    </div>
                  </Card.Text>
                  <Button variant="primary" href={`/service/${service._id}`}>View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SearchResults;
