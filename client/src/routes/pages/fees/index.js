/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 20-09-2018
    UpdatedDate : 20-09-2018
    Description :Fees And Charges Pages
*/
import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// app config
import AppConfig from 'Constants/AppConfig';

// code added by devang parekh (14-3-2019)
import { getChargeList } from "Actions/Trade";
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

class Fees extends Component {
	state = {
		myContnet: []
	}

	componentDidMount() {
		//HAVE TO PASS PROPER PAGE ID TO GET RELAVANT PAGE CONTENT
		this.props.getChargeList({});
	}

	render() {
		const { chargesList } = this.props;

		var chargesDetailList = [];
		if (typeof chargesList !== 'undefined' && chargesList.length > 0) {

			chargesList.map((chargeDetail, key) => {

				var coinListWithCharge = {};
				coinListWithCharge.CoinName = chargeDetail.WalletTypeName;
				coinListWithCharge.TakerCharge = 0;
				coinListWithCharge.MakerCharge = 0;
				coinListWithCharge.ChargeCurrencyName = '-';
				coinListWithCharge.WithdrawalChargeCurrencyName = '-';
				coinListWithCharge.WithdrawalCharge = 0;


				if (chargeDetail.Charges && chargeDetail.Charges.length > 0) {

					chargeDetail.Charges.map((item, key1) => {

						if (item.TrnTypeId === 3) { // type id 3 means trading charge

							coinListWithCharge.TakerCharge = item.TakerCharge + '%';
							coinListWithCharge.MakerCharge = item.MakerCharge + '%';
							coinListWithCharge.ChargeCurrencyName = item.DeductWalletTypeName;

						}

						if (item.TrnTypeId === 9) { // type id 9 means withdrawal charge
							coinListWithCharge.WithdrawalChargeCurrencyName = item.DeductWalletTypeName;
							coinListWithCharge.WithdrawalCharge = item.ChargeValue;
						}

					})

				}

				chargesDetailList.push(coinListWithCharge);

			})
		}

		// end

		return (
			<div className="about-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.fees" />} match={this.props.match} />
				<div className="terms-wrapper" >
					{this.props.loading && <JbsSectionLoader />}
					<div className="terms-conditions-rules fees_list">
						<JbsCollapsibleCard heading={<IntlMessages id="sidebar.tradingFeeHeading" />}>
							<div className="table-responsive">
								<div className="unseen">
									<Table hover bordered striped>
										<thead>
											<tr className="bg-primary text-white">
												<th><IntlMessages id="sidebar.coinOrToken" /></th>
												<th><IntlMessages id="sidebar.makerFee" /></th>
												<th><IntlMessages id="sidebar.takerFee" /></th>
												<th><IntlMessages id="sidebar.chargeCurrency" /></th>
											</tr>
										</thead>
										<tbody>
											{chargesDetailList.map((item, index) => {

												return (<tr key={index}>
													<td>
														<img src={AppConfig.coinlistImageurl + '/' + item.CoinName + '.png'} height="20" width="20" className="mr-15" />
														{item.CoinName}
													</td>
													<td>{item.MakerCharge}</td>
													<td>{item.TakerCharge}</td>
													<th>{item.ChargeCurrencyName}</th>
												</tr>)

											})
											}
										</tbody>
									</Table>
								</div>
							</div>
						</JbsCollapsibleCard>
						<JbsCollapsibleCard heading={<IntlMessages id="sidebar.depositFeeHeading" />}>
							<span className="sub-heading">Free</span>
						</JbsCollapsibleCard>
						<JbsCollapsibleCard heading={<IntlMessages id="sidebar.withdrawalFeeHeading" />}>
							<span className="sub-heading mb-1">We will adjust the withdrawal fees according to the Blockchain conditions regularly.</span>
							<div className="table-responsive">
								<div className="unseen">
									<Table hover bordered striped>
										<thead>
											<tr className="bg-primary text-white">
												<th><IntlMessages id="sidebar.coinOrToken" /></th>
												<th><IntlMessages id="sidebar.tradingLedger.tableHeading.fee" /></th>
												<th><IntlMessages id="sidebar.chargeCurrency" /></th>
											</tr>
										</thead>
										<tbody>
											{chargesDetailList.map((item, i) => {

												return (<tr key={i}>
													<td>
														<img src={AppConfig.coinlistImageurl + '/' + item.CoinName + '.png'} height="20" width="20" className="mr-15" />
														{item.CoinName}
													</td>
													<td>{item.WithdrawalCharge}</td>
													<th>{item.WithdrawalChargeCurrencyName}</th>
												</tr>)

											})
											}
										</tbody>
									</Table>
								</div>
							</div>
						</JbsCollapsibleCard>
					</div>
				</div>
			</div>
		);
	}
}
// code added by devang parekh (13-4-2019)
const mapStateToProps = ({ chargeList }) => {
	const { chargesList, loading } = chargeList;
	return { chargesList, loading };
}
// end

export default connect(mapStateToProps, {
	getChargeList
})(Fees);