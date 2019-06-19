/* 
    Created By : Megha Kariya
    Date : 12-02-2019
    Description : CMS Edit Social Media Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getSocialMedias, updateSocialMedia } from 'Actions/SocialMedias';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
//BreadCrumbData
const BreadCrumbData = [
	{
		title: <IntlMessages id="sidebar.app" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.dashboard" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.cms" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.SocialMedia" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.editSocialMedia" />,
		link: '',
		index: 0
	}
];
//Validation for Social Media Form
const validateCmsSocialMediaInput = require('../../../validation/SocialMedias/socialMedias');

class EditSocialMedia extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			activeIndex: 1,
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			btn_disabled: false,
			socialMediadetail: {
				name: '',
				social_media_type: "",
				details: {},
				status: "1",
				date_created: "",
				date_modified: "",
				created_by: "",
				modified_by: ""
			},
			fieldList: {},
			menudetail: [],
			Pflag: true,
		};
		this.initState = {
			activeIndex: 1,
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			btn_disabled: false
		};
		this.onUpdateSocialMediaDetail = this.onUpdateSocialMediaDetail.bind(this);
		this.updateSocialMediaDetail = this.updateSocialMediaDetail.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.resetData = this.resetData.bind(this);
	}

	resetData() {
		this.setState(this.initState);
		this.props.drawerClose();
	}

	onDismiss() {
		let err = delete this.state.errors['message'];
		this.setState({ err_alert: false, errors: err });
	}

	// Handle tab Change 
	handleChange(e, value) {
		this.setState({ activeIndex: value });
	}

	//On Update SocialMedia Details
	onUpdateSocialMediaDetail(key, value, details = '') {
		if (typeof details != 'undefined' && details != '') {
			let statusCopy = Object.assign({}, this.state.socialMediadetail);
			statusCopy.details[key] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				socialMediadetail: {
					...this.state.socialMediadetail,
					[key]: value
				}
			});
		}
	}

	//Update SocialMedia Detail
	updateSocialMediaDetail() {
		const { status, details, social_media_type, name } = this.state.socialMediadetail;
		const { errors, isValid } = validateCmsSocialMediaInput(this.state.socialMediadetail);
		this.setState({ errors: errors, btn_disabled: true });
		if (!isValid) {
			let data = {
				id: this.state.socialMediadetail._id,
				name,
				details,
				status,
				social_media_type
			}
			setTimeout(() => {
				this.props.updateSocialMedia(data);
			}, 2000);
		}
		else {
			this.setState({ btn_disabled: false });
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('B84A778D-46BE-0D56-5506-F566E37F89C9');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				let SocialMediaId = this.props.SocialMediadata.social_media_type;
				if (SocialMediaId != '') {
					this.props.getSocialMedias(SocialMediaId);
				} else {
					//this.props.drawerClose();
					this.resetData();
				}
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}


		if (typeof nextProps.SocialMediadata != 'undefined' && nextProps.SocialMediadata != '') {

			this.state.socialMediadetail._id = nextProps.SocialMediadata._id;
			this.state.socialMediadetail.status = nextProps.SocialMediadata.status + "";
			this.state.socialMediadetail.name = nextProps.SocialMediadata.name;
			this.state.socialMediadetail.details = nextProps.SocialMediadata.details;
			this.state.socialMediadetail.social_media_type = nextProps.SocialMediadata.social_media_type;
			this.setState({
				socialMediadetail: this.state.socialMediadetail
			});
		}

		if (nextProps.data.responseCode === 0) {
			this.setState({ err_msg: '', err_alert: false });
			//this.props.drawerClose();
			this.resetData();
			this.props.reload();
		}

		if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
			if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {

				this.setState({ err_alert: true });
			}
			this.setState({
				errors: nextProps.data.errors,
				btn_disabled: false
			});
		}

		this.setState({
			loading: nextProps.loading,
			language: nextProps.language
		});
	}

	closeAll = () => {
		this.setState(this.initState);
		this.props.closeAll();
		this.setState({ open: false });
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
						return response = fieldList;
					}
				}
			}
		} else {
			return response;
		}
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('17CC3898-71E9-6A91-22A2-E660157C3744');
		const { err_alert, err_msg, activeIndex, language, errors, socialMediadetail, loading, btn_disabled } = this.state;
		const { drawerClose } = this.props;

		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="cmssocialmedia.title.edit-social-media" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
				{(loading || this.props.menuLoading) && <JbsSectionLoader />}

				{errors.message && <div className="alert_area">
					<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
				</div>}

				<Form>
					{(menudetail["FD69D952-0958-71E3-173D-CF1DD45D3C5F"] && menudetail["FD69D952-0958-71E3-173D-CF1DD45D3C5F"].Visibility === "E925F86B") && //FD69D952-0958-71E3-173D-CF1DD45D3C5F
						<FormGroup className="row">
							<div className="col-md-2">
								<Label className="mb-0"><IntlMessages id="cmssocialmedia.socialmediaform.label.medianame" /> :</Label>
							</div>
							<div className="col-md-10">
								<Label> {socialMediadetail.name && (socialMediadetail.name) !== '' ? socialMediadetail.name : '-'}</Label>
							</div>
						</FormGroup>}

					{socialMediadetail.social_media_type === "1" &&
						<div>
							<FormGroup>
								<Label><IntlMessages id="cmssocialmedia.socialmediaform.label.username" /> <span className="text-danger">*</span></Label>
								<DebounceInput
									minLength={0}
									debounceTimeout={300}
									className="form-control"
									type="text"
									name="username"
									id="username"
									value={socialMediadetail.details.username}
									maxlength={15}
									onChange={(e) => this.onUpdateSocialMediaDetail("username", e.target.value, 1)}
								/>
								{errors && errors.username && errors.username && <span className="text-danger"><IntlMessages id={errors.username} /></span>}
							</FormGroup>

							<FormGroup>
								<Label><IntlMessages id="cmssocialmedia.socialmediaform.label.source" /> <span className="text-danger">*</span></Label>
								<DebounceInput
									minLength={0}
									debounceTimeout={300}
									className="form-control"
									type="text"
									name="source"
									id="source"
									value={socialMediadetail.details.source}
									onChange={(e) => this.onUpdateSocialMediaDetail("source", e.target.value, 1)}
								/>
								{errors && errors.source && errors.source && <span className="text-danger"><IntlMessages id={errors.source} /></span>}
							</FormGroup>
						</div>
					}

					{socialMediadetail.social_media_type === "2" &&
						<div>
							<FormGroup>
								<Label><IntlMessages id="cmssocialmedia.socialmediaform.label.appId" /> <span className="text-danger">*</span></Label>
								<DebounceInput
									minLength={0}
									debounceTimeout={300}
									className="form-control"
									type="text"
									name="appId"
									id="appId"
									value={socialMediadetail.details.appId}
									maxlength={20}
									onChange={(e) => this.onUpdateSocialMediaDetail("appId", e.target.value, 1)}
								/>
								{errors && errors.appId && errors.appId && <span className="text-danger"><IntlMessages id={errors.appId} /></span>}
							</FormGroup>

							<FormGroup>
								<Label><IntlMessages id="cmssocialmedia.socialmediaform.label.pageUrl" /> <span className="text-danger">*</span></Label>
								<DebounceInput
									minLength={0}
									debounceTimeout={300}
									className="form-control"
									type="text"
									name="pageUrl"
									id="pageUrl"
									value={socialMediadetail.details.pageUrl}
									onChange={(e) => this.onUpdateSocialMediaDetail("pageUrl", e.target.value, 1)}
								/>
								{errors && errors.pageUrl && errors.pageUrl && <span className="text-danger"><IntlMessages id={errors.pageUrl} /></span>}
							</FormGroup>
						</div>
					}

					{(menudetail["B6B2D4FD-61B0-6245-589D-66A2D7067154"] && menudetail["B6B2D4FD-61B0-6245-589D-66A2D7067154"].Visibility === "E925F86B") && //B6B2D4FD-61B0-6245-589D-66A2D7067154
						<FormGroup>
							<Label><IntlMessages id="cmssocialmedia.socialmediaform.label.status" /><span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["B6B2D4FD-61B0-6245-589D-66A2D7067154"].AccessRight === "11E6E7B0") ? true : false}
								type="select" name="status" id="status" onChange={(e) => this.onUpdateSocialMediaDetail('status', e.target.value)} value={socialMediadetail.status}>>
							<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
								<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
							</Input>
							{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
						</FormGroup>}

					{(menudetail) &&
						<FormGroup>
							<Button
								className="text-white text-bold btn mr-10"
								variant="raised"
								color="primary"
								onClick={() => this.updateSocialMediaDetail()}
								disabled={btn_disabled}
							>
								<IntlMessages id="button.update" />
							</Button>

							<Button
								className="text-white text-bold btn mr-10 btn bg-danger text-white"
								variant="raised"
								onClick={this.resetData}
								disabled={btn_disabled}
							>
								<IntlMessages id="button.cancel" />
							</Button>
						</FormGroup>}
				</Form>
			</div>
		);
	}
}

const mapStateToProps = ({ staticSocialMedias, authTokenRdcer }) => {
	var response = {
		data: staticSocialMedias.data,
		loading: staticSocialMedias.loading,
		updatestatus: staticSocialMedias.updatestatus,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};

	return response;
}

export default withRouter(connect(mapStateToProps, {
	updateSocialMedia,
	getSocialMedias,
	getMenuPermissionByID,
})(EditSocialMedia));