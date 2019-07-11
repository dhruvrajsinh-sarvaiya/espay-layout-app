/* 
    Developer : Salim Deraiya
    Date : 18-02-2018
    Updated By : Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount User Management Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
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
        title: <IntlMessages id="sidebar.userManagement" />,
        link: '',
        index: 1
    }
];

//Component for MyAccount User Management Dashboard
class UserManagementDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menudetail: [],
            menuLoading: false
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('5A42F0F5-1C85-50E1-9E13-56A8B6805AB1'); // get myaccount menu permission
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
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                {(this.state.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.userManagement" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('AEC5AB52-9BCF-1994-2989-3B94A5F2076A') && //AEC5AB52-9BCF-1994-2989-3B94A5F2076A
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('RuleManagementDashboard', this.checkAndGetMenuAccessDetail('AEC5AB52-9BCF-1994-2989-3B94A5F2076A'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.ruleManagement" />}
                                    icon="zmdi zmdi-tune"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('1DF4F0E4-6A7C-686B-0B84-2DB8F91B7CDF') && //1DF4F0E4-6A7C-686B-0B84-2DB8F91B7CDF
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('RoleManagementDashboard', this.checkAndGetMenuAccessDetail('1DF4F0E4-6A7C-686B-0B84-2DB8F91B7CDF'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.roleManagement" />}
                                    icon="zmdi zmdi-key"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('831073A5-1D7B-30F1-A152-583FE89F34B6') && //831073A5-1D7B-30F1-A152-583FE89F34B6
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('UserPermissionGroups',this.checkAndGetMenuAccessDetail('831073A5-1D7B-30F1-A152-583FE89F34B6'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.permissionGroups" />}
                                    icon="zmdi zmdi-accounts-list"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('3BF93524-77A4-7274-0837-3480CFF786A9') && //3BF93524-77A4-7274-0837-3480CFF786A9
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('UserDashboard', this.checkAndGetMenuAccessDetail('3BF93524-77A4-7274-0837-3480CFF786A9'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.users" />}
                                    icon="zmdi zmdi-accounts"
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
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} menuDetail={this.checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />
                </Drawer>
            </div>
        );
    }
}

//Added by Bharat Jograna (BreadCrumb)09 March 2019
const mapToProps = ({ drawerclose, authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, { getMenuPermissionByID })(UserManagementDashboard);