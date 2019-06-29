// component for View API Custom limits By Tejas 14/9/2019


import React, { Component, Fragment } from 'react';

// import for design
import {
    Row,
    Label,
    Button,
    Container
} from 'reactstrap';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// class for Set API Custom Limits
class CustomLimits extends Component {

    // construcrtor
    constructor(props) {
        super(props)

        this.state = {
            customLimits: props.customLimits ? props.customLimits : {},
            isSetCustomLimit: props.isSetCustomLimit ? true : false
        }

    }

    //renders the component
    render() {


        const data = this.state.customLimits ? this.state.customLimits : {};
        return (
            <Fragment>

                <div className="text-center font-weight-bold text-primary" style={{ fontSize: "20px" }}>
                    <IntlMessages id="sidebar.customLimits.note.title" />
                </div>


                {this.props.isSetCustomLimit === false &&
                    <Container>
                        <div className="m-0" style={{ height: "90%" }}>
                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.customLimits.field.title.maxCallPerDay" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.MaxPerDay !== "" ? data.MaxPerDay : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.customLimits.field.title.maxCallPermin" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.MaxPerMinute !== "" ? data.MaxPerMinute : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.customLimits.field.title.maxCallPermonth" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.MaxPerMonth !== "" ? data.MaxPerMonth : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.customLimits.field.title.maxOrderPerSecond" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.MaxOrderPerSec !== "" ? data.MaxOrderPerSec : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.customLimits.field.title.maxRecRequest" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.MaxRecPerRequest !== "" ? data.MaxRecPerRequest : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.apiplan.maxreq" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.MaxReqSize !== "" ? data.MaxReqSize : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.apiplan.maxres" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.MaxResSize !== "" ? data.MaxResSize : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.ApiPlan.whitelist" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.WhitelistedEndPoints !== "" ? data.WhitelistedEndPoints : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.apiplan.concurrentendpoints" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.ConcurrentEndPoints !== "" ? data.ConcurrentEndPoints : ""}
                                </Label>
                            </Row>

                            <Row className="Subscrine-plan-font">
                                <Label for="planname" sm={8} style={{ fontFamily: "cursive" }}>
                                    {<IntlMessages id="sidebar.apiplan.historical" />}
                                </Label>

                                <Label for="planname" sm={4} className="d-inline font-weight-bold">
                                    {data.HistoricalDataMonth !== "" ? data.HistoricalDataMonth : "-"}
                                </Label>
                            </Row>

                        </div>

                        <div className="d-flex mt-5 ">


                            <Button size="medium"
                                md={6}
                                color="info" className="fs-24 m-5"
                                onClick={this.props.ViewCustomLimits}
                            >
                                <IntlMessages id="sidebar.apiplan.button.viewmore" />
                            </Button>

                        </div>

                    </Container>
                }

            </Fragment>
        )
    }
}

export default CustomLimits