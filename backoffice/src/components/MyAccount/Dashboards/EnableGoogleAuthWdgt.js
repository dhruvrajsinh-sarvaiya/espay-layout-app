/**
 * Auther : Kevin Ladani
 * Created : 05/09/2018
 * Updated : 22/10/2018 (Salim Deraiya)
 * Enable Google Auth Widget
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Col, Button, Card, CardBody, Alert } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { enableGoogleAuth, getProfileByID } from 'Actions/MyAccount';
import validateGoogleAuth from "Validations/MyAccount/google_auth";

class EnableGoogleAuthWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				Code: '',
				//SharedKey: '',
				//AuthenticatorUri: ''
			},
			isEnable : false,
			loading: false,
			errors: {}
		};
		
		this.onChange = this.onChange.bind(this);
		this.onSendGoogleAuth = this.onSendGoogleAuth.bind(this);
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
				this.setState({					
					data: {
						Code: ''
					}, 
					isEnable : false
				});

				setTimeout(() => {
					sessionStorage.removeItem("simgUrl");
					// this.props.history.push('app/dashboard/my-account');
					window.location.href = '/app/dashboard/my-account';
				}, 3000);
			}
		}
		// get user info response validator 
		/* if (Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
			// to store user details in global state - added by Nishant 
			this.props.location.state = { ...this.props.location.state, userData: nextProps.profileData.UserData };
			//console.log('user details updated');
		} */
	}

	onChange(event) {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	/**
	 * On Submit SendSms
	 */
	onSendGoogleAuth(event) {
		event.preventDefault();
		const { errors, isValid } = validateGoogleAuth(this.state.data);
		this.setState({ errors: errors });

		if (isValid) {
			this.props.enableGoogleAuth(this.state.data);
			this.setState({ isEnable : true });
		}
	}

	render() {
		const { Code, SharedKey, AuthenticatorUri } = this.state.data;
		const { loading, errors } = this.state;
		return (
			<div className="border border-dark p-25">
				<div className="downloadappbox offset-md-2 mt-10 row">
					<div className="col-md-12">
						<h3><IntlMessages id="my_account.enableGoogleAuth.enableGoogleAuthStep" /></h3>
					</div>
				</div>
				<Form>
					<div className="offset-md-2 downloadappbox row">
						<div className="col-md-10">
							{loading && <JbsSectionLoader />}
							<Card className="marginbox border border-dark">
								<CardBody className="d-flex row">
									<div className="col-md-12">
										{/* <FormGroup className="has-wrapper text-right" row>
											<Label for="Digitkey" className="control-label" sm={4}>16 Digit Key:</Label>
											<Col sm={8}>
												<Input type="Digitkey" name="Digitkey" value={Digitkey} id="Digitkey" placeholder="Enter 16 Digit Key" onChange={this.onChange} />
												{errors.Digitkey && <span className="text-danger text-left"><IntlMessages id={errors.Digitkey} /></span>}
											</Col>
										</FormGroup>
										<FormGroup className="has-wrapper text-right" row>
											<Label for="LoginPassword" className="control-label" sm={4}>Login Password:</Label>
											<Col sm={8}>
												<Input type="LoginPassword" name="LoginPassword" value={LoginPassword} id="LoginPassword" placeholder="Enter Login Password" onChange={this.onChange} />
												{errors.LoginPassword && <span className="text-danger text-left"><IntlMessages id={errors.LoginPassword} /></span>}
											</Col>
										</FormGroup> */}
										<FormGroup className="has-wrapper" row>
											<Label for="Code" className="control-label" sm={5}><IntlMessages id="my_account.enableGoogleAuth.googleAuthCode" /></Label>
											<Col sm={7}>
												<IntlMessages id="myaccount.enterGoogleAuthCode">
													{(placeholder) => <Input type="Code" tabIndex="1" name="Code" value={Code} id="Code" autoComplete="off" maxLength="6" placeholder={placeholder} onChange={this.onChange} /> }
												</IntlMessages>
												{/* <Input type="Code" name="Code" value={Code} id="Code" maxLength="6" onChange={this.onChange} /> */}
												{errors.Code && <span className="text-danger text-left"><IntlMessages id={errors.Code} /></span>}
											</Col>
										</FormGroup>
										<FormGroup className="has-wrapper" row>
											<Col sm={5} />
											<Col sm={2}>
												<Button disabled={loading} tabIndex="2" type="submit" className="perverbtn" variant="raised" onClick={this.onSendGoogleAuth}><IntlMessages id="sidebar.btnEnable" /></Button>
												{/* <MatButton disabled={loading} variant="raised" className="btn-primary text-white mr-5" onClick={this.onSendGoogleAuth}>
													<IntlMessages id="sidebar.btnEnable" />
												</MatButton> */}
											</Col>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
				</Form>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ googleauthenable, editProfileRdcer }) => {
	var response = {
		data: googleauthenable.data,
		loading: googleauthenable.loading,
		errObj: googleauthenable.error,
		profileData: editProfileRdcer.data
	};
	return response;
};

export default connect(mapStateToProps, {
	enableGoogleAuth,
	getProfileByID
})(EnableGoogleAuthWdgt);