// Api Key Configuration Dashboard By Tejas Date : 21/2/2019

import React from 'react';

// intl messages
import IntlMessages from "Util/IntlMessages";

// import card for display basic details 
import { CardType5 } from 'Components/TradingWidgets/DashboardCard/CardType5';

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import { Row, Col } from 'reactstrap';

// import dashboard
import {
    ApiPlan,    
    ApiSubscriptionHistory,
    ApiPlanConfigurationHistory,
    ApiKeyHistory,
    ApiKeyPolicySetting
} from 'Components/ApiKeyConfiguration';


// componenet listing
const components = {
    ApiPlan: ApiPlan, 
    ApiSubscriptionHistory:ApiSubscriptionHistory ,
    ApiPlanConfigurationHistory:ApiPlanConfigurationHistory,
    ApiKeyHistory:ApiKeyHistory,
    ApiKeyPolicySetting:ApiKeyPolicySetting
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

class ApiKeyConfiguration extends React.Component {
    state = {
        componentName: '',
        open: false,        
    }
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName:''
        });
    }
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
        });
    }
    closeAll = () => {
        this.setState({
            open: false,
        });
    }

    render() {
        const { match } = this.props;
        
        return (
            <div className="drawer-data trading-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.ApiKeyConfiguration" />}
                    match={match}
                />
                <Row>
                    <Col md={3}>       
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiPlan')} className="text-dark col-sm-full">
                            <CardType5                
                                title={<IntlMessages id="sidebar.APIPlanConfiguration" />}
                                count={100}
                                icon="fa fa-address-book"                    
                                bgClass="bg-dark"
                                refresh={0}
                                getData={null}
                        />
                        </a>
                    </Col>
                    <Col md={3}>       
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiSubscriptionHistory')} className="text-dark col-sm-full">
                            <CardType5                
                                title={<IntlMessages id="sidebar.APIPlanSubscriptionHistory" />}
                                count={100}
                                icon="fa fa-address-book"                    
                                bgClass="bg-dark"
                                refresh={0}
                                getData={null}
                        />
                        </a>
                    </Col>
                    <Col md={3}>       
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiPlanConfigurationHistory')} className="text-dark col-sm-full">
                            <CardType5                
                                title={<IntlMessages id="sidebar.APIPlanConfigurationHistory" />}
                                count={100}
                                icon="fa fa-address-book"                    
                                bgClass="bg-dark"
                                refresh={0}
                                getData={null}
                        />
                        </a>
                    </Col>
                    <Col md={3}>       
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiKeyHistory')} className="text-dark col-sm-full">
                            <CardType5                
                                title={<IntlMessages id="sidebar.APIKeyHistory" />}
                                count={100}
                                icon="fa fa-address-book"                    
                                bgClass="bg-dark"
                                refresh={0}
                                getData={null}
                        />
                        </a>
                    </Col>
                </Row>

                <Row>
                    <Col md={3}>
                    <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiKeyPolicySetting')} className="text-dark col-sm-full">
                            <CardType5                
                                title={<IntlMessages id="sidebar.APIKeyPolicySetting" />}
                                count={100}
                                icon="fa fa-address-book"                    
                                bgClass="bg-dark"
                                refresh={0}
                                getData={null}
                        />
                        </a>
                    </Col>
                </Row>
                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    placement="right"
                    //level=".drawer1"
                    level={null}
                    getContainer={null}
                    showMask={false}
                    height="100%"
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll)}
                </Drawer>

            </div>
        )
    }
}

export default ApiKeyConfiguration;
                
              