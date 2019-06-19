// Component for display Seller Order Data By:Tejas Date : 13/9/2018

import React, { Fragment, Component } from "react";

// function for connect store
import { connect } from "react-redux";

// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";

// import for set classnames 
import classnames from 'classnames';

// components for modal/ dialog box
import { Table, Button } from "reactstrap";

// Import For Loader
import JbsBarLoader from "Components/JbsPageLoader/JbsBarLoader"

// intl messages
import IntlMessages from "Util/IntlMessages";

//used for jquery
import $ from 'jquery';

// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
// class fro set row data
class SellOrderRow extends Component {

	// used for set orders
	SetPlaceOrder = (key, isMultiple) => {

		if (key < 999) {
			this.props.setOrders(key, isMultiple);
		}
	}

	//renders the component
	render() {

		var lastClass = "text-danger price-data",
			changeClass = "";

		if (this.props.UpDownBit === 1) {
			changeClass = "blink_me sellOrderClass";
		} else {
			changeClass = "sellOrderClass";
		}

	return (
			<tr
				key={this.props.indexValue.toString()}
				style={{background: this.props.bgColorData}}
				className={changeClass}
			>
				{
					<td className="lbl-data askBidbtn">
						<FormControlLabel
							control={
								<Checkbox
									checked={this.props.isMultiSelect === true}
									onChange={() => this.props.changeSelectedSellValue(25, this.props.order, !this.props.isMultiSelect)}
									icon={<CheckBoxOutlineBlankIcon />}
									checkedIcon={<CheckBoxIcon />}
								/>
							}
						/>
					</td>}
				<td className="exchange-name">{this.props.exchangeName ? this.props.exchangeName : "-"}</td>
				<td className="price-data">{parseFloat(this.props.Fees).toFixed(8)}</td>
				<td className="calculate-btns">
					<div className="d-flex">
						<Button
							value="25"
							className={classnames(
								{ active: (this.props.selectedSellValue === 25 && this.props.isMultiSelect) },
								"btnsell-per btn-xs w-25"
							)}
							onClick={event => {
								this.props.changeSelectedSellValue(25, this.props.order, true);
							}}
						>
							25%
					</Button>

						<Button
							value="50"
							className={classnames(
								{ active: (this.props.selectedSellValue === 50 && this.props.isMultiSelect) },
								"btnsell-per btn-xs w-25"
							)}
							onClick={event => {
								this.props.changeSelectedSellValue(50, this.props.order, true);
							}}
						>
							50%
                  </Button>

						<Button
							value="75"
							className={classnames(
								{ active: (this.props.selectedSellValue === 75 && this.props.isMultiSelect) },
								"btnsell-per btn-xs w-25"
							)}
							onClick={event => {
								this.props.changeSelectedSellValue(75, this.props.order, true);
							}}
						>
							75%
                  </Button>

						<Button
							value="100"
							className={classnames(
								{ active: (this.props.selectedSellValue === 100 && this.props.isMultiSelect) },
								"btnsell-per btn-xs w-25"
							)}
							onClick={event => {
								this.props.changeSelectedSellValue(100, this.props.order, true);
							}}
						>
							100%
                  </Button>

					</div>
				</td>
				<td className={lastClass}>{this.props.Price !== '-' ? parseFloat(this.props.Price).toFixed(8) : '-'}</td>
				<td className="askBidbtn"><a href="javascript:void(0)" onClick={() => this.SetPlaceOrder(this.props.indexValue, undefined)}>
					<IntlMessages id="trading.placeorder.label.buy" />
				</a></td>

			</tr>
		);
	}
}

//clsss for sell trade
class SellTrade extends Component {

	//constructor fir set data
	constructor(props) {
		super(props);
		this.state = {
			sellerOrderList: this.props.sellerOrderList.length ? this.props.sellerOrderList : [],
			selectedSellValue: 0
		};
		this.isComponentActive = 1;
	}

	//Open Modal add new Schedule dailog
	setOrders = (index, isMultiple) => {

		var amount = 0;
		var price = 0;
		var LpType = "";

		if (this.props.sellerOrderList.length !== 0) {

			const indexValue = (this.props.sellerOrderList.length - (index + 1))
			var sellOrderDetail = $.extend(true, [], this.props.sellerOrderList);

			sellOrderDetail.map((value, key) => {

				if (indexValue === key) {
					price = value.LTP
					LpType = value.LPType
				}
				//return null
			});
		}

		this.props.setBuyOrders(price, amount, isMultiple, LpType)

	}
	componentWillUnmount() {
		this.isComponentActive = 0;
	}

	//set background color of row
	LightenDarkenColor = (col, amt) => {

		var usePound = false;

		if (col[0] === "#") {
			col = col.slice(1);
			usePound = true;
		}

		var num = parseInt(col, 16);

		var r = (num >> 16) + amt;

		if (r > 255) r = 255;
		else if (r < 0) r = 0;

		var b = ((num >> 8) & 0x00FF) + amt;

		if (b > 255) b = 255;
		else if (b < 0) b = 0;

		var g = (num & 0x0000FF) + amt;

		if (g > 255) g = 255;
		else if (g < 0) g = 0;

		return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

	}

	// set selected sel lvalue
	changeSelectedSellValue = (value, data, isMultiSelect) => {

		var total = "", amount = "";
		var LpType = data.LPType;

		if (this.state.selectedSellValue === value) {

		} else {

			// calculation process of Amount
			if (
				data.LTP !== ""
			) {

				total = parseFloat(
					parseFloat(
						parseFloat(this.props.secondCurrencyBalance) * parseFloat(value)
					) / 100
				).toFixed(8);

				amount = parseFloat(
					parseFloat(total) / parseFloat(data.LTP)
				).toFixed(8)

			}


			this.props.setBuyOrders(data.LTP, amount, isMultiSelect, LpType, total, value, data)

		}
	};


	// Render Component for Seller Order
	render() {
		
		this.props.sellerOrderList.sort(function (a, b) {
			return parseFloat(a.LTP) - parseFloat(b.LTP)
		})

		var colData = "";
		var sellOrderListRow = [];

		var countSell = (this.props.sellerOrderList.length - 1);
		this.props.sellerOrderList.map((newSellOrder, indexValue) => {
				
				sellOrderListRow.push(
					<SellOrderRow
						exchangeName={newSellOrder.ProviderName}
						key={indexValue}
						Price={newSellOrder.LTP}
						Fees={newSellOrder.Fees}
						indexValue={countSell--}
						setOrders={this.setOrders}
						UpDownBit={newSellOrder.UpDownBit}
						isMultiSelect={newSellOrder.isMultiSelect}
						length={this.props.sellerOrderList.length}
						bgColorData={colData !== ""
							? colData = this.LightenDarkenColor(colData, 20)
							: colData = this.LightenDarkenColor("#ff0000", 20)
						}
						amount_size={newSellOrder.amount_size}
						validateQty={this.validateQty}
						order={newSellOrder}
						changeSelectedSellValue={this.changeSelectedSellValue}
						selectedSellValue={(newSellOrder.checkedBtn === undefined || newSellOrder.checkedBtn === 0) ? 25 : newSellOrder.checkedBtn}
					/>
				);
			//	return null
		});

		/* setTimeout(function(){
			$(".sellOrderClass").removeClass('blink_me');
		},1000) */

		return (
			<Fragment>
				
				<Table className="table m-0 p-0 buy-table">
					<thead>
						<tr className="text-light">
							{<th className="askBidbtn"></th>}
							<th className="exchange-name">
								<IntlMessages id="sidebar.arbitrageExchangeName" />
							</th>

							<th className="numeric price-data">
								<IntlMessages id="sidebar.fees" />
							</th>

							<th className="numeric calculate-btns">
								<IntlMessages id="trading.orders.label.amount" />
							</th>

							<th className="numeric price-data">
								<IntlMessages id="sidebar.arbitrageRate" />
							</th>

							<th className="numeric askBidbtn">
								<IntlMessages id="sidebar.arbitrageAsk" />
							</th>
						</tr>
					</thead>
				</Table>

				<Scrollbars
					className="jbs-scroll"
					autoHeight
					autoHeightMin={this.props.autoHeightMin}
					autoHeightMax={this.props.autoHeightMax}
					autoHide
				>
					{this.props.sellerBookLoader && <JbsBarLoader />}
					<Table className="table m-0 p-0 buy-table">
						{sellOrderListRow && sellOrderListRow.length ?
							<tbody>

								{sellOrderListRow}

							</tbody>
							:
							<tbody>
								<tr>
									<td>
										<IntlMessages id="apiErrCode.31020" />
									</td>
								</tr>
							</tbody>
						}
					</Table>
				</Scrollbars>

			</Fragment>
		);
	}
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({		
	sellerBookLoader: state.arbitrageOrderBook.sellerOrderLoading,	
});

// connect action with store for dispatch
export default connect(mapStateToProps, {})(SellTrade);