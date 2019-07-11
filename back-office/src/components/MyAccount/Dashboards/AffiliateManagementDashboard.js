/* 
    Developer : Salim Deraiya
    Date : 19-02-2018
    Update by : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : MyAccount Affiliate Management Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
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
        title: <IntlMessages id="sidebar.affiliateManagement" />,
        link: '',
        index: 1
    }
];

//Component for MyAccount Affiliate Management Dashboard
class AffiliateManagementDashboard extends Component {
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
        this.props.getMenuPermissionByID('27AB8792-0878-4261-4F2A-D373B1491537'); // get myaccount menu permission

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
        //Added by Bharat Jograna (BreadCrumb)13 March 2019
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
                <WalletPageTitle title={<IntlMessages id="sidebar.affiliateManagement" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('D92FA0BA-6C68-83E3-0BFD-AE309DA325F4') && //D92FA0BA-6C68-83E3-0BFD-AE309DA325F4
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AffiliateReportDashboard', this.checkAndGetMenuAccessDetail('D92FA0BA-6C68-83E3-0BFD-AE309DA325F4'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.reports" />}
                                    icon="zmdi zmdi-chart"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('5629CF40-5B06-3CF1-6C2D-D400AED74C02') && //5629CF40-5B06-3CF1-6C2D-D400AED74C02
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AffiliateSchemeDashboard', this.checkAndGetMenuAccessDetail('5629CF40-5B06-3CF1-6C2D-D400AED74C02'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.affiliateScheme" />}
                                    icon="fa fa-files-o"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('DF97B0B9-9E97-8E8D-9AB6-6517C72B58BC') && //DF97B0B9-9E97-8E8D-9AB6-6517C72B58BC
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AffiliateSchemeTypeDashboard', this.checkAndGetMenuAccessDetail('DF97B0B9-9E97-8E8D-9AB6-6517C72B58BC'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.affiliateSchemeType" />}
                                    icon="zmdi zmdi-copy"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('68F8954F-2058-8347-267C-7C57FED31CB3') && //68F8954F-2058-8347-267C-7C57FED31CB3
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AffiliatePromotionDashboard', this.checkAndGetMenuAccessDetail('68F8954F-2058-8347-267C-7C57FED31CB3'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.affiliatePromotion" />}
                                    icon="zmdi zmdi-money"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('B37DC4A0-55E2-3102-3D11-7578DC19643B') && //B37DC4A0-55E2-3102-3D11-7578DC19643B
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AffiliateSchemeDetailDashboard', this.checkAndGetMenuAccessDetail('B37DC4A0-55E2-3102-3D11-7578DC19643B'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.affiliateSchemeDetail" />}
                                    icon="fa fa-clone"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('EA82D392-8ED4-1238-9180-2054EB989C11') && //EA82D392-8ED4-1238-9180-2054EB989C11
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AffiliateSchemeTypeMappingDashboard', this.checkAndGetMenuAccessDetail('EA82D392-8ED4-1238-9180-2054EB989C11'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.affiliateSchemeTypeMapping" />}
                                    icon="zmdi zmdi-google-pages"
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
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)13 March 2019
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

export default connect(mapToProps, { getMenuPermissionByID })(AffiliateManagementDashboard);