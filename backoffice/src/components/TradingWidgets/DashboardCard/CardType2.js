
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';
import TinyAreaChart from 'Components/Charts/TinyAreaChart';
import ChartConfig from 'Constants/chart-config';
import { hexToRgbA } from 'Helpers/helpers';
import {Row,Col} from 'reactstrap';

import {LineChart, Line} from 'recharts';

const CardType2 = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle,bgColor }) => (
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
                        <span className="card-content-data" style={{backgroundColor:bgColor}} ></span>                       

                        <div>
                            <LineChart width={500} height={80} data={data}>
                            <Line type='monotone' dataKey='pv' stroke='#8884d8' strokeWidth={2} />
                        </LineChart>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        
        {/* <JbsCardContent >
            <Row>
                <Col md={6}>
                <h1 className="display-6 font-weight-normal text-left">{title}</h1>
                </Col>
                <Col md={6} >
                <h1 className="display-4 font-weight-light text-right"><i className={"zmdi " + icon}></i></h1>
                
                </Col>
            </Row>

            <Row >

                <Col sm={4}>
                    <span>
                        <h1 className="display-8 font-weight-normal text-center">
                        Pending</h1>

                        <h1 className="display-8 font-weight-normal text-center">
                        <CountUp start={0} end={count} /></h1>
                    </span>                    
                </Col>

                <Col sm={4}>
                    <span>
                        <h1 className="display-8 font-weight-normal text-center">
                        Completed</h1>

                        <h1 className="display-8 font-weight-normal text-center">
                        <CountUp start={0} end={count} /></h1>
                    </span>                    
                </Col>

                <Col sm={4}>
                    <span>
                        <h1 className="display-8 font-weight-normal text-center">
                        Cancelled</h1>

                        <h1 className="display-8 font-weight-normal text-center">
                        <CountUp start={0} end={count} /></h1>
                    </span>                    
                </Col>                         
            </Row> 
        </JbsCardContent>      */}

        {/* <TinyAreaChart
            label="Visitors"
            chartdata={data.chartData.data}
            labels={data.chartData.labels}
            backgroundColor={hexToRgbA(ChartConfig.color[data.color], 0.1)}
            borderColor={hexToRgbA(ChartConfig.color[data.color], 3)}
            lineTension="0"
            height={60}
            gradient
            hideDots
        /> */}
    </JbsCard >
);

// type checking props
CardType2.propTypes = {
    title: PropTypes.any
}

export { CardType2 };