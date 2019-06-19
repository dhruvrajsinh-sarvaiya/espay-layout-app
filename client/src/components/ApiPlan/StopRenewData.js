import React, { Fragment, Component } from "react";

// component for stop auto renew data By Tejas 12/3/2019

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
    getAutoRenewalPlan,
    stopAutoRenewal
} from 'Actions/ApiPlan';

// used for connect
import { connect } from "react-redux"
import { NotificationManager } from "react-notifications";

// class for stop auto renew
class StopAutoRenew extends Component {

    // construcrtor
    constructor(props) {
        super(props)

        this.state = {
            getAutoRenewData: {},
            getAutoRenew: 0,
            stopAutoRenew: 0,
        }

    }
    // invoke after renders the compoennt
    componentDidMount() {
        this.setState({
            getAutoRenew: 1
        })
        this.props.getAutoRenewalPlan({})
    }

    // invoke when component is about to get new props
    componentWillReceiveProps(nextprops) {

        if (nextprops.getAutoRenewData && this.state.getAutoRenew === 1) {
            this.setState({
                getAutoRenewData: nextprops.getAutoRenewData
            })
        }

        if (this.state.stopAutoRenew === 1 && nextprops.stopAutoRenewData.ReturnCode === 0) {

            this.setState({
                stopAutoRenew: 0
            })
            NotificationManager.success(<IntlMessages id="sidebar.apiplan.success.stopAuto" />)
            this.props.handleClose()
            this.props.callRecords()
        } else if (this.state.stopAutoRenew === 1 && nextprops.stopAutoRenewError.ReturnCode === 1) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.setAutoRenewError.ErrorCode}`} />);
            this.setState({
                stopAutoRenew: 0
            })
            this.props.handleClose()
        }
    }

    // call api for StopAutoRenew
    StopAutoRenew = () => {
        const data = {
            AutoRenewID: this.state.getAutoRenewData.RenewID,
            SubscribeID: this.state.getAutoRenewData.SubscribeID
        }

        this.setState({
            stopAutoRenew: 1
        })
        this.props.stopAutoRenewal(data)
    }

    //renders the compoennt
    render() {
        return (
            <Fragment>
                {
                    (this.props.getAutoRenewLoading || this.props.stopAutoRenewLoading)
                    &&
                    <JbsSectionLoader />}
                <Row className="m-0">
                    <Col md={12} className="font-weight-bold m-5" style={{ fontSize: "24px" }}>
                        <IntlMessages id="sidebar.apiplan.stopAutoRenew.apiplan" />
                    </Col>

                </Row>

                <ModalBody >
                    <Col md={12} className="d-flex">
                        <Col md={5} style={{ borderRight: "1px solid" }}>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire.planname" />
                                </Col>

                                <Col md={6}>
                                    <p className="font=weight-bold">{this.state.getAutoRenewData.PlanName}</p>
                                </Col>

                            </Row>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="table.Status" />
                                </Col>

                                <Col md={6}>
                                    {this.state.getAutoRenewData.Status === 1 ?
                                        <p className="text-info font-weight-bold"><IntlMessages id="sidebar.active" /></p>
                                        :
                                        <p className="text-warning font-weight-bold"><IntlMessages id="sidebar.inActive" /></p>
                                    }
                                </Col>

                            </Row>
                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.subscription.validity" />
                                </Col>

                                <Col md={6}>
                                    <p> {this.state.getAutoRenewData.Validity} {" "} {
                                        this.state.getAutoRenewData.PlanValidityType === 1 ?
                                            <IntlMessages id="sidebar.ApiPlan.day" /> :
                                            this.state.getAutoRenewData.PlanValidityType ===2 ?
                                                <IntlMessages id="components.month" /> :
                                                this.state.getAutoRenewData.PlanValidityType === 3 ?
                                                    <IntlMessages id="components.year" /> : "-"

                                    }
                                    </p>
                                </Col>

                            </Row>


                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="components.expiryDate" />
                                </Col>

                                <Col md={6}>
                                    {this.state.getAutoRenewData.ExpiryDate ?
                                        this.state.getAutoRenewData.ExpiryDate.replace('T', ' ').split('.')[0]
                                        : ""}
                                </Col>

                            </Row>

                        </Col>

                        <Col md={7}>
                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.subscription.amount" />
                                </Col>

                                <Col md={6}>
                                    {this.state.getAutoRenewData.Amount}
                                </Col>

                            </Row>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.fees" />
                                </Col>

                                <Col md={6}>
                                    {this.state.getAutoRenewData.Fees}
                                </Col>

                            </Row>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="myaccount.tradeSummaryColumn.netTotal" />
                                </Col>

                                <Col md={6}>
                                    {this.state.getAutoRenewData.TotalAmt}
                                </Col>

                            </Row>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire" />
                                </Col>

                                <Col md={6}>
                                    <p> {this.state.getAutoRenewData.Days} {" "}

                                        {<IntlMessages id="sidebar.ApiPlan.title.autorenewalexpire.days" />}
                                    </p>
                                </Col>

                            </Row>

                            <Row className="m-0">
                                <Col md={6}>
                                    <IntlMessages id="sidebar.ApiPlan.title.subscription.nextRenewal" />
                                </Col>

                                <Col md={6}>
                                    {this.state.getAutoRenewData.NextRenewDate ?
                                        this.state.getAutoRenewData.NextRenewDate.replace('T', ' ').split('.')[0]
                                        : ""}
                                </Col>

                            </Row>
                        </Col>

                    </Col>

                    <Row className="m-0 mt-10">
                        <p className="font-weight-bold">
                            {<IntlMessages id="widgets.note.colon" />}
                        </p>
                        <p className="font-weight-bold text-danger"><IntlMessages id={`sidebar.apiPlan.note.stopAuto.Confirm`}
                            values={{
                                Param1: this.state.getAutoRenewData.PlanName,
                                Param2: this.state.getAutoRenewData.NextRenewDate ? this.state.getAutoRenewData.NextRenewDate.replace('T', ' ').split('.')[0] : ""
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
                            onClick={() => this.StopAutoRenew()}
                        >
                            <span>
                                <IntlMessages id="sidebar.ApiPlan.title.stopautorenew" />
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
        getAutoRenewLoading,
        getAutoRenewData,
        getAutoRenewError,
        stopAutoRenewData,
        stopAutoRenewLoading,
        stopAutoRenewError,
    } = apiPlan;
    return {
        getAutoRenewLoading,
        getAutoRenewData,
        getAutoRenewError,
        stopAutoRenewData,
        stopAutoRenewLoading,
        stopAutoRenewError
    }
}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        getAutoRenewalPlan,
        stopAutoRenewal
    })(StopAutoRenew);