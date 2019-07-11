/* 
   added by jayshreeba gohil 12/06/2019
   component for ArbitragePairConfiguration
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
//wallet widgets...
import { SimpleCard } from 'Components/Wallet/DashboardWidgets';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { DashboardPageTitle } from '../../Cms/DashboardPageTitle';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

import CoinConfiguration from '../../TradingWidgets/Configuration/Components/CoinConfiguration';
import ManageMarketList from '../../TradingWidgets/Configuration/Components/ManageMarkets/ManageMarketList';
import PairConfigurationList from '../../PairConfiguration/component/PairConfigurationList';
import AppConfig from 'Constants/AppConfig';



const components = {
    CoinConfiguration: CoinConfiguration,
    ManageMarketList: ManageMarketList,
    PairConfigurationList: PairConfigurationList,


};
// dynamic component binding...
const dynamicComponent = (TagName, props, drawerClose, closeAll, IsArbitrage) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, IsArbitrage });
};
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
        title: <IntlMessages id="lable.ArbitragePairConfiguration" />,
        link: '',
        index: 0
    },

];

// Component for wallet dashboard
class ArbitragePairConfiguration extends Component {
    state = {
        componentName: '',
        open: false,
        menudetail: [],
    }
    //fetch details before render
    componentWillMount() {
        this.props.getMenuPermissionByID('ED741203-0D00-08EB-A136-77D0133A0F55'); // get Arbitrage menu permission
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
                componentName: ''
            })
        }
    }
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
    }
    /* drawe close */
    closeDrawer = () => {
        this.setState({
            open: false,
            componentName: ''
        });
    }
    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: true,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    closeAll = () => {
        this.setState({
            open: false,
            componentName: ''
        });
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
        const { drawerClose } = this.props;

        return (
            <React.Fragment>
                <DashboardPageTitle title={<IntlMessages id="lable.ArbitragePairConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {this.props.menuLoading && <JbsSectionLoader />}
                <div className="row">


                    {/* {this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381') && //3B9E778F-28E0-98F1-52FE-DAD191245381 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        {/* {this.props.walletSummary.loading ? */}
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('PairConfigurationList', true, { Arbitrage: 1 })} className="text-dark col-sm-full">
                            {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', (this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381')).HasChild)} className="text-dark col-sm-full"> */}
                            <SimpleCard
                                title={<IntlMessages id="sidebar.PairConfiguration" />}
                                icon="zmdi zmdi-code-setting"
                            />
                        </a>
                        {/* } */}
                    </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381') && //3B9E778F-28E0-98F1-52FE-DAD191245381 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        {/* {this.props.walletSummary.loading ? */}
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ManageMarketList', true, { Arbitrage: 1 })} className="text-dark col-sm-full">
                            {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', (this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381')).HasChild)} className="text-dark col-sm-full"> */}
                            <SimpleCard
                                title={<IntlMessages id="sidebar.ManageMarket" />}
                                icon="zmdi zmdi-widgets"
                            />
                        </a>
                        {/* } */}
                    </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381') && //3B9E778F-28E0-98F1-52FE-DAD191245381 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        {/* {this.props.walletSummary.loading ? */}
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('CoinConfiguration', true, { Arbitrage: 1 })} className="text-dark col-sm-full">
                            {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', (this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381')).HasChild)} className="text-dark col-sm-full"> */}
                            <SimpleCard
                                title={<IntlMessages id="sidebar.CoinConfiguration" />}
                                icon="fa fa-life-ring"
                            />
                        </a>
                        {/* } */}
                    </div>
                    {/* } */}
                </div>

                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    className="drawer1 half_drawer"
                    placement="right"
                    levelMove={100}
                    level={null}
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.closeDrawer, this.closeAll, 1)}
                </Drawer>
            </React.Fragment>
        );
    }
}

const mapToProps = ({ drawerclose, authTokenRdcer }) => {
    // breadcrumb 
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
        menu_rights,
        menuLoading
    };
};

export default connect(mapToProps, {
    getMenuPermissionByID
})(ArbitragePairConfiguration);
