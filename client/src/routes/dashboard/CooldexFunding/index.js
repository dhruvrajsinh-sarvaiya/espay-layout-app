import React, { Component } from 'react';
import {Container, Row, Col } from 'reactstrap';

import {
    CooldexBuySell,
    CooldexFundingChart,
    CooldexHigherLower,
    CooldexBuyCheckout,
    CooldexTooltipSlider,
} from "Components/CooldexFunding";

export default class CooldexFunding extends Component {
  render() {
    return (
      <div>
       <Container fluid>
          <Row>
            <Col md={3}>
                <CooldexBuySell />
            </Col>
            <Col md={9}>
                <CooldexFundingChart />
                <CooldexTooltipSlider />
                <CooldexHigherLower />
                <CooldexBuyCheckout />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
