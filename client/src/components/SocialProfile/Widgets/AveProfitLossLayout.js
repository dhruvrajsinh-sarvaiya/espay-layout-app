/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";

const AveProfitLossLayout = ({ profit, loss, isShowProfit, isShowLoss }) => (
    <Fragment>
        {isShowProfit && <span className="d-block fs-12 text-muted"><span className="text-success">{profit}%</span>  Avg. Profit</span>}
        {isShowLoss && <span className="d-block fs-12 text-muted"><span className="text-danger">-{loss}%</span>  Avg. Loss</span>}
    </Fragment>
);

// Default props value
AveProfitLossLayout.defaultProps = {
    profit : 0.0,
    loss : 0.0,
    isShowProfit : true,
    isShowLoss : true
}

export { AveProfitLossLayout };