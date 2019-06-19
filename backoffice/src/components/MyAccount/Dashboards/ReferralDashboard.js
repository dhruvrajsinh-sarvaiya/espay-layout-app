/*
    Developer : Bharat Jograna
    Date : 11-02-2019
    update by Sanjay : 
    File Comment : Referral List Component
*/

import React, { Component } from 'react'
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { SimpleCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';

//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.referral" />,
        link: '',
        index: 0
    }
];

class ReferralDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }
    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    close2Level = () => {
        this.setState({ open: false });
    }

    render() {
        const { componentName, open } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.referral" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('SignupReport')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ReferralSignupReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('BuyTradeReport')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ReferralBuyTradeReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('SellTradeReport')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ReferralSellTradeReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('DepositeReport')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ReferralDepositeReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('SendEmailsReport')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.SendEmailsReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('SendSMSReport')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.SendSMSReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ShareOnFacebookReport')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ShareOnFacebookReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ShareOnTwitterReport')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ShareOnTwitterReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ClickOnReferralLinkReport')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ClickOnReferralLinkReport" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                </div>
                <Drawer
                    width="100%"
                    handler={null}
                    open={open}
                    onMaskClick={this.onClick}
                    className={null}
                    placement="right"
                    level={null}
                    getContainer={null}
                    showMask={false}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} close2Level={this.close2Level} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
                </Drawer>
            </div>
        )
    }
}

export default ReferralDashboard;