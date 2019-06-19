/* 
    Developer : Salim Deraiya
    Date : 18-02-2018
    Updated By : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : MyAccount Role Management Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
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
        title: <IntlMessages id="sidebar.userManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.roleManagement" />,
        link: '',
        index: 2
    },
];


//Component for MyAccount Role Management Dashboard
class RoleManagementDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menudetail: [],
            menuLoading:false
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('1DF4F0E4-6A7C-686B-0B84-2DB8F91B7CDF'); // get myaccount menu permission

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

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    showComponent = (componentName, menuDetail) => {
        //check permission go on next page or not
        if (menuDetail.HasChild) {
            this.setState({
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
        const { componentName, open, menuDetail } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                                                {(this.state.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.roleManagement" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('16E7252D-823A-3C9C-1934-E5F9064851F2') && //16E7252D-823A-3C9C-1934-E5F9064851F2
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListRoleDashboard', this.checkAndGetMenuAccessDetail('16E7252D-823A-3C9C-1934-E5F9064851F2'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.listRoles" />}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('EC379B9F-20AC-7436-4F18-46C9181B5220') && //EC379B9F-20AC-7436-4F18-46C9181B5220
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('RoleAssignHistory', this.checkAndGetMenuAccessDetail('EC379B9F-20AC-7436-4F18-46C9181B5220'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.roleAssignHistory" />}
                                    icon="zmdi zmdi-assignment-check"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('82ED2ABF-A48A-6973-4C07-A834C3FE56E0') && //82ED2ABF-A48A-6973-4C07-A834C3FE56E0
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditRole', this.checkAndGetMenuAccessDetail('82ED2ABF-A48A-6973-4C07-A834C3FE56E0'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.addRoles" />}
                                    icon="zmdi zmdi-plus-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('36B05A7B-39B0-7998-410D-F14BAC3983D6') && //36B05A7B-39B0-7998-410D-F14BAC3983D6
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListUnassignUserRole', this.checkAndGetMenuAccessDetail('36B05A7B-39B0-7998-410D-F14BAC3983D6'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.listUnassignUserRole" />}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'AddEditRole' ? "50%" : "100%"}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddEditRole' ? "drawer1 half_drawer" : "drawer1"}
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
const mapToProps = ({ drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapToProps, {getMenuPermissionByID})(RoleManagementDashboard);