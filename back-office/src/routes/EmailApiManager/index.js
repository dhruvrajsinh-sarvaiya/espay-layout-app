import React, { Component } from "react";

import Drawer from 'rc-drawer';
import { EmailAPIManager } from "Components/EmailApiManager";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { CardType5 } from 'Components/TradingWidgets/DashboardCard/CardType5';

import { Row, Col } from 'reactstrap';
const components = {
    EmailAPIManager: EmailAPIManager,
};
const dynamicComponent = (TagName, type, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { type, drawerClose, closeAll });
};
export default class EmailApiManager extends Component {
    state = {
        componentName: '',
        open: false,
        type: 0
    }
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: ''
        });
    }
    showComponent = (componentName, type) => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
            type: type,
        });
    }
    closeAll = () => {
        this.setState({
            open: false,
        });
    }
    render() {
        return (
            <div className="data-table-wrapper mb-20">
                <PageTitleBar
                    title={<IntlMessages id="emailAPIManager.PageTitle" />}
                    match={this.props.match}
                />
                <div>
                    <Row>
                        <Col md={3}>
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailAPIManager', 2)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.EmailApiManager" />}
                                    icon="zmdi zmdi-trending-up"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </Col>
                        <Col md={3}>
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailAPIManager', 1)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.SMSApiManager" />}
                                    icon="zmdi zmdi-trending-up"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </Col>

                    </Row>

                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer1"
                    placement="right"
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.state.type, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </div>

        );
    }
}

