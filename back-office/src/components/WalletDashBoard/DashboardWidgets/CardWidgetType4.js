/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
const smallStar = {
    height: '28px',
    width: '28px'
}
const options = {
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            display: false
        }],
        yAxes: [{
            display: false
        }]
    }
};
const CardWidgetType4 = ({ title, isDefault, grandTotal, data, clickEvent, changeDefault }) => (
    <JbsCard customClasses="bg-dark" colClasses="col-sm-full">
        <div className="jbs-block-title py-5 pl-10">
            <h4 className="text-white">
                <IconButton onClick={changeDefault} style={smallStar}>
                    <i className={classnames('zmdi zmdi-star', { 'text-warning': isDefault })}></i>
                </IconButton>
                {title}
            </h4>
        </div>
        <Divider />
        <a href="javascript:void(0)" onClick={clickEvent} className="w-100">
            <JbsCardContent customClasses="pb-0">
                <div className="d-flex justify-content-between">
                    <div className="align-items-start w-100 text-center">
                        <h1 className="display-4 font-weight-normal text-white mb-0"><CountUp start={0} end={grandTotal} /> $</h1>
                    </div>
                </div>
            </JbsCardContent>
            <Line data={data} options={options} height={70} />
        </a>
    </JbsCard >
);

// type checking props
CardWidgetType4.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType4 };