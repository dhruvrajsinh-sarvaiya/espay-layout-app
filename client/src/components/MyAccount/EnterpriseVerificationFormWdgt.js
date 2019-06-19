/**
 * Active User Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Button, Alert } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { enterpriseVerification } from "Actions/MyAccount";
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode,
	countryList
} from "Helpers/helpers";
//Import Validation
const validateEnterpriseVerifyForm = require("../../validation/MyAccount/enterprise_verification_form");

class EnterpriseVerificationFormWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				register_company_name: "",
				company_address: "",
				registered_country: "",
				sources_of_founding: "",
				url_of_goverment_website: "",
				orgnal_crtf_of_incrpt_bsnc: "",
				memrnd_n_article_of_association: "",
				ownership_n_cntr_strct: "",
				list_of_all_directors: "",
				crtf_of_incumbency: "",
				applicant_full_name: "",
				applicant_country: "",
				applicant_job_title: "",
				applicant_phone_no: "",
				applicant_passport_cover: "",
				applicant_passport_personal_page: "",
				applicant_selfie: "",
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '', //getIPAddress(),
				HostName: getHostName()
			},
			loading: false,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// console.log('Nextprops :',nextProps);
        this.setState({ loading : nextProps.loading });
		
		if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			NotificationManager.success(nextProps.data.ReturnMsg);
        }
    }

    onChange(event) {
		let newObj = Object.assign({}, this.state.data);
		if(event.target.type === 'file') {
			newObj[event.target.name] =  event.target.files[0];
		} else {
			newObj[event.target.name] = event.target.value;
		}
		this.setState({ data : newObj });
	}

	onSubmit(event) {
		event.preventDefault();
		const { errors, isValid } = validateEnterpriseVerifyForm(this.state);
		this.setState({ errors: errors });

		if (isValid) {
			let self = this;
			var reqObj = Object.assign({},this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.props.enterpriseVerification(reqObj);
            });
		}
	}

	render() {
		const { register_company_name, company_address, registered_country, sources_of_founding, url_of_goverment_website, applicant_full_name, applicant_country, applicant_job_title, applicant_phone_no } = this.state.data;
		const { loading, errors } = this.state;
		const country_list = countryList();
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<div className="mb-0">
					<h2 className="heading pb-10 mb-20 border-bottom"><IntlMessages id="sidebar.enterpriseVerification" /></h2>
					<form>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.registerCompanyNameInfo" /></label>
							<Input type="text" name="register_company_name" className="w-50" id="register_company_name" value={register_company_name} onChange={this.onChange} />
							{errors.register_company_name && <span className="text-danger"><IntlMessages id={errors.register_company_name} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="sidebar.companyAddress" /></label>
							<Input type="textarea" name="company_address" className="w-50" id="company_address" value={company_address} onChange={this.onChange} />
							{errors.company_address && <span className="text-danger"><IntlMessages id={errors.company_address} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="sidebar.registeredCountry" /></label>
							<Input type="select" name="registered_country" className="w-50" id="registered_country" value={registered_country} onChange={this.onChange}>
								<option value="">-- Select Country --</option>
								{country_list &&
									country_list.map((list, index) => (
										<option key={index} value={list.id}>
											{list.name}
										</option>
									))
								}
							</Input>
							{errors.registered_country && <span className="text-danger"><IntlMessages id={errors.registered_country} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="sidebar.sourcesOfFunding" /></label>
							<Input type="text" name="sources_of_founding" className="w-50" id="sources_of_founding" value={sources_of_founding} onChange={this.onChange} />
							{errors.sources_of_founding && <span className="text-danger"><IntlMessages id={errors.sources_of_founding} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.urlOfGovermentWebsiteInfo" /></label>
							<Input type="text" name="url_of_goverment_website" className="w-50" id="url_of_goverment_website" value={url_of_goverment_website} onChange={this.onChange} />
							{errors.url_of_goverment_website && <span className="text-danger"><IntlMessages id={errors.url_of_goverment_website} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.originalCertificateInfo" /></label>
							<Input type="file" name="orgnal_crtf_of_incrpt_bsnc" id="orgnal_crtf_of_incrpt_bsnc" onChange={this.onChange} />
							{errors.orgnal_crtf_of_incrpt_bsnc && <span className="text-danger"><IntlMessages id={errors.orgnal_crtf_of_incrpt_bsnc} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.memorandumAndArticlesInfo" /></label>
							<Input type="file" name="memrnd_n_article_of_association" id="memrnd_n_article_of_association" onChange={this.onChange} />
							{errors.memrnd_n_article_of_association && <span className="text-danger"><IntlMessages id={errors.memrnd_n_article_of_association} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.ownershipAndControlInfo" /></label>
							<Input type="file" name="ownership_n_cntr_strct" id="ownership_n_cntr_strct" onChange={this.onChange} />
							{errors.ownership_n_cntr_strct && <span className="text-danger"><IntlMessages id={errors.ownership_n_cntr_strct} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="sidebar.listOfAllDirectors" /></label>
							<Input type="file" name="list_of_all_directors" id="list_of_all_directors" onChange={this.onChange} />
							{errors.list_of_all_directors && <span className="text-danger"><IntlMessages id={errors.list_of_all_directors} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.certificateOfIncumbencyInfo" /></label>
							<Input type="file" name="crtf_of_incumbency" id="crtf_of_incumbency" onChange={this.onChange} />
							{errors.crtf_of_incumbency &&  <span className="text-danger"><IntlMessages id={errors.crtf_of_incumbency} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.applicationFullNameInfo" /></label>
							<Input type="text" name="applicant_full_name" className="w-50" id="applicant_full_name" value={applicant_full_name} onChange={this.onChange} />
							{errors.applicant_full_name && <span className="text-danger"><IntlMessages id={errors.applicant_full_name} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="sidebar.applicationsCountry" /></label>
							<Input type="select" name="applicant_country" className="w-50" id="applicant_country" value={applicant_country} onChange={this.onChange}>
								<option value="">-- Select Country --</option>
								{country_list &&
									country_list.map((list, index) => (
										<option key={index} value={list.id}>
											{list.name}
										</option>
									))
								}
							</Input>
							{errors.applicant_country && <span className="text-danger"><IntlMessages id={errors.applicant_country} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="sidebar.applicationJobTitle" /></label>
							<Input type="text" name="applicant_job_title" className="w-50" id="applicant_job_title" value={applicant_job_title} onChange={this.onChange} />
							{errors.applicant_job_title && <span className="text-danger"><IntlMessages id={errors.applicant_job_title} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="sidebar.applicationPhoneNumber" /></label>
							<Input type="text" name="applicant_phone_no" className="w-50" id="applicant_phone_no" value={applicant_phone_no} onChange={this.onChange} />
							{errors.applicant_phone_no && <span className="text-danger"><IntlMessages id={errors.applicant_phone_no} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.applicationPassportCoverInfo" /></label>
							<Input type="file" name="applicant_passport_cover" id="applicant_passport_cover" onChange={this.onChange} />
							{errors.applicant_passport_cover && <span className="text-danger"><IntlMessages id={errors.applicant_passport_cover} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.applicationPassportPersonalInfo" /></label>
							<Input type="file" name="applicant_passport_personal_page" id="applicant_passport_personal_page" onChange={this.onChange} />
							{errors.applicant_passport_personal_page && <span className="text-danger"><IntlMessages id={errors.applicant_passport_personal_page} /></span>}
						</FormGroup>
						<FormGroup>
							<label className="col-form-label"><IntlMessages id="my_account.applicationSelfieWithPhotoInfo" /></label>
							<Input type="file" name="applicant_selfie" id="applicant_selfie" onChange={this.onChange} />
							{errors.applicant_selfie && <span className="text-danger"><IntlMessages id={errors.applicant_selfie} /></span>}
						</FormGroup>
						<FormGroup>
							<p className="text-warning m-0"><IntlMessages id="sidebar.pleaseNote" /></p>
							<p className="m-0"><IntlMessages id="my_account.enterpriseNote1" /></p>
							<p className="m-0"><IntlMessages id="my_account.enterpriseNote2" /></p>
							<p className="m-0"><IntlMessages id="my_account.enterpriseNote3" /></p>
							<p className="m-0"><IntlMessages id="my_account.enterpriseNote4" /></p>
						</FormGroup>
						<Button variant="raised" color="success" className="text-white btn-block w-10" onClick={this.onSubmit}><IntlMessages id="sidebar.btnSubmit" /></Button>
					</form>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ entpriseVerifyFrmRdcer }) => {
	const { data, loading } = entpriseVerifyFrmRdcer;
	return { data, loading };
};

export default connect(mapStateToProps,{ 
	enterpriseVerification 
})(EnterpriseVerificationFormWdgt);