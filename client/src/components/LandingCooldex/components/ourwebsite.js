import React, { Component,Fragment } from 'react';
import {Container , Row , Col} from 'reactstrap';
import { Link } from "react-router-dom";

import ourwebsiteright from '../../../assets/image/coindaskdask.png';
import Imgmanage from '../../../assets/image/manage.png';
import Imgbuys from '../../../assets/image/buys.png';
import Imguntitled from '../../../assets/image/untitled_1.png';
import Imgvault from '../../../assets/image/vault.png';
import ReactHtmlParser from "react-html-parser";
export default class ourwebsite extends Component {
  render() {
    const html =this.props.content != null && this.props.content && this.props.content[localStorage.getItem('locale')] && this.props.content[localStorage.getItem('locale')].content ? this.props.content[localStorage.getItem("locale")].content : "";
    return (
        <Fragment>
                {ReactHtmlParser(html)}
      {/* <div className="ourwebsitemainbg">
        <div className="ourwebsitebg">
            <Container>
                <Row>
                    <Col md={12}>
                        <div className="ourwebsitetitle">
                            <span>Our Website</span>
                            <p>See what\'s waiting for you at Cooldex </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
        <Container>
            <Row>
                <Col md={6}>
                    <Row className="Ourmobileview">
                        <Col md={2}>
                        <Link to="/" title="Manage your portfolio"><img src={Imgmanage} className="img-fluid ourwebicon"/></Link>
                        </Col>
                        <Col md={9}>
                            <div className="ourwebsitebox">
                                <span>Manage your portfolio</span>
                                <p>Buy and sell popular currencies and keep track of all of them in one single place.</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="Ourmobileview">
                        <Col md={2}>
                            <Link to="/" title="Recurring buys"><img src={Imgbuys} className="img-fluid ourwebicon"/></Link>
                        </Col>
                        <Col md={9}>
                            <div className="ourwebsitebox">
                                <span>Recurring buys </span>
                                <p>Invest in digital currency slowly over time by scheduling buys daily, weekly or monthly.</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="Ourmobileview">
                        <Col md={2}>
                            <Link to="/" title="Vault protection"><img src={Imgvault} className="img-fluid ourwebicon"/></Link>
                        </Col>
                        <Col md={9}>
                            <div className="ourwebsitebox">
                                <span>Vault protection </span>
                                <p>For added security, store your funds in a vault with time delayed withdrawals.</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="Ourmobileview">
                        <Col md={2}>
                            <Link to="/" title="Use Cooldex everywhere"><img src={Imguntitled} className="img-fluid ourwebicon ourwebiconmobile"/></Link>
                        </Col>
                        <Col md={9}>
                            <div className="ourwebsitebox">
                                <span>Use Cooldex everywhere</span>
                                <p>Stay up to date with our upcoming mobile and watch apps.</p>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <img src={ourwebsiteright} className="img-fluid"/>
                </Col>
            </Row>
        </Container>
      </div> */}
      </Fragment>
    )
  }
}
