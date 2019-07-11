import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { connect } from 'react-redux';
import { Tabs, TabProvider, Tab, TabPanel, TabList } from "react-web-tabs";
import AddIPWhitelistWdgt from './AddIPWhitelistWdgt';
import IPWhitelistWdgt from './IPWhitelistWdgt';
import DeviceWhitelistingWdgt from './DeviceWhitelistingWdgt';
import TwoFactorAuth from "./TwoFactoreAuthWdgtBlk";
// intl messages
import IntlMessages from "Util/IntlMessages";
import Tooltip from '@material-ui/core/Tooltip';

class SecurityWdgt extends Component {
  render() {
    return (
      <div>
        <TabProvider>
          <Tabs
            defaultTab="AllowedIPAddress"
            onChange={tabId => {
            }}
          >
            <Row>
              <Col className="pr-0 prsnl_col" md={3}>
                <div className="innertabpanel">
                  <TabList className="myaccountinnerTab">
                    <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="AllowedIPAddress">
                      <Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.security.allowedIPAddress" />}><i className="zmdi zmdi-pin" /></Tooltip>
                      <IntlMessages id="myAccount.Dashboard.myProfileInfo.security.allowedIPAddress" />
                    </Tab>
                    <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="Authentication">
                      <Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.twoFactorAuthentication" />}><i className="zmdi zmdi-portable-wifi" /></Tooltip>
                      <IntlMessages id="myAccount.Dashboard.myProfileInfo.twoFactorAuthentication" />
                    </Tab>
                    <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="IPWhitelisting">
                      <Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipWhitelisting" />}><i className="zmdi zmdi-nature-people" /></Tooltip>
                      <IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipWhitelisting" />
                    </Tab>
                    <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="DeviceWhitelisting">
                      <Tooltip id="tooltip-icon" title={<IntlMessages id="sidebar.deviceWhitelisting" />}><i className="zmdi zmdi-devices" /></Tooltip>
                      <IntlMessages id="sidebar.deviceWhitelisting" />
                    </Tab>

                  </TabList>
                </div>
              </Col>
              <Col md={9} className="p-0">
                <TabPanel tabId="AllowedIPAddress">
                  <div className="tabformtitle">
                    <span><IntlMessages id="myAccount.Dashboard.myProfileInfo.security.allowedIPAddress" /></span>
                    <p>
                      <IntlMessages id="myAccount.Dashboard.myProfileInfo.security.manageTrustedIP" />
                    </p>
                  </div>
                  <div className="px-30 scrty_note">
                      <p className="m-0"><IntlMessages id="myAccount.Dashboard.myProfileInfo.security.trustedIPAddressRestrictions" /></p>
                      <p className="m-0"><IntlMessages id="myAccount.Dashboard.myProfileInfo.security.activateThisAllowIP" /></p>
                  </div>
                  <Row>
                    <Col md={8} sm={12} className="mx-auto">
                      <AddIPWhitelistWdgt {...this.props} />
                    </Col>
                  </Row>
                </TabPanel>
                <TabPanel tabId="IPWhitelisting">
                  <div className="tabformtitle">
                    <span><IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipWhitelistingInformation" /></span>
                    <p>
                      <IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipWhitelistingInformation.description" />
                    </p>
                  </div>

                  <Col md={{ size: 12, offset: 0 }}>
                    <IPWhitelistWdgt {...this.props} />
                  </Col>
                </TabPanel>
                <TabPanel tabId="DeviceWhitelisting">
                  <div className="tabformtitle">
                    <span><IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.deviceWhiteListing" /></span>
                    <p><IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.deviceWhiteListing.description" /></p>
                  </div>
                  <Col md={{ size: 12, offset: 0 }}>
                    <DeviceWhitelistingWdgt {...this.props} />
                  </Col>
                </TabPanel>
                <TabPanel tabId="Authentication">
                  <TwoFactorAuth {...this.props} />
                </TabPanel>
              </Col>
            </Row>
          </Tabs>
        </TabProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { darkMode } = settings;
  return { darkMode };
}

export default connect(mapStateToProps)(SecurityWdgt);