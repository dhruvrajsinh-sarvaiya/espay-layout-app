/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    Updated By : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : MyAccount Rules Module Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)13 March 2019 
import Drawer from 'rc-drawer';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
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
        title: <IntlMessages id="sidebar.ruleManagement" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.ruleSubModuleDashboard" />,
        link: '',
        index: 3
    }
];

//Component for MyAccount Rules Dashboard
class RuleSubModuleDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menudetail: [],
            menuLoading: false
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
    componentWillMount() {
        this.props.getMenuPermissionByID('193E6485-574A-47B7-8884-BEDABE650EE0'); // get myaccount menu permission

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
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
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
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                {(this.state.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.ruleSubModuleDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('6601548D-33B5-6ADE-9ECE-D144128E2515') && //6601548D-33B5-6ADE-9ECE-D144128E2515
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListRuleSubModule', this.checkAndGetMenuAccessDetail('6601548D-33B5-6ADE-9ECE-D144128E2515'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.listRuleSubModule" />}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('D634E6A3-7213-A41D-22FF-D947CCEA2C52') && //D634E6A3-7213-A41D-22FF-D947CCEA2C52
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditRuleSubModule', this.checkAndGetMenuAccessDetail('D634E6A3-7213-A41D-22FF-D947CCEA2C52'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.addRuleSubModule" />}
                                    icon="fa fa-plus-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'AddEditRuleSubModule' ? "50%" : "100%"}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddEditRuleSubModule' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} />
                </Drawer>
            </div>
        );
    }
}

//Added by Bharat Jograna (BreadCrumb)13 March 2019
const mapToProps = ({ drawerclose, authTokenRdcer }) => {
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

export default connect(mapToProps, { getMenuPermissionByID })(RuleSubModuleDashboard);