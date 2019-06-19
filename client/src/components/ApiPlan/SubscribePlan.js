//component for subscribe api plan By Tejas Date 27/2/2019

import React, { Fragment } from 'react';
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

// used for display notification
import { NotificationManager } from 'react-notifications';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import neccessary actions for fetch records
import {
    subScribeApiPlan
} from 'Actions/ApiPlan';

// used for connect component
import { connect } from "react-redux"

// import neccessary actions for fetch records
import {
    getApiPlanList,
    getUserActivePlan
} from 'Actions/ApiPlan';

// class for Subscribe Plan 
class SubScribePlan extends React.Component {

    // define constrctor and set default state
    constructor(props) {
        super(props)

        var balance = 0,coin=""
        if (this.props.wallets) {
            this.props.wallets.map((item, key) => {
                if (item.CoinName == this.props.selectedData.Coin && item.IsDefaultWallet == 1) {
                    balance = item.Balance,
                    coin = item.CoinName
                }
            })
        }

        this.state = {
            planList: props.selectedData,
            SubscribeID: props.SubscribeID,
            modal: false, // Defines Whether Modal Is displayed Or Not    
            subscribe: false,
            currentBalance: balance !== 0 ? balance : 0,
            currentCoin:coin !== "" ? coin : ""
        }
    }

    // invoke when component is about to get props 
    componentWillReceiveProps(nextprops) {

        //set state for subscribe data
        if (nextprops.subscribeData && nextprops.subscribeData.ErrorCode == 2253) {

            if (this.state.SubscribeID == 0) {

                NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.subscribe" />)
                this.props.closeAllModal()

            } else if (this.state.SubscribeID > this.state.planList.ID) {

                NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.upgrade" />)
                this.props.closeAllModal()
            } else if (this.state.SubscribeID < this.state.planList.ID) {

                NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.downgrade" />)
                this.props.closeAllModal()
            }

        } else if (nextprops.error && nextprops.error.ReturnCode == 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
            this.props.getApiPlanList()
            this.props.closeAllModal()
            this.props.getUserActivePlan()
        }
    }

    //used for close modal
    handleCloseModal = () => {
        event.preventDefault();
        this.setState({
            modal: false
        })
    }

    // used for open modal
    openModal = (event) => {
        event.preventDefault();
        if (this.props.isUpgrade || this.props.isDowngrade) {

            this.SubscribeConfirmPlan()
        } else {
            this.setState({
                modal: true
            })
        }
    }

    //used fro subscribe plan
    SubscribeConfirmPlan = () => {

        if (this.state.SubscribeID !== 0) {

            if (this.state.currentBalance < this.state.planList.Price) {

                NotificationManager.error(<IntlMessages id="trading.placeorder.error.minBalance" />)
            } else {
                const data = {
                    SubscribePlanID: this.state.planList.ID,
                    OldPlanID: this.state.SubscribeID,
                    ChannelID: 21
                }

                this.setState({
                    modal: false,
                    subscribe: true
                })
                this.props.subScribeApiPlan(data)
            }

        } else if (this.state.SubscribeID == 0) {

            if (this.state.currentBalance < this.state.planList.Price) {

                NotificationManager.error(<IntlMessages id="trading.placeorder.error.minBalance" />)
            } else {

                const data = {
                    SubscribePlanID: this.state.planList.ID,
                    ChannelID: 21
                }

                this.setState({
                    modal: false,
                    subscribe: true
                })
                this.props.subScribeApiPlan(data)
            }


        }

    }

    // redner the component
    renderBodyContents = () => {

        return { __html: this.state.planList.PlanDesc }
    };

    // render the component
    render() {
        
        return (
            <Fragment>

                {this.props.subScribeLoading &&
                    <JbsSectionLoader />
                }


                {this.state.subscribe == false &&

                    <Card className="m-20 p-10">                        
                        <div className="font-weight-bold text-primary text-center" style={{ fontSize: "24px" }}>
                            {this.state.planList.PlanName}                            
                        </div>
                        <div className="m-5 text-right"><IntlMessages id="wallet.AGAvailableBalance" /> {":"} {this.state.currentBalance.toFixed(8) } {" "} {this.state.currentCoin}</div>
                        <div className="m-0 row">

                            <Col md={4} sm={12}>
                                <Card className="p-10">
                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.planvalidity" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.PlanValidity + " "}
                                            {this.state.planList.PlanValidityType == 1 ? <IntlMessages id="sidebar.ApiPlan.day" /> :
                                                this.state.planList.PlanValidityType == 2 ?
                                                    <IntlMessages id="components.month" /> :
                                                    this.state.planList.PlanValidityType == 3 ?
                                                        <IntlMessages id="components.year" /> : ""
                                            }
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxperday" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.MaxPerDay}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpersec" />}

                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.MaxOrderPerSec}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpermin" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.MaxPerMinute}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpermonth" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.MaxPerMonth}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxrecperreq" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.MaxRecPerRequest}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.ApiPlan.whitelist" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.WhitelistEndPoints}
                                        </Label>
                                    </Row>


                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.concurrentendpoints" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.ConcurrentEndPoints}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.historical" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.HistoricalDataMonth} {this.state.planList.HistoricalDataMonth > 0 && <IntlMessages id="components.month" />}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxreq" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.MaxReqSize}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font">
                                        <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxres" />}
                                        </Label>

                                        <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                            {this.state.planList.MaxResSize}
                                        </Label>
                                    </Row>

                                </Card>

                            </Col>

                            <Col md={4} sm={12}>
                                <Card className="p-10">
                                    <div className="text-center font-weight-bold">
                                        {<IntlMessages id="sidebar.apiplan.readonly.methods" />}
                                    </div>

                                    {this.state.planList.ReadOnlyAPI.map((value, key) => {
                                        return <Row className="Subscrine-plan-font" key={key}>
                                            <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                                {value}
                                            </Label>

                                            <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                                <i className="material-icons text-success">done_outline</i>
                                            </Label>
                                        </Row>
                                    })}


                                    <div className="text-center font-weight-bold m-10">
                                        {<IntlMessages id="sidebar.apiplan.fullaccess.methods" />}
                                    </div>

                                    {this.state.planList.FullAccessAPI.map((value, key) => {
                                        return <Row className="Subscrine-plan-font" key={key}>
                                            <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                                {value}
                                            </Label>

                                            <Label for="planname" sm={6} className="d-inline font-weight-bold">
                                                <i className="material-icons text-success">done_outline</i>
                                            </Label>
                                        </Row>
                                    })}
                                </Card>
                            </Col>



                            <Col md={4} sm={12}>
                                <Card className="p-10">
                                    <Row style={{ height: "90%" }} className="d-block m-0">
                                        <Label for="planname" style={{ fontSize: "24px" }} className="text-primary">
                                            {<IntlMessages id="sidebar.ApiPlan.title.plandesc" />}
                                        </Label>
                                        <div dangerouslySetInnerHTML={this.renderBodyContents()}></div>
                                    </Row>

                                </Card>
                            </Col>

                        </div>

                        <div className="m-0 text-center mt-5">
                            <Button size="medium"
                                md={6}
                                color="primary"
                                onClick={this.openModal}
                                className="m-5 fs-24 border-0 rounded-0 perverbtn"
                            >
                                {this.props.isUpgrade ? <IntlMessages id="sidebar.btnupgrade" />
                                    : this.props.isDowngrade ? <IntlMessages id="sidebar.btndowngrade" />
                                        : <IntlMessages id="sidebar.btnSubscribe" />}
                            </Button>


                            <Button size="medium"
                                md={6}
                                color="danger"
                                onClick={this.props.handleClose}
                                className="m-5 fs-24"
                            >
                                <IntlMessages id="button.back" />
                            </Button>
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
                            onClick={() => this.handleCloseModal()}
                            className="btn-danger text-white"
                        >
                            <span>
                                <IntlMessages id="button.cancel" />
                            </span>
                        </Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        )
    }
}

//export default ApiPlanComponent;
// map states to props when changed in states from reducer
const mapStateToProps = ({ apiPlan }) => {
    const {
        subscribeData,
        subScribeLoading,
        error,
    } = apiPlan;
    return { subscribeData, subScribeLoading, error }
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    subScribeApiPlan,
    getApiPlanList,
    getUserActivePlan
})(SubScribePlan)