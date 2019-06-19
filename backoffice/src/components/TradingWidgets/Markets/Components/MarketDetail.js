import React,{Fragment} from 'react';
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";

import Button from '@material-ui/core/Button';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

class MarketDetail extends React.Component{
    state={
        open: false,
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    render(){
        const { drawerClose,data,index } = this.props;
        
        const info= data[index]
        
        return(
            <div className="ml-20 mr-20">
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2>{info.name}</h2>
                        </div>

                    
                        <div className="page-title-wrap">
                            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                        </div>
                     </div>

                          
                        
                    <Col sm={12}>
                        <Row>
                            <Col sm={3}><img src={require('Assets/icon/btc.png')} /></Col>
                            <Col sm={9}>
                                <h1>{info.symbol}</h1>
                                <span>{info.circulating_supply} circulating supply</span>
                            </Col>
                        </Row>
                        <Row className="mt-10">
                        <JbsCard colClasses="col-sm-4"> 
                        
                            <Col sm={12} className="p-10 m-10">
                                <h1>Current Value</h1>
                                <span>{info.price}</span>
                            </Col>
                        
                        </JbsCard>
                        <JbsCard colClasses="col-sm-4">
                        
                            <Col sm={12} className="p-10 m-10">
                                <h1>Market Cap</h1>
                                <span>{info.market_cap}</span>
                            </Col>
                        
                        </JbsCard>
                          <JbsCard colClasses="col-sm-4">
                        
                            <Col sm={12} className="p-10 m-10">
                                <h1>24h Volume</h1>
                                <span>{info.volume_24h}</span>
                            </Col>
                        
                        </JbsCard>
                        </Row>
                    </Col>
                    
               

                    
            </div>
        )
    }
}

export default MarketDetail;