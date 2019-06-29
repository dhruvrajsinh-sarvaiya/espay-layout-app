import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";

export default class CooldexHigherLower extends Component {
  render() {
    return (
      <div className="CooldexHigherLowerbox">
            <Row>
                <Col md={12}>
                    <span>Funds = 1,000,000,000,00</span>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Link className="higherbtn" to="">Higher</Link>
                </Col>
                <Col md={6}>    
                    <Link className="lowerbtn" to="">Lower</Link>
                </Col>
            </Row>
      </div>
    )
  }
}
