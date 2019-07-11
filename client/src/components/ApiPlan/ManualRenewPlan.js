import React, { Fragment, Component } from "react";

// component for  Manual  renew data By Tejas 13/3/2019

// import for design
import {
    Row,
    Col,
    Button,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import neccessary actions for fetch records
import {
    manualRenewPlan
} from 'Actions/ApiPlan';

// used for connect
import { connect } from "react-redux"
import { NotificationManager } from "react-notifications";

// class for stop auto renew
class ManualRenew extends Component {

    // construcrtor
    constructor(props) {
        super(props)
        let plan = {}
        if (this.props.planData) {
            this.props.planData.map((item, key) => {
                if (item.SubscribeID === this.props.renewData.SubscribeID) {
                    plan = item
                }
            })
        }

        var balance = 0;
        if (this.props.wallets) {
            this.props.wallets.map((item, key) => {
                if (item.CoinName === plan.Coin && item.IsDefaultWallet === 1) {
                    balance = item.Balance
                }
            })
        }

        this.state = {
            manualRenew: 0,
            plan: plan ? plan : {},
            currentBalance: balance !== 0 ? balance : 0
        }

    }

    // invoke when component is about to get new props
    componentWillReceiveProps(nextprops) {

        if (this.state.manualRenew === 1 && nextprops.manualRenewData.ReturnCode === 0) {
            this.setState({
                manualRenew: 0
            })
            NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.manualrenew" />)
            this.props.handleClose()
            this.props.callRecords()
        } else if (this.state.manualRenew === 1 && nextprops.manualRenewError.ReturnCode === 1) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.manualRenewError.ErrorCode}`} />);
            this.setState({
                manualRenew: 0
            })
            this.props.handleClose()
        }
    }

    // call api for StopAutoRenew
    ManualRenew = () => {
        if (this.state.currentBalance < this.props.renewData.Price) {
            NotificationManager.error(<IntlMessages id="trading.placeorder.error.minBalance" />)
        } else {
            const data = {
                SubscribePlanID: this.props.renewData.SubscribeID,
                ChannelID: 21
            }

            this.setState({
                manualRenew: 1
            })
            this.props.manualRenewPlan(data)
        }

    }

    //renders the compoennt
    render() {
        let planData = {}
        if (this.props.planData.length > 0) {
            this.props.planData.map((item, key) => {
                if (item.Priority === this.props.renewData.Priority) {
                    planData = item
                }
            })
        }


        return (
            <Fragment>
                {
                    this.props.manualRenewLoading
                    &&
                    <JbsSectionLoader />}
                <Row className="m-0">
                    <Col md={6} className="font-weight-bold mt-5" style={{ fontSize: "24px" }}>
                        <IntlMessages id="sidebar.apiplan.manualrenew.apiplan" />
                    </Col>
                    <Col md={6} className="d-inline mt-5 text-right">
                        <IntlMessages id="wallet.AGAvailableBalance" /> {": "} {parseFloat(this.state.currentBalance).toFixed(8)} {" "} {this.state.plan.Coin}
                    </Col>
                </Row>

                <ModalBody >
                    <Col md={12} className="d-flex">
                        <Col md={6} style={{ borderRight: "1px solid" }}>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire.planname" />
                                </Col>

                                <Col md={6} className="font-weight-bold">
                                    <p className="font=weight-bold">{this.props.renewData.PlanName}</p>
                                </Col>
                            </Row>
                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="table.Status" />
                                </Col>

                                <Col md={6}>
                                    {this.props.renewData.PlanStatus === 1 ?
                                        <p className="text-info font-weight-bold"><IntlMessages id="sidebar.active" /></p>
                                        :

                                        this.props.renewData.PlanStatus === 2 ?

                                            <p className="text-info font-weight-bold"><IntlMessages id="sidebar.apiplan.requested" /></p> :

                                            this.props.renewData.PlanStatus === 9 ?
                                                <p className="text-danger font-weight-bold"><IntlMessages id="sidebar.inActive" /></p>
                                                : ""
                                    }
                                </Col>

                            </Row>
                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.subscription.validity" />
                                </Col>
                                <Col md={6} className="font-weight-bold">
                                    <p> {this.props.renewData.PlanValidity} {" "} {
                                        this.props.renewData.PlanValidityType === 1 ?
                                            <IntlMessages id="sidebar.ApiPlan.day" /> :
                                            this.props.renewData.PlanValidityType === 2 ?
                                                <IntlMessages id="components.month" /> :
                                                this.props.renewData.PlanValidityType === 3 ?
                                                    <IntlMessages id="components.year" /> : "-"

                                    }
                                    </p>
                                </Col>
                            </Row>
                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="components.expiryDate" />
                                </Col>

                                <Col md={6} className="font-weight-bold">
                                    {this.props.renewData.ExpiryDate ?
                                        this.props.renewData.ExpiryDate.replace('T', ' ').split('.')[0]
                                        : ""}
                                </Col>
                            </Row>
                        </Col>

                        <Col md={6}>
                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.subscription.amount" />
                                </Col>

                                <Col md={6} className="font-weight-bold">
                                    {planData.Price}
                                </Col>

                            </Row>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.fees" />
                                </Col>

                                <Col md={6} className="font-weight-bold">
                                    {planData.Charge}
                                </Col>

                            </Row>

                            <Row className="m-0 ">
                                <Col md={6}>
                                    <IntlMessages id="myaccount.tradeSummaryColumn.netTotal" />
                                </Col>

                                <Col md={6} className="font-weight-bold">
                                    {planData.Price * planData.Charge}
                                </Col>

                            </Row>
                        </Col>

                    </Col>

                    <Row className="m-0 mt-10 text-center">
                        <p className="font-weight-bold text-danger"><IntlMessages id={`sidebar.apiPlan.note.manualrenew.Confirm`}
                            values={{
                                Param1: this.props.renewData.PlanName,
                                Param2: this.props.renewData.NextRenewDate ? this.props.renewData.NextRenewDate.replace('T', ' ').split('.')[0] : ""
                            }} />
                        </p>
                    </Row>
                </ModalBody>

                <ModalFooter>
                    <Col md={{ size: "8", offset: "4" }} className="d-flex m-0">

                        <Button
                            variant="raised"
                            onClick={() => this.props.handleClose()}
                            className="btn-danger text-white m-5"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>

                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white m-5"
                            onClick={() => this.ManualRenew()}
                        >
                            <span>
                                <IntlMessages id="sidebar.ApiPlan.title.renew" />
                            </span>
                        </Button>

                    </Col>
                </ModalFooter>
            </Fragment>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ apiPlan }) => {
    const {
        manualRenewLoading,
        manualRenewData,
        manualRenewError
    } = apiPlan;
    return {
        manualRenewLoading,
        manualRenewData,
        manualRenewError
    }
}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        manualRenewPlan
    })(ManualRenew);