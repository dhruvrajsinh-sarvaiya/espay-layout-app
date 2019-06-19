/* eslint-disable no-script-url */
/* 
    Developer : Salim Deraiya
    Date : 22-11-2018
    update by Sanjay : 06-02-2019 (code for drawar)
    File Comment : MyAccount Organization Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import 'rc-drawer/assets/index.css';
import {
    // getApplicationData, 
    getOrganizationData
} from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Organization dashboard
class OrganizationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            ApplicationCount: {},
            menudetail: [],
            menuLoading: false
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('E8FEEB92-0BD0-5246-4B49-44D3FC9E071B'); // get myaccount menu permission

        // this.props.getApplicationData();
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
        this.setState({ open: false });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getOrganizationData();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }

        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({ open: false });
        }

        if (Object.keys(nextProps.appDashData).length > 0 && Object.keys(nextProps.appDashData.TotalCountApplication).length > 0) {
            this.setState({ ApplicationCount: nextProps.appDashData.TotalCountApplication });
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

        return (
            <Fragment>
                {this.state.menuLoading && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('7AEC5D9E-A06E-797D-702F-B645993A1742') && //7AEC5D9E-A06E-797D-702F-B645993A1742
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('CustomersDashboard', this.checkAndGetMenuAccessDetail('7AEC5D9E-A06E-797D-702F-B645993A1742'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.customers" />}
                                    icon="zmdi zmdi-accounts-add"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('A53DBA52-9AE3-336D-044C-69E889972E24') && //A53DBA52-9AE3-336D-044C-69E889972E24
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReportDashboard', this.checkAndGetMenuAccessDetail('A53DBA52-9AE3-336D-044C-69E889972E24'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.reports" />}
                                    icon="zmdi zmdi-chart"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('59295759-7C28-29CD-6E1C-D9E6E5B52829') && //59295759-7C28-29CD-6E1C-D9E6E5B52829
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListKYCVerifyWdgt', this.checkAndGetMenuAccessDetail('59295759-7C28-29CD-6E1C-D9E6E5B52829'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.listKYCVerify" />}
                                    icon="fa fa-list"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('1ABD31C2-9D0F-58E1-A284-ED8574279D11') && //1ABD31C2-9D0F-58E1-A284-ED8574279D11
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('HelpNSupoortDashboard', this.checkAndGetMenuAccessDetail('1ABD31C2-9D0F-58E1-A284-ED8574279D11'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.helpNSupport" />}
                                    icon="zmdi zmdi-help"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('9FC9B205-A774-039D-2142-1EA5D8351104') && //9FC9B205-A774-039D-2142-1EA5D8351104
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SLAConfigurationDashboard', this.checkAndGetMenuAccessDetail('9FC9B205-A774-039D-2142-1EA5D8351104'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.slaConfiguration" />}
                                    icon="zmdi zmdi-tune"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('8B950AE5-2887-6E49-2E47-1F9B251678CE') && //8B950AE5-2887-6E49-2E47-1F9B251678CE
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('PasswordPolicyConfigurationDashboard', this.checkAndGetMenuAccessDetail('8B950AE5-2887-6E49-2E47-1F9B251678CE'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.passwordPolicyConfig" />}
                                    icon="zmdi zmdi-lock"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('2677C50D-1201-565C-9091-78020FA829A3') && //2677C50D-1201-565C-9091-78020FA829A3
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('IPProfilingDashboard', this.checkAndGetMenuAccessDetail('2677C50D-1201-565C-9091-78020FA829A3'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.ipProfiling" />}
                                    icon="zmdi zmdi-pin"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('87E87B45-2078-985B-9046-586357D12DD2') && //87E87B45-2078-985B-9046-586357D12DD2
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SocialTradingPolicyDashboard', this.checkAndGetMenuAccessDetail('87E87B45-2078-985B-9046-586357D12DD2'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.socialTradingConfiguration" />}
                                    icon="zmdi zmdi-share"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('0C93B976-9A26-4A55-3340-7CDB2C6286A5') && //0C93B976-9A26-4A55-3340-7CDB2C6286A5
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ProfileConfigDashboard', this.checkAndGetMenuAccessDetail('0C93B976-9A26-4A55-3340-7CDB2C6286A5'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.profileConfiguration" />}
                                    icon="fa fa-user"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('1E0ED92E-8A95-108E-8FDC-9CE3E77A1CC0') && //1E0ED92E-8A95-108E-8FDC-9CE3E77A1CC0
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SecurityDashboard', this.checkAndGetMenuAccessDetail('1E0ED92E-8A95-108E-8FDC-9CE3E77A1CC0'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.security" />}
                                    icon="zmdi zmdi-shield-security"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('4F8FAF64-5179-A4E3-2E27-A75AFAA88263') && //4F8FAF64-5179-A4E3-2E27-A75AFAA88263
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ManageAccountDashboard', this.checkAndGetMenuAccessDetail('4F8FAF64-5179-A4E3-2E27-A75AFAA88263'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.manageAccount" />}
                                    icon="fa fa-id-badge"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('10A2DCB3-9F88-05C3-4A83-67A854413F77') && //10A2DCB3-9F88-05C3-4A83-67A854413F77
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReferralSystemDashboard', this.checkAndGetMenuAccessDetail('10A2DCB3-9F88-05C3-4A83-67A854413F77'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="my_account.referralSystem" />}
                                    icon="fa fa-snowflake-o"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('27AB8792-0878-4261-4F2A-D373B1491537') && //27AB8792-0878-4261-4F2A-D373B1491537
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AffiliateManagementDashboard', this.checkAndGetMenuAccessDetail('27AB8792-0878-4261-4F2A-D373B1491537'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.affiliateManagement" />}
                                    icon="zmdi zmdi-money-box"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('5A42F0F5-1C85-50E1-9E13-56A8B6805AB1') && //5A42F0F5-1C85-50E1-9E13-56A8B6805AB1
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('UserManagementDashboard', this.checkAndGetMenuAccessDetail('5A42F0F5-1C85-50E1-9E13-56A8B6805AB1'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.userManagement" />}
                                    icon="fa fa-users"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {/* {this.checkAndGetMenuAccessDetail('5A42F0F5-1C85-50E1-9E13-56A8B6805AB1') && //5A42F0F5-1C85-50E1-9E13-56A8B6805AB1 */}
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('TwoFactoreAuthWdgtBlk', this.checkAndGetMenuAccessDetail('5A42F0F5-1C85-50E1-9E13-56A8B6805AB1'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.enableNDisable2FA" />}
                                    icon="fa fa-qrcode"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('5A42F0F5-1C85-50E1-9E13-56A8B6805AB1') && //5A42F0F5-1C85-50E1-9E13-56A8B6805AB1 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ProviderBalanceCheck', this.checkAndGetMenuAccessDetail('5A42F0F5-1C85-50E1-9E13-56A8B6805AB1'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.providerBalanceCheck" />}
                                    icon="fa fa-suitcase"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    {/* } */}
                </div>
                <Drawer
                    width='100%'
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
                </Drawer>
            </Fragment>
        );
    }
}

const mapToProps = ({ orgDashRdcer, appDashRdcer, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { orgDashData, loading } = orgDashRdcer;
    const { appDashData } = appDashRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { orgDashData, appDashData, loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    getOrganizationData,
    getMenuPermissionByID
    // getApplicationData
})(OrganizationDashboard);