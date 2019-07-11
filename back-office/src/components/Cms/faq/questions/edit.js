/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 21-09-2018
    UpdatedDate : 21-01-2019
    Description : Update Faq Category Form
*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getFaqQuestionById, updateFaqQuestion, getFaqcategories } from 'Actions/Faq';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { Editor } from "@tinymce/tinymce-react";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
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
		title: <IntlMessages id="sidebar.faq" />,
		link: '',
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.Faq-Questions" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.editQuestion" />,
		link: '',
		index: 0
	}
];
//Validation for Faq Question Form
const validateFaqQuestionInput = require('../../../../validation/Faq/faqquestion');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 2 * 3 }}>
			{children}
		</Typography>
	);
}

class EditFaqQuestions extends Component {

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
			categorylist: [],
			faqquestiondetail: {
				question_id: "",
				locale: {
					en: {
						question: "",
						answer: ""
					}
				},
				category_id: "",
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
		this.onUpdateFaqQuestionDetail = this.onUpdateFaqQuestionDetail.bind(this);
		this.updateFaqQuestion = this.updateFaqQuestion.bind(this);
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

	// On Update Faq Question Detail
	onUpdateFaqQuestionDetail(key, value, lang = '') {
		if (lang != '') {
			let statusCopy = Object.assign({}, this.state.faqquestiondetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else {

			this.setState({
				faqquestiondetail: {
					...this.state.faqquestiondetail,
					[key]: value
				}
			});
		}
	}

	// Update Faq Question
	updateFaqQuestion() {
		const { locale, sort_order, category_id, status } = this.state.faqquestiondetail;
		const { errors, isValid } = validateFaqQuestionInput(this.state.faqquestiondetail);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		if (!isValid) {
			let data = {
				id: this.state.faqquestiondetail._id,
				question_id: this.state.faqquestiondetail.question_id,
				locale,
				category_id,
				sort_order,
				status
			}
			setTimeout(() => {
				this.props.updateFaqQuestion(data);
				this.setState({ loading: true });
			}, 2000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('CC09682E-0907-1BA4-A687-08BAE3B34160');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				let QuestionId = this.props.faqquestiondata._id;
				if (QuestionId != '') {
					this.props.getLanguage();
					this.props.getFaqcategories();
					this.props.getFaqQuestionById(QuestionId);
				} else {
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

		if (nextProps.data.responseCode === 0) {
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

		if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {

					locale[lang.code] = {
						question: "",
						answer: ""
					};
				})
			}
			let newObj = Object.assign({}, this.state.faqquestiondetail);
			newObj['locale'] = locale;
			this.setState({ faqquestiondetail: newObj });
				}

		if (typeof nextProps.faqquestiondata != 'undefined' && typeof nextProps.faqquestiondata.locale != 'undefined' && nextProps.faqquestiondata != '') {
			const newlocale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					newlocale[lang.code] = {
						question: nextProps.faqquestiondata.locale[lang.code] && nextProps.faqquestiondata.locale[lang.code].question ? nextProps.faqquestiondata.locale[lang.code].question : '',
						answer: nextProps.faqquestiondata.locale[lang.code] && nextProps.faqquestiondata.locale[lang.code].answer ? nextProps.faqquestiondata.locale[lang.code].answer : '',
					};
				})
			}

			let newObject = Object.assign({}, this.state.faqquestiondetail);
			newObject['locale'] = newlocale;
			newObject['_id'] = nextProps.faqquestiondata._id;
			newObject['question_id'] = nextProps.faqquestiondata.question_id;
			newObject['sort_order'] = nextProps.faqquestiondata.sort_order;
			newObject['status'] = nextProps.faqquestiondata.status + '';
			newObject['category_id'] = nextProps.faqquestiondata.category_id != null && typeof nextProps.faqquestiondata.category_id._id != 'undefined' ? nextProps.faqquestiondata.category_id._id : this.state.faqquestiondetail.category_id;
			this.setState({ faqquestiondetail: newObject });
			

		}

		this.setState({
			loading: nextProps.loading,
			language: nextProps.language,
			categorylist: nextProps.faqs_categories_list,
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
						response = fieldList;
					}
				}
			}
		}
		return response;
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('F0A28FD9-1C35-7951-7364-5720DCC1661E');
		const { err_alert, language, errors, faqquestiondetail, loading, categorylist, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

		return (
			<div className="jbs-page-content">
				{/* Added By Megha Kariya (05-02-2019) : add close2Level */}
				<DashboardPageTitle title={<IntlMessages id="faq.questionform.title.edit-faq-question" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
						if (this.state.activeIndex === lang.id) {
							return (
								<TabContainer key={key}>
									{(menudetail["C2B41A17-5C41-A4A0-0F8E-1CA509D86425"] && menudetail["C2B41A17-5C41-A4A0-0F8E-1CA509D86425"].Visibility === "E925F86B") && //C2B41A17-5C41-A4A0-0F8E-1CA509D86425
										<FormGroup>
											<Label><IntlMessages id="faq.questionform.label.question" />{lang.name}<span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["C2B41A17-5C41-A4A0-0F8E-1CA509D86425"].AccessRight === "11E6E7B0") ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="question"
												id="question"
												maxLength={150}
												value={faqquestiondetail && faqquestiondetail.locale && faqquestiondetail.locale[lang.code] && faqquestiondetail.locale[lang.code].question}
												onChange={(e) => this.onUpdateFaqQuestionDetail("question", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].question && <span className="text-danger"><IntlMessages id={errors[lang.code].question} /></span>}
										</FormGroup>}

									{(menudetail["3FA8F018-9A15-360C-7307-C513D9A16588"] && menudetail["3FA8F018-9A15-360C-7307-C513D9A16588"].Visibility === "E925F86B") && //3FA8F018-9A15-360C-7307-C513D9A16588
										<FormGroup>
											<Label><IntlMessages id="faq.questionform.label.answer" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<Editor
												disabled={(menudetail["3FA8F018-9A15-360C-7307-C513D9A16588"].AccessRight === "11E6E7B0") ? true : false}
												init={{
													height: 500,
													plugins: 'link image code lists advlist table preview',
													toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
													statusbar: false
												}}
												value={faqquestiondetail && faqquestiondetail.locale && faqquestiondetail.locale[lang.code] && faqquestiondetail.locale[lang.code].answer}
												onChange={(e) => this.onUpdateFaqQuestionDetail("answer", e.target.getContent(), lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].answer && <span className="text-danger"><IntlMessages id={errors[lang.code].answer} /></span>}
										</FormGroup>}
								</TabContainer>
							);
						}
					})}

					{(menudetail["66AF6C78-31B6-55D9-0C4C-12EA3B560C62"] && menudetail["66AF6C78-31B6-55D9-0C4C-12EA3B560C62"].Visibility === "E925F86B") && //66AF6C78-31B6-55D9-0C4C-12EA3B560C62
						<FormGroup>
							<Label><IntlMessages id="faq.questionform.label.category" /></Label>
							<Input
								disabled={(menudetail["66AF6C78-31B6-55D9-0C4C-12EA3B560C62"].AccessRight === "11E6E7B0") ? true : false}
								type="select" name="category_id" id="category_id"
								value={faqquestiondetail.category_id}
								onChange={(e) => this.onUpdateFaqQuestionDetail('category_id', e.target.value)}
							>
								<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
								{categorylist.length ? categorylist.map((item, key) => <option key={key} value={item._id}>{item.locale.en.category_name}</option>) : ''}
							</Input>
							{errors.category && <span className="text-danger"><IntlMessages id={errors.category} /></span>}
						</FormGroup>}

					{(menudetail["3DE0D07B-3BA7-0795-344D-F6196FF20FD4"] && menudetail["3DE0D07B-3BA7-0795-344D-F6196FF20FD4"].Visibility === "E925F86B") && //3DE0D07B-3BA7-0795-344D-F6196FF20FD4
						<FormGroup>
							<Label><IntlMessages id="faq.questionform.label.sort_order" /><span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["3DE0D07B-3BA7-0795-344D-F6196FF20FD4"].AccessRight === "11E6E7B0") ? true : false}
								minLength={0}
								debounceTimeout={300}
								className="form-control"
								type="number"
								name="sort_order"
								id="sort_order"
								min="0" max="10"
								value={faqquestiondetail.sort_order}
								onChange={(e) => this.onUpdateFaqQuestionDetail('sort_order', e.target.value)}
							/>
							{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
						</FormGroup>}

					{(menudetail["A7D07F09-7035-80E4-2A59-DCC8957D26F2"] && menudetail["A7D07F09-7035-80E4-2A59-DCC8957D26F2"].Visibility === "E925F86B") && //A7D07F09-7035-80E4-2A59-DCC8957D26F2
						<FormGroup>
							<Label><IntlMessages id="faq.questionform.label.status" /><span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["A7D07F09-7035-80E4-2A59-DCC8957D26F2"].AccessRight === "11E6E7B0") ? true : false}
								type="select" name="status" id="status" onChange={(e) => this.onUpdateFaqQuestionDetail('status', e.target.value)} value={faqquestiondetail.status}>>
							<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
								<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
							</Input>
							{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
						</FormGroup>}

					{(menudetail["B7C075E4-7904-1C7F-A3C3-487BCA8438F9"] && menudetail["B7C075E4-7904-1C7F-A3C3-487BCA8438F9"].Visibility === "E925F86B") && //B7C075E4-7904-1C7F-A3C3-487BCA8438F9
						<FormGroup>  { /* Added by Jayesh 22-01-2019  */}
							<Label><IntlMessages id="sidebar.date_created" /> : </Label>
							<Label>{new Date(this.props.faqquestiondata.date_created).toLocaleString()}</Label>
						</FormGroup>}

					{(menudetail["F14E438F-057F-A7B7-A0AE-308656F61738"] && menudetail["F14E438F-057F-A7B7-A0AE-308656F61738"].Visibility === "E925F86B") && //F14E438F-057F-A7B7-A0AE-308656F61738
						<FormGroup>
							<Label><IntlMessages id="sidebar.date_modified" /> : </Label>
							<Label>{new Date(this.props.faqquestiondata.date_modified).toLocaleString()}</Label>
						</FormGroup>}

					{Object.keys(menudetail).length > 0 &&
						<FormGroup>
							<Button
								className="text-white text-bold btn mr-10"
								variant="raised"
								color="primary"
								onClick={() => this.updateFaqQuestion()}
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
				</Form>
			</div>
		);
	}
}

const mapStateToProps = ({ languages, faqcategories, faqquestions, authTokenRdcer }) => {
	var response = {
		data: faqquestions.data,
		loading: faqquestions.loading,
		language: languages.language,
		faqquestiondetail: faqquestions.questiondetail,
		localebit: languages.localebit,
		faqs_categories_list: faqcategories.faqs_categories_list,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof faqquestions.localebit != 'undefined' && faqquestions.localebit != '') {
		response['localebit'] = faqquestions.localebit;
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	getFaqQuestionById, updateFaqQuestion, getFaqcategories, getLanguage, getMenuPermissionByID
})(EditFaqQuestions));