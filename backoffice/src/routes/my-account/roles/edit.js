/**
 * List Roles
 */
import React, { Component } from "react";

//Tab Control
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { EditRolesWdgt, ListRoleUsersWdgt } from "Components/MyAccount";

export default class EditRoles extends Component {
  state = {
    activeIndex: 0
  };

  handleChange(event, value) {
    this.setState({ activeIndex: value });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.editRoles" />}
          match={this.props.match}
        />
        <Tabs
          value={activeIndex}
          textColor="primary"
          indicatorColor="primary"
          onChange={(e, value) => this.handleChange(e, value)}
        >
          <Tab
            label={
              <h3>
                <IntlMessages id="sidebar.tabRoleInfo" />
              </h3>
            }
          />
          <Tab
            label={
              <h3>
                <IntlMessages id="sidebar.tabRoleUsers" />
              </h3>
            }
          />
        </Tabs>
        {activeIndex === 0 && <EditRolesWdgt />}
        {activeIndex === 1 && <ListRoleUsersWdgt />}
      </div>
    );
  }
}
