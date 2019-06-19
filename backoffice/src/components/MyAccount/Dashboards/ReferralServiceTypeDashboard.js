/**
 * Created By Sanjay
 * Created Date 13/02/2019
 * Component For Referral Service Type
 */
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import { SimpleCard } from './Widgets';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
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
        title: <IntlMessages id="my_account.referralServiceTypeDashboard" />,
        link: '',
        index: 2
    }
];

class ReferralServiceTypeDashboard extends Component {
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
NotificationManager.error(<IntlMessages id={"error.permission"} />);
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
        this.props.getMenuPermissionByID('34883BBA-9748-6FC4-A52B-80E687B75D09'); // get myaccount menu permission

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
        const { componentName, open, menuDetail } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.referralServiceTypeDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {this.state.menuLoading  && <JbsSectionLoader />}
                <div className="row">
                {this.checkAndGetMenuAccessDetail('DD07BC7C-5190-0EED-99AA-2AF167911FDB') && //34883BBA-9748-6FC4-A52B-80E687B75D09 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListReferralServiceType', this.checkAndGetMenuAccessDetail('DD07BC7C-5190-0EED-99AA-2AF167911FDB'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.ListReferralServiceType" />}
                                icon="fa fa-list-alt"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                     }
                    {this.checkAndGetMenuAccessDetail('D38B276F-9387-31B7-94F4-97CAB74F1F57') && //34883BBA-9748-6FC4-A52B-80E687B75D09 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddReferralServiceType', this.checkAndGetMenuAccessDetail('D38B276F-9387-31B7-94F4-97CAB74F1F57'))} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.AddReferralServiceType" />}
                                icon="fa fa-plus-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                     }
                </div>
                <Drawer
                    width={componentName === 'AddReferralServiceType' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    placement="right"
                    className={componentName === 'AddReferralServiceType' ? "drawer1 half_drawer" : "drawer1"}
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

const mapStateToProps = ({ drawerclose,authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose,  menuLoading,menu_rights };
}
export default connect(mapStateToProps,{
    getMenuPermissionByID
})(ReferralServiceTypeDashboard);