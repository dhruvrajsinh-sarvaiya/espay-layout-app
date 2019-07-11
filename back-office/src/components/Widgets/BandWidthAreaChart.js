/**
 * BandWidth Area Chart Widget
 */
import React from 'react';

// dynamic line chart
import DynamicLineChart from 'Components/Charts/DynamicLineChart';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import { JbsCard, JbsCardContent } from 'Components/JbsCard';

const BandwidthAreaChart = () => (
    <JbsCard customClasses="gradient-primary overflow-hidden">
        <div className="p-20">
            <h2><IntlMessages id="widgets.bandwidthUse" /></h2>
            <h2>50 GB</h2>
        </div>
        <JbsCardContent noPadding>
            <DynamicLineChart />
        </JbsCardContent>
    </JbsCard>
);

export default BandwidthAreaChart;
