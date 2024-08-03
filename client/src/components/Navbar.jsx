import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import { useAuth } from '../auth/AuthContext';
import Auth from '../auth/auth';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavbarComponent = () => {
  //const { isAuthenticated, user, logout } = useAuth();
  //const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/');
  // };

  //console.log('Navbar - User:', user);

  return (
    <Navbar bg="green" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className='ms-auto'>Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* {isAuthenticated && user ? ( */}
            {Auth.loggedIn() ? (
              <>
                <Nav.Link as={Link} to='/profile/'>Profile</Nav.Link>
                <Nav.Link as={Link} to="/create-schedule">Create Schedule</Nav.Link>
                <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavbarComponent; 