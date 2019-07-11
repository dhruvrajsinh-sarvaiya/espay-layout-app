/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';

const SimpleCard = ({ title, icon }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-end">
                    <h1 className="display-3 font-weight-light"><i className={icon}></i></h1>
                </div>
                <div className="text-right pt-25">
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

export { SimpleCard };