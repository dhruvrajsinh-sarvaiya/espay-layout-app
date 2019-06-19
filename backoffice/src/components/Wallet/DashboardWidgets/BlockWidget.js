/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";

const BlockWidget = ({ title, data, colClasses, clickEvent }) => (
    <div className={`report-status ${colClasses ? colClasses : ''}`}>
        <div className="jbs-block-title"><h4>{title}</h4></div>
        <ul className="row mx-5 border-0">
            {data.length && data.map((item, key) => {
                return [
                    <li className={"col-sm-2 border"} key={key}>
                        <a href="javascript:void(0)" onClick={(e) => clickEvent(key)}>
                            <h4 className="mb-0">{item.type}</h4>
                            <h2 className="title mb-0 font-weight-normal">{item.value}</h2>
                        </a>
                    </li>
                ];
            })}
        </ul>
    </div>
);

// type checking props
BlockWidget.propTypes = {
    title: PropTypes.any
}

export { BlockWidget };