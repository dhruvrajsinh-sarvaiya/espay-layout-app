import React, { Component } from 'react'
import { Row , Col , Container } from 'reactstrap';

export default class copyright extends Component {
  render() {
    return (
      <div className="copyright">
        <Container>
            <Col className="d-inline-block text-white" sm={6}>
              <p>© Copyright Cryto 2018 | All Right Revesed</p>
            </Col>
            <Col className="d-inline-block cms-style" sm={6}>
              <ul>
                <li><a href="/">Terms & Condition</a></li>
                <li><a href="/">Partners</a></li>
                <li><a href="/">Privacy Policy</a></li>
                <li><a href="/">Contact Us</a></li>
              </ul>
            </Col>
        </Container>
      </div>
    )
  }
}
