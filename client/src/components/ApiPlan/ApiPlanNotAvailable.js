// component for display When Api plan Not Available By Tejas 26/2/2019

// import necessary components and react for component

import React, { Fragment, Component } from 'react';

// import for design
import {
    Row,
    Col
} from "reactstrap";

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// class for Api plan Component
class ApiPlanNotAvailable extends Component {


    //renders the  component
    render() {
        return (
            <Fragment>
                <Row>
                    <Col md={{ size: "6", offset: "3" }}>

                        <Row>
                            <Col md={{ size: "6", offset: "3" }}>
                                <JbsCollapsibleCard
                                    customClasses="text-center"
                                    colClasses="col-md-12">
                                    <div style={{ fontSize: "32px" }} className="text-primary text-center m-15 p-15">
                                        <IntlMessages id="sidebar.ApiPlan" />
                                    </div>
                                    <div style={{ fontSize: "32px", position: "relative", display: "contents" }} className="m-10 p-0">
                                        <i className="material-icons text-center d-block text-danger" style={{ fontSize: "50px" }}>error</i>
                                        <IntlMessages id="sidebar.ApiPlan.nodata" />
                                    </div>

                                </JbsCollapsibleCard>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

export default ApiPlanNotAvailable;