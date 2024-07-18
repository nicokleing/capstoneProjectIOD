import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa'; // Importar el ícono
import '../styles.css'; // Asegúrate de que la ruta sea correcta

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services');
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const featuredServices = services.slice(0, 8); // Limitar a los primeros 8 servicios

  return (
    <>
      <Carousel>
      <Carousel.Item>
        <video
          className="d-block w-100 carousel-video"
          src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4"
          alt="First slide"
          autoPlay
          loop
          muted
        />
        <Carousel.Caption>
            <h5>Technological Innovation</h5>
            <p>Explore the latest trends and technological advancements transforming the industry. From artificial intelligence to IoT, discover how innovation is driving the future.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
        <video
          className="d-block w-100 carousel-video"
          src="https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_30fps.mp4"
          alt="First slide"
          autoPlay
          loop
          muted
        />
        <Carousel.Caption>
            <h5>Machine Learning Services</h5>
            <p>Harness the power of advanced data analysis. Our machine learning services help you make informed decisions and predict future trends for your business.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
        <video
          className="d-block w-100 carousel-video"
          src="https://videos.pexels.com/video-files/1350205/1350205-hd_1920_1080_30fps.mp4"
          alt="First slide"
          autoPlay
          loop
          muted
        />
        <Carousel.Caption>
            <h5>Web Development</h5>
            <p>Build your online presence with our expert web development services. From custom websites to mobile applications, we offer solutions tailored to your needs.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <main>
        <Container className="py-5">
          <div className="text-center my-4">
            <Button variant="primary" href="/startups">View Startups <FaArrowRight /></Button>
          </div>

          <h2 className="my-4 text-center">Popular Categories</h2>
          <Row>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>Web and Application Development</strong>
                  </Card.Title>
                  <Card.Text as="div">                
                    Explore services related to website and app development.
                  </Card.Text>
                  <Button variant="primary" href="/web-development">Explore <FaArrowRight /></Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>Machine Learning Services</strong>
                  </Card.Title>
                  <Card.Text as="div">
                  Find consulting and implementation services for Machine Learning models.
                  </Card.Text>
                  <Button variant="primary" href="/machine-learning">Explore <FaArrowRight /></Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>Business Intelligence</strong>
                  </Card.Title>
                  <Card.Text as="div">
                  Improve your business with Business Intelligence solutions.
                  </Card.Text>
                  <Button variant="primary" href="/business-intelligence">Explore <FaArrowRight /></Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>Digital Marketing and SEO</strong>
                  </Card.Title>
                  <Card.Text as="div">
                  Discover digital marketing and search engine optimization services.
                  </Card.Text>
                  <Button variant="primary" href="/marketing-digital">Explore <FaArrowRight /></Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>Data Engineering</strong>
                  </Card.Title>
                  <Card.Text as="div">
                  Explore services related to data engineering, including data pipeline development, ETL processes, and big data solutions.
                  </Card.Text>
                  <Button variant="primary" href="/insumos-tecnologicos">Explore <FaArrowRight /></Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>Technology Consulting Services</strong>
                  </Card.Title>
                  <Card.Text as="div">
                  Find consulting services in digital transformation, cybersecurity and more.
                  </Card.Text>
                  <Button variant="primary" href="/consultoria-tecnologica">Explore <FaArrowRight /></Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h2 className="my-4 text-center">Featured Services</h2>
          <Row>
            {featuredServices.map(service => (
              <Col key={service._id} sm={12} md={6} lg={4} xl={3}>
                <Card className="my-3 p-3 rounded card-hover">
                  <Card.Img src={`http://localhost:5000/${service.image}`} variant="top" />
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

          <h2 className="my-4 text-center">What Our Customers Say</h2>
          <Row>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover testimonial-card">
                <Card.Body>
                  <Card.Text as="div">
                    "Great services! Helped my startup a lot."
                  </Card.Text>
                  <footer className="blockquote-footer">John Doe</footer>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover testimonial-card">
                <Card.Body>
                  <Card.Text as="div">
                    "The technology services are top-notch."
                  </Card.Text>
                  <footer className="blockquote-footer">Jane Smith</footer>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="my-3 p-3 rounded card-hover testimonial-card">
                <Card.Body>
                  <Card.Text as="div">
                    "Excellent marketing services. Highly recommend!"
                  </Card.Text>
                  <footer className="blockquote-footer">Mike Johnson</footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default Home;
