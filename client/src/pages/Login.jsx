import { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useMutation, ApolloError } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import Auth from '../auth/auth';

const Login = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [login, { error, data }] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleErrors = (error) => {
    console.log('Error object:', error);  
    if (error.networkError) {
      console.error('Network error:', error.networkError);
    } else if (error.graphQLErrors) {
      error.graphQLErrors.forEach(({ message, locations, path }) => {
        if (message.includes('CustomAuthError')) {
          console.error('Custom authentication error:', message);
        } else {
          console.error(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`);
        }
      });
    } else {
      console.error('Unknown error:', error);
    }
  };
  
  

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      if (data && data.login && data.login.token) {
        console.log('Login mutation response:', data);
        Auth.login(data.login.token);  // Store the token
        console.log("Token after login stored in localStorage:", localStorage.getItem('id_token'));
      } else {
        console.error('No token received');
        setShowAlert(true);
      }
    } catch (error) {
      handleErrors(error);  // Use the error handling function
      setShowAlert(true);
    }

    // Clear the form fields after login attempt
    setUserFormData({
      email: '',
      password: '',
    });

    // Double check if the token is stored correctly
    console.log("Final check - Token in localStorage:", localStorage.getItem('id_token'));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Title className="text-center mb-4 fs-2">Login</Card.Title>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <Alert
                dismissible
                onClose={() => setShowAlert(false)}
                show={showAlert}
                variant="warning"
                className="fs-5"
              >
                Something went wrong with your login!
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="email" className="fs-4">
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Your email"
                  name="email"
                  onChange={handleInputChange}
                  value={userFormData.email}
                  required
                  className="fs-5"
                />
                <Form.Control.Feedback type="invalid">
                  An email is required!
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="password" className="fs-4">
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Your password"
                  name="password"
                  onChange={handleInputChange}
                  value={userFormData.password}
                  required
                  className="fs-5"
                />
                <Form.Control.Feedback type="invalid">
                  A password is required!
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                disabled={!(userFormData.email && userFormData.password)}
                type="submit"
                variant="success"
                className="w-100 fs-4"
              >
                Submit
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
