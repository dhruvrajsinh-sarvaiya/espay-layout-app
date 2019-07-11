import React, { Component } from 'react';
import {Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';

export default class CooldexBuyCheckout extends Component {
  render() {
    return (
      <div>
        <Row>
            <Col md={6}>
                <div className="buyCheckoutbox">
                    <Form>
                        <FormGroup>
                            <Input type="text" name="buybitcoin" id="buybitcoin" placeholder="0" />
                            <span>BTC</span>
                        </FormGroup>
                        <Button className="bitcoinbtn">BUY BITCOIN</Button>
                    </Form>
                </div>
            </Col>
            <Col md={6}>
                <div className="buyCheckoutbox">
                    <Form>
                        <FormGroup>
                            <Input type="text" name="cashout" id="cashout" placeholder="0" />
                            <span>BTC</span>
                        </FormGroup>
                        <Button className="checkoutbtn">CASH OUT</Button>
                    </Form>
                </div>
            </Col>
        </Row>
      </div>
    )
  }
}
