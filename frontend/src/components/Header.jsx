import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import CartModal from './CartModal';
import '../styles.css'; // Importa tu archivo de estilos

const Header = () => {
  const { user, logout } = useAuth();
  const [showCart, setShowCart] = useState(false);

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
                            {/* Coloca el logo acá */}
                            <img
                src="https://cdn-icons-png.flaticon.com/128/924/924985.png" 
                alt="Tech Market Place Logo"
                style={{ width: '30px', height: '30px', marginLeft: '10px' }}
              />
              Tech Market Place

            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <LinkContainer to="/news">
                <Nav.Link>
                  <i className="fas fa-newspaper"></i> News
                </Nav.Link>
              </LinkContainer>
              {user ? (
                <>
                  <NavDropdown title={user.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                  {user.isAdmin && (
                    <NavDropdown title="Admin" id="adminmenu">
                      <LinkContainer to="/manage-services">
                        <NavDropdown.Item>Manage Services</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/manage-news">
                        <NavDropdown.Item>Manage News</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {user.isSuperAdmin && (
                    <NavDropdown title="Super Admin" id="superadminmenu">
                      <LinkContainer to="/superadmin">
                        <NavDropdown.Item>Super Admin Panel</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/manage-services">
                        <NavDropdown.Item>Manage Services</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/manage-news">
                        <NavDropdown.Item>Manage News</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {!user.isAdmin && !user.isSuperAdmin && (
                    <LinkContainer to="/manage-user-services">
                      <Nav.Link>Manage My Services</Nav.Link>
                    </LinkContainer>
                  )}
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
          <Button variant="outline-light" onClick={handleShowCart} className="cart-button">
            <i className="fas fa-shopping-cart"></i> Cart
          </Button>
        </Container>
      </Navbar>
      <CartModal show={showCart} handleClose={handleCloseCart} />
    </header>
  );
};

export default Header;
