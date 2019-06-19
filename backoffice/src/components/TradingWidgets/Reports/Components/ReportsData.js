//Create Compoenent for display Report data dashboard By Tejas
import React from 'react';
import { connect } from 'react-redux';

// import card for report
import { CardType8 } from '../../DashboardCard/CardType8'

// import button and define design
import Button from '@material-ui/core/Button';

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

// intl messages
import IntlMessages from "Util/IntlMessages";

// import row and col for design
import { Row, Col } from 'reactstrap';

// import drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

//import action for user Trade count
import { getReportCount } from 'Actions/Trading';

// import components
import TradingLedger from './trading-ledger';
import OpenOrder from "Routes/trading-report/open-orders";
import SettleOrder from "Routes/trading-report/settled-orders";
import TradeSummary from "Routes/trading-report/Trade-Summary";
import TradeRecon from "./TradeRecon/TradeReconList";
import BugReport from "Routes/BugReport";
//added By Jinesh
import LedgerReport from "./LedgerReport/OrganizationLedger"

//added by Tejas 9/2/2019
import SiteTokenReport from "./SiteTokenConversion/SiteTokenReport";
import TradingSummaryLpWise from "./TradingSummeryLpwiseApiManager/TradingSummeryLpWiseWdht";

// added by Tejas 25/3/2019
import TradeRouting from "./TradeRouting";

import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Action methods..
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
        title: <IntlMessages id="sidebar.trading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="card.list.title.report" />,
        link: '',
        index: 1
    }
];

// componenet listing
const components = {
    TradingLedger: TradingLedger,
    OpenOrder: OpenOrder,
    SettleOrder: SettleOrder,
    TradeSummary: TradeSummary,
    TradeRecon: TradeRecon,
    BugReport: BugReport,
    LedgerReport: LedgerReport,
    SiteTokenReport: SiteTokenReport,
    TradingSummaryLpWise: TradingSummaryLpWise,
    TradeRouting: TradeRouting
};


// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

// class for reports dashbaord
class ReportsData extends React.Component {

    // define states
    state = {
        open: false,
        defaultIndex: 0,
        componentName: '',
        menudetail: [],
        notificationFlag: true
    }

    // toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: ''
        })
    }
    componentDidMount() {
        // this.props.getReportCount({})
    }

    // set component for display in drawer
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

    // close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('6BB11B37-7249-2DA7-31E6-C8EBCFBC6DC4'); // get Trading menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
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
    //  render the component
    render() {
        const { drawerClose, reportTotalCounts, closeAll } = this.props;
        // returns the component
        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="card.list.title.report" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

                <Col md={12} sm={12} lg={12}>
                    <Row>

                        {this.checkAndGetMenuAccessDetail('9D793056-3CD5-5244-2701-E0AC3D983EF5') && //9D793056-3CD5-5244-2701-E0AC3D983EF5
                        <div className="col-md-3 col-sm-6 col-xs-12">
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('TradeRecon', (this.checkAndGetMenuAccessDetail('9D793056-3CD5-5244-2701-E0AC3D983EF5')))} className="text-dark col-sm-full">
                                    <CardType8
                                        title={<IntlMessages id="sidebar.tradeRecon" />}
                                        count={reportTotalCounts ? reportTotalCounts.TradeReconCount : 0}
                                        icon="fa fa-briefcase"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }

                        {this.checkAndGetMenuAccessDetail('0713516F-40A0-002A-8E69-95239B7F54E9') && //0713516F-40A0-002A-8E69-95239B7F54E9
                        <div className="col-md-3 col-sm-6 col-xs-12">
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('SiteTokenReport', (this.checkAndGetMenuAccessDetail('0713516F-40A0-002A-8E69-95239B7F54E9')))} className="text-dark col-sm-full">
                                    <CardType8
                                        title={<IntlMessages id="sidebar.siteTokenReport" />}
                                        count={reportTotalCounts ? reportTotalCounts.SiteTokenConversionCount : 0}
                                        icon="fa fa-rss"
                                        bgClass="bg-dark"
                                    />

                                </a>
                            </div>
                        }

                        {this.checkAndGetMenuAccessDetail('89953702-A505-24CA-8C1C-730FF9F20758') && //89953702-A505-24CA-8C1C-730FF9F20758
                        <div className="col-md-3 col-sm-6 col-xs-12">
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('TradingSummaryLpWise', (this.checkAndGetMenuAccessDetail('89953702-A505-24CA-8C1C-730FF9F20758')))} className="text-dark col-sm-full">
                                    <CardType8
                                        title={<IntlMessages id="sidebar.tradeRouting" />}
                                        count={reportTotalCounts ? reportTotalCounts.TradeRoutingCount : 0}
                                        icon="zmdi zmdi-trending-up"
                                        bgClass="bg-dark"
                                    />

                                </a>
                            </div>
                        }

                        {/* this.checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5') && // Pending
                            <Col md={3}>
                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('TradeRouting',(this.checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5')))} className="text-dark col-sm-full">
                                    <CardType8
                                        title={<IntlMessages id="sidebar.tradeRouting" />}
                                        count="325"
                                        icon="fa fa-snowflake-o"
                                        bgClass="bg-dark"
                                    />

                                </a>
                            </Col>
                         */}

                    </Row>
                </Col>


                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    level={null}
                    placement="right"
                    levelMove={100}
                    getContainer={null}
                    showMask={false}
                >
                    {/* <OrganizationView {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} /> */}
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ totalCount, drawerclose, authTokenRdcer }) => {

    const { reportTotalCounts } = totalCount;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { drawerclose, reportTotalCounts, menuLoading, menu_rights };
}

// export this component with action methods and props
export default connect(mapStateToProps, { getReportCount, getMenuPermissionByID })(ReportsData);
