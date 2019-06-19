/**
 * BandWidth Usage Bar Chart
 */
import React from 'react';

// chart
import SimpleBarChart from 'Components/Charts/SimpleBarChart';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import { JbsCard, JbsCardContent } from 'Components/JbsCard';

const BandWidthUsageBarChart = ({ data }) => (
    <JbsCard customClasses="gradient-success overflow-hidden">
        <div className="p-20 text-white">
            <h2><IntlMessages id="widgets.dataUse" /></h2>
            <h2>{data.totalUsed}</h2>
        </div>
        <JbsCardContent>
            <SimpleBarChart
                labels={data.labels}
                datasets={data.datasets}
            />
        </JbsCardContent>
    </JbsCard>
);

export default BandWidthUsageBarChart;
