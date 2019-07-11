/* 
    Developer : Salim Deraiya
    Date : 17-06-2019
    File Comment : Provider Balance Check Component
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import 'rc-drawer/assets/index.css';
import IntlMessages from 'Util/IntlMessages';
import { injectIntl } from 'react-intl';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import MUIDataTable from 'mui-datatables';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from 'react-notifications';
import { getProviderBalanceCheckList, getCurrencyList } from 'Actions/MyAccount';
import { listServiceProvider } from 'Actions/ServiceProvider';
import AppConfig from 'Constants/AppConfig';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

const initState = {
	open: false,
	currencyId: '',
	SerProId: '',
	showReset: false,
	menudetail: [],
	notificationFlag: true,
	flag: false,
	N_flag: false,
	srvProviderList: [],
	prvdBalanceCheckList: []
};

const BreadCrumbData = [
	{
		title: <IntlMessages id="sidebar.app" />,
		link: '',
		index: 0,
	},
	{
		title: <IntlMessages id="sidebar.dashboard" />,
		link: '',
		index: 0,
	},
	{
		title: <IntlMessages id="sidebar.myAccount" />,
		link: '',
		index: 0,
	},
	{
		title: <IntlMessages id="sidebar.providerBalanceCheck" />,
		link: '',
		index: 1,
	},
];

class ProviderBalanceCheck extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('54AD1E79-5048-2806-4217-907785089B41'); // get Arbitrage permission
	}

	// will receive props update state..
	componentWillReceiveProps(nextProps) {
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.props.getCurrencyList();
				this.props.listServiceProvider({ IsArbitrage: false });
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={'error.permission'} />);
				this.props.drawerClose();
			}
		}

		// Get Provider Balance Check List..
		if (nextProps.listPrvdBlaCheck !== undefined && nextProps.listPrvdBlaCheck.hasOwnProperty('ReturnCode') && nextProps.listPrvdBlaCheck.ReturnCode === 0) {
			this.setState({ prvdBalanceCheckList: nextProps.listPrvdBlaCheck.Data });
		} else if (nextProps.listPrvdBlaCheck !== undefined && nextProps.listPrvdBlaCheck.hasOwnProperty('ReturnCode') && nextProps.listPrvdBlaCheck.ReturnCode === 1) {
			this.setState({ prvdBalanceCheckList: [] });
		}

		// Get Service Provider List..
		if (nextProps.listServiceProviderData.hasOwnProperty("ReturnCode") && nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
			this.setState({ srvProviderList: nextProps.listServiceProviderData.Response });
		}

		// Drawer close from the breadcrumbs...
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
			this.setState({ open: false });
		}
	}

	// close all drawer...
	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false, pagedata: {} });
	};

	// apply filter
	applyFilter() {
		if (this.state.currencyId !== '') {
			this.props.getProviderBalanceCheckList({
				ServiceProviderId: this.state.SerProId,
				SMSCode: this.state.currencyId,
			});
			this.setState({ showReset: true });
		} else {
			NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.currencyId" />);
		}
	}

	//reset filter
	clearFilter() {
		let newObj = Object.assign({}, this.initState);
		newObj.menudetail = this.state.menudetail;
		this.setState(newObj);
	}

	onChangeHandlerwallet(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	/* check menu permission */
	checkAndGetMenuAccessDetail(GUID) {
		var response = false;
		var index;
		const { menudetail } = this.state;
		if (menudetail.length) {
			for (index in menudetail) {
				if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
					response = menudetail[index];
				}
			}
		}
		return response;
	}

	render() {
		const { prvdBalanceCheckList, srvProviderList } = this.state;
		const currencyList = this.props.currencyList.walletTypeMasters;
		/* check menu permission */
		/* var menuPermissionDetail = this.checkAndGetMenuAccessDetail('8E8EC997-74A0-6E9A-21BD-1FA0590930C1'); //8E8EC997-74A0-6E9A-21BD-1FA0590930C1
		if (!menuPermissionDetail) {
			menuPermissionDetail = { Utility: [], CrudOption: [] };
		} */
		var menuPermissionDetail = { Utility: [], CrudOption: [] };
		const { drawerClose, intl } = this.props;
		const columns = [
			{
				name: intl.formatMessage({ id: 'sidebar.colId' }),
				options: { sort: true, filter: false },
			},
			{
				name: intl.formatMessage({ id: 'table.currency' }),
				options: { sort: true, filter: false },
			},
			{
				name: intl.formatMessage({ id: 'sidebar.ProviderName' }),
				options: { sort: true, filter: false },
			},
			{
				name: intl.formatMessage({ id: 'walletDeshbard.balance' }),
				options: { sort: true, filter: false },
			},
			{
				name: intl.formatMessage({ id: 'sidebar.WalletBalance' }),
				options: { sort: true, filter: false },
			},
		];
		const options = {
			filterType: 'dropdown',
			responsive: 'scroll',
			selectableRows: false,
			download: false,
			viewColumns: false,
			filter: false,
			print: false,
			search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
			serverSide: false,
			rowsPerPage: AppConfig.totalRecordDisplayInList,
			rowsPerPageOptions: AppConfig.rowsPerPageOptions,
			textLabels: {
				body: {
					noMatch: <IntlMessages id="wallet.emptyTable" />,
					toolTip: <IntlMessages id="wallet.sort" />,
				},
			},
		};
		return (
			<div className="jbs-page-content">
				{(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
				<WalletPageTitle title={<IntlMessages id="sidebar.providerBalanceCheck" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
				{/* {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && ( */}
				<JbsCollapsibleCard>
					<div className="top-filter">
						<Form className="tradefrm row">
							<FormGroup className="col-md-2 col-sm-4">
								<Label for="SerProId"><IntlMessages id="liquidityprovider.list.option.label.serviceprovider" /></Label>
								<Input type="select" name="SerProId" id="SerProId" value={this.state.SerProId} onChange={(e) => this.onChangeHandlerwallet(e)}>
									<option value="">{intl.formatMessage({ id: "sidebar.apiConfAddGen.apiProvider.selectProvider" })}</option>
									{srvProviderList && srvProviderList.map((item, key) => (
										<option value={item.Id} key={key}>{item.ProviderName}</option>
									))}
								</Input>
							</FormGroup>
							<FormGroup className="col-md-2 col-sm-4">
								<Label for="currencyId"><IntlMessages id="table.currency" /><span className="text-danger">*</span></Label>
								<Input type="select" name="currencyId" id="currencyId" value={this.state.currencyId} onChange={e => this.onChangeHandlerwallet(e)}>
									<option value="">{intl.formatMessage({ id: 'wallet.errCurrency' })}</option>
									{currencyList && currencyList.map((item, index) => (
										<option key={index} value={item.CoinName}>{item.CoinName}</option>
									))}
								</Input>
							</FormGroup>
							<FormGroup className="col-md-2 col-sm-4">
								<div className="btn_area">
									<Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
									{this.state.showReset && <Button className="btn-danger text-white ml-10" onClick={e => this.clearFilter()}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
								</div>
							</FormGroup>
						</Form>
					</div>
				</JbsCollapsibleCard>
				{/* )} */}
				{this.props.loading && <JbsSectionLoader />}
				<div className="StackingHistory">
					<MUIDataTable
						data={prvdBalanceCheckList.map((item, index) => {
							return [
								index + 1,
								item.CurrencyName,
								item.ProviderName,
								item.Balance.toFixed(8),
								item.WalletBalance.toFixed(8),
							];
						})}
						columns={columns}
						options={options}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ providerBalanceCheckRdcer, profileConfigurationRdcer, drawerclose, authTokenRdcer, ServiceProviderReducer }) => {
	// breadcrumb
	if (drawerclose.bit === 1) {
		setTimeout(function () {
			drawerclose.bit = 2;
		}, 1000);
	}
	const { loading, listPrvdBlaCheck } = providerBalanceCheckRdcer;
	const { currencyList } = profileConfigurationRdcer;
	const { menuLoading, menu_rights } = authTokenRdcer;
	const { listServiceProviderData } = ServiceProviderReducer;
	return {
		loading,
		listPrvdBlaCheck,
		currencyList,
		drawerclose,
		menuLoading,
		menu_rights,
		listServiceProviderData
	};
};

export default connect(mapStateToProps, {
	listServiceProvider,
	getCurrencyList,
	getMenuPermissionByID,
	getProviderBalanceCheckList
})(injectIntl(ProviderBalanceCheck));