/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';

const AddCard = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent customClasses="pb-0">
            <div className="d-block text-center">
                <div>
                    <h1 className="display-4 font-weight-light"><i className={icon}></i></h1>
                </div>
                <div className="pt-10 pb-10">
                    <h2 className="fs-18 d-block font-weight-normal">{title}</h2>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard>
);

// type checking props
AddCard.propTypes = {
    title: PropTypes.any
}

export { AddCard };