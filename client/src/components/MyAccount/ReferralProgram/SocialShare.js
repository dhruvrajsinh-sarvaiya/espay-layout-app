/**
 * Created By Sanjay
 * Created Date 14/02/2019
 * For Social Network Share 
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup, Row, Col, Label, Input } from 'reactstrap';
import { FaTwitter, FaFacebook, FaPinterest, FaLinkedin, FaTelegram, FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { ShareButtonRoundSquare, ShareBlockStandard } from "react-custom-share";
import { NotificationManager } from "react-notifications";
import 'react-responsive-ui/style.css';
import PhoneInput from 'react-phone-number-input/react-responsive-ui';

// intl messages
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { sendReferralInvitationByEmail, sendReferralInvitationBySMS } from "Actions/MyAccount";

const validateReferralSystem = require('../../../validation/MyAccount/referral_system');

class SocialShare extends Component {

    state = {
        InviteByPhone: {
            MobileNumber: '',
            SMSShareURL: '',
            ReferralChannelTypeId: 2
        },
        InviteByEmail: {
            EmailAddress: '',
            EmailShareURL: '',
            ReferralChannelTypeId: 1
        },
        twitterLink: "",
        facebookLink: "",
        messenger: "",
        whatsAppLink: "",
        pinterestLink: '',
        linkedinLink: '',
        telegramLink: '',
        errors: {},
        flag: true
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            InviteByEmail: {
                ...this.state.InviteByEmail,
                EmailShareURL: nextProps.link
            },
            InviteByPhone: {
                ...this.state.InviteByPhone,
                SMSShareURL: nextProps.smsLink
            },
            twitterLink: nextProps.twitterLink,
            facebookLink: nextProps.facebookLink,
            messenger: nextProps.messenger,
            whatsAppLink: nextProps.whatsAppLink,
            pinterestLink: nextProps.pinterestLink,
            linkedinLink: nextProps.linkedinLink,
            telegramLink: nextProps.telegramLink
        })
        if (nextProps.inviteDataByEmail.hasOwnProperty("ReturnCode") && nextProps.inviteDataByEmail.ReturnCode === 0 && this.state.flag) {
            NotificationManager.success(nextProps.inviteDataByEmail.ReturnMsg);
            this.setState({
                flag: false,
                InviteByEmail: {
                    ...this.state.InviteByEmail,
                    EmailAddress: ''
                }
            })
        } else if (nextProps.inviteDataByEmail.hasOwnProperty("ReturnCode") && nextProps.inviteDataByEmail.ReturnCode !== 0 && this.state.flag) {
            NotificationManager.error(
                <IntlMessages id={`apiWalletErrCode.${nextProps.inviteDataByEmail.ErrorCode}`} />
            );
            this.setState({ flag: false })
        }
        if (nextProps.inviteDataBySMS.hasOwnProperty("ReturnCode") && nextProps.inviteDataBySMS.ReturnCode === 0 && this.state.flag) {
            NotificationManager.success(nextProps.inviteDataBySMS.ReturnMsg);
            this.setState({
                flag: false,
                InviteByPhone: {
                    ...this.state.InviteByPhone,
                    MobileNumber: ''
                }
            })
        } else if (nextProps.inviteDataBySMS.hasOwnProperty("ReturnCode") && nextProps.inviteDataBySMS.ReturnCode !== 0 && this.state.flag) {
            NotificationManager.error(
                <IntlMessages id={`apiWalletErrCode.${nextProps.inviteDataBySMS.ErrorCode}`} />
            );
            this.setState({ flag: false })
        }
    }
    onChangePhoneNumber = (value) => {
        if (typeof value !== 'undefined') {
            this.setState({
                InviteByPhone: {
                    ...this.state.InviteByPhone,
                    MobileNumber: value
                }
            });
        }
    }

    onChangeEmail = (event) => {
        let newObj = Object.assign({}, this.state.InviteByEmail);
        newObj[event.target.name] = event.target.value;
        this.setState({ InviteByEmail: newObj });
    }

    onSubmitPhoneNumber = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateReferralSystem(this.state.InviteByPhone);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.sendReferralInvitationBySMS(this.state.InviteByPhone);
            this.setState({ flag: true })
        }
    }

    onSubmitEmail = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateReferralSystem(this.state.InviteByEmail);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.sendReferralInvitationByEmail(this.state.InviteByEmail);
            this.setState({ flag: true })
        }
    }

    render() {
        const { MobileNumber } = this.state.InviteByPhone;
        const { EmailAddress } = this.state.InviteByEmail;
        const { errors, twitterLink, facebookLink, messenger, whatsAppLink, pinterestLink, linkedinLink, telegramLink } = this.state;
        const referralText = "I just bought my first digital currency on Cooldex";
        const shareOnTwitter = {
            url: twitterLink,
            button: ShareButtonRoundSquare,
            buttons: [
                { network: "Twitter", icon: FaTwitter }
            ],
            text: referralText
        };
        const shareOnFacebook = {
            url: facebookLink,
            button: ShareButtonRoundSquare,
            buttons: [
                { network: "Facebook", icon: FaFacebook }
            ],
            text: referralText
        };
        const shareOnMessenger = {
            url: messenger,
            button: ShareButtonRoundSquare,
            buttons: [
                {
                    network: "FacebookMessenger",
                    icon: FaFacebookMessenger,
                    link: "fb-messenger://share/?link=" + messenger + "&app_id=409847019583577",
                    className: "facebookMessenger-Color mobileMode"
                }
            ],
            text: referralText
        };
        const shareOnWhatsapp = {
            url: whatsAppLink,
            button: ShareButtonRoundSquare,
            buttons: [
                { network: "Whatsapp", icon: FaWhatsapp, link: "whatsapp://send?text=" + referralText + " - " + whatsAppLink, className: "whatsApp-Color mobileMode" }
            ],
            text: referralText
        };
        const shareOnPinterest = {
            url: pinterestLink,
            button: ShareButtonRoundSquare,
            buttons: [
                {
                    network: "Pinterest",
                    icon: FaPinterest,
                    media:
                        "https://cdn.vox-cdn.com/thumbor/AjPwXefAEJBlurBDVHL5ivGksdo=/0x0:4604x3190/1200x800/filters:focal(1934x1227:2670x1963)/cdn.vox-cdn.com/uploads/chorus_image/image/58353021/905283962.jpg.0.jpg"
                }
            ],
            text: referralText
        };
        const shareOnLinkedin = {
            url: linkedinLink,
            button: ShareButtonRoundSquare,
            buttons: [
                {
                    network: "Linkedin",
                    icon: FaLinkedin,
                    // link: "https://www.linkedin.com/sharing/share-offsite/?url=" + linkedinLink
                }
            ],
            text: referralText
        };
        const shareOnTelegram = {
            url: telegramLink,
            button: ShareButtonRoundSquare,
            buttons: [
                { network: "Telegram", icon: FaTelegram, link: "https://t.me/share/url?url=" + telegramLink + "&text=" + referralText, className: "telegram-Color" }
            ],
            text: referralText
        };
        return (
            <div className="card p-15 mt-10 referral-program">
                {this.props.loading && <JbsSectionLoader />}
                <p><IntlMessages id="referral.sharelink" /></p>
                <div className="row" style={{ margin: "auto", justifyContent: "center" }}>
                    <ShareBlockStandard {...shareOnTwitter} />
                    <ShareBlockStandard {...shareOnFacebook} />
                    <ShareBlockStandard {...shareOnMessenger} />
                    <ShareBlockStandard {...shareOnWhatsapp} />
                    <ShareBlockStandard {...shareOnPinterest} />
                    <ShareBlockStandard {...shareOnLinkedin} />
                    <ShareBlockStandard {...shareOnTelegram} />
                </div>
                <Row className="mt-30">
                    <Form className="offset-md-4 col-md-2 offset-sm-2 col-sm-4 col-6 border-right">
                        <FormGroup>
                            <Label for="email"><IntlMessages id="referral.sendEmail" /></Label>
                            <div className="min-Height">
                                <IntlMessages id="compenets.enterEmailAddress">
                                    {(placeholder) => <Input type="text" name="EmailAddress" value={EmailAddress} id="EmailAddress" placeholder={placeholder} onChange={this.onChangeEmail} />}
                                </IntlMessages>
                                {errors.EmailAddress && <div className="text-danger text-left"><IntlMessages id={errors.EmailAddress} /></div>}
                            </div>
                            <Button type="submit" onClick={this.onSubmitEmail} className="perverbtn"><IntlMessages id="referral.invite" /></Button>
                        </FormGroup>
                    </Form>
                    <Form className="col-md-2 col-sm-4 col-6">
                        <FormGroup>
                            <Label for="MobileNumber"><IntlMessages id="referral.sendSMS" /></Label>
                            <div className="min-Height">
                                <IntlMessages id="referral.enterMobile">
                                    {(placeholder) => <PhoneInput
                                        placeholder={placeholder}
                                        value={MobileNumber}
                                        className="form-control"
                                        country="IN"
                                        onChange={this.onChangePhoneNumber} />
                                    }
                                </IntlMessages>
                                {errors.MobileNumber && <div className="text-danger text-left"><IntlMessages id={errors.MobileNumber} /></div>}
                            </div>
                            <Button type="submit" onClick={this.onSubmitPhoneNumber} className="perverbtn"><IntlMessages id="referral.invite" /></Button>
                        </FormGroup>
                    </Form>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = ({ ReferralInviteByEmailAndSMS }) => {
    const { inviteDataByEmail, inviteDataBySMS, loading } = ReferralInviteByEmailAndSMS;
    return { inviteDataByEmail, inviteDataBySMS, loading };
}

export default connect(mapStateToProps, {
    sendReferralInvitationByEmail,
    sendReferralInvitationBySMS
})(SocialShare);