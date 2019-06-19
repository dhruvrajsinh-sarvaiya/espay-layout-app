/**
 * Ecommerce Dashboard
 */
import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
// intl messages
import IntlMessages from 'Util/IntlMessages';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import Divider from '@material-ui/core/Divider';
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';

import {
	TopGainerList,
	TopLooserList,
	TopLeaderList,
	HistoricalPerformanceChart,
	Portfolio,
	RecentTradingHistory,
	MyWatchListTbl
} from "Components/SocialProfile";

import MyOrder from '../../../components/CooldexTrading/ActiveOrders/MyOrders';

export default class SocialProfileDashboard extends Component {
	render() {
		return (
			<div className="ecom-dashboard-wrapper">
				<PageTitleBar title="Social Profile Dashboard" match={this.props.match} />
				<JbsCard colClasses="col-sm-full">
					<h2 className="clearfix jbs-block-title py-10">
						<IntlMessages id="sidebar.topGainer" />
						{/* <Link className="float-right" to="/app/social-profile/top-gainer"><IntlMessages id="sidebar.viewAll" /></Link> */}
					</h2>
					<Divider />
        			<JbsCardContent>						
						<TopGainerList />
					</JbsCardContent>
				</JbsCard>
				<JbsCard colClasses="col-sm-full">
					<h2 className="clearfix jbs-block-title py-10">
						<IntlMessages id="sidebar.topLooser" />
						{/* <Link className="float-right" to="/app/social-profile/top-looser"><IntlMessages id="sidebar.viewAll" /></Link> */}
					</h2>
					<Divider />
        			<JbsCardContent>
						<TopLooserList />
					</JbsCardContent>
				</JbsCard>
				<JbsCard colClasses="col-sm-full">
					<h2 className="clearfix jbs-block-title py-10">
						<IntlMessages id="sidebar.topLeaders" />
						{/* <Link className="float-right" to="/app/social-profile/top-leader"><IntlMessages id="sidebar.viewAll" /></Link> */}
					</h2>
					<Divider />
        			<JbsCardContent>
						<TopLeaderList />
					</JbsCardContent>
				</JbsCard>
				<JbsCard colClasses="col-sm-full">
					<h2 className="clearfix jbs-block-title py-10"><IntlMessages id="sidebar.historicalPerformance" /></h2>
					<Divider />
        			<JbsCardContent>
						<HistoricalPerformanceChart />
					</JbsCardContent>
				</JbsCard>
				<JbsCard colClasses="col-sm-full">
					<h2 className="clearfix jbs-block-title py-10"><IntlMessages id="sidebar.watchlists" /></h2>
					<Divider />
        			<JbsCardContent>
						<MyWatchListTbl />
					</JbsCardContent>
				</JbsCard>
				<JbsCard colClasses="col-sm-full">
					<h2 className="clearfix jbs-block-title py-10">
						<IntlMessages id="sidebar.portfolio" />
						<Link className="float-right" to="/app/social-profile/portfolio"><IntlMessages id="sidebar.viewAll" /></Link>
					</h2>
					<Divider />
        			<JbsCardContent>
						<Portfolio isfilter={false} />
					</JbsCardContent>
				</JbsCard>				
				<JbsCard colClasses="col-sm-full">
					<h2 className="clearfix jbs-block-title py-10"><IntlMessages id="sidebar.recentTradingHistory" /></h2>
					<Divider />
        			<JbsCardContent>
						<MyOrder {...this.props}
							hubConnection={this.props.location.state.hubConnection} 
							isShowHeader={false}
							isHidePair={false}
							customClass="my_acc_rsnt_trd_hstry"
						/>
					</JbsCardContent>
				</JbsCard>
			</div>
		)
	}
}