import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Service from './pages/Service';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import UploadService from './pages/UploadService';
import WebDevelopment from './pages/WebDevelopment';
import MachineLearning from './pages/MachineLearning';
import BusinessIntelligence from './pages/BusinessIntelligence';
import MarketingDigital from './pages/MarketingDigital';
import InsumosTecnologicos from './pages/InsumosTecnologicos';
import ConsultoriaTecnologica from './pages/ConsultoriaTecnologica';
import Chat from './components/Chat';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import NewsForm from './pages/NewsForm';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/service/:id" element={<Service />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/upload-service" element={<UploadService />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/machine-learning" element={<MachineLearning />} />
            <Route path="/business-intelligence" element={<BusinessIntelligence />} />
            <Route path="/marketing-digital" element={<MarketingDigital />} />
            <Route path="/insumos-tecnologicos" element={<InsumosTecnologicos />} />
            <Route path="/consultoria-tecnologica" element={<ConsultoriaTecnologica />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/create-news" element={<NewsForm />} />
          </Routes>
        </Container>
      </main>
      <Chat />
      <Footer />
    </Router>
  );
}

export default App;
