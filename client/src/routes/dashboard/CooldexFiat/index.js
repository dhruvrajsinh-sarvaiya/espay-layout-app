import React, { Component } from 'react';
import {Container, Row, Col, Card } from 'reactstrap';
// import components for trading dashboard
import {
  CooldexFiatLeft,
  CooldexFiatRight,
} from "Components/CooldexFiat";

export default class CooldexFiat extends Component {
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col md={7}>
                <CooldexFiatLeft />
            </Col>
            <Col md={5}>
                <CooldexFiatRight />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
