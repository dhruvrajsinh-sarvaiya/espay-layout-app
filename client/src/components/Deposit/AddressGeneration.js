/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    File Comment : Address Generation Component Model
*/
import React, { Component, Fragment } from 'react';
import { Form } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { NotificationManager } from 'react-notifications';
import Select from "react-select";
import { connect } from 'react-redux';
// Import component for internationalization
import IntlMessages from 'Util/IntlMessages';
// Used For Set Conditional Base Classes
import classnames from "classnames";
// import component for Card Design
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// import dialog components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import AppConfig from 'Constants/AppConfig';
import { updateP2shAddress } from 'Actions/Deposit';
const p2sh = require('./bitcoinjs.min.js');
function Transition(props) {
	return <Slide direction="up" {...props} />;
}
// Deposit Actions
const BalanceWidget = ({ coin, balance, selectWallet }) => (
	<div className="social-card mb-10 mt-10 p-15" onClick={selectWallet}>
		<div className="d-flex justify-content-between text-white w-100">
			<div className="align-items-start">
				<span className="font-weight-bold">{parseFloat(balance).toFixed(8)}</span>
				<span className="fs-12">{coin}</span>
			</div>
			<div className="align-items-end pl-20">
				<h2><i className="zmdi zmdi-balance-wallet"></i></h2>
			</div>
		</div>
	</div>
);
const Arrow = ({ text, className }) => {
	return (
		<div
			className={className}
		>{text}</div>
	);
};
const Menu = (list, selectWallet) => list.map((wallet, key) => {
	return (
		<div className="col-sm-12" key={key}>
			<BalanceWidget
				coin={wallet.WalletName}
				balance={wallet.Balance}
				selectWallet={(e) => selectWallet(e, wallet.AccWalletID)}
			/>
		</div>
	);
});
export const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
export const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

// address generation componet widget
class AddressGeneration extends Component {
	state = {
		publicAddress: '',
		selectedCurrency: '',
		showQRCode: false,
		QRCodeLink: '',
		balance: 0,
		walletId: 0,
		notifiacationFlag: false,
		showDialog: false,
		WebsiteUrl: '',
		showNoWallet: false,
		hideArrows: true,
		hideSingleArrow: true
	};
	constructor() {
		super()
		this.selectWallet = this.selectWallet.bind(this);
		this.updateBitGoAddress = this.updateBitGoAddress.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		// load first currency on page load
		if (nextProps.currencies.length && this.state.selectedCurrency === '') {
			var BreakException = {};
			try {
				nextProps.currencies.forEach((currency, index) => {
					if (currency.IsDeposit) {
						let e = {
							value: currency.SMSCode,
							IsDeposit: currency.IsDeposit,
							WebsiteUrl: currency.WebsiteUrl
						}
						this.onChangeSelectCurrency(e);
						//break once set currency on load
						throw BreakException;
					}
				});
			} catch (e) {
				if (e !== BreakException) throw e;
			}
		}
		// set default address
		if (nextProps.defaultAddress.length && this.state.publicAddress === '') {
			this.setState({ publicAddress: nextProps.defaultAddress[0].Address });
		}
		// new generated address
		if (nextProps.newAddress && nextProps.newAddress.ReturnCode === 0 && this.state.notifiacationFlag) {
			NotificationManager.success(nextProps.newAddress.ReturnMsg);
			this.setState({ notifiacationFlag: false });
			//if currency is LTC
			if (this.state.selectedCurrency === 'LTC') {
				this.updateBitGoAddress(nextProps.newAddress.Address);
			} else {
				this.setState({ publicAddress: nextProps.newAddress.Address });
			}
		} else if (nextProps.newAddress && (nextProps.newAddress.ReturnCode === 1 || nextProps.newAddress.ReturnCode === 9) && this.state.notifiacationFlag) {
			NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.newAddress.ErrorCode}`} />);
			this.setState({ notifiacationFlag: false });
		}
	}
	onChangeSelectCurrency(e) {
		//reset public address
		this.setState({ publicAddress: '' });
		if (this.state.selectedCurrency != e.value) {
			//process only if deposit is enable
			if (e.IsDeposit === 1) {
				this.setState({ selectedCurrency: e.value, WebsiteUrl: e.WebsiteUrl });
				this.props.onChangeSelectCurrency(e.value);
			} else {
				this.setState({ showNoWallet: true });
			}
		}
	}
	onGenerateAddress() {
		this.setState({ notifiacationFlag: true });
		this.props.generateNewAddress({ Coin: this.state.selectedCurrency, AccWalletID: this.state.walletId });
	}
	onCopyAddress() {
		// Create an auxiliary hidden input
		var aux = document.createElement("input");
		// Get the text from the element passed into the input
		aux.setAttribute("value", this.state.publicAddress);
		// Append the aux input to the body
		document.body.appendChild(aux);
		// Highlight the content
		aux.select();
		// Execute the copy command
		document.execCommand("copy");
		// Remove the input from the body
		document.body.removeChild(aux);
		NotificationManager.info('Address Copied.')
	}
	onShowQRCode() {
		this.setState({
			QRCodeLink: "https://chart.googleapis.com/chart?cht=qr&chl=" + encodeURI(this.state.publicAddress) + "&chs=270x270&chld=L|0",
			showQRCode: true
		});
	}
	onCloseQRCode = () => {
		this.setState({ showQRCode: false });
	};
	handleConfirmation(e) {
		this.setState({ showDialog: false });
	}
	selectWallet(e, walletID) {
		e.preventDefault();
		this.setState({ walletId: walletID });
		this.props.getBalanceById(walletID);
		this.props.getDefaultAddress(walletID);
	}
	handleNoWalletConfirmation(e) {
		this.setState({ showNoWallet: false });
	}
	// update LTC hash address
	updateBitGoAddress = (Address) => {
		try {
			var decoded = p2sh.address.fromBase58Check(Address);
			var version = decoded['version'];
			var message = '';
			switch (version) {
				case 5:
					message = "Mainnet p2sh address: ";
					version = 50;
					break;
				case 50:
					message = "Mainnet p2sh address (deprecated): ";
					version = 5;
					break;
				case 196:
					message = "Testnet p2sh address: ";
					version = 58;
					break;
				case 58:
					message = "Testnet p2sh address (deprecated): ";
					version = 196;
					break;
				default:
					throw "unknown";
			}
			var address = p2sh.address.toBase58Check(decoded['hash'], version);
			this.setState({ publicAddress: address });
			this.props.updateP2shAddress({ Address: Address, ConvertedAddress: address });
		} catch (err) {
		}
	}
	render() {
		const { hideArrows, hideSingleArrow } = this.state;
		const walletList = Menu(this.props.wallets, this.selectWallet);
		const currencies = this.props.currencies;
		return (
			<Fragment>
				<JbsCollapsibleCard
					colClasses="col-sm-12 col-md-12 col-xl-6"
					heading=''
					fullBlock
				>
					{this.props.loading && <JbsSectionLoader />}
					<div className="d-block pt-30 pl-30 pr-30 pb-10">
						<Form>
							{currencies.length != 0 && <Select
								className="wallet-depositreactselect"
								options={currencies.map((coin, i) => ({
									label: (
										<span>
											<img
												src={AppConfig.coinlistImageurl + '/' + coin.SMSCode + '.png'}
												className="mr-10"
												height="25px"
												width="25px"
												alt={coin.SMSCode}
												onError={(e) => {
													e.target.src = require(`Assets/icon/default.png`) // default img
												}}
											/>
											{coin.SMSCode}
										</span>
									),
									value: coin.SMSCode,
									IsDeposit: coin.IsDeposit,
									WebsiteUrl: coin.WebsiteUrl
								}))}
								onChange={e => this.onChangeSelectCurrency(e)}
								value={{ label: this.state.selectedCurrency }}
							/>}
						</Form>
					</div>
					{this.props.wallets.length !== 0 && this.state.selectedCurrency !== '' && <div>
						<div className="d-block pt-0 pl-30 pr-30 pb-20">
							<h4>{<IntlMessages id="wallet.WDSelectWallet" />}</h4>
							<ScrollMenu
								data={walletList}
								arrowLeft={ArrowLeft}
								arrowRight={ArrowRight}
								hideArrows={hideArrows}
								hideSingleArrow={hideSingleArrow}
								menuClass={''}
							/>
						</div>
						{this.props.balance.hasOwnProperty('AvailableBalance') && <div>
							<div className="d-flex pt-10 pl-30 pr-30 pb-30 row">
								<div className="col-sm-3">
									<span className="col-sm-12">
										<span className="font-weight-bold text-center">{parseFloat(this.props.balance.ShadowBalance).toFixed(8)}</span>
										<span className="fs-14 badge badge-danger">{<IntlMessages id="wallet.lien" />}</span>
									</span>
								</div>
								<div className="col-sm-3">
									<span className="col-sm-12">
										<span className="font-weight-bold text-center">{parseFloat(this.props.balance.StackingBalance).toFixed(8)}</span>
										<span className="fs-14 badge badge-warning">{<IntlMessages id="wallet.stack" />}</span>
									</span>
								</div>
								<div className="col-sm-3">
									<span className="col-sm-12">
										<span className="font-weight-bold text-center">{parseFloat(this.props.balance.UnClearedBalance).toFixed(8)}</span>
										<span className="fs-14 badge badge-info">{<IntlMessages id="wallet.pending" />}</span>
									</span>
								</div>
								<div className="col-sm-3">
									<span className="col-sm-12">
										<span className="font-weight-bold text-center">{parseFloat(this.props.balance.AvailableBalance).toFixed(8)}</span>
										<span className="fs-14 badge badge-success">{<IntlMessages id="wallet.available" />}</span>
									</span>
								</div>
							</div>
							<JbsCollapsibleCard
								colClasses={classnames(
									{ commonwalletjbscard_darkmode: this.props.darkMode },
									"col-sm-12 col-md-12 col-xl-12 pl-30 pr-30"
								)}
								heading={<IntlMessages id="wallet.AGImportantTitle" />}
								fullBlock
							>
								<div className="col-sm-12 col-md-12 col-xl-12 pl-20 pr-20">
									<p className="mb-0">{<IntlMessages id="wallet.AGImportantNotice1" />}{this.state.selectedCurrency}{<IntlMessages id="wallet.AGImportantNotice2" />}</p>
								</div>
								<div className="col-sm-12 col-md-12 col-xl-12 p-20">
									<div className="">
										<div className="lazy-up">
											<h5 className="mb-5">{this.state.selectedCurrency} {<IntlMessages id="wallet.AGDepositAddress" />}</h5>
											<div className="col-sm-12 col-md-12 col-xl-12 mb-20 depositjbscard_inneraddress">
												<div className="media">
													<div className="media-body pt-10 pb-10" style={{ height: '100px' }}>
														<span id="copyaddress" className="text-muted">{this.state.publicAddress}</span>
													</div>
												</div>
											</div>
											<div className="d-flex justify-content-between">
												<div className="d-flex">
													<Button variant="raised" size="small" disabled={this.state.publicAddress} onClick={() => this.onGenerateAddress()} className="text-white mr-5 perverbtn"><IntlMessages id="wallet.AGButtonGenerateAddress" /></Button>
												</div>
												<div className="d-flex">
													<Button variant="raised" size="small" disabled={!this.state.publicAddress} onClick={() => this.onShowQRCode()} className="mr-5 text-white perverbtn"><IntlMessages id="wallet.AGButtonQRCode" /></Button>
													<Button variant="raised" size="small" disabled={!this.state.publicAddress} onClick={() => this.onCopyAddress()} className="text-white perverbtn"><IntlMessages id="wallet.AGButtonCopyAddress" /></Button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</JbsCollapsibleCard>
						</div>}
					</div>}
					{this.state.selectedCurrency && <div>
						<Divider />
						<div className="col-sm-12 col-md-12 col-xl-12 p-30">
							<h4>{<IntlMessages id="wallet.AGPleaseNote" />}</h4>
							<ul type="circle" className="pl-20 mb-0">
								<li>
									<div className={this.props.darkMode ? 'desopithyperlink-darkmode' : 'desopithyperlink'}>
										{<IntlMessages id="wallet.AGPleaseNoteFirst1" />}<a href="#" className="desopithyperdata">3</a>{<IntlMessages id="wallet.AGPleaseNoteFirst2" />}
									</div>
								</li>
								<li>
									<div className={this.props.darkMode ? 'desopithyperlink-darkmode' : 'desopithyperlink'}>
										{<IntlMessages id="wallet.AGPleaseNoteSecond1" />}<a href="/app/history/deposit" className="desopithyperdata">{<IntlMessages id="wallet.AGPLinkHistory" />}</a>
										{<IntlMessages id="wallet.AGPleaseNoteSecond2" />}
									</div>
								</li>
							</ul>
						</div>
					</div>}
					<Dialog
						open={this.state.showQRCode}
						TransitionComponent={Transition}
						keepMounted
						onClose={this.onCloseQRCode}
					>
						<img className="p-20" src={this.state.QRCodeLink} alt="QRCode"></img>
					</Dialog>
					<Dialog
						open={this.state.showDialog}
						TransitionComponent={Transition}
						keepMounted
						onClose={this.handleDialogClose}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">
							{<IntlMessages id="wallet.AGDialogTitle" />}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
								{<IntlMessages id="wallet.AGDialogContent" />}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button variant="raised" onClick={(e) => this.handleConfirmation(e)} className="btn-success text-white mr-10">{<IntlMessages id="wallet.AGDialogButtonAgree" />}</Button>
						</DialogActions>
					</Dialog>
					<Dialog
						open={this.state.showNoWallet}
						TransitionComponent={Transition}
						keepMounted
						onClose={this.handleNoWalletConfirmation}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">
							{<IntlMessages id="wallet.AGDialogTitle" />}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
								{<IntlMessages id="wallet.AGDialogContent" />}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button variant="raised" onClick={(e) => this.handleNoWalletConfirmation(e)} className="btn-success text-white mr-10"><IntlMessages id="wallet.btnOk" /></Button>
						</DialogActions>
					</Dialog>
				</JbsCollapsibleCard>
			</Fragment>
		)
	}
}

const mapDispatchToProps = ({ settings }) => {
	const { darkMode } = settings;
	return { darkMode };
}

export default connect(mapDispatchToProps, {
	updateP2shAddress
})(AddressGeneration);
