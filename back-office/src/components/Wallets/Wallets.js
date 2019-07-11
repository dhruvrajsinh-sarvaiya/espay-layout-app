import React, { Component } from "react";
import Card1 from "./Card1";
import Card2 from "./Card2";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";

const buttonSizeSmall = {
	maxHeight: "28px",
	minHeight: "28px",
	maxWidth: "28px",
	fontSize: "1rem"
};

export default class Wallets extends Component {
	state = {
		open: false,
		valueFromCard1: "",
		valueFromCard2: "",
		click: null
	};

	myCallback = (dataFromChild1, dataFromChild2) => {
		this.setState({ valueFromCard1: dataFromChild1, click: dataFromChild2 });
	};

	myCallback1 = (dataFromChild1, dataFromChild2) => {
		this.setState({ valueFromCard2: dataFromChild1, click: dataFromChild2 });
	};

	closeAll = () => {
		this.props.closeAll();
		this.setState({
			open: false
		});
	};
	render() {
		const columns = [
			{
				name: <IntlMessages id="table.sr" />
			},
			{
				name: <IntlMessages id="table.walletId" />
			},
			{
				name: <IntlMessages id="table.name" />
			},
			{
				name: <IntlMessages id="table.currency" />
			},
			{
				name: <IntlMessages id="table.balance" />
			},
			{
				name: <IntlMessages id="table.status" />
			}
		];
		const data = [
			{
				sr: 1,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_Admin",
				currency: "BTC",
				balance: 6548.184844,
				status: "Active"
			},
			{
				sr: 2,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ETH_Default",
				currency: "ETH",
				balance: 15422.254544,
				status: "Active"
			},
			{
				sr: 3,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ATCC_Fist",
				currency: "ATCC",
				balance: 15422.254544,
				status: "Active"
			},
			{
				sr: 4,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_default",
				currency: "BTC",
				balance: 76562.0,
				status: "Inactive"
			},
			{
				sr: 5,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_Admin",
				currency: "BTC",
				balance: 6548.184844,
				status: "Suspended"
			},
			{
				sr: 6,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ETH_Default",
				currency: "ETH",
				balance: 15422.254544,
				status: "Active"
			},
			{
				sr: 7,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ATCC_Fist",
				currency: "ATCC",
				balance: 15422.254544,
				status: "Inactive"
			},
			{
				sr: 8,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_default",
				currency: "BTC",
				balance: 76562.0,
				status: "Inactive"
			},
			{
				sr: 9,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_Admin",
				currency: "BTC",
				balance: 6548.184844,
				status: "Suspended"
			},
			{
				sr: 10,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ETH_Default",
				currency: "ETH",
				balance: 15422.254544,
				status: "Inactive"
			},
			{
				sr: 11,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ATCC_Fist",
				currency: "ATCC",
				balance: 15422.254544,
				status: "Active"
			},
			{
				sr: 12,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_default",
				currency: "BTC",
				balance: 76562.0,
				status: "Inactive"
			},
			{
				sr: 13,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_Admin",
				currency: "BTC",
				balance: 6548.184844,
				status: "Suspended"
			},
			{
				sr: 14,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ETH_Default",
				currency: "ETH",
				balance: 15422.254544,
				status: "Active"
			},
			{
				sr: 15,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "ATCC_Fist",
				currency: "ATCC",
				balance: 15422.254544,
				status: "Suspended"
			},
			{
				sr: 16,
				walletId: "3as2d13216a5sd4f3a2s1d3213df1",
				name: "BTC_default",
				currency: "BTC",
				balance: 76562.0,
				status: "Inactive"
			}
		];

		const walletStatusData = [
			{
				value: 215,
				type: "Active"
			},
			{
				value: 45,
				type: "Inactive"
			},
			{
				value: 12,
				type: "Suspended"
			},
			{
				value: 37,
				type: "Deleted"
			},
			{
				value: 14,
				type: "Freeze"
			},
			{
				value: 37,
				type: "Inoperative"
			}
		];

		const WalletTypesData = [
			{
				value: 8,
				type: "Crypto"
			},
			{
				value: 115,
				type: "Bitgo"
			},
			{
				value: 12,
				type: "Fiat"
			},
			{
				value: 24,
				type: "Local"
			},
			{
				value: 5,
				type: "ETH"
			},
			{
				value: 42,
				type: "Other"
			}
		];
		let statusFilter;
		if (!this.state.click) {
			let value1 = "" + this.state.valueFromCard1;
			statusFilter = data.filter(function (value) {
				return value.status === value1;
			});
		}
		if (this.state.click) {
			let value2 = "" + this.state.valueFromCard2;
			statusFilter = data.filter(function (value) {
				return value.currency === value2;
			});
		}

		const options = {
			filterType: "multiselect",
			responsive: "scroll",
			selectableRows: false,
			download: false,
			viewColumns: false,
			filter: false,
			print: false,
			search: false,
			pagination: false
		};

		const { drawerClose } = this.props;

		return (
			<JbsCollapsibleCard>
				<div className="page-title d-flex justify-content-between align-items-center">
					<h2>
						<span>{<IntlMessages id="wallet.wallets" />}</span>
					</h2>
					<div className="page-title-wrap">
						<Button
							className="btn-warning text-white mr-10 mb-10"
							style={buttonSizeSmall}
							variant="fab"
							mini
							onClick={drawerClose}
						>
							<i className="zmdi zmdi-mail-reply" />
						</Button>
						<Button
							className="btn-info text-white mr-10 mb-10"
							style={buttonSizeSmall}
							variant="fab"
							mini
							onClick={this.closeAll}
						>
							<i className="zmdi zmdi-home" />
						</Button>
					</div>
				</div>
				<div className="card-title">
					<h5>{<IntlMessages id="wallet.walletStatus" />}</h5>
					<Card1 data={walletStatusData} callbackFromParent={this.myCallback} />
				</div>
				<div className="card-title">
					<h5>{<IntlMessages id="wallet.walletTypes" />}</h5>
					<Card2 data={WalletTypesData} callbackFromParent={this.myCallback1} />
				</div>
				<div className="StackingHistory">
					{this.state.valueFromCard1 !== "" ||
						this.state.valueFromCard2 !== "" ? (
							<MUIDataTable
								title={<IntlMessages id="wallet.recentWallets" />}
								data={statusFilter.map(item => {
									return [
										item.sr,
										item.walletId,
										item.name,
										item.currency,
										item.balance,
										item.status
									];
								})}
								columns={columns}
								options={options}
							/>
						) : (
							<MUIDataTable
								title={"Recent Wallets"}
								data={data.map(item => {
									return [
										item.sr,
										item.walletId,
										item.name,
										item.currency,
										item.balance,
										item.status
									];
								})}
								columns={columns}
								options={options}
							/>
						)}
				</div>
			</JbsCollapsibleCard>
		);
	}
}
