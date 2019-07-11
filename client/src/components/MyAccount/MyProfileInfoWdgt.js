/**
 * My Profile Info
 */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { TabProvider, Tab, TabPanel, TabList } from "react-web-tabs";
import SecurityWdgt from "./SecurityWdgt";
import ActiveHistory from "./ActiveHistoryWdgt";
import ProfileWdgt from "./ProfileWdgt";
import ComplainWdgt from "./ComplainWdgt";
import { withRouter } from "react-router-dom";
// intl messages
import IntlMessages from "Util/IntlMessages";

class MyProfileInfoWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Profile: "",
      Security: "",
      Authentication: "",
      ActiveSessions: "",
      ActiveHistory: "",
      Complain: "",
      Default: ""
    };
  }

  componentWillMount() {
    let prevObj = this.props.location.state;
    if (prevObj.Profile !== undefined) {
      this.setState({
        Default: prevObj.Profile,
      });
    } else if (prevObj.Security !== undefined) {
      this.setState({
        Default: prevObj.Security
      });
    } else if (prevObj.Authentication !== undefined) {
      this.setState({
        Default: prevObj.Authentication
      });
    } else if (prevObj.ActiveSessions !== undefined) {
      this.setState({
        Default: prevObj.ActiveSessions
      });
    } else if (prevObj.ActiveHistory !== undefined) {
      this.setState({
        Default: prevObj.ActiveHistory
      });
    } else if (prevObj.Complain !== undefined) {
      this.setState({
        Default: prevObj.Complain
      });
    }
  }

  render() {
    let def = this.state.Default;
    return (
      <Row className="my_profile_tab">
        <TabProvider defaultTab={def}>
          <Col className="colright" md={1}>
            <TabList className="myaccountTab clearfix">
              <Tab tabFor="Profile">
                <span className="material-icons mr-10">person</span>
                <IntlMessages id="myAccount.Dashboard.myProfileInfo.profile" />
              </Tab>
              <Tab tabFor="Security">
                <span className="material-icons mr-10">security</span>
                <IntlMessages id="myAccount.Dashboard.myProfileInfo.security" />
              </Tab>
              <Tab tabFor="ActiveHistory">
                <span className="material-icons mr-10">history</span>
                <IntlMessages id="myAccount.Dashboard.myProfileInfo.history" />
              </Tab>
              <Tab tabFor="Complain">
                <span className="material-icons mr-10">help</span>
                <IntlMessages id="my_account.helpNSupoort" />
              </Tab>
            </TabList>
          </Col>

          <Col className="colleft" md={11}>
            <TabPanel tabId="Profile">
              <ProfileWdgt {...this.props} />
            </TabPanel>
            <TabPanel tabId="Security">
              <SecurityWdgt {...this.props} />
            </TabPanel>
            {/* <TabPanel tabId="ProfileImage">
              </TabPanel> */}
            <TabPanel tabId="ActiveHistory">
              <ActiveHistory {...this.props} />
            </TabPanel>
            <TabPanel tabId="Complain">
              <ComplainWdgt {...this.props} />
            </TabPanel>
          </Col>
        </TabProvider>
      </Row>
    );
  }
}

export default withRouter(MyProfileInfoWdgt);
