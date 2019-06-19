// Trading Dashboard By Tejas Date : 24/11/2018
import React from 'react';
import { connect } from 'react-redux';

// intl messages
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Row, Col } from 'reactstrap';
import { NotificationManager } from "react-notifications";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// import dashboard
import { UserTrade, TradeSummary, TradingChart, Markets, ActiveUserTrade, TradeSummaryData, Configuration, Reports, ReportsData, ConfiguratioData, GainersList, LoserList } from 'Components/TradingWidgets';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// componenet listing
const components = {
    userTradeData: ActiveUserTrade,
    TradeSummaryData: TradeSummaryData,
    ReportsData: ReportsData,
    ConfiguratioData: ConfiguratioData,
    GainersList: GainersList,
    LoserList: LoserList,
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

class TradingDashboard extends React.Component {
    state = {
        componentName: '',
        open: false,
        tradeSummaryCounts: [],
        configurationsCounts: [],
        userTradeCounts: [],
        menudetail: []
    }
    //fetch details before render
    componentWillMount() {
        this.props.getMenuPermissionByID('5F9F682D-3B7E-35C0-6062-C3F80C2D4C56'); // get Trading menu permission
    }
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: ''
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
        });
    }

    componentWillReceiveProps(nextProps) {
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
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({
                open: false,
            })
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
        const { match } = this.props;
        return (
            <div className="drawer-data trading-dashboard-wrapper">
                {this.props.menuLoading && <JbsSectionLoader />}
                <PageTitleBar
                    title={<IntlMessages id="sidebar.dashboard5" />}
                    match={match}
                />
                <Row>
                    {this.checkAndGetMenuAccessDetail('9F248B4B-9B99-6573-6D84-BD2A3F694EA0') && //9F248B4B-9B99-6573-6D84-BD2A3F694EA0
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('userTradeData', (this.checkAndGetMenuAccessDetail('9F248B4B-9B99-6573-6D84-BD2A3F694EA0')).HasChild)} className="text-dark col-sm-full">
                                <UserTrade clickEvent={this.toggleDrawer} />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('06A85CAF-0CA8-28F0-1BBE-F0923F54046C') && //06A85CAF-0CA8-28F0-1BBE-F0923F54046C
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('TradeSummaryData', (this.checkAndGetMenuAccessDetail('06A85CAF-0CA8-28F0-1BBE-F0923F54046C')).HasChild)} className="text-dark col-sm-full">
                                <TradeSummary clickEvent={this.toggleDrawer} />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('6D940304-6563-858F-9C6F-0974F07D374B') && //6D940304-6563-858F-9C6F-0974F07D374B
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ConfiguratioData', (this.checkAndGetMenuAccessDetail('6D940304-6563-858F-9C6F-0974F07D374B')).HasChild)} className="text-dark col-sm-full">
                                <Configuration clickEvent={this.toggleDrawer} />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('6BB11B37-7249-2DA7-31E6-C8EBCFBC6DC4') && //6BB11B37-7249-2DA7-31E6-C8EBCFBC6DC4
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ReportsData', (this.checkAndGetMenuAccessDetail('6BB11B37-7249-2DA7-31E6-C8EBCFBC6DC4')).HasChild)} className="text-dark col-sm-full">
                                <Reports clickEvent={this.toggleDrawer} />
                            </a>
                        </div>
                    }
                </Row>
                {this.checkAndGetMenuAccessDetail('4594A9C5-76B8-2A35-528E-90D22FC14541') && //4594A9C5-76B8-2A35-528E-90D22FC14541
   <div className="mb-30">
                            <TradingChart />
                        </div>
                }
                {this.checkAndGetMenuAccessDetail('E0B245E9-52C5-92B6-3D22-8CAF17D45C07') && //E0B245E9-52C5-92B6-3D22-8CAF17D45C07
                    <div className="row">
                    <div className="mb-30 col-md-12">
                            <Markets />
                        </div>
                    </div>
                }
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('6A32294E-78EB-75BA-0507-537851461ABD') && //6A32294E-78EB-75BA-0507-537851461ABD
              <div className="col-md-6 col-sm-12 col-xs-12">
                            <GainersList />
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('28DADF99-3CA6-98EA-2CFB-7FF5E8630317') && // 28DADF99-3CA6-98EA-2CFB-7FF5E8630317
           <div className="col-md-6 col-sm-12 col-xs-12">
                            <LoserList />
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
                    //level=".drawer1"
                    level={null}
                    getContainer={null}
                    showMask={false}
                    height="100%"

                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </div>
        )
    }
}

// code comment & add new code by devang parekh for handle mapstate to props (18-3-2019)
const mapStateToProps = ({ drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        drawerclose,
        menuLoading,
        menu_rights
    };
}

// export this component with action methods and props
export default connect(mapStateToProps, { getMenuPermissionByID })(TradingDashboard);
//end