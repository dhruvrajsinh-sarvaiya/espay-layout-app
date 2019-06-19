/**
 * Ecommerce Dashboard
 */

import React, { Component } from 'react'

// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// jbs collapsible card
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

import {
   VisitorAreaChartWidget,
   SalesAreaChartWidget,
   OrdersAreaChartWidget,
   RecentOrdersWidget,
   SupportRequest,
   Notifications,
   TopSellingWidget,
   OverallTrafficStatusWidget,
   ProductReportsWidget,
   OnlineVisitorsWidget,
   TodayOrdersStatsWidget,
   BookingInfo,
   NewOrderCountdown,
   FollowersWidget,
   Notes
} from "Components/Widgets";

// widgets data
import {
   visitorsData,
   salesData,
   ordersData,
   topSellingProducts,
   trafficStatus,
   onlineVisitorsData,
} from './data';

export default class EcommerceDashboard extends Component {
   render() {
      const { match } = this.props;
      return (
         <div className="ecom-dashboard-wrapper">
            <PageTitleBar title={<IntlMessages id="sidebar.ecommerce" />} match={match} />
            <div className="row">
               <div className="col-sm-6 col-md-4 w-xs-half-block">
                  <VisitorAreaChartWidget
                     data={visitorsData}
                  />
               </div>

               <div className="col-sm-12 col-md-4 w-xs-half-block">
                  <OrdersAreaChartWidget
                     data={ordersData}
                  />
               </div>
               <div className="col-sm-6 col-md-4 w-xs-full">
                  <SalesAreaChartWidget
                     data={salesData}
                  />
               </div>
            </div>
            <div className="row">
               <JbsCollapsibleCard
                  colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
                  heading={<IntlMessages id="widgets.supportRequest" />}
                  collapsible
                  reloadable
                  closeable
                  fullBlock
                  customClasses="overflow-hidden"
               >
                  <SupportRequest />
               </JbsCollapsibleCard>
               <JbsCollapsibleCard
                  colClasses="col-sm-12 col-md-8 col-lg-8 w-xs-full"
                  heading={<IntlMessages id="widgets.RecentOrders" />}
                  collapsible
                  reloadable
                  closeable
                  fullBlock
               >
                  <RecentOrdersWidget />
               </JbsCollapsibleCard>
            </div>
            <div className="row">
               <JbsCollapsibleCard
                  customClasses="trafic-bar-chart"
                  colClasses="col-sm-12 col-md-12 col-lg-5 d-sm-full"
                  heading={<IntlMessages id="widgets.overallTrafficStatus" />}
                  collapsible
                  reloadable
                  closeable
                  fullBlock
               >
                  <OverallTrafficStatusWidget
                     chartData={trafficStatus}
                  />
               </JbsCollapsibleCard>
               <div className="col-sm-12 col-md-12 col-lg-7 d-sm-full">
                  <div className="row">
                     <div className="col-sm-6 col-md-6 col-lg-6">
                        <div className="dash-cards">
                           <Notes />
                        </div>
                        <NewOrderCountdown />
                        <TodayOrdersStatsWidget />
                     </div>
                     <div className="col-sm-6 col-md-6 col-lg-6">
                        <div className="dash-cards-lg">
                           <OnlineVisitorsWidget data={onlineVisitorsData} />
                        </div>
                        <FollowersWidget />
                        <BookingInfo />
                     </div>
                  </div>
               </div>
            </div>
            <div className="row">
               <JbsCollapsibleCard
                  colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
                  heading={<IntlMessages id="widgets.productReports" />}
                  collapsible
                  reloadable
                  closeable
                  fullBlock
               >
                  <ProductReportsWidget />
               </JbsCollapsibleCard>
               <JbsCollapsibleCard
                  colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
                  fullBlock
                  customClasses="overflow-hidden"
               >
                  <Notifications />
               </JbsCollapsibleCard>
               <JbsCollapsibleCard
                  colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
                  heading={<IntlMessages id="widgets.topSellings" />}
                  collapsible
                  reloadable
                  closeable
                  fullBlock
               >
                  <TopSellingWidget data={topSellingProducts} />
               </JbsCollapsibleCard>
            </div>
         </div>
      )
   }
}
