/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 01-10-2018
    UpdatedDate : 26-01-2019
    Description : Add Faq Question Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import { withRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import CRUD Operation For Faq Question Actions...
import { addFaqQuestion, getFaqcategories } from 'Actions/Faq';
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
	// Added By Megha Kariya (05-02-2019)
	{
		title: <IntlMessages id="sidebar.cms" />,
		link: '',
		index: 3
	},
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
		title: <IntlMessages id="sidebar.addQuestion" />,
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

class AddFaqQuestions extends Component {

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
			addNewFaqQuestionDetail: {
				locale:
				{
					en:
					{
						question: "",
						answer: "",
					}
				},
				category_id: '',
				status: '1',
				sort_order: '',
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
			//Added by Meghaben 29-01-2019
			addNewFaqQuestionDetail: {
				locale:
				{
					en:
					{
						question: "",
						answer: "",
					}
				},
				category_id: '',
				status: '1',
				sort_order: '',
				date_created: "",
				date_modified: "",
				created_by: "",
				modified_by: ""
			},
		};
		this.onChangeAddNewFaqQuestionDetail = this.onChangeAddNewFaqQuestionDetail.bind(this);
		this.addFaqQuestion = this.addFaqQuestion.bind(this);
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

	// On Change Add New Faq Question Detail
	onChangeAddNewFaqQuestionDetail(key, value, lang = '') {
		if (lang !== '') {
			let statusCopy = Object.assign({}, this.state.addNewFaqQuestionDetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		} else {
			this.setState({
				addNewFaqQuestionDetail: {
					...this.state.addNewFaqQuestionDetail,
					[key]: value
				}
			});
		}
	}

	// Add Faq Question
	addFaqQuestion() {
		const { locale, sort_order, category_id, status } = this.state.addNewFaqQuestionDetail;
		const { errors, isValid } = validateFaqQuestionInput(this.state.addNewFaqQuestionDetail);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });

		if (!isValid) {
			let data = {
				locale,
				category_id,
				sort_order,
				status
			}

			setTimeout(() => {
				this.props.addFaqQuestion(data);
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
				this.props.getFaqcategories();
				this.props.getLanguage();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (nextProps.data !== undefined && nextProps.data.responseCode === 0) {
			this.setState({ err_msg: '', err_alert: false });
			this.resetData();
			this.props.reload();
		}

		if (nextProps.data != undefined && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
			if (nextProps.data.errors.message !== undefined && nextProps.data.errors.message != '') {
				this.setState({ err_alert: true });
			}
			this.setState({
				errors: nextProps.data.errors,
				btn_disabled: false // Added By Megha Kariya (08/02/2019)
			});
		}

		if (nextProps.localebit !== undefined && nextProps.localebit != '' && nextProps.localebit == 1) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					locale[lang.code] = {
						question: "",
						answer: ""
					};
				})
			}

			let newObj = Object.assign({}, this.state.addNewFaqQuestionDetail);
			newObj['locale'] = locale;
			this.setState({ addNewFaqQuestionDetail: newObj });
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
						response = fieldList;
					}
				}
			}
		}
		return response;
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('5AD8B786-6DFB-116C-086A-C1367985151E');
		const { err_alert, language, errors, addNewFaqQuestionDetail, loading, categorylist, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		return (
			<div className="jbs-page-content">
				{/* Added By Megha Kariya (05-02-2019) : add close2Level */}
				<DashboardPageTitle title={<IntlMessages id="faq.questionform.title.add-faq-question" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
									{(menudetail["63AF115F-1139-10D4-1621-ECC23EF326CF"] && menudetail["63AF115F-1139-10D4-1621-ECC23EF326CF"].Visibility === "E925F86B") && //63AF115F-1139-10D4-1621-ECC23EF326CF
										<FormGroup>
											<Label><IntlMessages id="faq.questionform.label.question" />{lang.name}<span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["63AF115F-1139-10D4-1621-ECC23EF326CF"].AccessRight === "11E6E7B0") ? true : false}
												minLength={2}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="question"
												id="question"
												maxLength={150}
												value={addNewFaqQuestionDetail.locale[lang.code].question}
												onChange={(e) => this.onChangeAddNewFaqQuestionDetail("question", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].question && <span className="text-danger"><IntlMessages id={errors[lang.code].question} /></span>}
										</FormGroup>}

									{(menudetail["69A35D53-5293-5B11-9E35-E075EABF880A"] && menudetail["69A35D53-5293-5B11-9E35-E075EABF880A"].Visibility === "E925F86B") && //69A35D53-5293-5B11-9E35-E075EABF880A
										<FormGroup>
											<Label><IntlMessages id="faq.questionform.label.answer" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<Editor
												disabled={(menudetail["69A35D53-5293-5B11-9E35-E075EABF880A"].AccessRight === "11E6E7B0") ? true : false}
												init={{
													height: 500,
													plugins: 'link image code lists advlist table preview',
													toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
													statusbar: false
												}}
												value={addNewFaqQuestionDetail.locale[lang.code].answer}
												onChange={(e) => this.onChangeAddNewFaqQuestionDetail("answer", e.target.getContent(), lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].answer && <span className="text-danger"><IntlMessages id={errors[lang.code].answer} /></span>}
										</FormGroup>}
								</TabContainer>
							);
						}
					})}

					{(menudetail["491F8613-30FD-448B-1F90-ED8C19BDA479"] && menudetail["491F8613-30FD-448B-1F90-ED8C19BDA479"].Visibility === "E925F86B") && //491F8613-30FD-448B-1F90-ED8C19BDA479
						<FormGroup>
							<Label><IntlMessages id="faq.questionform.label.category" /><span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["491F8613-30FD-448B-1F90-ED8C19BDA479"].AccessRight === "11E6E7B0") ? true : false}
								type="select" name="category_id" id="category_id" value={addNewFaqQuestionDetail.category_id} onChange={(e) => this.onChangeAddNewFaqQuestionDetail('category_id', e.target.value)}>
								<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
								{categorylist.length ? categorylist.map((item, key) => <option key={key} value={item._id}>{item.locale.en.category_name}</option>) : ''}
							</Input>
							{errors.category && <span className="text-danger"><IntlMessages id={errors.category} /></span>}
						</FormGroup>}

					{(menudetail["E3A80F63-152F-6122-A66F-F0C9689123FF"] && menudetail["E3A80F63-152F-6122-A66F-F0C9689123FF"].Visibility === "E925F86B") && //E3A80F63-152F-6122-A66F-F0C9689123FF
						<FormGroup>
							<Label><IntlMessages id="faq.questionform.label.sort_order" /><span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["E3A80F63-152F-6122-A66F-F0C9689123FF"].AccessRight === "11E6E7B0") ? true : false}
								minLength={2}
								debounceTimeout={300}
								className="form-control"
								type="number"
								name="sort_order"
								id="sort_order"
								min="0" max="10"
								value={addNewFaqQuestionDetail.sort_order}
								onChange={(e) => this.onChangeAddNewFaqQuestionDetail('sort_order', e.target.value)}
							/>
							{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
						</FormGroup>}

					{(menudetail["5A002FD3-A1E6-0289-5D4C-09A1C0AB0856"] && menudetail["5A002FD3-A1E6-0289-5D4C-09A1C0AB0856"].Visibility === "E925F86B") && //5A002FD3-A1E6-0289-5D4C-09A1C0AB0856
						<FormGroup>
							<Label><IntlMessages id="faq.questionform.label.status" /><span className="text-danger">*</span></Label>
							<Input
								disabled={(menudetail["5A002FD3-A1E6-0289-5D4C-09A1C0AB0856"].AccessRight === "11E6E7B0") ? true : false}
								type="select" name="status" id="status" onChange={(e) => this.onChangeAddNewFaqQuestionDetail('status', e.target.value)} value={addNewFaqQuestionDetail.status}>>
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
								onClick={() => this.addFaqQuestion()}
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
		localebit: languages.localebit,
		faqs_categories_list: faqcategories.faqs_categories_list,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (faqquestions.localebit !== undefined && faqquestions.localebit != '') {
		response['localebit'] = faqquestions.localebit;
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	addFaqQuestion, getFaqcategories, getLanguage, getMenuPermissionByID
})(AddFaqQuestions));