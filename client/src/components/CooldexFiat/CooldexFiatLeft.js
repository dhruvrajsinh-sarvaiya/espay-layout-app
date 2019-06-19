import React, { Component } from 'react';
import {  Row, Col } from 'reactstrap';

export default class CooldexFiatLeft extends Component {
  render() {
    return (
      <div className="mt-70">
          <Row>
            <Col md={12}>
                <div className="cooldexfiattitle">
                   <span>Buying bitcoins with Bank Transfer </span>
                   <p>Buying bitcoins quickly and easily</p>
                </div>
                <ul className="cooldexfiatlist">
                  <li>
                    <Row>
                        <Col md={1}> 
                            <i>1</i>
                        </Col>
                        <Col md={10}> 
                          <span>Fill out the order form </span>
                          <p>MAke sure the receiving address and the amount of coins are stated correctly on the form. 
                            You can find your receiving address in your wallet. 
                            If you\'ve got any questions please contact our support team, 
                            we\'re always glad to help! </p>
                        </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                        <Col md={1}> 
                            <i>2</i>
                        </Col>
                        <Col md={10}> 
                          <span>Choose checkout</span>
                          <p>Click \'Buy bitcoin\' and agree to our general terms and conditions. </p>
                        </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                        <Col md={1}> 
                            <i>3</i>
                        </Col>
                        <Col md={10}> 
                          <span>Verify your transaction</span>
                          <p>This is your last possibility to make sure the receiving address is right. 
                            Is the wrong address stated? Please contact our support team. </p>
                        </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                        <Col md={1}> 
                            <i>4</i>
                        </Col>
                        <Col md={10}> 
                          <span>Receive your bitcoins</span>
                          <p>We strive to send your coins as soon as possible after your payment. Is this your 
                            first order or are you using a bank account that you haven\'t used before on our platform? 
                            Then we will manually check if the name that\'s registered with us, matches the name that\'s connected to
                             he payment card you\'ve used. This can be done during business hours only.
                             When you\'re placing this order outside of our business hours, we will check it the next day. </p>
                        </Col>
                    </Row>
                  </li>
                </ul>
            </Col>
          </Row>
      </div>
    )
  }
}

