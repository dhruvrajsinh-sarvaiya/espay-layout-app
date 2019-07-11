/**
 * Ecommerce Dashboard
 */
import React, { Component } from 'react';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import Divider from '@material-ui/core/Divider';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';

import {
	TopGainerGrid,
	TopGainerList
} from "Components/SocialProfile";

export default class TopGainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type : 0 
        }
    }

    onChange(type) {
        this.setState({ type : type });
    }

	render() {
        const { type } = this.state;
		return (
			<div className="ecom-dashboard-wrapper">
				<PageTitleBar title="Top Gainer" match={this.props.match} />
				<JbsCard colClasses="col-sm-full">
                    <div className="search_area clearfix">
                        <div className="search_icon"><i className="fa fa-search"></i></div>
                        <div className="dfl_search">
                            <div className="tlt_search">
                                <h2><IntlMessages id="socialProfile.searchResults" values={{searchTotal : 17}} /></h2>
                                <span className="see-more-tegs sel_blue"><IntlMessages id="sidebar.btnSeeMore" /> <i className="fa fa-angle-down"></i></span>
                            </div>
                            <div className="lst_search">
                                <select className="sel_blue">
                                    <option><IntlMessages id="sidebar.currentMonth" /></option>
                                    <option><IntlMessages id="sidebar.lastMonth" /></option>
                                    <option><IntlMessages id="sidebar.last2Months" /></option>
                                    <option><IntlMessages id="sidebar.currentQuater" /></option>
                                    <option><IntlMessages id="sidebar.last3Months" /></option>
                                    <option><IntlMessages id="sidebar.last6Months" /></option>
                                    <option><IntlMessages id="sidebar.currentYear" /></option>
                                    <option><IntlMessages id="sidebar.last12Months" /></option>
                                    <option><IntlMessages id="sidebar.last2Years" /></option>
                                </select>
                                <span className="fil_tags"><IntlMessages id="sidebar.hasPicture" /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.riskScores" values={{riskScores : '(1-4)'}} /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.dailyDD" values={{dailydd : '(&lt;7%)'}} /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.returnValue" values={{return : '(5% - 80%)'}} /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.verified" /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.copyTrades" values={{copyTrades : '(&lt;5%)'}} /><i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.copyInvestment" values={{copyInvestment : '(&lt;5%)'}} /><i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.trades" values={{trades : '(> 25)'}} /><i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.weeklyDD" values={{weeklyDD : '(&lt;14%)'}} /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.profitableWeeks" values={{profitableWeeks : '(>60%)'}} /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.profitableMonths" values={{profitableMonths : '(>60%)'}} /> <i className="fa fa-close"></i></span>
                                <span className="fil_tags"><IntlMessages id="sidebar.lastActivity" /> <i className="fa fa-close"></i></span>
                            </div>
                        </div>
                    </div>
                    <div className="filter_area">
                        <div className="flt_blk">
                            <span className="profile">
                                <select id="profile" name="profile">
                                    <IntlMessages id="sidebar.selectStatus">
                                        { (selectStatus) =>
                                            <option>{selectStatus}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.selectCountry">
                                        { (selectCountry) =>
                                            <option>{selectCountry}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.selectNamePicture">
                                        { (selectNamePicture) =>
                                            <option>{selectNamePicture}</option>
                                        }
                                    </IntlMessages>
                                </select>
                            </span>
                            <span className="performance">
                                <select id="performance" name="performance">
                                    <IntlMessages id="sidebar.selectReturn">
                                        { (selectReturn) =>
                                            <option>{selectReturn}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.selectProfitableMonths">
                                        { (selectProfitableMonths) =>
                                            <option>{selectProfitableMonths}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.selectProfitableTrades">
                                        { (selectProfitableTrades) =>
                                            <option>{selectProfitableTrades}</option>
                                        }
                                    </IntlMessages>
                                </select>
                            </span>
                            <span className="risk">
                                <select id="risk" name="risk">
                                    <IntlMessages id="sidebar.selectRiskScore">
                                        { (selectRiskScore) =>
                                            <option>{selectRiskScore}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.selectDailyDrawdown">
                                        { (selectDailyDrawdown) =>
                                            <option>{selectDailyDrawdown}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.selectWeeklyDrawdown">
                                        { (selectWeeklyDrawdown) =>
                                            <option>{selectWeeklyDrawdown}</option>
                                        }
                                    </IntlMessages>
                                </select>
                            </span>
                            <span className="filter">
                                <select id="filter" name="filter">
                                    <IntlMessages id="sidebar.selectFilter">
                                        { (selectFilter) =>
                                            <option>{selectFilter}</option>
                                        }
                                    </IntlMessages>
                                </select>
                            </span>
                        </div>
                        <div className="grid_optn">
                            {
                                type > 0 
                                ? <span onClick={() => this.onChange(0)}><i className="fa fa-list-ul"></i></span>
                                : <span onClick={() => this.onChange(1)}><i className="fa fa-th-large"></i></span>
                            }
                        </div>
                    </div>
					<Divider />
        			<JbsCardContent>
                        {
                            type > 0 
                            ? <TopGainerGrid />
                            : <TopGainerList />
                        }
					</JbsCardContent>
				</JbsCard>
			</div>
		)
	}
}