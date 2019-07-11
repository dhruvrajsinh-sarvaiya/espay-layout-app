/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : ERC223 Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import Increase from 'Components/ERC223Dashboard/Increase';
import DecreaseTokenSupply from 'Components/ERC223Dashboard/DecreaseTokenSupply';
import TokenTransfer from 'Components/ERC223Dashboard/TokenTransfer';
import SetTransferFee from 'Components/ERC223Dashboard/SetTransferFee';
import DestroyBlackFund from 'Components/ERC223Dashboard/DestroyBlackFund';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
//wallet widgets...
import {
    SimpleCard
} from './DashboardWidgets';

//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
// componenet listing...
const components = {
    Increase: Increase,
    DecreaseTokenSupply: DecreaseTokenSupply,
    TokenTransfer: TokenTransfer,
    SetTransferFee: SetTransferFee,
    DestroyBlackFund:DestroyBlackFund
};
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
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.Erc223dashboard" />,
        link: '',
        index: 1
    },
];
// dynamic component binding...
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};
// Component for wallet dashboard
class ERC223Dashboard extends Component {
    state = {
        componentName: '',
        open: false,
        menudetail: [],
    }
    //fetch details before render
    componentWillMount() {
        this.props.getMenuPermissionByID('4007FDB1-0D02-0210-959F-FFDC4BAD668B'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
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
        });
    }
    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {

            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };
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
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.Erc223dashboard" />} breadCrumbData={BreadCrumbData} drawerClose={this.props.drawerClose} closeAll={this.closeAll} />
                <React.Fragment>
                    {this.props.menuLoading && <JbsSectionLoader />}
                    <div className="row">
                        {this.checkAndGetMenuAccessDetail('37434F40-8165-2628-263D-8A06E9FAA2DD') && //37434F40-8165-2628-263D-8A06E9FAA2DD
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("Increase", (this.checkAndGetMenuAccessDetail('37434F40-8165-2628-263D-8A06E9FAA2DD')).HasChild)}  //566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                                    className="text-dark col-sm-full"
                                >
                                    <SimpleCard
                                        title={<IntlMessages id="lable.Increase" />}
                                        icon="fa fa-cogs"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }
                        {this.checkAndGetMenuAccessDetail('15D82444-7816-9EC9-1A0B-320BC6742CC8') && //15D82444-7816-9EC9-1A0B-320BC6742CC8
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("DecreaseTokenSupply", (this.checkAndGetMenuAccessDetail('15D82444-7816-9EC9-1A0B-320BC6742CC8')).HasChild)}  //566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                                    className="text-dark col-sm-full"
                                >
                                    <SimpleCard
                                        title={<IntlMessages id="lable.Decrease" />}
                                        icon="fa fa-cogs"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }
                        {this.checkAndGetMenuAccessDetail('A1310313-55C5-47F8-313C-5D0BE11D9116') && //A1310313-55C5-47F8-313C-5D0BE11D9116
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("SetTransferFee", (this.checkAndGetMenuAccessDetail('A1310313-55C5-47F8-313C-5D0BE11D9116')).HasChild)}  //566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                                    className="text-dark col-sm-full"
                                >
                                    <SimpleCard
                                        title={<IntlMessages id="lable.SettransferFee" />}
                                        icon="fa fa-cogs"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }
                        {this.checkAndGetMenuAccessDetail('9A157A6C-73F3-1EB5-3E67-B6E6302170F4') && //9A157A6C-73F3-1EB5-3E67-B6E6302170F4
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("TokenTransfer", (this.checkAndGetMenuAccessDetail('9A157A6C-73F3-1EB5-3E67-B6E6302170F4')).HasChild)}  //566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                                    className="text-dark col-sm-full"
                                >
                                    <SimpleCard
                                        title={<IntlMessages id="lable.TokenTransfer" />}
                                        icon="fa fa-cogs"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }
                        {this.checkAndGetMenuAccessDetail('D88501EE-5AA8-279E-52B9-CCF988E69126') && //D88501EE-5AA8-279E-52B9-CCF988E69126
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("DestroyBlackFund", (this.checkAndGetMenuAccessDetail('D88501EE-5AA8-279E-52B9-CCF988E69126')).HasChild)}  //566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C
                                    className="text-dark col-sm-full"
                                >
                                    <SimpleCard
                                        title={<IntlMessages id="lable.DestroyBlackFund" />}
                                        icon="fa fa-cogs"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }
                    </div>
                    <Drawer
                        width={this.state.componentName === "DepositionInterval" ? "50%" : "100%"}
                        handler={false}
                        open={this.state.open}
                        // onMaskClick={this.toggleDrawer}
                        className="drawer1"
                        placement="right"
                        levelMove={100}
                        level={null}
                    >
                        {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.closeDrawer, this.closeAll)}
                    </Drawer>
                </React.Fragment>
            </div>
        );
    }
}

const mapToProps = ({ superAdminReducer, drawerclose, authTokenRdcer }) => {
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
})(ERC223Dashboard);
