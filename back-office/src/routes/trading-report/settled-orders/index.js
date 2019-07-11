/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Settled Orders Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Form, Label, Input } from 'reactstrap';
import MatButton from "@material-ui/core/Button";

import $ from 'jquery';

// import neccessary actions
import {
	settledOrders,
	settleOrdersRefresh
} from 'Actions/TradingReport';

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

import { getTradePairs } from "Actions/TradeRecon";

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// import ex data tables for display table
import ExDatatable from './components/ex_datatable';

import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
	maxHeight: '28px',
	minHeight: '28px',
	maxWidth: '28px',
	fontSize: '1rem'
}

// define Settled Orders component
class SettledOrders extends Component {

	// make default state values on load
	constructor(props) {
		super();
		this.state = {
			start_date: new Date().toISOString().slice(0, 10),
			end_date: new Date().toISOString().slice(0, 10),
			currentDate: new Date().toISOString().slice(0, 10),
			settleOrderList: [],
			memberID: '',
			TrnNo: '',
			status: '',
			pair: '',
			type: '',
			pairList: [],
			price: '',
			amount: '',
			onLoad: 1
		}

		this.handleChange = this.handleChange.bind(this);
	}

	// used to handle change event of every input field and set values in states
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	// call Settled Orders list on load
	componentDidMount() {
		this.props.getTradePairs();
		//this.props.settledOrders({ Status: 91 });
	}

	componentWillReceiveProps(nextprops) {

		if (nextprops.pairList.length) {
			this.setState({
				pairList: nextprops.pairList
			})
		}

		if (nextprops.settledOrdersList.length !== 0 && nextprops.error.length == 0 && this.state.onLoad) {
			this.setState({
				settleOrderList: nextprops.settledOrdersList,
				onLoad: 0
			})
		} else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0 && this.state.onLoad) {
			NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
			this.setState({
				settleOrderList: [],
				onLoad: 0
			})
		}
	}

	// apply button for Fetch Trade Recon List
	onGetData = event => {
		event.preventDefault();

		const Data = {
			MemberID: this.state.memberID ? parseInt(this.state.memberID) : 0,
			FromDate: this.state.start_date,
			ToDate: this.state.end_date,
			TrnNo: this.state.TrnNo ? parseInt(this.state.TrnNo) : 0,
			Status: 91,
			Pair: this.state.pair,
			Trade: this.state.type,
		};

		if ((this.state.start_date !== '' && this.state.end_date == '') || (this.state.end_date !== '' && this.state.start_date == '')) {

			NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
		} else if (this.state.end_date < this.state.start_date) {

			NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
		} else if (this.state.end_date > this.state.currentDate) {

			NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
		} else if (this.state.start_date > this.state.currentDate) {

			NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
		} else {
			this.setState({ onLoad: 1 })
			this.props.settledOrders(Data);
		}
	};

	handleChangeMemberId = (event) => {
		if ($.isNumeric(event.target.value) || event.target.value == '') {
			this.setState({ [event.target.name]: event.target.value });
		}
	}

	handleChangeTrnNo = (event) => {
		if ($.isNumeric(event.target.value) || event.target.value == '') {
			this.setState({ [event.target.name]: event.target.value });
		}
	}

	handleChangePair = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	handleChangeType = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}


	render() {
		const { drawerClose } = this.props;
		const data = this.state.settleOrderList ? this.state.settleOrderList : [];

		// define options for data tables
		const options = {
			filterType: 'dropdown',
			responsive: 'scroll',
			selectableRows: false,
		};
		// define columns for data tables
		const columns = [
			{
				name: <IntlMessages id={"openorder.list.tradeid"} />
			},
			{
				name: <IntlMessages id={"traderecon.list.column.label.user"} />
			},
			{
				name: <IntlMessages id={"traderecon.list.column.label.amount"} />
			},
			{
				name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.price"} />
			},
			{
				name: <IntlMessages id={"traderecon.list.type"} />
			},
			{
				name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.fee"} />
			},
			{
				name: <IntlMessages id={"sidebar.tradingLedger.tableHeading.total"} />
			},
			{
				name: <IntlMessages id={"traderecon.list.column.label.status"} />
			},
			{
				name: <IntlMessages id={"traderecon.list.column.label.pair"} />
			},
			{
				name: <IntlMessages id={"traderecon.list.column.label.date"} />
			}
		];
		return (
			<Fragment>
				<div className="m-20 page-title d-flex justify-content-between align-items-center">
					<div className="page-title-wrap">
						<h2><IntlMessages id="sidebar.settledOrders.list" /></h2>
					</div>
					<div className="page-title-wrap">
						<CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
						<CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
					</div>
				</div>

				<div className="charts-widgets-wrapper">
					{this.props.loading && <JbsSectionLoader />}
					<div className="transaction-history-detail">
						<JbsCollapsibleCard>
							<div className="row">
								<div className="col-md-12">
									<div className="top-filter clearfix">
										<Form name="frm_search" className="row mb-10">
											<div className="col-md-2">
												<Label for="member_id">
													{
														<IntlMessages id="wallet.lblUserId" />
													}
												</Label>
												<Input
													type="text"
													name="memberID"
													value={this.state.memberID}
													id="memberID"
													onChange={this.handleChangeMemberId}
												/>
											</div>

											<div className="col-md-2">
												<Label for="startDate1">
													{
														<IntlMessages id="traderecon.search.dropdown.label.fromdate" />
													}
												</Label>
												<Input
													type="date"
													name="start_date"
													value={this.state.start_date}
													id="startDate1"
													placeholder="dd/mm/yyyy"
													onChange={this.handleChange}
												/>
											</div>
											<div className="col-md-2">
												<Label for="endDate1">
													{
														<IntlMessages id="traderecon.search.dropdown.label.todate" />
													}
												</Label>
												<Input
													type="date"
													name="end_date"
													value={this.state.end_date}
													id="endDate1"
													placeholder="dd/mm/yyyy"
													onChange={this.handleChange}
												/>
											</div>

											<div className="col-md-2">
												<Label for="member_id">
													{
														<IntlMessages id="traderecon.list.type" />
													}
												</Label>
												<Input type="select" name="type" value={this.state.type} id="Select-2" onChange={this.handleChangeType}>
													<IntlMessages id="traderecon.list.selectall">
														{(select) =>
															<option value="">{select}</option>
														}
													</IntlMessages>
													<IntlMessages id="traderecon.list.buy">
														{(buy) =>
															<option value="buy">{buy}</option>
														}
													</IntlMessages>
													<IntlMessages id="traderecon.list.sell">
														{(sell) =>
															<option value="sell">{sell}</option>
														}
													</IntlMessages>
												</Input>
											</div>


											<div className="col-md-2">
												<Label for="trn_no">
													{
														<IntlMessages id="traderecon.list.column.label.trnno" />
													}
												</Label>
												<Input
													type="text"
													name="TrnNo"
													value={this.state.TrnNo}
													id="TrnNo"
													onChange={this.handleChangeTrnNo}
												/>
											</div>
											<div className="col-md-2">
												<Label for="pair">
													{
														<IntlMessages id="traderecon.list.column.label.pair" />
													}
												</Label>
												<div className="app-selectbox-sm">

													<Input type="select" name="pair" value={this.state.pair} id="Select-1" onChange={this.handleChangePair}>
														<IntlMessages id="traderecon.list.selectall">
															{(select) =>
																<option value="all">{select}</option>
															}
														</IntlMessages>
														{this.state.pairList.map((currency, key) =>
															<option key={key} value={currency.PairName}>{currency.PairName}</option>
														)}
													</Input>
												</div>
											</div>
											<div className="col-md-1">
												<Label className="d-block">&nbsp;</Label>
												<MatButton variant="raised" className="btn-primary text-white" onClick={this.onGetData} >
													<IntlMessages id="sidebar.settledOrders.button.apply" />
												</MatButton>
											</div>
										</Form>
									</div>
								</div>
							</div>
						</JbsCollapsibleCard>
						<ExDatatable
							title="sidebar.settledOrders.list"
							data={data.map(item => {
								return [
									item.TrnNo,
									item.MemberID,
									item.Amount,
									item.Price,
									item.Type,
									item.ChargeRs,
									item.Total,
									item.StatusText,
									item.PairName,
									item.DateTime.replace('T', ' ').split('.')[0],
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
const mapStateToProps = ({ settledOrdersReducer, tradeRecon }) => {
	const { settledOrdersList, loading, error } = settledOrdersReducer;
	const { pairList } = tradeRecon;
	return { settledOrdersList, loading, error, pairList }
}

// export this component with action methods and props
export default connect(mapStateToProps, { settledOrders, getTradePairs, settleOrdersRefresh })(SettledOrders);
