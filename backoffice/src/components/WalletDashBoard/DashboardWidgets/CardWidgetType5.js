/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';
import { Doughnut } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';
import TinyPieChart from 'Components/Charts/TinyPieChart';
const options = {
    legend: {
        display: false,
        labels: {
            fontColor: ChartConfig.legendFontColor
        }
    },
    cutoutPercentage: 50
};

const CardWidgetType5 = ({ title, count, icon, bgClass, clickEvent, data, chartType }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardHeading title={title} customClasses="py-5" />
        <Divider />
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-start w-50 text-center">
                    <h1 className="display-4 font-weight-light mb-0"><i className={"zmdi " + icon}></i></h1>
                    <h1 className="display-4 font-weight-normal mb-0"><CountUp start={0} end={count} /></h1>
                </div>
                <div className="align-items-end w-50 text-center">
                { (chartType == 'Doughnut')?
                    <Doughnut
                        data={data}
                        options={options}
                        height={200}
                    /> : 
                    <TinyPieChart
                        labels={data.labels}
                        datasets={data.datasets}
                        height={200}
                    />
                }
                </div>
            </div>
        </JbsCardContent>
    </JbsCard >
);

// type checking props
CardWidgetType5.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType5 };