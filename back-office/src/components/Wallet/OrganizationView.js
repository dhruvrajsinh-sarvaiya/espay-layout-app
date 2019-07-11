/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Organization Dashboard View
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import ChartConfig from 'Constants/chart-config';
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import {
	CardWidgetType2,
	CardWidgetType5,
	CardWidgetType6,
	CardWidgetType7,
	CardWidgetSwitch,
	WalletFeedsWidget
} from './DashboardWidgets';
import CardWidgetPolicies from './DashboardWidgets/CardWidgetPolicies';
import CardWidgetWalletUsers from './DashboardWidgets/CardWidgetWalletUsers';
import {
	getWalletDetails,
	getWalletTypes,
	getTransactionGraphData,
	getChannelDetails,
	getWalletTrnTypes
} from "Actions/Wallet";
import Wallets from "Components/Wallets/Wallets";
import TransactionTypes from "./TransactionTypes";
import OrganizationUsersList from "./OrganizationUsersList";
import ChargeTypeView from "./ChargeTypeView";

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
		title: <IntlMessages id="sidebar.wallet" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="walletDeshbard.organizations" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="walletDeshbard.organization" />,
		link: '',
		index: 2
	},
];
const components = {
	Wallets: Wallets,
	TransactionTypes: TransactionTypes,
	OrganizationUsersList: OrganizationUsersList,
	ChargeTypeView: ChargeTypeView
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
	return React.createElement(components[TagName], {
		props,
		drawerClose,
		closeAll
	});
};

class OrganizationView extends Component {
	state = {
		open: false,
		componentName: ""
	}
	componentWillMount() {
		this.props.getWalletDetails();
		this.props.getWalletTypes();
		this.props.getTransactionGraphData();
		this.props.getChannelDetails();
		this.props.getWalletTrnTypes();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
			this.setState({
				open: false,
			})
		}
	}
	toggleDrawer = () => {
		this.setState({
			open: this.state.open ? false : true,
		})
	}
	closeAll = () => {
		this.props.closeAll();
		this.setState({
			open: false,
		});
	}
	showComponent = componentName => {
		this.setState({
			componentName: componentName,
			open: this.state.open ? false : true
		});
	};
	render() {
		//wallet details has valid response
		const walletStatusLabels = [];
		const walletStatusCount = [];
		const walletStatusBackground = [];
		let walletGrandTotal = 0;
		if (this.props.walletDetails.hasOwnProperty("Counter")) {
			this.props.walletDetails.Counter.forEach(wallet => {
				walletStatusLabels.push(wallet.Name);
				walletStatusCount.push(wallet.Count);
				walletStatusBackground.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
				walletGrandTotal += wallet.Count;
			});
		}
		// walletData
		const walletData = {
			labels: walletStatusLabels,
			datasets: [{
				data: walletStatusCount,
				backgroundColor: walletStatusBackground,
				hoverBackgroundColor: walletStatusBackground
			}]
		};
		// walletTypeData
		const walletTypesLabels = [];
		const walletTypesCount = [];
		const walletTypeBackground = [];
		let walletTypeCount = 0;
		if (this.props.walletTypes.hasOwnProperty("Counter")) {
			walletTypeCount = this.props.walletTypes.Counter.length;
			this.props.walletTypes.Counter.forEach(wallet => {
				walletTypesLabels.push(wallet.Name);
				walletTypesCount.push(wallet.Count);
				walletTypeBackground.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
			});
		}
		const walletTypeData = {
			labels: walletTypesLabels,
			datasets: [{
				data: walletTypesCount,
				backgroundColor: walletTypeBackground,
				hoverBackgroundColor: walletTypeBackground
			}]
		};
		// TransactionTypeData
		let trnTypesLabels = [];
		let trnTypesCount = [];
		if (this.props.transactionGraph.hasOwnProperty("TotalCount")) {
			trnTypesLabels = this.props.transactionGraph.TypeName;
			trnTypesCount = this.props.transactionGraph.TotalCount;
		}
		const TransactionTypeData = {
			labels: trnTypesLabels,
			datasets: [{
				data: trnTypesCount,
				backgroundColor: ChartConfig.color.info,
			}]
		};
		// ChargesTypesData
		const ChargesTypesData = {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			datasets: [
				{
					label: 'Deposit',
					fill: false,
					tension: 0,
					backgroundColor: ChartConfig.color.primary,
					borderColor: ChartConfig.color.primary,
					borderWidth: 4,
					hoverBackgroundColor: ChartConfig.color.primary,
					hoverBorderColor: ChartConfig.color.primary,
					data: [2500, 900, 400, 1100, 1250, 900, 2100, 3400, 1950, 2000, 700, 740]
				},
				{
					label: 'Withdrawal',
					fill: false,
					tension: 0,
					backgroundColor: ChartConfig.color.info,
					borderColor: ChartConfig.color.info,
					borderWidth: 4,
					hoverBackgroundColor: ChartConfig.color.info,
					hoverBorderColor: ChartConfig.color.info,
					data: [3800, 3300, 2300, 3500, 2800, 3200, 3100, 4100, 3500, 3000, 2500, 2300]
				},
				{
					label: 'Etc',
					fill: false,
					tension: 0,
					backgroundColor: ChartConfig.color.warning,
					borderColor: ChartConfig.color.warning,
					borderWidth: 4,
					hoverBackgroundColor: ChartConfig.color.warning,
					hoverBorderColor: ChartConfig.color.warning,
					data: [74, 70, 230, 250, 280, 250, 310, 250, 280, 300, 250, 310]
				}
			],
			customLegends: [
				{
					name: 'Deposit',
					className: 'badge-primary'
				},
				{
					name: 'Withdrawal',
					className: 'badge-info'
				},
				{
					name: 'Etc',
					className: 'badge-warning'
				}
			]
		}
		// CommissionTypesData
		const CommissionTypesData = {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			datasets: [
				{
					label: 'Referral',
					fill: false,
					tension: 0,
					backgroundColor: ChartConfig.color.primary,
					borderColor: ChartConfig.color.primary,
					borderWidth: 4,
					hoverBackgroundColor: ChartConfig.color.primary,
					hoverBorderColor: ChartConfig.color.primary,
					data: [2500, 900, 400, 1100, 1250, 900, 2100, 3400, 1950, 2000, 700, 740]
				},
				{
					label: 'Etc',
					fill: false,
					tension: 0,
					backgroundColor: ChartConfig.color.info,
					borderColor: ChartConfig.color.info,
					borderWidth: 4,
					hoverBackgroundColor: ChartConfig.color.info,
					hoverBorderColor: ChartConfig.color.info,
					data: [3800, 3300, 2300, 3500, 2800, 3200, 3100, 4100, 3500, 3000, 2500, 2300]
				}
			],
			customLegends: [
				{
					name: 'Referral',
					className: 'badge-primary'
				},
				{
					name: 'Etc',
					className: 'badge-info'
				}
			]
		};
		const { drawerClose } = this.props;
		return (
			<div className="jbs-page-content">
				<WalletPageTitle title={<IntlMessages id="walletDeshbard.organization" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
				<div className="row">
					<div className="col-sm-12 col-md-4 w-xs-full">
						<CardWidgetType2
							title={<IntlMessages id="walletDeshbard.users" />}
							adminCount={"146"}
							userCount={"440"}
							clickEvent={this.onChildClick} />
					</div>
					<div className="col-sm-12 col-md-4 w-xs-full">
						{this.props.walletDetails.loading && <PreloadWidget />}
						{!this.props.walletDetails.loading && (
							<a
								href="javascript:void(0)"
								onClick={e => this.showComponent("Wallets")}
								className="text-dark col-sm-full"
							>
								<CardWidgetType5
									title={<IntlMessages id="walletDeshbard.wallets" />}
									count={walletGrandTotal}
									icon="zmdi-balance-wallet"
									bgClass=""
									clickEvent={this.onClick}
									data={walletData}
									chartType={"Doughnut"}
								/>
							</a>
						)}
					</div>
					<div className="col-sm-12 col-md-4 w-xs-full">
						{this.props.walletTypes.loading && <PreloadWidget />}
						{!this.props.walletTypes.loading && <CardWidgetType5
							title={<IntlMessages id="walletDeshbard.walletTypes" />}
							count={walletTypeCount}
							icon="zmdi-widgets"
							bgClass=""
							clickEvent={this.onClick}
							data={walletTypeData}
						/>}
					</div>
				</div>
				<div className="row">
					<div className="col-sm-12 col-md-4 w-xs-full">
						<CardWidgetPolicies />
					</div>
					<div className="col-sm-12 col-md-4 w-xs-full">
						<CardWidgetSwitch data={this.props.walletTrnTypes} />
					</div>
					<div className="col-sm-12 col-md-4 w-xs-full">
						<CardWidgetWalletUsers />
					</div>
				</div>
				<div className="row">
					<div className="col-sm-12 col-md-4 w-xs-full">
						<a
							href="javascript:void(0)"
							onClick={e => this.showComponent("TransactionTypes")}
							className="text-dark col-sm-full"
						>
							<CardWidgetType6
								title={<IntlMessages id="walletDeshbard.trnTypes" />}
								data={TransactionTypeData}
								clickEvent={this.onChildClick}
							/>
						</a>
					</div>
					<div className="col-sm-12 col-md-4 w-xs-full">
						<CardWidgetType7
							title={<IntlMessages id="walletDeshbard.chargeTypes" />}
							data={ChargesTypesData}
							clickEvent={this.onChildClick} />
					</div>
					<div className="col-sm-12 col-md-4 w-xs-full">
						<CardWidgetType7
							title={<IntlMessages id="walletDeshbard.commTypes" />}
							data={CommissionTypesData}
							clickEvent={this.onChildClick} />
					</div>
				</div>
				<div className="row">
					<div className="col-sm-12">
						<h4><IntlMessages id="walletDeshbard.channelDetails" /></h4>
					</div>
				</div>
				<div className="row">
					{this.props.channelDetails.hasOwnProperty("Counter") && this.props.channelDetails.Counter.map((channel, key) => (
						<div className="col-sm-6 col-md-3 w-xs-full" key={key}>
							<WalletFeedsWidget
								feedsTitle={channel.ChannelName}
								feedsCount={channel.TotalCount}
								icon={(channel.ChannelName == "API") ? "zmdi zmdi-device-hub" : (channel.ChannelName == "App") ? "zmdi zmdi-android" : (channel.ChannelName == "Internal") ? "zmdi zmdi-filter-center-focus" : (channel.ChannelName == "Web") ? "zmdi zmdi-globe" : ""}
							/>
						</div>
					))}
				</div>
				<Drawer
					width="100%"
					handler={false}
					open={this.state.open}
					onMaskClick={this.toggleDrawer}
					className="drawer2"
					level=".drawer1"
					placement="right"
				>
					{this.state.componentName !== "" &&
						dynamicComponent(
							this.state.componentName,
							this.props,
							this.toggleDrawer,
							this.closeAll
						)}
				</Drawer>
			</div>
		)
	}
}

const mapToProps = ({ superAdminReducer, drawerclose }) => {
	// breadcrumb 
	if (drawerclose.bit === 1) {
		setTimeout(function () {
			drawerclose.bit = 2
		}, 1000);
	}
	const { walletDetails, walletTypes, transactionGraph, channelDetails, walletTrnTypes } = superAdminReducer;
	return { walletDetails, walletTypes, transactionGraph, channelDetails, walletTrnTypes, drawerclose };
};

export default connect(mapToProps, {
	getWalletDetails,
	getWalletTypes,
	getTransactionGraphData,
	getChannelDetails,
	getWalletTrnTypes
})(OrganizationView);