/* 
    Developer : Nishant Vadgama
    Date : 28-01-2019
    File Comment : Export wallets 
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import IntlMessages from "Util/IntlMessages";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";
import { FormGroup, Label, Input, FormText, Alert } from "reactstrap";
import Tooltip from '@material-ui/core/Tooltip';
import { exportWallets } from "Actions/Wallet";
import { injectIntl } from 'react-intl';
import validator from "validator";
const initState = {
    fileName: "",
    currency: "",
    showDialog: false,
    showError: false,
    showSuccess: false,
    responseMessage: "",
    errFile: false,
    errCurrency: false,
}

class ExportWallets extends Component {
    state = initState;
    handleClose() {
        this.setState(initState);
    }
    //will receive check response
    componentWillReceiveProps(nextProps) {
        if (nextProps.exportResponse.hasOwnProperty('ReturnCode')) {
            if (nextProps.exportResponse.ReturnCode === 0) {    //success
                this.setState({ responseMessage: nextProps.exportResponse.ReturnMsg, showSuccess: true });
                setTimeout(() => {
                    this.setState(initState);
                }, 3000);
            } else if (nextProps.exportResponse.ReturnCode === 1) { //failure
                this.setState({
                    responseMessage: intl.formatMessage({ id: "apiErrCode." + nextProps.exportResponse.ReturnMsg }),
                    showError: true
                });
            }
        }
    }
    //export wallet
    exportWallets = () => {
        if (this.state.fileName === '') {
            this.setState({ errFile: true });
        } else if (this.state.currency === '') {
            this.setState({ errCurrency: true });
        } else if (this.state.fileName !== '' && this.state.currency !== '') {
            this.props.exportWallets({
                FileName: this.state.fileName,
                Coin: this.state.currency
            });
        }
    }
    /* onchangeHndler */
    onChangeHandler(e) {
        if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {
            this.setState({ fileName: e.target.value });
        }
    }
    render() {
        const intl = this.props.intl;
        return (
            <React.Fragment>
                <Tooltip title={<IntlMessages id="wallet.lblExportWallet" />} placement="bottom">
                    <IconButton
                        className=""
                        aria-label="Import"
                        onClick={() => this.setState({ showDialog: true })}
                    >
                        <i className="zmdi zmdi-download" />
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={this.state.showDialog}
                    aria-labelledby="form-dialog-title"
                    style={{ zIndex: "99999" }}
                >
                    <DialogTitle id="form-dialog-title">
                        <IntlMessages id="wallet.lblExportWallet" />
                    </DialogTitle>
                    <DialogContent id="form-dialog-title">
                        <FormGroup className="">
                            <Label for="fileName"><IntlMessages id="wallet.lblFileName" /></Label>
                            <Input
                                type="text"
                                name="fileName"
                                id="fileName"
                                placeholder={intl.formatMessage({ id: "wallet.lblFileName" })}
                                className={this.state.errCurrency ? "is-invalid" : ""}
                                onChange={e => this.onChangeHandler(e)}
                                value={this.state.fileName}
                                maxLength="20"
                            />
                            <FormText color="muted">
                                <IntlMessages id="wallet.exportWalletHint" />
                            </FormText>
                        </FormGroup>
                        <FormGroup className="">
                            <Label for="currency"><IntlMessages id="table.currency" /></Label>
                            <Input
                                type="select"
                                name="currency"
                                id="currency"
                                className={this.state.errCurrency ? "is-invalid" : ""}
                                value={this.state.currency}
                                onChange={e => this.setState({ currency: e.target.value })} >
                                <option value="">{intl.formatMessage({ id: "tradingLedger.filterLabel.currency" })}</option>
                                {this.props.walletType.length &&
                                    this.props.walletType.map((type, index) => (
                                        <option key={index} value={type.TypeName}>{type.TypeName}</option>
                                    ))}
                            </Input>
                        </FormGroup>
                        <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                            {this.state.responseMessage}
                        </Alert>
                        <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                            {this.state.responseMessage}
                        </Alert>
                    </DialogContent>
                    {this.props.loading && <JbsPageLoader />}
                    {!this.props.loading && (
                        <DialogActions className="justify-content-center">
                            <MatButton
                                variant="raised"
                                size="small"
                                disabled={this.state.fileName === '' || this.state.currency === ''}
                                onClick={e => this.exportWallets()}
                                color="primary"
                                className="btn-sm text-white"
                            >
                                <IntlMessages id="wallet.lblExport" />
                            </MatButton>
                            <MatButton
                                variant="raised"
                                size="small"
                                onClick={() => this.handleClose()}
                                className="btn-danger btn-sm text-white"
                            >
                                <IntlMessages id="button.cancel" />
                            </MatButton>
                        </DialogActions>
                    )}
                </Dialog>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = ({ walletReducer }) => {
    const { exportResponse, loading } = walletReducer;
    return { exportResponse, loading };
};

export default connect(mapDispatchToProps, {
    exportWallets
})(injectIntl(ExportWallets));
