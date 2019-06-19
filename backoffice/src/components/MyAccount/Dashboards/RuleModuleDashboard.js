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
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
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
        title: <IntlMessages id="sidebar.ruleModuleDashboard" />,
        link: '',
        index: 3
    }
];

//Component for MyAccount Rules Dashboard
class RuleModuleDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menudetail: [],
            menuLoading:false
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('647CC6FF-970C-46EE-8D9C-4627FF5657F5'); // get myaccount menu permission

    }
    //Added by Bharat Jograna, (BreadCrumb)13 March 2019
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
        //Ad
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }
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
        const { componentName, open, menuDetail } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                                {(this.state.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.ruleModuleDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('3F4A1672-1B3A-4FE9-4B20-04786614A5B5') && //3F4A1672-1B3A-4FE9-4B20-04786614A5B5
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListRuleModule', this.checkAndGetMenuAccessDetail('3F4A1672-1B3A-4FE9-4B20-04786614A5B5'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.listRuleModule" />}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('DE581212-5B90-1C64-4992-449FA6422CB7') && //DE581212-5B90-1C64-4992-449FA6422CB7
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditRuleModule', this.checkAndGetMenuAccessDetail('DE581212-5B90-1C64-4992-449FA6422CB7'))} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.addRuleModule" />}
                                    icon="fa fa-plus-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                <Drawer
                    width={componentName === 'AddEditRuleModule' ? "50%" : "100%"}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddEditRuleModule' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} menuDetail={this.checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />
                </Drawer>
            </div>
        );
    }
}

//Added by Bharat Jograna (BreadCrumb)13 March 2019
const mapToProps = ({ drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose, menuLoading, menu_rights };
}

export default connect(mapToProps, {getMenuPermissionByID})(RuleModuleDashboard);