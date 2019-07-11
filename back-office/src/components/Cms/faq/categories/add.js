/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 24-11-2018
    UpdatedDate : 21-01-2019
    Description : Add Faq Category Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import 'rc-drawer/assets/index.css';
//Import CRUD Operation For Faq category Actions...
import { addFaqCategory } from 'Actions/Faq';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
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
		title: <IntlMessages id="sidebar.addCategory" />,
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

class AddFaqCategories extends Component {

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
			addNewFaqCategoryDetail: {
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
			btn_disabled: false,
			addNewFaqCategoryDetail: {
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
			} //Added by Khushbu Badheka D:29/01/2019
		};
		this.onChangeAddNewFaqCategoryDetails = this.onChangeAddNewFaqCategoryDetails.bind(this);
		this.addFaqCategory = this.addFaqCategory.bind(this);
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

	// On Change Add New Faq Category Details
	onChangeAddNewFaqCategoryDetails(key, value, lang = '') {

		if ( lang != undefined && lang != '') {
			let statusCopy = Object.assign({}, this.state.addNewFaqCategoryDetail);
			statusCopy.locale[lang].category_name = value;
			this.setState(statusCopy);
		}
		else {

			this.setState({
				addNewFaqCategoryDetail: {
					...this.state.addNewFaqCategoryDetail,
					[key]: value
				}
			});
		}
	}

	//Add Faq Category Detail
	addFaqCategory() {
		const { locale, sort_order, status } = this.state.addNewFaqCategoryDetail;
		const { errors, isValid } = validateFaqCategoryInput(this.state.addNewFaqCategoryDetail);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		//let isValid=false;
		if (!isValid) {
			let data = {
				locale,
				sort_order,
				status
			}
			setTimeout(() => {
				this.props.addFaqCategory(data);
				this.setState({ loading: true });
			}, 1000);
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
						category_name: "",
					};
				})
			}

			var newObj = Object.assign({}, this.state.addNewFaqCategoryDetail);
			newObj['locale'] = locale;
		   this.setState({addNewFaqCategoryDetail:newObj})
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
						response = fieldList;
					}
				}
			}

		}
		return response;
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('A1644275-A243-542D-5013-2B02788533FB');
		const { err_alert, language, errors, addNewFaqCategoryDetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		return (
			<div className="jbs-page-content">
				{/* Added By Megha Kariya (05-02-2019) : add close2Level */}
				<DashboardPageTitle title={<IntlMessages id="faq.categoryform.title.add-faq-category" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
									{(menudetail["D629F3F7-1D38-67DF-0B6F-FE6ADCE58E51"] && menudetail["D629F3F7-1D38-67DF-0B6F-FE6ADCE58E51"].Visibility === "E925F86B") && //D629F3F7-1D38-67DF-0B6F-FE6ADCE58E51
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.category_name" /> ({lang.code}) <span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["D629F3F7-1D38-67DF-0B6F-FE6ADCE58E51"].AccessRight === "11E6E7B0") ? true : false}
												minLength={2}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="category_name"
												id="category_name"
												maxLength={50}
												value={addNewFaqCategoryDetail.locale[lang.code].category_name}
												onChange={(e) => this.onChangeAddNewFaqCategoryDetails("category_name", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].category_name && <span className="text-danger"><IntlMessages id={errors[lang.code].category_name} /></span>}
										</FormGroup>}

									{(menudetail["1B944FBC-99BA-4C2D-459F-8E02CEF503C8"] && menudetail["1B944FBC-99BA-4C2D-459F-8E02CEF503C8"].Visibility === "E925F86B") && //1B944FBC-99BA-4C2D-459F-8E02CEF503C8
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.sort_order" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["1B944FBC-99BA-4C2D-459F-8E02CEF503C8"].AccessRight === "11E6E7B0") ? true : false}
												minLength={2}
												className="form-control"
												type="number"
												name="sort_order"
												id="sort_order"
												min="0" max="10"
												value={addNewFaqCategoryDetail.sort_order}
												onChange={(e) => this.onChangeAddNewFaqCategoryDetails('sort_order', e.target.value)}
											/>
											{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
										</FormGroup>}

									{(menudetail["5CC76542-8C8E-16BF-0935-76C69A9C48A4"] && menudetail["5CC76542-8C8E-16BF-0935-76C69A9C48A4"].Visibility === "E925F86B") && //5CC76542-8C8E-16BF-0935-76C69A9C48A4
										<FormGroup>
											<Label><IntlMessages id="faq.categoryform.label.status" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["5CC76542-8C8E-16BF-0935-76C69A9C48A4"].AccessRight === "11E6E7B0") ? true : false}
												type="select" name="status" id="status" onChange={(e) => this.onChangeAddNewFaqCategoryDetails('status', e.target.value)} value={addNewFaqCategoryDetail.status}>>
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
												onClick={() => this.addFaqCategory()}
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

const mapStateToProps = ({ languages, faqcategories, authTokenRdcer }) => {
	var response = {
		data: faqcategories.data,
		loading: faqcategories.loading,
		language: languages.language,
		localebit: languages.localebit,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof faqcategories.localebit != 'undefined' && faqcategories.localebit != '') {
		response['localebit'] = faqcategories.localebit;
	}
	return response;
}

export default connect(mapStateToProps, {
	addFaqCategory, getLanguage, getMenuPermissionByID
})(AddFaqCategories);