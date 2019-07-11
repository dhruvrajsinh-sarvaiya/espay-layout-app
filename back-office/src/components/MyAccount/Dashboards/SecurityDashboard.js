/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : Security List Component
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { SimpleCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
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
        title: <IntlMessages id="my_account.security" />,
        link: '',
        index: 1
    }
];

class SecurityDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            // menuDetail: {},
            menudetail: [],
            menuLoading:false
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('1E0ED92E-8A95-108E-8FDC-9CE3E77A1CC0'); // get myaccount menu permission
       // this.props.getApplicationData();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false })
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
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
        const { componentName, open} = this.state;
        const { drawerClose,loading  } = this.props;

        return (
            <div className="jbs-page-content">
                                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="my_account.security" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('6302D98A-830A-96E3-0955-7ACCE2921EE4') && //6302D98A-830A-96E3-0955-7ACCE2921EE4
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ChangePasswordDashboard', this.checkAndGetMenuAccessDetail('6302D98A-830A-96E3-0955-7ACCE2921EE4'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.changePassword" />}
                                    icon="zmdi zmdi-key"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('5F0AC589-5861-1885-A65B-97B1DB0D7053') && //5F0AC589-5861-1885-A65B-97B1DB0D7053
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SecurityQuestionDashboard', this.checkAndGetMenuAccessDetail('5F0AC589-5861-1885-A65B-97B1DB0D7053'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.securityQuestion" />}
                                    icon="fa fa-question"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('218E4056-0657-0021-3A9C-40F002E88E80') && //218E4056-0657-0021-3A9C-40F002E88E80
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('IPHistoryDashboard', this.checkAndGetMenuAccessDetail('218E4056-0657-0021-3A9C-40F002E88E80'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.ipHistory" />}
                                    icon="zmdi zmdi-pin-drop"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'ChangePasswordDashboard' || componentName === 'SecurityQuestionDashboard' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'ChangePasswordDashboard' || componentName === 'SecurityQuestionDashboard' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />}
                </Drawer>
            </div>
        )
    }
}

const mapToProps = ({ drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose,menuLoading,menu_rights };
}

export default connect(mapToProps, {
    getMenuPermissionByID
})(SecurityDashboard);