import React, { Component,Fragment } from 'react';
import {Container , Row , Col} from 'reactstrap';
import { Link } from "react-router-dom";
import Imguser from '../../../assets/image/ppl.png';
import Imgwallet from '../../../assets/image/wallet.png';
import Imghandzinha from '../../../assets/image/handzinha.png';
import ReactHtmlParser from "react-html-parser";
export default class simplesteps extends Component {
  render() {
    const html =this.props.content != null && this.props.content && this.props.content[localStorage.getItem('locale')] && this.props.content[localStorage.getItem('locale')].content ? this.props.content[localStorage.getItem("locale")].content : "";
    return (
        <Fragment>
                {ReactHtmlParser(html)}
      {/* <div className="simplestepsbg">
        <Container>
            <Row>
                <Col md={12}>
                    <div className="stepstitle">
                        <span>Get started in three simple steps</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <div className="stepsbox">
                        <img src={Imguser} className="img-fluid"/>
                        <span>Create your account</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stepsbox">
                        <img src={Imgwallet} className="img-fluid"/>
                        <span>Link your wallet</span>
                        <Link to="/">TRY FREE</Link>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="laststepsbox">
                        <img src={Imghandzinha} className="img-fluid"/>
                        <span>Start buying and selling </span>
                    </div>
                </Col>
                   
            </Row>
        </Container>    
      </div> */}
      </Fragment>
    )
  }
}
