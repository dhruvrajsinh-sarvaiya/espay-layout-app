// component for display View Custom List By Tejas 19/3/2019

import React, { Component, Fragment } from 'react'

// import for design
import {
    Row,
    Col,
    Card,
    Label,
    Button,

} from 'reactstrap';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import neccessary actions for fetch records
import {
    setDefaultCustomLimits
} from 'Actions/ApiPlan';

// used for connect
import { connect } from "react-redux"

// display  notification manager
import { NotificationManager } from "react-notifications";

// class for View Custom Limits
class ViewCustomLimitList extends Component {

    //used fro set constructor
    constructor(props) {
        super(props)

        var readOnly = [], fullAccess = [];

        if (props.customLimits.ReadOnlyAPI) {
            readOnly = Object.entries(props.customLimits.ReadOnlyAPI).map(([key, value]) => ({ key, value }));
        }

        if (props.customLimits.FullAccessAPI) {
            fullAccess = Object.entries(props.customLimits.FullAccessAPI).map(([key, value]) => ({ key, value }));
        }

        this.state = {
            customLimitsData: props.customLimits ? props.customLimits : {},
            ReadOnlyAPI: readOnly,
            fullAccessApi: fullAccess,
            limitID: props.customLimits.LimitID ? props.customLimits.LimitID : 0,
            isSetDefault: 0
        }
    }

    // used fro default custom limit
    SetASDefault = () => {

        this.setState({
            isSetDefault: 1
        })

        this.props.setDefaultCustomLimits({ LimitId: this.state.limitID })
    }

    // invoke when component is about to get new props
    componentWillReceiveProps(nextprops) {
        if (this.state.isSetDefault === 1 && nextprops.setDefaultLimit.ReturnCode === 0) {

            this.setState({
                isSetDefault: 0
            })
            NotificationManager.success(<IntlMessages id="sidebar.defaultLimits.success.add" />)
            this.props.CallCustomLimits();
        } else if (this.state.isSetDefault === 1 && nextprops.setDefaultLimitError.ReturnCode === 1) {

            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.setDefaultLimitError.ErrorCode}`} />);
            this.setState({
                isSetDefault: 0
            })
        }
    }

    //renders the component
    render() {
        const data = this.state.customLimitsData
        return (
            <Fragment>

                {this.props.setDefaultLimitLoading &&
                    <JbsSectionLoader />
                }
                <Card className="m-20 p-10">
                    <div className="font-weight-bold text-primary text-center" style={{ fontSize: "24px" }}>
                        <IntlMessages id="sidebar.customLimits.note.title" />
                    </div>

                    <Row className="m-0">
                        <Col md={{ size: "6", offset: "3" }} className="d-flex">
                            <Col md={6}>
                                <Card className="mt-10">
                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpermin" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.MaxPerMinute}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxperday" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.MaxPerDay}
                                        </Label>
                                    </Row>


                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpermonth" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.MaxPerMonth}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxpersec" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.MaxOrderPerSec}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxrecperreq" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.MaxRecPerRequest}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxreq" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.MaxReqSize}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.maxres" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.MaxResSize}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.ApiPlan.whitelist" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.WhitelistedEndPoints}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.concurrentendpoints" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.ConcurrentEndPoints}
                                        </Label>
                                    </Row>

                                    <Row className="Subscrine-plan-font p-5">
                                        <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                            {<IntlMessages id="sidebar.apiplan.historical" />}
                                        </Label>

                                        <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                            {data.HistoricalDataMonth}
                                        </Label>
                                    </Row>
                                </Card>
                            </Col>

                            <Col md={6} className="no-padding" >
                                <Card className="mt-10">
                                    <div style={{ height: "90%" }}>
                                        <Row className="font-weight-bold m-10" >
                                            <Col md={10} className="pull-left">{<IntlMessages id="sidebar.apiplan.readonly.methods" />}</Col>

                                            <Col md={2} className="pull-right">
                                                <i className="fa fa-edit" style={{ cursor: "pointer", fontSize: "24px" }} onClick={this.props.UpdateCustomLimit} />
                                            </Col>
                                        </Row>

                                        {this.state.ReadOnlyAPI && this.state.ReadOnlyAPI.map((value, key) => {

                                            return <Row className="Subscrine-plan-font" key={key}>
                                                <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                                    {value.value}
                                                </Label>

                                                <Label for="planname" sm={6} className="d-inline font-weight-bold text-success">
                                                    <i className="material-icons">done_outline</i>
                                                </Label>
                                            </Row>
                                        })}


                                        <Row className="text-center font-weight-bold m-10">
                                            {<IntlMessages id="sidebar.apiplan.fullaccess.methods" />}
                                        </Row>

                                        {this.state.fullAccessApi && this.state.fullAccessApi.map((value, key) => {
                                            return <Row className="Subscrine-plan-font" key={key}>
                                                <Label for="planname" sm={6} style={{ fontFamily: "cursive" }}>
                                                    {value.value}
                                                </Label>

                                                <Label for="planname" sm={6} className="d-inline font-weight-bold text-success" >
                                                    <i className="material-icons">done_outline</i>
                                                </Label>
                                            </Row>
                                        })}
                                    </div>
                                    <div className="d-flex mt-5 ">
                                        <Button size="medium"
                                            disabled={this.props.displayUpGrade}
                                            md={6}
                                            color="danger" className="fs-24"
                                            onClick={(event) => this.props.CloseEditField(event)}
                                        >
                                            <IntlMessages id="button.back" />
                                        </Button>


                                        <Button size="medium"
                                            disabled={this.props.displayDownGrade}
                                            md={6}
                                            color="info" className="fs-24 m-5"
                                            onClick={this.SetASDefault}
                                        >
                                            <IntlMessages id="sidebar.customLimits.field.title.setDefault" />
                                        </Button>

                                    </div>

                                </Card>
                            </Col>
                        </Col>
                    </Row>

                </Card>
            </Fragment>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ customLimits }) => {
    const {
        setDefaultLimit,
        setDefaultLimitLoading,
        setDefaultLimitError,
    } = customLimits;
    return {
        setDefaultLimit,
        setDefaultLimitLoading,
        setDefaultLimitError,
    }
}

// export this component with action methods and props
export default connect(mapStateToProps,
    {
        setDefaultCustomLimits
    })(ViewCustomLimitList);