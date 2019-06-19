/* 
    Developer : Vishva shah
    Date : 07-06-2019
    File Comment : Arbitrage exchange balance Component
*/
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import 'rc-drawer/assets/index.css';
import IntlMessages from 'Util/IntlMessages';
import { injectIntl } from 'react-intl';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import MUIDataTable from 'mui-datatables';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
import { getExchangeBalanceList} from 'Actions/Arbitrage/ArbitrageExchangeBalance';
import { NotificationManager } from 'react-notifications';
import { listServiceProvider } from 'Actions/ServiceProvider';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
const initState = {
	open: false,
	PageSize: AppConfig.totalRecordDisplayInList,
	WalletTypeID: '',
	SerProId: '',
	showReset: false,
	menudetail: [],
	notificationFlag: true,
	flag: false,
	N_flag: false,
	Data: []
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
		title: <IntlMessages id="sidebar.Arbitrage" />,
		link: '',
		index: 0,
	},
	{
		title: <IntlMessages id="walletDashboard.exchangebalance" />,
		link: '',
		index: 1,
	},
];

class ExchangeBalance extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
	}
	componentWillMount() {
		this.props.getMenuPermissionByID('54AD1E79-5048-2806-4217-907785089B41'); // get Arbitrage permission
	}
	// will receive props update state..
	componentWillReceiveProps(nextProps) {
		if (
			!this.state.menudetail.length &&
			nextProps.menu_rights.hasOwnProperty('ReturnCode') &&
			this.state.notificationFlag
		) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.ListArbitrageCurrency({});
				var reqObject = {};
                if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.listServiceProvider(reqObject);
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={'error.permission'} />);
				this.props.drawerClose();
			}
		}
		if (nextProps.listServiceProviderData.hasOwnProperty("ReturnCode") && nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
            this.setState({
                Data: nextProps.listServiceProviderData.Response
            })
        }
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
			this.setState({
				open: false,
			});
		}
	}
	// close all drawer...
	closeAll = () => {
		this.props.closeAll();
		this.setState({
			open: false,
			pagedata: {},
		});
	};
	// apply filter
	applyFilter() {
		if (this.state.WalletTypeID !== '') {
			this.props.getExchangeBalanceList({
				ServiceProviderId :this.state.SerProId,
				SMSCode: this.state.WalletTypeID,
			});
			this.setState({ showReset: true, PageNo: 0 });
		}
	}
	//reset filter
	clearFilter() {
		this.setState({ ...initState, menudetail: this.state.menudetail ,Data:this.state.Data});
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
				if (
					menudetail[index].hasOwnProperty('GUID') &&
					menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()
				)
					response = menudetail[index];
			}
		}
		return response;
	}
	render() {
		/* check menu permission */
		var menuPermissionDetail = this.checkAndGetMenuAccessDetail('8E8EC997-74A0-6E9A-21BD-1FA0590930C1'); //8E8EC997-74A0-6E9A-21BD-1FA0590930C1
		if (!menuPermissionDetail) {
			menuPermissionDetail = { Utility: [], CrudOption: [] };
		}
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
				<WalletPageTitle
					title={<IntlMessages id="walletDashboard.exchangebalance" />}
					breadCrumbData={BreadCrumbData}
					drawerClose={drawerClose}
					closeAll={this.closeAll}
				/>
				{menuPermissionDetail.Utility.indexOf('18736530') !== -1 && (
					<JbsCollapsibleCard>
						<div className="top-filter">
							<Form className="tradefrm row">
								<FormGroup className="col-md-2 col-sm-4">
                                    <Label for="SerProId"><IntlMessages id="liquidityprovider.list.option.label.serviceprovider" /></Label>
                                    <Input type="select" name="SerProId" id="SerProId" value={this.state.SerProId} onChange={(e) => this.onChangeHandlerwallet(e)}>
                                        <option value="">{intl.formatMessage({ id: "sidebar.apiConfAddGen.apiProvider.selectProvider" })}</option>
                                        {this.state.Data.length && this.state.Data.map((item, key) => (
                                            <option value={item.Id} key={key}>{item.ProviderName}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
								<FormGroup className="col-md-2 col-sm-4">
									<Label for="WalletTypeID">
										<IntlMessages id="table.currency" />
									</Label>
									<Input
										type="select"
										name="WalletTypeID"
										id="WalletTypeID"
										value={this.state.WalletTypeID}
										onChange={e => this.onChangeHandlerwallet(e)}
									>
										<option value="">{intl.formatMessage({ id: 'wallet.errCurrency' })}</option>
										{this.props.ArbitrageCurrencyList.length &&
											this.props.ArbitrageCurrencyList.map((type, index) => (
												<option key={index} value={type.CoinName}>
													{type.CoinName}
												</option>
											))}
									</Input>
								</FormGroup>
								<FormGroup className="col-md-2 col-sm-4">
									<div className="btn_area">
										<Button
											color="primary"
											variant="raised"
											className="text-white"
											onClick={() => this.applyFilter()}
											disabled={this.state.WalletTypeID !== '' ? false : true}
										>
											<IntlMessages id="widgets.apply" />
										</Button>
										{this.state.showReset && (
											<Button
												className="btn-danger text-white ml-10"
												onClick={e => this.clearFilter()}
											>
												<IntlMessages id="bugreport.list.dialog.button.clear" />
											</Button>
										)}
									</div>
								</FormGroup>
							</Form>
						</div>
					</JbsCollapsibleCard>
				)}
				{this.props.loading && <JbsSectionLoader />}
				{this.state.showReset === true && (
					<div className="StackingHistory">
						<MUIDataTable
							data={this.props.ExchangeBalanceList.map((item, index) => {
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
				)}
			</div>
		);
	}
}

const mapStateToProps = ({ ExchangeBalanceReducer, ArbitrageCurrencyConfiguration, drawerclose, authTokenRdcer ,ServiceProviderReducer}) => {
	// breadcrumb
	if (drawerclose.bit === 1) {
		setTimeout(function() {
			drawerclose.bit = 2;
		}, 1000);
	}
	const { loading, ExchangeBalanceList } = ExchangeBalanceReducer;
	const { ArbitrageCurrencyList, ArbitrageCurrencyloading } = ArbitrageCurrencyConfiguration;
	const { menuLoading, menu_rights } = authTokenRdcer;
	const { listServiceProviderData} = ServiceProviderReducer;
	return {
		loading,
		ExchangeBalanceList,
		ArbitrageCurrencyloading,
		ArbitrageCurrencyList,
		drawerclose,
		menuLoading,
		menu_rights,
		listServiceProviderData
	};
};

export default connect(
	mapStateToProps,
	{
		getExchangeBalanceList,
		ListArbitrageCurrency,
        getMenuPermissionByID,
        listServiceProvider
	}
)(injectIntl(ExchangeBalance));
