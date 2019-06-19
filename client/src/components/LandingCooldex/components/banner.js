import React, { Component } from 'react';
import {Container,Row,Col,Card} from 'reactstrap';
import { Link } from "react-router-dom";
import Header from '../components/header';

import Coin1 from '../../../assets/image/bitcoin.png';
import Coin2 from '../../../assets/image/ethiriyam.png';
import Coin3 from '../../../assets/image/coinicon.png';
import Coin4 from '../../../assets/image/coinicon1.png';


export default class banner extends Component {
  render() {
    return (
      <div className="cooldeskbanner">
        <Header />
        <Container>
            <Row>
                <Col md={6}>
                    <div className="cooldeskbannerbox">
                        <h1>CRYPTOCURRENCY</h1>
                        <p>Made safe and easy</p>
                        <Link to="/signup">TRY FREE</Link>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="coincardlist">
                        <Card>
                            <ul>
                                <li><img className="img-fluid" src={Coin1} alt="Coin" title="Coin" /></li>
                                <li>USD $6405,92</li>
                                <li>+ 25.02 %</li>
                            </ul>
                        </Card>
                        <Card>
                            <ul>
                                <li><img className="img-fluid" src={Coin2} alt="Coin" title="Coin" /></li>
                                <li>USD $6405,92</li>
                                <li>+ 25.02 %</li>
                            </ul>
                        </Card>
                        <Card>
                            <ul>
                                <li><img className="img-fluid" src={Coin3} alt="Coin" title="Coin" /></li>
                                <li>USD $6405,92</li>
                                <li>+ 25.02 %</li>
                            </ul>
                        </Card>
                        <Card>
                            <ul>
                                <li><img className="img-fluid" src={Coin4} alt="Coin" title="Coin" /></li>
                                <li>USD $6405,92</li>
                                <li>+ 25.02 %</li>
                            </ul>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
      </div>
    )
  }
}
