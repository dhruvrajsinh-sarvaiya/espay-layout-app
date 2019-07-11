import React, { Component } from 'react';
import {Container,Row,Col} from 'reactstrap';
import { Link } from "react-router-dom";
import FooterLogo from '../../../assets/image/CoolDexLogo-tm.png';

import Socialicon from '../../../assets/image/social.png';
import Socialicon1 from '../../../assets/image/social1.png';
import Socialicon2 from '../../../assets/image/social2.png';
import Socialicon3 from '../../../assets/image/social3.png';
import Socialicon4 from '../../../assets/image/social4.png';

export default class footer extends Component {
  render() {
    return (
      <div className="footerbg">
        <Container>
            <Row>
                <Col md={6}>
                    <img className="img-fluid footerlogo" src={FooterLogo} alt="Coin" title="Coin" />
                </Col>
                <Col md={{size:1,offset:2}}>
                    <div className="footerlist">
                        <span>About</span>
                        <ul>
                            <li><Link to="/">About Us</Link></li>
                            <li><Link to="/">Contact</Link></li>
                            <li><Link to="/">Mission</Link></li>
                            <li><Link to="/">Vision</Link></li>
                        </ul>
                    </div>
                </Col>
                <Col md={1} className="p-0">
                    <div className="footerlist">
                        <span>Get Started</span>
                        <ul>
                            <li><Link to="/">Tutorials</Link></li>
                            <li><Link to="/">Resources</Link></li>
                            <li><Link to="/">Guides</Link></li>
                            <li><Link to="/">Examples</Link></li>
                            <li><Link to="/">Docs</Link></li>
                        </ul>
                    </div>
                </Col>
                <Col md={1}>
                    <div className="footerlist">
                        <span>Privacy</span>
                        <ul>
                            <li><Link to="/">Legal</Link></li>
                            <li><Link to="/">Terms</Link></li>
                            <li><Link to="/">Policy</Link></li>
                        </ul>
                    </div>
                </Col>
                <Col md={1}>
                    <div className="footerlist">
                        <span>Support</span>
                        <ul>
                            <li><Link to="/">Call us</Link></li>
                            <li><Link to="/">Chat</Link></li>
                            <li><Link to="/">Ticket</Link></li>
                        </ul>
                    </div>
                </Col>
            </Row>
        
            <Row className="coprightmain">
                <Col md={6}>
                    <span>© 2018 All rights reserved </span>
                </Col>
                <Col md={6}>
                <ul>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon1} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon2} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon3} alt="social" title="social" /></Link></li>
                    <li><Link to="/"><img className="img-fluid" src={Socialicon4} alt="social" title="social" /></Link></li>
                </ul>
                </Col>
            </Row> 
        </Container>
      </div>
    )
  }
}
