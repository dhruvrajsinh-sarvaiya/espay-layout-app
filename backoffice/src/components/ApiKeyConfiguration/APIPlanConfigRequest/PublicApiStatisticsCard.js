/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * Component For Public Api Statistic Cards
 */
import React, { Component, Fragment } from 'react';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Row, Col } from 'reactstrap';
import CountUp from 'react-countup';
import IntlMessages from "Util/IntlMessages";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

export default class PublicApiStatisticsCard extends Component {
    state = {
        menudetail: this.props.menudetail
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }
    render() {
        const { APIUsers, FaliureCount, SuccessCount, RegisterToday } = this.props;
        return (
            <Fragment>
                <div className="PublicApiStatistic">
                    {this.checkAndGetMenuAccessDetail('0349ED47-491D-49CC-3551-8CE00FEE52BE') && //0349ED47-491D-49CC-3551-8CE00FEE52BE
                        <Col md="4" sm="12">
                            <Card>
                                <Row>
                                    <Col md="8" sm="8" xs="8">
                                        <CardBody>
                                            <CardTitle><CountUp separator="," start={0} end={APIUsers} /></CardTitle>
                                            <CardSubtitle><IntlMessages id="apiPlanConfiguration.apiUsers" /></CardSubtitle>
                                            <CardText><CountUp separator="," start={0} end={RegisterToday} /> <IntlMessages id="apiPlanConfiguration.newRegisToday" /></CardText>
                                        </CardBody>
                                    </Col>
                                    <Col md="4" sm="4" xs="4">
                                        <i className="ti-user"></i>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    }

                    {this.checkAndGetMenuAccessDetail('DAB36AEB-05E5-0326-5A95-AC2D02772227') && // DAB36AEB-05E5-0326-5A95-AC2D02772227
                        <Col md="4" sm="12">
                            <Card>
                                <Row>
                                    <Col md="8" sm="8" xs="8">
                                        <CardBody>
                                            <CardTitle><CountUp separator="," start={0} end={SuccessCount} /></CardTitle>
                                            <CardSubtitle><IntlMessages id="apiPlanConfiguration.successReq" /></CardSubtitle>
                                            <CardText>5 <IntlMessages id="apiPlanConfiguration.newReqToday" /></CardText>
                                        </CardBody>
                                    </Col>
                                    <Col md="4" sm="4" xs="4">
                                        <i className="ti-check"></i>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    }

                    {this.checkAndGetMenuAccessDetail('BE67BD06-073B-A226-3D30-AEFF55690C2C') && // BE67BD06-073B-A226-3D30-AEFF55690C2C
                        <Col md="4" sm="12">
                            <Card>
                                <Row>
                                    <Col md="8" sm="8" xs="8">
                                        <CardBody>
                                            <CardTitle><CountUp separator="," start={0} end={FaliureCount} /></CardTitle>
                                            <CardSubtitle><IntlMessages id="apiPlanConfiguration.failureReq" /></CardSubtitle>
                                            <CardText>78 <IntlMessages id="apiPlanConfiguration.earnedToday" /></CardText>
                                        </CardBody>
                                    </Col>
                                    <Col md="4" sm="4" xs="4">
                                        <i className="ti-close"></i>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    }
                </div>
            </Fragment>
        )
    }
}
