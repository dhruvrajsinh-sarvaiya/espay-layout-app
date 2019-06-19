
import React, { Component } from 'react';
import {Container,Row, Col,Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input} from 'reactstrap';

export default class headerslider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div className="mainbanner">
            <Container>
                <Col md={12}>
                    <h1>The world's leading cryptocurrency trading platform</h1>
                    <span>Cryptorio has integeated TradingView charts so you can enjoy a complete suite of tools to</span>
                    <span>draw,annotation,dowanload and share your charts.</span>
                        <Row>
                            <Col md={3} />
                            <Col md={3}>
                              <a to="/" className="banner-bt1">OPEN A LIVE ACCOUNT</a>
                            </Col>
                            <Col md={3}>
                              <a to="/" className="banner-bt2">TRY FREE FOR 30-DAYS</a>
                            </Col>
                            <Col md={3} />
                        </Row>
                </Col>

              <Row>             
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                  <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="exampleEmail">Email</Label>
                      <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                    </FormGroup>
                    <FormGroup>
                      <Label for="examplePassword">Password</Label>
                      <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleSelect">Select</Label>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                  </ModalFooter>
                </Modal>          
              </Row>

              </Container>
          </div>
    
    )
  }
}
