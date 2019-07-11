/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';
import TinyAreaChart from 'Components/Charts/TinyAreaChart';
import ChartConfig from 'Constants/chart-config';
import { hexToRgbA } from 'Helpers/helpers';

const CardWidgetType1 = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardHeading title={title} customClasses="py-5" />
        <Divider />
        <JbsCardContent customClasses="pb-0">
            <div className="d-flex justify-content-between">
                <div className="align-items-start">
                    <h1 className="display-4 font-weight-normal"><CountUp start={0} end={count} /></h1>
                </div>
                <div className="align-items-end">
                    <h1 className="display-4 font-weight-light"><i className={"zmdi " + icon}></i></h1>
                </div>
            </div>
            <h1 className="font-weight-light">
                <CountUp start={0} end={createCount} /> {createTitle}
            </h1>
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
CardWidgetType1.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType1 };