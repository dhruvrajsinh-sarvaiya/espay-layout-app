/**
 * Agency Dashboard
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";
import Divider from "@material-ui/core/Divider";

import {
  ReferralBannerBlk,
  ProfileBlk,
  AntiPhishingCodeBlk,
  APISettingBlk,
  SMSAuthenticationBlk,
  GoogleAuthenticationBlk,
  WithdrawAddressMgmtBlk,
  LoginHistoryDataTable,
  UserProfileBasicInfoBlk,
  WithdrawLimitLevelBlk
} from "Components/MyAccount";

export default class UserAccount extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.userAccount" />}
          match={this.props.match}
        />
        <div className="user-account-body">
          <ReferralBannerBlk />
          <div className="card p-15 mb-15">
            <div className="row">
              <div className="col-md-6 col-sm-12 pt-20">
                <UserProfileBasicInfoBlk />
              </div>
              <div className="col-md-6 col-sm-12">
                <WithdrawLimitLevelBlk />
              </div>
            </div>
          </div>
          <div className="row mb-15">
            <div className="col-md-6 col-sm-12">
              <ProfileBlk />
              <AntiPhishingCodeBlk />
              <APISettingBlk />
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="card p-15">
                <SMSAuthenticationBlk />
                <Divider />
                <GoogleAuthenticationBlk />
              </div>
            </div>
          </div>
          <WithdrawAddressMgmtBlk />
          <div className="row mt-25">
            <div className="col-md-12">
              <LoginHistoryDataTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
