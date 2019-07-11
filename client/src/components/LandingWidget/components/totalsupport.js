import React, { Component } from 'react'
import { Container , Row , Col } from 'reactstrap';

export default class totalsupport extends Component {
  render() {
    return (  
        <div className="totalsupport">
        <Container>

          <Row>
            <Col className="pb-30" md={4} >
            <div className="supportpacks">
                <i className="zmdi ti-support zmdi-hc-4x" />
                <span className="text-center text-white">24-hour support</span>
                </div>
            </Col>
            
            <Col className="pb-30" md={4}>
              <div className="supportpacks">
                <i className="zmdi ti-support zmdi-hc-4x" />
                <span className="text-center text-white">Growing functionally</span>
              </div>
            </Col>

            <Col className="pb-30" md={4}>
              <div className="supportpacks">
                <i className="zmdi ti-support zmdi-hc-4x" />
                <span className="text-center text-white">Unblimited deposits & withdrawals</span>
                </div>
            </Col>
          </Row>

          </Container>     
      </div>
    )
  }
}
