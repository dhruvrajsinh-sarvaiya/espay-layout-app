/**
 *   Developer : Parth Andhariya
 *   Date: 22-03-2019
 *   Component:  Deposition Interval
 */
import React, { Component } from "react";
import Switch from "react-toggle-switch";
import validator from "validator";
import { connect } from "react-redux";
import { FormGroup, Label, Input, Col } from "reactstrap";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//import action for Deposit Interval
import { ListDepositionInterval, AddUpdateDepositionInterval } from "Actions/DepositionInterval";
//validation file for form
import validateForm from "Validations/DepositionIntervalValidation/DepositionIntervalValidation";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//button style
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

class DepositionInterval extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            DepositHistoryFetchListInterval: "",
            DepositStatusCheckInterval: "",
            addRecord: {
                DepositHistoryFetchListInterval: "",
                DepositStatusCheckInterval: "",
                Status: 0
            },
            menudetail: [],
            notification: true,
        };
    }
    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('566F0BD3-3515-8BAE-9D50-7F4DDBB36C9C'); // get wallet menu permission
    }
    //validate reponse on status change
    componentWillReceiveProps(nextProps) {

        const intl = this.props.intl;
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        //validation for set update form
        if (nextProps.DepositionIntervalList.hasOwnProperty("ReturnCode")) {
            if (
                nextProps.DepositionIntervalList.ReturnCode === 0) {
                this.setState({
                    addRecord: {
                        DepositHistoryFetchListInterval: nextProps.DepositionIntervalList.ListDepositionInterval[0].DepositHistoryFetchListInterval,
                        DepositStatusCheckInterval: nextProps.DepositionIntervalList.ListDepositionInterval[0].DepositStatusCheckInterval,
                        Status: nextProps.DepositionIntervalList.ListDepositionInterval[0].Status
                    },
                });
            }
        }
        // validate success for addRecord
        if (nextProps.Data.hasOwnProperty("ReturnCode")) {
            if (nextProps.Data.ReturnCode === 0) {
                //success
                NotificationManager.success(intl.formatMessage({ id: "common.form.edit.success" }));
                setTimeout(function () {
                    this.setState({
                        addRecord: {
                            DepositHistoryFetchListInterval: "",
                            DepositStatusCheckInterval: "",
                            Status: 0
                        },
                        DepositHistoryFetchListInterval: "",
                        DepositStatusCheckInterval: ""
                    });
                    this.props.drawerClose();
                }.bind(this), 3000);
            } else if (nextProps.Data.ReturnCode !== 0) {
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.Data.ErrorCode}` }));
            }
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
            DepositStatusCheckInterval: "",
            DepositHistoryFetchListInterval: "",
            addRecord: {
                DepositHistoryFetchListInterval: "",
                DepositStatusCheckInterval: "",
                Status: 0
            },
        });
    };
    //handle input form
    onChangeAddText(key, value) {
        if (validator.isNumeric(value, { no_symbols: true }) || value === "") {
            this.setState({
                addRecord: {
                    ...this.state.addRecord,
                    [key]: value
                }
            });
        }
    }
    //validation for secords 
    validateForSeconds(key, value) {
        if (key === "DepositStatusCheckInterval" && (value < 300 || value > 3600)) {
            this.setState({
                DepositStatusCheckInterval: "lable.maxvalue",
            })

        } else {
            if ((key === "DepositStatusCheckInterval") && (value !== "" && value > 300 && value <= 3600)) {

                this.setState({
                    DepositStatusCheckInterval: "",
                })
            }
        }
        if (key === "DepositHistoryFetchListInterval" && (value < 300 || value > 3600)) {
            this.setState({
                DepositHistoryFetchListInterval: "lable.maxvalue",
            })

        } else {
            if ((key === "DepositHistoryFetchListInterval") && (value !== "" && value > 300 && value <= 3600)) {

                this.setState({
                    DepositHistoryFetchListInterval: "",
                })
            }
        }
    }
    //handle switch
    handleCheckChange = name => (event, checked) => {
        this.setState({ [name]: checked });
        this.setState({
            addRecord: {
                ...this.state.addRecord,
                Status: this.state.addRecord.Status === 1 ? 0 : 1
            }
        });
    };
    // submit new record for charge configuration Details
    onSubmitAddUpdateChargeConfigForm() {
        const { errors, isValid } = validateForm(this.state);
        this.setState({
            DepositStatusCheckInterval: errors.DepositStatusCheckInterval,
            DepositHistoryFetchListInterval: errors.DepositHistoryFetchListInterval
        });
        if (isValid) {
            const { addRecord } = this.state;
            this.props.AddUpdateDepositionInterval(addRecord);
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('04E867B8-9C40-A55D-913F-3F1446EE2421'); //04E867B8-9C40-A55D-913F-3F1446EE2421
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { DepositStatusCheckInterval, DepositHistoryFetchListInterval, addRecord } = this.state;
        const intl = this.props.intl;
        return (
            <div className="jbs-page-content">
                <form>
                    <div className="page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2>
                                <span>
                                    {intl.formatMessage({
                                        id: "lable.DepositionInterval"
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
                    {this.props.menuLoading && <JbsSectionLoader />}
                    {(menuPermissionDetail['190BC80D-642B-9FE9-2E8B-B610B4DA34AE'] && menuPermissionDetail['190BC80D-642B-9FE9-2E8B-B610B4DA34AE'].Visibility === "E925F86B") &&
                        <FormGroup row>
                            <Label sm={5} className='d-inline'>
                                {intl.formatMessage({ id: "lable.DepositHistoryFetchListInterval" })} <span className="text-danger">*</span>
                            </Label>
                            <Col sm={6}>
                                <Input
                                    disabled={(menuPermissionDetail['190BC80D-642B-9FE9-2E8B-B610B4DA34AE'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DepositHistoryFetchListInterval"
                                    placeholder={intl.formatMessage({ id: "lable.enter" })}
                                    className="form-control"
                                    id="DepositHistoryFetchListInterval"
                                    maxLength="4"
                                    value={addRecord.DepositHistoryFetchListInterval}
                                    onChange={e =>
                                        this.onChangeAddText("DepositHistoryFetchListInterval", e.target.value)
                                    }
                                    onBlur={e => this.validateForSeconds("DepositHistoryFetchListInterval", e.target.value)}
                                />
                                {DepositHistoryFetchListInterval && (
                                    <span className="text-danger">
                                        {intl.formatMessage({ id: DepositHistoryFetchListInterval })}
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {(menuPermissionDetail['DA44454D-7BB4-A6EF-54EB-548DDF9B34F7'] && menuPermissionDetail['DA44454D-7BB4-A6EF-54EB-548DDF9B34F7'].Visibility === "E925F86B") &&
                        <FormGroup row>
                            <Label sm={5} className='d-inline'>
                                {intl.formatMessage({ id: "lable.DepositStatusCheckInterval" })} <span className="text-danger">*</span>
                            </Label>
                            <Col sm={6}>
                                <Input
                                    disabled={(menuPermissionDetail['DA44454D-7BB4-A6EF-54EB-548DDF9B34F7'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="DepositStatusCheckInterval"
                                    placeholder={intl.formatMessage({ id: "lable.enter" })}
                                    className="form-control"
                                    id="DepositStatusCheckInterval"
                                    maxLength="4"
                                    value={addRecord.DepositStatusCheckInterval}
                                    onChange={e =>
                                        this.onChangeAddText("DepositStatusCheckInterval", e.target.value)
                                    }
                                    onBlur={e => this.validateForSeconds("DepositStatusCheckInterval", e.target.value)}
                                />
                                {DepositStatusCheckInterval && (
                                    <span className="text-danger">
                                        {intl.formatMessage({ id: DepositStatusCheckInterval })}
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {(menuPermissionDetail['CB4ADCCB-8B68-123C-8983-01F19D5B9C33'] && menuPermissionDetail['CB4ADCCB-8B68-123C-8983-01F19D5B9C33'].Visibility === "E925F86B") &&
                        <FormGroup row>
                            <Label sm={5} className='pt-0'>
                                {intl.formatMessage({
                                    id: "sidebar.Status"
                                })}
                            </Label>
                            <Col sm={6}>
                                <Switch
                                    onClick={this.handleCheckChange()}
                                    enabled={(menuPermissionDetail['CB4ADCCB-8B68-123C-8983-01F19D5B9C33'].AccessRight === "11E6E7B0") ? false : true}

                                    on={
                                        addRecord.Status === 1
                                            ? true
                                            : false
                                    }
                                />
                            </Col>
                        </FormGroup>
                    }
                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                        <div className="btn_area">
                            {/* {menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1 && */}
                            <Button
                                variant="raised"
                                className="btn-primary text-white mr-20"
                                onClick={() => this.onSubmitAddUpdateChargeConfigForm()}
                                disabled={(!this.props.loading && DepositStatusCheckInterval === "" && DepositHistoryFetchListInterval === "") ? false : true}
                            >
                                {intl.formatMessage({ id: "button.submit" })}
                            </Button>
                            {/* } */}
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
                {this.props.loading && <JbsSectionLoader />}
            </div>
        );
    }
}

//map method
const mapStateToProps = ({ DepositionIntervalReducer, authTokenRdcer }) => {
    const { DepositionIntervalList, loading, Data } = DepositionIntervalReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        DepositionIntervalList, loading, Data, menuLoading, menu_rights
    };
};
export default connect(
    mapStateToProps,
    {
        ListDepositionInterval,
        AddUpdateDepositionInterval,
        getMenuPermissionByID
    }
)(injectIntl(DepositionInterval));
