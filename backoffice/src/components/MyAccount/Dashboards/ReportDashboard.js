/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Report Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getReportData } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

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
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.reportsDashboard" />,
        link: '',
        index: 1
    }
];

//Component for MyAccount Report Dashboard
class ReportDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            TitleBit: 1,
            menuLoading:false,
            menudetail: []
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('A53DBA52-9AE3-336D-044C-69E889972E24'); // get myaccount menu permission

    }

    componentWillReceiveProps(nextProps) {
        this.setState({menuLoading:nextProps.menuLoading})
         //Added by Saloni
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
               this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getReportData();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }


        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false });
        }

        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({ open: false })
        }
    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    showComponent = (componentName, menuDetail) => {
        //check permission go on next page or not
        if (menuDetail.HasChild) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

        /* check menu permission */
        checkAndGetMenuAccessDetail(GUID) {
            var response = false;
            var index;
            const { menudetail } = this.state;
            if (menudetail.length) {
             for (index in menudetail) {
                    if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                        response = menudetail[index];
                }
            }
            return response;
        }
    render() {
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;

        return (
       
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.reportsDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('960DC18A-A39A-910D-A1B6-6BD71393A205') && //960DC18A-A39A-910D-A1B6-6BD71393A205
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {loading && <PreloadWidget />}
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('UserSignupReportDashboard', this.checkAndGetMenuAccessDetail('960DC18A-A39A-910D-A1B6-6BD71393A205'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.usersSignupRptList" />}
                                    icon="fa fa-user-plus"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('37A0AF71-27FC-5B63-70D7-CB8F848F9B4A') && //37A0AF71-27FC-5B63-70D7-CB8F848F9B4A
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {loading && <PreloadWidget />}
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListActivityLogDashboard', this.checkAndGetMenuAccessDetail('37A0AF71-27FC-5B63-70D7-CB8F848F9B4A'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.ActivityLog" />}
                                    icon="fa fa-history"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('5823D629-809C-29D6-A431-F7A64F019939') && //5823D629-809C-29D6-A431-F7A64F019939
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {loading && <PreloadWidget />}
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', this.checkAndGetMenuAccessDetail('5823D629-809C-29D6-A431-F7A64F019939'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.UserWalletList" />}
                                    icon="zmdi zmdi-balance-wallet"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('BCCE3261-94E7-750D-512C-798AE0073AE5') && //BCCE3261-94E7-750D-512C-798AE0073AE5
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {loading && <PreloadWidget />}
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('TradingLedger', this.checkAndGetMenuAccessDetail('BCCE3261-94E7-750D-512C-798AE0073AE5'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.tradingLedger" />}
                                    icon="fa fa-line-chart"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} TitleBit={this.state.TitleBit} />}
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ rptDashRdcer, drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading } = rptDashRdcer;
    return { loading, drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapToProps, {
    getReportData,
    getMenuPermissionByID
})(ReportDashboard);