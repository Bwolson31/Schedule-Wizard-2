import { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations';
import Auth from '../auth/auth';

const Signup = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [addUser, { error, data }] = useMutation(ADD_USER);
  const navigate = useNavigate();

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
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      console.log('Signup mutation response:', data);
      if (data && data.addUser && data.addUser.token) {
        Auth.login(data.addUser.token); 
        console.log("Token stored successfully:", localStorage.getItem('id_token'));
        navigate('/profile');
      } else {
        console.error('No token received');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Title className="text-center mb-4 fs-2">Sign Up</Card.Title>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              {showAlert && (
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='warning' className="fs-5">
                  Something went wrong with your signup!
                </Alert>
              )}

              <Form.Group className='mb-3'>
                <Form.Label htmlFor='username' className="fs-4">Username</Form.Label>
                <Form.Control 
                  type='text' 
                  placeholder='Your username' 
                  name='username' 
                  onChange={handleInputChange} 
                  value={userFormData.username} 
                  required 
                  className="fs-5"
                />
                <Form.Control.Feedback type='invalid'>A username is required!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label htmlFor='email' className="fs-4">Email</Form.Label>
                <Form.Control 
                  type='email' 
                  placeholder='Your email address' 
                  name='email' 
                  onChange={handleInputChange} 
                  value={userFormData.email} 
                  required 
                  className="fs-5"
                />
                <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label htmlFor='password' className="fs-4">Password</Form.Label>
                <Form.Control 
                  type='password' 
                  placeholder='Your password' 
                  name='password' 
                  onChange={handleInputChange} 
                  value={userFormData.password} 
                  required 
                  className="fs-5"
                />
                <Form.Text id="passwordHelp" muted className="fs-6">
                  Your password must be 8-20 characters long, contain letters and numbers,
                  and must not contain spaces, special characters, or emoji.
                </Form.Text>
                <Form.Control.Feedback type='invalid'>A password is required!</Form.Control.Feedback>
              </Form.Group>

              <Button 
                disabled={!(userFormData.username && userFormData.email && userFormData.password)} 
                type='submit' 
                variant='success' 
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

export default Signup;
