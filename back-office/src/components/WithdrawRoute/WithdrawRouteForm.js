/* 
    Developer : Nishant Vadgama
    Date : 24-10-2018
    File Comment : Add & Edit Withdrawal route component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FormGroup, Label, Input, Row } from "reactstrap";
import validator from 'validator';
import Switch from 'react-toggle-switch';
import { injectIntl } from 'react-intl';
import {
    getWithdrawRouteList,
    getCurrencyList,
    getWithdrawRouteInfo,
    postWithdrawRouteInfo
} from "Actions/WithdrawRoute";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import MatButton from "@material-ui/core/Button";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from 'react-notifications';
// request validator
var validateRouteRequest = require("../../validation/WithdrawRoute/validateRouteRequest");
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    color: "white",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
    // styles we need to apply on draggables
    ...draggableStyle
});
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid
});

class WithdrawRouteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Id: "",
            currencyIndex: "",
            ServiceID: "",
            CurrencyName: "",
            status: 0,
            errors: {},
            availRoutes: [],
            TrnType: this.props.TrnType,
            AvailableRoute: [
                {
                    Priority: "1",
                    ServiceProDetailId: "",
                    ProviderWalletID: "",
                    ConfirmationCount: "",
                    AssetName: "",
                    ConvertAmount: "",
                    AccountNoLen: "",
                    AccNoStartsWith: "",
                    AccNoValidationRegex: "",
                }
            ],
            menudetail: [],
            notificationFlag: true,
            editMode: false,
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    closeAll = () => {
        this.resetState();
        this.props.closeAll();
    };
    //will mount event
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.TrnType === 9 ? '1AAA7B05-9FB6-9F53-11B0-CFD7C46794D8' : 'C6C67C0E-6FB3-74A7-A742-05F5AA1067FF'); // get wallet menu permission
    }
    //change in props
    componentWillReceiveProps(nextProps) {
        const intl = nextProps.props.intl;
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getCurrencyList();
                this.props.getWithdrawRouteInfo();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // validate before update
        if (nextProps.availableRouteList.length) {
            this.setState({ availRoutes: nextProps.availableRouteList });
        }
        //add success validation
        if (nextProps.addResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.addResponse.ReturnCode === 0) {
                // reset state 
                NotificationManager.success(intl.formatMessage({ id: "common.form.edit.success" }));
                this.setState({
                    Id: "",
                    responseMessage: "",
                    currencyIndex: "",
                    ServiceID: "",
                    CurrencyName: "",
                    status: 0,
                    TrnType: this.props.TrnType,
                    AvailableRoute: [
                        {
                            Priority: "1",
                            ServiceProDetailId: "",
                            ProviderWalletID: "",
                            ConfirmationCount: "",
                            AssetName: "",
                            ConvertAmount: "",
                            AccountNoLen: "",
                            AccNoStartsWith: "",
                            AccNoValidationRegex: "",
                        }
                    ],
                    errors: {},
                });
                this.props.drawerClose();
                this.props.getWithdrawRouteList({ TrnType: this.props.TrnType });
            } else if (nextProps.addResponse.ReturnCode !== 0) {
                NotificationManager.error(intl.formatMessage({ id: `error.trading.transaction.${nextProps.addResponse.ErrorCode}` }));
            }
        }
        // if edit then validate response
        if (nextProps.routeInfo.hasOwnProperty("ReturnCode")) {
            if (nextProps.routeInfo.ReturnCode == 0) {// success
                const response = nextProps.routeInfo.Response;
                var CurrencyName = response.CurrencyName.split("_")
                this.setState({
                    currencyIndex: this.getIndex(response.ServiceID),
                    ServiceID: response.ServiceID,
                    CurrencyName: CurrencyName[0],
                    status: response.status,
                    AvailableRoute: response.AvailableRoute,
                    errors: {},
                    editMode: true,
                });
            } else { //error
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.routeInfo.ErrorCode}` }));
            }
        }
    }
    getIndex(value) {
        const arr = this.props.currencyList;
        if (arr.length) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].ServiceId === value) {
                    return i;
                }
            }
        }
        return ""; //to handle the case where the value doesn't exist
    }
    //cancel button handler
    handleCancel(e) {
        e.preventDefault();
        this.resetState();
        this.props.drawerClose();
    }
    //submit button handler
    handleSubmit(e) {
        e.preventDefault();
        const { errors, isValid } = validateRouteRequest(this.state, this.props.TrnType);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.postWithdrawRouteInfo(this.state);
        }
    }
    //on change currency 
    onChangeCurrency(e) {
        if (e.target.value !== "") {
            const object = this.props.currencyList[e.target.value];
            this.setState({
                ServiceID: object.ServiceId,
                CurrencyName: object.SMSCode,
                currencyIndex: e.target.value
            });
        }
    }
    // add dynamic row
    addNewRow() {
        //validate if exced 5 records
        if (this.state.AvailableRoute.length < 5) {
            /* check if already submited and error object has been created */
            if (this.state.errors.hasOwnProperty("routes")) {
                const tempErrors = Object.assign([], this.state.errors);
                const tempObj = {};
                tempErrors.routes.push(tempObj);
                this.setState({ errors: tempErrors });
            }
            let newObj = {
                ServiceProDetailId: "",
                ProviderWalletID: "",
                ConfirmationCount: "",
                AssetName: "",
                ConvertAmount: "",
                AccountNoLen: "",
                AccNoStartsWith: "",
                AccNoValidationRegex: "",
                Priority: (this.state.AvailableRoute.length + 1) + '',
            };
            this.setState({ AvailableRoute: this.state.AvailableRoute.concat(newObj) });
        }
    }
    // delete route row 
    deleteRow(index) {
        //validate if last row
        if (this.state.AvailableRoute.length > 1) {
            this.setState({
                AvailableRoute: this.state.AvailableRoute.filter(
                    (_, i) => i !== index
                )
            })
        }
    }
    // handle change
    handleChange(e, index, key) {
        if (key === 'ConfirmationCount') {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value == "") {
                let tmpObject = Object.assign([], this.state.AvailableRoute);
                tmpObject[index][key] = e.target.value;
                this.setState({ AvailableRoute: tmpObject });
            }
        } else if (key === 'ProviderWalletID' || key === "AssetName") {
            if (validator.isAlphanumeric(e.target.value) || e.target.value == "") {
                let tmpObject = Object.assign([], this.state.AvailableRoute);
                tmpObject[index][key] = e.target.value;
                this.setState({ AvailableRoute: tmpObject });
            }
        } else if (key === 'ConvertAmount') {
            //validate float numer only
            if (validator.isDecimal(e.target.value, { force_decimal: false, decimal_digits: '0,8' }) || e.target.value == "") {
                let tmpObject = Object.assign([], this.state.AvailableRoute);
                tmpObject[index][key] = e.target.value;
                this.setState({ AvailableRoute: tmpObject });
            }
        } else {
            let tmpObject = Object.assign([], this.state.AvailableRoute);
            tmpObject[index][key] = e.target.value;
            this.setState({ AvailableRoute: tmpObject });
        }
    }
    // handle back to page
    handleBack() {
        this.resetState();
        this.props.drawerClose();
    }
    //reset state to default
    resetState() {
        this.setState({
            Id: "",
            currencyIndex: "",
            ServiceID: "",
            CurrencyName: "",
            status: 0,
            errors: {},
            AvailableRoute: [
                {
                    Priority: "1",
                    ServiceProDetailId: "",
                    ProviderWalletID: "",
                    ConfirmationCount: "",
                    AssetName: "",
                    ConvertAmount: "",
                    AccountNoLen: "",
                    AccNoStartsWith: "",
                    AccNoValidationRegex: "",
                }
            ],
            editMode: false,
        });
    }
    // dragg
    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const AvailableRoute = reorder(
            this.state.AvailableRoute,
            result.source.index,
            result.destination.index
        );
        this.setState({
            AvailableRoute,
        });
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
        const { intl } = this.props
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.TrnType === 9 ? (this.state.editMode ? 'C449F95F-0AC1-3F64-84FB-51055C0D8B05' : '85CDAB55-0E65-0186-A110-CEA9DD0A8540') : (this.state.editMode ? '9FF3DCF9-4C49-5986-106D-A3D7D54122F5' : '0CCB101C-16A7-5F8E-A3D9-416A98DE425C'))
        const BreadCrumbData = [
            {
                title: <IntlMessages id="sidebar.app" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="sidebar.dashboard" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="sidebar.wallet" />,
                link: '',
                index: 0
            },
            {
                title: this.props.TrnType === 9 ? <IntlMessages id="sidebar.AddressGenerationRoute" /> : <IntlMessages id="sidebar.withdrawRoute" />,
                link: '',
                index: 1
            },
            {
                title: this.props.TrnType === 9 ? this.state.editMode ? <IntlMessages id="wallet.EditAddressGenerationRoute" /> : <IntlMessages id="wallet.AddAddressGenerationRoute" /> : this.state.editMode ? <IntlMessages id="wallet.EditWithdrawRoute" /> : <IntlMessages id="wallet.AddWithdrawRoute" />,
                link: '',
                index: 2
            },
        ];
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={this.props.TrnType === 9 ? (this.state.editMode ? <IntlMessages id="wallet.EditAddressGenerationRoute" /> : <IntlMessages id="wallet.AddAddressGenerationRoute" />) : (this.state.editMode ? <IntlMessages id="wallet.EditWithdrawRoute" /> : <IntlMessages id="wallet.AddWithdrawRoute" />)} breadCrumbData={BreadCrumbData} drawerClose={(e) => this.handleBack()} closeAll={this.closeAll} />
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <JbsCollapsibleCard contentCustomClasses="p-30">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                        {(this.props.TrnType === 9 ? (this.state.editMode ? (menuDetail['633304E7-0D70-5AF3-4720-7E32C52813FF'] && menuDetail['633304E7-0D70-5AF3-4720-7E32C52813FF'].Visibility === "E925F86B") : (menuDetail['685AF8ED-7247-7DB9-56EF-76F73A032136'] && menuDetail['685AF8ED-7247-7DB9-56EF-76F73A032136'].Visibility === "E925F86B")) : (this.state.editMode ? (menuDetail['E69B04A5-4227-8D29-8C2F-D781891F2AF1'] && menuDetail['E69B04A5-4227-8D29-8C2F-D781891F2AF1'].Visibility === "E925F86B") : (menuDetail['A7165E2A-88BB-3D84-5145-B86C983F327B'] && menuDetail['A7165E2A-88BB-3D84-5145-B86C983F327B'].Visibility === "E925F86B"))) &&
                            <FormGroup
                                className={"d-flex" + (this.state.errors.currency ? "mb-0" : "")}
                            >
                                <Label className="w-30">
                                    <IntlMessages id="table.currency" /> <span className="text-danger">*</span>
                                </Label>
                                <FormGroup className="w-40 d-inline-block mb-0">
                                    <Input
                                        className={(this.state.errors.currency) ? "is-invalid" : ""}
                                        type="select"
                                        name="currency"
                                        id="currency"
                                        disabled={(this.props.TrnType === 9 ? (this.state.editMode ? ((menuDetail['633304E7-0D70-5AF3-4720-7E32C52813FF'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['685AF8ED-7247-7DB9-56EF-76F73A032136'].AccessRight === "11E6E7B0") ? true : false)) : (this.state.editMode ? ((menuDetail['E69B04A5-4227-8D29-8C2F-D781891F2AF1'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['A7165E2A-88BB-3D84-5145-B86C983F327B'].AccessRight === "11E6E7B0") ? true : false)))}
                                        value={this.state.currencyIndex}
                                        onChange={e => this.onChangeCurrency(e)}
                                    >
                                        <IntlMessages id="wallet.errCurrency">
                                            {(optionValue) =>
                                                (<option value="">{optionValue}</option>)
                                            }
                                        </IntlMessages>
                                        {this.props.currencyList.length > 0 && this.props.currencyList.map((currency, key) => (
                                            <option key={key} value={key}>{currency.SMSCode}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </FormGroup>
                        }
                        {(this.props.TrnType === 9 ? (this.state.editMode ? (menuDetail['F8672163-911D-4E8D-99CB-CE7ACFE42FB0'] && menuDetail['F8672163-911D-4E8D-99CB-CE7ACFE42FB0'].Visibility === "E925F86B") : (menuDetail['18F00215-332F-983D-4F78-CF39D873669B'] && menuDetail['18F00215-332F-983D-4F78-CF39D873669B'].Visibility === "E925F86B")) : (this.state.editMode ? (menuDetail['7F0EF752-865A-2560-6620-0FC1E0BA2D40'] && menuDetail['7F0EF752-865A-2560-6620-0FC1E0BA2D40'].Visibility === "E925F86B") : (menuDetail['A03916ED-00E8-649B-4188-5997D80483B5'] && menuDetail['A03916ED-00E8-649B-4188-5997D80483B5'].Visibility === "E925F86B"))) &&
                            <FormGroup
                                className={"d-flex " + (this.state.errors.status ? "mb-0" : "")}
                            >
                                <Label className="w-30">
                                    <IntlMessages id="widgets.status" />
                                </Label>
                                <Switch
                                    onClick={(e) => this.setState({ status: (this.state.status) ? 0 : 1 })}
                                    on={(this.state.status) ? true : false}
                                    enabled={(this.props.TrnType === 9 ? (this.state.editMode ? ((menuDetail['F8672163-911D-4E8D-99CB-CE7ACFE42FB0'].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail['18F00215-332F-983D-4F78-CF39D873669B'].AccessRight === "11E6E7B0") ? false : true)) : (this.state.editMode ? ((menuDetail['7F0EF752-865A-2560-6620-0FC1E0BA2D40'].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail['A03916ED-00E8-649B-4188-5997D80483B5'].AccessRight === "11E6E7B0") ? false : true)))}
                                />
                            </FormGroup>
                        }
                        {this.state.errors.status && (
                            <FormGroup className="d-flex">
                                <Label className="w-30 px-20" />
                                <Label className="w-70">
                                    <span className="text-danger">
                                    </span>
                                </Label>
                            </FormGroup>
                        )}
                        <FormGroup className="d-flex mb-0">
                            <Label>
                                <span className="text-danger">
                                </span>
                            </Label>
                        </FormGroup>
                        <div className="activity-board-wrapper">
                            <div className="comment-box mb-4 p-20">
                                <DragDropContext onDragEnd={this.onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) => (
                                            <ul className="list-unstyled list-group drag-list-wrapper" ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                                {this.state.AvailableRoute.map((route, index) => (
                                                    <Draggable key={index} draggableId={index} index={index}>
                                                        {(innProvided, innSnapshot) => (
                                                            <li className="list-group-item">
                                                                <div
                                                                    ref={innProvided.innerRef}
                                                                    {...innProvided.draggableProps}
                                                                    {...innProvided.dragHandleProps}
                                                                    className="drag-list"
                                                                    style={getItemStyle(
                                                                        innSnapshot.isDragging,
                                                                        innProvided.draggableProps.style
                                                                    )}>
                                                                    <div
                                                                        className="col-xs-12 col-sm-12 col-md-12 justify-content-between d-inline-block"
                                                                        key={index}
                                                                    >
                                                                        {(this.props.TrnType === 9 ? (this.state.editMode ? (menuDetail['DEDAC4D4-54FC-6074-9B59-462608C012BB'] && menuDetail['DEDAC4D4-54FC-6074-9B59-462608C012BB'].Visibility === "E925F86B") : (menuDetail['7EA64077-4F4E-A66A-0FDC-75DC4FFB43D0'] && menuDetail['7EA64077-4F4E-A66A-0FDC-75DC4FFB43D0'].Visibility === "E925F86B")) : (this.state.editMode ? (menuDetail['92034678-6B21-64B7-0EE2-D4A0E5F6265C'] && menuDetail['92034678-6B21-64B7-0EE2-D4A0E5F6265C'].Visibility === "E925F86B") : (menuDetail['B6CFF413-6FE7-0F95-2021-9A2108A46310'] && menuDetail['B6CFF413-6FE7-0F95-2021-9A2108A46310'].Visibility === "E925F86B"))) &&
                                                                            <FormGroup className="col-sm-2 col-md-1 d-inline-block mb-0">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.Priority" />
                                                                                </Label>
                                                                                <Input
                                                                                    disabled={(this.props.TrnType === 9 ? (this.state.editMode ? ((menuDetail['DEDAC4D4-54FC-6074-9B59-462608C012BB'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['7EA64077-4F4E-A66A-0FDC-75DC4FFB43D0'].AccessRight === "11E6E7B0") ? true : false)) : (this.state.editMode ? ((menuDetail['92034678-6B21-64B7-0EE2-D4A0E5F6265C'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['B6CFF413-6FE7-0F95-2021-9A2108A46310'].AccessRight === "11E6E7B0") ? true : false)))}
                                                                                    type="text"
                                                                                    name={"Priority" + index}
                                                                                    id={"Priority" + index}
                                                                                    value={index + 1}
                                                                                >
                                                                                </Input>
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.props.TrnType === 9 ? (this.state.editMode ? (menuDetail['2CB0C109-5F79-23FF-4422-8E5BD03A9549'] && menuDetail['2CB0C109-5F79-23FF-4422-8E5BD03A9549'].Visibility === "E925F86B") : (menuDetail['9D39AACC-4C1D-9632-2CDA-871A382675D6'] && menuDetail['9D39AACC-4C1D-9632-2CDA-871A382675D6'].Visibility === "E925F86B")) : (this.state.editMode ? (menuDetail['2F4FDA63-A4C0-257C-871C-63D0240E36F6'] && menuDetail['2F4FDA63-A4C0-257C-871C-63D0240E36F6'].Visibility === "E925F86B") : (menuDetail['B295C27B-60C7-0ED1-1463-8852FBEE5F0F'] && menuDetail['B295C27B-60C7-0ED1-1463-8852FBEE5F0F'].Visibility === "E925F86B"))) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.lblRoute" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].ServiceProDetailId) ? "is-invalid" : ""}
                                                                                    type="select"
                                                                                    name={"route" + index}
                                                                                    id={"route" + index}
                                                                                    onChange={e => this.handleChange(e, index, "ServiceProDetailId")}
                                                                                    disabled={(this.props.TrnType === 9 ? (this.state.editMode ? ((menuDetail['2CB0C109-5F79-23FF-4422-8E5BD03A9549'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['9D39AACC-4C1D-9632-2CDA-871A382675D6'].AccessRight === "11E6E7B0") ? true : false)) : (this.state.editMode ? ((menuDetail['2F4FDA63-A4C0-257C-871C-63D0240E36F6'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['B295C27B-60C7-0ED1-1463-8852FBEE5F0F'].AccessRight === "11E6E7B0") ? true : false)))}
                                                                                    value={this.state.AvailableRoute[index].ServiceProDetailId}
                                                                                >
                                                                                    <option value="">{intl.formatMessage({ id: "lable.selectRoute" })}</option>
                                                                                    {this.state.availRoutes.length > 0 && this.state.availRoutes.map((item, key) => (
                                                                                        <option key={key} value={item.Id}>{item.ProviderName}</option>
                                                                                    ))}
                                                                                </Input>
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.props.TrnType === 9 ? (this.state.editMode ? (menuDetail['D5E3A2A1-471E-1D10-2DEB-B46A629A3B0B'] && menuDetail['D5E3A2A1-471E-1D10-2DEB-B46A629A3B0B'].Visibility === "E925F86B") : (menuDetail['7C84F8DE-1797-0955-0744-DB9A0C3B6197'] && menuDetail['7C84F8DE-1797-0955-0744-DB9A0C3B6197'].Visibility === "E925F86B")) : (this.state.editMode ? (menuDetail['C16B521D-66D4-806A-4862-39113239440F'] && menuDetail['C16B521D-66D4-806A-4862-39113239440F'].Visibility === "E925F86B") : (menuDetail['2B90762A-3F47-83AE-7E31-2183F20715C0'] && menuDetail['2B90762A-3F47-83AE-7E31-2183F20715C0'].Visibility === "E925F86B"))) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.ProviderWalletID" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].ProviderWalletID) ? "is-invalid" : ""}
                                                                                    type="text"
                                                                                    name={"providerWalletID" + index}
                                                                                    value={this.state.AvailableRoute[index].ProviderWalletID}
                                                                                    disabled={(this.props.TrnType === 9 ? (this.state.editMode ? ((menuDetail['D5E3A2A1-471E-1D10-2DEB-B46A629A3B0B'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['7C84F8DE-1797-0955-0744-DB9A0C3B6197'].AccessRight === "11E6E7B0") ? true : false)) : (this.state.editMode ? ((menuDetail['C16B521D-66D4-806A-4862-39113239440F'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['2B90762A-3F47-83AE-7E31-2183F20715C0'].AccessRight === "11E6E7B0") ? true : false)))}
                                                                                    onChange={e => this.handleChange(e, index, "ProviderWalletID")}
                                                                                />
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.props.TrnType === 9 ? (this.state.editMode ? (menuDetail['89FDA2C1-4488-5488-511D-B36EEBB12395'] && menuDetail['89FDA2C1-4488-5488-511D-B36EEBB12395'].Visibility === "E925F86B") : (menuDetail['47E1BF6D-0D92-0C65-299B-BBAC7AB437E0'] && menuDetail['47E1BF6D-0D92-0C65-299B-BBAC7AB437E0'].Visibility === "E925F86B")) : (this.state.editMode ? (menuDetail['705FF9CF-0B35-6FF6-3C10-2D19B1612CBC'] && menuDetail['705FF9CF-0B35-6FF6-3C10-2D19B1612CBC'].Visibility === "E925F86B") : (menuDetail['C14685E1-6240-33AB-8F6F-4BE051AA9808'] && menuDetail['C14685E1-6240-33AB-8F6F-4BE051AA9808'].Visibility === "E925F86B"))) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.AssetName" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].AssetName) ? "is-invalid" : ""}
                                                                                    type="text"
                                                                                    name={"AssetName" + index}
                                                                                    value={this.state.AvailableRoute[index].AssetName}
                                                                                    disabled={(this.props.TrnType === 9 ? (this.state.editMode ? ((menuDetail['89FDA2C1-4488-5488-511D-B36EEBB12395'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['47E1BF6D-0D92-0C65-299B-BBAC7AB437E0'].AccessRight === "11E6E7B0") ? true : false)) : (this.state.editMode ? ((menuDetail['705FF9CF-0B35-6FF6-3C10-2D19B1612CBC'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['C14685E1-6240-33AB-8F6F-4BE051AA9808'].AccessRight === "11E6E7B0") ? true : false)))}
                                                                                    onChange={e => this.handleChange(e, index, "AssetName")}
                                                                                />
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.props.TrnType === 9 ? (this.state.editMode ? (menuDetail['CEFF4FD6-0EA4-3414-50D9-7E9683821CA7'] && menuDetail['CEFF4FD6-0EA4-3414-50D9-7E9683821CA7'].Visibility === "E925F86B") : (menuDetail['27FAEC27-253F-14F9-64E0-1DF94B383BE0'] && menuDetail['27FAEC27-253F-14F9-64E0-1DF94B383BE0'].Visibility === "E925F86B")) : (this.state.editMode ? (menuDetail['7BDBDAB9-78C1-13B8-A5C1-8EA9EA6892C6'] && menuDetail['7BDBDAB9-78C1-13B8-A5C1-8EA9EA6892C6'].Visibility === "E925F86B") : (menuDetail['E3366E80-41E8-7B85-14DB-72400A2F1F75'] && menuDetail['E3366E80-41E8-7B85-14DB-72400A2F1F75'].Visibility === "E925F86B"))) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.ConfirmationCount" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].ConfirmationCount) ? "is-invalid" : ""}
                                                                                    type="text"
                                                                                    name={"ConfirmationCount" + index}
                                                                                    value={this.state.AvailableRoute[index].ConfirmationCount}
                                                                                    disabled={(this.props.TrnType === 9 ? (this.state.editMode ? ((menuDetail['CEFF4FD6-0EA4-3414-50D9-7E9683821CA7'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['27FAEC27-253F-14F9-64E0-1DF94B383BE0'].AccessRight === "11E6E7B0") ? true : false)) : (this.state.editMode ? ((menuDetail['7BDBDAB9-78C1-13B8-A5C1-8EA9EA6892C6'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['E3366E80-41E8-7B85-14DB-72400A2F1F75'].AccessRight === "11E6E7B0") ? true : false)))}
                                                                                    onChange={e => this.handleChange(e, index, "ConfirmationCount")}
                                                                                />
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.state.editMode ? (menuDetail['BD3D9402-49FD-8E39-334A-40E1C7F6053D'] && menuDetail['BD3D9402-49FD-8E39-334A-40E1C7F6053D'].Visibility === "E925F86B") : (menuDetail['73C83647-4552-3A37-8AE1-6A9C0C6D7F95'] && menuDetail['73C83647-4552-3A37-8AE1-6A9C0C6D7F95'].Visibility === "E925F86B")) && (this.props.TrnType === 6) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.ConvertAmount" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].ConvertAmount) ? "is-invalid" : ""}
                                                                                    type="text"
                                                                                    name={"ConvertAmount" + index}
                                                                                    value={this.state.AvailableRoute[index].ConvertAmount}
                                                                                    disabled={(this.state.editMode ? ((menuDetail['BD3D9402-49FD-8E39-334A-40E1C7F6053D'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['73C83647-4552-3A37-8AE1-6A9C0C6D7F95'].AccessRight === "11E6E7B0") ? true : false)) && (this.props.TrnType === 6)}
                                                                                    onChange={e => this.handleChange(e, index, "ConvertAmount")}
                                                                                />
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.state.editMode ? (menuDetail['EC8902DF-A39C-8B0D-12D5-C7579130014F'] && menuDetail['EC8902DF-A39C-8B0D-12D5-C7579130014F'].Visibility === "E925F86B") : (menuDetail['7740A0F8-6CB1-078D-282F-97F9672125AA'] && menuDetail['7740A0F8-6CB1-078D-282F-97F9672125AA'].Visibility === "E925F86B")) && (this.props.TrnType === 9) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.AccountNoLen" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].AccountNoLen) ? "is-invalid" : ""}
                                                                                    type="text"
                                                                                    name="AccountNoLen"
                                                                                    value={this.state.AvailableRoute[index].AccountNoLen}
                                                                                    disabled={(this.state.editMode ? ((menuDetail['EC8902DF-A39C-8B0D-12D5-C7579130014F'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['7740A0F8-6CB1-078D-282F-97F9672125AA'].AccessRight === "11E6E7B0") ? true : false)) && (this.props.TrnType === 9)}
                                                                                    onChange={e => this.handleChange(e, index, "AccountNoLen")}
                                                                                />
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.state.editMode ? (menuDetail['22ECCB1A-6AA6-8840-0C66-144CAD3049AF'] && menuDetail['22ECCB1A-6AA6-8840-0C66-144CAD3049AF'].Visibility === "E925F86B") : (menuDetail['0E7C820F-0F57-60D1-0B42-C06E92247DBE'] && menuDetail['0E7C820F-0F57-60D1-0B42-C06E92247DBE'].Visibility === "E925F86B")) && (this.props.TrnType === 9) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0 pt-10">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.AccNoStartsWith" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].AccNoStartsWith) ? "is-invalid" : ""}
                                                                                    type="text"
                                                                                    name="AccNoStartsWith"
                                                                                    value={this.state.AvailableRoute[index].AccNoStartsWith}
                                                                                    disabled={(this.state.editMode ? ((menuDetail['22ECCB1A-6AA6-8840-0C66-144CAD3049AF'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['0E7C820F-0F57-60D1-0B42-C06E92247DBE'].AccessRight === "11E6E7B0") ? true : false)) && (this.props.TrnType === 9)}
                                                                                    onChange={e => this.handleChange(e, index, "AccNoStartsWith")}
                                                                                />
                                                                            </FormGroup>
                                                                        }
                                                                        {(this.state.editMode ? (menuDetail['FF0D2D0C-A35D-475B-725A-41A2098AA068'] && menuDetail['FF0D2D0C-A35D-475B-725A-41A2098AA068'].Visibility === "E925F86B") : (menuDetail['B7ED7B63-6EE5-525F-8A3A-0C7B272906AA'] && menuDetail['B7ED7B63-6EE5-525F-8A3A-0C7B272906AA'].Visibility === "E925F86B")) && (this.props.TrnType === 9) &&
                                                                            <FormGroup className="col-sm-5 col-md-2 d-inline-block mb-0 pt-10">
                                                                                <Label className="">
                                                                                    <IntlMessages id="wallet.AccNoValidationRegex" /> <span className="text-danger">*</span>
                                                                                </Label>
                                                                                <Input
                                                                                    className={(this.state.errors.routes && this.state.errors.routes[index].AccNoValidationRegex) ? "is-invalid" : ""}
                                                                                    type="text"
                                                                                    name="AccNoValidationRegex"
                                                                                    value={this.state.AvailableRoute[index].AccNoValidationRegex}
                                                                                    disabled={(this.state.editMode ? ((menuDetail['FF0D2D0C-A35D-475B-725A-41A2098AA068'].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail['B7ED7B63-6EE5-525F-8A3A-0C7B272906AA'].AccessRight === "11E6E7B0") ? true : false)) && (this.props.TrnType === 9)}
                                                                                    onChange={e => this.handleChange(e, index, "AccNoValidationRegex")}
                                                                                />
                                                                            </FormGroup>
                                                                        }
                                                                        <FormGroup className="col-sm-1 col-md-1 d-inline-block mb-0">
                                                                            {this.state.AvailableRoute.length > 1 && <a
                                                                                className="font-2x"
                                                                                href="javascript:void(0)"
                                                                                onClick={e => this.deleteRow(index)}
                                                                            >
                                                                                <i className="zmdi zmdi-delete"></i>
                                                                            </a>}
                                                                        </FormGroup>
                                                                    </div>
                                                                </div>
                                                                {innProvided.placeholder}
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </ul>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                <Row>
                                    {this.state.AvailableRoute.length < 5 && <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block ml-15 mt-20">
                                        <MatButton
                                            variant="raised"
                                            className="btn-primary text-white"
                                            onClick={e => this.addNewRow()}
                                        >
                                            <IntlMessages id="wallet.btnAddRoutes" />
                                        </MatButton>
                                    </div>}
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 justify-content-center d-flex">
                        <FormGroup className="mb-10">
                            <MatButton
                                variant="raised"
                                className="btn-primary text-white mr-10"
                                onClick={e => this.handleSubmit(e)}
                            >
                                <IntlMessages id={"button.submit"} />
                            </MatButton>
                            <MatButton
                                variant="raised"
                                className="btn-danger text-white"
                                onClick={e => this.handleCancel(e)}
                            >
                                <IntlMessages id="button.cancel" />
                            </MatButton>{" "}
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
            </div >
        );
    }
}

const mapStateToProps = ({ withdrawRoute, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { availableRouteList, currencyList, loading, addResponse, routeInfo } = withdrawRoute;
    return { availableRouteList, currencyList, loading, addResponse, routeInfo, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getWithdrawRouteList,
    getCurrencyList,
    getWithdrawRouteInfo,
    postWithdrawRouteInfo,
    getMenuPermissionByID
})(injectIntl(WithdrawRouteForm));
