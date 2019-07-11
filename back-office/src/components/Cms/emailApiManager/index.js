/* 
    Created By : Megha Kariya
    Date : 20-02-2019
    Description : CMS Email API manager List
*/
import React, { Component } from "react";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Import List page Actions...
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { DashboardPageTitle } from '../DashboardPageTitle';
import EmailAPIManager from "./EmailApiManagerWdgt";
import { CardType5 } from 'Components/TradingWidgets/DashboardCard/CardType5';

import { NotificationManager } from "react-notifications";
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
        title: <IntlMessages id="sidebar.cms" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="emailAPIManager.PageTitle" />,
        link: '',
        index: 0
    }
];

const components = {
    EmailAPIManager: EmailAPIManager,
};
const dynamicComponent = (TagName, type, drawerClose, close2Level, closeAll, GUID) => {
    return React.createElement(components[TagName], { type, drawerClose, close2Level, closeAll, GUID });
};
class EmailApiManager extends Component {
    state = {
        componentName: '',
        open: false,
        type: 0,
        menudetail: [],
        Pflag: true,
        GUID: '',
    }

    //fetch details before render
    componentWillMount() {
        this.props.getMenuPermissionByID('08A4E594-9F7E-A790-95ED-AD4F8F8FA271');
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });

            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }
    }

    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: ''
        });
    }
    showComponent = (componentName, permission, type, GUID) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                type: type,
                GUID: GUID
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    close2Level = () => {
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
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="emailAPIManager.PageTitle" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.menuLoading) && <JbsSectionLoader />}

                <div className="row">
                    {this.checkAndGetMenuAccessDetail('7616BC41-5105-3787-6976-10E683C49F45') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailAPIManager', (this.checkAndGetMenuAccessDetail('7616BC41-5105-3787-6976-10E683C49F45')).HasChild, 2, '7616BC41-5105-3787-6976-10E683C49F45')} className="text-dark">
                                <CardType5
                                    title={<IntlMessages id="sidebar.EmailApiManager" />}
                                    icon="zmdi zmdi-trending-up"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('18BDD5AE-822E-3B53-245E-FF60136F2665') &&
                        <div className="col-md-3 col-sm-6 col-xs-12" >
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailAPIManager', (this.checkAndGetMenuAccessDetail('18BDD5AE-822E-3B53-245E-FF60136F2665')).HasChild, 1, '18BDD5AE-822E-3B53-245E-FF60136F2665')} className="text-dark">
                                <CardType5
                                    title={<IntlMessages id="sidebar.SMSApiManager" />}
                                    icon="zmdi zmdi-trending-up"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                </div>

                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.state.type, this.toggleDrawer, this.close2Level, this.closeAll, this.state.GUID)}
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = ({ authTokenRdcer }) => {
    var response = {
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    }
    return response;
}

export default connect(mapStateToProps, {
    getMenuPermissionByID,
})(EmailApiManager)
