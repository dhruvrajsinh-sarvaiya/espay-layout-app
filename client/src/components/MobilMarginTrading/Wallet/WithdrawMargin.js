/* 
    Developer : vishva shah
    Date : 19-04-2019
    File Comment : withdraw margin wallet deleverage 
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from 'Util/IntlMessages';
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Tooltip from '@material-ui/core/Tooltip';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { getPreConfirmations, delavrageConfirm, getMaringWalletList } from 'Actions/MarginTrading';

class WithdrawMargin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showConfirmModal: false,
			Currency: this.props.walletTypeName,
			notificationFlag: false,
			flag: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.confirmDetail.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
			this.setState({ notificationFlag: false });
			if (nextProps.confirmDetail.ReturnCode === 0) {
				this.setState({
					showModal: false,
					showConfirmModal: false,
					flag: false,
				});
				NotificationManager.success(nextProps.confirmDetail.ReturnMsg);
				this.props.getMaringWalletList({});
			} else if (nextProps.confirmDetail.ReturnCode === 1) {
				NotificationManager.error(
					<IntlMessages id={`apiWalletErrCode.${nextProps.confirmDetail.ErrorCode}`} />
				);
			}
		}
		if (nextProps.preConfirmationDetails.hasOwnProperty('ReturnCode') && this.state.flag) {
			if (nextProps.preConfirmationDetails.ReturnCode === 1) {
				NotificationManager.error(
					<IntlMessages id={`apiWalletErrCode.${nextProps.preConfirmationDetails.ErrorCode}`} />
				);
			}
		}
	}

	/**
	 * Toggle Modal
	 */
	toggleShowModal = () => {
		this.setState({
			showModal: this.state.showModal ? false : true,
			notificationFlag: false,
		});
	};

	/**
	 * Toggle Confirmation Modal
	 */
	toggleShowConfirmModal = () => {
		this.setState({
			showConfirmModal: this.state.showConfirmModal ? false : true,
			showModal: this.state.showModal ? false : true,
			flag: false,
		});
	};

	getPreconfirm = () => {
		this.setState({ flag: true });
		this.props.getPreConfirmations(this.state.Currency);
	};

	// getConfirm
	getConfirm = () => {
		this.setState({
			notificationFlag: true,
			flag: true,
		});
		this.props.delavrageConfirm(this.state.Currency);
	};

	render() {
		const { showModal } = this.state;
		const intl = this.props.intl;
		return (
			<Fragment>
				{this.props.widgetType === 2 && (
					<Tooltip title={intl.formatMessage({ id: 'wallet.Deleverage' })} placement="bottom">
						<a href="javascript:void(0)" onClick={this.toggleShowModal}>
							<i className="zmdi zmdi-open-in-new" />
						</a>
					</Tooltip>
				)}
				<Modal isOpen={showModal}>
					{this.props.loading && <JbsSectionLoader />}
					<ModalHeader toggle={this.toggleShowModal}>{<IntlMessages id="wallet.Deleverage" />}</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label for="Amount">
									{intl.formatMessage({ id: 'trading.holdingorder.label.currency' })}
								</Label>
								<Input
									type="text"
									name="currency"
									id="currency"
									placeholder={intl.formatMessage({ id: 'wallet.CTAmount' })}
									value={this.state.Currency}
									disabled
								/>
							</FormGroup>
							{this.props.preConfirmationDetails.hasOwnProperty('ReturnCode') &&
								this.props.preConfirmationDetails.ReturnCode === 0 &&
								this.state.flag && (
									<div>
										<FormGroup>
											<Label for="totalAmount">
												{intl.formatMessage({ id: 'wallet.totalAmount' })}
											</Label>
											<Input
												type="text"
												name="TotalAmount"
												id="TotalAmount"
												value={this.props.preConfirmationDetails.TotalAmount}
												disabled
											/>
										</FormGroup>
										<FormGroup>
											<Label for="chargeAmount">
												{intl.formatMessage({ id: 'wallet.chargeAmount' })}
											</Label>
											<Input
												type="text"
												name="ChargeAmount"
												id="ChargeAmount"
												value={this.props.preConfirmationDetails.ChargeAmount}
												disabled
											/>
										</FormGroup>
										<FormGroup>
											<Label for="LoanID">{intl.formatMessage({ id: 'wallet.loanId' })}</Label>
											<Input
												type="text"
												name="LoanID"
												id="LoanID"
												value={this.props.preConfirmationDetails.LoanID}
												disabled
											/>
										</FormGroup>
										<FormGroup>
											<Label for="profitAmount">
												{intl.formatMessage({ id: 'wallet.profitAmount' })}
											</Label>
											<Input
												type="text"
												name="ProfitAmount"
												id="ProfitAmount"
												value={this.props.preConfirmationDetails.ProfitAmount}
												disabled
											/>
										</FormGroup>
									</div>
								)}
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							className={'mr-10 border-0 rounded-0 '}
							onClick={
								(this.props.preConfirmationDetails.hasOwnProperty('ReturnCode') &&
									this.props.preConfirmationDetails.ReturnCode === 0 && this.state.flag)
									? () => this.getConfirm(this.state.Currency)
									: () => this.getPreconfirm(this.state.Currency)
							}
						>
							{(this.props.preConfirmationDetails.hasOwnProperty('ReturnCode') &&
								this.props.preConfirmationDetails.ReturnCode === 0 && this.state.flag) ? (
									<IntlMessages id="wallet.btnConfirm" />
								) : (
									<IntlMessages id="wallet.getQuote" />
								)}
						</Button>{' '}
						<Button
							color="danger"
							className="mr-10 border-0 rounded-0 "
							onClick={this.toggleShowConfirmModal}
						>
							<IntlMessages id="button.cancel" />
						</Button>
					</ModalFooter>
				</Modal>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ WalletManagementReducer }) => {
	const { loading, preConfirmationDetails, confirmDetail } = WalletManagementReducer;
	return { loading, preConfirmationDetails, confirmDetail };
};

export default connect(mapStateToProps, {
	getPreConfirmations,
	delavrageConfirm,
	getMaringWalletList
})(injectIntl(WithdrawMargin));