
import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import CountUp from 'react-countup';
import TinyAreaChart from 'Components/Charts/TinyAreaChart';
import ChartConfig from 'Constants/chart-config';
import { hexToRgbA } from 'Helpers/helpers';
import {Row,Col} from 'reactstrap';


const CardType1 = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle }) => (
    <JbsCard colClasses="col-sm-full">
        
        <JbsCardContent >
            <Row>
                <Col md={6}>
                <h1 className="display-6 font-weight-normal text-left">{title}</h1>
                </Col>
                <Col md={6} >
                <h1 className="display-6 font-weight-normal text-right">Total: <CountUp start={0} end={count} /></h1>
                </Col>
            </Row>

            <Row >
                <Col sm={12} className="text-center mt-5">
                <h1 className="display-3 font-weight-light"><i className={"zmdi " + icon}></i></h1> 
                </Col>
                           
            </Row> 
        </JbsCardContent>     
        <TinyAreaChart
            label="Visitors"
            chartdata={data.chartData.data}
            labels={data.chartData.labels}
            backgroundColor={hexToRgbA(ChartConfig.color[data.color], 0.1)}
            borderColor={hexToRgbA(ChartConfig.color[data.color], 3)}
            lineTension="0"
            height={70}
            gradient
            hideDots
        />
    </JbsCard >
);

// type checking props
CardType1.propTypes = {
    title: PropTypes.any
}

export { CardType1 };