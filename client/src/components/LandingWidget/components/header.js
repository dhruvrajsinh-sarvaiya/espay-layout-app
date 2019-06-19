import React, { Component } from 'react'
import {Container,Row, Col,  Collapse , Navbar , NavbarToggler , NavbarBrand
        , Nav , NavItem , NavLink } from 'reactstrap';

export default class header extends Component {

    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          isOpen: false
        };
      }
      toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }
      
  render() {
    return (
        
        <div className="headermain">
            <Container>
                <Row>
                    <Col>
                        <Navbar color="faded" expand="md">
                            <NavbarBrand href="/">Espay-Logo</NavbarBrand>
                                <NavbarToggler onClick={this.toggle} />
                                <Collapse isOpen={this.state.isOpen} navbar>

                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink exact to="/" className="is-active">HOME</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink exact to="/">MARKET</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink exact to="/">ASSET</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink exact to="/">ACCOUNT</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink exact to="/">NEWS</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/">SUPPORT</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/">SIGN UP | LOGIN </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/">EXCHANGE </NavLink>
                                </NavItem>
                            </Nav>
                            
                        </Collapse>
                        </Navbar>
                    </Col>
                </Row>
            </Container>
        </div>
    )
  }
}
