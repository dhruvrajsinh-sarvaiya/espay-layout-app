/**
 * Created By Sanjay
 * Created Date 25/02/2019
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Card, Row, Col } from 'reactstrap';
// import { FaHandshake, FaHandPointUp, FaShareAlt, FaWhatsappSquare, FaFacebook, FaTwitterSquare, FaLinkedin, FaPinterestP, FaTelegramPlane, FaFacebookMessenger } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa";
// import { MdEmail, MdTextsms, MdPerson } from "react-icons/md";
import { getCountReferralDashboard } from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import CountUp from 'react-countup';

class ReferralCountCardsWdgt extends Component {
    state = {
        data: {}
    }

    componentWillMount() {
        this.props.getCountReferralDashboard();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.countsOfReferralDashboard.ReturnCode === 0) {
            this.setState({ data: nextProps.countsOfReferralDashboard.ReferralChannelUserCount });
        }
    }

    render() {
        const { TotalParticipants, Invite, Clicks, Converts, EmailInvite, FacebookShare, TwitterShare, SMSInvite, Messenger, WhatsApp, LinkedIn, Pinterest, Telegram } = this.state.data;
        return (
            <Row className="referral-Dashboard">
                {this.props.loading && <JbsSectionLoader />}
                <Col xs="6" sm="3" md="4" lg="2">
                    <Link to="referral-invite" className="invites">
                        <Card>
                            <div className="pt-0 p-15">
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end cardboxicon">
                                        <i className="fa fa-share-alt"></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={Invite > 0 ? Invite : 0} /></div>
                                        <div className="font-weight-normal"><IntlMessages id="my_account.invites" /></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2">
                    <Link to="click-referral-link" className="clicks">
                        <Card>
                            <div className="pt-0 p-15">
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end cardboxicon">
                                        <i className="fa fa-mouse-pointer"></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={Clicks > 0 ? Clicks : 0} /></div>
                                        <div className="font-weight-normal"><IntlMessages id="my_account.clicks" /></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2">
                    <Link to="referral-participate" className="participant">
                        <Card>
                            <div className="pt-0 p-15">
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end cardboxicon">
                                        <i className="fa fa-user"></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={TotalParticipants > 0 ? TotalParticipants : 0} /></div>
                                        <div className="font-weight-normal"><IntlMessages id="my_account.participant" /></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2">
                    <Link to="referral-rewards" className="converts">
                        <Card>
                            <div className="pt-0 p-15">
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end cardboxicon">
                                        <i className="fa fa-random"></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={Converts > 0 ? Converts : 0} /></div>
                                        <div className="font-weight-normal"><IntlMessages id="my_account.converts" /></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2">
                    <Link to="referral-invite-email" className="email">
                        <Card>
                            <div className="pt-0 p-15">
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end cardboxicon">
                                        <i className="fa fa-envelope"></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={EmailInvite > 0 ? EmailInvite : 0} /></div>
                                        <div className="font-weight-normal"><IntlMessages id="my_account.emialInvite" /></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2">
                    <Link to="referral-invite-sms" className="sms">
                        <Card>
                            <div className="pt-0 p-15">
                                <div className="d-flex justify-content-between">
                                    <div className="align-items-end cardboxicon">
                                        <i className="fa fa-comments"></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={SMSInvite > 0 ? SMSInvite : 0} /></div>
                                        <div className="font-weight-normal"><IntlMessages id="my_account.smsInvite" /></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="twitter">
                    <Card>
                        <div className="pt-0 p-15">
                            <div className="d-flex justify-content-between">
                                <div className="align-items-end cardboxicon">
                                    <i className="fa fa-twitter-square"></i>
                                </div>
                                <div className="text-right">
                                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={TwitterShare > 0 ? TwitterShare : 0} /></div>
                                    <div className="font-weight-normal"><IntlMessages id="my_account.twitterShare" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="faceBook">
                    <Card>
                        <div className="pt-0 p-15">
                            <div className="d-flex justify-content-between">
                                <div className="align-items-end cardboxicon">
                                    <i className="fa fa-facebook-square"></i>
                                </div>
                                <div className="text-right">
                                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={FacebookShare > 0 ? FacebookShare : 0} /></div>
                                    <div className="font-weight-normal"><IntlMessages id="my_account.facebookShare" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="facebookMessenger">
                    <Card>
                        <div className="pt-0 p-15">
                            <div className="d-flex justify-content-between">
                                <div className="align-items-end cardboxicon-fm">
                                    <FaFacebookMessenger />
                                    {/* <i className="fa fa-facebookmessenger"></i> */}
                                </div>
                                <div className="text-right">
                                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={Messenger > 0 ? Messenger : 0} /></div>
                                    <div className="font-weight-normal"><IntlMessages id="my_account.facebookMessenger" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="whatsApp">
                    <Card>
                        <div className="pt-0 p-15">
                            <div className="d-flex justify-content-between">
                                <div className="align-items-end cardboxicon">
                                    <i className="fa fa-whatsapp"></i>
                                </div>
                                <div className="text-right">
                                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={WhatsApp > 0 ? WhatsApp : 0} /></div>
                                    <div className="font-weight-normal"><IntlMessages id="my_account.whatsapp" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="pinterest">
                    <Card>
                        <div className="pt-0 p-15">
                            <div className="d-flex justify-content-between">
                                <div className="align-items-end cardboxicon">
                                    <i className="fa fa-pinterest-square"></i>
                                </div>
                                <div className="text-right">
                                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={Pinterest > 0 ? Pinterest : 0} /></div>
                                    <div className="font-weight-normal"><IntlMessages id="my_account.pinterest" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="linkedin">
                    <Card>
                        <div className="pt-0 p-15">
                            <div className="d-flex justify-content-between">
                                <div className="align-items-end cardboxicon">
                                    <i className="fa fa-linkedin"></i>
                                </div>
                                <div className="text-right">
                                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={LinkedIn > 0 ? LinkedIn : 0} /></div>
                                    <div className="font-weight-normal"><IntlMessages id="my_account.linkedinShare" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="telegram">
                    <Card>
                        <div className="pt-0 p-15">
                            <div className="d-flex justify-content-between">
                                <div className="align-items-end cardboxicon">
                                    <i className="fa fa-telegram"></i>
                                </div>
                                <div className="text-right">
                                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={Telegram > 0 ? Telegram : 0} /></div>
                                    <div className="font-weight-normal"><IntlMessages id="my_account.telegram" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = ({ ReferralProgramReducer }) => {
    const { countsOfReferralDashboard, loading } = ReferralProgramReducer;
    return { countsOfReferralDashboard, loading };
}

export default connect(mapStateToProps, {
    getCountReferralDashboard
})(ReferralCountCardsWdgt);