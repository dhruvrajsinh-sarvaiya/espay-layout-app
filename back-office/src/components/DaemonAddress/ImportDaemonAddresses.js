/* 
    Developer : Nishant Vadgama
    Date : 19-09-2018
    File Comment : Admin Daemon Address List
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// jbs page loader
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";
import { FormGroup, Input, FormText, Alert } from "reactstrap";
import Tooltip from '@material-ui/core/Tooltip';
import { importAddresses } from "Actions/DaemonAddresses";
const initState = {
    showDialog: false,
    showLoading: false,
    file: "",
    importData: [],
    showError: false,
    showSuccess: false,
    responseMessage: "",
}

class ImportDaemonAddresses extends Component {
    state = initState;
    // handle show dialog on import button click
    onImportAddress() {
        this.setState({ showDialog: true });
    }
    handleClose() {
        this.setState({ showDialog: false, showError: false });
    }
    onChangeFile(event) {
        this.setState({
            file: event.target.files[0]
        });
    }
    importFile() {
        this.props.importAddresses({
            File: this.state.file
        });
    }
    //will receive props 
    componentWillReceiveProps(nextProps) {
        if (nextProps.response.hasOwnProperty('ReturnCode')) {
            if (nextProps.response.ReturnCode === 0) {// success
                this.setState({ responseMessage: nextProps.response.ReturnMsg, showSuccess: true });
                setTimeout(() => {
                    this.setState(initState);
                }, 3000);
            } else if (nextProps.response.ReturnCode === 1) { // failed
                this.setState({ responseMessage: nextProps.response.ReturnMsg, showError: true });
            }
        }
    }
    render() {
        return (
            <React.Fragment>
                <Tooltip title={<IntlMessages id="wallet.btnImportAddress" />} placement="bottom">
                    <IconButton
                        className=""
                        aria-label="Import"
                        onClick={() => this.onImportAddress()}
                    >
                        <i className="zmdi zmdi-upload" />
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={this.state.showDialog}
                    aria-labelledby="form-dialog-title"
                    style={{ zIndex: "99999" }}
                >
                    <DialogTitle id="form-dialog-title">
                        <IntlMessages id="wallet.btnImportAddress" />
                    </DialogTitle>
                    <DialogContent>
                        <FormGroup className="mb-0">
                            <Input
                                type="file"
                                name="file"
                                id="File"
                                accept=".xlsx, .xls, .csv"
                                onChange={e => this.onChangeFile(e)}
                            />
                            <FormText color="muted">
                                <IntlMessages id="wallet.importAddressHint1" />
                                &nbsp;<a href="javascript:void(0)"><strong><IntlMessages id="button.link" /></strong></a>&nbsp;
                                <IntlMessages id="wallet.importAddressHint2" />
                            </FormText>
                        </FormGroup>
                        <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                            {this.state.responseMessage}
                        </Alert>
                        <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                            {this.state.responseMessage}
                        </Alert>
                    </DialogContent>
                    {this.state.showLoading && <JbsPageLoader />}
                    {this.props.loading && <JbsPageLoader />}
                    {!this.props.loading && (
                        <DialogActions className="justify-content-center">
                            <MatButton
                                variant="raised"
                                size="small"
                                disabled={this.state.showError}
                                onClick={e => this.importFile(e)}
                                className="btn-success btn-sm text-white"
                            >
                                <IntlMessages id="wallet.lblImport" />
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

const mapDispatchToProps = ({ daemonAddressReducer }) => {
    const { response, loading } = daemonAddressReducer;
    return { response, loading };
};

export default connect(mapDispatchToProps, {
    importAddresses
})(ImportDaemonAddresses);
