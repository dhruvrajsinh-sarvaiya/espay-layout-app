/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : create a margin wallet request
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from 'Util/IntlMessages';
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Select from "react-select";
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
} from 'reactstrap';
import {
    getCurrency,
} from "Actions/Withdraw";
import {
    createMarginWallet,
    getMaringWalletList,
    getMarginCurrency
} from "Actions/MarginTrading";



class CreateWallet extends Component {
    state = {
        createWalletModal: false, // modal
        WalletTypeObj: null,
        WalletTypeId: '',
    }

    componentWillMount() {
        // this.props.getCurrency();
        this.props.getMarginCurrency({});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.createWalletResponse.hasOwnProperty('ReturnCode')) {
            if (nextProps.createWalletResponse.ReturnCode === 0) {
                NotificationManager.success(nextProps.createWalletResponse.ReturnMsg);
                setTimeout(function () {
                    this.setState({
                        createWalletModal: false
                    });
                    //refresh balance
                    this.props.getMaringWalletList({});
                }.bind(this), 3000);
            } else if (nextProps.createWalletResponse.ReturnCode === 1) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.createWalletResponse.ErrorCode}`} />);
            }
        }
    }

    /**
     * Toggle Modal
     */
    toggleCreateWalletModal = () => {
        this.setState({
            createWalletModal: !this.state.createWalletModal,
            WalletTypeObj: null,
            WalletTypeId: '',
        });
    }

    /**
     * Handle create wallet 
     */
    createWallet = () => {
        const { WalletTypeId } = this.state;
        if (WalletTypeId !== '') {
            this.props.createMarginWallet(WalletTypeId);
        }
    }

    /* on chane handler */
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    /* on chane handler select search */
    onChangeSelectCurrency(e) {
        this.setState({ WalletTypeId: e.value, WalletTypeObj: { label: e.label } });
    }
    render() {
        const { createWalletModal } = this.state;
        const intl = this.props.intl;
        return (
            <Fragment>
                <Button
                    color="primary"
                    className="mr-10 border-0 rounded-0 mt-5"
                    style={{ float: "right" }}
                    onClick={this.toggleCreateWalletModal}
                >
                    <IntlMessages id="wallet.createWallet" />
                </Button>
                <Modal isOpen={createWalletModal} toggle={this.toggleCreateWalletModal}>
                    {this.props.loading && <JbsSectionLoader />}
                    <ModalHeader toggle={this.toggleCreateWalletModal}><IntlMessages id="wallet.createWalletTitle" /></ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="WalletTypeId">{intl.formatMessage({ id: "trading.holdingorder.label.currency" })}</Label>
                                <Select
                                    options={this.props.currencies.map((wallet, key) => ({
                                        label: wallet.SMSCode,
                                        value: wallet.WalletTypeID,
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
                            color="primary"
                            className={"mr-10 border-0 rounded-0 " + ((this.state.WalletTypeId === '') ? "disabled" : "")}
                            onClick={this.createWallet}><IntlMessages id="wallet.btnCreate" /></Button>{' '}
                        <Button
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            onClick={this.toggleCreateWalletModal}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ WalletManagementReducer, withdrawApp, settings }) => {
    const { currencies } = withdrawApp;
    const { loading, createWalletResponse, marginCurrancy } = WalletManagementReducer;
    return { currencies, settings, loading, createWalletResponse, marginCurrancy };
};

export default connect(mapStateToProps, {
    getCurrency,
    createMarginWallet,
    getMaringWalletList,
    getMarginCurrency
})(CreateWallet);
