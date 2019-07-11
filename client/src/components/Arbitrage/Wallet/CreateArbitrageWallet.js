/* 
    Developer : Vishva shah
    Date : 05-06-2019
    File Comment : create arbitrage wallet
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from 'Util/IntlMessages';
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'react-notifications';

//added by Tejas 14/6/2019
import JbsLoader from "Components/JbsPageLoader/JbsLoader"

import Select from "react-select";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Button,
} from 'reactstrap';
import {
    createArbitrageWallet,
    getArbitrageCurrencyList,
    getArbitrageWalletList
} from "Actions/Arbitrage";

class CreateArbitrageWallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showConfirmModal: false,
            WalletTypeObj: null,
            WalletTypeId: '',
            flag: false,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.createWalletResponse.hasOwnProperty('ReturnCode') && this.state.flag) {
            this.setState({ flag: false });
            if (nextProps.createWalletResponse.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={`sidebar.createWalletSuccess`} />);
                this.props.getArbitrageWalletList({});
                this.setState({
                    showModal: false,
                    showConfirmModal: false,
                    WalletTypeObj: null,
                    WalletTypeId: '',
                });
            } else if (nextProps.createWalletResponse.ReturnCode === 1) {
                NotificationManager.error(<IntlMessages id={`apiErrCode.${nextProps.createWalletResponse.ErrorCode}`} />);
                this.setState({
                    showModal: true,
                    showConfirmModal: true,
                });
            }
        }
    }
    /**
     * Toggle Modal
     */
    toggleShowModal = () => {
        if (!this.state.showModal) {
            this.props.currencyList.map((wallet, key) => {
                this.onChangeSelectCurrency({
                    label: wallet.CoinName,
                    value: wallet.CoinName,
                });
            });
        }
        this.setState({
            showModal: !this.state.showModal,
            WalletTypeObj: null,
            WalletTypeId: '',
            flag: false,
        });
    }
    /**
     * Handle create wallet 
     */
    createWallet = () => {
        if (this.state.WalletTypeId !== '') {
            this.setState({ flag: true });
            this.props.createArbitrageWallet({ CoinName: this.state.WalletTypeId });
        }
    }
    /* on chane handler select search */
    onChangeSelectCurrency(e) {
        this.setState({ WalletTypeId: e.value, WalletTypeObj: { label: e.label }, });
    }
    render() {
        const { showModal } = this.state;
        const intl = this.props.intl;
        return (
            <Fragment>
                <Button
                    // color="primary"
                    className="mr-10 border-0 rounded-0 mt-10 perverbtn"
                    style={{ float: "right" }}
                    onClick={this.toggleShowModal}
                >
                    <IntlMessages id="wallet.createWallet" />
                </Button>

                {/* end */}
                <Modal isOpen={showModal}>
                    {(this.props.loadingCreate || this.props.walletLoading) && <JbsLoader />}
                    <ModalHeader toggle={this.toggleShowModal}><IntlMessages id="wallet.createarbitrageWallet" /></ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="WalletTypeId">{intl.formatMessage({ id: "trading.holdingorder.label.currency" })}</Label>
                                <Select
                                    options={this.props.currencyList.map((wallet, key) => ({
                                        label: wallet.CoinName,
                                        value: wallet.CoinName,
                                    }))}
                                    onChange={e => this.onChangeSelectCurrency(e)}
                                    value={this.state.WalletTypeObj}
                                    placeholder={intl.formatMessage({ id: "widgets.search" })}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            // color="primary"
                            className={"mr-10 border-0 rounded-0 perverbtn " + ((this.state.WalletTypeId === '') ? "disabled" : "")}
                            onClick={this.createWallet}><IntlMessages id="wallet.btnCreate" /></Button>{' '}
                        <Button
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            onClick={this.toggleShowModal}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ ArbitrageWalletReducer, withdrawApp }) => {
    const walletLoading = withdrawApp.loading;
    const { loadingCreate, addLeverageResponse, confirmResponse, currencyList, createWalletResponse } = ArbitrageWalletReducer;
    return { loadingCreate, walletLoading, addLeverageResponse, confirmResponse, currencyList, createWalletResponse };
};

export default connect(mapStateToProps, {
    getArbitrageCurrencyList,
    getArbitrageWalletList,
    createArbitrageWallet
})(injectIntl(CreateArbitrageWallet));