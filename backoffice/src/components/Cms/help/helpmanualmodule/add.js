/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Add Help Module Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import $ from 'jquery';
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
//Import CRUD Operation For Help Module Actions...
import { addHelpmanualmodule } from 'Actions/HelpManual';
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
		title: <IntlMessages id="help.button.add-help-module" />,
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

class AddHelpModule extends Component {

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
			addNewHelpModuleDetail: {
				module_id: "",
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
			btn_disabled: false,
			addNewHelpModuleDetail: {
				module_id: "",
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
			} // Added by Khushbu Badheka D:30/01/2019
		};
		this.onChangeaddNewHelpModuleDetails = this.onChangeaddNewHelpModuleDetails.bind(this);
		this.addHelpmanualmodule = this.addHelpmanualmodule.bind(this);
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

	// On Change Add New Help Module Details
	onChangeaddNewHelpModuleDetails(key, value, lang = '') {
		if (typeof lang != 'undefined' && lang != '') {
			let statusCopy = Object.assign({}, this.state.addNewHelpModuleDetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				addNewHelpModuleDetail: {
					...this.state.addNewHelpModuleDetail,
					[key]: value
				}
			});
		}
	}

	//Add Help Moduel Detail
	addHelpmanualmodule() {
		const { locale, sort_order, status } = this.state.addNewHelpModuleDetail;
		const { errors, isValid } = validateHelpModuleInput(this.state.addNewHelpModuleDetail);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		//let isValid=false;
		if (!isValid) {
			let data = {
				locale,
				sort_order,
				status
			}
			setTimeout(() => {
				this.props.addHelpmanualmodule(data);
				this.setState({ loading: true });
			}, 1000);
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
				this.props.getLanguage();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 0) {
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

		if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1 && (nextProps.data.responseCode != 9 && nextProps.data.responseCode != 1)) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					locale[lang.code] = {
						module_name: "",
						description: ""
					};
				})
			}

			this.state.addNewHelpModuleDetail.locale = locale;
			this.setState({
				addNewHelpModuleDetail: this.state.addNewHelpModuleDetail
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
		this.setState({
			open: false,
		});
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
		var menudetail = this.checkAndGetMenuAccessDetail('75B69023-52B5-A705-53D0-5D181672612E');
		const { err_alert, activeIndex, language, errors, addNewHelpModuleDetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		const { drawerClose } = this.props;

		return (
			<div className="jbs-page-content">
				{/* Added By Megha Kariya (05-02-2019) : add close2Level */}
				<DashboardPageTitle title={<IntlMessages id="help.button.add-help-module" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
				{(loading || this.props.menuLoading) && <JbsSectionLoader />}

				{errors.message && <div className="alert_area">
					<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
				</div>}

				<Form className="tradefrm">
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
									{(menudetail["CA56A3F1-5589-64EB-7E8D-6B09D3253304"] && menudetail["CA56A3F1-5589-64EB-7E8D-6B09D3253304"].Visibility === "E925F86B") && //CA56A3F1-5589-64EB-7E8D-6B09D3253304
										<FormGroup className="mt-20">
											<Label><IntlMessages id="help.label.module_name" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<DebounceInput
											 readOnly={(menudetail["CA56A3F1-5589-64EB-7E8D-6B09D3253304"].AccessRight === "11E6E7B0") ? true : false}
											minLength={2}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="module_name"
												id="module_name"
												maxLength={100}
												value={addNewHelpModuleDetail.locale[lang.code].module_name}
												onChange={(e) => this.onChangeaddNewHelpModuleDetails("module_name", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].module_name && <span className="text-danger"><IntlMessages id={errors[lang.code].module_name} /></span>}
										</FormGroup>}

									{(menudetail["111A0A8F-89AB-24E4-0D47-A430D46771A5"] && menudetail["111A0A8F-89AB-24E4-0D47-A430D46771A5"].Visibility === "E925F86B") && //111A0A8F-89AB-24E4-0D47-A430D46771A5
										<FormGroup>
											<Label><IntlMessages id="help.label.description" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<DebounceInput
											 readOnly={(menudetail["111A0A8F-89AB-24E4-0D47-A430D46771A5"].AccessRight === "11E6E7B0") ? true : false}
											minLength={2}
												debounceTimeout={300}
												className="form-control"
												type="textarea"
												name="description"
												id="description"
												maxLength={200}
												value={addNewHelpModuleDetail.locale[lang.code].description}
												onChange={(e) => this.onChangeaddNewHelpModuleDetails("description", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].description && <span className="text-danger"><IntlMessages id={errors[lang.code].description} /></span>}
										</FormGroup>}

									{(menudetail["30C92B15-916E-3CD3-354F-18F8E2997D1A"] && menudetail["30C92B15-916E-3CD3-354F-18F8E2997D1A"].Visibility === "E925F86B") && //30C92B15-916E-3CD3-354F-18F8E2997D1A
										<FormGroup className="mt-20">
											<Label><IntlMessages id="faq.categoryform.label.sort_order" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["30C92B15-916E-3CD3-354F-18F8E2997D1A"].AccessRight === "11E6E7B0") ? true : false}
												minLength={2}
												className="form-control"
												type="number"
												name="sort_order"
												id="sort_order"
												min="0" max="10"
												value={addNewHelpModuleDetail.sort_order}
												onChange={(e) => this.onChangeaddNewHelpModuleDetails('sort_order', e.target.value)}
											/>
											{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
										</FormGroup>}

									{(menudetail["C0885356-0208-9E75-6DA8-8042C2DD97B8"] && menudetail["C0885356-0208-9E75-6DA8-8042C2DD97B8"].Visibility === "E925F86B") && //C0885356-0208-9E75-6DA8-8042C2DD97B8
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.status" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["C0885356-0208-9E75-6DA8-8042C2DD97B8"].AccessRight === "11E6E7B0") ? true : false}
												type="select" name="status" id="status" onChange={(e) => this.onChangeaddNewHelpModuleDetails('status', e.target.value)} value={addNewHelpModuleDetail.status}>>
												<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
											</Input>
											{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
										</FormGroup>}

									{menudetail &&
										<FormGroup>
											<Button
												className="text-white text-bold btn mr-10"
												variant="raised"
												color="primary"
												onClick={() => this.addHelpmanualmodule()}
												disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
											>
												<IntlMessages id="button.add" />
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
		localebit: languages.localebit,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof helpmanualmodules.localebit != 'undefined' && helpmanualmodules.localebit != '') {
		response['localebit'] = helpmanualmodules.localebit;
	}
	return response;
}

export default connect(mapStateToProps, {
	addHelpmanualmodule, getLanguage, getMenuPermissionByID
})(AddHelpModule);