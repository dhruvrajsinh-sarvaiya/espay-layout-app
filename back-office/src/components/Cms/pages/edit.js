/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 23-11-2018
    UpdatedDate : 23-11-2018
    Description : Edit Page Form
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
import 'jodit/build/jodit.min.css';
import 'jodit';
import 'rc-drawer/assets/index.css';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getPageById, updatePage } from 'Actions/Pages';
import { getLanguage } from 'Actions/Language';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { Editor } from "@tinymce/tinymce-react"; // Added By Megha Kariya (18/02/2019)
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
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.pages" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.editPage" />,
		link: '',
		index: 0
	}
];
//Validation for Page Form
const validatePageformInput = require('../../../validation/Pages/pages');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 2 * 3 }}>
			{children}
		</Typography>
	);
}

class EditPage extends Component {

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
			pagedetail: {
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
				page_type: "1",
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
			GUID: this.props.GUID,
		};
		this.initState = {
			activeIndex: 1,
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			btn_disabled: false
		};
		this.onUpdatePageDetail = this.onUpdatePageDetail.bind(this);
		this.updatePageDetail = this.updatePageDetail.bind(this);
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

	//On Update Page Details
	onUpdatePageDetail(key, value, lang) {
		if (lang != '') {
			let statusCopy = Object.assign({}, this.state.pagedetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				pagedetail: {
					...this.state.pagedetail,
					[key]: value
				}
			});
		}
	}

	//Update page Detail
	updatePageDetail() {
		const { locale, sort_order, status, route, page_type } = this.state.pagedetail;
		const { errors, isValid } = validatePageformInput(this.state.pagedetail);
		this.setState({ errors: errors, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
		if (!isValid) {
			let data = {
				id: this.state.pagedetail._id,
				locale,
				sort_order,
				status,
				route,
				page_type
			}
			setTimeout(() => {
				this.props.updatePage(data);
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
				let PageId = this.props.pagedata._id;
				if (PageId != '') {
					this.props.getLanguage();
					this.props.getPageById(PageId);
				} else {
					this.props.drawerClose();
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

		if (nextProps.localebit !== undefined && nextProps.localebit != '' && nextProps.localebit == 1) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {

					locale[lang.code] = {
						title: "",
						content: "",
						meta_title: '',
						meta_description: '',
						meta_keyword: ''
					};
				})
			}
			this.setState({
				pagedetail: {
					...this.state.pagedetail,
					locale: locale,
				}
			});
		}

		if (nextProps.pagedata !== undefined && nextProps.pagedata.locale !== undefined && nextProps.pagedata != '') {
			const newlocale = {};
			nextProps.language && nextProps.language.map((lang, key) => {

				newlocale[lang.code] = {
					title: nextProps.pagedata.locale[lang.code] && nextProps.pagedata.locale[lang.code].title ? nextProps.pagedata.locale[lang.code].title : '',
					content: nextProps.pagedata.locale[lang.code] && nextProps.pagedata.locale[lang.code].content ? nextProps.pagedata.locale[lang.code].content : '',
					meta_title: nextProps.pagedata.locale[lang.code] && nextProps.pagedata.locale[lang.code].meta_title ? nextProps.pagedata.locale[lang.code].meta_title : '',
					meta_description: nextProps.pagedata.locale[lang.code] && nextProps.pagedata.locale[lang.code].meta_description ? nextProps.pagedata.locale[lang.code].meta_description : '',
					meta_keyword: nextProps.pagedata.locale[lang.code] && nextProps.pagedata.locale[lang.code].meta_keyword ? nextProps.pagedata.locale[lang.code].meta_keyword : ''
				};
			})

			this.setState({
				pagedetail: {
					...this.state.pagedetail,
					locale: newlocale,
					_id: nextProps.pagedata._id,
					layout_id: nextProps.pagedata.layout_id,
					channel_id: nextProps.pagedata.channel_id,
					sort_order: nextProps.pagedata.sort_order,
					page_type: nextProps.pagedata.page_type,
					route: nextProps.pagedata.route,
					status: nextProps.pagedata.status + "", //Change by Khushbu Badheka D:29/01/201,
				}
			});

		}

		if (nextProps.data.responseCode === 0) {
			this.setState({ err_msg: '', err_alert: false });
			//this.props.drawerClose();
			this.resetData();
			this.props.reload();
		}

		if (nextProps.data !== undefined && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
			if (nextProps.data.errors.message !== undefined && nextProps.data.errors.message != '') {
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
		var menudetail = this.checkAndGetMenuAccessDetail(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA' ? '190E0316-95FF-3542-A36B-135591DC9400' : '9E207ACE-A323-37C1-8C62-7A4B9F094FD7');
		const { err_alert, language, errors, pagedetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="cmspage.title.edit-Page" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
				{(loading || this.props.menuLoading) && <JbsSectionLoader />}

				{errors.message && <div className="alert_area">
					<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
				</div>}

				<div className="jbs-page-content col-md-12 mx-auto">
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
											? (menudetail["8156F473-4537-90CA-932D-531A3ACA902F"] && menudetail["8156F473-4537-90CA-932D-531A3ACA902F"].Visibility === "E925F86B") //8156F473-4537-90CA-932D-531A3ACA902F
											: (menudetail["9C38B302-A56F-7443-115B-E0C02A9B416A"] && menudetail["9C38B302-A56F-7443-115B-E0C02A9B416A"].Visibility === "E925F86B")) && //9C38B302-A56F-7443-115B-E0C02A9B416A
											<FormGroup row>
												<Label><IntlMessages id="cmspage.pageform.label.pagename" />  ({lang.code})<span className="text-danger">*</span></Label>
												<DebounceInput
													readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["8156F473-4537-90CA-932D-531A3ACA902F"] && menudetail["8156F473-4537-90CA-932D-531A3ACA902F"].AccessRight === "11E6E7B0")
														: (menudetail["9C38B302-A56F-7443-115B-E0C02A9B416A"] && menudetail["9C38B302-A56F-7443-115B-E0C02A9B416A"].AccessRight === "11E6E7B0")) ? true : false}
													minLength={0}
													debounceTimeout={300}
													className="form-control"
													type="text"
													name="pagename"
													id="pagename"
													maxLength={30}
													value={pagedetail && pagedetail.locale && pagedetail.locale[lang.code] && pagedetail.locale[lang.code].title}
													onChange={(e) => this.onUpdatePageDetail("title", e.target.value, lang.code)}
												/>
												{errors && errors[lang.code] && errors[lang.code].title && <span className="text-danger"><IntlMessages id={errors[lang.code].title} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["E0E93FC1-979B-885C-31CD-97B88B345589"] && menudetail["E0E93FC1-979B-885C-31CD-97B88B345589"].Visibility === "E925F86B") //E0E93FC1-979B-885C-31CD-97B88B345589
											: (menudetail["94AF3143-9BC4-2ADB-8421-0000E4AF98F2"] && menudetail["94AF3143-9BC4-2ADB-8421-0000E4AF98F2"].Visibility === "E925F86B")) && //94AF3143-9BC4-2ADB-8421-0000E4AF98F2
											<FormGroup>
												<Label className="row"><IntlMessages id="cmspage.pageform.label.content" />  ({lang.code})<span className="text-danger">*</span></Label>
												<Editor
													disabled={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["E0E93FC1-979B-885C-31CD-97B88B345589"] && menudetail["E0E93FC1-979B-885C-31CD-97B88B345589"].AccessRight === "11E6E7B0")
														: (menudetail["94AF3143-9BC4-2ADB-8421-0000E4AF98F2"] && menudetail["94AF3143-9BC4-2ADB-8421-0000E4AF98F2"].AccessRight === "11E6E7B0")) ? true : false}
													init={{
														height: 500,
														plugins: 'link image code lists advlist table preview',
														toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
														statusbar: false
													}}
													value={pagedetail && pagedetail.locale && pagedetail.locale[lang.code] && pagedetail.locale[lang.code].content}
													onChange={(e) => this.onUpdatePageDetail("content", e.target.getContent(), lang.code)}
												/>
												{errors && errors[lang.code] && errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["7E757F9F-3A9F-77FE-9847-15D2BE2766A7"] && menudetail["7E757F9F-3A9F-77FE-9847-15D2BE2766A7"].Visibility === "E925F86B") //7E757F9F-3A9F-77FE-9847-15D2BE2766A7
											: (menudetail["699DB5CC-A4F0-0208-373B-C04757D59B8B"] && menudetail["699DB5CC-A4F0-0208-373B-C04757D59B8B"].Visibility === "E925F86B")) && //699DB5CC-A4F0-0208-373B-C04757D59B8B
											<FormGroup row>
												<Label><IntlMessages id="cmspage.pageform.label.metatitle" />  ({lang.code})<span className="text-danger">*</span></Label>
												<DebounceInput
													readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["7E757F9F-3A9F-77FE-9847-15D2BE2766A7"] && menudetail["7E757F9F-3A9F-77FE-9847-15D2BE2766A7"].AccessRight === "11E6E7B0")
														: (menudetail["699DB5CC-A4F0-0208-373B-C04757D59B8B"] && menudetail["699DB5CC-A4F0-0208-373B-C04757D59B8B"].AccessRight === "11E6E7B0")) ? true : false}
													minLength={0}
													debounceTimeout={300}
													className="form-control"
													type="text"
													name="meta_title"
													id="meta_title"
													maxLength={60}
													value={pagedetail && pagedetail.locale && pagedetail.locale[lang.code] && pagedetail.locale[lang.code].meta_title}
													onChange={(e) => this.onUpdatePageDetail("meta_title", e.target.value, lang.code)}
												/>
												{errors && errors[lang.code] && errors[lang.code].metatitle && <span className="text-danger"><IntlMessages id={errors[lang.code].metatitle} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["1756E579-947E-8755-92B9-478930C20567"] && menudetail["1756E579-947E-8755-92B9-478930C20567"].Visibility === "E925F86B") //1756E579-947E-8755-92B9-478930C20567
											: (menudetail["1F68EF18-1C06-627E-A1E9-3843EB58486A"] && menudetail["1F68EF18-1C06-627E-A1E9-3843EB58486A"].Visibility === "E925F86B")) && //1F68EF18-1C06-627E-A1E9-3843EB58486A
											<FormGroup row>
												<Label><IntlMessages id="cmspage.pageform.label.metakeyword" />  ({lang.code})</Label>
												<DebounceInput
													readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["1756E579-947E-8755-92B9-478930C20567"] && menudetail["1756E579-947E-8755-92B9-478930C20567"].AccessRight === "11E6E7B0")
														: (menudetail["1F68EF18-1C06-627E-A1E9-3843EB58486A"] && menudetail["1F68EF18-1C06-627E-A1E9-3843EB58486A"].AccessRight === "11E6E7B0")) ? true : false}
													minLength={0}
													debounceTimeout={300}
													className="form-control"
													type="text"
													name="meta_keyword"
													id="meta_keyword"
													value={pagedetail && pagedetail.locale && pagedetail.locale[lang.code] && pagedetail.locale[lang.code].meta_keyword}
													onChange={(e) => this.onUpdatePageDetail("meta_keyword", e.target.value, lang.code)}
												/>
												{errors && errors[lang.code] && errors[lang.code].meta_keyword && <span className="text-danger"><IntlMessages id={errors[lang.code].meta_keyword} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["66449097-9FF8-59E6-5542-1CDA605E062D"] && menudetail["66449097-9FF8-59E6-5542-1CDA605E062D"].Visibility === "E925F86B") //66449097-9FF8-59E6-5542-1CDA605E062D
											: (menudetail["148A9C6D-813A-5BF7-7EA8-4274EEE59045"] && menudetail["148A9C6D-813A-5BF7-7EA8-4274EEE59045"].Visibility === "E925F86B")) && //148A9C6D-813A-5BF7-7EA8-4274EEE59045
											<FormGroup row>
												<Label for="Text"><IntlMessages id="cmspage.pageform.label.metadescription" />  ({lang.code})</Label>
												<DebounceInput
													readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["66449097-9FF8-59E6-5542-1CDA605E062D"] && menudetail["66449097-9FF8-59E6-5542-1CDA605E062D"].AccessRight === "11E6E7B0")
														: (menudetail["148A9C6D-813A-5BF7-7EA8-4274EEE59045"] && menudetail["148A9C6D-813A-5BF7-7EA8-4274EEE59045"].AccessRight === "11E6E7B0")) ? true : false}
													minLength={0}
													debounceTimeout={300}
													className="form-control"
													type="textarea"
													name="meta_description"
													id="meta_description"
													maxLength={160}
													value={pagedetail && pagedetail.locale && pagedetail.locale[lang.code] && pagedetail.locale[lang.code].meta_description}
													onChange={(e) => this.onUpdatePageDetail("meta_description", e.target.value, lang.code)}
												/>
												{errors && errors[lang.code] && errors[lang.code].meta_description && <span className="text-danger"><IntlMessages id={errors[lang.code].meta_description} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["E2CA383C-6ADB-65B9-144C-B72E82745633"] && menudetail["E2CA383C-6ADB-65B9-144C-B72E82745633"].Visibility === "E925F86B") //E2CA383C-6ADB-65B9-144C-B72E82745633
											: (menudetail["7B7CC115-9D5F-6E9E-3F5E-D2DD2AA43BFE"] && menudetail["7B7CC115-9D5F-6E9E-3F5E-D2DD2AA43BFE"].Visibility === "E925F86B")) && //7B7CC115-9D5F-6E9E-3F5E-D2DD2AA43BFE
											<FormGroup row>
												<Label><IntlMessages id="cmspage.pageform.lable.pagetype" /><span className="text-danger">*</span></Label>
												<Input
													disabled={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["E2CA383C-6ADB-65B9-144C-B72E82745633"] && menudetail["E2CA383C-6ADB-65B9-144C-B72E82745633"].AccessRight === "11E6E7B0")
														: (menudetail["7B7CC115-9D5F-6E9E-3F5E-D2DD2AA43BFE"] && menudetail["7B7CC115-9D5F-6E9E-3F5E-D2DD2AA43BFE"].AccessRight === "11E6E7B0")) ? true : false}
													type="select" name="page_type" id="page_type" onChange={(e) => this.onUpdatePageDetail('page_type', e.target.value)} value={pagedetail.page_type}>>
							<IntlMessages id="cmspage.pagetype.informativepage">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
													<IntlMessages id="cmspage.pagetype.policypage">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
												</Input>
												{errors.page_type && <span className="text-danger"><IntlMessages id={errors.page_type} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["8B561744-9D75-0E0D-1BC9-4ECA17CA0CF0"] && menudetail["8B561744-9D75-0E0D-1BC9-4ECA17CA0CF0"].Visibility === "E925F86B") //8B561744-9D75-0E0D-1BC9-4ECA17CA0CF0
											: (menudetail["E7381E54-6BB1-7C6B-94FD-1587D78B8D1F"] && menudetail["E7381E54-6BB1-7C6B-94FD-1587D78B8D1F"].Visibility === "E925F86B")) && //E7381E54-6BB1-7C6B-94FD-1587D78B8D1F
											<FormGroup row>
												<Label><IntlMessages id="cmspage.pageform.label.pageroute" /><span className="text-danger">*</span></Label>
												<DebounceInput
													readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["8B561744-9D75-0E0D-1BC9-4ECA17CA0CF0"] && menudetail["8B561744-9D75-0E0D-1BC9-4ECA17CA0CF0"].AccessRight === "11E6E7B0")
														: (menudetail["E7381E54-6BB1-7C6B-94FD-1587D78B8D1F"] && menudetail["E7381E54-6BB1-7C6B-94FD-1587D78B8D1F"].AccessRight === "11E6E7B0")) ? true : false}
													minLength={0}
													debounceTimeout={300}
													className="form-control"
													type="text"
													name="route"
													id="route"
													value={pagedetail.route}
													onChange={(e) => this.onUpdatePageDetail('route', e.target.value)}
												/>
												{errors.route && <span className="text-danger"><IntlMessages id={errors.route} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["A4E15367-8316-9182-3552-ACE857616206"] && menudetail["A4E15367-8316-9182-3552-ACE857616206"].Visibility === "E925F86B") //A4E15367-8316-9182-3552-ACE857616206
											: (menudetail["79045EC8-5172-70BC-5C00-379BACA98BBA"] && menudetail["79045EC8-5172-70BC-5C00-379BACA98BBA"].Visibility === "E925F86B")) && //79045EC8-5172-70BC-5C00-379BACA98BBA
											<FormGroup row>
												<Label><IntlMessages id="cmspage.pageform.label.sort_order" /><span className="text-danger">*</span></Label>
												<DebounceInput
													readOnly={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["A4E15367-8316-9182-3552-ACE857616206"] && menudetail["A4E15367-8316-9182-3552-ACE857616206"].AccessRight === "11E6E7B0")
														: (menudetail["79045EC8-5172-70BC-5C00-379BACA98BBA"] && menudetail["79045EC8-5172-70BC-5C00-379BACA98BBA"].AccessRight === "11E6E7B0")) ? true : false}
													minLength={0}
													debounceTimeout={300}
													className="form-control"
													type="number"
													name="sort_order"
													id="sort_order"
													min="0" max="10"
													value={pagedetail.sort_order}
													onChange={(e) => this.onUpdatePageDetail('sort_order', e.target.value)}
												/>
												{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
											</FormGroup>}

										{(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
											? (menudetail["77310E25-6FE8-428F-0F9D-ECC71DFA6F2C"] && menudetail["77310E25-6FE8-428F-0F9D-ECC71DFA6F2C"].Visibility === "E925F86B") //77310E25-6FE8-428F-0F9D-ECC71DFA6F2C
											: (menudetail["93A7A381-8E46-165E-9C34-15FB296A62C0"] && menudetail["93A7A381-8E46-165E-9C34-15FB296A62C0"].Visibility === "E925F86B")) && //93A7A381-8E46-165E-9C34-15FB296A62C0
											<FormGroup row>
												<Label><IntlMessages id="cmspage.pageform.label.status" /><span className="text-danger">*</span></Label>
												<Input
													disabled={(this.props.GUID === '2896E607-2429-13D0-73B8-290FAF8835AA'
														? (menudetail["77310E25-6FE8-428F-0F9D-ECC71DFA6F2C"] && menudetail["77310E25-6FE8-428F-0F9D-ECC71DFA6F2C"].AccessRight === "11E6E7B0")
														: (menudetail["93A7A381-8E46-165E-9C34-15FB296A62C0"] && menudetail["93A7A381-8E46-165E-9C34-15FB296A62C0"].AccessRight === "11E6E7B0")) ? true : false}
													type="select" name="status" id="status" onChange={(e) => this.onUpdatePageDetail('status', e.target.value)} value={pagedetail.status}>>
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
													onClick={() => this.updatePageDetail()}
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
			</div>
		);
	}
}

const mapStateToProps = ({ languages, staticpages, authTokenRdcer }) => {
	var response = {
		data: staticpages.data,
		loading: staticpages.loading,
		language: languages.language,
		pagedetail: staticpages.pagedetail,
		updatestatus: staticpages.updatestatus,
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
	updatePage,
	getPageById,
	getLanguage,
	getMenuPermissionByID
})(EditPage));