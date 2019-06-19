/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    Updated By : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : MyAccount User Dashboard Component
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
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
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
        title: <IntlMessages id="sidebar.userDashboard" />,
        link: '',
        index: 2
    },
];

//Component for MyAccount User Dashboard
class UserDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupOpen: false,
            open: false,
            componentName: '',
            menudetail: [],
            menuLoading:false
        }
    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    handleClose = () => {
        this.setState({ popupOpen: !this.state.popupOpen });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
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
    componentWillMount() {
        this.props.getMenuPermissionByID('3BF93524-77A4-7274-0837-3480CFF786A9'); // get myaccount menu permission

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
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
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
        const { componentName, open, menuDetail } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                                                                                {(this.state.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.userDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('6934CCA1-3F29-2407-61E9-7865837C0905') && //6934CCA1-3F29-2407-61E9-7865837C0905
                        <div className="col-sm-12 col-md-3 w-xs-full">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListUser', this.checkAndGetMenuAccessDetail('6934CCA1-3F29-2407-61E9-7865837C0905'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.listUsers" />}
                                    icon="fa fa-list-alt"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('179F0A38-445D-4CA1-905D-662D07F22E20') && //179F0A38-445D-4CA1-905D-662D07F22E20
                        <div className="col-sm-12 col-md-3 w-xs-full">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditUser', this.checkAndGetMenuAccessDetail('179F0A38-445D-4CA1-905D-662D07F22E20'))} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.addUsers" />}
                                    icon="fa fa-plus-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>
                {/* Drawer Start */}
                <Drawer
                    width={componentName === 'AddEditUser' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props}  />
                </Drawer>
            </div>
        );
    }
}

//Added by Bharat Jograna (BreadCrumb)09 March 2019
const mapToProps = ({ drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapToProps, {getMenuPermissionByID})(UserDashboard);