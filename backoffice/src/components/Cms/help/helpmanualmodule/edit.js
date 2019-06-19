/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Update Help manual module Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import $ from 'jquery';
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getHelpmanualmoduleById, updateHelpmanualmodule } from 'Actions/HelpManual';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
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
		index: 3
	},
	// Added By Megha Kariya (05-02-2019)
	{
		title: <IntlMessages id="sidebar.help" />,
		link: '',
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.helpmanualmodule" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.editHelpModule" />,
		link: '',
		index: 0
	}
];
//Validation for Help Module Form
const validateHelpModuleInput = require('../../../../validation/Help/helpmanualmodule');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 2 * 3 }}>
			{children}
		</Typography>
	);
}

class EditHelpModule extends Component {

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
			helpmoduledetail: {
				category_id: "",
				locale: {
					en: {
						module_name: "",
						description: ""
					}
				},
				sort_order: "",
				status: "1",
				date_created: "",
				date_modified: "",
				created_by: "",
				modified_by: ""
			},
			language: [
				{
					id: 1,
					code: "en",
					language_name: "English",
					locale: "en-US,en_US.UTF-8,en_US,en-gb,english",
					status: "1",
					sort_order: "1"
				}
			],
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
		this.onUpdateHelpModuleDetail = this.onUpdateHelpModuleDetail.bind(this);
		this.updateHelpModule = this.updateHelpModule.bind(this);
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

	// On Update Help Manual Module Details
	onUpdateHelpModuleDetail(key, value, lang = '') {
		if (typeof lang != 'undefined' && lang != '') {
			let statusCopy = Object.assign({}, this.state.helpmoduledetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				helpmoduledetail: {
					...this.state.helpmoduledetail,
					[key]: value
				}
			});
		}
	}

	//Update Help Module Detail
	updateHelpModule() {
		const { locale, sort_order, status } = this.state.helpmoduledetail;
		const { errors, isValid } = validateHelpModuleInput(this.state.helpmoduledetail);

		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		//let isValid=false;
		if (!isValid) {
			let data = {
				id: this.state.helpmoduledetail._id,
				category_id: this.state.helpmoduledetail.category_id,
				locale,
				sort_order,
				status
			}
			setTimeout(() => {
				this.props.updateHelpmanualmodule(data);
				this.setState({ loading: true });
			}, 2000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('8F5D0912-8BC1-0513-11A2-2479649D25D5');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				let ModuleId = this.props.helpmoduledata._id;
				if (ModuleId != '') {
					this.props.getLanguage();
					this.props.getHelpmanualmoduleById(ModuleId);
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

		if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					locale[lang.code] = {
						title: "",
						content: "",
					};
				})
			}
			this.state.helpmoduledetail.locale = locale;
			this.setState({
				helpmoduledetail: this.state.helpmoduledetail
			});
		}

		if (typeof nextProps.helpmoduledata != 'undefined' && typeof nextProps.helpmoduledata.locale != 'undefined' && nextProps.helpmoduledata != '') {
			const newlocale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {

					newlocale[lang.code] = {
						module_name: nextProps.helpmoduledata.locale[lang.code] && nextProps.helpmoduledata.locale[lang.code].module_name ? nextProps.helpmoduledata.locale[lang.code].module_name : '',
						description: nextProps.helpmoduledata.locale[lang.code] && nextProps.helpmoduledata.locale[lang.code].description ? nextProps.helpmoduledata.locale[lang.code].module_name : ''
					};
				})
			}

			this.state.helpmoduledetail.locale = newlocale;
			this.state.helpmoduledetail._id = nextProps.helpmoduledata._id;
			this.state.helpmoduledetail.category_id = nextProps.helpmoduledata.category_id;
			this.state.helpmoduledetail.sort_order = nextProps.helpmoduledata.sort_order;
			this.state.helpmoduledetail.status = nextProps.helpmoduledata.status + "";  //Change by Khushbu Badheka D:30/01/2019

			this.setState({
				helpmoduledetail: this.state.helpmoduledetail
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
				btn_disabled: false // Added By Megha Kariya (08/02/2019)
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

	// Added By Megha Kariya (05-02-2019)  
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
						return response = fieldList;
					}
				}
			}
		} else {
			return response;
		}
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('CF5B7CF7-22A6-3E14-99F5-84830D805255');
		const { err_alert, err_msg, activeIndex, language, errors, helpmoduledetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		const { drawerClose } = this.props;

		return (
			<div className="jbs-page-content">
				{/* Added By Megha Kariya (05-02-2019) : add close2Level */}
				<DashboardPageTitle title={<IntlMessages id="sidebar.editHelpModule" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
				{(loading || this.props.menuLoading) && <JbsSectionLoader />}

				{errors.message && <div className="alert_area">
					<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
				</div>}

				<Form>
					<AppBar position="static" color="default">
						<Tabs
							value={this.state.activeIndex}
							onChange={(e, value) => this.handleChange(e, value)}
							indicatorColor="primary"
							textColor="primary"
							fullWidth
							scrollable
							scrollButtons="auto"
						>
							{language && language.map((lang, key) => (
								<Tab key={key} value={lang.id} title={lang.language_name} label={lang.language_name} icon={<img src={require(`Assets/flag-icons/${lang.code}.png`)} className="mr-10" width="25" height="16" alt="lang-icon" />} />
							))}
						</Tabs>
					</AppBar>

					{language && language.map((lang, key) => {
						if (this.state.activeIndex == lang.id) {
							return (
								<TabContainer key={key}>
									{(menudetail["01193580-A4B9-2BF9-8B82-C85AE1D66F7B"] && menudetail["01193580-A4B9-2BF9-8B82-C85AE1D66F7B"].Visibility === "E925F86B") && //01193580-A4B9-2BF9-8B82-C85AE1D66F7B
										<FormGroup>
											<Label><IntlMessages id="help.label.module_name" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["01193580-A4B9-2BF9-8B82-C85AE1D66F7B"].AccessRight === "11E6E7B0") ? true : false}
												minLength={2}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="module_name"
												id="module_name"
												maxLength={100}
												value={helpmoduledetail && helpmoduledetail.locale && helpmoduledetail.locale[lang.code] && helpmoduledetail.locale[lang.code].module_name || ''}
												onChange={(e) => this.onUpdateHelpModuleDetail("module_name", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].module_name && <span className="text-danger"><IntlMessages id={errors[lang.code].module_name} /></span>}
										</FormGroup>}

									{(menudetail["A4DAD0B5-8F92-06DF-0EC9-9BD6CA834AF1"] && menudetail["A4DAD0B5-8F92-06DF-0EC9-9BD6CA834AF1"].Visibility === "E925F86B") && //A4DAD0B5-8F92-06DF-0EC9-9BD6CA834AF1
										<FormGroup>
											<Label><IntlMessages id="help.label.description" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["A4DAD0B5-8F92-06DF-0EC9-9BD6CA834AF1"].AccessRight === "11E6E7B0") ? true : false}
												minLength={2}
												debounceTimeout={300}
												className="form-control"
												type="textarea"
												name="description"
												id="description"
												maxLength={200}
												value={helpmoduledetail && helpmoduledetail.locale && helpmoduledetail.locale[lang.code] && helpmoduledetail.locale[lang.code].description || ''}
												onChange={(e) => this.onUpdateHelpModuleDetail("description", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].description && <span className="text-danger"><IntlMessages id={errors[lang.code].description} /></span>}
										</FormGroup>}

									{(menudetail["4BFE4C2E-26ED-7FE0-45DA-E6B4F6D74854"] && menudetail["4BFE4C2E-26ED-7FE0-45DA-E6B4F6D74854"].Visibility === "E925F86B") && //4BFE4C2E-26ED-7FE0-45DA-E6B4F6D74854
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.sort_order" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["4BFE4C2E-26ED-7FE0-45DA-E6B4F6D74854"].AccessRight === "11E6E7B0") ? true : false}
												minLength={2}
												className="form-control"
												type="number"
												name="sort_order"
												id="sort_order"
												min="0" max="10"
												value={helpmoduledetail.sort_order || ''}
												onChange={(e) => this.onUpdateHelpModuleDetail('sort_order', e.target.value)}
											/>
											{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
										</FormGroup>}

									{(menudetail["15CAEFEA-006D-2CEB-9062-2225B5036100"] && menudetail["15CAEFEA-006D-2CEB-9062-2225B5036100"].Visibility === "E925F86B") && //15CAEFEA-006D-2CEB-9062-2225B5036100
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.status" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["15CAEFEA-006D-2CEB-9062-2225B5036100"].AccessRight === "11E6E7B0") ? true : false}
												type="select" name="status" id="status" onChange={(e) => this.onUpdateHelpModuleDetail('status', e.target.value)} value={helpmoduledetail.status}>>
												<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
											</Input>
											{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
										</FormGroup>}

									{(menudetail["E9992BC1-9071-3878-3941-98C154C4998D"] && menudetail["E9992BC1-9071-3878-3941-98C154C4998D"].Visibility === "E925F86B") && //E9992BC1-9071-3878-3941-98C154C4998D
										<FormGroup>  { /* Added by Jayesh 22-01-2019  */}
											<Label><IntlMessages id="sidebar.date_created" /> : </Label>
											<Label>{new Date(this.props.helpmoduledata.date_created).toLocaleString()}</Label>
										</FormGroup>}

									{(menudetail["0AEC5A64-26C8-4F13-326A-5BBA63B47B34"] && menudetail["0AEC5A64-26C8-4F13-326A-5BBA63B47B34"].Visibility === "E925F86B") && //0AEC5A64-26C8-4F13-326A-5BBA63B47B34
										<FormGroup>
											<Label><IntlMessages id="sidebar.date_modified" /> : </Label>
											<Label>{new Date(this.props.helpmoduledata.date_modified).toLocaleString()}</Label>
										</FormGroup>}

									{(menudetail) &&
										<FormGroup>
											<Button
												className="text-white text-bold btn mr-10"
												variant="raised"
												color="primary"
												onClick={() => this.updateHelpModule()}
												disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
											>
												<IntlMessages id="button.update" />
											</Button>

											<Button
												className="text-white text-bold btn mr-10 btn bg-danger text-white"
												variant="raised"
												onClick={this.resetData}
												disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
											>
												<IntlMessages id="button.cancel" />
											</Button>
										</FormGroup>}
								</TabContainer>
							);
						}
					})}
				</Form>
			</div>
		);
	}
}
const mapStateToProps = ({ languages, helpmanualmodules, authTokenRdcer }) => {
	var response = {
		data: helpmanualmodules.data,
		loading: helpmanualmodules.loading,
		language: languages.language,
		helpmoduledetail: helpmanualmodules.helpmoduledetail,
		localebit: languages.localebit,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof helpmanualmodules.localebit != 'undefined' && helpmanualmodules.localebit != '') {
		response['localebit'] = helpmanualmodules.localebit;
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	getHelpmanualmoduleById, updateHelpmanualmodule,
	getLanguage, getMenuPermissionByID,
})(EditHelpModule));