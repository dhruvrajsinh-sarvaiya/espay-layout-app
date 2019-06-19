/* 
    Developer : Nishant Vadgama
    Date : 21-01-2019
    File Comment : Admin Daemon Address export
*/
import React,{ Component } from "react";
import { connect } from "react-redux";
import MatButton from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import IntlMessages from "Util/IntlMessages";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";
import Tooltip from '@material-ui/core/Tooltip';
import { exportAddresses } from "Actions/DaemonAddresses";

class ExportDaemonAddresses extends Component {
    state = {
        showDialog: false,
        dialogContent: "",
        notificationFlag: false,
    };
    handleClose() {
        this.setState({
            showDialog: false,
            dialogContent: "",
            notificationFlag: false,
        });
    }
    //will receive check response
    componentWillReceiveProps(nextProps) {
        if (nextProps.exportResponse.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.exportResponse.ReturnCode === 0) {    //success
                this.setState({
                    showDialog: true,
                    notificationFlag: false,
                    dialogContent: <IntlMessages id="wallet.exportAddressSuccess" />
                });
            } else if (nextProps.exportResponse.ReturnCode === 1) { //failure
                this.setState({
                    showDialog: true,
                    notificationFlag: false,
                    dialogContent: nextProps.exportResponse.ReturnMsg
                });
            }
        }
    }
    /* export address */
    onExportAddress() {
        this.setState({
            notificationFlag: true
        }, () => this.props.exportAddresses());
    }
    render() {
        return (
            <React.Fragment>
                <Tooltip title={<IntlMessages id="wallet.btnExportAddress" />} placement="bottom">
                    <IconButton
                        className=""
                        aria-label="Import"
                        onClick={() => this.onExportAddress()}
                    >
                        <i className="zmdi zmdi-download" />
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={this.state.showDialog}
                    aria-labelledby="form-dialog-title"
                    style={{ zIndex: "99999" }}
                >
                    <DialogContent id="form-dialog-title">
                        {this.state.dialogContent}
                    </DialogContent>
                    {this.props.loading && <JbsPageLoader />}
                    {!this.props.loading && (
                        <DialogActions className="justify-content-center">
                            <MatButton
                                variant="raised"
                                size="small"
                                onClick={() => this.handleClose()}
                                className="btn-info btn-sm text-white"
                            >
                                <IntlMessages id="wallet.btnOK" />
                            </MatButton>
                        </DialogActions>
                    )}
                </Dialog>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = ({ daemonAddressReducer }) => {
    const { exportResponse, loading } = daemonAddressReducer;
    return { exportResponse, loading };
};

export default connect(mapDispatchToProps, {
    exportAddresses
})(ExportDaemonAddresses);
