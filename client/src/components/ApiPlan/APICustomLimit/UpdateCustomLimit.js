// component for Set API Custom limits By Tejas 14/9/2019


import React, { Component, Fragment } from 'react';
import validator from 'validator';
// import for design
import {
    Row,
    Col,
    Label,
    Button,
    Container,
    Input
} from 'reactstrap';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// used for connect
import { NotificationManager } from "react-notifications";

// import neccessary actions for fetch records
import {
    updateCustomLimits
} from 'Actions/ApiPlan';

// used for connect
import { connect } from "react-redux"

// class for Set API Custom Limits
class UpdateCustomLimits extends Component {

    // construcrtor
    constructor(props) {
        super(props)
        this.state = {
            customLimits: props.customLimits ? props.customLimits : {},
            SubscribeID: props.SubscribeID !== 0 ? props.SubscribeID : 0,
            isDefaultSet: false,
            LimitID: props.customLimits.LimitID !== "" ? props.customLimits.LimitID : "",
            maxCallPerDay: props.customLimits.MaxPerDay !== "" ? props.customLimits.MaxPerDay : "",
            maxCallPerMin: props.customLimits.MaxPerMinute !== "" ? props.customLimits.MaxPerMinute : "",
            maxCallPerMonth: props.customLimits.MaxPerMonth !== "" ? props.customLimits.MaxPerMonth : "",
            maxOrderPerSec: props.customLimits.MaxOrderPerSec !== "" ? props.customLimits.MaxOrderPerSec : "",
            maxRecRequest: props.customLimits.MaxRecPerRequest !== "" ? props.customLimits.MaxRecPerRequest : "",
            whiteListIPLimit: props.customLimits.WhitelistedEndPoints !== "" ? props.customLimits.WhitelistedEndPoints : "",
            concurrentIPAllow: props.customLimits.ConcurrentEndPoints !== "" ? props.customLimits.ConcurrentEndPoints : "",
            maxReqSize: props.customLimits.MaxReqSize !== "" ? props.customLimits.MaxReqSize : "",
            maxResSize: props.customLimits.MaxResSize !== "" ? props.customLimits.MaxResSize : "",
            historicalData: props.customLimits.HistoricalDataMonth !== "" ? props.customLimits.HistoricalDataMonth : "",
        }

    }

    // used for update custom limits
    UpdateCustomLimit = () => {

        const {
            SubscribeID,
            maxCallPerDay,
            maxCallPerMin,
            maxCallPerMonth,
            maxOrderPerSec,
            maxRecRequest,
            whiteListIPLimit,
            concurrentIPAllow,
            maxReqSize,
            maxResSize,
            historicalData,
            LimitID
        } = this.state

        if (maxCallPerDay === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerDay" />)
        } else if (maxCallPerMin === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerMin" />)
        } else if (maxCallPerMonth === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxCallPerMonth" />)
        } else if (maxOrderPerSec === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxOrderPerSec" />)
        } else if (maxRecRequest === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxRecRequest" />)
        } else if (whiteListIPLimit === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.whiteListIPLimit" />)
        } else if (concurrentIPAllow === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.concurrentIPAllow" />)
        } else if (maxReqSize === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxReqSize" />)
        } else if (maxResSize === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.maxResSize" />)
        } else if (historicalData === "") {

            NotificationManager.error(<IntlMessages id="sidebar.customLimits.error.historicalData" />)
        } else {
            const data = {
                SubscribeID: SubscribeID,
                MaxPerDay: maxCallPerDay,
                MaxPerMinute: maxCallPerMin,
                MaxPerMonth: maxCallPerMonth,
                MaxOrderPerSec: maxOrderPerSec,
                MaxRecPerRequest: maxRecRequest,
                WhitelistedEndPoints: whiteListIPLimit,
                ConcurrentEndPoints: concurrentIPAllow,
                MaxReqSize: maxReqSize,
                MaxResSize: maxResSize,
                HistoricalDataMonth: historicalData,
                ReadonlyAPI: [],
                FullAccessAPI: [],
                LimitID: LimitID
            }

            this.setState({
                isSetCustomLimit: 1
            })
            this.props.updateCustomLimits(data)

        }
    }

    // set state for textboxes
    HandleChangeMaxCall = (event) => {
        const regexNumeric = /^[0-9]+$/;
        if ((event.target.value === "") || (validator.matches(event.target.value, regexNumeric))) {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    // invoke when component is about to get new props
    componentWillReceiveProps(nextprops) {

        if (nextprops.customLimits) {

            this.setState({
                customLimits: nextprops.customLimits ? nextprops.customLimits : {},
                SubscribeID: nextprops.SubscribeID !== 0 ? nextprops.SubscribeID : 0,
                LimitID: nextprops.customLimits.LimitID !== "" ? nextprops.customLimits.LimitID : "",
                maxCallPerDay: nextprops.customLimits.maxCallPerDay !== "" ? nextprops.customLimits.maxCallPerDay : "",
                maxCallPerMin: nextprops.customLimits.maxCallPerMin !== "" ? nextprops.customLimits.maxCallPerMin : "",
                maxCallPerMonth: nextprops.customLimits.maxCallPerMonth !== "" ? nextprops.customLimits.maxCallPerMonth : "",
                maxOrderPerSec: nextprops.customLimits.maxOrderPerSec !== "" ? nextprops.customLimits.maxOrderPerSec : "",
                maxRecRequest: nextprops.customLimits.maxRecRequest !== "" ? nextprops.customLimits.maxRecRequest : "",
                whiteListIPLimit: nextprops.customLimits.whiteListIPLimit !== "" ? nextprops.customLimits.whiteListIPLimit : "",
                concurrentIPAllow: nextprops.customLimits.concurrentIPAllow !== "" ? nextprops.customLimits.concurrentIPAllow : "",
                maxReqSize: nextprops.customLimits.maxReqSize !== "" ? nextprops.customLimits.maxReqSize : "",
                maxResSize: nextprops.customLimits.maxResSize !== "" ? nextprops.customLimits.maxResSize : "",
                historicalData: nextprops.customLimits.historicalData !== "" ? nextprops.customLimits.historicalData : "",
            })
        }

        if (this.state.isSetCustomLimit === 1 && nextprops.updateCustomLimitData.ReturnCode === 0) {

            this.setState({
                isSetCustomLimit: 0
            })
            NotificationManager.success(<IntlMessages id="sidebar.customLimits.success.update" />)
        } else if (this.state.isSetCustomLimit === 1 && nextprops.updateCustomLimitError.ReturnCode === 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateCustomLimitError.ErrorCode}`} />);
            this.setState({
                isSetCustomLimit: 0
            })
        }
    }

    //used for close modal
    handleClose = (event) => {
        event.preventDefault();
        this.setState({
            modal: false,
            openUpgrade: false,
            OpenDownGrade: false
        })
    }

    //renders the component
    render() {

        const data = this.state.customLimits ? this.state.customLimits : {}
        return (
            <Fragment>
                {
                    this.props.updateCustomLimitLoading
                    &&
                    <JbsSectionLoader />}

                <Container className="Subscrine-plan-font">
                    <Row >
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.maxCallPerDay" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="maxCallPerDay"
                                value={this.state.maxCallPerDay}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.maxCallPermin" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="maxCallPerMin"
                                value={this.state.maxCallPerMin}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.maxCallPermonth" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="maxCallPerMonth"
                                value={this.state.maxCallPerMonth}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.maxOrderPerSecond" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="maxOrderPerSec"
                                value={this.state.maxOrderPerSec}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.maxRecRequest" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="maxRecRequest"
                                value={this.state.maxRecRequest}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.whiteListIPLimit" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="whiteListIPLimit"
                                value={this.state.whiteListIPLimit}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.concurrentIPAllow" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="concurrentIPAllow"
                                value={this.state.concurrentIPAllow}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.maxReqSize" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="maxReqSize"
                                value={this.state.maxReqSize}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.maxResSize" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="maxResSize"
                                value={this.state.maxResSize}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <IntlMessages id="sidebar.customLimits.field.title.historicalData" />
                        </Col>

                        <Col md={6} className="mb-2">
                            <Input type="text"
                                name="historicalData"
                                value={this.state.historicalData}
                                onChange={this.HandleChangeMaxCall}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col md={12} className="text-center font-weight-bold m-10">
                            {<IntlMessages id="sidebar.apiplan.readonly.methods" />}
                        </Col>

                        {data.ReadOnlyAPI && Object.values(data.ReadOnlyAPI).map((value, key) => {

                            return <Col md={12} className="Subscrine-plan-font d-flex" key={key}>
                                <Label for="planname" sm={6}>
                                    {value}
                                </Label>


                                <Label for="planname" sm={6} className="d-inline">
                                    <Input type="checkbox"
                                        onChange={this.onChangeReadOnlyAPI}
                                        name="check" id="readOnlyAPI" value={value} />
                                </Label>
                            </Col>
                        })}


                        <Col md={12} className="text-center font-weight-bold m-10">
                            {<IntlMessages id="sidebar.apiplan.fullaccess.methods" />}
                        </Col>

                        {data.FullAccessAPI && Object.values(data.FullAccessAPI).map((value, key) => {
                            return <Col md={12} className="Subscrine-plan-font d-flex" key={key}>
                                <Label for="planname" sm={6}>
                                    {value}
                                </Label>


                                <Label for="planname" sm={6} className="d-inline">
                                    <Input type="checkbox"
                                        onChange={this.onChangeFullAccessAPI}
                                        name="check" id="fullaccessAPI" value={value} />
                                </Label>
                            </Col>
                        })}
                    </Row>


                    <Row>

                        <Button
                            variant="raised"
                            onClick={(event) => this.props.CloseEditField(event)}
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
                            onClick={() => this.UpdateCustomLimit()}
                        >
                            <span>
                                <IntlMessages id="sidebar.apikey.title.btnupdate" />
                            </span>
                        </Button>

                    </Row>
                </Container>

            </Fragment>
        )
    }
}


// map states to props when changed in states from reducer
const mapStateToProps = ({ customLimits }) => {
    const {
        updateCustomLimitData,
        updateCustomLimitLoading,
        updateCustomLimitError,
    } = customLimits;
    return {
        updateCustomLimitData,
        updateCustomLimitLoading,
        updateCustomLimitError,
    }
}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        updateCustomLimits
    })(UpdateCustomLimits);