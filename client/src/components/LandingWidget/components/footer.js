import React, { Component } from 'react'
import { Container , Row , Col , Button , Img } from 'reactstrap';
import Footerlogo from '../../../assets/img/site-logo.png';

export default class footer extends Component {
  render() {
    return (
      <div className="mainfooter">
        <Container>
          <Row>
            <Col className="footer-logo" sm={3}>
              <img src={Footerlogo} href="/" />
            </Col>
            <Col className="about" sm={2}>
              <h6>Company</h6>
                <ul>
                  <li><a className="text-success" href="/">Become a Vendor</a></li>
                  <li><a href="/">Affilites</a></li>
                  <li><a href="/">Our Blog</a></li>
                  <li><a href="/">Privacy Policy</a></li>
                </ul>
            </Col>
            <Col className="contact" sm={3}>
              <h6>Company</h6>
                <ul>
                  <li>Support : <a href="/">support@crytario.com </a></li>
                  <li>Listing Application : <a href="/">listing@demo.com</a></li>
                  <li className="mb-15">Twitter : <a href="/">twitter@crytario.com</a></li>
                  <li><i className="zmdi ti-google zmdi-hc-1x text-white mr-15"><a href="/"></a></i>
                      <i className="zmdi ti-skype zmdi-hc-1x text-white mr-15"><a href="/"></a></i>
                      <i className="zmdi ti-facebook zmdi-hc-1x text-white mr-15"><a href="/"></a></i>
                      <i className="zmdi ti-github zmdi-hc-1x text-white mr-15"><a href="/"></a></i>
                      <i className="zmdi ti-twitter zmdi-hc-1x text-white mr-15"><a href="/"></a></i>
                  </li>
                </ul>
            </Col>
            <Col className="appdowanload" sm={4}>
              <h6>App Dowanload</h6>
                <ul>
                  <li className="mb-15"><a className="mr-15" href="/"><i className="zmdi ti-apple zmdi-hc-1x text-white mr-10" /><span>App Store</span></a>
                      <a href="/"><i className="zmdi ti-apple zmdi-hc-1x text-white mr-10" /><span>App  Store</span></a></li>
                  <li className="mb-15">Volume (24H) 5,973.25694 BTC =40,67,12596 USD</li>
                  <li className="mb-15"><i className="zmdi ti-apple zmdi-hc-1x text-white mr-10" />2018-09-22 | 09:21 (UTC-8)</li>
                </ul>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
