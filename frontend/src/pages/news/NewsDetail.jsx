import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Button, Image } from 'react-bootstrap';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState({});
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await axios.get(`/api/news/${id}`);
      setNews(data);
      setLikes(data.likes);
      setRating(data.rating);
      setNumReviews(data.numReviews);
    };

    fetchNews();
  }, [id]);

  const handleLike = async () => {
    const { data } = await axios.post(`/api/news/${id}/like`);
    setLikes(data.likes);
  };

  const handleRating = async (newRating) => {
    const { data } = await axios.post(`/api/news/${id}/rate`, { rating: newRating });
    setRating(data.rating);
    setNumReviews(data.numReviews);
  };

  return (
    <Container>
      <h1>{news.title}</h1>
      {news.mainImage && <Image src={news.mainImage} fluid />}
      <p>{news.content}</p>
      {news.additionalImages && news.additionalImages.map((img, index) => (
        <Image key={index} src={img} fluid />
      ))}
      {news.githubUrl && <p><a href={news.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a></p>}
      {news.sourceUrl && <p><a href={news.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a></p>}
      <Button onClick={handleLike}>Me gusta ({likes})</Button>
      <div>
        <h3>Valoración</h3>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} onClick={() => handleRating(star)}>
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
        <p>{rating.toFixed(1)} de {numReviews} valoraciones</p>
      </div>
    </Container>
  );
};

export default NewsDetail;
