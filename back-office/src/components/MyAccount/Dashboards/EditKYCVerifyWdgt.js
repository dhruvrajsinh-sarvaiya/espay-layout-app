/**
 * Add Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormGroup, Input, Label, Button, Badge } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { editKycVerify, kycVerify } from "Actions/MyAccount";
import { getKycStatus } from "Helpers/helpers";
import validateKYC from "Validations/MyAccount/kyc_verify"
import AppConfig from 'Constants/AppConfig';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

const kycStatusList = getKycStatus();
const KYCStatus = ({ status }) => {
	var htmlStatus = '';
	if (status === 1) {
		htmlStatus = <Badge color="success"><IntlMessages id="sidebar.approval" /></Badge>;
	} else if (status === 2) {
		htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.reject" /></Badge>;
	} else if (status === 4) {
		htmlStatus = <Badge color="warning"><IntlMessages id="sidebar.pending" /></Badge>;
	}
	return htmlStatus;
}

class EditKYCVerifyWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				PageIndex: 1,
				Page_Size: AppConfig.totalRecordDisplayInList,
			},
			VerifyStatus: "",
			Remark: "",
			listKYC: true,
			errors: {},
			fieldList: {},
			ntf_flag: true,
			menudetail: [],
			menuLoading: false,
			notificationFlag: true,
		};
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
	}

	clearData = () => {
		this.setState({ Remark: '', errors: '' });
		this.props.drawerClose();
	}
	componentWillMount() {
		this.props.getMenuPermissionByID('2649246C-803F-55D5-A08B-8F83E1E9588D'); // get wallet menu permission
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
		//Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				this.props.drawerClose();
			}
		}

		if (this.state.ntf_flag && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
			this.setState({ ntf_flag: false });
		} else if (this.state.ntf_flag && nextProps.data.ReturnCode === 0) {
			if (this.state.listKYC) {
				this.setState({ listKYC: false, ntf_flag: false });
				this.clearData();
			}
			NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
			this.props.kycVerify(this.props.menuDetail);
			this.setState({ VerifyStatus: '', Remark: '', errors: '' });
			this.props.drawerClose();
		}
	}

	/* check menu permission */
	checkAndGetMenuAccessDetail(GUID) {
		var response = {};
		var index;
		const { menudetail } = this.state;
		if (menudetail.length) {
			for (index in menudetail) {
				if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
					if (menudetail[index].Fields && menudetail[index].Fields.length) {
						var fieldList = {};
						menudetail[index].Fields.forEach(function (item) {
							fieldList[item.GUID.toUpperCase()] = item;
						});
						response = fieldList;
					}
				}
			}
		}
		return response;
	}
	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	onSubmit = (event) => {
		event.preventDefault();
		var reqObj = {
			id: this.props.pagedata.Id,
			VerifyStatus: this.state.VerifyStatus,
			Remark: this.state.Remark
		};
		const { errors, isValid } = validateKYC(reqObj);
		this.setState({ errors: errors });

		if (isValid) {
			this.setState({ listKYC: true, ntf_flag: true });
			this.props.editKycVerify(reqObj);
		}
	}

	render() {
		const { drawerClose, pagedata } = this.props;
		const { errors } = this.state;
		var menuDetail = this.checkAndGetMenuAccessDetail('3616BAA3-A303-0BB1-6864-C1EF03C321D4');
		if (!menuDetail) {
			menuDetail = { Utility: [], CrudOption: [] }
		}
		var VerifyStatus = this.props.pagedata.VerifyStatus;
		if (this.state.VerifyStatus !== '') {
			VerifyStatus = this.state.VerifyStatus;
		}

		return (
			<div className="jbs-page-content">
				{(this.state.menuLoading) && <JbsSectionLoader />}
				<WalletPageTitle title={<IntlMessages id="sidebar.kycDetails" />} drawerClose={drawerClose} closeAll={this.closeAll} />
				{Object.keys(pagedata).length > 0 &&
					<Fragment>
						<table className="table table-striped">
							<tbody>
								<tr>
									{(menuDetail["637A66E9-0C6A-6AEF-5883-EC6FA6393483"] && menuDetail["637A66E9-0C6A-6AEF-5883-EC6FA6393483"].Visibility === "E925F86B") && //637A66E9-0C6A-6AEF-5883-EC6FA6393483
										<th scope="row"><IntlMessages id="sidebar.firstName" /></th>}
									{(menuDetail["637A66E9-0C6A-6AEF-5883-EC6FA6393483"] && menuDetail["637A66E9-0C6A-6AEF-5883-EC6FA6393483"].Visibility === "E925F86B") && //637A66E9-0C6A-6AEF-5883-EC6FA6393483
										<td>{pagedata.FirstName}</td>}
									{(menuDetail["476FE609-11D0-47B0-156E-B2A43F987448"] && menuDetail["476FE609-11D0-47B0-156E-B2A43F987448"].Visibility === "E925F86B") && //476FE609-11D0-47B0-156E-B2A43F987448
										<th scope="row"><IntlMessages id="sidebar.lastName" /></th>}
									{(menuDetail["476FE609-11D0-47B0-156E-B2A43F987448"] && menuDetail["476FE609-11D0-47B0-156E-B2A43F987448"].Visibility === "E925F86B") && //476FE609-11D0-47B0-156E-B2A43F987448
										<td>{pagedata.LastName}</td>}
								</tr>
								<tr>
									{(menuDetail["9E60D35B-9504-0DE2-6BFD-74A078B92AA9"] && menuDetail["9E60D35B-9504-0DE2-6BFD-74A078B92AA9"].Visibility === "E925F86B") && //9E60D35B-9504-0DE2-6BFD-74A078B92AA9
										<th scope="row"><IntlMessages id="sidebar.username" /></th>}
									{(menuDetail["9E60D35B-9504-0DE2-6BFD-74A078B92AA9"] && menuDetail["9E60D35B-9504-0DE2-6BFD-74A078B92AA9"].Visibility === "E925F86B") && //9E60D35B-9504-0DE2-6BFD-74A078B92AA9
										<td>{pagedata.UserName}</td>}
									{(menuDetail["FD6ADCF5-548F-0D38-6902-0C3546097F6A"] && menuDetail["FD6ADCF5-548F-0D38-6902-0C3546097F6A"].Visibility === "E925F86B") && //FD6ADCF5-548F-0D38-6902-0C3546097F6A
										<th scope="row"><IntlMessages id="sidebar.mobile" /></th>}
									{(menuDetail["FD6ADCF5-548F-0D38-6902-0C3546097F6A"] && menuDetail["FD6ADCF5-548F-0D38-6902-0C3546097F6A"].Visibility === "E925F86B") && //FD6ADCF5-548F-0D38-6902-0C3546097F6A
										<td>{pagedata.Mobile}</td>}
								</tr>
								<tr>
									{(menuDetail["3175F5A5-0B9A-083C-059D-30199D1A0A71"] && menuDetail["3175F5A5-0B9A-083C-059D-30199D1A0A71"].Visibility === "E925F86B") && //3175F5A5-0B9A-083C-059D-30199D1A0A71
										<th scope="row"><IntlMessages id="sidebar.createdBy" /></th>}
									{(menuDetail["3175F5A5-0B9A-083C-059D-30199D1A0A71"] && menuDetail["3175F5A5-0B9A-083C-059D-30199D1A0A71"].Visibility === "E925F86B") && //3175F5A5-0B9A-083C-059D-30199D1A0A71
										<td>{pagedata.Createddate}</td>}
									{(menuDetail["379A1921-9BDA-0894-946E-B86CB3E976E6"] && menuDetail["379A1921-9BDA-0894-946E-B86CB3E976E6"].Visibility === "E925F86B") && //379A1921-9BDA-0894-946E-B86CB3E976E6
										<th scope="row"><IntlMessages id="sidebar.status" /></th>}
									{(menuDetail["379A1921-9BDA-0894-946E-B86CB3E976E6"] && menuDetail["379A1921-9BDA-0894-946E-B86CB3E976E6"].Visibility === "E925F86B") && //379A1921-9BDA-0894-946E-B86CB3E976E6
										<td><KYCStatus status={pagedata.VerifyStatus} /></td>}
								</tr>
							</tbody>
						</table>
						<div>
							{(menuDetail["39D38093-40D6-7B67-4752-715071C67714"] && menuDetail["39D38093-40D6-7B67-4752-715071C67714"].Visibility === "E925F86B") && //39D38093-40D6-7B67-4752-715071C67714
								<h2 className="mb-15"><IntlMessages id="my_account.documents" /></h2>}
							{(menuDetail["39D38093-40D6-7B67-4752-715071C67714"] && menuDetail["39D38093-40D6-7B67-4752-715071C67714"].Visibility === "E925F86B") && //39D38093-40D6-7B67-4752-715071C67714
								<div className="row mb-15">
									<div className="col-md-4 col-12 text-center">
										<Label><IntlMessages id="my_account.identityCardFrontSide" /></Label>
										<div className="img-post mb-15">
											<a href={pagedata.FrontImage} title="" target="_blank"><img src={pagedata.FrontImage} className="img-fluid border-rad-sm" alt="profile post" /></a>
										</div>
									</div>
									<div className="col-md-4 col-12 text-center">
										<Label><IntlMessages id="my_account.identityCardBackSide" /></Label>
										<div className="img-post mb-15">
											<a href={pagedata.BackImage} title="" target="_blank"><img src={pagedata.BackImage} className="img-fluid border-rad-sm" alt="profile post" /></a>
										</div>
									</div>
									<div className="col-md-4 col-12 text-center">
										<Label><IntlMessages id="my_account.selfieWithPhotoIDNNote" /></Label>
										<div className="img-post mb-15">
											<a href={pagedata.SelfieImage} title="" target="_blank"><img src={pagedata.SelfieImage} className="img-fluid border-rad-sm" alt="profile post" /></a>
										</div>
									</div>
								</div>
							}
						</div>
						{this.props.loading && <JbsSectionLoader />}
						<div className="tradefrm">
							{(menuDetail["FD35E10E-780C-211C-5775-142575B23F73"] && menuDetail["FD35E10E-780C-211C-5775-142575B23F73"].Visibility === "E925F86B") && //FD35E10E-780C-211C-5775-142575B23F73
								<FormGroup>
									<div className="row">
										<label className="col form-label"><IntlMessages id="sidebar.status" /><span className="text-danger">*</span></label>
										<div className="col-md-9">
											<Input disabled={(menuDetail["FD35E10E-780C-211C-5775-142575B23F73"].AccessRight === "11E6E7B0") ? true : false} type="select" name="VerifyStatus" id="VerifyStatus" className="w-50" value={VerifyStatus} onChange={this.onChange}>
												<IntlMessages id="sidebar.selStatus">{(optionValue) => <option value="">{optionValue}</option>}</IntlMessages>
												{kycStatusList.map((lst, index) => (
													<IntlMessages key={index} id={lst.label}>{(optionValue) => <option value={lst.id}>{optionValue}</option>}</IntlMessages>
												))}
											</Input>
											{errors.VerifyStatus && <span className="text-danger"><IntlMessages id={errors.VerifyStatus} /></span>}
										</div>
									</div>
								</FormGroup>
							}
							{(menuDetail["A95446B3-40B4-047E-4FDF-6F64A35F9383"] && menuDetail["A95446B3-40B4-047E-4FDF-6F64A35F9383"].Visibility === "E925F86B") && //A95446B3-40B4-047E-4FDF-6F64A35F9383
								<FormGroup>
									<div className="row">
										<label className="col form-label"><IntlMessages id="sidebar.remark" /><span className="text-danger">*</span></label>
										<div className="col-md-9">
											<Input disabled={(menuDetail["A95446B3-40B4-047E-4FDF-6F64A35F9383"].AccessRight === "11E6E7B0") ? true : false} type="textarea" rows="5" name="Remark" id="Remark" value={this.state.Remark} onChange={this.onChange} />
											{errors.Remark && <span className="text-danger"><IntlMessages id={errors.Remark} /></span>}
										</div>
									</div>
								</FormGroup>
							}
						</div>
						{Object.keys(menuDetail).length > 0 &&
							<div className="text-right">
								<div className="ds-block">
									<Button disabled={this.props.loading} variant="raised" color="primary" className="mr-15" onClick={this.onSubmit}><IntlMessages id="sidebar.btnUpdate" /></Button>
									<Button disabled={this.props.loading} variant="raised" color="danger" onClick={() => this.clearData()}><IntlMessages id="sidebar.btnCancel" /></Button>
								</div>
							</div>
						}
					</Fragment>
				}
			</div>
		);
	}
}

EditKYCVerifyWdgt.defaultProps = {
	pagedata: {
		FirstName: '',
		LastName: '',
		UserName: '',
		Mobile: '',
		Createddate: '',
		VerifyStatus: '',
		FrontImage: '',
		BackImage: '',
		SelfieImage: ''
	}
}

const mapStateToProps = ({ kycVerifyRdcer, authTokenRdcer }) => {
	const { list, data, loading } = kycVerifyRdcer;
	const { menuLoading, menu_rights } = authTokenRdcer;
	return { list, data, loading, menuLoading, menu_rights };
};

export default withRouter(connect(mapStateToProps, {
	kycVerify,
	editKycVerify,
	getMenuPermissionByID
})(EditKYCVerifyWdgt));