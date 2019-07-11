/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 23-11-2018
    UpdatedDate : 24-11-2018
    Description : CMS Add Page Form
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

//Import CRUD Operation For Page Actions...
import { addNewPage } from 'Actions/Pages';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { Editor } from "@tinymce/tinymce-react"; // Added By Megha Kariya (18/02/2019)
import { NotificationManager } from "react-notifications";

//Validation for Page Form
import validatePageformInput from '../../../validation/Pages/pages';

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
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.pages" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.addPage" />,
		link: '',
		index: 0
	}
];

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{children}
		</Typography>
	);
}

class AddPage extends Component {

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
			addNewPageDetail: {
				locale: {
					en: {
						title: "",
						content: "",
						meta_title: '',
						meta_description: '',
						meta_keyword: ''
					}
				},
				layout_id: "",
				channel_id: "",
				sort_order: "",
				route: "",
				status: "1",
				page_type: "1",
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
			GUID: this.props.GUID,
		};
		this.initState = {
			activeIndex: 1,
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			btn_disabled: false,
			addNewPageDetail: {
				locale: {
					en: {
						title: "",
						content: "",
						meta_title: '',
						meta_description: '',
						meta_keyword: ''
					}
				},
				layout_id: "",
				channel_id: "",
				sort_order: "",
				route: "",
				status: "1",
				page_type: "1",
				date_created: "",
				date_modified: "",
				created_by: "",
				modified_by: "",
			} //Added by Khushbu Badheka D:29/01/2019
		};
		this.onChangeAddNewPageDetails = this.onChangeAddNewPageDetails.bind(this);
		this.addPageDetail = this.addPageDetail.bind(this);
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

	//On Change Add New Page Details
	onChangeAddNewPageDetails(key, value, lang = '') {
		if (lang != '') {
			let statusCopy = Object.assign({}, this.state.addNewPageDetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				addNewPageDetail: {
					...this.state.addNewPageDetail,
					[key]: value
				}
			});
		}
	}

	//Add Page Detail
	addPageDetail() {
		const { locale, sort_order, status, route, page_type } = this.state.addNewPageDetail;
		const { errors, isValid } = validatePageformInput(this.state.addNewPageDetail);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		//let isValid=false;
		if (!isValid) {
			let data = {
				locale,
				sort_order,
				route,
				status,
				page_type
			}
			setTimeout(() => {
				this.props.addNewPage(data);
				this.setState({ loading: true });
			}, 2000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID(this.props.GUID);
	}

	componentWillReceiveProps(nextProps) {

		if (this.state.GUID !== this.props.GUID) {
			this.props.getMenuPermissionByID(this.props.GUID);
			this.setState({ GUID: this.props.GUID })
		}

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

		if (nextProps.hasOwnProperty("data"))
			if (nextProps.data != undefined && (nextProps.data.responseCode === 0)) {
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

			nextProps.language && nextProps.language.map((lang) => {

				locale[lang.code] = {
					title: "",
					content: "",
					meta_title: '',
					meta_description: '',
					meta_keyword: ''
				};
			})

			this.setState({
				addNewPageDetail: { locale: locale },
				...this.state.addNewPageDetail
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
						response = fieldList;
					}
				}
			}
		}
		return response;
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA' ? 'FB5F69CB-2CFA-7763-6EDC-22632EF4A6F2' : 'D093616C-4E32-8AD1-60CF-81F4457D9667');
		const { err_alert, language, errors, addNewPageDetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled


		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="cmspage.title.add-Page" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["290F57E5-2691-6F61-9641-EAA0A01868FF"] && menudetail["290F57E5-2691-6F61-9641-EAA0A01868FF"].Visibility === "E925F86B") //290F57E5-2691-6F61-9641-EAA0A01868FF
										: (menudetail["808D0F78-0EAE-2A70-1403-332650543B8D"] && menudetail["808D0F78-0EAE-2A70-1403-332650543B8D"].Visibility === "E925F86B")) && //808D0F78-0EAE-2A70-1403-332650543B8D
										<FormGroup row>
											<Label><IntlMessages id="cmspage.pageform.label.pagename" />  ({lang.code})<span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["290F57E5-2691-6F61-9641-EAA0A01868FF"] && menudetail["290F57E5-2691-6F61-9641-EAA0A01868FF"].AccessRight === "11E6E7B0")
													: (menudetail["808D0F78-0EAE-2A70-1403-332650543B8D"] && menudetail["808D0F78-0EAE-2A70-1403-332650543B8D"].AccessRight === "11E6E7B0")) ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="pagename"
												id="pagename"
												maxLength={30}
												value={addNewPageDetail.locale[lang.code].title}
												onChange={(e) => this.onChangeAddNewPageDetails("title", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].title && <span className="text-danger"><IntlMessages id={errors[lang.code].title} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["A0E2F577-006E-A3E9-5DA3-A2889458505A"] && menudetail["A0E2F577-006E-A3E9-5DA3-A2889458505A"].Visibility === "E925F86B") //A0E2F577-006E-A3E9-5DA3-A2889458505A
										: (menudetail["C8E07E00-97CC-A4A6-7B2A-7F851D811472"] && menudetail["C8E07E00-97CC-A4A6-7B2A-7F851D811472"].Visibility === "E925F86B")) && //C8E07E00-97CC-A4A6-7B2A-7F851D811472
										<FormGroup>
											<Label className="row"><IntlMessages id="cmspage.pageform.label.content" />  ({lang.code})<span className="text-danger">*</span></Label>
											<Editor
												init={{
													height: 500,
													plugins: 'link image code lists advlist table preview',
													toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
													statusbar: false
												}}
												disabled={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["A0E2F577-006E-A3E9-5DA3-A2889458505A"] && menudetail["A0E2F577-006E-A3E9-5DA3-A2889458505A"].AccessRight === "11E6E7B0")
													: (menudetail["C8E07E00-97CC-A4A6-7B2A-7F851D811472"] && menudetail["C8E07E00-97CC-A4A6-7B2A-7F851D811472"].AccessRight === "11E6E7B0")) ? true : false}
												value={addNewPageDetail.locale[lang.code].content}
												onChange={(e) => this.onChangeAddNewPageDetails("content", e.target.getContent(), lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["725F7997-A3AB-04D5-1E16-140C92563358"] && menudetail["725F7997-A3AB-04D5-1E16-140C92563358"].Visibility === "E925F86B") //725F7997-A3AB-04D5-1E16-140C92563358
										: (menudetail["28DA4086-11F0-9EFE-6994-537F1879A3A3"] && menudetail["28DA4086-11F0-9EFE-6994-537F1879A3A3"].Visibility === "E925F86B")) && //28DA4086-11F0-9EFE-6994-537F1879A3A3
										<FormGroup row>
											<Label><IntlMessages id="cmspage.pageform.label.metatitle" />  ({lang.code})<span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["725F7997-A3AB-04D5-1E16-140C92563358"] && menudetail["725F7997-A3AB-04D5-1E16-140C92563358"].AccessRight === "11E6E7B0")
													: (menudetail["28DA4086-11F0-9EFE-6994-537F1879A3A3"] && menudetail["28DA4086-11F0-9EFE-6994-537F1879A3A3"].AccessRight === "11E6E7B0")) ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="meta_title"
												id="meta_title"
												maxLength={60}
												value={addNewPageDetail.locale[lang.code].meta_title}
												onChange={(e) => this.onChangeAddNewPageDetails("meta_title", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].metatitle && <span className="text-danger"><IntlMessages id={errors[lang.code].metatitle} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["6246E8DA-0437-0BE3-8ABF-3A66D1AF4D08"] && menudetail["6246E8DA-0437-0BE3-8ABF-3A66D1AF4D08"].Visibility === "E925F86B") //6246E8DA-0437-0BE3-8ABF-3A66D1AF4D08
										: (menudetail["6A8D5BEF-74A0-3832-7AF4-AA1960EE42E9"] && menudetail["6A8D5BEF-74A0-3832-7AF4-AA1960EE42E9"].Visibility === "E925F86B")) && //6A8D5BEF-74A0-3832-7AF4-AA1960EE42E9
										<FormGroup row>
											<Label><IntlMessages id="cmspage.pageform.label.metakeyword" />  ({lang.code})</Label>
											<DebounceInput
												readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["6246E8DA-0437-0BE3-8ABF-3A66D1AF4D08"] && menudetail["6246E8DA-0437-0BE3-8ABF-3A66D1AF4D08"].AccessRight === "11E6E7B0")
													: (menudetail["6A8D5BEF-74A0-3832-7AF4-AA1960EE42E9"] && menudetail["6A8D5BEF-74A0-3832-7AF4-AA1960EE42E9"].AccessRight === "11E6E7B0")) ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="meta_keyword"
												id="meta_keyword"
												value={addNewPageDetail.locale[lang.code].meta_keyword}
												onChange={(e) => this.onChangeAddNewPageDetails("meta_keyword", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].meta_keyword && <span className="text-danger"><IntlMessages id={errors[lang.code].meta_keyword} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["203C6F76-498C-A13F-99EE-7DB2E518912B"] && menudetail["203C6F76-498C-A13F-99EE-7DB2E518912B"].Visibility === "E925F86B") //203C6F76-498C-A13F-99EE-7DB2E518912B
										: (menudetail["852A3107-6FB3-7DE1-7CB2-E726DE830895"] && menudetail["852A3107-6FB3-7DE1-7CB2-E726DE830895"].Visibility === "E925F86B")) && //852A3107-6FB3-7DE1-7CB2-E726DE830895
										<FormGroup row>
											<Label for="Text"><IntlMessages id="cmspage.pageform.label.metadescription" />  ({lang.code})</Label>
											<DebounceInput
												readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["203C6F76-498C-A13F-99EE-7DB2E518912B"] && menudetail["203C6F76-498C-A13F-99EE-7DB2E518912B"].AccessRight === "11E6E7B0")
													: (menudetail["852A3107-6FB3-7DE1-7CB2-E726DE830895"] && menudetail["852A3107-6FB3-7DE1-7CB2-E726DE830895"].AccessRight === "11E6E7B0")) ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="textarea"
												name="meta_description"
												id="meta_description"
												maxLength={160}
												value={addNewPageDetail.locale[lang.code].meta_description}
												onChange={(e) => this.onChangeAddNewPageDetails("meta_description", e.target.value, lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].meta_description && <span className="text-danger"><IntlMessages id={errors[lang.code].meta_description} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["3CF06789-1FB4-5EC6-639C-F1ADD1B0107D"] && menudetail["3CF06789-1FB4-5EC6-639C-F1ADD1B0107D"].Visibility === "E925F86B") //3CF06789-1FB4-5EC6-639C-F1ADD1B0107D
										: (menudetail["EF3F54F4-5166-41BC-1E11-FA46322212DA"] && menudetail["EF3F54F4-5166-41BC-1E11-FA46322212DA"].Visibility === "E925F86B")) && //EF3F54F4-5166-41BC-1E11-FA46322212DA
										<FormGroup row>
											<Label><IntlMessages id="cmspage.pageform.lable.pagetype" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["3CF06789-1FB4-5EC6-639C-F1ADD1B0107D"] && menudetail["3CF06789-1FB4-5EC6-639C-F1ADD1B0107D"].AccessRight === "11E6E7B0")
													: (menudetail["EF3F54F4-5166-41BC-1E11-FA46322212DA"] && menudetail["EF3F54F4-5166-41BC-1E11-FA46322212DA"].AccessRight === "11E6E7B0")) ? true : false}
												type="select" name="page_type" id="page_type" onChange={(e) => this.onChangeAddNewPageDetails('page_type', e.target.value)} value={addNewPageDetail.page_type}>
												<IntlMessages id="cmspage.pagetype.informativepage">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="cmspage.pagetype.policypage">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
											</Input>
											{errors.page_type && <span className="text-danger"><IntlMessages id={errors.page_type} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["40194191-79CA-0F83-10C7-D3AB647C5255"] && menudetail["40194191-79CA-0F83-10C7-D3AB647C5255"].Visibility === "E925F86B") //40194191-79CA-0F83-10C7-D3AB647C5255
										: (menudetail["E8C3C6E5-7B6D-76BB-1848-D58BFB643695"] && menudetail["E8C3C6E5-7B6D-76BB-1848-D58BFB643695"].Visibility === "E925F86B")) && //E8C3C6E5-7B6D-76BB-1848-D58BFB643695
										<FormGroup row>
											<Label><IntlMessages id="cmspage.pageform.label.pageroute" /><span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["40194191-79CA-0F83-10C7-D3AB647C5255"] && menudetail["40194191-79CA-0F83-10C7-D3AB647C5255"].AccessRight === "11E6E7B0")
													: (menudetail["E8C3C6E5-7B6D-76BB-1848-D58BFB643695"] && menudetail["E8C3C6E5-7B6D-76BB-1848-D58BFB643695"].AccessRight === "11E6E7B0")) ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="route"
												id="route"
												value={addNewPageDetail.route}
												onChange={(e) => this.onChangeAddNewPageDetails('route', e.target.value)}
											/>
											{errors.route && <span className="text-danger"><IntlMessages id={errors.route} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["71B684AA-A542-903C-55D7-09C6EFA52D58"] && menudetail["71B684AA-A542-903C-55D7-09C6EFA52D58"].Visibility === "E925F86B") //71B684AA-A542-903C-55D7-09C6EFA52D58
										: (menudetail["7EBA5693-0383-8EA0-310C-6AA6EBDFA6C7"] && menudetail["7EBA5693-0383-8EA0-310C-6AA6EBDFA6C7"].Visibility === "E925F86B")) && //7EBA5693-0383-8EA0-310C-6AA6EBDFA6C7
										<FormGroup row>
											<Label><IntlMessages id="cmspage.pageform.label.sort_order" /><span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["71B684AA-A542-903C-55D7-09C6EFA52D58"] && menudetail["71B684AA-A542-903C-55D7-09C6EFA52D58"].AccessRight === "11E6E7B0")
													: (menudetail["7EBA5693-0383-8EA0-310C-6AA6EBDFA6C7"] && menudetail["7EBA5693-0383-8EA0-310C-6AA6EBDFA6C7"].AccessRight === "11E6E7B0")) ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="number"
												name="sort_order"
												id="sort_order"
												min="0" max="10"
												value={addNewPageDetail.sort_order}
												onChange={(e) => this.onChangeAddNewPageDetails('sort_order', e.target.value)}
											/>
											{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
										</FormGroup>}

									{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
										? (menudetail["2F507065-6C20-2EC0-5ACF-4D2927238606"] && menudetail["2F507065-6C20-2EC0-5ACF-4D2927238606"].Visibility === "E925F86B") //2F507065-6C20-2EC0-5ACF-4D2927238606
										: (menudetail["5B974839-6EBA-0588-283A-2190B2E49DE4"] && menudetail["5B974839-6EBA-0588-283A-2190B2E49DE4"].Visibility === "E925F86B")) && //5B974839-6EBA-0588-283A-2190B2E49DE4
										<FormGroup row>
											<Label><IntlMessages id="cmspage.pageform.label.status" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
													? (menudetail["2F507065-6C20-2EC0-5ACF-4D2927238606"] && menudetail["2F507065-6C20-2EC0-5ACF-4D2927238606"].AccessRight === "11E6E7B0")
													: (menudetail["5B974839-6EBA-0588-283A-2190B2E49DE4"] && menudetail["5B974839-6EBA-0588-283A-2190B2E49DE4"].AccessRight === "11E6E7B0")) ? true : false}
												type="select" name="status" id="status" onChange={(e) => this.onChangeAddNewPageDetails('status', e.target.value)} value={addNewPageDetail.status}>
												<IntlMessages id="sidebar.btnActive">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
												<IntlMessages id="sidebar.btnInactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
											</Input>
											{errors.status && <span className="text-danger"><IntlMessages id={errors.status} /></span>}
										</FormGroup>}

									{Object.keys(menudetail).length > 0 &&
										<FormGroup row>
											<Button
												className="text-white text-bold btn mr-10"
												variant="raised"
												color="primary"
												onClick={() => this.addPageDetail()}
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

const mapStateToProps = ({ languages, staticpages, authTokenRdcer }) => {
	var response = {
		data: staticpages.data,
		loading: staticpages.loading,
		language: languages.language,
		localebit: languages.localebit,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (staticpages.localebit !== undefined && staticpages.localebit != '') {
		response['localebit'] = staticpages.localebit;
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	addNewPage, getLanguage, getMenuPermissionByID,
})(AddPage));