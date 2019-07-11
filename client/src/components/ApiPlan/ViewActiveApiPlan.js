//component for subscribe api plan By Tejas Date 1/3/2019

import React, { Fragment } from 'react';

import { NotificationManager } from "react-notifications";

// import for design
import {
    Row,
    Col,
    Label,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    Card
} from 'reactstrap';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

//component for auto renew
import AutoRenew from "./SetAutoRenewData";
import ManualRenew from "./ManualRenewPlan";
import CustomLimitNotAvailable from "./APICustomLimit/CustomLimitNotAvailable";
import CustomLimits from "./APICustomLimit/CustomLimits";
import SetCustomLimits from "./APICustomLimit/SetCustomLimits";
import ViewCustomLimits from './APICustomLimit/ViewCustomLimits';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import neccessary actions for fetch records
import {
    subScribeApiPlan,
    getAutoRenewalPlan,
    getCustomLimits
} from 'Actions/ApiPlan';

// used for connect
import { connect } from "react-redux"

// component for stop auto renew
import StopAutoRenew from './StopRenewData';

// class for Subscribe Plan 
class SubScribePlan extends React.Component {

    // define constrctor and set default state
    constructor(props) {
        super(props)
        var readOnly = [], fullAccess = [];

        if (props.selectedData.ReadOnlyAPI) {
            readOnly = Object.entries(props.selectedData.ReadOnlyAPI).map(([key, value]) => ({ key, value }));
        }

        if (props.selectedData.FullAccessAPI) {
            fullAccess = Object.entries(props.selectedData.FullAccessAPI).map(([key, value]) => ({ key, value }));
        }

        var balance = 0, coin = ""
        if (this.props.wallets) {
            this.props.wallets.map((item, key) => {
                if (item.CoinName === this.props.selectedData.Coin && item.IsDefaultWallet === 1) {
                    balance = item.Balance
                    coin = item.CoinName
                }
            })
        }

        this.state = {
            planList: props.selectedData,
            ReadOnlyAPI: readOnly,
            fullAccessApi: fullAccess,
            modal: false, // Defines Whether Modal Is displayed Or Not
            autoRenewData: {},
            openMenu: null,
            setAutoRenew: false,
            openUpgrade: false,
            OpenDownGrade: false,
            stopAutoRenewData: false,
            manualRenewModal: false,
            manualRenewConfirmModal: false,
            getCustomLimitData: [],
            getLimits: 0,
            isLimitAvailable: false,
            isSetCustomLimit: false,
            isEditCustomLimit: false,
            isViewCustomLimit: false,
            currentBalance: balance !== 0 ? balance : 0,
            currentCoin: coin !== "" ? coin : ""

        }

    }

    // get custom limits
    componentWillMount() {

        this.setState({
            getLimits: 1,
            isEditCustomLimit: false,
            isSetCustomLimit: false
        })
        this.props.getCustomLimits({ SubscribeId: this.state.planList.SubscribeID ? this.state.planList.SubscribeID : 0 })
    }

    // get custom limits for child component
    CallCustomLimits = () => {
        this.setState({
            getLimits: 1,
            isEditCustomLimit: false,
            isSetCustomLimit: false,
            isViewCustomLimit: false
        })
        this.props.getCustomLimits({ SubscribeId: this.state.planList.SubscribeID ? this.state.planList.SubscribeID : 0 })
    }

    //invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        if (nextprops.getCustomLimitData !== null && this.state.getLimits === 1) {

            this.setState({
                getCustomLimitData: nextprops.getCustomLimitData,
                getLimits: 0,
                isLimitAvailable: true
            })
        }
    }

    //used for close modal
    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({
            modal: false,
            openUpgrade: false,
            OpenDownGrade: false
        })
    }

    // close auto renew modal
    CloseAutoRenew = () => {
        this.setState({
            stopAutoRenewData: false,
        })
    }

    // used for openmodal for subscription
    openModal = (event) => {
        event.preventDefault();
        this.setState({
            modal: true,
            openUpgrade: false,
            OpenDownGrade: false
        })
    }

    // function for set auto renewa
    OpenRenewModal = (item) => {

        if (item && item.IsAutoRenew === 1) {

            this.setState({
                manualRenewConfirmModal: true
            })
        } else {
            this.setState({
                manualRenewModal: true
            })
        }
    }

    // clse renew Modal
    CloseManualRenew = () => {
        this.setState({
            manualRenewModal: false,
            manualRenewConfirmModal: false
        })
    }

    // open modal for confirmation
    onConfirmManualRenew = () => {
        this.setState({
            manualRenewModal: true,
            manualRenewConfirmModal: false
        })
    }

    // handle close and Close Dialog
    handleClose = () => {
        this.setState({
            setAutoRenew: false,
            autoRenewData: {},
        });
    }

    // used for set data and call api for subscribe 
    SubscribeConfirmPlan = () => {

        if (this.state.currentBalance < this.state.planList.Price) {

            NotificationManager.error(<IntlMessages id="trading.placeorder.error.minBalance" />)
        } else {
            const data = {
                SubscribePlanID: this.state.planList.ID
            }


            this.setState({
                modal: false,
                openUpgrade: true,
                OpenDownGrade: false
            })
            this.props.subScribeApiPlan(data)

        }
    }

    // set data for set auto renew api plan
    SetAutoRenewPlan = () => {
        this.setState({
            setAutoRenew: true,
            autoRenewData: this.state.planList
        })
    }

    // used fro render UI Dat
    renderBodyContents = () => {

        return { __html: this.state.planList.PlanDesc }
    };

    // open modal for stop auto renew
    StopAutoRenew = () => {

        this.setState({
            stopAutoRenewData: true
        })
    }

    // used for open screen of update custom limit
    UpdateCustomLimit = () => {

        this.setState({
            isEditCustomLimit: true,
            isSetCustomLimit: true,
            isViewCustomLimit: false
        })
    }

    // used for close edit screen
    CloseEditField = () => {
        this.setState({
            isEditCustomLimit: false,
            isSetCustomLimit: false,
            isViewCustomLimit: false
        })
    }

    // used for open custom limt screen
    setCustomLimitData = () => {
        this.setState({
            isSetCustomLimit: true
        })
    }

    // used fro open view custom limit screen
    ViewCustomLimits = () => {
        this.setState({
            isViewCustomLimit: true
        })
    }

    //render the component
    render() {

        return (
            <Fragment>

                {(this.props.subScribeLoading || this.props.getCustomLimitLoading) &&
                    <JbsSectionLoader />
                }
                {this.state.setAutoRenew === false &&
                    this.state.isSetCustomLimit === false &&
                    this.state.isViewCustomLimit === false &&
                    <Card className="m-20 p-10">
                        <div className="font-weight-bold text-primary text-center" style={{ fontSize: "24px" }}>
                            {this.state.planList.PlanName}
                        </div>
                        <div className="m-5 text-right"><IntlMessages id="wallet.AGAvailableBalance" /> {":"} {this.state.currentBalance.toFixed(8)} {" "} {this.state.currentCoin}</div>
                        <div className="m-0 row" style={{ borderTop: "2px solid" }}>
                            <Col md={3} sm={12}>
                                <Card className="mt-10" style={{ border: "none" }}>
                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxperday" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold">
                                            {this.state.planList.MaxPerDay}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpersec" />}

                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                            {this.state.planList.MaxOrderPerSec}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpermin" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                            {this.state.planList.MaxPerMinute}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpermonth" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold">
                                            {this.state.planList.MaxPerMonth}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxrecperreq" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                            {this.state.planList.MaxRecPerRequest}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.ApiPlan.whitelist" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold " >
                                            {this.state.planList.WhitelistedEndPoints}
                                        </Label>
                                    </Row>


                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.concurrentendpoints" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                            {this.state.planList.ConcurrentEndPoints}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.historical" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold " >
                                            {this.state.planList.HistoricalDataMonth} {this.state.planList.HistoricalDataMonth > 0 && <IntlMessages id="components.month" />}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxreq" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                            {this.state.planList.MaxReqSize}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxres" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                            {this.state.planList.MaxResSize}
                                        </Label>
                                    </Row>

                                    <div className="text-center font-weight-bold m-10">
                                        {<IntlMessages id="sidebar.apiplan.readonly.purchasedetails" />}
                                    </div>
                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.amountpaid" />}
                                        </Label>

                                        <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                            {this.state.planList.PaidAmt}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.paymentstatus" />}
                                        </Label>

                                        <Label for="planname" className={this.state.planList.PaymentStatus === 1 ?
                                            " col-sm-4 col-4 font-weight-bold text-success d-inline" : " col-sm-4 col-4 d-inline font-weight-bold text-danger"}>
                                            {this.state.planList.PaymentStatus === 1 ?
                                                <IntlMessages id="components.success" />
                                                :
                                                <IntlMessages id="sidebar.apiplan.notdone" />
                                            }
                                        </Label>
                                    </Row>


                                </Card>
                            </Col>

                            <Col md={2} sm={12} className="no-padding" style={{ border: "none" }}>
                                <Card className="mt-10" style={{ border: "none" }}>
                                    <div style={{ height: "90%" }}>
                                        <div className="text-center font-weight-bold m-10">
                                            {<IntlMessages id="sidebar.apiplan.readonly.methods" />}
                                        </div>

                                        {this.state.ReadOnlyAPI && this.state.ReadOnlyAPI.map((value, key) => {

                                            return <Row className="Subscrine-plan-font" key={key}>
                                                <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                    {value.value}
                                                </Label>

                                                <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold text-success" >
                                                    <i className="material-icons">done_outline</i>
                                                </Label>
                                            </Row>
                                        })}


                                        <div className="text-center font-weight-bold m-10">
                                            {<IntlMessages id="sidebar.apiplan.fullaccess.methods" />}
                                        </div>

                                        {this.state.fullAccessApi && this.state.fullAccessApi.map((value, key) => {
                                            return <Row className="Subscrine-plan-font" key={key}>
                                                <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                    {value.value}
                                                </Label>

                                                <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold text-success">
                                                    <i className="material-icons">done_outline</i>
                                                </Label>
                                            </Row>
                                        })}
                                    </div>
                                    <div className="d-flex mt-5 ">
                                        <Button size="medium"
                                            disabled={this.props.displayUpGrade}
                                            md={6}
                                            color="primary" className="fs-24 m-5"
                                            onClick={() => {
                                                this.setState({
                                                    modal: false,
                                                    openUpgrade: true,
                                                    OpenDownGrade: false
                                                })
                                            }}

                                        >
                                            <IntlMessages id="sidebar.btnupgrade" />
                                        </Button>


                                        <Button size="medium"
                                            disabled={this.props.displayDownGrade}
                                            md={6}
                                            color="danger" className="fs-24 m-5"
                                            onClick={() => {
                                                this.setState({
                                                    modal: false,
                                                    openUpgrade: false,
                                                    OpenDownGrade: true
                                                })
                                            }}
                                        >
                                            <IntlMessages id="sidebar.btndowngrade" />
                                        </Button>

                                    </div>

                                </Card>
                            </Col>

                            <Col md={4} sm={12}>
                                <Card className="mt-10" style={{ border: "none" }}>
                                    <div style={{ height: "90%" }}>
                                        <div className="text-center font-weight-bold text-primary" style={{ fontSize: "20px" }}>

                                            {<IntlMessages id="sidebar.ApiPlan.title.subscription.details" />}

                                        </div>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.status" />}
                                            </Label>

                                            <Label for="planname" className={this.state.planList.SubScribeStatus === 1 ? " col-sm-4 col-4 font-weight-bold d-inline" : " col-sm-4 col-4 d-inline"}>
                                                {this.state.planList.SubScribeStatus === 1 ?
                                                    <IntlMessages id="sidebar.apiplan.button.alreadysubscribe" /> :

                                                    this.state.planList.SubScribeStatus === 9 ?
                                                        <IntlMessages id="sidebar.apiplan.expire" /> :

                                                        this.state.planList.SubScribeStatus === 6 ?
                                                            <IntlMessages id="widgets.pending" /> :

                                                            this.state.planList.SubScribeStatus === 0 ?
                                                                <IntlMessages id="sidebar.inProcess" /> :
                                                                "-"
                                                }
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.request" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold ">
                                                {this.state.planList.RequestedDate && this.state.planList.RequestedDate.replace('T', ' ').split('.')[0]}
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.active" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                                {this.state.planList.ActivationDate && this.state.planList.ActivationDate.replace('T', ' ').split('.')[0]}
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.auto" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold ">
                                                {this.state.planList.IsAutoRenew === 1 ?
                                                    <IntlMessages id="sidebar.apiplan.on" /> :
                                                    <IntlMessages id="sidebar.apiplan.off" />
                                                }
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.renewaldate" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold " >
                                                {this.state.planList.RenewDate && this.state.planList.RenewDate.replace('T', ' ').split('.')[0]}
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.renewalstatus" />}
                                            </Label>

                                            <Label for="planname" className={this.state.planList.RenewStatus === 1 ? " col-sm-4 col-4 text-info d-inline font-weight-bold" : " col-sm-4 col-4 text-warning d-inline font-weight-bold"}>
                                                {this.state.planList.RenewStatus === 1 ?
                                                    <IntlMessages id="button.yes" />
                                                    :
                                                    "-"
                                                }
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.validity" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold " >
                                                {this.state.planList.PlanValidity} {" "} {
                                                    this.state.planList.PlanValidityType === 1 ?
                                                        <IntlMessages id="sidebar.ApiPlan.day" /> :
                                                        this.state.planList.PlanValidityType === 2 ?
                                                            <IntlMessages id="components.month" /> :
                                                            this.state.planList.PlanValidityType === 3 ?
                                                                <IntlMessages id="components.year" /> : "-"
                                                }
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.planrecursive" />}
                                            </Label>

                                            <Label for="planname" className={this.state.planList.IsPlanRecursive ? " col-sm-4 col-4 text-info d-inline font-weight-bold" : " col-sm-4 col-4 text-warning font-weight-bold d-inline"}>
                                                {this.state.planList.IsPlanRecursive === 1 ?
                                                    <i className="material-icons font-weight-bold">done</i> :
                                                    <i className="material-icons font-weight-bold">clear</i>
                                                }
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="components.expiryDate" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold">
                                                {this.state.planList.ExpiryDate && this.state.planList.ExpiryDate.replace('T', ' ').split('.')[0]}
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.ApiPlan.title.subscription.amount" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold" >
                                                {this.state.planList.PlanPrice}
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="sidebar.fees" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold">
                                                {this.state.planList.Charge}
                                            </Label>
                                        </Row>

                                        <Row className="Subscrine-plan-font p-5">
                                            <Label for="planname" className="col-sm-8 col-8" style={{ fontFamily: "cursive" }}>
                                                {<IntlMessages id="myaccount.tradeSummaryColumn.netTotal" />}
                                            </Label>

                                            <Label for="planname" className="col-sm-4 col-4 d-inline font-weight-bold">
                                                {this.state.planList.TotalAmt}
                                            </Label>
                                        </Row>
                                    </div>
                                    <div className="d-flex h-10 mt-5">
                                        {this.state.planList.IsPlanRecursive === 1 &&
                                            <Col md={12} className="d-block">
                                                <Button size="medium"
                                                    md={6}
                                                    color="primary" className="fs-24 m-5"
                                                    onClick={() => this.OpenRenewModal(this.state.planList)}
                                                >
                                                    <IntlMessages id="sidebar.ApiPlan.title.renew" />
                                                </Button>

                                                <Button size="medium"
                                                    md={6}
                                                    color="success" className="fs-24 m-5"
                                                    onClick={this.SetAutoRenewPlan}
                                                    disabled={this.state.planList.IsAutoRenew === 1}
                                                >
                                                    <IntlMessages id="sidebar.ApiPlan.title.setAutorenew" />
                                                </Button>

                                                <Button size="medium"
                                                    md={6}
                                                    color="danger" className="fs-24 m-5"
                                                    onClick={this.StopAutoRenew}
                                                    disabled={this.state.planList.IsAutoRenew === 0}
                                                >
                                                    <IntlMessages id="sidebar.ApiPlan.title.stopautorenew" />
                                                </Button>


                                            </Col>
                                        }
                                    </div>


                                </Card>
                            </Col>

                            {this.state.isLimitAvailable === false ?
                                <Col md={3} sm={12} className="align-items-center">
                                    <Card className="mt-10" style={{ border: "none" }}>
                                        <CustomLimitNotAvailable
                                            setCustomLimitData={this.setCustomLimitData}
                                        />
                                    </Card>
                                </Col>
                                :
                                <Col md={3} sm={12}>
                                    <Card className="mt-10" style={{ border: "none" }}>
                                        <CustomLimits
                                            customLimits={this.state.getCustomLimitData}
                                            isSetCustomLimit={this.state.isSetCustomLimit}
                                            ViewCustomLimits={this.ViewCustomLimits}

                                        />
                                    </Card>
                                </Col>
                            }

                        </div>
                    </Card>
                }
                <Modal isOpen={this.state.modal}>
                    <h1 className="text-center mt-5">
                        <IntlMessages id="sidebar.apiplan.subscribe" />
                    </h1>
                    <ModalBody>
                        <IntlMessages id="sidebar.apiplan.subscribe.sure" />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white"
                            onClick={() => this.SubscribeConfirmPlan()}
                        >
                            <span>
                                <IntlMessages id="wallet.btnConfirm" />
                            </span>
                        </Button>
                        <Button
                            variant="raised"
                            onClick={(event) => this.handleCloseModal(event)}
                            className="btn-danger text-white"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.openUpgrade}>
                    <h1 className="text-center mt-5 text-danger">
                        <IntlMessages id="components.warning" />
                    </h1>

                    <ModalBody>

                        <div style={{ position: "relative", display: "contents" }} className="m-10 p-0">

                            <i className="material-icons text-center d-block text-danger" style={{ fontSize: "50px" }}>error</i>

                            <h3> <IntlMessages id="sidebar.apiplan.subscribe.upgrade.message" /></h3>

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white"
                            onClick={() => this.props.setApiPlanData(this.state.planList, "upgrade")}
                        >
                            <span>
                                <IntlMessages id="wallet.btnConfirm" />
                            </span>
                        </Button>
                        <Button
                            variant="raised"
                            onClick={(event) => this.handleCloseModal(event)}
                            className="btn-danger text-white"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.OpenDownGrade}>
                    <h1 className="text-center mt-5 text-danger">
                        <IntlMessages id="components.warning" />
                    </h1>
                    <ModalBody>

                        <div style={{ position: "relative", display: "contents" }} className="m-10 p-0">

                            <i className="material-icons text-center d-block text-danger" style={{ fontSize: "50px" }}>error</i>

                            <h3> <IntlMessages id="sidebar.apiplan.subscribe.downgrade.message" /></h3>


                        </div>

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white"
                            onClick={() => this.props.setApiPlanData(this.state.planList, "downgrade")}
                        >
                            <span>
                                <IntlMessages id="wallet.btnConfirm" />
                            </span>
                        </Button>
                        <Button
                            variant="raised"
                            onClick={(event) => this.handleCloseModal(event)}
                            className="btn-danger text-white"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.manualRenewConfirmModal}>
                    <h1 className="text-center mt-5 text-danger">
                        <IntlMessages id="components.warning" />
                    </h1>
                    <ModalBody>

                        <div className="m-10 p-0">

                            <h3 className="text-danger"><IntlMessages id={`sidebar.apiPlan.manualrenew.Confirm`}
                                values={{
                                    Param1: this.state.planList.ExpiryDate ? this.state.planList.ExpiryDate.replace('T', ' ').split('.')[0] : "",
                                }} />
                            </h3>

                        </div>

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="raised"
                            onClick={(event) => this.CloseManualRenew(event)}
                            className="btn-danger text-white"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>

                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white"
                            onClick={() => this.onConfirmManualRenew()}
                        >
                            <span>
                                <IntlMessages id="wallet.btnConfirm" />
                            </span>
                        </Button>

                    </ModalFooter>
                </Modal>


                {this.state.setAutoRenew === true &&
                    this.state.isSetCustomLimit === false &&
                    this.state.isViewCustomLimit === false &&

                    <AutoRenew selectedData={this.state.autoRenewData}
                        handleCloseAutoRenew={this.handleClose}
                        callRecords={this.props.callRecords}
                    />
                }

                {this.state.setAutoRenew === false &&
                    this.state.isSetCustomLimit === true &&
                    this.state.isViewCustomLimit === false &&

                    <SetCustomLimits
                        customLimits={this.state.getCustomLimitData}
                        SubscribeID={this.state.planList.SubscribeID ? this.state.planList.SubscribeID : 0}
                        CloseEditField={this.CloseEditField}
                        CallCustomLimits={this.CallCustomLimits}
                        ReadOnlyAPI={this.state.ReadOnlyAPI ? this.state.ReadOnlyAPI : null}
                        FullAccessAPI={this.state.fullAccessApi ? this.state.fullAccessApi : null}
                        IsUpdate={this.state.isEditCustomLimit ? true : false}
                    />
                }

                {this.state.isViewCustomLimit && this.state.setAutoRenew === false && this.state.isSetCustomLimit === false

                    &&
                    <ViewCustomLimits
                        customLimits={this.state.getCustomLimitData}
                        UpdateCustomLimit={this.UpdateCustomLimit}
                        CloseEditField={this.CloseEditField}
                        CallCustomLimits={this.CallCustomLimits}
                    />

                }


                <Modal isOpen={this.state.stopAutoRenewData} className="stopRenew">
                    <StopAutoRenew
                        handleClose={this.CloseAutoRenew}
                        callRecords={this.props.callRecords}
                    />
                </Modal>

                <Modal isOpen={this.state.manualRenewModal} className="stopRenew">
                    <ManualRenew
                        handleClose={this.CloseManualRenew}
                        callRecords={this.props.callRecords}
                        renewData={this.state.planList}
                        planData={this.props.planData}
                        wallets={this.props.wallets}
                    />
                </Modal>
            </Fragment>
        )
    }
}


// map states to props when changed in states from reducer
const mapStateToProps = ({ apiPlan, customLimits }) => {
    const {
        subscribeData,
        subScribeLoading,
        error,
    } = apiPlan;

    const {
        getCustomLimitData,
        getCustomLimitLoading,
        getCustomLimitError,
    } = customLimits

    return {
        subscribeData,
        subScribeLoading,
        error,
        getCustomLimitData,
        getCustomLimitLoading,
        getCustomLimitError,
    }
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    subScribeApiPlan,
    getAutoRenewalPlan,
    getCustomLimits
})(SubScribePlan);
