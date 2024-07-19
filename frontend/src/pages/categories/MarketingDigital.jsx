import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const MarketingDigital = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services?category=Digital Marketing and SEO', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching digital marketing services:', error);
        setError('Error fetching digital marketing services');
        setLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <h1>Marketing Digital y SEO</h1>

      {/* Section for Video */}
      <div className="video-section my-4">
        <video
          className="d-block w-100"
          src="https://videos.pexels.com/video-files/3249454/3249454-uhd_2560_1440_25fps.mp4"
          autoPlay
          loop
          muted
        />
      </div>

      <Row>
        {services.map(service => (
          <Col key={service._id} sm={12} md={6} lg={4} xl={3}>
            <Card className="my-3 p-3 rounded">
              {service.image && <Card.Img src={`http://localhost:5000/${service.image}`} variant="top" />}
              <Card.Body>
                <Card.Title as="div">
                  <strong>{service.name}</strong>
                </Card.Title>
                <Card.Text as="div">
                  <div className="my-3">
                    ${service.price}
                  </div>
                  <div>{service.description}</div>
                  <div><strong>Subcategory: </strong>{service.subcategory}</div>
                </Card.Text>
                <Button variant="primary" href={`/service/${service._id}`}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MarketingDigital;