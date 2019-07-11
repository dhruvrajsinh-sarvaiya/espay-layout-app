import React from 'react';
import {CardType1} from '../../DashboardCard/CardType1'
import Button from '@material-ui/core/Button';
import {Row,Col} from 'reactstrap';
import {connect} from 'react-redux'
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import BuyList from './BuyList';
import SellList from './SellList';

const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}
// componenet listing
const components = {
    BuyList:BuyList,
    SellList:SellList,
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

class OrderSummaryData extends React.Component{
    state = {
        open: false,
        defaultIndex: 0,
    }
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName:''
        })
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    changeDefault = (index) => {
        this.setState({
            defaultIndex: index
        });
    }

    render(){
        
        const { drawerClose } = this.props;
        const data = [
            {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
            {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];


        return(
            <React.Fragment>
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2>Order Summary </h2>
                    </div>
                    <div className="page-title-wrap">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                <Col md={12} sm={12} lg={12}>
            <Row>
                <Col md={3}>
                <a href="javascript:void(0)" onClick={(e) => this.showComponent('BuyList')} className="text-dark col-sm-full">                    
                    <CardType1
                        title="Buy"
                        count={this.props.orderSummaryTotal ? this.props.orderSummaryTotal.Buy : 0 }
                       icon="zmdi-grid"
                        bgClass="bg-dark"                    
                        data={data}
                        createCount={"08"}
                        createTitle="Created Today"
                        bgColor="rgb(65, 62, 160)"
                    />
                </a>
                </Col>

                <Col md={3}>
                <a href="javascript:void(0)" onClick={(e) => this.showComponent('SellList')} className="text-dark col-sm-full">                    
                        <CardType1
                            title="Sell"
                            count={this.props.orderSummaryTotal ? this.props.orderSummaryTotal.Sell : 0 }
                           icon="zmdi-grid"
                            bgClass="bg-dark"                    
                            data={data}
                            createCount={"08"}
                            createTitle="Created Today"
                            bgColor="rgb(65, 62, 160)"
                        />
                    </a>
                </Col>              
                
            </Row>
</Col>
              
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {/* <OrganizationView {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} /> */}
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    orderSummaryTotal:state.orderSummaryTotal.orderSummaryTotal
});

export default connect(mapStateToProps, {
        
})(OrderSummaryData);

//export default OrderSummaryData;