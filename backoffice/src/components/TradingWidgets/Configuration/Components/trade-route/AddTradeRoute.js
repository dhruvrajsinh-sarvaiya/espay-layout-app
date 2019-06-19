import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import validator from 'validator';
import { NotificationManager } from "react-notifications";
import MatButton from "@material-ui/core/Button";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
import CloseButton from '@material-ui/core/Button';

import {
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
    Row,
    Button
} from "reactstrap";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import Tooltip from "@material-ui/core/Tooltip";

//Action Import for Payment Method  Report Add And Update
import {
    getTradeRouteList,
    addTradeRouteList,
    getOrderTypeList,
    getAvailableRoutes

} from "Actions/TradeRoute";

import {
    getTradePairs
} from "Actions/TradeRecon"
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

class AddTradeRoute extends Component {

    constructor() {
        super();
        this.state = {
            addNewData: false,
            selectedCurrency: "",
            pairId: "",
            orderType: '',
            trnType: '',
            status: '',
            pairList: [],
            assetName: '',
            converAmount: '',
            confirmationCount: '',
            routeUrlId: '',
            Id: 0,
            orderTypeList: [],
            routeList: [],
            notificationFlag: true,
            menudetail: [],
        };
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('31CEA41F-846F-7992-50B3-628C51EA8D0E'); // get Trading menu permission
        // this.props.getTradePairs({});
        // this.props.getOrderTypeList({});
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    addTradeReconData = () => {

        const {
            pairId, orderType, trnType,
            status, assetName, converAmount,
            confirmationCount, routeUrlId
        } = this.state;

        const data = {
            PairId: pairId ? parseInt(pairId) : parseInt(0),
            OrderType: orderType ? parseInt(orderType) : parseInt(0),
            TrnType: trnType ? parseInt(trnType) : parseInt(0),
            Status: status ? parseInt(status) : parseInt(0),
            AssetName: assetName ? assetName : '',
            ConvertAmount: converAmount ? parseFloat(converAmount) : parseInt(0),
            ConfirmationCount: confirmationCount ? parseInt(confirmationCount) : parseInt(0),
            RouteUrlId: routeUrlId ? parseInt(routeUrlId) : parseInt(0),
        };

        if (pairId == '' || pairId == null) {
            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.pairId" />);
        } else if (orderType == '' || orderType == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.ordertype" />);
        } else if (trnType == '' || trnType == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.trntype" />);
        } else if (status == '' || status == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.status" />);
        } else if (assetName == '' || assetName == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.assetName" />);
        } else if (isScriptTag(assetName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(assetName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        }
        else if (converAmount == '' || converAmount == null) {
            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.converAmount" />);
        } else if (isScriptTag(converAmount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(converAmount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        }
        else if (!validator.isNumeric(converAmount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.fieldNum" />);
        }
        else if (confirmationCount == '' || confirmationCount == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.confirmationCount" />);
        } else if (isScriptTag(confirmationCount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(confirmationCount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        }
        else if (!validator.isNumeric(confirmationCount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.fieldNum" />);
        }
        else if (routeUrlId == '' || routeUrlId == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.routeUrlId" />);
        }
        else {
            this.setState({
                addNewData: true
            })
            //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
            var reqObject = data;
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.addTradeRouteList(reqObject);
            //end

            this.props.addTradeRouteList(data);
        }
    };
    // change by Jinesh bhatt date : 04-02-2019
    handleClose = () => {
        this.props.drawerClose();
        this.setState({
            open: false,
            addNewData: false,
            selectedCurrency: "",
            pairId: "",
            orderType: '',
            trnType: '',
            status: '',
            pairList: [],
            assetName: '',
            converAmount: '',
            confirmationCount: '',
            routeUrlId: '',
            Id: 0,
            orderTypeList: [],
            routeList: [],
        });
    };

    componentWillReceiveProps(nextprops) {

        if (nextprops.addTradeRouteList && nextprops.addError.length == 0 && this.state.addNewData) {
            //NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addTradeRouteList.ErrorCode}`} />);
            NotificationManager.success(<IntlMessages id="traderoute.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.drawerClose();
            //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.getTradeRouteList(reqObject);
            //end
            this.props.getTradeRouteList({});
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
            })
            //this.props.getMarketList({})
        }

        if (nextprops.pairList) {
            this.setState({
                pairList: nextprops.pairList
            })
        }

        if (nextprops.orderTypeList) {
            this.setState({
                orderTypeList: nextprops.orderTypeList
            })
        }

        if (nextprops.routeList) {
            this.setState({
                routeList: nextprops.routeList
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.props.getTradePairs({});
                this.props.getOrderTypeList({});
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChangeTrnType = event => {
        if (event.target.value !== '') {

            this.props.getAvailableRoutes({ TrnType: event.target.value })

            this.setState({ [event.target.name]: event.target.value });
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
        var menuDetail = this.checkAndGetMenuAccessDetail('8B99FC8F-0473-9E75-83FD-9D24FA417444');//8B99FC8F-0473-9E75-83FD-9D24FA417444
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                {
                    (
                        this.props.loading
                        || this.props.pairListLoading
                        || this.props.orderTypeListLoading
                        || this.props.routeListLoading
                        || this.props.menuLoading
                    ) && <JbsSectionLoader />
                }

                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="wallet.AddTradeRoute" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.handleClose()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Form className="m-10 tradefrm">
                    {((menuDetail["68D3D7F8-2BA8-5921-62D7-40C36B707B81"]) && (menuDetail["68D3D7F8-2BA8-5921-62D7-40C36B707B81"].Visibility === "E925F86B")) && //68D3D7F8-2BA8-5921-62D7-40C36B707B81
                        <FormGroup row>
                            <Label for="pairId" className="control-label col">
                                <IntlMessages id="traderoute.select.pairid" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["68D3D7F8-2BA8-5921-62D7-40C36B707B81"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="pairId"
                                    value={this.state.pairId}
                                    onChange={(e) => this.handleChange(e)}
                                >
                                    <IntlMessages id="traderoute.select.selectpairid">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>

                                    {this.state.pairList.length && this.state.pairList.map((item, key) => (
                                        <option
                                            value={item.PairId}
                                            key={key}
                                        >
                                            {item.PairName}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["D3BF9591-21EF-38D5-8789-E76046F33CAB"]) && (menuDetail["D3BF9591-21EF-38D5-8789-E76046F33CAB"].Visibility === "E925F86B")) && //D3BF9591-21EF-38D5-8789-E76046F33CAB
                        <FormGroup row>
                            <Label for="orderType" className="control-label col">
                                <IntlMessages id="wallet.orderType" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["D3BF9591-21EF-38D5-8789-E76046F33CAB"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="orderType"
                                    value={this.state.orderType}
                                    onChange={(e) => this.handleChange(e)}
                                >
                                    <IntlMessages id="wallet.errOrderType">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>

                                    {this.state.orderTypeList.length && this.state.orderTypeList.map((item, key) => (
                                        <option
                                            value={item.ID}
                                            key={key}
                                        >
                                            {item.OrderType}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["51575CF4-5D54-A68F-A2B8-050854AE865D"]) && (menuDetail["51575CF4-5D54-A68F-A2B8-050854AE865D"].Visibility === "E925F86B")) && //51575CF4-5D54-A68F-A2B8-050854AE865D
                        <FormGroup row>
                            <Label for="trnType" className="control-label col">
                                <IntlMessages id="wallet.trnType" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["51575CF4-5D54-A68F-A2B8-050854AE865D"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="trnType"
                                    value={this.state.trnType}
                                    onChange={(e) => this.handleChangeTrnType(e)}
                                >
                                    <IntlMessages id="wallet.errOrderType">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>

                                    <IntlMessages id="traderoute.trntype.buytrade">
                                        {(select) =>
                                            <option value="4">{select}</option>
                                        }
                                    </IntlMessages>

                                    <IntlMessages id="traderoute.trntype.selltrade">
                                        {(select) =>
                                            <option value="5">{select}</option>
                                        }
                                    </IntlMessages>
                                </Input>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["41D6AA10-64CA-8296-A205-3B1D11F8079B"]) && (menuDetail["41D6AA10-64CA-8296-A205-3B1D11F8079B"].Visibility === "E925F86B")) && //41D6AA10-64CA-8296-A205-3B1D11F8079B
                        <FormGroup row>
                            <Label for="status" className="control-label col">
                                <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["41D6AA10-64CA-8296-A205-3B1D11F8079B"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="status"
                                    value={this.state.status}
                                    onChange={(e) => this.handleChange(e)}
                                >
                                    <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>

                                    <IntlMessages id="manageMarkets.list.column.label.status.active">
                                        {(select) =>
                                            <option value="1">{select}</option>
                                        }
                                    </IntlMessages>

                                    <IntlMessages id="manageMarkets.list.column.label.status.inactive">
                                        {(select) =>
                                            <option value="0">{select}</option>
                                        }
                                    </IntlMessages>
                                </Input>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["72DEA795-1B3C-3742-66D7-C1A2AAD8531C"]) && (menuDetail["72DEA795-1B3C-3742-66D7-C1A2AAD8531C"].Visibility === "E925F86B")) && //72DEA795-1B3C-3742-66D7-C1A2AAD8531C
                        <FormGroup row>
                            <Label className="control-label col">
                                <IntlMessages id="card.list.title.assetsname" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <IntlMessages id="card.list.title.assetsname">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["72DEA795-1B3C-3742-66D7-C1A2AAD8531C"].AccessRight === "11E6E7B0") ? true : false}
                                            name="assetName"
                                            value={this.state.assetName}
                                            onChange={this.handleChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["37D8CE99-8189-851A-4DC9-D66C77F931BD"]) && (menuDetail["37D8CE99-8189-851A-4DC9-D66C77F931BD"].Visibility === "E925F86B")) && //37D8CE99-8189-851A-4DC9-D66C77F931BD
                        <FormGroup row >
                            <Label className="control-label col">
                                <IntlMessages id="wallet.ConvertAmount" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <IntlMessages id="wallet.ConvertAmount">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["37D8CE99-8189-851A-4DC9-D66C77F931BD"].AccessRight === "11E6E7B0") ? true : false}
                                            name="converAmount"
                                            value={this.state.converAmount}
                                            onChange={this.handleChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["E521B8C0-1F19-5643-0813-1FE21E827F1F"]) && (menuDetail["E521B8C0-1F19-5643-0813-1FE21E827F1F"].Visibility === "E925F86B")) && //E521B8C0-1F19-5643-0813-1FE21E827F1F
                        <FormGroup row>
                            <Label className="control-label col">
                                <IntlMessages id="traderoute.trntype.confirmamount" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <IntlMessages id="traderoute.trntype.confirmamount">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["E521B8C0-1F19-5643-0813-1FE21E827F1F"].AccessRight === "11E6E7B0") ? true : false}
                                            name="confirmationCount"
                                            value={this.state.confirmationCount}
                                            onChange={this.handleChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["AD2B07C4-1D88-08B3-8DEF-5345EB8413B5"]) && (menuDetail["AD2B07C4-1D88-08B3-8DEF-5345EB8413B5"].Visibility === "E925F86B")) && //AD2B07C4-1D88-08B3-8DEF-5345EB8413B5
                        <FormGroup row>
                            <Label for="routeUrlId" className="control-label col">
                                <IntlMessages id="traderoute.trntype.routeurl" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["AD2B07C4-1D88-08B3-8DEF-5345EB8413B5"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="routeUrlId"
                                    value={this.state.routeUrlId}
                                    onChange={(e) => this.handleChange(e)}
                                >
                                    <IntlMessages id="traderoute.trntype.select.routeurl">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>

                                    {this.state.routeList.length && this.state.routeList.map((item, key) => (
                                        <option
                                            value={item.Id}
                                            key={key}
                                        >
                                            {item.APISendURL}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </FormGroup>
                    }
                    <hr />
                    {menuDetail &&
                        <FormGroup row>
                            <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                <div className="btn_area">
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        className="text-white"
                                        onClick={() => this.addTradeReconData()}
                                    >
                                        <IntlMessages id="button.add" />
                                    </Button>

                                    <Button
                                        variant="raised"
                                        color="danger"
                                        className="text-white ml-15"
                                        onClick={() => this.handleClose()}
                                        disabled={this.props.loading}
                                    >
                                        <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                                    </Button>
                                </div>
                            </div>
                        </FormGroup>
                    }
                </Form>
            </div>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    loading: state.tradeRoute.addLoading,
    addError: state.tradeRoute.addError,
    pairList: state.tradeRecon.pairList,
    pairListLoading: state.tradeRecon.pairListLoading,
    addTradeRouteList: state.tradeRoute.addTradeRouteList,
    orderTypeList: state.tradeRoute.orderTypeList,
    orderTypeListLoading: state.tradeRoute.orderTypeListLoading,
    routeList: state.tradeRoute.routeList,
    routeListLoading: state.tradeRoute.routeListLoading,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

export default connect(
    mapStateToProps,
    {
        getTradeRouteList,
        addTradeRouteList,
        getTradePairs,
        getOrderTypeList,
        getAvailableRoutes,
        getMenuPermissionByID
    }
)(AddTradeRoute);

//export default AddTradeRoute