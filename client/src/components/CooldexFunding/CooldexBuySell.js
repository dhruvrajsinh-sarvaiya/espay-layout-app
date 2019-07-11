import React, { Component } from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink, Form, FormGroup, Label,
    Input, Card, Row, Col,Button  } from 'reactstrap';
import classnames from 'classnames';
import { Link } from "react-router-dom";
import Switch from '@material-ui/core/Switch';
import paymenticon2 from 'Assets/image/paymenticon2.png';

export default class CooldexBuySell extends Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          activeTab: '1'
        };
      }
    
      toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }
      OnChange = name => (event, checked) => {
        this.setState({ [name]: checked });
    };
  render() {
    return (
      <div className="cooldexbuysellfun">
          <Card>
          <Nav tabs className="fiatmenu">
            <NavItem>
                <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggle('1'); }}
                >
              BUY
            </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => { this.toggle('2'); }}
                >
                SELL
                </NavLink>
            </NavItem>
        </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
                <Col sm="12">
                    <Form className="cooldexfiat-buyform">
                        <FormGroup>
                            <Label for="coinSelect">Select Coin</Label>
                            <Input type="select" name="select" id="coinSelect">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Row className="buytitleborder">
                                <Col sm={4} className="p-0"> <Label for="exampleSelect">Order Amount</Label></Col>
                                <Col sm={8} className="text-right p-0"><p>Your Limit - $10,000,00  <Link to="/">Increasw Limit</Link></p></Col>
                            </Row>
                            <Row>
                                <Col sm={5}><Input type="number" name="EURcoin" id="EURcoin" placeholder="EUR Coin" /></Col>
                                <Col sm={2}><p className="text-center pt-20">=</p></Col>
                                <Col sm={5}><Input type="number" name="BTCcoin" id="BTCcoin" placeholder="BTC Coin" /></Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="buytitleborder">
                                <Col sm={12} className="p-0">
                                    <Label for="coinSelect">Payment Method</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                            </Row>  
                            <p>A Bank Transfer Can Take Between One To Three Working Days.</p>  
                        </FormGroup>
                        <FormGroup>
                            <Row className="buytitleborder">
                                <Col sm={4} className="p-0">
                                    <Label for="coinSelect">Bitcoin Address</Label>
                                </Col>
                            </Row>   

                            <Input type="textarea" name="bitcoinaddress" id="bitcoinaddress" />
                            <Switch color="primary" checked={this.state.checkedA} onChange={this.OnChange('checkedA')} aria-label="checkedA" />
                            Save Address
                        </FormGroup>
                        <FormGroup>
                            <Label for="coinSelect">Transaction Costs</Label>
                            <Input type="number" name="trncost" id="trncost" placeholder="Total" />
                        </FormGroup>

                        <FormGroup>
                            <Row className="mt-70">
                                <Col sm={12}>
                                    <Button className="bitcoinbtnbuybtn">BUY Bitcoin</Button>
                                </Col>
                            </Row>
                        </FormGroup>
                         
                    </Form>
                </Col>
            </TabPane>
            <TabPane tabId="2">
                <Col sm="12">
                    <Form className="cooldexfiat-buyform">
                        <FormGroup>
                            <Label for="coinSelect">Select Coin</Label>
                            <Input type="select" name="select" id="coinSelect">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Row className="buytitleborder">
                                <Col sm={4} className="p-0"> <Label for="exampleSelect">Order Amount</Label></Col>
                                <Col sm={8} className="text-right p-0"><p>Your Limit - $10,000,00  <Link to="/">Increasw Limit</Link></p></Col>
                            </Row>
                            <Row>
                                <Col sm={5}><Input type="number" name="EURcoin" id="EURcoin" placeholder="EUR Coin" /></Col>
                                <Col sm={2}><p className="text-center pt-20">=</p></Col>
                                <Col sm={5}><Input type="number" name="BTCcoin" id="BTCcoin" placeholder="BTC Coin" /></Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="buytitleborder">
                                <Col sm={12} className="p-0">
                                    <Label for="coinSelect">Payment Method</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                                <Col sm={3}>
                                    <Link  className="paymentbox" to="/"><img className="img-fluid" src={paymenticon2} alt="Payment" title="Payment" /></Link>
                                </Col>
                            </Row>  
                            <p>A Bank Transfer Can Take Between One To Three Working Days.</p>  
                        </FormGroup>
                        <FormGroup>
                            <Row className="buytitleborder">
                                <Col sm={4} className="p-0">
                                    <Label for="coinSelect">Bitcoin Address</Label>
                                </Col>
                            </Row>   

                            <Input type="textarea" name="bitcoinaddress" id="bitcoinaddress" />
                            <Switch color="primary" checked={this.state.checkedA} onChange={this.OnChange('checkedA')} aria-label="checkedA" />
                            Save Address
                        </FormGroup>
                        <FormGroup>
                            <Label for="coinSelect">Transaction Costs</Label>
                            <Input type="number" name="trncost" id="trncost" placeholder="Total" />
                        </FormGroup>

                        <FormGroup>
                            <Row className="mt-70">
                                <Col sm={12}>
                                    <Button className="bitcoinbtnsellbtn">SELL Bitcoin</Button>
                                </Col>
                            </Row>
                        </FormGroup>
                         
                    </Form>
                </Col>
            </TabPane>
            </TabContent>
          </Card>
      </div>
    )
  }
}

