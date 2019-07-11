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
import { getFaqCategoryById, updateFaqCategory } from 'Actions/Faq';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
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
		title: <IntlMessages id="sidebar.Faq-Categories" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.editCategory" />,
		link: '',
		index: 0
	}
];
//Validation for Faq Category Form
const validateFaqCategoryInput = require('../../../../validation/Faq/faqcategory');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 2 * 3 }}>
			{children}
		</Typography>
	);
}

class EditFaqCategories extends Component {

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
			faqcategorydetail: {
				category_id: "",
				locale: {
					en: {
						category_name: "",
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
		this.onUpdateFaqCategoryDetail = this.onUpdateFaqCategoryDetail.bind(this);
		this.updateFaqCategory = this.updateFaqCategory.bind(this);
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

	// On Update Faq Category Details
	onUpdateFaqCategoryDetail(key, value, lang = '') {
		if (lang != '') {
			let statusCopy = Object.assign({}, this.state.faqcategorydetail);
			statusCopy.locale[lang].category_name = value;
			this.setState(statusCopy);
		}
		else {

			this.setState({
				faqcategorydetail: {
					...this.state.faqcategorydetail,
					[key]: value
				}
			});
		}
	}

	//Update Faq Category Detail
	updateFaqCategory() {
		const { locale, sort_order, status } = this.state.faqcategorydetail;
		const { errors, isValid } = validateFaqCategoryInput(this.state.faqcategorydetail);

		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		if (!isValid) {
			let data = {
				id: this.state.faqcategorydetail._id,
				category_id: this.state.faqcategorydetail.category_id,
				locale,
				sort_order,
				status
			}
			setTimeout(() => {
				this.props.updateFaqCategory(data);
				this.setState({ loading: true });
			}, 2000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('7DE451D3-46A7-95EF-374B-F2C2AF9E4C58');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				let FaqCategoryId = this.props.faqcategorydata._id;
				if (FaqCategoryId != '') {
					this.props.getLanguage();
					this.props.getFaqCategoryById(FaqCategoryId);
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

			var newObj = Object.assign({}, this.state.faqcategorydetail);
			newObj['locale'] = locale;
		   this.setState({faqcategorydetail:newObj})
	  				}

		if (typeof nextProps.faqcategorydata != 'undefined' && typeof nextProps.faqcategorydata.locale != 'undefined' && nextProps.faqcategorydata != '') {
			const newlocale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {

					newlocale[lang.code] = {
						category_name: nextProps.faqcategorydata.locale[lang.code] && nextProps.faqcategorydata.locale[lang.code].category_name ? nextProps.faqcategorydata.locale[lang.code].category_name : '',
					};
				})
			}

			
			
			
			
			var newObject = Object.assign({}, this.state.faqcategorydetail);
			newObj['locale'] = newlocale;
			newObj['_id'] = nextProps.faqcategorydata._id;
			newObj['category_id'] = nextProps.faqcategorydata.category_id;
			newObj['sort_order'] = nextProps.faqcategorydata.sort_order;
			newObj['status'] = nextProps.faqcategorydata.status + "";//Change by Khushbu Badheka D:29/01/2019
            this.setState({ faqcategorydetail: newObject })
			
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
						response = fieldList;
					}
				}
			}
		}
		return response;
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('B1D65BF6-8CCF-12B6-0B8D-EA2893C31C01');
		const { err_alert, language, errors, faqcategorydetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

		return (
			<div className="jbs-page-content">
				{/* Added By Megha Kariya (05-02-2019) : add close2Level */}
				<DashboardPageTitle title={<IntlMessages id="faq.categoryform.title.edit-faq-category" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
									{(menudetail["FCF84221-5ED0-82AD-77D8-883730A77330"] && menudetail["FCF84221-5ED0-82AD-77D8-883730A77330"].Visibility === "E925F86B") && //FCF84221-5ED0-82AD-77D8-883730A77330
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.category_name" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["FCF84221-5ED0-82AD-77D8-883730A77330"].AccessRight === "11E6E7B0") ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="category_name"
												id="category_name"
												maxLength={50}
												value={faqcategorydetail && faqcategorydetail.locale && faqcategorydetail.locale[lang.code] && faqcategorydetail.locale[lang.code].category_name || ''}
												onChange={(e) => this.onUpdateFaqCategoryDetail("category_name", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].category_name && <span className="text-danger"><IntlMessages id={errors[lang.code].category_name} /></span>}
										</FormGroup>}

									{(menudetail["27FCEEEE-4A4E-8220-0646-E485906982F7"] && menudetail["27FCEEEE-4A4E-8220-0646-E485906982F7"].Visibility === "E925F86B") && //27FCEEEE-4A4E-8220-0646-E485906982F7
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.sort_order" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["27FCEEEE-4A4E-8220-0646-E485906982F7"].AccessRight === "11E6E7B0") ? true : false}
												minLength={0}
												className="form-control"
												type="number"
												name="sort_order"
												id="sort_order"
												min="0" max="10"
												value={faqcategorydetail.sort_order || ''}
												onChange={(e) => this.onUpdateFaqCategoryDetail('sort_order', e.target.value)}
											/>
											{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
										</FormGroup>}

									{(menudetail["79C870DB-34AA-A337-9BF0-BC222D59A5E7"] && menudetail["79C870DB-34AA-A337-9BF0-BC222D59A5E7"].Visibility === "E925F86B") && //79C870DB-34AA-A337-9BF0-BC222D59A5E7
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.status" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["79C870DB-34AA-A337-9BF0-BC222D59A5E7"].AccessRight === "11E6E7B0") ? true : false}
												type="select" name="status" id="status" onChange={(e) => this.onUpdateFaqCategoryDetail('status', e.target.value)} value={faqcategorydetail.status}>>
												<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
											</Input>
											{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
										</FormGroup>}

									{(menudetail["D8A8779C-1839-6F63-7AC0-26A6812080A2"] && menudetail["D8A8779C-1839-6F63-7AC0-26A6812080A2"].Visibility === "E925F86B") && //D8A8779C-1839-6F63-7AC0-26A6812080A2
										<FormGroup>  { /* Added by Jayesh 22-01-2019  */}
											<Label><IntlMessages id="sidebar.date_created" /> : </Label>
											<Label>{new Date(this.props.faqcategorydata.date_created).toLocaleString()}</Label>
										</FormGroup>}

									{(menudetail["68500717-8873-8716-2E20-F03961CD67A9"] && menudetail["68500717-8873-8716-2E20-F03961CD67A9"].Visibility === "E925F86B") && //68500717-8873-8716-2E20-F03961CD67A9
										<FormGroup>
											<Label><IntlMessages id="sidebar.date_modified" /> : </Label>
											<Label>{new Date(this.props.faqcategorydata.date_modified).toLocaleString()}</Label>
										</FormGroup>}

									{Object.keys(menudetail).length > 0 &&
										<FormGroup>
											<Button
												className="text-white text-bold btn mr-10"
												variant="raised"
												color="primary"
												onClick={() => this.updateFaqCategory()}
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

const mapStateToProps = ({ languages, faqcategories, authTokenRdcer }) => {
	var response = {
		data: faqcategories.data,
		loading: faqcategories.loading,
		language: languages.language,
		faqcategorydetail: faqcategories.categorydetail,
		localebit: languages.localebit,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof faqcategories.localebit != 'undefined' && faqcategories.localebit != '') {
		response['localebit'] = faqcategories.localebit;
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	getFaqCategoryById, updateFaqCategory,
	getLanguage, getMenuPermissionByID,
})(EditFaqCategories));