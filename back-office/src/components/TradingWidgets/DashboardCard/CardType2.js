
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard } from 'Components/JbsCard';
import CountUp from 'react-countup';
import { Row, Col } from 'reactstrap';

import { LineChart, Line } from 'recharts';

const CardType2 = ({ title, count, icon, data, bgColor }) => (
    <JbsCard colClasses="col-sm-full">

        <div className="card-data card1-data">
            <div className="card-detail card-detail1">
                <div className="card-header-info card-header-detail card-header-data card-header-information" >
                    <Row className="header">
                        <Col md={8}>
                            <h2 className="display-6 font-weight-normal text-left"> <i className={"zmdi " + icon}></i>  <IntlMessages id={title} /></h2>
                        </Col>
                        <Col md={4} >
                            <h2 className="display-6 font-weight-normal text-right"><CountUp start={0} end={count} /></h2>
                        </Col>
                    </Row>
                    <div className="card-content">
                        <span className="card-content-data" style={{ backgroundColor: bgColor }} ></span>

                        <div>
                            <LineChart width={500} height={80} data={data}>
                                <Line type='monotone' dataKey='pv' stroke='#8884d8' strokeWidth={2} />
                            </LineChart>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </JbsCard >
);

// type checking props
CardType2.propTypes = {
    title: PropTypes.any
}

export { CardType2 };