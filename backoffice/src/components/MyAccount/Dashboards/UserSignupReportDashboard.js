/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Domain Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getUserSignupData } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
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
    },
    {
        title: <IntlMessages id="sidebar.userSignupDashboard" />,
        link: '',
        index: 2
    }
];

//Component for MyAccount User Signup Dashboard
class UserSignupReportDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagedata: '',
            open: false,
            componentName: '',
            signupType: '',
            loading: false,
            data: {},
            menuDetail: {},
            menudetail: [],
            menuLoading: false
        }
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('960DC18A-A39A-910D-A1B6-6BD71393A205'); // get myaccount menu permission

    }

    showComponent = (componentName, menuDetail, signupType) => {
        //check permission go on next page or not
        if (menuDetail.HasChild) {
            var pageData = {
                Filtration: signupType,
                menuDetail: menuDetail
            };

            this.setState({
                pagedata: pageData,
                componentName: componentName,
                open: !this.state.open,
                menuDetail: menuDetail
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });


        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getUserSignupData();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (Object.keys(nextProps.countRptData).length > 0 && Object.keys(nextProps.countRptData.signReportCountViewmodels[0]).length > 0) {
            this.setState({ data: nextProps.countRptData.signReportCountViewmodels[0] });
        }
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
        const { componentName, open, pagedata, menuDetail } = this.state;
        const { drawerClose, loading } = this.props;
        const { Total, Today, Weekly, Monthly } = this.state.data;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.userSignupDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('DA02B7C3-0A1A-2BBD-64A7-14ED7F2D044A') && //4DD566C1-2BEE-443D-856E-C1B717138133
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListUserSignupReportDashboard', this.checkAndGetMenuAccessDetail('DA02B7C3-0A1A-2BBD-64A7-14ED7F2D044A'), '')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.total" />}
                                    count={Total > 0 ? Total : 0}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('4FFF515D-9AD1-0CF7-A567-41F226724AAC') && //D2F9A417-7460-A64E-4C50-14A896229CC2
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListUserSignupReportDashboard', this.checkAndGetMenuAccessDetail('4FFF515D-9AD1-0CF7-A567-41F226724AAC'), 'Today')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.today" />}
                                    count={Today > 0 ? Today : 0}
                                    icon="zmdi zmdi-view-agenda"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('54F26771-1B2E-7703-30A0-203D632063A9') && //94F4ABF9-1F22-4D4A-9829-87F9CF520A11
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListUserSignupReportDashboard', this.checkAndGetMenuAccessDetail('54F26771-1B2E-7703-30A0-203D632063A9'), 'Weekly')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.weekly" />}
                                    count={Weekly > 0 ? Weekly : 0}
                                    icon="fa fa-bars"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('F5903F8A-A60E-5BE2-1A23-56A8930E786F') && //E82B3F33-5768-52FB-7D12-DD0DF4C96BC8
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListUserSignupReportDashboard', this.checkAndGetMenuAccessDetail('F5903F8A-A60E-5BE2-1A23-56A8930E786F'), 'Monthly')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.monthly" />}
                                    count={Monthly > 0 ? Monthly : 0}
                                    icon="fa fa-list"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={'100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' && <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} pagedata={pagedata} props={this.props} menuDetail={menuDetail} />}
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ usersSignupReport, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { countRptData, loading } = usersSignupReport;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        countRptData, loading, drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    getUserSignupData,
    getMenuPermissionByID
})(UserSignupReportDashboard);