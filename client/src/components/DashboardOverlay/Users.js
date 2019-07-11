/**
 * Users Stats
 */
import React from 'react';
import CountUp from 'react-countup';


// collapsible card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages
import IntlMessages from 'Util/IntlMessages';

const Users = () => (
    <JbsCollapsibleCard
        heading={<IntlMessages id="sidebar.users" />}
        fullBlock
    >
        <div className="d-flex justify-content-between p-20">
            <div className="counter-report">
                <h2 className="title mb-0"><CountUp start={0} end={35875} /></h2>
                <span className="text-muted">Total Visitor</span>
            </div>
            <span className="align-self-center d-flex arrow-icon"><i className="ti-arrow-up"></i></span>
        </div>
        <div className="mb-10">
        </div>
        <div className="d-flex justify-content-between p-20">
            <div className="totle-status">
                <h2><CountUp start={0} end={720} /></h2>
                <span>Today</span>
            </div>
            <div className="totle-status">
                <h2><CountUp start={0} end={1500} /></h2>
                <span>This Week</span>
            </div>
            <div className="totle-status">
                <h2><CountUp start={0} end={2522} /></h2>
                <span>This Month</span>
            </div>
        </div>
    </JbsCollapsibleCard>
);

export default Users;
