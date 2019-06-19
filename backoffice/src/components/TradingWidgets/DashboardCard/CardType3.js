
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';
import TinyAreaChart from 'Components/Charts/TinyAreaChart';
import ChartConfig from 'Constants/chart-config';
import { hexToRgbA } from 'Helpers/helpers';
import { Row, Col } from 'reactstrap';

const CardType3 = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle,subTitle }) => (
    <JbsCard colClasses="col-sm-full">

        <JbsCardContent >
            <h1 className="display-6 font-weight-normal text-center">{title}</h1>
            <h3 className="display-6 font-weight-normal text-center">{subTitle}</h3>

            <Row >

                <Col sm={4}>
                    <span>
                        <h3 className="display-6 font-weight-normal ">
                            USD</h3>

                        <h5 className="display-6 font-weight-normal ">
                            200</h5>
                    </span>
                </Col>

                <Col sm={4}>
                    <span>
                        <h3 className="display-6 font-weight-normal ">
                            EUR</h3>

                        <h5 className="display-6 font-weight-normal ">
                            200</h5>
                    </span>
                </Col>

                <Col sm={4}>
                    <span>
                        <h3 className="display-6 font-weight-normal ">
                            INR</h3>

                        <h5 className="display-6 font-weight-normal ">
                            200</h5>
                    </span>
                </Col>
            </Row>

            <Row className="mt-10">

                <Col sm={4}>
                    <span>
                        <h3 className="display-6 font-weight-normal ">
                            USD</h3>

                        <h5 className="display-8 font-weight-normal text-success">
                        <i className={"zmdi " + icon}></i> 200</h5>
                    </span>
                </Col>

                <Col sm={4}>
                    <span>
                        <h3 className="display-6 font-weight-normal ">
                            EUR</h3>

                        <h5 className="display-6 font-weight-normal text-success">
                        <i className={"zmdi " + icon}></i> 200</h5>
                    </span>
                </Col>

                <Col sm={4}>
                    <span>
                        <h3 className="display-6 font-weight-normal ">
                            INR</h3>

                        <h5 className="display-6 font-weight-normal text-success">
                        <i className={"zmdi " + icon}></i>  200</h5>
                    </span>
                </Col>
            </Row>
        </JbsCardContent>
    </JbsCard >
);

// type checking props
CardType3.propTypes = {
    title: PropTypes.any
}

export { CardType3 };