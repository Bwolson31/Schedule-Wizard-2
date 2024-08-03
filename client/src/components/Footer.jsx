import React from 'react';
import DonationButton from './donateButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <Container fluid className="bg-light mt-auto">
      <Row className="py-3 align-items-center text-center">
        <Col xs={12} md={10}>
          <p className="mb-0" style={{ color: 'green' }}>© 2024 ScheduleWizard. All rights reserved.</p>
        </Col>
        <Col xs={12} md={2}>
          <DonationButton amount="5.00" itemID="price_1IUx1FJ2iOysJZvP1LD3EzTR" />
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
