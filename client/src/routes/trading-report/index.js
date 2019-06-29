/**
 * Auther : Nirmit
 * Created : 3/10/2018
 * Trading Ledger Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Form, Label, Input, Row, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';

// import neccessary actions
import {
	tradingledger,
	tradingledgerRefresh
} from 'Actions/TradingReport';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// import ex data tables for display table 
import ExDatatable from './components/ex_datatable';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';


// define Trading ledger component
class TradingLedger extends Component {

	// make default state values on load
	constructor(props) {
		super();
		this.state = {
			start_date: '',
			end_date: '',
			pair: 'all',
			status: '',
			type: 0,
			onLoad: 0
		}

		this.onClick = this.onClick.bind(this);
		this.onApply = this.onApply.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	tick() {
		if (this.state.onLoad === 1) {
			this.props.tradingledgerRefresh(this.state);
		}
	}


	// used to handle change event of every input field and set values in states
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	// apply button used to call Trading ledger
	onApply(event) {
		event.preventDefault();
		this.props.tradingledger(this.state);
	}

	componentWillMount() {
	}

	// call Trading ledger list on load
	componentDidMount() {
		this.props.tradingledger(this.state);
	}

	render() {

		const data = this.props.tradingledgerList;

		// define options for data tables
		const options = {
			filterType: 'dropdown',
			responsive: 'stacked',
			selectableRows: false,
		};
		// define columns for data tables
		const columns = ["DateTime", "Pair", "Type", "Price", "Amount", "Fee", "Total", "Status"];
		return (
			<Fragment>
				<div className="charts-widgets-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.tradingLedger" />} match={this.props.match} />
					<div className="transaction-history-detail">
						<JbsCollapsibleCard>
							<Row>
								<Col md={12}>
									<div className="top-filter clearfix mb-10 transaction-search">
										<Form name="frm_search">
											<Row>
												<Col md={3}>
													<Label for="startDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
													<Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
												</Col>
												<Col md={3}>
													<Label for="endDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
													<Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
												</Col>
												<Col md={3}>
													<Label for="user">User Id</Label>
													<Input type="text" name="User" id="User" placeholder="User ID" />
												</Col>
												<Col md={3}>
													<Label for="client">Client Id</Label>
													<Input type="text" name="Client" id="Client" placeholder="Client ID" />
												</Col>
											</Row>
											<Row className="mt-10">
												<Col md={3}>
													<Label for="Select-2">{<IntlMessages id="sidebar.tradingLedger.filterLabel.type" />}</Label>
													<div className="app-selectbox-sm">
														<Input type="select" name="type" value={this.state.type} id="Select-2" onChange={this.handleChange}>
															<option value="0">--Select Type--</option>
															<option value="1">Buy</option>
															<option value="2">Sell</option>
														</Input>
													</div>
												</Col>
												<Col md={3}>
													<Label for="Select-1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.currencyPair" />}</Label>
													<div className="app-selectbox-sm">
														<Input type="select" name="pair" value={this.state.pair} id="Select-1" onChange={this.handleChange}>
															<option value="all">All</option>
															<option value="atcc_btc">ATCC_BTC</option>
															<option value="ltc_btc">LTC_BTC</option>
															<option value="xrp_atcc">XRP_ATCC</option>
														</Input>
													</div>
												</Col>
												<Col md={3}>
													<Label for="Select-2">{<IntlMessages id="sidebar.tradingLedger.filterLabel.status" />}</Label>
													<div className="app-selectbox-sm">
														<Input type="select" name="status" value={this.state.status} id="Select-2" onChange={this.handleChange}>
															<option value="0">--Select Type--</option>
															<option value="4">Filled</option>
															<option value="5">Cancelled</option>
														</Input>
													</div>
												</Col>
												<Col md={1}>
													<Label className="d-block">&nbsp;</Label>
													<Button onClick={this.onApply} color="primary" variant="raised" className="mr-10 text-white"><IntlMessages id="sidebar.tradingLedger.button.apply" /></Button>
												</Col>
											</Row>
										</Form>
									</div>
								</Col>
							</Row>
						</JbsCollapsibleCard>
						<ExDatatable
							title="sidebar.tradingLedger.list"
							data={data}
							columns={columns}
							options={options}
							darkMode={this.props.darkMode}
						/>
					</div>
				</div>
			</Fragment>
		);
	}
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ tradingledgerReducer, settings }) => {
	const { darkMode } = settings;
	const { tradingledgerList, loading } = tradingledgerReducer;
	return { tradingledgerList, loading, darkMode }
}

// export this component with action methods and props
export default connect(mapStateToProps, { tradingledger, tradingledgerRefresh })(TradingLedger);
