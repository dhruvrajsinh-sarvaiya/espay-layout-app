/**
 * Auther : Salim Deraiya
 * Created : 12/10/2018
 * Upadted by:Saloni Rathod(15th April 2019)
 * Edit User Profile Widget
 */

import React, { Component } from "react";
import { connect } from 'react-redux';
import { Label, Form, FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";

// redux action
import {
	getProfileByID,
	editProfile
} from "Actions/MyAccount";

// intl messages
import IntlMessages from "Util/IntlMessages";

const validateEditProfile = require('../../validation/MyAccount/edit_profile');

class EditProfileWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				FirstName: '',
				LastName: '',
				Email: '',
				MobileNo: '',
				Username: '',
				isEmailConfirmed: true,
			},
			get_info: 'hide',
			loading: false,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentWillMount() {
		this.props.getProfileByID();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });

		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.statusCode === 200) {
			let userData = nextProps.data.UserData;
			this.setState({
				data: {
					FirstName: userData.FirstName !== 'null' ? userData.FirstName : '',
					LastName: userData.LastName !== 'null' ? userData.LastName : '',
					Email: userData.Email !== 'null' ? userData.Email : '',
					MobileNo: userData.MobileNo !== 'null' ? userData.MobileNo : '',
					Username: userData.Username !== 'null' ? userData.Username : ''
				}
			});
		}
	}

	onChange(event) {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}
	onCancel(event) {
	
		this.setState({
			data: {
				...this.state.data,
				FirstName: this.props.data.UserData.FirstName !== 'null' ? this.props.data.UserData.FirstName : '',
				LastName: this.props.data.UserData.LastName !== 'null' ? this.props.data.UserData.LastName : '',
			},
			errors: '',
		});
}
	onSubmit(event) {
		event.preventDefault();
		let profileObj = {
			FirstName: this.state.data.FirstName,
			LastName: this.state.data.LastName
		}
		const { errors, isValid } = validateEditProfile(profileObj);
		this.setState({ err_alert: false, success_alert: false, errors: errors, get_info: 'show' });
		if (isValid) {
			this.props.editProfile(profileObj);
		}
	}

	render() {
		const { FirstName, LastName, Email, MobileNo, Username } = this.state.data;
		const { loading, errors } = this.state;
		return (
			<div className="my-20 mx-30 darksucessmsg">
				{loading && <JbsSectionLoader />}
				<Form>
					<FormGroup className="row">
						<Label for="FirstName" className="control-label col"><IntlMessages id="my_account.editProfile.firstName" /><span className="text-danger">*</span></Label>
						<div className="col-md-8">
							<IntlMessages id="myaccount.enterFirstName">
								{(placeholder) => <Input type="text" tabIndex="1" name="FirstName" value={FirstName} id="FirstName" placeholder={placeholder} onChange={this.onChange} />}
							</IntlMessages>
							{errors.FirstName && <div className="text-danger text-left"><IntlMessages id={errors.FirstName} /></div>}
						</div>
					</FormGroup>
					<FormGroup className="row">
						<Label for="LastName" className="control-label col"><IntlMessages id="my_account.editProfile.lastName" /><span className="text-danger">*</span></Label>
						<div className="col-md-8">
							<IntlMessages id="myaccount.enterLastName">
								{(placeholder) => <Input type="text" tabIndex="2" name="LastName" value={LastName} id="LastName" placeholder={placeholder} onChange={this.onChange} />}
							</IntlMessages>
							{errors.LastName && <div className="text-danger text-left"><IntlMessages id={errors.LastName} /></div>}
						</div>
					</FormGroup>
					<FormGroup className="row">
						<Label for="Username" className="control-label col-md-4"><IntlMessages id="my_account.editProfile.username" /></Label>
						<div className="col-md-8">
							<Label className="control-label">{Username}</Label>
						</div>
					</FormGroup>
					{Email && <FormGroup className="row">
						<Label for="Email" className="control-label col-md-4"><IntlMessages id="my_account.editProfile.email" /></Label>
						<div className="col-md-8">
							<Label className="control-label">{Email}</Label>
						</div>
					</FormGroup>}
					{MobileNo && <FormGroup className="row">
						<Label for="MobileNo" className="control-label col-md-4"><IntlMessages id="sidebar.mobileNumber" /></Label>
						<div className="col-md-8">
							<Label className="control-label">{MobileNo}</Label>
						</div>
					</FormGroup>}
					<FormGroup className="col text-left">
						<div className="row-md-6 offset-4 mb-15 btn_area">
							<Button disabled={loading} tabIndex="3" type="submit" className="rounded-0 border-0 perverbtn mr-3" variant="raised" onClick={this.onSubmit}><IntlMessages id="sidebar.btnUpdate" /></Button>
							<Button disabled={loading} tabIndex="3"  className="rounded-0 border-0 btn-danger mr-3" variant="raised" onClick={this.onCancel}><IntlMessages id="sidebar.btnCancel" /></Button>
						</div>
					</FormGroup>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = ({ editProfileRdcer }) => {
	const { data, loading } = editProfileRdcer;
	return { data, loading };
};

export default connect(mapStateToProps, {
	getProfileByID,
	editProfile
})(EditProfileWdgt);