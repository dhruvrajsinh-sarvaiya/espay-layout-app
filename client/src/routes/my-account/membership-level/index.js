/**
 * Agency Dashboard
 */
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { MembershipLevelWdgt } from "Components/MyAccount";

class MembershipLevel extends Component {
	render() {
		return (
			<div className="my-account-wrapper">
				<PageTitleBar
					title={<IntlMessages id="sidebar.membershipLevel" />}
					match={this.props.match}
				/>
				<div className="session-head membershiptitle mt-15 text-center">
					<h2>{<IntlMessages id="sidebar.membershipLevel" />}</h2>
				</div>
				<MembershipLevelWdgt />
			</div>
		);
	}
}

export default MembershipLevel;
