import React, { Component, Fragment } from 'react';
import {Container , Row , Col} from 'reactstrap';
import ReactHtmlParser from "react-html-parser";
export default class features extends Component {
  render() {
    const html =this.props.content != null && this.props.content && this.props.content[localStorage.getItem('locale')] && this.props.content[localStorage.getItem('locale')].content ? this.props.content[localStorage.getItem("locale")].content : "";
    return (
            <Fragment>
                {ReactHtmlParser(html)}
                {/* <div className="featuresbg">
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className="featurestitle">
                                    <span>Features</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <div className="featuresbox">
                                    <span>Quick</span>
                                    <p>Fast trading, fast website so you don\'t lose opportunities or spend too much time staring at a loading screen.</p>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="featuresbox">
                                    <span>Friendly</span>
                                    <p>Big player or not, we got you covered with a clean and simple dashboard.</p>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="featuresbox">
                                    <span>Smart</span>
                                    <p>Keeping things together makes everything easier and saves time while you\'re trading.</p>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="featuresbox">
                                    <span>Adaptive</span>
                                    <p>We\'ve got all long time traders can need so anyone can easily start using Cooldex.</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div> */}
            </Fragment>
    )
  }
}
