/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Trade Detail Block Component
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";

const TradeDetailBlk = ({ tData }) => (
    <Fragment>
        <div className="trd_detail clearfix mt-15">
            {tData.map((item,index) => (
                <div className={"t_item ti_"+tData.length}>
                    <span className="tlt">{item.title}</span>
                    <span className="amnt">{item.value}%</span>
                </div>
            ))}
        </div>
    </Fragment>
);

// type checking props
TradeDetailBlk.propTypes = {
    tData: PropTypes.array
}

// Default props value
TradeDetailBlk.defaultProps = {
    tData : []
}

export { TradeDetailBlk };