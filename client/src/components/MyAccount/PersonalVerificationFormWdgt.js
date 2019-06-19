/**
 * Auther : Salim Deraiya
 * Created : 06/12/2018
 * Upadted by:Saloni Rathod(15th April 2019)
 * Personal Verification
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Label, Form, FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { personalVerification, getKYCStatus } from "Actions/MyAccount";
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";
const validatePersonalVerifyForm = require("../../validation/MyAccount/personal_verification_form");

class PersonalVerificationFormWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				Surname: '',
				GivenName: '',
				ValidIdentityCard: '',
				Front: '',
				Back: '',
				Selfie: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '', //getIPAddress(),
				HostName: getHostName()
			},
			isAddData: false,
			loading: false,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });

		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9 ) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0 && this.state.isAddData) {
			this.props.getKYCStatus();
			NotificationManager.success(nextProps.data.ReturnMsg);
			this.setState({ isAddData: false });
		}
	}

	onChange(event) {
		let newObj = Object.assign({}, this.state.data);
		if (event.target.type === 'file') {
			newObj[event.target.name] = event.target.files[0];
		} else {
			newObj[event.target.name] = event.target.value;
		}
		this.setState({ data: newObj });
	}
	onCancel(event) {
		this.setState({
			data: {
				Surname: '',
				GivenName: '',
				ValidIdentityCard: '',
				Front: '',
				Back: '',
				Selfie: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '', //getIPAddress(),
				HostName: getHostName()
			},
			errors: '',
		});
}
	onSubmit(event) {
		event.preventDefault();
		const { errors, isValid } = validatePersonalVerifyForm(this.state.data);
		this.setState({ errors: errors });

		if (isValid) {
			let self = this;
			var reqObj = Object.assign({}, this.state.data);
			getIPAddress().then(function (ipAddress) {
				reqObj.IPAddress = ipAddress;
				self.props.personalVerification(reqObj);
				self.setState({ isAddData: true });
			});
		}
	}

	render() {
		const { Surname, GivenName, ValidIdentityCard } = this.state.data;
		const { loading, errors } = this.state;
		const { showTitle } = this.props;
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<div className="col-md-11 col-sm-11 m-25 px-20">
					{showTitle && <h2 className="heading pb-10 mb-20 border-bottom"><IntlMessages id="sidebar.personalIdentityVerification" /></h2>}
					<Form className="PersonalVerificationForm">
						{showTitle && <FormGroup>
							<div className="row">
								<div className="offset-md-3 fs-12"><IntlMessages id="my_account.personalVerifyNote" /></div>
							</div>
						</FormGroup>}
						<FormGroup>
							<div className="row">
								<label className="col-md-3 col-form-label d-inline"><IntlMessages id="sidebar.surname" /> <span className="font-weight-bold text-danger">*</span></label>
								<div className="col-md-5 col-sm-12">
									<Input type="text" name="Surname" className="" id="Surname" placeholder="Surname" value={Surname} onChange={this.onChange} />
									{errors.Surname && <span className="text-danger"><IntlMessages id={errors.Surname} /></span>}
								</div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<label className="col-md-3 col-form-label d-inline"><IntlMessages id="coinlist.table.th.name" /> <span className="font-weight-bold text-danger">*</span></label>
								<div className="col-md-5 col-sm-12">
									<Input type="text" name="GivenName" className="" id="GivenName" placeholder="Name" value={GivenName} onChange={this.onChange} />
									{errors.GivenName && <span className="text-danger"><IntlMessages id={errors.GivenName} /></span>}
								</div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<label className="col-md-3 col-form-label d-inline"><IntlMessages id="sidebar.validIdentityCard" /> <span className="font-weight-bold text-danger">*</span></label>
								<div className="col-md-5 col-sm-12">
									<Input type="select" name="ValidIdentityCard" className="" id="ValidIdentityCard" value={ValidIdentityCard} onChange={this.onChange}>
										<option value=""><IntlMessages id= "sidebar.selIdentityCard" /></option>
										<option value="Electricity Bill"><IntlMessages id= "sidebar.electricityBill" /></option>
										<option value="Driving Licence"><IntlMessages id="sidebar.drivingLicence" /></option>
										<option value="Aadhar Card"><IntlMessages id="sidebar.aadharCard" /></option>
									</Input>
									{errors.ValidIdentityCard && <span className="text-danger"><IntlMessages id={errors.ValidIdentityCard} /></span>}
								</div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<label className="col-md-3 col-form-label d-inline"><IntlMessages id="sidebar.identityCardFrontSide" /> <span className="font-weight-bold text-danger">*</span></label>
								<div className="col-md-9">
									<Input type="file" name="Front" accept="image/*" id="Front"  className="col-md-4 p-0" onChange={this.onChange} />
									{errors.Front && <span className="text-danger"><IntlMessages id={errors.Front} /></span>}
								</div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<div className="offset-md-3 fs-12 px-15"><IntlMessages id="my_account.personalVerifyNote1" /></div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<label className="col-md-3 col-form-label d-inline"><IntlMessages id="sidebar.identityCardBackSide" /> <span className="font-weight-bold text-danger">*</span></label>
								<div className="col-md-9">
									<Input type="file" name="Back" accept="image/*" id="Back"  className="col-md-4 p-0" onChange={this.onChange} />
									{errors.Back && <span className="text-danger"><IntlMessages id={errors.Back} /></span>}
								</div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<div className="offset-md-3 fs-12 px-15"><IntlMessages id="my_account.personalVerifyNote2" /></div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<label className="col-md-3 col-form-label d-inline"><IntlMessages id="sidebar.selfieWithPhotoIDAndNote" /> <span className="font-weight-bold text-danger">*</span></label>
								<div className="col-md-9">
									<Input type="file" name="Selfie" accept="image/*" id="Selfie"  className="col-md-4 p-0" onChange={this.onChange} />
									{errors.Selfie && <span className="text-danger"><IntlMessages id={errors.Selfie} /></span>}
								</div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="row">
								<div className="offset-md-3 px-15">
									<p className="fs-12"><IntlMessages id="my_account.personalVerifyNote3" /></p>
									<p className="fs-12">
										<span className="mr-15">
											<i className="material-icons mr-10 text-success align-bottom ">check</i><IntlMessages id="my_account.faceClearlyVisible" />
										</span>
										<span className="mr-15">
											<i className="material-icons mr-10 text-success align-bottom">check</i><IntlMessages id="my_account.photoIDClearlyVisible" />
										</span>
										<span className="mr-15">
											<i className="material-icons mr-10 text-success align-bottom">check</i><IntlMessages id="my_account.noteWithTodayDate" />
										</span>
									</p>
									<p className="fs-12">
										<IntlMessages id="my_account.personalVerifyNote4" />
									</p>
								</div>
							</div>
						</FormGroup>
						<FormGroup>
							<div className="offset-md-3 btn_area pl-15">
								<Button disabled={loading} variant="raised" className="perverbtn rounded-0 border-0 text-white" onClick={this.onSubmit}><IntlMessages id="sidebar.btnSubmit" /></Button>
								<Button disabled={loading} variant="raised" className="ml-15 btn-danger rounded-0 border-0 text-white" onClick={this.onCancel}><IntlMessages id="sidebar.btnCancel" /></Button>								
							</div>
						</FormGroup>
					</Form>
				</div>
			</Fragment>
		);
	}
}

// default props value
PersonalVerificationFormWdgt.defaultProps = {
	showTitle: true
}

const mapStateToProps = ({ prsnlVerifyFrmRdcer }) => {
	const { data, loading } = prsnlVerifyFrmRdcer;
	return { data, loading };
};

export default connect(mapStateToProps, {
	personalVerification,
	getKYCStatus
})(PersonalVerificationFormWdgt);