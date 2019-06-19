import React,{Fragment} from 'react'

import { Col, Row } from 'reactstrap';
class BalanceInfo extends React.Component {

    render() {
        return (
            <Fragment>
                <marquee>
                    <Row className="p-5">
                        <div style={{minHeight:"80px",minWidth:"250px"}}>
                            <h1>Bitcoin</h1>
                            <span>Balance:0.454</span>
                        </div>

                        <div style={{minHeight:"80px",minWidth:"250px"}}>
                            <h1>Litecoin</h1>
                            <span>Balance:0.454</span>
                        </div>

                        <div style={{minHeight:"80px",minWidth:"250px"}}>
                            <h1>Ripple</h1>
                            <span>Balance:0.454</span>
                        </div>

                        <div style={{minHeight:"80px",minWidth:"250px"}}>
                            <h1>Rupee</h1>
                            <span>Balance:0.454</span>
                        </div>

                        <div style={{minHeight:"80px",minWidth:"250px"}}>
                            <h1>Dollar</h1>
                            <span>Balance:0.454</span>
                        </div>
                    </Row>
                </marquee>
            </Fragment>
        )
    }
}

export default BalanceInfo;
