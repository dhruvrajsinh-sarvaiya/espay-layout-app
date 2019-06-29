import React, { Component } from 'react';
import {
  Container, Collapse, Navbar, NavbarToggler, NavbarBrand
  , Nav, NavItem, NavLink
} from 'reactstrap';
import CooddeskLogo from '../../../assets/image/CoolDexLogo-tm.png';

export default class HeaderWidget extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
    localStorage.setItem('locale', 'en');
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div className="Cooldeskheader">
        <Container>
          <Navbar className="p-o" expand="md">
            <NavbarBrand href="/signin"><img className="img-fluid" src={CooddeskLogo} alt="" title="" /></NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto Headerbtn" navbar>
                <NavItem>
                  <NavLink href="/signin">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/signup">Sign Up</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </Container>
      </div>
    )
  }
}
