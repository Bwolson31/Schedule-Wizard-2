import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../auth/auth';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { categoryOptions } from './CategorySelector';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate(`/search?category=${category}`);
  };

  return (
    <BootstrapNavbar expand="lg" className="custom-navbar" variant="light">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-brand">
          ScheduleWizard
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Categories Dropdown */}
            <NavDropdown title="Categories" id="category-dropdown" align="end">
              {categoryOptions.map(option => (
                <NavDropdown.Item
                  key={option.value}
                  onClick={() => handleCategorySelect(option.value)}
                >
                  {option.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            {/* Links based on authentication */}
            {Auth.loggedIn() ? (
              <>
                <Nav.Link as={Link} to='/rated-schedules'>Rated Schedules</Nav.Link>
                <Nav.Link as={Link} to='/profile/'>Profile</Nav.Link>
                <Nav.Link as={Link} to="/create-schedule">Create Schedule</Nav.Link>
                <Button variant="outline-light" onClick={Auth.logout} className="logout-btn">Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;