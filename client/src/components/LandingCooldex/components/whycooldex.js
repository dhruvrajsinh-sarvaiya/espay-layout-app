import React, { Component,Fragment } from 'react';
import {Container , Row , Col} from 'reactstrap';

import whychoseimg1 from"../../../assets/image/whycooldex1.png";
import whychoseimg2 from"../../../assets/image/whycooldex2.png";
import whychoseimg3 from"../../../assets/image/whycooldex3.png";
import ReactHtmlParser from "react-html-parser";
export default class whycooldex extends Component {
  render() {
    const html =this.props.content != null && this.props.content && this.props.content[localStorage.getItem('locale')] && this.props.content[localStorage.getItem('locale')].content ? this.props.content[localStorage.getItem("locale")].content : "";
    return (
            <Fragment>
                {ReactHtmlParser(html)}
      {/* <div className="whycooldexbg">
        <Container>
            <Row>
                <Col md={12}>
                    <div className="whycooltitle">
                        <span>Why</span>
                        <p>Cooldex</p>
                        <span>?</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <div className="whycooldexbox">
                        <img className="img-fluid" src={whychoseimg1} />
                        <span>We make things easy</span>
                        <p>Funding is often too complex but we\'re here to change things and make it easier for you</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="whycooldexbox">
                        <img className="img-fluid" src={whychoseimg2} />
                        <span>Safety First</span>
                        <p>Cooldex is entirely safe</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="whycooldexbox">
                        <img className="img-fluid" src={whychoseimg3} />
                        <span>Trusted by our users </span>
                        <p>We value the opinion of our users and always aim to bring the best experience. </p>
                    </div>
                </Col>
            </Row>
        </Container>
      </div> */}
      </Fragment>
    )
  }
}
