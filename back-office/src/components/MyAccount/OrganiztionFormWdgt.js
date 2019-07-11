/* 
    Developer : Salim Deraiya
    Date : 26-11-2018
    File Comment : Organization Form Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Label, Form, FormGroup, Input, Button, Col } from "reactstrap";
import { getOrganization, addOrganization, editOrganization } from 'Actions/MyAccount';

// added by Bharat Jograna for Loader and NotificationManager
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";


//Validation
const validateOrganization = require("../../validation/MyAccount/organization_form");

class OrganiztionFormWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				OrganizationName: '',
				MobileNo: '',
				Email: '',
				Phone: '',
				Fax: '',
				Website: '',
				LanguageId: '',
				Street: '',
				City: '',
				StateId: '',
				CountryId: '',
				PinCode: ''
			},
			loading: false,
			errors: {}
		};
		this.initState = this.state;
		this.editOrganization = this.editOrganization.bind(this);
		this.resetData = this.resetData.bind(this);
	}


	componentWillMount() {
		this.props.getOrganization();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
		if (nextProps.ext_flag) {
			if (nextProps.addEditOrgData.ReturnCode === 1) {
				var errMsg = nextProps.addEditOrgData.ErrorCode === 1 ? nextProps.addEditOrgData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addEditOrgData.ErrorCode}`} />;

				// added by Bharat Jograna for errMsg
				NotificationManager.error(errMsg);

			} else if (nextProps.addEditOrgData.ReturnCode === 0) {

				//added by Bharat Jograna for success_msg
				NotificationManager.success(nextProps.addEditOrgData.ReturnMsg);

				this.setState({ data: '' });
				this.props.getOrganization();
			}
		} else if (Object.keys(nextProps.orgInfoData).length > 0 && Object.keys(nextProps.orgInfoData.UserData).length > 0) {
			this.setState({ data: nextProps.orgInfoData.UserData });
		}

	}

	resetData() {
		this.setState(this.initState);
	}

	onChange = (event) => {
		var newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	editOrganization(event) {
		event.preventDefault();
		const { errors, isValid } = validateOrganization(this.state.data);
		this.setState({ errors: errors, getListValue: true });
		this.setState({ err_alert: false, success_alert: false, errors: errors });
		if (isValid) {
			this.props.editOrganization(this.state.data);
		}
	}


	render() {
		const { OrganizationName, MobileNo, Email, Phone, Fax, Website, LanguageId, Street, City, StateId, PinCode, CountryId } = this.state.data;
		const { loading, errors } = this.state;
		return (
			<Fragment>

				{loading
					?
					<JbsSectionLoader />
					:
					<Form>
						<div className="row tradefrm">
							<div className="col-md-6 col-sm-12 pr-0 pt-15">
								<h2 className="page_title"><IntlMessages id="my_account.basicInfo" /></h2>
								<div className="border-right pr-30">
									<FormGroup className="row">
										<Label for="OrganizationName" className="control-label col-md-3"><IntlMessages id="sidebar.organizationName" /></Label>
										<div className="col-md-8">
											<Input type="text" name="OrganizationName" value={OrganizationName} id="OrganizationName" onChange={(e) => this.onChange(e)} />
											{errors.OrganizationName && <div className="text-danger text-left"><IntlMessages id={errors.OrganizationName} /></div>}
										</div>
									</FormGroup>
									<FormGroup className="row">
										<Label for="Email" className="control-label col-md-3"><IntlMessages id="sidebar.email" /></Label>
										<div className="col-md-8">
											<Input type="text" name="Email" value={Email} id="Email" onChange={(e) => this.onChange(e)} />
											{errors.Email && <div className="text-danger text-left"><IntlMessages id={errors.Email} /></div>}
										</div>
									</FormGroup>
									<FormGroup className="row">
										<Label for="MobileNo" className="control-label col-md-3"><IntlMessages id="sidebar.mobile" /></Label>
										<div className="col-md-8">
											<Input type="text" name="MobileNo" value={MobileNo} id="MobileNo" onChange={(e) => this.onChange(e)} />
											{errors.MobileNo && <div className="text-danger text-left"><IntlMessages id={errors.MobileNo} /></div>}
										</div>
									</FormGroup>
									<FormGroup className="row">
										<Label for="Fax" className="control-label col-md-3"><IntlMessages id="sidebar.fax" /></Label>
										<div className="col-md-8">
											<Input type="text" name="Fax" value={Fax} id="Fax" onChange={(e) => this.onChange(e)} />
											{errors.Fax && <div className="text-danger text-left"><IntlMessages id={errors.Fax} /></div>}
										</div>
									</FormGroup>
									<FormGroup className="row">
										<Label for="Website" className="control-label col-md-3"><IntlMessages id="sidebar.website" /></Label>
										<div className="col-md-8">
											<Input type="text" name="Website" value={Website} id="Website" onChange={(e) => this.onChange(e)} />
											{errors.Website && <div className="text-danger text-left"><IntlMessages id={errors.Website} /></div>}
										</div>
									</FormGroup>
									<FormGroup className="row mb-0">
										<Label for="LanguageId" className="control-label col-md-3"><IntlMessages id="sidebar.language" /></Label>
										<div className="col-md-8">
											<Input type="select" name="LanguageId" value={LanguageId} id="LanguageId" onChange={(e) => this.onChange(e)}>
												<IntlMessages id="sidebar.selLanguages">
													{(placeholder) =>
														<option value="">{placeholder}</option>
													}
												</IntlMessages>
												<option value="0">English</option>
												<option value="1">German</option>
												<option value="2">Chinese</option>
											</Input>
											{errors.LanguageId && <div className="text-danger text-left"><IntlMessages id={errors.LanguageId} /></div>}
										</div>
									</FormGroup>
								</div>
							</div>
							<div className="col-md-6 col-sm-12 pl-15 pt-15">
								<h2 className="page_title"><IntlMessages id="my_account.addressInfo" /></h2>
								<FormGroup className="row">
									<Label for="Phone" className="control-label col-md-3"><IntlMessages id="sidebar.phone" /></Label>
									<div className="col-md-8">
										<Input type="text" name="Phone" value={Phone} id="Phone" onChange={(e) => this.onChange(e)} />
										{errors.Phone && <div className="text-danger text-left"><IntlMessages id={errors.Phone} /></div>}
									</div>
								</FormGroup>
								<FormGroup className="row">
									<Label for="Street" className="control-label col-md-3"><IntlMessages id="sidebar.street" /></Label>
									<div className="col-md-8">
										<Input type="text" name="Street" value={Street} id="Street" onChange={(e) => this.onChange(e)} />
										{errors.Street && <div className="text-danger text-left"><IntlMessages id={errors.Street} /></div>}
									</div>
								</FormGroup>
								<FormGroup className="row">
									<Label for="City" className="control-label col-md-3"><IntlMessages id="sidebar.city" /></Label>
									<div className="col-md-8">
										<Input type="text" name="City" value={City} id="City" onChange={(e) => this.onChange(e)} />
										{errors.City && <div className="text-danger text-left"><IntlMessages id={errors.City} /></div>}
									</div>
								</FormGroup>
								<FormGroup className="row">
									<Label for="PinCode" className="control-label col-md-3"><IntlMessages id="sidebar.pincode" /></Label>
									<div className="col-md-8">
										<Input type="text" name="PinCode" value={PinCode} id="PinCode" onChange={(e) => this.onChange(e)} />
										{errors.PinCode && <div className="text-danger text-left"><IntlMessages id={errors.PinCode} /></div>}
									</div>
								</FormGroup>
								<FormGroup className="row">
									<Label for="CountryId" className="control-label col-md-3"><IntlMessages id="sidebar.country" /></Label>
									<div className="col-md-8">
										<Input type="select" name="CountryId" value={CountryId} id="CountryId" onChange={(e) => this.onChange(e)}>
											<IntlMessages id="sidebar.selCountry">
												{(placeholder) =>
													<option value="">{placeholder}</option>
												}
											</IntlMessages>
											<option value="0">India</option>
											<option value="1">Dubai</option>
											<option value="2">China</option>
										</Input>
										{errors.CountryId && <div className="text-danger text-left"><IntlMessages id={errors.CountryId} /></div>}
									</div>
								</FormGroup>
								<FormGroup className="row mb-0">
									<Label for="StateId" className="control-label col-md-3"><IntlMessages id="sidebar.state" /></Label>
									<div className="col-md-8">
										<Input type="select" name="StateId" value={StateId} id="StateId" onChange={(e) => this.onChange(e)}>
											<IntlMessages id="sidebar.selState">
												{(placeholder) =>
													<option value="">{placeholder}</option>
												}
											</IntlMessages>
											<option value="0">Gujarat</option>
											<option value="1">Rajasthan</option>
											<option value="2">Panjab</option>
										</Input>
										{errors.StateId && <div className="text-danger text-left"><IntlMessages id={errors.StateId} /></div>}
									</div>
								</FormGroup>
							</div>
						</div>
						<Col sm="12" md={{ size: 1, offset: 11 }} className="mt-15">
							<Button onClick={this.editOrganization} color="primary" className="mr-10 oraniztionfrom_info"><IntlMessages id="sidebar.btnAdd" /></Button>
						</Col>
					</Form>
				}
			</Fragment>
		);
	}
}

const mapPropsToState = ({ orgInfoRdcer }) => {
	const { orgInfoData, addEditOrgData, loading, ext_flag } = orgInfoRdcer;
	return { orgInfoData, addEditOrgData, loading, ext_flag };
}

export default connect(mapPropsToState, {
	getOrganization,
	addOrganization,
	editOrganization
})(OrganiztionFormWdgt);