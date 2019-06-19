/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Trade Progress bar chart Component
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";

const ProgressBarChart = ({ tData }) => (
    <Fragment>
        <div className="progress_bar clearfix mt-15">
            {tData.map((item,index) => (
                <span style={{ width : item.value+"%"}}></span>
            ))}
        </div>
    </Fragment>
);

// type checking props
ProgressBarChart.propTypes = {
    tData: PropTypes.array
}

// Default props value
ProgressBarChart.defaultProps = {
    tData : []
}

export { ProgressBarChart };