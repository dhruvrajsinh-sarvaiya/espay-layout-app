/* 
    Developer : Kevin LAdani
    Date : 01-09-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount SLA Configuration Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager

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
        title: <IntlMessages id="sidebar.slaConfigurationDashboard" />,
        link: '',
        index: 1
    }
];

//Component for MyAccount KYC Configuration Dashboard
class SLAConfigurationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {},
            menudetail: [],
            menuLoading:false
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('9FC9B205-A774-039D-2142-1EA5D8351104'); // get myaccount menu permission
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


        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false });
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
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.slaConfigurationDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('48AB76E4-811E-9916-2FC1-1B4D9C617D63') && //48AB76E4-811E-9916-2FC1-1B4D9C617D63
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListSLAPriorityDashboard', this.checkAndGetMenuAccessDetail('48AB76E4-811E-9916-2FC1-1B4D9C617D63'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.getpriorityList" />}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('6EA66E8D-6312-64C3-30E2-25F2AC0694C6') && //6EA66E8D-6312-64C3-30E2-25F2AC0694C6
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddSLAPriorityDashboard', this.checkAndGetMenuAccessDetail('6EA66E8D-6312-64C3-30E2-25F2AC0694C6'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.addProiority" />}
                                    icon="fa fa-plus-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'AddSLAPriorityDashboard' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddSLAPriorityDashboard' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { drawerclose,menuLoading, menu_rights };
}

export default connect(mapToProps, {
    getMenuPermissionByID
})(SLAConfigurationDashboard);