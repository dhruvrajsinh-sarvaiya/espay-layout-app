/**
 * Forgot Password
 */
import React, { Component } from "react";
import { Form, FormGroup, Input } from "reactstrap";
import { connect } from "react-redux";
// redux action
import { forgotPassword } from "Actions/MyAccount";
// intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";
//Validation
const validateForgotPassword = require('../../validation/MyAccount/forgot_password');

class ForgotPasswordWdgt extends Component {
	constructor(props) {
		super();
		this.state = {
			email: "",
			errors: ""
		};
		this.onForgotpwd = this.onForgotpwd.bind(this);
	}

	/**
	 * Forgot Password
	 */
	onForgotpwd() {
		const { email } = this.state;
		const { errors, isValid } = validateForgotPassword(this.state);
		this.setState({ errors: errors });

		if (isValid) {
			this.props.forgotPassword({ email });
		}
	}

	render() {
		const { email, errors } = this.state;
		return (
			<div>
				<Form>
					<FormGroup className="has-wrapper">
						<Input
							type="email"
							value={email}
							name="email"
							id="email"
							className="has-input input-lg"
							placeholder="Enter Email"
							onChange={e => this.setState({ email: e.target.value })}
						/>
						<span className="has-icon">
							<i className="ti-email" />
						</span>
						{errors.email && <span className="text-danger"><IntlMessages id={errors.email} /></span>}
					</FormGroup>
					<FormGroup className="mb-15">
						<MatButton
							variant="raised"
							className="btn-warning text-white w-100"
							onClick={this.onForgotpwd}
						>
							<IntlMessages id={"sidebar.btnSubmit"} />
						</MatButton>
					</FormGroup>
				</Form>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ forgotPasswordRdcer }) => {
	var response = { userList: forgotPasswordRdcer.resetPassword, loading: forgotPasswordRdcer.loading };
	return response;
};

export default connect(mapStateToProps, {
	forgotPassword
})(ForgotPasswordWdgt);