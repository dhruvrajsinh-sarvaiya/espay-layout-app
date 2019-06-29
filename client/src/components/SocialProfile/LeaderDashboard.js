/**
  * Auther : Salim Deraiya
 * Created : 13/12/2018
 * Top Gainer
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "reactstrap";
import Divider from '@material-ui/core/Divider';
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import IconButton from '@material-ui/core/IconButton';
// intl messages
import IntlMessages from "Util/IntlMessages";
import {
    Portfolio,
    HistoricalPerformanceChart,
    RiskScoreChart,
    CopierChart,
    TradingChart,
    FrequentlyTradedWdgt,
    AdditionalStatsWdgt,
} from "Components/SocialProfile";

class LeaderDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LeaderId: '',
            trade_type: 1, //1 : Copy, 2: Mirror
            isWatch: true, //True/false
            activeIndex: 0,
        };
    }

    componentWillMount() {
        var leaderConfig = this.props.history.location.state;
        if (leaderConfig.LeaderId !== '') {
            this.getCallInit(leaderConfig);
        } else {
            this.setState({ showForm: false, err_msg: <IntlMessages id="apiErrCode.0" />, err_alert: false });
            this.props.history.push('/app/social-profile');
        }
    }

    getCallInit(leaderConfig) {
        this.setState({ LeaderId: leaderConfig.LeaderId });
    }

    render() {
        const { trade_type, isWatch, LeaderId } = this.state;
        return (
            <Fragment>
                <div className="l_details clearfix">
                    <div className="l_info clearfix">
                        <div className="l_img"><img src={require('Assets/image/user-profile.png')} alt="Leader Image" /></div>
                        <div className="l_binfo">
                            <h2>Eliyohu</h2>
                            <h4>Olexiy Medvinskyy</h4>
                        </div>
                    </div>
                    <div className="l_action clearfix">
                        <div className="w_area">
                            {isWatch
                                ? <IconButton aria-haspopup="true" className="ml-10 text-warning ldbtn"><i className="zmdi zmdi-check-circle zmdi-hc-2x" /></IconButton>
                                : <IconButton aria-haspopup="true" className="ml-10 text-success ldbtn"><i className="zmdi zmdi-plus-circle zmdi-hc-2x" /></IconButton>
                            }
                        </div>
                        <div className="t_type">
                            {trade_type
                                ? <Button variant="raised" className="perverbtn text-white mr-10"><IntlMessages id="sidebar.btnCopy" /></Button>
                                : <Button variant="raised" className="perverbtn text-white mr-10"><IntlMessages id="sidebar.btnMirror" /></Button>
                            }
                        </div>
                    </div>
                </div>
                <div className="tb_area ldashboard">
                    <Tabs defaultTab="LStats">
                        <div className="tb_list">
                            <TabList className="row ml-0">
                                <Tab className="col-3" tabFor="LFeed">Feed</Tab>
                                <Tab className="col-3" tabFor="LStats">Stats</Tab>
                                <Tab className="col-3" tabFor="LPortfolio">Portfolio</Tab>
                                <Tab className="col-3" tabFor="LChart">Chart</Tab>
                            </TabList>
                        </div>
                        <div className="tb_continer">
                            <TabPanel tabId="LFeed">Feed container</TabPanel>
                            <TabPanel tabId="LStats">
                                <div className="mb-20">
                                    <h2 className="clearfix jbs-block-title px-0"><IntlMessages id="sidebar.historicalPerformance" /></h2>
                                    <Divider />
                                    <HistoricalPerformanceChart LeaderId={LeaderId} />
                                </div>
                                <div className="row mb-20">
                                    <div className="col-md-8 mb-20">
                                        <RiskScoreChart LeaderId={LeaderId} />
                                    </div>
                                    <div className="col-md-4 mb-20">
                                        <CopierChart LeaderId={LeaderId} />
                                    </div>
                                </div>
                                <div className="mb-20"><TradingChart LeaderId={LeaderId} /></div>
                                <div className="mb-20"><FrequentlyTradedWdgt LeaderId={LeaderId} /></div>
                                <div><AdditionalStatsWdgt LeaderId={LeaderId} /></div>
                            </TabPanel>
                            <TabPanel tabId="LPortfolio">
                                <Portfolio />
                            </TabPanel>
                            <TabPanel tabId="LChart">Chart container</TabPanel>
                        </div>
                    </Tabs>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(LeaderDashboard);
