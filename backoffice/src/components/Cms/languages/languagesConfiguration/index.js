/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 11-12-2018
    UpdatedDate : 12-12-2018
    Description : CMS LanguagePack Form
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert, Row } from "reactstrap";
import MatButton from '@material-ui/core/Button';
import $ from 'jquery';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import CRUD Operation For SiteSetting Actions...
import { getAllLanguage, getLanguageConfig, updateLanguageConfig } from 'Actions/Language';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
import { DashboardPageTitle } from '../../DashboardPageTitle';
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
	// Added By Megha Kariya (05-02-2019)
	{
		title: <IntlMessages id="sidebar.languages" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.languageconfiguration" />,
		link: '',
		index: 0
	},
];
//Validation for Language Config Form
const validateUpdateLanguageConfigInput = require('../../../../validation/LanguageConfiguration/languageconfiguration');

class LanguagesConfig extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			errors: {},
			err_msg: "",
			err_alert: true,
			showSuccessStatus: false,
			btn_disabled: false,
			dataLoaded: 0,
			languagesconfig: [],
			selectedlanguages: [],
			selectlanguage: '',
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
			menudetail: [],
			Pflag: true,
		};
		this.initState = {
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			showSuccessStatus: false,
			btn_disabled: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.resetData = this.resetData.bind(this);
	}

	resetData() {
		this.setState(this.initState);
		this.props.drawerClose();
	}

	// Dismiss Alert Message
	onDismiss() {
		let err = delete this.state.errors['message'];
		this.setState({ err_alert: false, errors: err });
	}

	//when add new language its set languageId, status, idDefault in languageconfig, als ostore languageId in selectedlanguages array
	addNewLanguage() {
		if (this.state.selectlanguage != '') {
			if (this.state.languagesconfig.length == 0) {
				let newObj = {
					languageId: this.state.selectlanguage,
					status: 1,
					isDefault: 1
				};
				this.setState({ languagesconfig: this.state.languagesconfig.concat(newObj), selectedlanguages: this.state.selectedlanguages.concat(this.state.selectlanguage), selectlanguage: '' });
			}
			else {
				let newObj = {
					languageId: this.state.selectlanguage,
					status: 1,
					isDefault: 0
				};
				this.setState({ languagesconfig: this.state.languagesconfig.concat(newObj), selectedlanguages: this.state.selectedlanguages.concat(this.state.selectlanguage), selectlanguage: '' });
			}

		}
	}

	//When change selected language isDefault and Status change then this function will be used
	onChangeLanguageConfig(e, index, isdefault = 0) {
		if (isdefault == 1) {
			this.state.languagesconfig && this.state.languagesconfig.map((lang, key) => {
				if (key == index) {
					let tempdata = Object.assign([], this.state.languagesconfig);
					tempdata[key][e.target.name] = 1;
					this.setState({ languagesconfig: tempdata });
				}
				else {
					let tempdata = Object.assign([], this.state.languagesconfig);
					tempdata[key][e.target.name] = 0;
					this.setState({ languagesconfig: tempdata });
				}
			})
		}
		else {
			let tempdata = Object.assign([], this.state.languagesconfig);
			tempdata[index][e.target.name] = e.target.value;
			this.setState({ languagesconfig: tempdata });
		}
	}

	//handle Submit
	handleSubmit(e) {
		e.preventDefault();
		//let data1=[{languageId:"5bc46cd5c3ab4a9125fdd5a4",status:'',isDefault:''},{languageId:"5bc46d11c3ab4a9125fdd5c6",status:1,isDefault:1},{languageId:"5bc46d1ec3ab4a9125fdd5cf",status:1,isDefault:0},{languageId:"5bfe28bb7ee63f4634368005",status:1,isDefault:0}];
		const { errors, isValid } = validateUpdateLanguageConfigInput(this.state.languagesconfig);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		if (!isValid) {
			let data = {
				id: this.props.languageconfigid,
				languagedata: this.state.languagesconfig,
			}
			setTimeout(() => {
				let res = this.props.updateLanguageConfig(data);
				this.setState({ dataLoaded: 0 });
			}, 2000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	handleCancel = () => {
		this.props.drawerClose();
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('2A901762-3249-216B-2A3B-0400BA3106FA');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getAllLanguage();
				this.props.getLanguageConfig();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (typeof nextProps.languages != 'undefined' && nextProps.languages != '' && this.state.dataLoaded == 0) {
			const newlocale = [];
			{
				nextProps.languages && nextProps.languages.map((lang, key) => {
					newlocale.push(lang.languageId);
				})
			}

			this.setState({
				languagesconfig: nextProps.languages,
				selectedlanguages: newlocale,
				dataLoaded: 1,
				btn_disabled: false  // Added By Megha Kariya (08/02/2019)
			});
		}

		this.setState({
			loading: nextProps.loading,
			language: nextProps.language
		});

		if (nextProps.data.responseCode === 0) {
			this.setState({ err_msg: '', err_alert: false, showSuccessStatus: true });
			setTimeout(function () {
				this.setState({ showSuccessStatus: false, dataLoaded: 0, btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
				this.props.getLanguageConfig();
			}.bind(this), 2000);
			//this.props.drawerClose();
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
		var response = false;
		var index;
		const { menudetail } = this.state;
		if (menudetail.length) {
			for (index in menudetail) {
				if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
					response = menudetail[index];
			}
		}
		return response;
	}

	render() {
		const { err_alert, language, errors, loading, languagesconfig, selectedlanguages, selectlanguage, showSuccessStatus, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		const { drawerClose } = this.props;

		return (
			<Fragment>
				<div className="jbs-page-content">
					<DashboardPageTitle title={<IntlMessages id="sidebar.languages" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
					{(loading || this.props.menuLoading) && <JbsSectionLoader />}

					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}
					<Alert color="success" isOpen={showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
						<IntlMessages id="common.form.edit.success" />
					</Alert>

					<Form encType="multipart/form-data">
						<div className="col-xs-12 col-sm-12 col-md-12 justify-content-between d-inline-block">
							<div className="col-sm-9 col-md-9 d-inline-block">
								<FormGroup row>
									<Label className="col-3"><IntlMessages id="sidebar.language" /></Label>
									<Input className="col-6" type="select" name="language" id="language"
										value={selectlanguage}
										onChange={e => this.setState({ selectlanguage: e.target.value })}
									>
										<IntlMessages id="sidebar.selLanguages">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
										{language && language.map((lang, key) => {
											if (selectedlanguages.indexOf(lang._id) == -1) {
												return (
													<option value={lang._id} key={key}>{lang.language_name}</option>
												)
											}
										})}
									</Input>
									<div className="col-sm-3 col-3 col-md-3 d-inline-block">
										<MatButton
											variant="raised"
											className="btn-primary text-white"
											onClick={e => this.addNewLanguage()}
										>
											<IntlMessages id="button.add" />
										</MatButton>
									</div>
								</FormGroup>
							</div>
						</div>

						<div className="activity-board-wrapper">
							<div className="comment-box mb-4 p-20">
								<div>
									<div className="row">
										<div className="col-sm-3 col-3 col-md-3 d-inline-block">
											<Label className="">
												<IntlMessages id="sidebar.language" />
											</Label>
										</div>
										<div className="col-sm-3 col-3 col-md-3 d-inline-block">
											<Label className="">
												<IntlMessages id="faq.categoryform.label.status" />
											</Label>
										</div>
										<div className="col-sm-3 col-3 col-md-3 d-inline-block">
											<Label className="">
												<IntlMessages id="language.isdefault" />
											</Label>
										</div>
										<div className="col-sm-3 col-3 col-md-3 d-inline-block">
											<Label className="">
												<IntlMessages id="widgets.action" />
											</Label>
										</div>
									</div>
								</div>

								{languagesconfig && languagesconfig.map((lg, index) => {
									return (
										language && language.map((lang, key) => {
											if (lang._id == lg.languageId) {
												return (
													<div key={key}>
														<div className="row" key={index}>
															<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
																<span><img src={require(`Assets/flag-icons/${lang.code}.png`)} className="mr-10" width="25" height="16" alt="lang-icon" />{lang.language_name}</span>
															</FormGroup>

															<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
																<Input type="select" name="status" id="status"
																	value={this.state.languagesconfig[index].status}
																	onChange={e => this.onChangeLanguageConfig(e, index)}
																>
																	<option value="1">Active</option>
																	<option value="0">Inactive</option>
																</Input>
																{this.state.errors && this.state.errors[index] &&
																	this.state.errors[index].status && (<span className="text-danger">
																		{" "}
																		<IntlMessages id={this.state.errors[index].status} />
																	</span>
																	)}

															</FormGroup>
															<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
																<Input
																	className="ml-30"
																	type="radio"
																	name="isDefault"
																	value={this.state.languagesconfig[index].isDefault}
																	checked={this.state.languagesconfig[index].isDefault == 1}
																	onChange={e => this.onChangeLanguageConfig(e, index, 1)}
																/>
																{this.state.errors && this.state.errors[index] &&
																	this.state.errors[index].isDefault && (
																		<span className="text-danger"><br />
																			{" "}
																			<IntlMessages id={this.state.errors[index].isDefault} />
																		</span>
																	)}
															</FormGroup>
															<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
																{this.state.languagesconfig[index].isDefault != 1 &&
																	<a
																		className="font-2x"
																		href="javascript:void(0)"
																		onClick={e =>
																			this.setState({
																				languagesconfig: this.state.languagesconfig.filter((_, i) => i !== index), selectedlanguages: this.state.selectedlanguages.filter((_, i) => i !== index)
																			})
																		}
																	>
																		<i className="zmdi zmdi-delete"></i>
																	</a>
																}
															</FormGroup>
														</div>
													</div>
												);
											}
										})
									)
								})}
								<Row>
									<div className="col-xs-12 col-sm-12 col-md-12 justify-content-start d-inline-block ml-15">
										<MatButton
											variant="raised"
											className="btn-primary text-white text-bold btn mr-10 pull-left"
											onClick={e => this.handleSubmit(e)}
											disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
										>
											<IntlMessages id="button.update" />
										</MatButton>
										<MatButton
											variant="raised"
											className="btn-danger text-white text-bold btn mr-10 pull-left"
											onClick={e => this.handleCancel()}
											disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
										>
											<IntlMessages id="button.cancel" />
										</MatButton>
									</div>
								</Row>
							</div>
						</div>
					</Form>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ languages, authTokenRdcer }) => {
	var response = {
		data: languages.data,
		languages: languages.languageconfigdata.languages,
		languageconfigid: languages.languageconfigdata._id,
		language: languages.language_list.data,
		localebit: languages.localebit,
		loading: languages.loading,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	return response;
}

export default connect(mapStateToProps, {
	getAllLanguage, getLanguageConfig, updateLanguageConfig, getMenuPermissionByID
})(LanguagesConfig);