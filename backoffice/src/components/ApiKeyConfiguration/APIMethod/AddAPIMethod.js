/**
 * Create By Sanjay 
 * Created Date 20/03/2018
 * Component For Add API Method
 */

import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { NotificationManager } from "react-notifications";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from "@material-ui/core/Tooltip";

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { addApiMethod, getSystemResetMethodData, getSocketMethodData, getApiMethodData } from "Actions/RestAPIMethod";
// import for validate numbers in add data
import { validateOnlyAlphaNumeric } from "Validations/pairConfiguration";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const validateAPIMethod = require("../../../validation/APIKeyConfiguration/api_method");

class AddAPIMethod extends Component {

    state = {
        open: false,
        data: {
            MethodName: "",
            IsReadOnly: 1,
            IsFullAccess: 0,
            Status: 0,
            SocketMethods: [],
            RestMethods: []
        },
        value: "IsReadOnly",
        check: false,
        resetMethodList: [],
        socketMethodList: [],
        errors: "",
        notificationFlag: true,
        menudetail: [],
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('2520CF88-9F7B-91B7-738B-34BE0D178C2A'); // get Trading menu permission
        // this.props.getSystemResetMethodData();
        // this.props.getSocketMethodData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resetMethodListData.ReturnCode === 0 && typeof nextProps.resetMethodListData !== 'undefined') {
            this.setState({
                resetMethodList: nextProps.resetMethodListData.Response
            })
        }
        if (nextProps.socketMethodListData.ReturnCode === 0 && typeof nextProps.socketMethodListData !== 'undefined') {
            this.setState({
                socketMethodList: nextProps.socketMethodListData.Response
            })
        }
        if (nextProps.addApiMethodData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="my_account.ApimethodAdd" />);
            this.props.getApiMethodData();
            this.resetData();
        } else if (nextProps.addApiMethodData.ReturnCode === 1) {
            var errMsg = nextProps.addApiMethodData.ErrorCode === 1 ? nextProps.addApiMethodData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addApiMethodData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getSystemResetMethodData();
                this.props.getSocketMethodData();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    resetData = () => {
        this.setState({
            data: {
                MethodName: "",
                IsReadOnly: 1,
                IsFullAccess: 0,
                Status: 0,
                SocketMethods: [],
                RestMethods: []
            },
            errors: ""
        });
        this.props.drawerClose();
    }

    handleChange = name => (event) => {
        if (validateOnlyAlphaNumeric(event.target.value) || event.target.value === '') {
            let newObj = Object.assign({}, this.state.data);
            newObj[name] = event.target.value;
            if (name === "APIAccess") {
                this.setState({ value: event.target.value });
                delete newObj.APIAccess;
                if (event.target.value === "IsReadOnly") {
                    newObj["IsReadOnly"] = 1;
                    newObj["IsFullAccess"] = 0;
                } else if (event.target.value === "IsFullAccess") {
                    newObj["IsFullAccess"] = 1;
                    newObj["IsReadOnly"] = 0;
                }
            }
            if (name === "check") {
                this.setState({ [name]: event.target.checked });
                delete newObj.check;
                if (event.target.checked === true) {
                    newObj["Status"] = 1;
                } else {
                    newObj["Status"] = 0;
                }
            }
            if (name === "SocketMethods") {
                var socketOptions = event.target.options;
                var socketValue = [];
                for (var i = 0, l = socketOptions.length; i < l; i++) {
                    if (socketOptions[i].selected) {
                        socketValue.push(parseInt(socketOptions[i].value, 10));
                    }
                }
                newObj["SocketMethods"] = socketValue;
            }
            if (name === "RestMethods") {
                var resetOptions = event.target.options;
                var resetValue = [];
                for (var j = 0, k = resetOptions.length; j < k; j++) {
                    if (resetOptions[j].selected) {
                        resetValue.push(parseInt(resetOptions[j].value, 10));
                    }
                }
                newObj["RestMethods"] = resetValue;
            }
            this.setState({ data: newObj });
        }
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    OnAddApiMethod = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateAPIMethod(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.addApiMethod(this.state.data);
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
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('86D74833-2E62-4DC9-1F19-E7432C8F1831');//86D74833-2E62-4DC9-1F19-E7432C8F1831
        const { drawerClose, loading_methods } = this.props;
        const { errors, resetMethodList, socketMethodList } = this.state;
        const { MethodName, SocketMethods, RestMethods } = this.state.data;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.addApiMethod" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading_methods || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {((menuDetail["31D32E60-7C3E-215B-35C9-18347F336BA1"]) && (menuDetail["31D32E60-7C3E-215B-35C9-18347F336BA1"].Visibility === "E925F86B")) && //31D32E60-7C3E-215B-35C9-18347F336BA1
                            <FormGroup row>
                                <Label for="MethodName" className="control-label col-md-4 col-sm-3 col-xs-12"><IntlMessages id="my_account.MethodName" /></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MethodName">
                                        {(placeholder) =>
                                            <Input type="text" disabled={(menuDetail["31D32E60-7C3E-215B-35C9-18347F336BA1"].AccessRight === "11E6E7B0") ? true : false} name="MethodName" value={MethodName} placeholder={placeholder} id="MethodName" onChange={this.handleChange("MethodName")} />
                                        }
                                    </IntlMessages>
                                    {errors.MethodName && (<span className="text-danger text-left"><IntlMessages id={errors.MethodName} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["3EBF2F47-14E9-2286-0663-71E0691BA727"]) && (menuDetail["3EBF2F47-14E9-2286-0663-71E0691BA727"].Visibility === "E925F86B")) && //3EBF2F47-14E9-2286-0663-71E0691BA727
                            <FormGroup row>
                                <Label className="control-label col-md-4 col-sm-3 col-xs-12">APIAccess</Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <RadioGroup
                                        aria-label="APIAccess"
                                        name="APIAccess"
                                        value={this.state.value}
                                        row
                                        disabled={(menuDetail["3EBF2F47-14E9-2286-0663-71E0691BA727"].AccessRight === "11E6E7B0") ? true : false}
                                        onChange={this.handleChange("APIAccess")}
                                    >
                                        <FormControlLabel value="IsReadOnly" control={<Radio color="primary" />} label="IsReadOnly" />
                                        <FormControlLabel value="IsFullAccess" control={<Radio color="primary" />} label="IsFullAccess" />
                                    </RadioGroup>
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["8FF4739E-6775-06B5-7D2D-2F8890F62B46"]) && (menuDetail["8FF4739E-6775-06B5-7D2D-2F8890F62B46"].Visibility === "E925F86B")) && //8FF4739E-6775-06B5-7D2D-2F8890F62B46
                            <FormGroup row>
                                <Label for="Status" className="control-label col-md-4 col-sm-3 col-xs-12"><IntlMessages id="my_account.Status" /></Label>
                                <Switch
                                    checked={this.state.check}
                                    enabled={(menuDetail["8FF4739E-6775-06B5-7D2D-2F8890F62B46"].AccessRight === "11E6E7B0") ? false : true}
                                    onChange={this.handleChange('check')}
                                    value="check"
                                    color="primary"
                                />
                            </FormGroup>
                        }
                        {((menuDetail["145D38DB-4147-14E1-9486-6971B2570502"]) && (menuDetail["145D38DB-4147-14E1-9486-6971B2570502"].Visibility === "E925F86B")) && //145D38DB-4147-14E1-9486-6971B2570502
                            <FormGroup row>
                                <Label for="SocketMethods" className="control-label col">
                                    {<IntlMessages id="my_account.SocketMethods" />}
                                    {"  "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.readonly" />}
                                        disableFocusListener
                                        disableTouchListener
                                    >
                                        <a href="javascript:void(0)">
                                            <i className="fa fa-info-circle" />
                                        </a>
                                    </Tooltip>
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                    disabled={(menuDetail["145D38DB-4147-14E1-9486-6971B2570502"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                        name="SocketMethods"
                                        multiple="multiple"
                                        value={SocketMethods}
                                        onChange={this.handleChange("SocketMethods")}
                                    >
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {socketMethodList && socketMethodList.map((item, key) =>
                                            <option key={key} value={item.ID}>{item.MethodName}</option>
                                        )}
                                    </Input>
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["D3198A43-2FF5-63F7-52CF-787D358712D6"]) && (menuDetail["D3198A43-2FF5-63F7-52CF-787D358712D6"].Visibility === "E925F86B")) && //D3198A43-2FF5-63F7-52CF-787D358712D6
                            <FormGroup row>
                                <Label for="RestMethods" className="control-label col">
                                    <IntlMessages id="my_account.RestMethods" />
                                    {"  "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.readonly" />}
                                        disableFocusListener
                                        disableTouchListener
                                    >
                                        <a href="javascript:void(0)">
                                            <i className="fa fa-info-circle" />
                                        </a>
                                    </Tooltip>
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                    disabled={(menuDetail["D3198A43-2FF5-63F7-52CF-787D358712D6"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                        name="RestMethods"
                                        multiple="multiple"
                                        value={RestMethods}
                                        onChange={this.handleChange("RestMethods")}
                                    >
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        {resetMethodList && resetMethodList.map((item, key) =>
                                            <option key={key} value={item.ID}>{item.MethodName}</option>
                                        )}
                                    </Input>
                                </div>
                            </FormGroup>
                        }{menuDetail &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={loading_methods} color="primary" className="btn-primary text-white" onClick={this.OnAddApiMethod}><IntlMessages id="button.add" /></Button>
                                        <Button className="btn-danger text-white ml-15" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>
                        }
                    </Form>
                </div>
            </div>
        )
    }
}

const mapToProps = ({ RestAPIMethodReducer, authTokenRdcer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { addApiMethodData, resetMethodListData, socketMethodListData, loading_methods } = RestAPIMethodReducer;
    return { addApiMethodData, resetMethodListData, socketMethodListData, loading_methods, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    addApiMethod,
    getSystemResetMethodData,
    getSocketMethodData,
    getApiMethodData,
    getMenuPermissionByID
})(AddAPIMethod);
