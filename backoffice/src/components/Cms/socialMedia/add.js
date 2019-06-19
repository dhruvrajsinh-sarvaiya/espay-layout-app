/* 
    Created By : Megha Kariya
    Date : 12-02-2019
    Description : CMS Add Social Media Form
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import CRUD Operation For SocialMedia Actions...
import { addNewSocialMedia, getSocialMedias } from 'Actions/SocialMedias';
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
		title: <IntlMessages id="sidebar.addSocialMedia" />,
		link: '',
		index: 0
	}
];
const socialMediaArray = [
	{
		value: "1",
		text: 'cmssocialmedia.socialmediatype.twitter'
	},
	{
		value: "2",
		text: 'cmssocialmedia.socialmediatype.facebook'
	}
];
//Validation for Social Media Form
const validateCmsSocialMediaInput = require('../../../validation/SocialMedias/socialMedias');

class AddSocialMedia extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			btn_disabled: false,
			selectedSocialMedias: [],
			addSocialMediaDetail: {

				status: "1",
				date_created: "",
				date_modified: "",
				created_by: "",
				modified_by: "",
				details: {},
				social_media_type: '',
			},
			fieldList: {},
			menudetail: [],
			Pflag: true,
		};
		this.initState = {
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			btn_disabled: false,
			selectedSocialMedias: [],
			addSocialMediaDetail: {

				status: "1",
				date_created: "",
				date_modified: "",
				created_by: "",
				modified_by: "",
				details: {},
				social_media_type: '',
			}
		};
		this.onChangeAddSocialMediaDetails = this.onChangeAddSocialMediaDetails.bind(this);
		this.addSocialMediaDetail = this.addSocialMediaDetail.bind(this);
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

	//On Change Add New SocialMedia Details
	onChangeAddSocialMediaDetails(key, value, details = '') {
		if (typeof details != 'undefined' && details != '') {
			let statusCopy = Object.assign({}, this.state.addSocialMediaDetail);

			statusCopy.details[key] = value;
			this.setState(statusCopy);
		}
		else {
			if (key === 'social_media_type') {

				this.setState({
					addSocialMediaDetail: {
						...this.state.addSocialMediaDetail,
						details: {},
						[key]: value
					}
				});
			}
			else {
				this.setState({
					addSocialMediaDetail: {
						...this.state.addSocialMediaDetail,
						[key]: value
					}
				});
			}
		}
	}

	//Add SocialMedia Detail
	addSocialMediaDetail() {
		const { status, details, social_media_type } = this.state.addSocialMediaDetail;
		const { errors, isValid } = validateCmsSocialMediaInput(this.state.addSocialMediaDetail);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		//let isValid=false;
		if (!isValid) {
			let data = {

				status,
				details,
				social_media_type
			}

			setTimeout(() => {
				let res = this.props.addNewSocialMedia(data);
				this.setState({ loading: true });
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
				this.props.getSocialMedias();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (nextProps.data.responseCode === 0) {
			this.setState({ err_msg: '', err_alert: false });
			this.resetData();
			this.props.reload();
		}

		if (typeof nextProps.cms_SocialMedias_list != 'undefined' && nextProps.cms_SocialMedias_list !== '') {
			const newMedia = [];
			{
				nextProps.cms_SocialMedias_list && nextProps.cms_SocialMedias_list.map((media, key) => {
					newMedia.push(media.social_media_type);
				})
			}

			this.setState({
				selectedSocialMedias: newMedia,
				btn_disabled: false
			});
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
		});
	}

	closeAll = () => {
		this.setState(this.initState);
		this.props.closeAll();
		this.setState({
			open: false,
		});
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
		var menudetail = this.checkAndGetMenuAccessDetail('59CF73EE-A4C7-8B61-3F00-E978ACAF7102');
		const { err_alert, activeIndex, errors, addSocialMediaDetail, loading, btn_disabled, selectedSocialMedias } = this.state;
		const { drawerClose } = this.props;

		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="cmssocialmedia.title.add-social-media" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
				{(loading || this.props.menuLoading) && <JbsSectionLoader />}

				{errors.message && <div className="alert_area">
					<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
				</div>}

				<Form className="tradefrm">
					{(menudetail["9EBD9AE5-7103-A522-8F33-96D121504075"] && menudetail["9EBD9AE5-7103-A522-8F33-96D121504075"].Visibility === "E925F86B") && //9EBD9AE5-7103-A522-8F33-96D121504075
						<FormGroup className="mt-20">
							<Label><IntlMessages id="cmssocialmedia.socialmediaform.label.socialmediatype" /> <span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["9EBD9AE5-7103-A522-8F33-96D121504075"].AccessRight === "11E6E7B0") ? true : false}
								type="select" name="social_media_type" id="social_media_type" onChange={(e) => this.onChangeAddSocialMediaDetails('social_media_type', e.target.value)} value={addSocialMediaDetail.social_media_type}>
								<IntlMessages id="cmssocialmedia.socialmediatype.selectSocialMedia" >{(selectOption) => <option value="">{selectOption}</option>}
								</IntlMessages>
								{socialMediaArray && socialMediaArray.map((media, key) => {
									if (selectedSocialMedias.indexOf(media.value) === -1) {
										return (
											<IntlMessages id={media.text}>{(selectOption) => <option key={key} value={media.value}>{selectOption}</option>}</IntlMessages>
										)
									}
								})}
							</Input>
							{errors && errors.social_media_type && errors.social_media_type && <span className="text-danger"><IntlMessages id={errors.social_media_type} /></span>}
						</FormGroup>}

					{addSocialMediaDetail.social_media_type === "1" &&
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
									value={addSocialMediaDetail.details.username}
									maxlength={15}
									onChange={(e) => this.onChangeAddSocialMediaDetails("username", e.target.value, 1)}
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
									value={addSocialMediaDetail.details.source}
									onChange={(e) => this.onChangeAddSocialMediaDetails("source", e.target.value, 1)}
								/>
								{errors && errors.source && errors.source && <span className="text-danger"><IntlMessages id={errors.source} /></span>}
							</FormGroup>
						</div>
					}
					{addSocialMediaDetail.social_media_type === "2" &&
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
									value={addSocialMediaDetail.details.appId}
									maxlength={20}
									onChange={(e) => this.onChangeAddSocialMediaDetails("appId", e.target.value, 1)}
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
									value={addSocialMediaDetail.details.pageUrl}
									onChange={(e) => this.onChangeAddSocialMediaDetails("pageUrl", e.target.value, 1)}
								/>
								{errors && errors.pageUrl && errors.pageUrl && <span className="text-danger"><IntlMessages id={errors.pageUrl} /></span>}
							</FormGroup>
						</div>
					}

					{(menudetail["9F8B3772-745F-2D33-03EF-C9CA2FC17CD3"] && menudetail["9F8B3772-745F-2D33-03EF-C9CA2FC17CD3"].Visibility === "E925F86B") && //9F8B3772-745F-2D33-03EF-C9CA2FC17CD3
						<FormGroup>
							<Label><IntlMessages id="cmssocialmedia.socialmediaform.label.status" /><span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["9F8B3772-745F-2D33-03EF-C9CA2FC17CD3"].AccessRight === "11E6E7B0") ? true : false}
								type="select" name="status" id="status" onChange={(e) => this.onChangeAddSocialMediaDetails('status', e.target.value)} value={addSocialMediaDetail.status}>
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
								onClick={() => this.addSocialMediaDetail()}
								disabled={btn_disabled}
							>
								<IntlMessages id="button.add" />
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
		cms_SocialMedias_list: staticSocialMedias.cms_SocialMedias_list,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};

	return response;
}

export default withRouter(connect(mapStateToProps, {
	addNewSocialMedia, getSocialMedias, getMenuPermissionByID
})(AddSocialMedia));