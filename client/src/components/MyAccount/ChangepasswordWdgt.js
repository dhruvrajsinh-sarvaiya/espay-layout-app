/**
 * Auther : Salim Deraiya
 * Created : 12/10/2018
 * Upadted by:Saloni Rathod(15th April 2019)
 * Change Password Widget
 */

import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Label, Form, FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { changePassword } from "Actions/MyAccount";
import validateChangePassword from '../../validation/MyAccount/change_password'

class ChangePasswordWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
			loading: false,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.cleanData = this.cleanData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.statusCode === 200) {
			NotificationManager.success(nextProps.data.ReturnMsg);
			this.cleanData();
		}
	}

	cleanData(event) {
		this.setState({
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
			errors: '',
		});
	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	onSubmit(event) {
		event.preventDefault();
		const { errors, isValid } = validateChangePassword(this.state);
		this.setState({ errors: errors });
		if (isValid) {
			let changeObj = {
				oldPassword: this.state.oldPassword,
				newPassword: this.state.newPassword,
				confirmPassword: this.state.confirmPassword
			}
			this.props.changePassword(changeObj);
		}
	}

	render() {
		const { oldPassword, newPassword, confirmPassword, loading, errors } = this.state;
		return (
			<Fragment>
				<div className="m-auto col-md-9 col-sm-12">
					{loading && <JbsSectionLoader />}
					<Form className="my-20 mx-30">
						<FormGroup className="row">
							<Label for="oldPassword" className="control-label col"><IntlMessages id="sidebar.oldPassword" /><span className="text-danger">*</span></Label>
							<div className="col-md-8">
								<IntlMessages id="myaccount.enterOldPass">
									{(placeholder) =>
										/*Added By Bharat Jograna
										<Input type="password" tabIndex="1" name="oldPassword" value={oldPassword} placeholder={placeholder} id="oldPassword" onChange={this.onChange} />*/
										<Input type="password" tabIndex="1" name="oldPassword" placeholder={placeholder} id="oldPassword" onChange={this.onChange} />
									}
								</IntlMessages>
								{errors.oldPassword && <div className="text-danger text-left"><IntlMessages id={errors.oldPassword} /></div>}
							</div>
						</FormGroup>
						<FormGroup className="row">
							<Label for="newPassword" className="control-label col"><IntlMessages id="sidebar.newPassword" /><span className="text-danger">*</span></Label>
							<div className="col-md-8">
								<IntlMessages id="myaccount.enterNewPass">
									{(placeholder) =>
										/*Added By Bharat Jograna
										<Input type="password" tabIndex="2" name="newPassword" value={newPassword} id="newPassword" placeholder={placeholder} onChange={this.onChange} />*/
										<Input type="password" tabIndex="2" name="newPassword" id="newPassword" placeholder={placeholder} onChange={this.onChange} />
									}
								</IntlMessages>
								{errors.newPassword && <div className="text-danger text-left"><IntlMessages id={errors.newPassword} /></div>}
							</div>
						</FormGroup>
						<FormGroup className="row">
							<Label for="confirmPassword" className="control-label col"><IntlMessages id="sidebar.confirmPassword" /><span className="text-danger">*</span></Label>
							<div className="col-md-8">
								<IntlMessages id="myaccount.enterCofirmNewPass">
									{(placeholder) =>
										/*Added By Bharat Jograna
										<Input type="password" tabIndex="3" name="confirmPassword" value={confirmPassword} id="confirmPassword" placeholder={placeholder} onChange={this.onChange} />*/
										<Input type="password" tabIndex="3" name="confirmPassword" id="confirmPassword" placeholder={placeholder} onChange={this.onChange} />
									}
								</IntlMessages>
								{errors.confirmPassword && <div className="text-danger text-left"><IntlMessages id={errors.confirmPassword} /></div>}
							</div>
						</FormGroup>
						<FormGroup className="row">
							<Label className="col-md-4" />
							<div className="row-md-4">
								<Button disabled={loading} tabIndex="4" type="submit" className="ml-3 rounded-0 border-0 perverbtn mr-3" variant="raised" onClick={this.onSubmit}><IntlMessages id="sidebar.btnChangePassword" /></Button>
								<Button disabled={loading} tabIndex="4" className="ml-2 rounded-0 border-0 btn-danger" variant="raised" onClick={this.cleanData}><IntlMessages id="sidebar.btnCancel" /></Button>
							</div>
						</FormGroup>
					</Form>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ changepwd }) => {
	var response = {
		data: changepwd.data,
		loading: changepwd.loading
	};
	return response;
};

export default connect(mapStateToProps, {
	changePassword
})(ChangePasswordWdgt);