/**
 *   Developer : Parth Andhariya
 *   Date: 11-06-2019
 *   Component:  Conflict Recon Form
 */
import React, { Component } from "react";
import validator from "validator";
import { connect } from "react-redux";
import { FormGroup, Label, Input, Col, Form } from "reactstrap";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import validateForm from "Validations/Arbitrage/ConflictRecon/ConflictReconValidation";
import Tooltip from '@material-ui/core/Tooltip';
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import { verify2fa } from "Actions/Deposit";
import classnames from "classnames";
import Slide from '@material-ui/core/Slide';
import { ListConflictHistory, ConflictReconRequest } from 'Actions/Arbitrage/ConflictHistory';
import { getMenuPermissionByID } from 'Actions/MyAccount';
//button style
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class ConflictRecon extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            ProviderBalance: "",
            remarks: "",
            menudetail: [],
            notification: true,
            errors: {},
            responseFlag: false,
            handle2faflag: false,
            code: "",
        };
    }
    //validate reponse on status change
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode == 0 && this.state.handle2faflag) {
            this.props.ConflictReconRequest({
                ProviderBalance: this.state.ProviderBalance,
                remarks: this.state.remarks,
            });
            this.setState({ code: "", showDialog: false, handle2faflag: false, responseFlag: true });
        }
        //handle add response
        if (nextProps.ConflictRecons !== "") {
            if (nextProps.ConflictRecons.ReturnCode === 0 && this.state.responseFlag) {
                this.props.ListConflictHistory({})
                NotificationManager.success(<IntlMessages id={`apiArbitrageErrCode.${nextProps.ConflictRecons.ErrorCode}`} />);
                this.handleCancel();
                this.setState({ responseFlag: false })
            } else if (nextProps.ConflictRecons.ReturnCode !== 0 && this.state.responseFlag) {
                NotificationManager.error(<IntlMessages id={`apiArbitrageErrCode.${nextProps.ConflictRecons.ErrorCode}`} />);
                this.setState({ responseFlag: false })
            }
        }
    }
    /* handle confirmation of 2fa */
    handleConfirmation() {
        if (this.state.code !== '') {
            this.props.verify2fa({
                'Code': this.state.code,
            });
        }
    }
    //drawer close
    closeAll = () => {
        this.props.closeAll();
    };
    //handle cancel button
    handleCancel = () => {
        this.props.drawerClose();
        this.setState({
            ProviderBalance: "",
            remarks: "",
            errors: {},
            responseFlag: false
        });
    };
    //handle input form
    onChange(key, value) {
        if (key == 'ProviderBalance') {
            if (validator.isDecimal(value, { no_symbols: true, decimal_digits: '0,8' }) || (validator.isNumeric(value, { no_symbols: true })) || value === "") {
                this.setState({
                    [key]: value
                });
            }
        } else {
            this.setState({
                [key]: value
            });
        }
    }


    // submit new record for charge configuration Details
    onSubmitForm() {
        const { errors, isValid } = validateForm(this.state);
        this.setState({
            errors: errors
        });
        if (isValid) {
            this.setState({ showDialog: true, handle2faflag: true });
        }
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID.toUpperCase()] = item;
                        });
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }
    render() {
        const intl = this.props.intl;
        const { ProviderBalance, remarks, errors } = this.state;
        return (
            <div className="jbs-page-content">
                <form>
                    <div className="page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2>
                                <span>
                                    {intl.formatMessage({
                                        id: "lable.ConflictRecon"
                                    })}
                                </span>
                            </h2>

                        </div>
                        <div className="page-title-wrap drawer_btn mb-10 text-right">
                            <Button
                                className="btn-warning text-white mr-10 mb-10"
                                style={buttonSizeSmall}
                                variant="fab"
                                mini
                                onClick={this.handleCancel}
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
                    <FormGroup row>
                        <Label sm={5} className='d-inline'>
                            {intl.formatMessage({ id: "table.ProviderBalance" })} <span className="text-danger">*</span>
                            <Tooltip title={<IntlMessages id="lable.exactAmount" />}
                                disableFocusListener
                                disableTouchListener
                            >
                                <a href="javascript:void(0)"
                                    className="ml-10"
                                >
                                    <i className="fa fa-info-circle" />
                                </a>
                            </Tooltip>
                        </Label>
                        <Col sm={6}>
                            <Input
                                type="text"
                                name="ProviderBalance"
                                placeholder={intl.formatMessage({ id: "lable.enter" })}
                                className="form-control"
                                id="ProviderBalance"
                                maxLength="12"
                                value={ProviderBalance}
                                onChange={e =>
                                    this.onChange("ProviderBalance", e.target.value)
                                }
                            />
                            {errors.ProviderBalance && (
                                <span className="text-danger">
                                    {intl.formatMessage({ id: errors.ProviderBalance })}
                                </span>
                            )}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={5} className='d-inline'>
                            {intl.formatMessage({ id: "sidebar.remark" })} <span className="text-danger">*</span>
                        </Label>
                        <Col sm={6}>
                            <Input
                                type="textarea"
                                name="remarks"
                                placeholder={intl.formatMessage({ id: "lable.enter" })}
                                className="form-control"
                                id="remarks"
                                value={remarks}
                                onChange={e =>
                                    this.onChange("remarks", e.target.value)
                                }
                            />
                            {errors.remarks && (
                                <span className="text-danger">
                                    {intl.formatMessage({ id: errors.remarks })}
                                </span>
                            )}
                        </Col>
                    </FormGroup>
                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                        <div className="btn_area">
                            <Button
                                variant="raised"
                                className="btn-primary text-white mr-20"
                                onClick={() => this.onSubmitForm()}
                            >
                                {intl.formatMessage({ id: "lable.Recon" })}
                            </Button>
                            <Button
                                variant="raised"
                                className="btn-danger text-white"
                                onClick={this.handleCancel}
                                disabled={this.props.loading}
                            >
                                {intl.formatMessage({ id: "button.cancel" })}
                            </Button>
                        </div>
                    </div>
                </form>
                <Dialog
                    open={this.state.showDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        <div className="list-action justify-content-between d-flex">
                            <IntlMessages id="myAccount.Dashboard.2faAuthentication" />
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.props.response2fa.loading && <JbsSectionLoader />}
                            <Form onSubmit={(e) => { e.preventDefault() }}>
                                <FormGroup className="mb-0">
                                    <Label for="Code"><IntlMessages id="my_account.googleAuthCode" /></Label>
                                    <Input type="text" name="Code" id="Code" maxLength="6" autoComplete="off" value={this.state.code} onChange={(e) => (this.setState({ code: e.target.value }))} placeholder={intl.formatMessage({ id: "wallet.2FAPlaceholder" })} />
                                    {this.props.error2fa.hasOwnProperty("ErrorCode") && <span className="text-danger"><IntlMessages id={`apiErrCode.${this.props.error2fa.ErrorCode}`} /></span>}
                                </FormGroup>
                                <div className="mt-20 justify-content-between d-flex">
                                    <Button type="button" variant="raised" onClick={(e) => this.setState({ code: "", showDialog: false })} className={classnames("btn-danger text-white")} > <IntlMessages id="button.cancel" /></Button>
                                    <Button type="submit" variant="raised" onClick={(e) => this.handleConfirmation()} className={classnames("btn-success text-white", { "disabled": !this.state.code })} disabled={!this.state.code ? true : false}> <IntlMessages id="sidebar.apiConfAddGen.button.confirm" /></Button>
                                </div>
                            </Form>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

//map method
const mapStateToProps = ({ authTokenRdcer, ConflictHistoryReducer, dipositReportReducer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, ConflictRecons } = ConflictHistoryReducer;
    const { reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    return {
        menuLoading, menu_rights, loading, reconResponse, response2fa, errors, error2fa, ConflictRecons
    };
};
export default connect(
    mapStateToProps,
    {
        getMenuPermissionByID,
        verify2fa,
        ConflictReconRequest,
        ListConflictHistory,
    }
)(injectIntl(ConflictRecon));
