import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Service from './pages/services/Service';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminPanel from './pages/admin/AdminPanel';
import SuperAdminPanel from './pages/admin/SuperAdminPanel';
import UploadService from './pages/services/UploadService';
import Chat from './components/Chat';
import SearchResults from './pages/SearchResults';
import NewsDetail from './pages/news/NewsDetail';
import NewsForm from './pages/news/NewsForm';
import Profile from './pages/auth/Profile';
import ManageServices from './pages/admin/ManageServices';
import ManageNews from './pages/admin/ManageNews';
import ChangePassword from './pages/auth/ChangePassword';
import EditService from './pages/services/ServiceEdit';
import WebDevelopment from './pages/categories/WebDevelopment'; 
import BusinessIntelligence from './pages/categories/BusinessIntelligence'; 
import MarketingDigital from './pages/categories/MarketingDigital'; 
import InsumosTecnologicos from './pages/categories/InsumosTecnologicos'; 
import ConsultoriaTecnologica from './pages/categories/ConsultoriaTecnologica'; 
import CategoryPage from './pages/categories/CategoryPage';  
import MachineLearning from './pages/categories/MachineLearning';
import InfoRequests from './pages/admin/InfoRequests'; 
import NewsListPage from './pages/news/NewsListPage'; 
import Startups from './pages/categories/Startups'; // Asegúrate de importar la página Startups

import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();

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
            {user?.isAdmin && <Route path="/admin" element={<AdminPanel />} />}
            {user?.isSuperAdmin && <Route path="/superadmin" element={<SuperAdminPanel />} />}
            <Route path="/news/:id" element={<NewsDetail />} />
            {user && <Route path="/upload-service" element={<UploadService />} />}
            {user && <Route path="/edit-service/:id" element={<EditService />} />}
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/machine-learning" element={<MachineLearning />} />
            <Route path="/business-intelligence" element={<BusinessIntelligence />} />
            <Route path="/marketing-digital" element={<MarketingDigital />} />
            <Route path="/insumos-tecnologicos" element={<InsumosTecnologicos />} />
            <Route path="/consultoria-tecnologica" element={<ConsultoriaTecnologica />} />
            <Route path="/startups" element={<Startups />} />
            <Route path="/news" element={<NewsListPage />} />
            {user && <Route path="/create-news" element={<NewsForm />} />}
            <Route path="/search/:keyword" element={<SearchResults />} />
            {user && <Route path="/profile" element={<Profile />} />}
            {user?.isAdmin && <Route path="/manage-services" element={<ManageServices />} />}
            {user?.isAdmin && <Route path="/manage-news" element={<ManageNews />} />}
            {user?.isAdmin && <Route path="/info-requests" element={<InfoRequests />} />}
            {user && <Route path="/change-password" element={<ChangePassword />} />}
          </Routes>
        </Container>
      </main>
      <Chat />
      <Footer />
    </Router>
  );
};

export default App;
