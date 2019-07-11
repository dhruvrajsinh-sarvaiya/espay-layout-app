/* 
    Developer : Saloni Rathod
    Date : 28-03-2019
    File Comment : MyAccount Affiliate Scheme Detail Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
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
        title: <IntlMessages id="sidebar.affiliateManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.affiliateSchemeDetailDashboard" />,
        link: '',
        index: 2
    }
];

//Component for MyAccount Affiliate Scheme Detail Dashboard
class AffiliateSchemeDetailDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('B37DC4A0-55E2-3102-3D11-7578DC19643B'); // get myaccount menu permission
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
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
                      {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.affiliateSchemeDetailDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                     {this.checkAndGetMenuAccessDetail('BE0245A0-8F70-8E3D-10BB-8CD0BC9D60C4') && //BE0245A0-8F70-8E3D-10BB-8CD0BC9D60C4 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateSchemeDetail', this.checkAndGetMenuAccessDetail('BE0245A0-8F70-8E3D-10BB-8CD0BC9D60C4'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="sidebar.listAffiliateSchemeDetail" />}
                                icon="fa fa-list-alt"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                     }
                        {this.checkAndGetMenuAccessDetail('64F62E1B-5F56-3FFC-6A20-A88FD9BF2D76') && //64F62E1B-5F56-3FFC-6A20-A88FD9BF2D76 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditAffiliateSchemeDetail', this.checkAndGetMenuAccessDetail('64F62E1B-5F56-3FFC-6A20-A88FD9BF2D76'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="sidebar.addAffiliateSchemeDetail" />}
                                icon="fa fa-plus-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                     }
                </div>
                <Drawer
                    width={componentName === 'AddEditAffiliateSchemeDetail' ? "50%" : "100%"}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddEditAffiliateSchemeDetail' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />
                </Drawer>
            </div>
        );
    }
}

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

export default connect(mapToProps, {getMenuPermissionByID})(AffiliateSchemeDetailDashboard);