/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * Dashboard API Key Configuration
 */

import React, { Component, Fragment } from 'react';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Row, Col } from 'reactstrap';

// import card for display basic details 
import { CardType5 } from 'Components/TradingWidgets/DashboardCard/CardType5';
import {
    ApiPlan,
    ApiSubscriptionHistory,
    ApiPlanConfigurationHistory,
    ApiKeyHistory,
    ApiKeyPolicySetting,
    APIPlanConfigRequest,
    APIMethod,
    //added by parth andhariya
    IPWiseRequestReport
} from 'Components/ApiKeyConfiguration';

import { connect } from 'react-redux';

import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

import {
    getApiKeyDashboardCount
} from "Actions/ApiKeyConfiguration";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
const components = {
    ApiPlan: ApiPlan,
    ApiSubscriptionHistory: ApiSubscriptionHistory,
    ApiPlanConfigurationHistory: ApiPlanConfigurationHistory,
    ApiKeyHistory: ApiKeyHistory,
    ApiKeyPolicySetting: ApiKeyPolicySetting,
    APIMethod: APIMethod,
    //added by parth andhariya
    IPWiseRequestReport: IPWiseRequestReport
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

class ApiKeyConfigurationDashboard extends Component {

    state = {
        componentName: '',
        open: false,
        apiKeyDashboardCountDetail: {},
        menudetail: []
    }

    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: '',
        });
    }

    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.setState({
            open: false,
            componentName: '',
        });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('1CB9A7EB-315B-1A0B-1E71-5F4119D20FBF'); // get menu permission
        // this.props.getApiKeyDashboardCount({});
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({
                open: false,
            })
        }

        if (nextProps.apiKeyDashboardCountDetail) {
            this.setState({ apiKeyDashboardCountDetail: nextProps.apiKeyDashboardCountDetail })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getApiKeyDashboardCount({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
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
        return (
            <Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                <APIPlanConfigRequest menudetail={this.state.menudetail} />
                <div className="mt-10 row">

                    {this.checkAndGetMenuAccessDetail('573F4C2A-7BCB-9AF6-285D-1E82CEEE7B5C') && //573F4C2A-7BCB-9AF6-285D-1E82CEEE7B5C
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiPlan', (this.checkAndGetMenuAccessDetail('573F4C2A-7BCB-9AF6-285D-1E82CEEE7B5C')).HasChild)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.APIPlanConfiguration" />}
                                    count={this.state.apiKeyDashboardCountDetail.APIPlanCount ? this.state.apiKeyDashboardCountDetail.APIPlanCount : 0}
                                    icon="fa fa-cogs"
                                />
                            </a>
                        </div>
                    }

                    {this.checkAndGetMenuAccessDetail('EB10806A-1260-128C-2CAA-FB5E194E5C20') && //EB10806A-1260-128C-2CAA-FB5E194E5C20
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiSubscriptionHistory', (this.checkAndGetMenuAccessDetail('EB10806A-1260-128C-2CAA-FB5E194E5C20')).HasChild)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.APIPlanSubscriptionHistory" />}
                                    count={this.state.apiKeyDashboardCountDetail.SubscriptionCount ? this.state.apiKeyDashboardCountDetail.SubscriptionCount : 0}
                                    icon="fa fa-tachometer"
                                />
                            </a>
                        </div>
                    }

                    {this.checkAndGetMenuAccessDetail('B94E2126-3CB0-775A-7B89-80508A4D4DD1') && //B94E2126-3CB0-775A-7B89-80508A4D4DD1
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiPlanConfigurationHistory', (this.checkAndGetMenuAccessDetail('B94E2126-3CB0-775A-7B89-80508A4D4DD1')).HasChild)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.APIPlanConfigurationHistory" />}
                                    count={this.state.apiKeyDashboardCountDetail.PlanConfigHistoryCount ? this.state.apiKeyDashboardCountDetail.PlanConfigHistoryCount : 0}
                                    icon="fa fa-superpowers"
                                />
                            </a>
                        </div>
                    }

                    {this.checkAndGetMenuAccessDetail('4524A918-5CD1-72AC-44F4-660D456B1366') && //4524A918-5CD1-72AC-44F4-660D456B1366
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiKeyHistory', (this.checkAndGetMenuAccessDetail('4524A918-5CD1-72AC-44F4-660D456B1366')).HasChild)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.APIKeyHistory" />}
                                    count={this.state.apiKeyDashboardCountDetail.KeyCount ? this.state.apiKeyDashboardCountDetail.KeyCount : 0}
                                    icon="fa fa-diamond"
                                />
                            </a>
                        </div>
                    }

                    {this.checkAndGetMenuAccessDetail('92EF5A48-0B73-7451-00CF-3C85D93941E7') && //92EF5A48-0B73-7451-00CF-3C85D93941E7
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ApiKeyPolicySetting', (this.checkAndGetMenuAccessDetail('92EF5A48-0B73-7451-00CF-3C85D93941E7')).HasChild)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.APIKeyPolicySetting" />}
                                    count={this.state.apiKeyDashboardCountDetail.APIKeyPolicyCount ? this.state.apiKeyDashboardCountDetail.APIKeyPolicyCount : 0}
                                    icon="fa fa-wrench"
                                />
                            </a>
                        </div>
                    }

                    {this.checkAndGetMenuAccessDetail('F9F9D3D8-777C-172A-2D35-D72049478D8E') && // F9F9D3D8-777C-172A-2D35-D72049478D8E
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('APIMethod', (this.checkAndGetMenuAccessDetail('F9F9D3D8-777C-172A-2D35-D72049478D8E')).HasChild)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.APIMethod" />}
                                    count={this.state.apiKeyDashboardCountDetail.APIMethodCount ? this.state.apiKeyDashboardCountDetail.APIMethodCount : 0}
                                    icon="fa fa-crosshairs"
                                />
                            </a>
                        </div>
                    }
                    {/* added by parth andhariya */}
                    {this.checkAndGetMenuAccessDetail('4A1605E2-80EE-1A93-9E57-A32B4F0D8599') && // 4A1605E2-80EE-1A93-9E57-A32B4F0D8599
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('IPWiseRequestReport', (this.checkAndGetMenuAccessDetail('4A1605E2-80EE-1A93-9E57-A32B4F0D8599')).HasChild)} className="text-dark col-sm-full">
                                <CardType5
                                    title={<IntlMessages id="sidebar.IPWiseRequestReport" />}
                                    // count={this.state.apiKeyDashboardCountDetail.APIMethodCount ? this.state.apiKeyDashboardCountDetail.APIMethodCount : 0}
                                    icon="zmdi zmdi-collection-text"
                                />
                            </a>
                        </div>
                    }

                </div>
                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    placement="right"
                    level={null}
                    getContainer={null}
                    showMask={false}
                    height="100%"
                >
                    {this.state.componentName !== '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ drawerclose, apiKeyDashboardCount, authTokenRdcer }) => {

    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { apiKeyDashboardCountDetail, loading, error } = apiKeyDashboardCount;
    return { apiKeyDashboardCountDetail, loading, error, drawerclose, menuLoading, menu_rights };

}

// export this component with action methods and props
export default connect(mapStateToProps, {
    getApiKeyDashboardCount,
    getMenuPermissionByID
})(ApiKeyConfigurationDashboard);