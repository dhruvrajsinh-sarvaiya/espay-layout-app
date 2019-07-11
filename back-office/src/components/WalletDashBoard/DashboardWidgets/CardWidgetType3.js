/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';

const CardWidgetType3 = ({ title, count1, title1, count2, title2, count3, title3, count4, title4 }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardHeading title={title} customClasses="py-5" />
        <Divider />
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-start w-50 border-right text-center">
                    <h1 className="display-4 font-weight-normal mb-0"><CountUp start={0} end={count1} /></h1>
                    <h1 className="px-30 font-weight-light">{title1}</h1>
                    <Divider className="mx-20" />
                    <h1 className="display-4 font-weight-normal mb-0"><CountUp start={0} end={count2} /></h1>
                    <h1 className="px-30 font-weight-light mb-0">{title2}</h1>
                </div>
                <div className="align-items-end w-50 text-center">
                    <h1 className="display-4 font-weight-normal mb-0"><CountUp start={0} end={count3} /></h1>
                    <h1 className="px-30 font-weight-light">{title3}</h1>
                    <Divider className="mx-20" />
                    <h1 className="display-4 font-weight-normal mb-0"><CountUp start={0} end={count4} /></h1>
                    <h1 className="px-30 font-weight-light mb-0">{title4}</h1>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard >
);

// type checking props
CardWidgetType3.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType3 };