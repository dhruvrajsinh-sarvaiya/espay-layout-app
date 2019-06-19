/* 
    Developer : Vishva shah
    Date : 05-06-2019
    File Comment : list & create a Arbitrage wallets
*/
import React, { Component, Fragment } from 'react';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import classnames from "classnames";
import MUIDataTable from "mui-datatables";
import { connect } from 'react-redux';
import { changeDateFormat } from "Helpers/helpers";
import IntlMessages from 'Util/IntlMessages';
import Select from "react-select";
// import Typography from "@material-ui/core/Typography";
import CreateArbitrageWallet from './CreateArbitrageWallet';
import Tooltip from '@material-ui/core/Tooltip';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { NotificationManager } from 'react-notifications';
import validator from "validator";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

//added by Tejas 14/6/2019
import JbsBarLoader from "Components/JbsPageLoader/JbsBarLoader"

// import Leverage from './Leverage';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import {
    getArbitrageCurrencyList,
    getArbitrageWalletList,
    addAtbitrageBalance
} from 'Actions/Arbitrage';
import {
    getWallets
} from "Actions/Withdraw";
const initState = {
    WalletTypeObj: null,
    WalletTypeId: '',
    WalletUsageType: '',
    Status: '',
    UsageType: '',
    showReset: false,
    activeIndex: 0,

    showModal: false,
    WalletType: '',
    DebitWalletId: '',
    CreditWalletId: '',
    Amount: '',
    errAmount: '',
    AvailableBalance: 0,
    showConfirmation: false,
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

export const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
export const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

class ListMarginWallets extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.toggleShowModal = this.toggleShowModal.bind(this);
        this.showModel = this.showModel.bind(this);
        this.selectWallet = this.selectWallet.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentWillMount() {
        this.props.getArbitrageCurrencyList();
        this.props.getArbitrageWalletList({});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.addBalanceConfirmation.hasOwnProperty('ReturnCode')) {
            if (nextProps.addBalanceConfirmation.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={`sidebar.creditSuccess`} />);
                this.closeModal();
                this.props.getArbitrageWalletList({});
            } else if (nextProps.addBalanceConfirmation.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={`apiErrCode.${nextProps.addBalanceConfirmation.ErrorCode}`} />);
            }
        }
    }
    /* on chane handler select search */
    onChangeSelectCurrency(e) {
        this.setState({ WalletTypeId: e.value, WalletTypeObj: { label: e.label } });
    }
    /* on change handler */
    onChangeHander(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    /* apply filter */
    applyFilter() {
        if (this.state.Status !== '' || this.state.WalletTypeId !== '') {
            this.props.getArbitrageWalletList({
                Status: this.state.Status,
                WalletTypeId: this.state.WalletTypeId
            });
            this.setState({ showReset: true });
        }
    }
    /* reset filter options */
    clearFilter() {
        this.setState(initState);
        this.props.getArbitrageWalletList({});
    }
    /* toggle show model */
    showModel(CoinName, CreditWalletId) {
        this.setState({
            WalletType: CoinName,
            CreditWalletId: CreditWalletId,
        }, () => this.props.getWallets({ Coin: CoinName }));
        this.toggleShowModal();
    }
    /* toggle show model */
    toggleShowModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }
    /* select wallet  */
    selectWallet(e, wallet) {
        e.preventDefault();
        //if wallet has balance then procceed further else not
        if (wallet.Balance != 0) {
            this.setState({
                DebitWalletId: wallet.AccWalletID,
                AvailableBalance: wallet.Balance
            });
        } else {
            NotificationManager.error(<IntlMessages id={`trading.placeorder.error.minBalance`} />);
        }
    }
    // numberic value only
    validateOnlyNumeric(value) {
        const regexNumeric = /^[0-9.]+$/;
        if (
            regexNumeric.test(value) &&
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
        if (this.validateOnlyNumeric(e.target.value) || e.target.value === "") {
            this.setState({ [e.target.name]: e.target.value });
        }
    }
    /* close model & reset value */
    closeModal() {
        this.setState({
            showModal: false,
            WalletType: '',
            DebitWalletId: '',
            CreditWalletId: '',
            Amount: '',
            errAmount: '',
            AvailableBalance: 0,
        });
    }
    /* validate amount on  blur */
    vadliateAmount(e) {
        if (!validator.isNumeric(e.target.value) && !validator.isFloat(e.target.value)) {
            this.setState({
                errAmount: "sidebar.erramountRequired"
            })
        } else if (validator.contains(e.target.value, '-')) {
            this.setState({
                errAmount: "wallet.errWDInvalidAmount"
            })
        } else if (validator.equals(e.target.value, '0') || e.target.value == 0) {
            this.setState({
                errAmount: "wallet.errWDInvalidAmount"
            })
        } else if (!validator.isDecimal(e.target.value, { force_decimal: false, decimal_digits: '0,8' })) {
            this.setState({
                errAmount: "wallet.errWDInvalidAmount"
            })
        } else if (parseFloat(e.target.value) > parseFloat(this.state.AvailableBalance)) {
            this.setState({
                errAmount: "wallet.errWDLessthenBalance"
            })
        } else {
            this.setState({
                errAmount: ""
            })
        }
    }
    /* add balance after confirmation */
    addBalance() {
        this.setState({
            showConfirmation: false
        }, (e) => {
            const request = {
                "DebitAccWalletId": this.state.DebitWalletId,
                "CreditAccWalletId": this.state.CreditWalletId,
                "Amount": parseFloat(this.state.Amount),
                "CurrencyName": this.state.WalletType
            }
            this.props.addAtbitrageBalance(request);
        });
    }
    render() {
        const walletListSlider = Menu(this.props.wallets, this.selectWallet);
        const { intl, walletList, loading } = this.props;
        const { errAmount, hideArrows, hideSingleArrow } = this.state;
        var columns = [
            {
                name: intl.formatMessage({ id: "wallet.walletName" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.holdingorder.label.balance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.holdingorder.label.currency" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.OutBoundBalance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.InBoundBalance" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableStatus" }),
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === 0),
                                "badge badge-success": (value === 1)
                            })} >
                                {value ? intl.formatMessage({ id: "sidebar.btnEnable" }) : intl.formatMessage({ id: "sidebar.btnDisable" })}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.Role" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "components.expiryDate" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colActions" }),
                options: { filter: false, sort: false }
            },
        ]
        const options = {
            filterType: 'dropdown',
            responsive: 'scroll',
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            filter: false,
            search: false,
            rowsPerPage: 100,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
        };
        return (
            <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto' : 'DepositWithdrawHistory tbl_overflow_auto'}>
                {loading && <JbsBarLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="WalletTypeId">{intl.formatMessage({ id: "trading.holdingorder.label.currency" })}</Label>
                            <Select
                                options={this.props.currencyList.map((wallet, key) => ({
                                    label: wallet.CoinName,
                                    value: wallet.Id,
                                }))}
                                onChange={e => this.onChangeSelectCurrency(e)}
                                value={this.state.WalletTypeObj}
                                placeholder={intl.formatMessage({ id: "widgets.search" })}
                            />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="Status">{intl.formatMessage({ id: "wallet.DWTableStatus" })}</Label>
                            <Input
                                type="select"
                                name="Status"
                                id="Status"
                                value={this.state.Status}
                                onChange={(e) => this.onChangeHander(e)}>
                                <option value="">{intl.formatMessage({ id: "wallet.selectStatus" })}</option>
                                <option value="1">{intl.formatMessage({ id: "sidebar.btnEnable" })}</option>
                                <option value="0">{intl.formatMessage({ id: "sidebar.btnDisable" })}</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                                <Button color="primary" className={"border-0 rounded-0 perverbtn" + ((this.state.Status !== '' || this.state.WalletTypeId !== '') ? "" : "disabled")} onClick={(e) => this.applyFilter(e)}>{intl.formatMessage({ id: "widgets.apply" })}</Button>
                                {this.state.showReset && <Button color="success" className="ml-15 border-0 rounded-0" onClick={(e) => this.clearFilter()}>{intl.formatMessage({ id: "button.clear" })}</Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <JbsCollapsibleCard
                    colClasses="todo-wrapper"
                    fullBlock
                    customClasses="overflow-hidden"
                >
                    <div className="col-sm-12 p-0">
                        <div className="d-flex justify-content-between">
                            <h4 className="text-muted pt-20 pl-20">
                                <span className="fw-bold"><IntlMessages id="widgets.note" /></span> : <IntlMessages id="arbitrage.WalletNote" />
                            </h4>
                            <div className="py-5">
                                <CreateArbitrageWallet {...this.props} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 p-0">
                        <MUIDataTable
                            data={walletList.map((wallet, key) => {
                                return [
                                    wallet.WalletName,
                                    parseFloat(wallet.Balance).toFixed(8),
                                    wallet.CoinName,
                                    parseFloat(wallet.OutBoundBalance).toFixed(8),
                                    parseFloat(wallet.InBoundBalance).toFixed(8),
                                    wallet.Status,
                                    wallet.RoleName,
                                    changeDateFormat(wallet.ExpiryDate, 'YYYY-MM-DD', false),
                                    <div className="list-action">
                                        {wallet.IsLeaverageAllow ? <Tooltip title={intl.formatMessage({ id: "wallet.addBalance" })} placement="bottom">
                                            <a
                                                href="javascript:void(0)"
                                                onClick={(e) => this.showModel(wallet.CoinName, wallet.AccWalletID)}
                                            >
                                                <i className="zmdi zmdi-plus-circle"></i>
                                            </a>
                                        </Tooltip> : '-'}
                                    </div>
                                ]
                            })}
                            columns={columns}
                            options={options}
                        />
                    </div>
                </JbsCollapsibleCard>
                <Modal isOpen={this.state.showModal}>
                    {(this.props.loading || this.props.walletLoading) && <JbsBarLoader />}
                    <ModalHeader toggle={this.closeModal}><IntlMessages id="wallet.addBalance" /></ModalHeader>
                    <ModalBody>
                        <Form>
                            {this.state.WalletType !== '' && <FormGroup>
                                <Label for="WalletTypeId">{intl.formatMessage({ id: "wallet.WDSelectWallet" })}</Label>
                                <ScrollMenu
                                    data={walletListSlider}
                                    hideArrows={hideArrows}
                                    hideSingleArrow={hideSingleArrow}
                                    arrowLeft={ArrowLeft}
                                    arrowRight={ArrowRight}
                                    menuClass={''}
                                />
                            </FormGroup>}
                            {this.state.DebitWalletId !== '' && <FormGroup>
                                <Label for="Amount">{intl.formatMessage({ id: "wallet.Amount" })}</Label>
                                <Input
                                    type="text"
                                    name="Amount"
                                    id="Amount"
                                    placeholder={intl.formatMessage({ id: "wallet.Amount" })}
                                    onChange={(e) => this.onChangeHandler(e)}
                                    onBlur={(e) => this.vadliateAmount(e)}
                                    value={this.state.Amount}
                                    maxLength="16"
                                    autoComplete="off" />
                                {errAmount && <span className="text-danger">
                                    <IntlMessages id={errAmount} />
                                </span>}
                            </FormGroup>}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            className={"mr-10 border-0 rounded-0 " + ((this.state.WalletType === '' || this.state.DebitWalletId === '' || this.state.CreditWalletId === '' || this.state.Amount === '') ? "disabled" : "")}
                            disabled={((this.state.WalletType === '' || this.state.DebitWalletId === '' || this.state.CreditWalletId === '' || this.state.Amount === '' || this.state.errAmount !== '') ? true : false)}
                            onClick={(e) => this.setState({ showConfirmation: true })}>{<IntlMessages id="button.add" />}</Button>
                        <Button
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            onClick={this.closeModal}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
                <Dialog
                    open={this.state.showConfirmation}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h2>{<IntlMessages id={"sidebar.confirmationMsg"} />}</h2>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={(e) => this.addBalance()}
                            color="primary"
                            className="mr-10 border-0 rounded-0 "
                            autoFocus
                        >
                            <IntlMessages id={"sidebar.btnYes"} />
                        </Button>
                        <Button
                            onClick={e => this.setState({ showConfirmation: false })}
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            autoFocus
                        >
                            <IntlMessages id={"sidebar.btnNo"} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
const mapDispatchToProps = ({ settings, ArbitrageWalletReducer, withdrawApp }) => {
    const { darkMode } = settings;
    const { wallets } = withdrawApp;
    const walletLoading = withdrawApp.loading;
    const { loading, currencyList, walletList, addBalanceConfirmation } = ArbitrageWalletReducer;
    return { darkMode, loading, currencyList, walletList, wallets, walletLoading, addBalanceConfirmation };
}

export default connect(mapDispatchToProps, {
    getArbitrageWalletList,
    getArbitrageCurrencyList,
    getWallets,
    addAtbitrageBalance
})(ListMarginWallets);