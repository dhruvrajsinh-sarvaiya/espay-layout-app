/* 
    Created By : Megha Kariya
    Date : 05-02-2019
    File Comment : CMS Help Manual Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { CountCard } from '../DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getCmsDashboardHelpMenualCount } from "Actions/CmsDashboard";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import HelpManualModule from './helpmanualmodule';
import HelpManual from './helpmanual';
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
        title: <IntlMessages id="sidebar.help" />,
        link: '',
        index: 0
    }
];


// componenet listing
const components = {
    HelpManualModule: HelpManualModule,
    HelpManual: HelpManual,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, permission) => {
    return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, permission });
};
// Component for MyAccount Organization Information dashboard
class HelpManualDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {},
            menudetail: [],
            Pflag: true,
        }
    }

    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
        this.reload();
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

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
        this.reload();
    }

    reload() {
        this.props.getCmsDashboardHelpMenualCount();
    }

    close2Level = () => {
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('8481C365-4D1D-3479-9719-FC57274A95E6');
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getCmsDashboardHelpMenualCount();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        this.setState({ loading: nextProps.loading });
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
        const { drawerClose, loading } = this.props;

        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.help" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('0F113E9B-49BA-0BFB-786A-A1843D8D1468') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('HelpManualModule', (this.checkAndGetMenuAccessDetail('0F113E9B-49BA-0BFB-786A-A1843D8D1468')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.helpmanualmodule" />}
                                    count={( this.props.HelpManualModulescount != undefined) ? this.props.HelpManualModulescount : 0}
                                    icon="zmdi zmdi-help"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('FB40DCDD-80AD-A586-3CB6-364107F33C7D') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('HelpManual', (this.checkAndGetMenuAccessDetail('FB40DCDD-80AD-A586-3CB6-364107F33C7D')).HasChild)} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="sidebar.helpmanual" />}
                                    count={( this.props.HelpManuals != 'undefined') ? this.props.HelpManuals : 0}
                                    icon="zmdi zmdi-help-outline"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={open}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {componentName != '' && dynamicComponent(componentName, this.props, this.onClick, this.close2Level, this.closeAll)}
                </Drawer>
            </div>
        );
    }
}
const mapToProps = ({ cmsDashboard, authTokenRdcer }) => {
    var response = {
        HelpManuals: cmsDashboard.helpMenual.HelpManuals,
        HelpManualModulescount: cmsDashboard.helpMenual.HelpManualModulescount,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
}

export default connect(mapToProps, {
    getCmsDashboardHelpMenualCount,
    getMenuPermissionByID,
})(HelpManualDashboard);
