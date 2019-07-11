/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Social Login Dashboard Component
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
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getSocialLoginData } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
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
        title: <IntlMessages id="sidebar.socialTradingPolicy" />,
        link: '',
        index: 1
    }
];

//Component for MyAccount Social Trading Policy Dashboard
class SocialTradingPolicyDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            // menuDetail: {},
            menudetail: [],
            menuLoading: false
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('87E87B45-2078-985B-9046-586357D12DD2'); // get myaccount menu permission

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getSocialLoginData();
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
            this.setState({ open: false })
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true });
    }

    showComponent = (componentName, menuDetail) => {
        //check permission go on next page or not
        if (menuDetail.HasChild) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
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
                <WalletPageTitle title={<IntlMessages id="sidebar.socialTradingPolicy" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('4C2CE5CB-491D-2EE3-01D1-DF14B9D549B5') && //4C2CE5CB-491D-2EE3-01D1-DF14B9D549B5
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {loading && <PreloadWidget />}
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('LeaderProfileDashboard', this.checkAndGetMenuAccessDetail('4C2CE5CB-491D-2EE3-01D1-DF14B9D549B5'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.leaderProfileConfiguration" />}
                                    icon="fa fa-black-tie"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('A2C4CBBA-159B-3AF9-2EE6-5E45B7D096A9') && //A2C4CBBA-159B-3AF9-2EE6-5E45B7D096A9
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            {loading && <PreloadWidget />}
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('FollowerProfileDashboard', this.checkAndGetMenuAccessDetail('A2C4CBBA-159B-3AF9-2EE6-5E45B7D096A9'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.followerProfileConfiguration" />}
                                    icon="zmdi zmdi-account"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width="50%"
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1 half_drawer"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />}
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ sociallngDashRdcer, drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { slngDashData, loading } = sociallngDashRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { slngDashData, loading, drawerclose , menuLoading,menu_rights };
}

export default connect(mapToProps, {
    getSocialLoginData,
    getMenuPermissionByID,
})(SocialTradingPolicyDashboard);