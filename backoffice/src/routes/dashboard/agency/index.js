/**
 * Agency Dashboard
 */

import React, { Component } from 'react'

// jbs collapsible card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages
import IntlMessages from 'Util/IntlMessages';

//Widgets
import {
    AgencyWelcomeBlock,
    ToDoListWidget,
    NewCustomersWidget,
    PersonalSchedule,
    TotalEarnsWithAreaChartWidget,
    NewEmailsWidget,
    EmployeePayrollWidget,
    DailySales,
    TrafficChannel,
    CampaignPerformance
} from "Components/Widgets";

// widgets data
import {
    totalEarns,
    dailySales,
    trafficChannel
} from './data';


export default class AgencyDashboard extends Component {
    render() {
        return (
            <div className="agency-dashboard-wrapper">
                <AgencyWelcomeBlock />
                <JbsCollapsibleCard
                    heading={<IntlMessages id="widgets.totalEarns" />}
                    collapsible
                    reloadable
                    closeable
                >
                    <TotalEarnsWithAreaChartWidget chartData={totalEarns} />
                </JbsCollapsibleCard>
                <div className="row">
                    <JbsCollapsibleCard
                        customClasses="overflow-hidden"
                        colClasses="col-sm-6 col-md-6 col-lg-4"
                        heading={<IntlMessages id="widgets.dailySales" />}
                        badge={{
                            name: <IntlMessages id="widgets.today" />,
                            className: 'danger'
                        }}
                        collapsible
                        reloadable
                        closeable
                        fullBlock
                    >
                        <DailySales
                            label={dailySales.label}
                            chartdata={dailySales.chartdata}
                            labels={dailySales.labels}
                        />
                    </JbsCollapsibleCard>
                    <JbsCollapsibleCard
                        heading={<IntlMessages id="widgets.trafficChannel" />}
                        customClasses="overflow-hidden"
                        colClasses="col-sm-6 col-md-6 col-lg-4"
                        badge={{
                            name: <IntlMessages id="widgets.today" />,
                            className: 'danger'
                        }}
                        collapsible
                        reloadable
                        closeable
                        fullBlock
                    >
                        <TrafficChannel
                            label={trafficChannel.label}
                            chartdata={trafficChannel.chartdata}
                            labels={trafficChannel.labels}
                        />
                    </JbsCollapsibleCard>
                    <JbsCollapsibleCard
                        heading={<IntlMessages id="widgets.campaignPerformance" />}
                        colClasses="col-sm-12 col-md-6 col-lg-4"
                        collapsible
                        reloadable
                        closeable
                    >
                        <CampaignPerformance />
                    </JbsCollapsibleCard>
                    <JbsCollapsibleCard
                        customClasses="to-do-list"
                        colClasses="col-sm-6 col-md-6 col-lg-4"
                        heading={<IntlMessages id="widgets.toDoList" />}
                        collapsible
                        reloadable
                        closeable
                        fullBlock
                    >
                        <ToDoListWidget />
                    </JbsCollapsibleCard>
                    <JbsCollapsibleCard
                        colClasses="col-sm-6 col-md-6 col-lg-4"
                        heading={<IntlMessages id="widgets.newCustomers" />}
                        collapsible
                        reloadable
                        closeable
                        fullBlock
                    >
                        <NewCustomersWidget />
                    </JbsCollapsibleCard>
                    <JbsCollapsibleCard
                        colClasses="col-sm-12 col-md-6 col-lg-4"
                        fullBlock
                        customClasses="overflow-hidden bg-light-yellow"
                    >
                        <PersonalSchedule />
                    </JbsCollapsibleCard>
                </div>
                <div className="row">
                    <JbsCollapsibleCard
                        colClasses="col-sm-12 col-md-7 col-xl-7 b-100 w-xs-full"
                        heading={<IntlMessages id="widgets.newEmails" />}
                        collapsible
                        reloadable
                        closeable
                        fullBlock
                    >
                        <NewEmailsWidget />
                    </JbsCollapsibleCard>
                    <JbsCollapsibleCard
                        colClasses="col-sm-12 col-md-5 col-xl-5 b-100 w-xs-full"
                        heading={<IntlMessages id="widgets.employeePayroll" />}
                        collapsible
                        reloadable
                        closeable
                        fullBlock
                    >
                        <EmployeePayrollWidget />
                    </JbsCollapsibleCard>
                </div>
            </div>
        )
    }
}
