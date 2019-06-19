import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core';
import TwoFactoreAuthWdgt from "./TwoFactoreAuthWdgt";
import SmsAuthWdgt from "./SmsAuthWidget";
import DisableSmsAuthWdgt from "./DisableSmsAuthWdgt";
import GoogleAuthWdgt from "./GoogleAuthWdgt";
import DisableGoogleAuthWdgt from "./DisableGoogleAuthWdgt";
// intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

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
		var BackBtn;
		if (this.state.ViewComponent === "View1") {
			loginButton = (<TwoFactoreAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		if (this.state.ViewComponent === "View2") {
			loginButton = (<SmsAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		if (this.state.ViewComponent === "View3") {
			loginButton = (<DisableSmsAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		if (this.state.ViewComponent === "View4") {
			loginButton = (<GoogleAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		if (this.state.ViewComponent === "View5") {
			loginButton = (<DisableGoogleAuthWdgt {...this.props} changeComponent={this.changeComponent.bind(this)} />);
		}
		if (this.state.ViewComponent !== "View1") {
			BackBtn = (
				<MatButton
				variant="raised"
				hidden={this.state.ViewComponent === "View5"}
				className="btn-danger text-white text-center mt-10"
				onClick={this.onCancel}
			    >
				<IntlMessages id="button.back" />
			  	</MatButton>
			);
		}

		return (
			<div>
				<div className="tabformtitle">
					<span><IntlMessages id="myAccount.Dashboard.myProfileInfo.twoFactorAuthentication" /></span>
					<p><IntlMessages id="myAccount.Dashboard.myProfileInfo.twoFactorAuthentication.description" /></p>
				</div>
				<Fragment>{loginButton}</Fragment>
				{/* <Row>
					<Col md={{ size: 1, offset: 11 }}>{BackBtn}</Col>  comment by Megha Kariya (31/01/2019)
					<Col md={12} className="pl-40 mt-30">{loginButton}</Col>
				</Row> */}
			</div>
		);
	}
}
