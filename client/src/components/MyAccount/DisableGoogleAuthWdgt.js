/**
 * Auther : Kevin Ladani
 * Created : 12/10/2018
 * Updated : 23/10/2018 (Salim Deraiya)
 * Disable Google Auth Widget
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { disableGoogleauth, getProfileByID } from "Actions/MyAccount";
const validateGoogleAuth = require("../../validation/MyAccount/google_auth");

class DisableGoogleAuthWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Code: '',
			isEnable : false,
			loading: false,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSendGoogleDisable = this.onSendGoogleDisable.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });

		if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			// if success then update global state with updated user details
			if(this.state.isEnable) {
				NotificationManager.success(nextProps.data.ReturnMsg);
				this.props.getProfileByID();
				this.setState({ Code: '', isEnable : false });

				setTimeout(() => {
					this.props.history.push('/app/my-account/my-account-dashboard');
				}, 3000);
			}
		}
		// get user info response validator 
		if (Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
			// to store user details in global state - added by Nishant 
			this.props.location.state = { ...this.props.location.state, userData: nextProps.profileData.UserData };
		}
	}

	onChange(event) {
		this.setState({ Code: event.target.value });
	}

	/**
	 * On Submit SendSms
	 */
	onSendGoogleDisable(event) {
		event.preventDefault();

		const { errors, isValid } = validateGoogleAuth(this.state.Code);
		this.setState({ errors: errors });

		if (isValid) {
			const reqObj = { Code: this.state.Code }
			this.props.disableGoogleauth(reqObj);
			this.setState({ isEnable : true });
		}
	}

	render() {
		const { Code, loading, errors } = this.state;
		return (
			<Fragment>
				<Form>
					<div className="mt-20 downloadappbox w-50 mx-auto">
						{loading && <JbsSectionLoader />}
						<FormGroup className="has-wrapper text-right" row>
							<Label for="Code" className="control-label" sm={6}><IntlMessages id="sidebar.disablegoogleauthcode" /></Label>
							<Col sm={6}>
								<IntlMessages id="myaccount.enterGoogleAuthCode">
									{(placeholder) => <Input type="text" tabIndex="1" name="Code" autoComplete="off" maxLength="6" value={Code} id="Code" placeholder={placeholder} onChange={this.onChange} />}
								</IntlMessages>
								{errors.Code && <span className="text-danger text-left"><IntlMessages id={errors.Code} /></span>}
							</Col>
						</FormGroup>
						<FormGroup className="has-wrapper" row>
							<Col className="offset-md-6" sm={4}>
								<Button disabled={loading} tabIndex="2" type="submit" className="perverbtn mr-5 rounded-0 border-0" onClick={this.onSendGoogleDisable}><IntlMessages id="sidebar.btnDisable" /></Button>
							</Col>
						</FormGroup>
					</div>
				</Form>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ disablegoogleauth, editProfileRdcer }) => {
	var response = {
		data: disablegoogleauth.data,
		loading: disablegoogleauth.loading,
		profileData: editProfileRdcer.data
	};
	return response;
};

export default connect(mapStateToProps, {
	disableGoogleauth,
	getProfileByID
})(DisableGoogleAuthWdgt);