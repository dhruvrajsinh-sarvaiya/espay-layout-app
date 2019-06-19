/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Fragment } from 'react';
import IntlMessages from "Util/IntlMessages";

const ProfitableCircle = ({ profit }) => (
    <Fragment>
        <div className="circle">
            <span>circle</span>
        </div>
        <div className="">
            <span>{profit}%</span>
            <span>Profitable</span>
        </div>
    </Fragment>
);

// Default props value
ProfitableCircle.defaultProps = {
    profit : 0.0
}

export { ProfitableCircle };