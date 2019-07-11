/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    Updated By : Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : IP WhiteList Component
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { SimpleCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
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
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.ipWhitelist" />,
        link: '',
        index: 2
    }
];

class IPWhitelistDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menudetail: [],
            menuLoading:false
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true });
    };

    showComponent = (componentName, menuDetail) => {
        //check permission go on next page or not
        //if (menuDetail.HasChild) {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
            menuDetail: menuDetail
        });
        //} else {
        //NotificationManager.error(<IntlMessages id={"error.permission"} />);
        //}
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('4BBFECD3-4E7F-6AF5-1BA9-A124EC9950A7'); // get myaccount menu permission
       // this.props.getApplicationData();
    }
    //Added by Bharat Jograna, (BreadCrumb)09 March 2019
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
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
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
        const { componentName, open } = this.state;
        const { drawerClose } = this.props;

        return (

            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.ipWhitelist" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                {(this.state.menuLoading) && <JbsSectionLoader />}
                    {this.checkAndGetMenuAccessDetail('6CAAF0C5-65BE-6DB9-3E04-DF6627CC4D19') && //6CAAF0C5-65BE-6DB9-3E04-DF6627CC4D19
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListIPWhitelistDashboard', this.checkAndGetMenuAccessDetail('6CAAF0C5-65BE-6DB9-3E04-DF6627CC4D19'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.ipList" />}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('a9255fc9-19d5-9081-4641-902863327716') && //a9255fc9-19d5-9081-4641-902863327716
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AllowIPDashboard', this.checkAndGetMenuAccessDetail('a9255fc9-19d5-9081-4641-902863327716'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.allowIP" />}
                                    icon="fa fa-plus-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'AllowIPDashboard' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AllowIPDashboard' ? "drawer1 half_drawer" : "drawer1"}
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

//Added by Bharat Jograna (BreadCrumb)09 March 2019
const mapToProps = ({ drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose,menuLoading, menu_rights };
}

export default connect(mapToProps, {
    getMenuPermissionByID
})(IPWhitelistDashboard);