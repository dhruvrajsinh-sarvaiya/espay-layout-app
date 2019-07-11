/**
 * Create By Sanjay
 * Created Date 20/03/2019
 * Component For Update API Method
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
import { updateApiMethod, getSystemResetMethodData, getSocketMethodData, getApiMethodData } from "Actions/RestAPIMethod";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const validateAPIMethod = require("../../../validation/APIKeyConfiguration/api_method");

class UpdateAPIMethod extends Component {

    state = {
        open: false,
        data: {},
        value: "",
        check: null,
        resetMethodList: [],
        socketMethodList: [],
        errors: "",
        isUpdate: false,
        notificationFlag: true,
        menudetail: [],
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('2520CF88-9F7B-91B7-738B-34BE0D178C2A'); // get Trading menu permission
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    resetData = () => {
        this.setState({
            data: {},
            errors: "",
            isUpdate: false
        });
        this.props.drawerClose();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resetMethodListData !== undefined && nextProps.resetMethodListData.ReturnCode === 0) {
            this.setState({
                resetMethodList: nextProps.resetMethodListData.Response
            })
        }
        if (nextProps.socketMethodListData !== undefined && nextProps.socketMethodListData.ReturnCode === 0) {
            this.setState({
                socketMethodList: nextProps.socketMethodListData.Response
            })
        }
        if (nextProps.updateApiMethodData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="my_account.ApiMethodEdit" />);
            this.props.drawerClose();
            this.props.getApiMethodData();
            this.setState({ isUpdate: false })
        } else if (nextProps.updateApiMethodData.ReturnCode === 1) {
            var errMsg = nextProps.updateApiMethodData.ErrorCode === 1 ? nextProps.updateApiMethodData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.updateApiMethodData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ isUpdate: false })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getSystemResetMethodData();
                this.props.getSocketMethodData();
                var newObj = Object.assign({}, this.props.selectedData);
                newObj["SocketMethods"] = this.props.selectedData.SocketMethods ? Object.keys(this.props.selectedData.SocketMethods) : []
                newObj["RestMethods"] = this.props.selectedData.RestMethods ? Object.keys(this.props.selectedData.RestMethods) : []
                this.setState({ data: newObj })
                if (this.props.selectedData.IsFullAccess === 1) {
                    this.setState({ value: "IsFullAccess" })
                } else {
                    this.setState({ value: "IsReadOnly" })
                }
                if (this.props.selectedData.Status === 1) {
                    this.setState({ check: true })
                } else {
                    this.setState({ check: false })
                }
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    handleChange = name => (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[name] = event.target.value;
        if (name === "APIAccess") {
            this.setState({ value: event.target.value, isUpdate: true });
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
            this.setState({ [name]: event.target.checked, isUpdate: true });
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
        this.setState({ data: newObj, isUpdate: true });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            isUpdate: false
        });
    }

    OnUpdateApiMethod = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateAPIMethod(this.state.data);
        this.setState({ errors: errors });
        if (isValid && this.state.isUpdate) {
            this.props.updateApiMethod(this.state.data);
        } else {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
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
        var menuDetail = this.checkAndGetMenuAccessDetail('A19D0B33-48CE-9771-18BC-D7CD43ED3173');//A19D0B33-48CE-9771-18BC-D7CD43ED3173
        const { drawerClose, loading_methods } = this.props;
        const { errors, resetMethodList, socketMethodList } = this.state;
        const { MethodName, SocketMethods, RestMethods } = this.state.data;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.updateApiMethod" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading_methods || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {((menuDetail["92B8C37F-41E3-3169-A572-AA0DFDBC68C5"]) && (menuDetail["92B8C37F-41E3-3169-A572-AA0DFDBC68C5"].Visibility === "E925F86B")) && //92B8C37F-41E3-3169-A572-AA0DFDBC68C5
                            <FormGroup row>
                                <Label for="MethodName" className="control-label col-md-4 col-sm-3 col-xs-12"><IntlMessages id="my_account.MethodName" /></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.MethodName">
                                        {(placeholder) =>
                                            <Input type="text" disabled={(menuDetail["92B8C37F-41E3-3169-A572-AA0DFDBC68C5"].AccessRight === "11E6E7B0") ? true : false} name="MethodName" readOnly value={MethodName} placeholder={placeholder} id="MethodName" onChange={this.handleChange("MethodName")} />
                                        }
                                    </IntlMessages>
                                    {errors.MethodName && (<span className="text-danger text-left"><IntlMessages id={errors.MethodName} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["116C53E8-4EB4-4739-90DD-2595161A1BDE"]) && (menuDetail["116C53E8-4EB4-4739-90DD-2595161A1BDE"].Visibility === "E925F86B")) && //116C53E8-4EB4-4739-90DD-2595161A1BDE
                            <FormGroup row>
                                <Label className="control-label col-md-4 col-sm-3 col-xs-12">APIAccess</Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <RadioGroup
                                        aria-label="APIAccess"
                                        name="APIAccess"
                                        value={this.state.value}
                                        row
                                        disabled={(menuDetail["116C53E8-4EB4-4739-90DD-2595161A1BDE"].AccessRight === "11E6E7B0") ? true : false}
                                        onChange={this.handleChange("APIAccess")}
                                    >
                                        <FormControlLabel value="IsReadOnly" control={<Radio color="primary" />} label="IsReadOnly" />
                                        <FormControlLabel value="IsFullAccess" control={<Radio color="primary" />} label="IsFullAccess" />
                                    </RadioGroup>
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["26F4C498-463D-8B39-7C51-853F06787526"]) && (menuDetail["26F4C498-463D-8B39-7C51-853F06787526"].Visibility === "E925F86B")) && //26F4C498-463D-8B39-7C51-853F06787526
                            <FormGroup row>
                                <Label for="Status" className="control-label col-md-4 col-sm-3 col-xs-12"><IntlMessages id="my_account.Status" /></Label>
                                <Switch
                                    checked={this.state.check}
                                    onChange={this.handleChange('check')}
                                    value="check"
                                    enabled={(menuDetail["26F4C498-463D-8B39-7C51-853F06787526"].AccessRight === "11E6E7B0") ? false : true}
                                    color="primary"
                                />
                            </FormGroup>
                        }
                        {((menuDetail["C06823DF-271D-4F5D-4537-75B599BB5225"]) && (menuDetail["C06823DF-271D-4F5D-4537-75B599BB5225"].Visibility === "E925F86B")) && //C06823DF-271D-4F5D-4537-75B599BB5225
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
                                        disabled={(menuDetail["C06823DF-271D-4F5D-4537-75B599BB5225"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["B9EC8B5D-8FF6-A42F-2369-A3891C109451"]) && (menuDetail["B9EC8B5D-8FF6-A42F-2369-A3891C109451"].Visibility === "E925F86B")) && //B9EC8B5D-8FF6-A42F-2369-A3891C109451
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
                                        disabled={(menuDetail["B9EC8B5D-8FF6-A42F-2369-A3891C109451"].AccessRight === "11E6E7B0") ? true : false}
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
                        }
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={loading_methods} color="primary" className="btn-primary text-white" onClick={this.OnUpdateApiMethod}><IntlMessages id="button.update" /></Button>
                                        <Button className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
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
    const { updateApiMethodData, resetMethodListData, socketMethodListData, loading_methods } = RestAPIMethodReducer;
    return { updateApiMethodData, resetMethodListData, socketMethodListData, loading_methods, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    updateApiMethod,
    getSystemResetMethodData,
    getSocketMethodData,
    getApiMethodData,
    getMenuPermissionByID
})(UpdateAPIMethod);
