import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const CategoryPage = ({ category }) => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const subcategories = {
    'Desarrollo Web y Aplicaciones': [
      'Desarrollo de Sitios Web',
      'Desarrollo de Aplicaciones Móviles',
      'Desarrollo de Aplicaciones Web'
    ],
    'Servicios de Machine Learning': [
      'Consultoría en Machine Learning',
      'Implementación de Modelos',
      'Análisis Predictivo'
    ],
    'Business Intelligence': [
      'Visualización de Datos',
      'Implementación de BI',
      'Consultoría en BI'
    ],
    'Marketing Digital y SEO': [
      'Marketing en Redes Sociales',
      'Posicionamiento Web (SEO)',
      'Publicidad en Línea (PPC)'
    ],
    'Insumos Tecnológicos': [
      'Teclados',
      'Pantallas',
      'Notebooks',
      'Otros Equipos Tecnológicos (nuevos y reacondicionados)'
    ],
    'Servicios de Consultoría Tecnológica': [
      'Transformación Digital',
      'Ciberseguridad',
      'Consultoría General en Tecnología'
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
    const fetchServices = async () => {
      try {
        const query = `/api/services?category=${category}${selectedSubcategory ? `&subcategory=${selectedSubcategory}` : ''}`;
        const { data } = await axios.get(query, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServices(data);
      } catch (error) {
        console.error(`Error fetching services for category ${category}:`, error);
      }
    };

    fetchServices();
  }, [category, selectedSubcategory, token]);

  return (
    <Container>
      <h1 className="my-4">{category}</h1>
      {subcategories[category] && (
        <Form.Group controlId="subcategorySelect">
          <Form.Label>Subcategory</Form.Label>
          <Form.Control as="select" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
            <option value="">All</option>
            {subcategories[category].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
      <Row>
        {services.map(service => (
          <Col key={service._id} sm={12} md={6} lg={4} xl={3}>
            <Card className="my-3 p-3 rounded">
              {service.image && <Card.Img src={service.image} variant="top" />}
              <Card.Body>
                <Card.Title as="div">
                  <strong>{service.name}</strong>
                </Card.Title>
                <Card.Text as="div">
                  <div className="my-3">
                    ${service.price}
                  </div>
                  <div>{service.description}</div>
                  <div>Subcategory: {service.subcategory}</div>
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

export default CategoryPage;
