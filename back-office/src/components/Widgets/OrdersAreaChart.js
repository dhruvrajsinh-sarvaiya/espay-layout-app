/**
 * Orders Area Chart Widget
 */
import React from 'react';
import CountUp from 'react-countup';

// chart
import TinyAreaChart from 'Components/Charts/TinyAreaChart';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// chart config
import ChartConfig from 'Constants/chart-config';

// jbs card box
import { JbsCard, JbsCardContent } from 'Components/JbsCard';

// helpers
import { hexToRgbA } from 'Helpers/helpers';

const OrdersAreaChart = ({ data }) => (
    <JbsCard>
        <JbsCardContent>
            <div className="clearfix">
                <div className="float-left">
                    <h3 className="mb-15 fw-semi-bold"><IntlMessages id="widgets.orders" /></h3>
                    <div className="d-flex">
                        <div className="mr-50">
                            <span className="fs-14 d-block"><IntlMessages id="widgets.today" /></span>
                            <CountUp separator="," className="counter-point" start={0} end={data.today} duration={5} useEasing={true} />
                        </div>
                        <div className="">
                            <span className="fs-14 d-block"><IntlMessages id="widgets.totalRevenue" /></span>
                            <CountUp separator="," className="counter-point" start={0} end={data.totalRevenue} duration={5} useEasing={true} />
                        </div>
                    </div>
                </div>
                <div className="float-right hidden-md-down">
                    <div className="featured-section-icon">
                        <i className="zmdi zmdi-flash"></i>
                    </div>
                </div>
            </div>
        </JbsCardContent>
        <TinyAreaChart
            label="Orders"
            chartdata={data.chartData.data}
            labels={data.chartData.labels}
            backgroundColor={hexToRgbA(ChartConfig.color.warning, 0.1)}
            borderColor={hexToRgbA(ChartConfig.color.warning, 3)}
            lineTension="0"
            height={70}
            gradient
            hideDots
        />
    </JbsCard>
);

export default OrdersAreaChart;
