/* 
    Developer : Saloni Rathod
	Date : 13-02-2019
	Updated By : Bharat Jograna, 04 March 2019, (BreadCrumb)13 March 2019
    File Comment : MyAccount Affiliate Report Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { CountCard } from './Widgets'; //Added by Bharat Jograna
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import AffiliateInviteFriendChart from "./AffiliateInviteFriendChart";
import AffiliateMonthlyCommissionByTypeChart from './AffiliateMonthlyCommissionByTypeChart';
//To Get All Counts
import { affiliateAllCount } from 'Actions/MyAccount';
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
		title: <IntlMessages id="sidebar.affiliateReport" />,
		link: '',
		index: 2
	}
];

//Component for MyAccount KYC Configuration Dashboard
class AffiliateReportDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			componentName: '',
			loading: false,
			allCounts: {},
			menudetail: [],
            menuLoading:false
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('D92FA0BA-6C68-83E3-0BFD-AE309DA325F4'); // get myaccount menu permission
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.affiliateAllCount();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}
		//Added by Bharat Jograna, (BreadCrumb)13 March 2019
		//To Close the drawer using breadcrumb data 
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
			this.setState({ open: false });
		}

		if (nextProps.list.ReturnCode === 0 && nextProps.list.hasOwnProperty('Response')) {
			this.setState({ allCounts: nextProps.list.Response });
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
		const { AffiliateCount, CommissionCount, ReferralLinkCount, FacebookLinkCount, TwitterLinkCount, EmailSentCount, SMSSentCount } = this.state.allCounts; //Added By Bharat Jograna
		const { componentName, open, loading } = this.state;
		const { drawerClose } = this.props;

		return (
			<div className="jbs-page-content">
				<WalletPageTitle title={<IntlMessages id="sidebar.affiliateReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
				{(this.state.menuLoading ||loading) && <JbsSectionLoader />}
				<div className="row">
					{this.checkAndGetMenuAccessDetail('173BE5C4-22B2-6CDA-29A0-4339D9C70ED0') && //173BE5C4-22B2-6CDA-29A0-4339D9C70ED0
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateSignupReport', this.checkAndGetMenuAccessDetail('173BE5C4-22B2-6CDA-29A0-4339D9C70ED0'))} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.affiliateSignupReport" />}
									count={AffiliateCount > 0 ? AffiliateCount : 0}
									icon="zmdi zmdi-account-add"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('24B126E5-7957-60E8-4286-CF21D02C0A96') && //24B126E5-7957-60E8-4286-CF21D02C0A96
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateCommissionReport', this.checkAndGetMenuAccessDetail('24B126E5-7957-60E8-4286-CF21D02C0A96'))} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.affiliateCommisionReport" />}
									count={CommissionCount > 0 ? CommissionCount : 0}
									icon="fa fa-handshake-o"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{/** Added By Bharat Jograna */}
					{this.checkAndGetMenuAccessDetail('D1C16497-1D57-985D-1B19-9DAC24E37E1A') && //D1C16497-1D57-985D-1B19-9DAC24E37E1A
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateFacebookShareReport', this.checkAndGetMenuAccessDetail('D1C16497-1D57-985D-1B19-9DAC24E37E1A'))} className="text-dark">
								<CountCard
									title={<IntlMessages id="my_account.facebookShareReport" />}
									count={FacebookLinkCount > 0 ? FacebookLinkCount : 0}
									icon="zmdi zmdi-facebook"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('995EA97B-81C6-5B0F-5B77-7597CFCB23A6') && //995EA97B-81C6-5B0F-5B77-7597CFCB23A6
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateTwitterShareReport', this.checkAndGetMenuAccessDetail('995EA97B-81C6-5B0F-5B77-7597CFCB23A6'))} className="text-dark">
								<CountCard
									title={<IntlMessages id="my_account.twitterShareReport" />}
									count={TwitterLinkCount > 0 ? TwitterLinkCount : 0}
									icon="zmdi zmdi-twitter"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('3EAD5829-8C3F-13E4-456F-0CEC66F52FDA') && //3EAD5829-8C3F-13E4-456F-0CEC66F52FDA
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateClickOnLinkReport', this.checkAndGetMenuAccessDetail('3EAD5829-8C3F-13E4-456F-0CEC66F52FDA'))} className="text-dark">
								<CountCard
									title={<IntlMessages id="my_account.clickOnLinkReport" />}
									count={ReferralLinkCount > 0 ? ReferralLinkCount : 0}
									icon="fa fa-hand-pointer-o"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('D3F8AD91-0686-3C5C-60F5-0233F78B8E04') && //D3F8AD91-0686-3C5C-60F5-0233F78B8E04
						<div className="col-md-3 col-sm-6 col-xs-12">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateEmailSentReport', this.checkAndGetMenuAccessDetail('D3F8AD91-0686-3C5C-60F5-0233F78B8E04'))} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.affiliateEmailReport" />}
									count={EmailSentCount > 0 ? EmailSentCount : 0}
									icon="zmdi zmdi-email"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
					{this.checkAndGetMenuAccessDetail('AB532624-2924-16E9-A315-594FF7D283AC') && //AB532624-2924-16E9-A315-594FF7D283AC
						<div className="col-md-3 col-sm-6 col-xs-12 ">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAffiliateSmsSentReport', this.checkAndGetMenuAccessDetail('AB532624-2924-16E9-A315-594FF7D283AC'))} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.affiliateSmsReport" />}

									count={SMSSentCount > 0 ? SMSSentCount : 0}
									icon="zmdi zmdi-comment-outline"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>}
				</div>
				<div className="row">
					{this.checkAndGetMenuAccessDetail('F4ADF289-6E50-2D78-5122-BA63A910168A') && //F4ADF289-6E50-2D78-5122-BA63A910168A
						<div className="col-sm-12 col-md-3 invite_frnd box_shadow m-0">
							<AffiliateInviteFriendChart allCounts={this.state.allCounts} />
						</div>}
					{this.checkAndGetMenuAccessDetail('AB18A305-6008-5333-49CC-0A997CDA59C7') && //AB18A305-6008-5333-49CC-0A997CDA59C7
					<div className="col-sm-12 col-md-9 box_shadow">
						<AffiliateMonthlyCommissionByTypeChart />
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
					{componentName !== '' &&
						<DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
				</Drawer>
			</div>
		);
	}
}


//Mapstatetoprops...
const mapStateToProps = ({ AffiliateRdcer, drawerclose ,authTokenRdcer}) => {
	//Added by Bharat Jograna (BreadCrumb)09 March 2019
	//To Close the drawer using breadcrumb data 
	if (drawerclose.bit === 1) {
		setTimeout(function () { drawerclose.bit = 2 }, 1000);
	}
	const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
	const { list, loading } = AffiliateRdcer;
	return { list, loading, drawerclose,  menuLoading,
        menu_rights };
}

export default connect(mapStateToProps, {
	affiliateAllCount,
	getMenuPermissionByID
})(AffiliateReportDashboard);