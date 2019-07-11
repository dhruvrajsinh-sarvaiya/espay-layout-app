/* 
    Developer : Bharat Jograna
    Date : 27 March 2019
    File Comment : MyAccount Affiliate Scheme Type Mapping Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
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
        title: <IntlMessages id="sidebar.affiliateSchemeTypeMapping" />,
        link: '',
        index: 2
    }
];

//Component for MyAccount Affiliate Scheme Type Mapping Dashboard
class AffiliateSchemeTypeMappingDashboard extends Component {
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
        this.props.getMenuPermissionByID('EA82D392-8ED4-1238-9180-2054EB989C11'); // get myaccount menu permission
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
                <WalletPageTitle title={<IntlMessages id="sidebar.affiliateSchemeTypeMapping" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
            {this.checkAndGetMenuAccessDetail('3497E52A-023C-5AE2-9ACF-ACD7A07E9FF6') && //3497E52A-023C-5AE2-9ACF-ACD7A07E9FF6 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">                    
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateSchemeTypeMapping',this.checkAndGetMenuAccessDetail('3497E52A-023C-5AE2-9ACF-ACD7A07E9FF6'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="sidebar.listAffiliateSchemeTypeMapping" />}
                                icon="fa fa-list-alt"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    }
                    {this.checkAndGetMenuAccessDetail('63CC6D76-239C-0548-4231-53C3A0F5873C') && //63CC6D76-239C-0548-4231-53C3A0F5873C */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditAffiliateSchemeTypeMapping',this.checkAndGetMenuAccessDetail('63CC6D76-239C-0548-4231-53C3A0F5873C'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="sidebar.addAffiliateSchemeTypeMaping" />}
                                icon="fa fa-plus-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>}
                </div>
                <Drawer
                    width={componentName === 'AddEditAffiliateSchemeTypeMapping' ? "50%" : "100%"}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddEditAffiliateSchemeTypeMapping' ? "drawer1 half_drawer" : "drawer1"}
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

export default connect(mapToProps,
    { getMenuPermissionByID })
    (AffiliateSchemeTypeMappingDashboard);