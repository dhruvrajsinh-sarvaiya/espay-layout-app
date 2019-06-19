/**
 * Update By Sanjay 
 * Updated Date 14/02/2019
 */
import React, { Component, Fragment } from "react";
import { Input } from "reactstrap";
import { connect } from "react-redux";
import SocialShare from './SocialShare';
import { NotificationManager } from "react-notifications";
//Copy to Clipborad..
import { CopyToClipboard } from "react-copy-to-clipboard";

// intl messages
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//Action Call 
import { getReferralCode, getReferralURL, getReferralService } from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';

class ReferralDetailBlk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      my_referral_id: "",
      referral_link: AppConfig.referral_link,
      Description: "",
      copied: false,
      smsLink: '',
      twitterLink: '',
      facebookLink: '',
      messenger: '',
      whatsAppLink: '',
      pinterestLink: '',
      linkedinLink: '',
      telegramLink: '',
      flag: true
    };

    this.onCopy = this.onCopy.bind(this);
  }

  onCopy() {
    this.setState({ copied: true });
  }

  componentWillMount() {
    this.props.getReferralCode();
    this.props.getReferralURL();
    this.props.getReferralService();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.referralCode.ReturnCode === 0 && typeof nextProps.referralCode !== "undefined") {
      this.setState({
        my_referral_id: nextProps.referralCode.UserReferralCode
      })
    }
    if (nextProps.getReferralServiceData.ReturnCode === 0 && typeof nextProps.getReferralServiceData !== "undefined") {
      this.setState({
        Description: nextProps.getReferralServiceData.ReferralServiceObj.Description,
      })
    }
    if (nextProps.referralUrl.ReturnCode === 0 && typeof nextProps.referralUrl !== "undefined" && this.state.flag) {
      this.setState({
        referral_link: this.state.referral_link + nextProps.referralUrl.ShareURL.EmailURL,
        smsLink: this.state.referral_link + nextProps.referralUrl.ShareURL.SMSURL,
        twitterLink: this.state.referral_link + nextProps.referralUrl.ShareURL.TwitterURL,
        facebookLink: this.state.referral_link + nextProps.referralUrl.ShareURL.FacebookURL,
        messenger: this.state.referral_link + nextProps.referralUrl.ShareURL.MessengerURL,
        whatsAppLink: this.state.referral_link + nextProps.referralUrl.ShareURL.WhatsAppURL,
        pinterestLink: this.state.referral_link + nextProps.referralUrl.ShareURL.PintrestURL,
        linkedinLink: this.state.referral_link + nextProps.referralUrl.ShareURL.LinkedInURL,
        telegramLink: this.state.referral_link + nextProps.referralUrl.ShareURL.TelegramURL,
        flag: false
      })
    }
  }

  render() {
    const {
      my_referral_id,
      referral_link,
      smsLink,
      twitterLink,
      facebookLink,
      messenger,
      whatsAppLink,
      pinterestLink,
      linkedinLink,
      telegramLink,
      Description
    } = this.state;
    var cursor = { cursor: "pointer" };
    var QRCodeLink = "https://chart.googleapis.com/chart?cht=qr&chl=" + referral_link + "&chs=270x270&chld=L|0"
    return (
      <Fragment>
        {this.props.Loading && <JbsSectionLoader />}
        <div className="card p-15">
          <div className="row">
            <div className="col-md-1 col-sm-12 col-xs-12 QR-Size">
              <img className="p-20" src={QRCodeLink} alt="QRCode"></img>
            </div>
            <div className="pr-30 col-md-7 col-xs-12 col-sm-6 border-right">
              <div className="row" style={{ marginLeft: "32%" }}>
                <p>
                  <IntlMessages id="sidebar.myReferralID" />{" "}
                  <span className="text-warning pl-10">{my_referral_id}</span>
                </p>
              </div>
              <div className="ref_lnk_area">
                <p>
                  <div className="referralLinkMobile">
                    <IntlMessages id="sidebar.referralLinkColon" />
                  </div>
                  <Input
                    disabled="disabled"
                    type="text"
                    name="referral_link"
                    className="w-75 d-inline mx-25 link-for-tab"
                    id="referral_link"
                    value={referral_link}
                  />
                  <span className="d-inline-block align-middle" style={cursor}>
                    <CopyToClipboard text={referral_link} onCopy={this.onCopy}>
                      <i className="material-icons">content_copy</i>
                    </CopyToClipboard>
                  </span>
                  {this.state.copied ? NotificationManager.success(<IntlMessages id="sidebar.linkCopied" />) : null}
                </p>
              </div>
            </div>
            <div className="col-md-4 col-xs-12 col-sm-6 px-25 pt-30">
              <div className="row ml-20">
                <p className="m-0 text-center">
                  <IntlMessages id="sidebar.description" />
                  <span className="d-block font-2x text-warning">
                    {Description}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <SocialShare
          link={referral_link}
          twitterLink={twitterLink}
          smsLink={smsLink}
          facebookLink={facebookLink}
          messenger={messenger}
          whatsAppLink={whatsAppLink}
          pinterestLink={pinterestLink}
          linkedinLink={linkedinLink}
          telegramLink={telegramLink}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ ReferralProgramReducer, ReferralReportReducer }) => {
  const { referralCode, referralUrl, loading } = ReferralProgramReducer;
  const { getReferralServiceData } = ReferralReportReducer;
  return { referralCode, referralUrl, getReferralServiceData, loading };
}

export default connect(mapStateToProps, {
  getReferralCode,
  getReferralURL,
  getReferralService
})(ReferralDetailBlk);
