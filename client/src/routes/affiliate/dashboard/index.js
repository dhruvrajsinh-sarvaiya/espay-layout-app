/* 
    Developer : Salim Deraiya
    Date : 22-01-2019
    Update By : Bharat Jograna, 08 March 2019 
    File Comment : Follower List Component
*/
import React, { Component, Fragment } from "react";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { connect } from 'react-redux'; // Added By Bharat Jograna
import { Link } from 'react-router-dom';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, CountCard } from 'Components/MyAccount/Widgets';
import { InvitePeopleChart, EarningChart } from 'Components/MyAccount/AffiliateProgram';
// To Get All Counts
import { affiliateAllCount } from 'Actions/MyAccount';


class AffiliateDashboard extends Component {

    state = {
        allCounts: {},
        loading: '',
    }

    componentWillMount() {
        this.props.affiliateAllCount();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        if (nextProps.list.ReturnCode === 0 && nextProps.list.hasOwnProperty('Response')) {
            this.setState({ allCounts: nextProps.list.Response });
        }
    }
    render() {
        const { loading } = this.state;
        const { CommissionCount, EmailSentCount, FacebookLinkCount, ReferralLinkCount, SMSSentCount, TwitterLinkCount, UserCount, } = this.state.allCounts; // Added By Bharat Jograna
        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                <PageTitleBar title={<IntlMessages id="sidebar.dashboard" />} match={this.props.match} />
                <div className="row">
                    <div className="col-sm-12 col-md-9">
                        <div className="row">
                            <div className="col-sm-6 col-md-4">
                                <Link to="send-mail-report" className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="sidebar.sendMails" />}
                                        count={EmailSentCount > 0 ? EmailSentCount : 0}
                                        icon="fa fa-at"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <Link to="send-sms-report" className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="sidebar.sendSMS" />}
                                        count={SMSSentCount > 0 ? SMSSentCount : 0}
                                        icon="fa fa-envelope-square"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <Link to="facebook-share-report" className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="sidebar.linkShareOnFacebook" />}
                                        count={FacebookLinkCount > 0 ? FacebookLinkCount : 0}
                                        icon="fa fa-facebook-official"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <Link to="twitter-share-report" className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="sidebar.linkShareOnTwitter" />}
                                        count={TwitterLinkCount > 0 ? TwitterLinkCount : 0}
                                        icon="	fa fa-twitter-square"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <Link to="signup-report" className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="sidebar.totalSignup" />}
                                        count={UserCount > 0 ? UserCount : 0}
                                        icon="fa fa-sign-in"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <Link to="click-on-link-report" className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="sidebar.clickOnAffiliateLink" />}
                                        count={ReferralLinkCount > 0 ? ReferralLinkCount : 0}
                                        icon="fa fa-hand-pointer-o"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <Link to="commission-report" className="text-dark">
                                    <CountCard
                                        title={<IntlMessages id="sidebar.commissionReport" />}
                                    
                                        count={CommissionCount > 0 ? CommissionCount : 0}
                                        icon="fa fa-list-alt"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4 ">
                                <Link to="invite-friends" className="text-dark">
                                    <SimpleCard
                                        title={<IntlMessages id="sidebar.inviteFriends" />}
                                        icon="fa fa-user-plus"
                                        bgClass="bg-dark rounded-top"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <Link to="commission-pattern" className="text-dark">
                                    <SimpleCard
                                        title={<IntlMessages id="sidebar.commissionPattern" />}
                                        icon="zmdi zmdi-eye"
                                        bgClass="bg-dark"
                                        clickEvent={this.onClick}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3">
                        <InvitePeopleChart {...this.props} />
                    </div>
                    <div className="col-sm-12 col-md-12">
                        <EarningChart {...this.props} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

// Added By Bharat Jograna 
//Mapstatetoprops...
const mapStateToProps = ({ affiliateReportRdcer }) => {
    const { list, loading } = affiliateReportRdcer;
    return { list, loading };
}

export default connect(mapStateToProps, {
    affiliateAllCount,
})(AffiliateDashboard);
