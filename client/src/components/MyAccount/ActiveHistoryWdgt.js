import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import IPHistoryDataTable from './IPHistoryDataTable';
import LoginHistoryDataTable from './LoginHistoryDataTable';
import { connect } from 'react-redux';
import ActivityListWdgt from './ActivityListWdgt';
// intl messages
import IntlMessages from "Util/IntlMessages";
import Tooltip from '@material-ui/core/Tooltip';

class ActiveHistoryWdgt extends Component {
  render() {
    return (
      <div>
        <Tabs defaultTab="IPHistory" onChange={tabId => { }}>
          <Row>
            <Col md={3} className="pr-0 prsnl_col">
              <div className="innertabpanel">
                <TabList className="myaccountinnerTab">
                  <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="IPHistory">
                    <Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipHistory" />}><i className="zmdi zmdi-pin" /></Tooltip>
                    <IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipHistory" />
                  </Tab>
                  <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="LoginHistory">
                    <Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.loginHistory" />}><i className="zmdi zmdi-key" /></Tooltip>
                    <IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.loginHistory" />
                  </Tab>
                  <Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="ActivityList">
                    <Tooltip id="tooltip-icon" title={<IntlMessages id="sidebar.ActivityLog" />}><i className="zmdi zmdi-globe" /></Tooltip>
                    <IntlMessages id="sidebar.ActivityLog" />
                  </Tab>
                </TabList>
              </div>
            </Col>
            <Col md={9} className="p-0">
              <TabPanel tabId="IPHistory">
                <div className="tabformtitle">
                  <span><IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipHistory.information" /></span>
                  <p>
                    <IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipWhitelistingInformation.description" />
                  </p>
                </div>

                <Col md={{ size: 12, offset: 0 }}>

                  <IPHistoryDataTable {...this.props} />
                </Col>

              </TabPanel>
              <TabPanel tabId="LoginHistory">
                <div className="tabformtitle">
                  <span><IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.loginHistory.information" /></span>
                  <p>
                    <IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipWhitelistingInformation.description" />
                  </p>
                </div>

                <Col md={{ size: 12, offset: 0 }}>
                  <LoginHistoryDataTable {...this.props} />
                </Col>

              </TabPanel>
              <TabPanel tabId="ActivityList">
                <div className="tabformtitle">
                  <span><IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.activityList.information" /></span>
                  <p>
                    <IntlMessages id="myAccount.Dashboard.myProfileInfo.activityHistory.ipWhitelistingInformation.description" />
                  </p>
                </div>

                <Col md={{ size: 12, offset: 0 }}>
                  <ActivityListWdgt {...this.props} />
                </Col>
              </TabPanel>
            </Col>
          </Row>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { darkMode } = settings;
  return { darkMode };
}

export default connect(mapStateToProps)(ActiveHistoryWdgt);