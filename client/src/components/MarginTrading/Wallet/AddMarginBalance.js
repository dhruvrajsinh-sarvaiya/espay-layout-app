/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : add margin wallet leverage balance
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from 'Util/IntlMessages';
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Tooltip from '@material-ui/core/Tooltip';
import Select from "react-select";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Slide from '@material-ui/core/Slide';
import validator from "validator";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Table
} from 'reactstrap';
import {
    getCurrency,
    getWallets
} from "Actions/Withdraw";
import {
    addLeverageWithWallet,
    confirmAddLeverage,
    getMaringWalletList,
    getMarginCurrency
} from "Actions/MarginTrading";

//import action for call or get leverage detail for margin trading dashboard Devang parekh 8-3-2019
import {
    getLeverageDetail
} from "Actions/MarginTrading";
//end code

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

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
        <div className="col-sm-12 w-xs-half-block" key={key}>
            <BalanceWidget
                coin={wallet.WalletName}
                balance={wallet.Balance}
                selectWallet={(e) => selectWallet(e, wallet)}
            />
        </div>
    );
});

const LeveragePer = [
    { label: "1X", value: "1" },
    { label: "2X", value: "2" },
    { label: "3X", value: "3" },
    { label: "4X", value: "4" },
    { label: "5X", value: "5" },
    { label: "6X", value: "6" },
    { label: "7X", value: "7" },
    { label: "8X", value: "8" },
    { label: "9X", value: "9" },
    { label: "10X", value: "10" },
];

export const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
export const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

class AddMarginBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showConfirmModal: false,
            WalletTypeObj: null,
            WalletTypeId: '',
            AccWalletid: '',
            Amount: '',
            flag: false,
            limit: "",
            LeveragePer: "1",
            // LeverageChargeDeductionType: '',
        };
        this.selectWallet = this.selectWallet.bind(this);
    }
    componentWillMount() {
        // this.props.getCurrency();
        this.props.getMarginCurrency({});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.addLeverageResponse.hasOwnProperty('ReturnCode') && this.state.flag) {
            if (nextProps.addLeverageResponse.ReturnCode === 0) {
                this.setState({
                    showModal: false,
                    showConfirmModal: true,
                });
            } else if (nextProps.addLeverageResponse.ReturnCode !== 1) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.addLeverageResponse.ErrorCode}`} />);
            }
        }
        if (nextProps.confirmResponse.hasOwnProperty('ReturnCode') && this.state.flag) {
            if (nextProps.confirmResponse.ReturnCode === 0) {
                NotificationManager.success(nextProps.confirmResponse.ReturnMsg);
                // setTimeout(function () {
                this.setState({
                    showModal: false,
                    showConfirmModal: false,
                    WalletTypeObj: null,
                    WalletTypeId: '',
                    AccWalletid: '',
                    Amount: '',
                    LeveragePer: ""
                    // LeverageChargeDeductionType: '',
                });
                //refresh wallet list
                this.props.getMaringWalletList({});

                // call margin account detail when widget type 4 (devang aprekh 8-3-2019)
                if (this.props.widgetType === 4) {
                    this.props.getLeverageDetail({ firstCurrency: this.props.firstCurrency, secondCurrency: this.props.secondCurrency });
                }
                // end

                // }.bind(this), 3000);
            } else if (nextProps.confirmResponse.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.confirmResponse.ErrorCode}`} />);
                this.setState({
                    showModal: false,
                    showConfirmModal: false,
                    WalletTypeObj: null,
                    WalletTypeId: '',
                    AccWalletid: '',
                    Amount: '',
                    LeveragePer: ""
                    // LeverageChargeDeductionType: '',
                });
            }
        }
    }

    /**
     * Toggle Modal
     */
    toggleShowModal = () => {
        //if closed
        if (!this.state.showModal) {
            /* select currency default */
            // add || this.props.widgetType === 3 by devang parekh (7-3-2019)
            if ((this.props.widgetType === 2 || this.props.widgetType === 3 || this.props.widgetType === 4) && this.props.hasOwnProperty("walletTypeName") && this.state.WalletTypeId === '') {
                this.props.marginCurrancy.map((wallet, key) => {
                    //added by parth andhariya
                    //list Margin Currncy list
                    if (wallet.WalletTypeName == this.props.WalletTypeName) {
                        this.onChangeSelectCurrency({
                            label: wallet.WalletTypeName,
                            value: wallet.WalletTypeId,
                        });
                    }
                });
            }
        }
        this.setState({
            showModal: !this.state.showModal,
            WalletTypeObj: null,
            WalletTypeId: '',
            AccWalletid: '',
            Amount: '',
            flag: false,
            LeveragePer: ""
        });
    }
    /**
     * Toggle Confirmation Modal
     */
    toggleShowConfirmModal = () => {
        this.setState({
            showConfirmModal: !this.state.showConfirmModal,
            showModal: !this.state.showModal,
            WalletTypeObj: null,
            WalletTypeId: '',
            AccWalletid: '',
            Amount: '',
            flag: false,
            LeveragePer: ""
            // LeverageChargeDeductionType: '',
        });
    }

    /**
     * Handle create wallet 
     */
    createWallet = () => {
        const { WalletTypeId, AccWalletid, Amount, LeveragePer } = this.state;
        if (WalletTypeId !== '' && AccWalletid !== '' && Amount !== '' && LeveragePer !== "") {
            this.setState({ flag: true });
            this.props.addLeverageWithWallet(this.state);
        }
    }
    /**
     * Handle confirm wallet leverage
     */
    confirmWallet = () => {
        const { WalletTypeId, AccWalletid, Amount, LeveragePer } = this.state;
        if (WalletTypeId !== '' && AccWalletid !== '' && Amount !== '' && LeveragePer !== '') {
            this.props.confirmAddLeverage(this.state);
        }
    }
    // numberic value only
    validateOnlyNumeric(value) {
        const regexNumeric = /^[0-9.]+$/;
        if (
            validator.matches(value,regexNumeric) &&
            validator.isDecimal(value, {
                force_decimal: false,
                decimal_digits: "0,8"
            })
        ) {
            return true;
        } else {
            return false;
        }
    }
    /* on chane handler */
    onChangeHandler(e) {
        if (this.validateOnlyNumeric(e.target.value) || e.target.value == "") {
            this.setState({ [e.target.name]: e.target.value });
        }
    }
    /* on chane handler select search */
    onChangeSelectCurrency(e) {
        this.setState({ WalletTypeId: e.value, WalletTypeObj: { label: e.label }, limit: e.LeveragePer, LeveragePer: "1" });
        this.props.getWallets({ Coin: e.label });
    }
    /* select wallet  */
    selectWallet(e, wallet) {
        e.preventDefault();
        //if wallet has balance then procceed further else not
        if (wallet.Balance != 0) {
            this.setState({ AccWalletid: wallet.AccWalletID });
        } else {
            NotificationManager.error(<IntlMessages id={`trading.placeorder.error.minBalance`} />);
        }
    }

    render() {
        const walletList = Menu(this.props.wallets, this.selectWallet);
        const { showModal, showConfirmModal, hideArrows, hideSingleArrow } = this.state;
        const intl = this.props.intl;
        return (
            <Fragment>
                {this.props.widgetType === 1 && <Button
                    color="primary"
                    className="mr-10 border-0 rounded-0 mt-10"
                    style={{ float: "right" }}
                    onClick={this.toggleShowModal}
                >
                    <IntlMessages id="wallet.createWallet" />
                </Button>}
                {this.props.widgetType === 2 && <Tooltip title={intl.formatMessage({ id: "wallet.addBalance" })} placement="bottom">
                    <a
                        href="javascript:void(0)"
                        onClick={this.toggleShowModal}
                    >
                        <i className="zmdi zmdi-plus-circle" />
                    </a>
                </Tooltip>}
                {this.props.widgetType === 3 && <Tooltip title={<IntlMessages id="wallet.addLeverage" />} placement="bottom">
                    <a href="javascript:void(0)" onClick={this.toggleShowModal}>
                        <i className="zmdi zmdi-balance-wallet">
                            {" "}{this.props.CurrencyBalance} <span>{this.props.walletTypeName}</span>
                        </i>
                    </a>
                </Tooltip>}
                {/* Add below code for display extra plus button for process margin trading account detail (devang parekh 7-3-2019) */}
                {this.props.widgetType === 4 && <Tooltip title={intl.formatMessage({ id: "wallet.addBalance" })} placement="bottom">
                    <a
                        href="javascript:void(0)"
                        onClick={this.toggleShowModal}
                    >
                        <i className="zmdi zmdi-plus-square zmdi-hc-2x"></i>
                    </a>
                </Tooltip>}
                {/* end */}
                <Modal isOpen={showModal}>
                    {(this.props.loading || this.props.walletLoading) && <JbsSectionLoader />}
                    <ModalHeader toggle={this.toggleShowModal}>{this.props.widgetType === 1 ? <IntlMessages id="wallet.createWalletTitle" /> : <IntlMessages id="wallet.addLeverage" />}</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="WalletTypeId">{intl.formatMessage({ id: "trading.holdingorder.label.currency" })}</Label>
                                {/* added by parth andhariya */}
                                {/* list Margin Currncy list */}
                                <Select
                                    options={this.props.marginCurrancy.map((wallet, key) => ({
                                        label: wallet.WalletTypeName,
                                        value: wallet.WalletTypeId,
                                        LeveragePer: wallet.LeveragePer

                                    }))}
                                    onChange={e => this.onChangeSelectCurrency(e)}
                                    value={this.state.WalletTypeObj}
                                    placeholder={intl.formatMessage({ id: "widgets.search" })}
                                />
                            </FormGroup>
                            {this.state.WalletTypeId !== '' && <FormGroup>
                                <Label for="WalletTypeId">{intl.formatMessage({ id: "wallet.WDSelectWallet" })}</Label>
                                <ScrollMenu
                                    data={walletList}
                                    hideArrows={hideArrows}
                                    hideSingleArrow={hideSingleArrow}
                                    arrowLeft={ArrowLeft}
                                    arrowRight={ArrowRight}
                                    menuClass={''}
                                />
                            </FormGroup>}
                            {this.state.AccWalletid !== '' && <FormGroup>
                                <Label for="Amount">{intl.formatMessage({ id: "trading.placeorder.label.amount" })}</Label>
                                <Input
                                    type="text"
                                    name="Amount"
                                    id="Amount"
                                    placeholder={intl.formatMessage({ id: "trading.placeorder.label.amount" })}
                                    onChange={(e) => this.onChangeHandler(e)}
                                    value={this.state.Amount}
                                    maxLength="12"
                                    autoComplete="off" />
                            </FormGroup>}
                            {/* {this.state.AccWalletid !== '' && <FormGroup>
                                <Label for="LeverageChargeDeductionType">{intl.formatMessage({ id: "wallet.leverageDeductionType" })}</Label>
                                <Input type="select" name="LeverageChargeDeductionType" id="LeverageChargeDeductionType" onChange={(e) => this.onChangeHandler(e)} >
                                    <option value="">{intl.formatMessage({ id: "wallet.selectDeductionType" })}</option>
                                    <option value="0">{intl.formatMessage({ id: "wallet.LeverageChargeDeductionType.0" })}</option>
                                    <option value="1">{intl.formatMessage({ id: "wallet.LeverageChargeDeductionType.1" })}</option>
                                    <option value="2">{intl.formatMessage({ id: "wallet.LeverageChargeDeductionType.2" })}</option>
                                    <option value="3">{intl.formatMessage({ id: "wallet.LeverageChargeDeductionType.3" })}</option>
                                    <option value="4">{intl.formatMessage({ id: "wallet.LeverageChargeDeductionType.4" })}</option>
                                </Input>
                            </FormGroup>} */}
                            {this.state.AccWalletid !== '' && <FormGroup>
                                <Label for="LeveragePer">{intl.formatMessage({ id: "marginTrading.leverage" })}</Label>
                                <Input type="select"
                                    name="LeveragePer"
                                    id="LeveragePer"
                                    value={this.state.LeveragePer}
                                    onChange={(e) => this.onChangeHandler(e)}
                                >
                                    {LeveragePer.map((label, value) => (
                                        (label.value <= this.state.limit) &&
                                        <option
                                            value={label.value} key={value}
                                        >{label.label}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            className={"mr-10 border-0 rounded-0 " + ((this.state.WalletTypeId === '' || this.state.AccWalletid === '' || this.state.Amount === '') ? "disabled" : "")}
                            onClick={this.createWallet}>{this.props.widgetType === 1 ? <IntlMessages id="wallet.btnCreate" /> : <IntlMessages id="button.add" />}</Button>{' '}
                        <Button
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            onClick={this.toggleShowModal}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={showConfirmModal}>
                    {this.props.loading && <JbsSectionLoader />}
                    <ModalHeader toggle={this.toggleShowConfirmModal}><IntlMessages id="wallet.confirmLeverage" /></ModalHeader>
                    <ModalBody>
                        <Table bordered className="mb-0">
                            <tbody>
                                {/* {this.props.addLeverageResponse.hasOwnProperty('LeveragePer') && <tr>
                                    <td className="w-50"><IntlMessages id="wallet.LeveragePer" /></td>
                                    <td className="w-50">{parseFloat(this.props.addLeverageResponse.LeveragePer).toFixed(8)}</td>
                                </tr>} */}
                                {this.props.addLeverageResponse.hasOwnProperty('LeverageAmount') && <tr>
                                    <td className="w-50"><IntlMessages id="wallet.LeverageAmount" /></td>
                                    <td className="w-50">{parseFloat(this.props.addLeverageResponse.LeverageAmount).toFixed(8)} (<span className="font-weight-bold">{parseInt(this.props.addLeverageResponse.LeveragePer) + 'X'}</span>)</td>
                                </tr>}
                                {/* {this.props.addLeverageResponse.hasOwnProperty('ChargePer') && <tr>
                                    <td className="w-50"><IntlMessages id="wallet.ChargePer" /></td>
                                    <td className="w-50">{parseFloat(this.props.addLeverageResponse.ChargePer).toFixed(8)}</td>
                                </tr>} */}
                                {this.props.addLeverageResponse.hasOwnProperty('ChargeAmount') && <tr>
                                    <td className="w-50"><IntlMessages id="wallet.ChargeAmount" /></td>
                                    <td className="w-50">{parseFloat(this.props.addLeverageResponse.ChargeAmount).toFixed(8)} (<span className="font-weight-bold">{parseFloat(this.props.addLeverageResponse.ChargePer).toFixed(2) + '%'}</span>)</td>
                                </tr>}
                                {this.props.addLeverageResponse.hasOwnProperty('FinalCreditAmount') && <tr>
                                    <td className="w-50"><IntlMessages id="wallet.FinalCreditAmount" /></td>
                                    <td className="w-50 font-weight-bold">{parseFloat(this.props.addLeverageResponse.FinalCreditAmount).toFixed(8)}</td>
                                </tr>}
                                {this.props.addLeverageResponse.hasOwnProperty('SafetyMarginAmount') && <tr>
                                    <td className="w-50"><IntlMessages id="wallet.SafetyMarginAmount" /></td>
                                    <td className="w-50">{parseFloat(this.props.addLeverageResponse.SafetyMarginAmount).toFixed(8)}</td>
                                </tr>}
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            className={"mr-10 border-0 rounded-0 " + ((this.state.WalletTypeId === '' || this.state.AccWalletid === '' || this.state.Amount === '') ? "disabled" : "")}
                            onClick={this.confirmWallet}><IntlMessages id="wallet.btnConfirm" /></Button>{' '}
                        <Button
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            onClick={this.toggleShowConfirmModal}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ WalletManagementReducer, withdrawApp, settings }) => {
    const { currencies, wallets } = withdrawApp;
    const walletLoading = withdrawApp.loading;
    const { loading, addLeverageResponse, confirmResponse, marginCurrancy } = WalletManagementReducer;
    return { currencies, wallets, settings, loading, walletLoading, addLeverageResponse, confirmResponse, marginCurrancy };
};

export default connect(mapStateToProps, {
    getCurrency,
    getWallets,
    addLeverageWithWallet,
    confirmAddLeverage,
    getMaringWalletList,
    getLeverageDetail,// devang parekh (8-3-2019),
    getMarginCurrency
})(injectIntl(AddMarginBalance));
