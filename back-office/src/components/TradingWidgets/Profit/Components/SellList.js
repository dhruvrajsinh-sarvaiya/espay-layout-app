/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Open Orders Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Form, Label, Input, Col } from 'reactstrap';
import MatButton from "@material-ui/core/Button";

import MUIDataTable from "mui-datatables";

import Button from '@material-ui/core/Button';
const buttonSizeSmall = {
	maxHeight: '28px',
	minHeight: '28px',
	maxWidth: '28px',
	fontSize: '1rem'
}

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// define Open Orders component
class SellList extends Component {

	// make default state values on load
	constructor(props) {
		super();
		this.state = {
			start_date: '',
			end_date: '',
			pair: 'all',
			type: 0,
			onLoad: 0
		}

		this.onClick = this.onClick.bind(this);
		this.onApply = this.onApply.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	tick() {
		if (this.state.onLoad === 1) {
			this.props.openOrdersRefresh(this.state);
		}
	}

	// used to handle change event of every input field and set values in states
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	// apply button used to call open orders list
	onApply(event) {
		event.preventDefault();
		this.props.openOrders(this.state);
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({
			open: false,
		});
	}

	render() {

		const { drawerClose } = this.props;
		const data = this.props.sellerData;

		// define options for data tables
		const options = {
			filterType: 'dropdown',
			responsive: 'scroll',
			selectableRows: false,
		};
		// define columns for data tables
		const columns = ["Sr No.", "UserName (Client_ID)", "Type", "Price", "Amount", "Fee", "Total", "Status"];

		return (
			<Fragment>
				<div className="charts-widgets-wrapper">
					<div className="m-20 page-title d-flex justify-content-between align-items-center">
						<div className="page-title-wrap">
							<h2>Profit</h2>
						</div>
						<div className="page-title-wrap">
							<Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
							<Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
						</div>
					</div>
					<Col sm={12}>
						<div className="transaction-history-detail">
							<JbsCollapsibleCard>
								<div className="row">
									<div className="col-md-12">
										<div className="top-filter clearfix">
											<Form name="frm_search" className="row mb-10">
												<div className="col-md-2">
													<Label for="user">User Name</Label>
													<Input type="text" name="UserName" id="UserName" placeholder="User Name" />
												</div>

												<div className="col-md-2">
													<Label for="user">Client ID</Label>
													<Input type="text" name="client" id="client" placeholder="Client ID" />
												</div>

												<div className="col-md-1">
													<Label className="d-block">&nbsp;</Label>
													<MatButton variant="raised" className="btn-primary text-white" onClick={this.onApply} >
														<IntlMessages id="sidebar.openOrders.button.apply" />
													</MatButton>
												</div>
											</Form>
										</div>
									</div>
								</div>
							</JbsCollapsibleCard>
							<MUIDataTable

								title="Sell"
								data={data.map((item, key) => {
									var username = item.username + " ( " + item.clientid + " )";
									return [
										key + 1,
										username,
										item.Type,
										item.Price,
										item.amount,
										item.fee,
										item.total,
										item.status,
									]
								})}
								columns={columns}
								options={options}
							/>
						</div>
					</Col>
				</div>
			</Fragment>
		);
	}
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
	sellerData: state.profitData.sellerData
});

export default connect(mapStateToProps, {
})(SellList);
