/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent } from 'Components/JbsCard';

const SimpleCard = ({ title, icon, bgClass, clickEvent, data }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-end">
                    <h1 className="accountcommoncard display-4 font-weight-light"><i className={icon}></i></h1>
                </div>
                <div className="text-right pt-25">
                    {data.length > 0 &&
                        <Fragment>
                            {data.map((list, index) => (
                                <div className="row">
                                    <div className="col-md-4"><IntlMessages id={list.key} /></div>
                                    <div className="col-md-4">{list.value}</div>
                                </div>
                            ))}
                        </Fragment>
                    }
                    <h1 className="font-weight-normal lh_100">{title}</h1>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard>
);

// type checking props
SimpleCard.propTypes = {
    title: PropTypes.any
}

SimpleCard.defaultProps = {
    data: []
}

export { SimpleCard };