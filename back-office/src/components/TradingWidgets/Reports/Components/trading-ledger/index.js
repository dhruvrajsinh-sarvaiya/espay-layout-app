/**
 * Auther : Nirmit
 * Created : 3/10/2018
 * Trading Ledger Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import validator from "validator";
import { changeDateFormat } from "Helpers/helpers";

// import neccessary actions
import {
	tradingledger,
	tradingledgerRefresh,
	getLedgerCurrencyList,
} from 'Actions/TradingReport';

import { getTradePairs } from "Actions/TradeRecon";

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// import ex data tables for display table 
import ExDatatable from './components/ex_datatable';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// import Button from '@material-ui/core/Button';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { injectIntl } from 'react-intl';

// define Trading ledger component
class TradingLedger extends Component {

	// make default state values on load
	constructor(props) {
		super(props);
		this.state = {
			start_date: new Date().toISOString().slice(0, 10),
			end_date: new Date().toISOString().slice(0, 10),
			currentDate: new Date().toISOString().slice(0, 10),
			pair: '',
			status: '',
			type: '',
			onLoad: 0,
			open: false,
			userID: '',
			trnNo: '',
			currency: '',
			orderType: '',
			loading: false,
			pairList: [],
			currencyList: []
		}
		this.onClick = this.onClick.bind(this);
		this.onApply = this.onApply.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	onClick() {
	}

	// used to handle change event of every input field and set values in states
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	validateNumericValue = event => {

		const regexNumeric = /^[0-9]+$/;
		if (validator.matches(event.target.value, regexNumeric) || event.target.value === '') {

			if (event.target.name === 'userID') {
				this.setState({ userID: event.target.value });
			} else if (event.target.name === 'trnNo') {
				this.setState({ trnNo: event.target.value });
			}
		}
	}

	// apply button used to call Trading ledger
	onApply(event) {

		if ((this.state.start_date !== '' && this.state.end_date == '') || (this.state.end_date !== '' && this.state.start_date == '')) {

			NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
		} else if (this.state.end_date < this.state.start_date) {

			NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
		} else if (this.state.end_date > this.state.currentDate) {

			NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
		} else if (this.state.start_date > this.state.currentDate) {

			NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
		}

		var makeLedgerRequest = { FromDate: this.state.start_date, ToDate: this.state.end_date };
		if (this.state.trnNo) {
			makeLedgerRequest.TrnNo = this.state.trnNo;
		}
		if (this.state.status) {
			makeLedgerRequest.Status = this.state.status;
		}
		if (this.state.userID) {
			makeLedgerRequest.MemberID = this.state.userID;
		}
		if (this.state.currency) {
			makeLedgerRequest.SMSCode = this.state.currency;
		}
		if (this.state.type) {
			makeLedgerRequest.Trade = this.state.type;
		}
		if (this.state.pair) {
			makeLedgerRequest.Pair = this.state.pair;
		}
		if (this.state.orderType) {
			makeLedgerRequest.MarketType = this.state.orderType;
		}

		this.props.tradingledger(makeLedgerRequest);
		this.setState({ loading: true });

	}

	componentWillMount() {

		this.props.getTradePairs({});
		this.props.getLedgerCurrencyList({});
	}

	showComponent = (componentName) => {
		this.setState({
			componentName: componentName,
			open: this.state.open ? false : true,
		});
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
	}

	componentWillReceiveProps(nextProps) {

		if (nextProps.pairList.length) {

			this.setState({
				pairList: nextProps.pairList
			})
		}

		if (typeof nextProps.currencyList !== 'undefined' && nextProps.currencyList.length) {
			this.setState({
				currencyList: nextProps.currencyList
			})
		}
	}

	render() {
		var BreadCrumbData = [];
		//BreadCrumbData
		if (this.props.TitleBit === 1) {
			BreadCrumbData = [
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
					title: <IntlMessages id="sidebar.reportsDashboard" />,
					link: '',
					index: 1
				},
				{
					title: <IntlMessages id="tradingLedger.title" />,
					link: '',
					index: 2
				},
			];
		} else {
			BreadCrumbData = [
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
					title: <IntlMessages id="sidebar.trading" />,
					link: '',
					index: 0
				},
				{
					title: <IntlMessages id="card.list.title.report" />,
					link: '',
					index: 1
				},
				{
					title: <IntlMessages id="tradingLedger.title" />,
					link: '',
					index: 2
				}
			];
		}
		const intl = this.props.intl;

		const { drawerClose } = this.props;
		const data = this.props.tradingledgerList;

		// define options for data tables
		const options = {
			filterType: 'dropdown',
			responsive: 'stacked',
			selectableRows: false,
			download: true,
			downloadOptions: {
				filename: 'Trading_ledger_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
			}
		};
		const columns = [
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.trnNo" })
			},
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.userID" })
			},
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.pair" })
			},
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.type" })
			},
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.orderType" })
			},
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.preBal" })
			},
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.postBal" })
			},
			{
				name: intl.formatMessage({ id: "tradingLedger.tableHeading.dateTime" })
			}
		];

		return (
			<Fragment>
				<div className="jbs-page-content">

					<WalletPageTitle title={<IntlMessages id="tradingLedger.title" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
					<div className="transaction-history-detail">
						<JbsCollapsibleCard>
							<div className="top-filter">
								<Form className="tradefrm row">
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="startDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
										<Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="endDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
										<Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="Select-2">{<IntlMessages id="tradingLedger.filterLabel.userID" />}</Label>
										<IntlMessages id="tradingLedger.filterLabel.userID">
											{(placeholder) =>
												<Input type="text" name="userID" id="User" value={this.state.userID} placeholder={placeholder} onChange={this.validateNumericValue} />
											}
										</IntlMessages>
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="Select-2">{<IntlMessages id="tradingLedger.filterLabel.trnNo" />}</Label>
										<IntlMessages id="tradingLedger.filterLabel.trnNo">
											{(placeholder) =>
												<Input type="text" name="trnNo" value={this.state.trnNo} id="trnNo" placeholder={placeholder} onChange={this.validateNumericValue} />
											}
										</IntlMessages>
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="Select-2">{<IntlMessages id="sidebar.tradingLedger.filterLabel.type" />}</Label>
										<div className="app-selectbox-sm">
											<Input type="select" name="type" value={this.state.type} id="Select-2" onChange={this.handleChange}>
												<IntlMessages id="tradingLedger.selectType">
													{(selectType) =>
														<option value="">{selectType}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.selectType.buy">
													{(buy) =>
														<option value="buy">{buy}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.selectType.sell">
													{(sell) =>
														<option value="sell">{sell}</option>
													}
												</IntlMessages>
											</Input>
										</div>
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="Select-1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.currencyPair" />}</Label>
										<div className="app-selectbox-sm">
											<Input type="select" name="pair" value={this.state.pair} id="Select-1" onChange={this.handleChange}>
												<IntlMessages id="tradingLedger.selectCurrencyPair.all">
													{(all) =>
														<option value="">{all}</option>
													}
												</IntlMessages>

												{this.state.pairList.map((currency, key) =>
													<option key={key} value={currency.PairName}>{currency.PairName}</option>
												)}
											</Input>
										</div>
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="Select-2">{<IntlMessages id="sidebar.tradingLedger.filterLabel.status" />}</Label>
										<div className="app-selectbox-sm">
											<Input type="select" name="status" value={this.state.status} id="Select-2" onChange={this.handleChange}>
												<IntlMessages id="sidebar.tradingLedger.filterLabel.status.selectStatus">
													{(selectStatus) =>
														<option value="">{selectStatus}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.selectStatus.activeOrder">
													{(activeOrder) =>
														<option value="95">{activeOrder}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.selectStatus.partialOrder">
													{(partialOrder) =>
														<option value="91">{partialOrder}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.selectStatus.settledOrder">
													{(settledOrder) =>
														<option value="92">{settledOrder}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.selectStatus.systemFailed">
													{(systemFailed) =>
														<option value="94">{systemFailed}</option>
													}
												</IntlMessages>
											</Input>
										</div>
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="Select-2">{<IntlMessages id="tradingLedger.filterLabel.currency" />}</Label>
										<div className="app-selectbox-sm">
											<Input type="select" name="currency" value={this.state.currency} id="Select-2" onChange={this.handleChange}>
												<IntlMessages id="tradingLedger.selectCurrency">
													{(selectCurrency) =>
														<option value="">{selectCurrency}</option>
													}
												</IntlMessages>
												{this.state.currencyList.map((currency, key) =>
													<option key={key} value={currency.SMSCode}>{currency.SMSCode}</option>	/* currency.Name (fullname) */
												)}
											</Input>
										</div>
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<Label for="Select-2">{<IntlMessages id="tradingLedger.orderType.label" />}</Label>
										<div className="app-selectbox-sm">
											<Input type="select" name="orderType" value={this.state.orderType} id="Select-2" onChange={this.handleChange}>
												<IntlMessages id="tradingLedger.orderType">
													{(orderType) =>
														<option value="">{orderType}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.orderType.limit">
													{(limit) =>
														<option value="LIMIT">{limit}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.orderType.market">
													{(market) =>
														<option value="MARKET">{market}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.orderType.stopLimit">
													{(stopLimit) =>
														<option value="STOP_Limit">{stopLimit}</option>
													}
												</IntlMessages>
												<IntlMessages id="tradingLedger.orderType.spot">
													{(spot) =>
														<option value="SPOT">{spot}</option>
													}
												</IntlMessages>
											</Input>
										</div>
									</FormGroup>
									<FormGroup className="col-md-2 col-sm-4">
										<div className="btn_area">
											<Button color="primary" onClick={this.onApply} >
												<IntlMessages id="sidebar.btnApply" />
											</Button>
										</div>
									</FormGroup>
								</Form>
							</div>
						</JbsCollapsibleCard>
						{this.props.loading && <JbsSectionLoader />}
						<ExDatatable
							title="sidebar.tradingLedger.list"
							data={data.map(item => {
								return [
									item.TrnNo,
									item.MemberID,
									item.PairName,
									item.Type,
									item.OrderType,
									item.PreBal.toFixed(8),
									item.PostBal.toFixed(8),
									item.DateTime.replace('T', ' ').split('.')[0]
								]
							})}
							columns={columns}
							options={options}
						/>
					</div>
				</div>
			</Fragment>
		);
	}
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ tradingledgerReducer, tradeRecon }) => {
	const { tradingledgerList, loading, currencyList } = tradingledgerReducer;
	const { pairList } = tradeRecon;

	return { tradingledgerList, loading, pairList, currencyList }
}

// export this component with action methods and props
export default connect(mapStateToProps, {
	tradingledger,
	tradingledgerRefresh,
	getTradePairs,
	getLedgerCurrencyList
})(injectIntl(TradingLedger));
