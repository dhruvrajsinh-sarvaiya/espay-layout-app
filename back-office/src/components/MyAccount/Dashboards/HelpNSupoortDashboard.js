/* 
    Developer : Salim Deraiya
	Date : 27-12-2018
	update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount KYC Configuration Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { complainList, getHelpNSupportData } from 'Actions/MyAccount';
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
		title: <IntlMessages id="sidebar.helpNSupportDashboard" />,
		link: '',
		index: 1
	}
];

let today = new Date();
today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

class HelpNSupoortDashboard extends Component {
	constructor(props) {
		super(props);		
		this.state = {
			open: false,
			componentName: '',
			hlpSptType: '',
			loading: false,
			data: {},
			pagedata: {},
			menudetail: [],
			menuLoading:false,
			menuDetail:{}
		}
	}

	onClick = () => {
		this.setState({ open: this.state.open ? false : true });
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('1ABD31C2-9D0F-58E1-A284-ED8574279D11'); // get myaccount menu permission
}

	showComponent = (componentName, menuDetail, hlpSptType) => {
		//Call every click on card...
		if (menuDetail.HasChild) {
		this.props.complainList({PageIndex : 0, Page_Size : AppConfig.totalRecordDisplayInList, Status : hlpSptType, FromDate : today, ToDate : today});
		//check permission go on next page or not
                var pageData = {
				Status: hlpSptType,
			};
			this.setState({
				pagedata: pageData,
				componentName: componentName,
				open: this.state.open ? false : true,
				menuDetail:menuDetail
			});
		} else {
			NotificationManager.error(<IntlMessages id={"error.permission"} />);
		}
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
		//Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getHelpNSupportData();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}

		//Added by Bharat Jograna, (BreadCrumb)09 March 2019
		//To Close the drawer using breadcrumb data 
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
			this.setState({ open: false });
		}

		if (Object.keys(nextProps.countData).length > 0 && Object.keys(nextProps.countData.TotalCountDetails).length > 0) {
			this.setState({ data: nextProps.countData.TotalCountDetails });
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
	
	Close = () => {
		this.props.drawerClose();
		this.setState({ open: false, componentName: "" });
	}
	render() {
		const { componentName, open, pagedata ,menuDetail} = this.state;
		const { TotalCount, TotalOpenCount, TotalCloseCount, TotalPendidngCount } = this.state.data;
		const {  loading } = this.props;

		return (
			<div className="jbs-page-content">
				<WalletPageTitle title={<IntlMessages id="sidebar.helpNSupportDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={this.Close} closeAll={this.closeAll} />
				{(this.state.menuLoading || loading) && <JbsSectionLoader />}
				<div className="row">
					{this.checkAndGetMenuAccessDetail('CD0FE3FE-600F-3296-0AC8-BF7BF4AC06CB') && //CD0FE3FE-600F-3296-0AC8-BF7BF4AC06CB
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ComplainReportDashboard', this.checkAndGetMenuAccessDetail('CD0FE3FE-600F-3296-0AC8-BF7BF4AC06CB'), '')} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.totalComplain" />}
									count={TotalCount > 0 ? TotalCount : 0}
									icon="fa fa-list-alt"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('187B1C67-2598-241E-9DAC-2299C1717181') && //187B1C67-2598-241E-9DAC-2299C1717181
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ComplainReportDashboard', this.checkAndGetMenuAccessDetail('187B1C67-2598-241E-9DAC-2299C1717181'), 1)} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.openComplain" />}
									count={TotalOpenCount > 0 ? TotalOpenCount : 0}
									icon="fa fa-folder-open-o"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('270CA4F6-77AC-64FA-24B1-6221DB155AC6') && //270CA4F6-77AC-64FA-24B1-6221DB155AC6
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ComplainReportDashboard', this.checkAndGetMenuAccessDetail('270CA4F6-77AC-64FA-24B1-6221DB155AC6'), 2)} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.closeComplain" />}
									count={TotalCloseCount > 0 ? TotalCloseCount : 0}
									icon="fa fa-folder-open"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('1F0F51CC-539B-120D-0A48-B1ECCD7B45C7') && //1F0F51CC-539B-120D-0A48-B1ECCD7B45C7
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ComplainReportDashboard', this.checkAndGetMenuAccessDetail('1F0F51CC-539B-120D-0A48-B1ECCD7B45C7'), 3)} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.pendingComplain" />}
									count={TotalPendidngCount > 0 ? TotalPendidngCount : 0}
									icon="fa fa-pencil-square"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
				</div>
				<Drawer
					width="100%"
					handler={false}
					open={open}
					placement="right"
					className="drawer1"
					level=".drawer0"
					levelMove={100}
					height="100%"
				>
					{componentName !== "" && <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} pagedata={pagedata} props={this.props} menuDetail={menuDetail} />}
				</Drawer>
			</div>
		);
	}
}

const mapToProps = ({ complainRdcer, drawerclose,authTokenRdcer }) => {
	//Added by Bharat Jograna (BreadCrumb)09 March 2019
	if (drawerclose.bit === 1) {
		setTimeout(function () { drawerclose.bit = 2 }, 1000);
	}
	const { countData, loading } = complainRdcer;
	const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
	return { countData, loading, drawerclose,menuLoading,
        menu_rights };
}

export default connect(mapToProps, {
	getHelpNSupportData,
	complainList,
	getMenuPermissionByID,
})(HelpNSupoortDashboard);