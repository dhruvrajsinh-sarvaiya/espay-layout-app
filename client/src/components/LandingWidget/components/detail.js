import React, { Component } from 'react'
import { Container , Row , Col } from 'reactstrap';
import graph from '../../../assets/img/dashright.png';
import phone from '../../../assets/img/iphone.png';

export default class detail extends Component {
  render() {
    return (
      <div className="knowmore">
        <Container>

            <div className="d-1">
              <Col className="d-inline-block" sm={5} >
                <h3>Advance trading tools</h3>
                <p>Cryporio is a full spot trading platform for major digital assets & cryptocurrencies incuding <b>Bitcoin , Ethereum , EOS , Litecoin , Ripple , NEO , Monero</b>and many more.
                Bitfinex offers leveraged margin trading through a peer-to-peer funding market,allowing user to securely trade with up to 3.3x leverage.
                </p>
                <p>We also boast a suite of order type to help traders take advcantage of every situtation.</p>
                <a href="/">LEARN MORE</a>
              </Col>
              <Col className="d-inline-block" sm={7}>
                <img src={graph} />
              </Col>
            </div>

            <div className="d-2">
              <Col className="d-inline-block text-center" sm={7}>
                <img src={phone} />
              </Col>
              <Col className="d-inline-block" sm={5}>
              <h3>We've created the mobile tools you need</h3>
                <p>Crytoprio is golbal leader in the blockchain revoution. We Operate the permier U.S.-based blockchain trading platform,which is designed for customes who demand lighting-fast trade executionm,dependable digital wallets,and industry leading security practices.
                </p>
                <a href="/">APP DOWANLOAD</a>

                <div className="equal-hight clearfix">
                    <div className="ico-block purple-bg rounded-circle text-center">
                    <i className="zmdi ti-apple zmdi-hc-2x text-black" />
                    </div>
                    <div className="cnt-block">
                        <h5>Customizable interface</h5>
                        <p>Amet tempus metus. Vivamus eu lorem lobortis.</p>
                    </div>
                </div>

                <div className="equal-hightfirst">
                    <div className="ico-block purple-bg rounded-circle text-center">
                    <i className="zmdi ti-apple zmdi-hc-2x text-black" />
                    </div>
                    <div className="cnt-block">
                        <h5>Customizable interface</h5>
                        <p>Amet tempus metus. Vivamus eu lorem lobortis , Vivamus eu lorem lobortis.</p>
                    </div>
                </div>

              </Col>
            </div>

        </Container>
      </div>
    )
  }
}
