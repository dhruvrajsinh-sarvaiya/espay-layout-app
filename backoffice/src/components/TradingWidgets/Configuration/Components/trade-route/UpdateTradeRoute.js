import React, { Component } from "react";
import { connect } from "react-redux";

import { NotificationManager } from "react-notifications";
import validator from 'validator';
import CloseButton from '@material-ui/core/Button';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
import {
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

//Action Import for Payment Method  Report Add And Update
import {
    getTradeRouteList,
    updateTradeRouteList,
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

class UpdateTradeRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            updateData: false,
            selectedCurrency: "",
            pairId: this.props.selectedData.PairId,
            orderType: this.props.selectedData.OrderType,
            trnType: this.props.selectedData.TrnType,
            status: this.props.selectedData.Status,
            pairList: [],
            assetName: this.props.selectedData.AssetName,
            converAmount: this.props.selectedData.ConvertAmount,
            confirmationCount: this.props.selectedData.ConfirmationCount,
            routeUrlId: this.props.selectedData.RouteUrlId,
            Id: this.props.selectedData.Id,
            orderTypeList: [],
            routeList: [],
            isUpdate: false,
            notificationFlag: true,
            menudetail: [],
        };
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('31CEA41F-846F-7992-50B3-628C51EA8D0E'); // get Trading menu permission
    }
    // componentDidMount() {
    //     this.props.getTradePairs({});
    //     this.props.getOrderTypeList({});
    //     this.props.getAvailableRoutes({ TrnType: this.props.selectedData.TrnType })
    // }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    updateTradeReconData = () => {
        const {
            pairId, orderType, trnType,
            status, assetName, converAmount,
            confirmationCount, routeUrlId,
            isUpdate, Id
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
            Id: Id
        };

        if (pairId === '' || pairId == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.pairId" />);
        } else if (orderType === '' || orderType == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.ordertype" />);
        } else if (trnType === '' || trnType == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.trntype" />);
        } else if (status === '' || status == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.status" />);
        } else if (assetName === '' || assetName == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.assetName" />);
        } else if (isScriptTag(assetName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(assetName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        }
        else if (converAmount == '' || converAmount == null) {
            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.converAmount" />);
        } else if (!validator.isNumeric(converAmount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.fieldNum" />);
        }
        else if (isScriptTag(converAmount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(converAmount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        }
        else if (confirmationCount == '' || confirmationCount == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.confirmationCount" />);
        } else if (isScriptTag(confirmationCount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(confirmationCount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        } else if (!validator.isNumeric(confirmationCount)) {
            NotificationManager.error(<IntlMessages id="my_account.err.fieldNum" />);
        }
        else if (routeUrlId === '' || routeUrlId == null) {

            NotificationManager.error(<IntlMessages id="sidebar.traderoute.list.lable.enter.routeUrlId" />);
        } else {

            if (isUpdate) {
                this.setState({
                    updateData: true
                })
               
                this.props.updateTradeRouteList(data);
                console.log("updateddata",data);
                
            } else {
                NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
            }
        }
         //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
         var reqObject = {};
         if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
             reqObject.IsArbitrage = this.props.IsArbitrage;
         }
         this.props.updateTradeRouteList(reqObject);

    };

    handleClose = () => {
        this.props.drawerClose();
        this.setState({
            open: false,
            updateData: false,
            selectedCurrency: "",
            pairId: "",
            orderType: "",
            trnType: "",
            status: "",
            pairList: [],
            assetName: "",
            converAmount: "",
            confirmationCount: "",
            routeUrlId: "",
            Id: "",
            orderTypeList: [],
            routeList: [],
            isUpdate: false
        });
    };

    componentWillReceiveProps(nextprops) {

        if (nextprops.selectedData) {
            this.setState({
                assetName: nextprops.selectedData.AssetName,
                converAmount: nextprops.selectedData.ConvertAmount,
                confirmationCount: nextprops.selectedData.ConfirmationCount,
                routeUrlId: nextprops.selectedData.RouteUrlId,
                Id: nextprops.selectedData.Id,
                pairId: nextprops.selectedData.PairId,
                orderType: nextprops.selectedData.OrderType,
                trnType: nextprops.selectedData.TrnType,
                status: nextprops.selectedData.Status,
            })

        }
        if (nextprops.updateTradeRouteList && nextprops.addError.length == 0 && this.state.updateData) {
            NotificationManager.success(<IntlMessages id="traderoute.update.currency.success" />);
            this.setState({
                updateData: false,
                open: false
            })
            this.props.drawerClose();
            //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.getTradeRouteList(reqObject);
            //end
            this.props.getTradeRouteList({});
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.updateData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                updateData: false
            })
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
                this.props.getAvailableRoutes({ TrnType: this.props.selectedData.TrnType })
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value, isUpdate: true });
    };

    handleChangeTrnType = event => {
        if (event.target.value !== '') {

            this.props.getAvailableRoutes({ TrnType: event.target.value })

            this.setState({ [event.target.name]: event.target.value, isUpdate: true });
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
        var menuDetail = this.checkAndGetMenuAccessDetail('D5A6C476-5594-5CAF-8D89-495D7BC31F31');//D5A6C476-5594-5CAF-8D89-495D7BC31F31
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
                        <h2><IntlMessages id="traderoute.EditTradeRoute" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Form className="m-10 tradefrm">
                    {((menuDetail["3C1E7087-5FCF-732E-437C-CD3881AC9639"]) && (menuDetail["3C1E7087-5FCF-732E-437C-CD3881AC9639"].Visibility === "E925F86B")) && //3C1E7087-5FCF-732E-437C-CD3881AC9639
                        <FormGroup row>
                            <Label for="pairId" className="control-label col">
                                <IntlMessages id="traderoute.select.pairid" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["3C1E7087-5FCF-732E-437C-CD3881AC9639"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((menuDetail["B4F5C816-9965-2981-6490-6134152852EF"]) && (menuDetail["B4F5C816-9965-2981-6490-6134152852EF"].Visibility === "E925F86B")) && //B4F5C816-9965-2981-6490-6134152852EF
                        <FormGroup row>
                            <Label for="orderType" className="control-label col">
                                <IntlMessages id="wallet.orderType" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["B4F5C816-9965-2981-6490-6134152852EF"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((menuDetail["0D4C5B97-5F65-A1A4-7FEF-5D50F4A6235C"]) && (menuDetail["0D4C5B97-5F65-A1A4-7FEF-5D50F4A6235C"].Visibility === "E925F86B")) && //0D4C5B97-5F65-A1A4-7FEF-5D50F4A6235C
                        <FormGroup row>
                            <Label for="trnType" className="control-label col">
                                <IntlMessages id="wallet.trnType" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["0D4C5B97-5F65-A1A4-7FEF-5D50F4A6235C"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((menuDetail["FAC6F820-40B2-4485-9066-09AC01E172AF"]) && (menuDetail["FAC6F820-40B2-4485-9066-09AC01E172AF"].Visibility === "E925F86B")) && //FAC6F820-40B2-4485-9066-09AC01E172AF
                        <FormGroup row>
                            <Label for="status" className="control-label col">
                                <IntlMessages id="manageMarkets.list.form.label.status" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["FAC6F820-40B2-4485-9066-09AC01E172AF"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((menuDetail["A10ACE8C-A222-72FE-7A15-3B48404F506D"]) && (menuDetail["A10ACE8C-A222-72FE-7A15-3B48404F506D"].Visibility === "E925F86B")) && //A10ACE8C-A222-72FE-7A15-3B48404F506D
                        <FormGroup row>
                            <Label className="control-label col">
                                <IntlMessages id="card.list.title.assetsname" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <IntlMessages id="card.list.title.assetsname">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["A10ACE8C-A222-72FE-7A15-3B48404F506D"].AccessRight === "11E6E7B0") ? true : false}
                                            name="assetName"
                                            value={this.state.assetName}
                                            onChange={this.handleChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["76674459-3581-39C2-107C-E5DA829F8AF9"]) && (menuDetail["76674459-3581-39C2-107C-E5DA829F8AF9"].Visibility === "E925F86B")) && //76674459-3581-39C2-107C-E5DA829F8AF9
                        <FormGroup row>
                            <Label className="control-label col">
                                <IntlMessages id="wallet.ConvertAmount" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <IntlMessages id="wallet.ConvertAmount">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["76674459-3581-39C2-107C-E5DA829F8AF9"].AccessRight === "11E6E7B0") ? true : false}
                                            name="converAmount"
                                            value={this.state.converAmount}
                                            onChange={this.handleChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["9D5DF25E-5189-7B47-780B-35A26566A332"]) && (menuDetail["9D5DF25E-5189-7B47-780B-35A26566A332"].Visibility === "E925F86B")) && //9D5DF25E-5189-7B47-780B-35A26566A332
                        <FormGroup row>
                            <Label className="control-label col">
                                <IntlMessages id="traderoute.trntype.confirmamount" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <IntlMessages id="traderoute.trntype.confirmamount">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["9D5DF25E-5189-7B47-780B-35A26566A332"].AccessRight === "11E6E7B0") ? true : false}
                                            name="confirmationCount"
                                            value={this.state.confirmationCount}
                                            onChange={this.handleChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </div>
                        </FormGroup>
                    }
                    {((menuDetail["8D42DD47-462B-7577-8BAB-7ACB505B1363"]) && (menuDetail["8D42DD47-462B-7577-8BAB-7ACB505B1363"].Visibility === "E925F86B")) && //8D42DD47-462B-7577-8BAB-7ACB505B1363
                        <FormGroup row>
                            <Label for="routeUrlId" className="control-label col">
                                <IntlMessages id="traderoute.trntype.routeurl" /><span className="text-danger">*</span>
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["8D42DD47-462B-7577-8BAB-7ACB505B1363"].AccessRight === "11E6E7B0") ? true : false}
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
                                        onClick={() => this.updateTradeReconData()}
                                        disabled={this.props.loading}
                                    >
                                        <IntlMessages id="sidebar.pairConfiguration.button.update" />
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
    loading: state.tradeRoute.updateLoading,
    addError: state.tradeRoute.updateError,
    pairList: state.tradeRecon.pairList,
    pairListLoading: state.tradeRecon.pairListLoading,
    updateTradeRouteList: state.tradeRoute.updateTradeRouteList,
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
        updateTradeRouteList,
        getTradePairs,
        getOrderTypeList,
        getAvailableRoutes,
        getMenuPermissionByID
    }
)(UpdateTradeRoute);

//export default UpdateTradeRoute