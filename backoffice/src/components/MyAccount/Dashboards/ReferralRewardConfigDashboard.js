/**
 * Created By Sanjay
 * Creadted Date : 09/02/2019
 * Configuration Setup For Referral System
 */
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import { SimpleCard } from './Widgets';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
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
        title: <IntlMessages id="my_account.referralSystem" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.rewardConfig" />,
        link: '',
        index: 2
    }
];

class ReferralRewardConfigDashboard extends Component {

    state = {
        open: false,
        componentName: '',
        menudetail: [],
        menuLoading:false
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
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
             NotificationManager.error(<IntlMessages id={"error.permission"} />)
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    close2Level = () => {
        this.props.close2Level();
        this.setState({ open: false });
    }
    
    componentWillMount() {
        this.props.getMenuPermissionByID('AD6FE99F-6CA2-32AF-6238-09B17BBB9434'); // get myaccount menu permission

    }

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
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false })
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
        const { componentName, open, menuDetail ,loading } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.rewardConfig" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading ||loading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('8A159479-39BB-8728-0D98-98D4E3769D24') && //AD6FE99F-6CA2-32AF-6238-09B17BBB9434 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListReferralRewardConfig', this.checkAndGetMenuAccessDetail('8A159479-39BB-8728-0D98-98D4E3769D24'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ListReferralRewardConfig" />}
                                icon="fa fa-list-alt"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                     }
                    {this.checkAndGetMenuAccessDetail('1A3A4326-44FB-49E9-2979-F9AEB30D9AD7') && //AD6FE99F-6CA2-32AF-6238-09B17BBB9434 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddReferralRewardConfig', this.checkAndGetMenuAccessDetail('1A3A4326-44FB-49E9-2979-F9AEB30D9AD7'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.AddReferralRewardConfig" />}
                                icon="fa fa-plus-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                     }
                </div>
                <Drawer
                    width={componentName === 'AddReferralRewardConfig' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddReferralRewardConfig' ? "drawer1 half_drawer" : "drawer1"}
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} close2Level={this.close2Level} closeAll={this.closeAll} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ drawerclose ,authTokenRdcer}) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);

    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose,menuLoading,  menu_rights };
}

export default connect(mapStateToProps,{
    getMenuPermissionByID
})(ReferralRewardConfigDashboard);