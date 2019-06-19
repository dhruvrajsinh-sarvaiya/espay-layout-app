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
import { Bar } from 'react-chartjs-2';

const options = {
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            display: false,
            barPercentage: 0.25
        }],
        yAxes: [{
            display: false,
            ticks: {
                beginAtZero: true
            }
        }]
    }
};
const CardWidgetType6 = ({ title, data, clickEvent }) => (
    <JbsCard colClasses="col-sm-full">
        <div className="jbs-block-title py-5">
            <h4>{title}</h4>
        </div>
        <Divider />
        <JbsCardContent>
            <Bar data={data} options={options} height={100} />
        </JbsCardContent>
    </JbsCard >
);

// type checking props
CardWidgetType6.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType6 };