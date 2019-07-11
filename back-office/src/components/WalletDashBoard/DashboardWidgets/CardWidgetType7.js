/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import { Line } from 'react-chartjs-2';

const options = {
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            display: true,
            ticks: {
                min: 0
            },
            gridLines: {
                display: true,
                drawBorder: false
            }
        }],
        yAxes: [{
            display: false,
            ticks: {
                suggestedMin: 0,
                beginAtZero: true
            }
        }]
    }
};

const CardWidgetType7 = ({ title, data, clickEvent }) => (
    <JbsCard colClasses="col-sm-full">
        <div className="jbs-block-title py-5">
            <h4>{title}</h4>
        </div>
        <Divider />
        <JbsCardContent>
            <div className="chart-top mb-4">
                {data.customLegends.map((legend, key) => (
                    <Fragment key={key}>
                        <span className={`${legend.className} ladgend mr-10`}>&nbsp;</span>
                        <span className="fs-12 mr-10">{legend.name}</span>
                    </Fragment>
                ))}
            </div>
            <Line data={data} options={options} height={95} />
        </JbsCardContent>
    </JbsCard >
);

// type checking props
CardWidgetType7.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType7 };