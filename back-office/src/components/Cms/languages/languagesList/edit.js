/* 
	Createdby : Megha Kariya
	Date : 06/02/2019
    Description : Update Language Form
*/
import React, { Component, Fragment } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getLanguageById, updateLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
const validateLanguage = require('../../../../validation/Localization/language');

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
		index: 3
	},
	{
		title: <IntlMessages id="sidebar.languages" />,
		link: '',
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.languagesList" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.editLanguage" />,
		link: '',
		index: 0
	}
];

class EditLanguage extends Component {
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
			data: {
				language_name: '',
				code: '',
				rtlLayout: 'false',
				locale: '',
				sort_order: '',
				status: ''
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
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
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

	// On Update Language Details
	onChange(key, value) {
		this.setState({
			data: {
				...this.state.data,
				[key]: value
			}
		});
	}

	//Update Language Detail
	onSubmit() {
		const { errors, isValid } = validateLanguage.validateUpdateLanguageInput(this.state.data);

		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		if (isValid) {
			setTimeout(() => {
				this.props.updateLanguage(this.state.data);
				this.setState({ loading: true });
			}, 2000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('F6A362CA-7764-624E-6834-693FD7BEA210');
	}

	componentWillReceiveProps(nextProps) {
		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				if (typeof this.props.languagedata != 'undefined') {
					this.props.getLanguageById(this.props.languagedata._id);
				} else {
					this.resetData();
					this.props.reload();
				}
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (typeof nextProps.addUpdateStatus != 'undefined' && nextProps.addUpdateStatus.responseCode == 0) {
			this.setState({ err_msg: '', err_alert: false });
			this.resetData();
			this.props.reload();
		}

		if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
			if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
				this.setState({ err_alert: true });
			}
			this.setState({
				errors: nextProps.data.errors,
				btn_disabled: false // Added By Megha Kariya (08/02/2019)
			});
		}

		this.setState({
			loading: nextProps.loading,
			data: nextProps.languagedata
		});
	}

	closeAll = () => {
		this.setState(this.initState);
		this.props.closeAll();
		this.setState({ open: false });
	}

	close2Level = () => {
		this.props.close2Level();
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
						response = fieldList;
					}
				}
			}
		}
		return response;
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('2D2FA451-225E-1611-4993-78AFBB6F4D57');
		const { language_name, code, locale, rtlLayout, sort_order, status } = this.state.data;
		const { errors, err_alert, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="sidebar.editLanguage" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
				{(loading || this.props.menuLoading) && <JbsSectionLoader />}
				<Fragment>
					<div>
						<JbsCollapsibleCard heading={<IntlMessages id="sidebar.editLanguage" />}>
							{errors.message && <div className="alert_area">
								<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
							</div>}
							<Form>
								{(menudetail["044D908C-7E22-274C-73CC-AB19666C73EB"] && menudetail["044D908C-7E22-274C-73CC-AB19666C73EB"].Visibility === "E925F86B") && //044D908C-7E22-274C-73CC-AB19666C73EB
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-name" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["044D908C-7E22-274C-73CC-AB19666C73EB"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="language_name"
											id="language_name"
											value={language_name}
											maxLength={50}
											onChange={(e) => this.onChange('language_name', e.target.value)}
										/>
										{errors.language_name && <span className="text-danger"><IntlMessages id={errors.language_name} /></span>}
									</FormGroup>}
								{(menudetail["791C737D-3145-4ACC-2356-63D85FA14285"] && menudetail["791C737D-3145-4ACC-2356-63D85FA14285"].Visibility === "E925F86B") && //791C737D-3145-4ACC-2356-63D85FA14285
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-code" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["791C737D-3145-4ACC-2356-63D85FA14285"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="code"
											id="code"
											value={code}
											onChange={(e) => this.onChange('code', e.target.value)}
										/>
										{errors.code && <span className="text-danger"><IntlMessages id={errors.code} /></span>}
									</FormGroup>}
								{(menudetail["1AE966FE-5759-331E-0BDA-225AE52A651F"] && menudetail["1AE966FE-5759-331E-0BDA-225AE52A651F"].Visibility === "E925F86B") && //1AE966FE-5759-331E-0BDA-225AE52A651F
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-locale" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["1AE966FE-5759-331E-0BDA-225AE52A651F"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="locale"
											id="locale"
											value={locale}
											onChange={(e) => this.onChange('locale', e.target.value)}
										/>
										{errors.locale && <span className="text-danger"><IntlMessages id={errors.locale} /></span>}
									</FormGroup>}
								{(menudetail["27D4B7C9-5E7C-A2A0-9C3B-8F136CF6849F"] && menudetail["27D4B7C9-5E7C-A2A0-9C3B-8F136CF6849F"].Visibility === "E925F86B") && //27D4B7C9-5E7C-A2A0-9C3B-8F136CF6849F
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-rtlLayout" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["27D4B7C9-5E7C-A2A0-9C3B-8F136CF6849F"].AccessRight === "11E6E7B0") ? true : false}
											type="select" name="rtlLayout" id="rtlLayout" value={rtlLayout} onChange={(e) => this.onChange('rtlLayout', e.target.value)}>
											<IntlMessages id="sidebar.no">{(selectOption) => <option value="false">{selectOption}</option>}</IntlMessages>
											<IntlMessages id="sidebar.yes">{(selectOption) => <option value="true">{selectOption}</option>}</IntlMessages>
										</Input>
										{errors.rtlLayout && <span className="text-danger"><IntlMessages id={errors.rtlLayout} /></span>}
									</FormGroup>}
								{(menudetail["4C5D78A3-2965-61FC-3742-316571A926EA"] && menudetail["4C5D78A3-2965-61FC-3742-316571A926EA"].Visibility === "E925F86B") && //4C5D78A3-2965-61FC-3742-316571A926EA
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-sort_order" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["4C5D78A3-2965-61FC-3742-316571A926EA"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="sort_order"
											id="sort_order"
											value={sort_order}
											onChange={(e) => this.onChange('sort_order', e.target.value)}
										/>
										{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
									</FormGroup>}
								{(menudetail["56D5C760-258C-6BA7-A7BD-37F262825AEE"] && menudetail["56D5C760-258C-6BA7-A7BD-37F262825AEE"].Visibility === "E925F86B") && //56D5C760-258C-6BA7-A7BD-37F262825AEE
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-status" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["56D5C760-258C-6BA7-A7BD-37F262825AEE"].AccessRight === "11E6E7B0") ? true : false}
											type="select" name="status" id="status" value={status} onChange={(e) => this.onChange('status', e.target.value)}>
											<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
											<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
											<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
										</Input>
										{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
									</FormGroup>}
								{Object.keys(menudetail).length > 0 &&
									<FormGroup>
										<Button
											className="text-white text-bold btn mr-10"
											variant="raised"
											color="primary"
											onClick={() => this.onSubmit()}
											disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
										>
											<IntlMessages id="button.update" />
										</Button>
										<Button
											className="text-white text-bold btn mr-10 btn bg-danger"
											variant="raised"
											onClick={this.resetData}
											disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
										>
											<IntlMessages id="button.cancel" />
										</Button>
									</FormGroup>}
							</Form>
						</JbsCollapsibleCard>
					</div>
				</Fragment>
			</div>
		);
	}
}

const mapStateToProps = ({ languages, authTokenRdcer }) => {
	var response = {
		data: languages.data,
		loading: languages.loading,
		addUpdateStatus: languages.addUpdateStatus,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};

	return response;
}

export default withRouter(connect(mapStateToProps, {
	updateLanguage,
	getLanguageById,
	getMenuPermissionByID
})(EditLanguage));