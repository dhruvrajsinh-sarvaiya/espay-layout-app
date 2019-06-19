/**
 * Tax Stats Widget
 */
import React from 'react';
import CountUp from 'react-countup';

// chart
import TinyLineChart from 'Components/Charts/TinyLineChart';

// constants
import ChartConfig from 'Constants/chart-config';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import { JbsCard, JbsCardContent, JbsCardFooter } from 'Components/JbsCard';

const TaxStats = ({ label, chartdata, labels }) => (
    <JbsCard>
        <div className="jbs-block-title d-flex justify-content-between">
            <div className="d-flex align-items-start">
                <h4><IntlMessages id="widgets.tax" /></h4>
            </div>
            <div className="align-items-end">
                <span className="d-block text-muted counter-point">$<CountUp start={0} end={1200} duration={3} useEasing={true} /></span>
                <p className="text-right mb-0 text-muted">+64%</p>
            </div>
        </div>
        <JbsCardContent noPadding>
            <TinyLineChart
                label={label}
                chartdata={chartdata}
                labels={labels}
                borderColor={ChartConfig.color.primary}
                pointBackgroundColor={ChartConfig.color.primary}
                height={100}
                pointBorderColor={ChartConfig.color.white}
                borderWidth={4}
            />
        </JbsCardContent>
        <JbsCardFooter customClasses="d-flex justify-content-between">
            {labels && labels.map((label, key) => (
                <span className="fs-12 text-muted" key={key}>{label}</span>
            ))}
        </JbsCardFooter>
    </JbsCard>
);

export default TaxStats;
