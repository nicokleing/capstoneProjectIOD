import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const NewsListPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get('/api/news');
        setNewsList(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const handleShowModal = (news) => {
    setSelectedNews(news);
    setLikes(news.likes || 0);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedNews(null);
    setShowModal(false);
  };

  const handleLike = async () => {
    if (!selectedNews) return;

    try {
      const { data } = await axios.post(`/api/news/${selectedNews._id}/like`);
      setLikes(data.likes);
    } catch (error) {
      console.error('Error liking news:', error);
    }
  };

  return (
    <Container>
      <h1 className="my-4">News</h1>

      {/* Section for Video */}
      <div className="video-section my-4">
        <video
          className="d-block w-100"
          src="https://videos.pexels.com/video-files/3944853/3944853-uhd_2732_1440_25fps.mp4" // Reemplazar con la URL de tu video
          autoPlay
          loop
          muted
        />
      </div>

      <Row>
        {newsList.map((newsItem) => (
          <Col key={newsItem._id} sm={12} md={6} lg={4} xl={3}>
            <Card className="mb-4">
              <Card.Img variant="top" src={`http://localhost:5000/${newsItem.mainImage || 'placeholder.jpg'}`} />
              <Card.Body>
                <Card.Title>{newsItem.title}</Card.Title>
                <Card.Text>{newsItem.content.substring(0, 100)}...</Card.Text>
                <Button variant="primary" onClick={() => handleShowModal(newsItem)}>
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNews?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNews?.mainImage && <img src={`http://localhost:5000/${selectedNews.mainImage}`} alt={selectedNews.title} className="img-fluid mb-3" />}
          <p>{selectedNews?.content}</p>
          {selectedNews?.additionalImages && selectedNews.additionalImages.map((img, index) => (
            <img key={index} src={`http://localhost:5000/${img}`} alt={`Additional ${index}`} className="img-fluid mb-2" />
          ))}
          {selectedNews?.githubUrl && <p><a href={selectedNews.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a></p>}
          {selectedNews?.sourceUrl && <p><a href={selectedNews.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a></p>}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button variant="outline-primary" onClick={handleLike}>
              <FontAwesomeIcon icon={faThumbsUp} /> {likes}
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewsListPage;
