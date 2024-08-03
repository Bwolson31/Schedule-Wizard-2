import { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import Auth from '../auth/auth';

const Login = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setSnpmhowAlert] = useState(false);
  const [login, { error, data }] = useMutation(LOGIN_USER);

  //update state based on form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
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

      Auth.login(data.login.token);
      // Redirect or perform any other action upon successful login
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }

    setUserFormData({
      email: '',
      password: '',
    });
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
                variant="success" // Changed variant to 'success'
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
