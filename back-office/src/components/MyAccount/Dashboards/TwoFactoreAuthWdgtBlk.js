import React, { Component, Fragment } from "react";
import TwoFactoreAuthWdgt from "./TwoFactoreAuthWdgt";
import GoogleAuthWdgt from "./GoogleAuthWdgt";
import DisableGoogleAuthWdgt from "./DisableGoogleAuthWdgt";
// intl messages
import IntlMessages from "Util/IntlMessages";

export default class TwoFactoreAuthWdgtBlk extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ViewComponent: "View1"
		};
		this.onCancel = this.onCancel.bind(this);
	}

	changeComponent(newName) {
		this.setState({
			ViewComponent: newName
		});
	}
	onCancel() {
		this.setState({
			ViewComponent: "View1"
		});
	}

	render() {
		var loginButton;
		if (this.state.ViewComponent === "View1") {
			loginButton = (<TwoFactoreAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		if (this.state.ViewComponent === "View4") {
			loginButton = (<GoogleAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		if (this.state.ViewComponent === "View5") {
			loginButton = (<DisableGoogleAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		return (
			<div className="my-30 mx-auto col-sm-12 col-md-10">
				<div className="tabformtitle" style={{ borderBottom: '1px solid #dfdfdf' }}>
					<span><IntlMessages id="myAccount.Dashboard.myProfileInfo.twoFactorAuthentication" /></span>
					<p><IntlMessages id="myAccount.Dashboard.myProfileInfo.twoFactorAuthentication.description" /></p>
				</div>
				<Fragment>{loginButton}</Fragment>
			</div>
		);
	}
}
