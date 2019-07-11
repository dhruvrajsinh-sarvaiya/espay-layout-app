/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 11-10-2018
    UpdatedDate : 23-10-2018
	Description : CMS Site Setting Form
	to Do : mimimize coding for chat api state data 
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import MatButton from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import CRUD Operation For SiteSetting Actions...
import { getSiteSettingInfo, postSiteSettingInfo } from 'Actions/SiteSetting';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { getLanguage } from 'Actions/Language';
import { getCountry, getStateByCountryId } from 'Actions/Localization';
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
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.sitesetting" />,
		link: '',
		index: 0
	},
];
//Validation for Page Form
const validateSiteSettingformInput = require('../../../validation/SiteSetting/sitesetting');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{children}
		</Typography>
	);
}

class SiteSetting extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			languageIndex: 1,
			loading: false,
			errors: {},
			err_alert: true,
			btn_disabled: false,
			showSuccessStatus: false,
			countryLoaded: 0,
			stateLoaded: 0,
			dataLoaded: 0,
			localeLoaded: 0,
			sitesetting: {
				general: {
					locale: {
						en: {
							sitename: '',
							copyrights: '',
							meta_title: '',
							meta_keyword: '',
							meta_description: '',
							maintenance_message: ''
						},
					},

				},
				image: {
					logo: '',
					logoPreviewUrl: '',
					fevicon: '',
					feviconPreviewUrl: ''
				},
				local: {
					streetaddress: '',
					city: '',
					postalcode: '',
					country: '',
					state: '',
					phoneno: '',
					emailaddress: '',
					language: '',
				},
				seo:
				{
					//Added by Jayesh on 28-12-2018
					googleanalytics: '',
					googleanalytics_url: ''
				},
				social:
				{
					facebooklink: '',
					twitterlink: '',
					linkedinlink: '',
					googlepluslink: '',
					skypelink: '',
					youtubelink: '',
					pinetrestlink: '',
					instagramlink: '',
					whatsapplink: '',
				},
				server:
				{
					maintenance_mode: 0,

				},
				chatscript:
				{
					zendesk: '',  // Added by Jayesh on 25-12-2018
					zoho: '',
					tawk: '',
					livechatinc: '',
					livehelpnow: '',
					smartsupp: '',
					zendesk_active: 0,
					zoho_active: 0,
					tawk_active: 0,
					livechatinc_active: 0,
					livehelpnow_active: 0,
					smartsupp_active: 0
				}
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
			countries: {},
			stateAll: [],
			siteid: 1,
			fieldList: {},
			menudetail: [],
			Pflag: true,
		};
		this.initState = {
			activeIndex: 0,
			languageIndex: 1,
			loading: false,
			errors: {},
			err_alert: true,
			showSuccessStatus: false,
			btn_disabled: false,
			dataLoaded: 0 // Added By Megha Kariya (04/02/2019)
		};
		this.onChangeAddNewPageDetails = this.onChangeAddNewPageDetails.bind(this);
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

	// Handle tab Change
	handleChange(e, value) {
		this.setState({ activeIndex: value });
	}

	// Handle Language tab Change
	handlelanguageChange(e, value) {
		this.setState({ languageIndex: value });
	}

	/*Get File Data */
	handleselectedFile = event => {
		let errors = this.state.errors;
		if (event.target.name == 'logo') {

			let statusCopy = Object.assign({}, this.state.sitesetting);
			statusCopy.image[event.target.name] = event.target.files[0];
			this.setState(statusCopy);
			let reader = new FileReader();

			reader.onloadend = () => {
				this.setState((state) => ({ sitesetting: { ...state.sitesetting, image: { ...state.sitesetting.image, 'logoPreviewUrl': reader.result } } }));
			}
			reader.readAsDataURL(event.target.files[0]);

		}
		if (event.target.name == 'fevicon') {

			let statusCopy = Object.assign({}, this.state.sitesetting);
			statusCopy.image[event.target.name] = event.target.files[0];
			this.setState(statusCopy);

			let reader = new FileReader();

			reader.onloadend = () => {
				this.setState((state) => ({ sitesetting: { ...state.sitesetting, image: { ...state.sitesetting.image, 'feviconPreviewUrl': reader.result } } }));
			}
			reader.readAsDataURL(event.target.files[0]);
			errors.fevicon = '';

		}
		this.setState({ err_alert: true, errors: errors });
	}

	//On Change Add New Page Details
	onChangeAddNewPageDetails(tab, key, value, lang = '', isdefault = 0) {
		if (lang != '') {
			if (tab == 0) {
				let statusCopy = Object.assign({}, this.state.sitesetting);
				statusCopy.general.locale[lang][key] = value;

				this.setState((state) => ({ sitesetting: { ...state.sitesetting, general: { ...state.sitesetting.general.locale.en, [key]: value } } }))
			}
		}
		else {

			if (tab == 2) {
				this.setState((state) => ({ sitesetting: { ...state.sitesetting, local: { ...state.sitesetting.local, [key]: value } } }))

				if (key == 'country') {
					this.setState({ stateLoaded: 0 });
					this.props.getStateByCountryId({ countryId: value });
				}
			}
			if (tab == 3) {
				this.setState((state) => ({ sitesetting: { ...state.sitesetting, seo: { ...state.sitesetting.seo, [key]: value } } }))
			}
			if (tab == 4) {
				this.setState((state) => ({ sitesetting: { ...state.sitesetting, social: { ...state.sitesetting.social, [key]: value } } }))
			}
			if (tab == 5) {
				this.setState((state) => ({ sitesetting: { ...state.sitesetting, server: { ...state.sitesetting.server, [key]: value } } }))
			}
			if (tab == 6) //Added by Jayesh on 26-12-2018  for Chat API
			{
				if (isdefault == 1) {
					if (key == 'tawk_active') {
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, [key]: 1 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zendesk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zoho_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livechatinc_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livehelpnow_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'smartsupp_active': 0 } } }))
					}
					else if (key == 'zendesk_active') {
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, [key]: 1 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'tawk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zoho_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livechatinc_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livehelpnow_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'smartsupp_active': 0 } } }))
					}
					else if (key == 'zoho_active') {
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, [key]: 1 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zendesk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'tawk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livechatinc_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livehelpnow_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'smartsupp_active': 0 } } }))
					}
					else if (key == 'livechatinc_active') {
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, [key]: 1 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zendesk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zoho_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'tawk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livehelpnow_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'smartsupp_active': 0 } } }))
					}
					else if (key == 'livehelpnow_active') {
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, [key]: 1 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zendesk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zoho_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livechatinc_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'tawk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'smartsupp_active': 0 } } }))
					}
					else if (key == 'smartsupp_active') {
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, [key]: 1 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zendesk_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'zoho_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livechatinc_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'livehelpnow_active': 0 } } }))
						this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, 'tawk_active': 0 } } }))
					}

				}
				else
					this.setState((state) => ({ sitesetting: { ...state.sitesetting, chatscript: { ...state.sitesetting.chatscript, [key]: value } } }))

			}
		}
	}

	//handle Submit
	handleSubmit(e) {
		e.preventDefault();
		const { errors, isValid } = validateSiteSettingformInput(this.state.sitesetting);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		if (!isValid) {
			let data = this.state.sitesetting;
			setTimeout(() => {
				this.props.postSiteSettingInfo(data);
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


	/**
	* Performs a deep merge of objects and returns new object. Does not modify
	* objects (immutable) and merges arrays via concatenation.
	*
	* @param {...object} objects - Objects to merge
	* @returns {object} New object with merged key/values
	*/
	mergeDeep(...objects) {
		const isObject = obj => obj && typeof obj === 'object';

		return objects.reduce((prev, obj) => {
			Object.keys(obj).forEach(key => {
				const pVal = prev[key];
				const oVal = obj[key];

				if (Array.isArray(pVal) && Array.isArray(oVal)) {
					prev[key] = pVal.concat(...oVal);
				}
				else if (isObject(pVal) && isObject(oVal)) {
					prev[key] = this.mergeDeep(pVal, oVal);
				}
				else {
					prev[key] = oVal;
				}
			});

			return prev;
		}, {});
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('86D8E511-1BDC-61C0-6DA0-F8235070A588');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getLanguage();
				this.props.getCountry({ page: 'all' });
				if (typeof this.state.siteid != 'undefined' && this.state.siteid != '') {
					this.props.getSiteSettingInfo(this.state.siteid);
				}

			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1 && this.state.localeLoaded == 0) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					locale[lang.code] = {
						sitename: "",
						copyrights: "",
						meta_title: "",
						meta_keyword: "",
						meta_description: "",
						maintenance_message: ""
					};
				})
			}

			this.setState((state) => ({ sitesetting: { ...state.sitesetting, general: { ...state.sitesetting.general, locale: locale } } }))
			this.setState({ localeLoaded: 1, btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
		}

		if (typeof nextProps.sitesetting != 'undefined' && nextProps.sitesetting != '' && this.state.dataLoaded == 0 && nextProps.SiteSettingInfosuccess == 1) {
			const finalstate = this.mergeDeep(this.state.sitesetting, nextProps.sitesetting);

			this.setState({
				sitesetting: finalstate,
				dataLoaded: 1,
				btn_disabled: false // Added By Megha Kariya (08/02/2019)
			});

			const newlocale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {

					newlocale[lang.code] = {
						sitename: nextProps.sitesetting && nextProps.sitesetting.general && nextProps.sitesetting.general.locale && typeof nextProps.sitesetting.general.locale[lang.code] != 'undefined' && nextProps.sitesetting.general.locale[lang.code] && nextProps.sitesetting.general.locale[lang.code].sitename ? nextProps.sitesetting.general.locale[lang.code].sitename : '',
						copyrights: nextProps.sitesetting && nextProps.sitesetting.general && nextProps.sitesetting.general.locale && typeof nextProps.sitesetting.general.locale[lang.code] != 'undefined' && nextProps.sitesetting.general.locale[lang.code] && nextProps.sitesetting.general.locale[lang.code].copyrights ? nextProps.sitesetting.general.locale[lang.code].copyrights : '',
						meta_title: nextProps.sitesetting && nextProps.sitesetting.general && nextProps.sitesetting.general.locale && typeof nextProps.sitesetting.general.locale[lang.code] != 'undefined' && nextProps.sitesetting.general.locale[lang.code] && nextProps.sitesetting.general.locale[lang.code].meta_title ? nextProps.sitesetting.general.locale[lang.code].meta_title : '',
						meta_keyword: nextProps.sitesetting && nextProps.sitesetting.general && nextProps.sitesetting.general.locale && typeof nextProps.sitesetting.general.locale[lang.code] != 'undefined' && nextProps.sitesetting.general.locale[lang.code] && nextProps.sitesetting.general.locale[lang.code].meta_keyword ? nextProps.sitesetting.general.locale[lang.code].meta_keyword : '',
						meta_description: nextProps.sitesetting && nextProps.sitesetting.general && nextProps.sitesetting.general.locale && typeof nextProps.sitesetting.general.locale[lang.code] != 'undefined' && nextProps.sitesetting.general.locale[lang.code] && nextProps.sitesetting.general.locale[lang.code].meta_description ? nextProps.sitesetting.general.locale[lang.code].meta_description : '',
						maintenance_message: nextProps.sitesetting && nextProps.sitesetting.general && nextProps.sitesetting.general.locale && typeof nextProps.sitesetting.general.locale[lang.code] != 'undefined' && nextProps.sitesetting.general.locale[lang.code] && nextProps.sitesetting.general.locale[lang.code].maintenance_message ? nextProps.sitesetting.general.locale[lang.code].maintenance_message : '',
					};
				})
			}

			this.setState((state) => ({ sitesetting: { ...state.sitesetting, general: { ...state.sitesetting.general, locale: newlocale } } }))
			if (typeof nextProps.sitesetting.local.country != 'undefined' && nextProps.sitesetting.local.country != '') {
				this.props.getStateByCountryId({ countryId: nextProps.sitesetting.local.country });
			}
		}

		this.setState({
			loading: nextProps.loading,
			language: nextProps.language
		});

		if (typeof nextProps.countries != 'undefined' && nextProps.countries != '' && this.state.countryLoaded == 0) {
			this.setState({
				countries: nextProps.countries,
				countryLoaded: 1
			});
		}

		if (nextProps.hasOwnProperty('countrystateData')) {
			if (typeof nextProps.countrystateData.responseCode != 'undefined' && nextProps.countrystateData.responseCode == 0 && this.state.stateLoaded == 0) {
				this.setState({
					stateAll: nextProps.countrystateData.data,
					stateLoaded: 1
				});
			}
		}

		if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 0) {
			this.setState({ err_msg: '', err_alert: false, showSuccessStatus: true });
			setTimeout(function () {
				this.setState({ showSuccessStatus: false, dataLoaded: 0, btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
				if (typeof this.state.siteid != 'undefined' && this.state.siteid != '') {
					this.props.getSiteSettingInfo(this.state.siteid);
				}
			}.bind(this), 2000);

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
		const { err_alert, activeIndex, countries, stateAll, language, errors, sitesetting, loading, showSuccessStatus, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

		var menuDetail = this.checkAndGetMenuAccessDetail('213B025B-8BC4-3140-9F77-3724286C5CF3');

		return (
			<Fragment>
				<div className="jbs-page-content">
					<DashboardPageTitle title={<IntlMessages id="sidebar.sitesetting" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
					{(loading || this.props.menuLoading) && <JbsSectionLoader />}

					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}
					<Alert color="success" isOpen={showSuccessStatus} toggle={(e) => this.setState({ showSuccessStatus: false })}>
						<IntlMessages id="common.form.edit.success" />
					</Alert>

					<Form encType="multipart/form-data">
						<AppBar position="static">
							<Tabs
								value={this.state.activeIndex}
								onChange={(e, value) => this.handleChange(e, value)}
								fullWidth
								scrollable
								scrollButtons="off">
								<Tab label={<IntlMessages id="sitesetting.tab.general" />} />
								<Tab label={<IntlMessages id="sitesetting.tab.image" />} />
								<Tab label={<IntlMessages id="sitesetting.tab.local" />} />
								<Tab label={<IntlMessages id="sitesetting.tab.seo" />} />
								<Tab label={<IntlMessages id="sitesetting.tab.social" />} />
								<Tab label={<IntlMessages id="sitesetting.tab.server" />} />
								{/* Added By Jayesh 25-12-2018  */}
								<Tab label={<IntlMessages id="sitesetting.tab.chatscript" />} />
							</Tabs>
						</AppBar>

						{activeIndex === 0 &&
							<TabContainer>
								<AppBar position="static" color="default">
									<Tabs
										value={this.state.languageIndex}
										onChange={(e, value) => this.handlelanguageChange(e, value)}
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
									if (this.state.languageIndex == lang.id) {
										return (
											<TabContainer key={key}>
												{(menuDetail["62d23918-07dc-5893-0046-2702cf0f34fb"] && menuDetail["62d23918-07dc-5893-0046-2702cf0f34fb"].Visibility === "E925F86B") && //62D23918-07DC-5893-0046-2702CF0F34FB
													<FormGroup row>
														<Label><IntlMessages id="sitesetting.form.lable.sitename" /><span className="text-danger">*</span>  ({lang.code})</Label>
														<DebounceInput
															readOnly={(menuDetail["62d23918-07dc-5893-0046-2702cf0f34fb"].AccessRight === "11E6E7B0") ? true : false}
															minLength={0}
															debounceTimeout={300}
															className="form-control"
															type="text"
															name="sitename"
															id="sitename"
															maxLength={30}
															value={sitesetting && sitesetting.general && sitesetting.general.locale && sitesetting.general.locale[lang.code] && sitesetting.general.locale[lang.code].sitename || ''}
															onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, 'sitename', e.target.value, lang.code)}
														/>
														{errors && errors[lang.code] && errors[lang.code].sitename && <span className="text-danger"><IntlMessages id={errors[lang.code].sitename} /></span>}
													</FormGroup>}

												{(menuDetail["984FF25F-A1A0-736B-654F-474203038320"] && menuDetail["984FF25F-A1A0-736B-654F-474203038320"].Visibility === "E925F86B") && //984FF25F-A1A0-736B-654F-474203038320
													<FormGroup row>
														<Label><IntlMessages id="sitesetting.form.lable.copyrights" /><span className="text-danger">*</span>  ({lang.code})</Label>
														<DebounceInput
															readOnly={(menuDetail["984FF25F-A1A0-736B-654F-474203038320"].AccessRight === "11E6E7B0") ? true : false}
															minLength={0}
															debounceTimeout={300}
															className="form-control"
															type="text"
															name="copyrights"
															id="copyrights"
															value={sitesetting && sitesetting.general && sitesetting.general.locale && sitesetting.general.locale[lang.code] && sitesetting.general.locale[lang.code].copyrights || ''}
															onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, 'copyrights', e.target.value, lang.code)}
														/>
														{errors && errors[lang.code] && errors[lang.code].copyrights && <span className="text-danger"><IntlMessages id={errors[lang.code].copyrights} /></span>}
													</FormGroup>}

												{(menuDetail["65A62EE9-53DA-8522-84D8-13A102F929F8"] && menuDetail["65A62EE9-53DA-8522-84D8-13A102F929F8"].Visibility === "E925F86B") && //65A62EE9-53DA-8522-84D8-13A102F929F8
													<FormGroup row>
														<Label><IntlMessages id="sitesetting.form.lable.defaultmetatitle" /><span className="text-danger">*</span>  ({lang.code})</Label>
														<DebounceInput
															readOnly={(menuDetail["65A62EE9-53DA-8522-84D8-13A102F929F8"].AccessRight === "11E6E7B0") ? true : false}
															minLength={0}
															debounceTimeout={300}
															className="form-control"
															type="text"
															name="meta_title"
															id="meta_title"
															maxLength={60}
															value={sitesetting && sitesetting.general && sitesetting.general.locale && sitesetting.general.locale[lang.code] && sitesetting.general.locale[lang.code].meta_title || ''}
															onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "meta_title", e.target.value, lang.code)}
														/>
														{errors && errors[lang.code] && errors[lang.code].metatitle && <span className="text-danger"><IntlMessages id={errors[lang.code].metatitle} /></span>}
													</FormGroup>}

												{(menuDetail["180708A9-1260-6A1E-56F4-99EF63141575"] && menuDetail["180708A9-1260-6A1E-56F4-99EF63141575"].Visibility === "E925F86B") && //180708A9-1260-6A1E-56F4-99EF63141575
													<FormGroup row>
														<Label><IntlMessages id="sitesetting.form.lable.defaultmetakeyword" />  ({lang.code})</Label>
														<DebounceInput
															readOnly={(menuDetail["180708A9-1260-6A1E-56F4-99EF63141575"].AccessRight === "11E6E7B0") ? true : false}
															minLength={0}
															debounceTimeout={300}
															className="form-control"
															type="text"
															name="meta_keyword"
															id="meta_keyword"
															value={sitesetting && sitesetting.general && sitesetting.general.locale && sitesetting.general.locale[lang.code] && sitesetting.general.locale[lang.code].meta_keyword || ''}
															onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "meta_keyword", e.target.value, lang.code)}
														/>
														{errors && errors[lang.code] && errors[lang.code].meta_keyword && <span className="text-danger"><IntlMessages id={errors[lang.code].meta_keyword} /></span>}
													</FormGroup>}

												{(menuDetail["05DCAFF6-4BF9-43EA-02B0-3B0CFFCB0359"] && menuDetail["05DCAFF6-4BF9-43EA-02B0-3B0CFFCB0359"].Visibility === "E925F86B") && //05DCAFF6-4BF9-43EA-02B0-3B0CFFCB0359
													<FormGroup row>
														<Label for="Text"><IntlMessages id="sitesetting.form.lable.defaultmetadescription" />  ({lang.code})</Label>
														<DebounceInput
															readOnly={(menuDetail["05DCAFF6-4BF9-43EA-02B0-3B0CFFCB0359"].AccessRight === "11E6E7B0") ? true : false}
															minLength={0}
															debounceTimeout={300}
															className="form-control"
															type="textarea"
															name="meta_description"
															id="meta_description"
															maxLength={160}
															value={sitesetting && sitesetting.general && sitesetting.general.locale && sitesetting.general.locale[lang.code] && sitesetting.general.locale[lang.code].meta_description || ''}
															onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "meta_description", e.target.value, lang.code)}
														/>
														{errors && errors[lang.code] && errors[lang.code].meta_description && <span className="text-danger"><IntlMessages id={errors[lang.code].meta_description} /></span>}
													</FormGroup>}

												{(menuDetail["3814B301-3009-923E-8863-F60794DA3E78"] && menuDetail["3814B301-3009-923E-8863-F60794DA3E78"].Visibility === "E925F86B") && //3814B301-3009-923E-8863-F60794DA3E78
													<FormGroup row>
														<Label><IntlMessages id="sitesetting.form.lable.maintenance_message" />  ({lang.code})</Label>
														{/* Added By Megha Kariya (18/02/2019) */}
														<Editor
															disabled={(menuDetail["3814B301-3009-923E-8863-F60794DA3E78"].AccessRight === "11E6E7B0") ? true : false}
															init={{
																height: 500,
																plugins: 'link image code lists advlist table preview',
																toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
																statusbar: false
															}}
															value={sitesetting && sitesetting.general && sitesetting.general.locale && sitesetting.general.locale[lang.code] && sitesetting.general.locale[lang.code].maintenance_message || ''}
															onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "maintenance_message", e.target.getContent(), lang.code)}
														/>
													</FormGroup>}
											</TabContainer>
										);
									}
								})}
							</TabContainer>}

						{activeIndex === 1 &&
							<TabContainer>
								<div className="row">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
										{(menuDetail["B9FEEE20-7B3D-95C4-5695-CAD15B535194"] && menuDetail["B9FEEE20-7B3D-95C4-5695-CAD15B535194"].Visibility === "E925F86B") && //B9FEEE20-7B3D-95C4-5695-CAD15B535194
											<FormGroup row>
												<Label><IntlMessages id="sitesetting.form.lable.logo" /><span className="text-danger">*</span></Label>
												<Input
													disabled={(menuDetail["B9FEEE20-7B3D-95C4-5695-CAD15B535194"].AccessRight === "11E6E7B0") ? true : false}
													type="file" name="logo" id="Filelogo" onChange={this.handleselectedFile} />
												{errors.logo && <span className="text-danger"><IntlMessages id={errors.logo} /></span>}
											</FormGroup>}
									</div>

									<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
										<img id="logoimgPreview" src={sitesetting.image.logoPreviewUrl ? sitesetting.image.logoPreviewUrl : "http://placehold.it/180"} alt="Logo" height="100" width="100" />
									</div>
								</div>
								<div className="row pt-10">
									<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
										{(menuDetail["C8FAAAF4-A778-1A94-52C4-B3E45E78121F"] && menuDetail["C8FAAAF4-A778-1A94-52C4-B3E45E78121F"].Visibility === "E925F86B") && //C8FAAAF4-A778-1A94-52C4-B3E45E78121F
											<FormGroup row>
												<Label><IntlMessages id="sitesetting.form.lable.fevicon" /><span className="text-danger">*</span></Label>
												<Input
													disabled={(menuDetail["C8FAAAF4-A778-1A94-52C4-B3E45E78121F"].AccessRight === "11E6E7B0") ? true : false}
													type="file" name="fevicon" id="Filefevicon" onChange={this.handleselectedFile} />
												{errors.fevicon && <span className="text-danger"><IntlMessages id={errors.fevicon} /></span>}
											</FormGroup>}
									</div>
									<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
										<img id="feviconimgPreview" src={sitesetting.image.feviconPreviewUrl ? sitesetting.image.feviconPreviewUrl : "http://placehold.it/180"} alt="Fevicon" height="100" width="100" />
									</div>
								</div>
							</TabContainer>}

						{activeIndex === 2 && <TabContainer>
							{(menuDetail["A2CA4AE8-979C-6EF2-03CB-95926BD929ED"] && menuDetail["A2CA4AE8-979C-6EF2-03CB-95926BD929ED"].Visibility === "E925F86B") && //A2CA4AE8-979C-6EF2-03CB-95926BD929ED
								<FormGroup row>
									<Label for="Text"><IntlMessages id="sitesetting.form.lable.streetaddress" /></Label>
									<DebounceInput
										readOnly={(menuDetail["A2CA4AE8-979C-6EF2-03CB-95926BD929ED"].AccessRight === "11E6E7B0") ? true : false}
										minLength={0}
										debounceTimeout={300}
										className="form-control"
										type="textarea"
										name="streetaddress"
										id="streetaddress"
										value={sitesetting.local.streetaddress}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "streetaddress", e.target.value)}
									/>
								</FormGroup>}

							{(menuDetail["5C961A61-6373-329B-5E47-8386E16F9831"] && menuDetail["5C961A61-6373-329B-5E47-8386E16F9831"].Visibility === "E925F86B") && //5C961A61-6373-329B-5E47-8386E16F9831
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.city" /></Label>
									<DebounceInput
										readOnly={(menuDetail["5C961A61-6373-329B-5E47-8386E16F9831"].AccessRight === "11E6E7B0") ? true : false}
										minLength={0}
										debounceTimeout={300}
										className="form-control"
										type="text"
										name="city"
										id="city"
										value={sitesetting.local.city}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "city", e.target.value)}
									/>
								</FormGroup>}

							{(menuDetail["4BE21ABF-8FF3-993D-4AA0-E27A0D6A12C8"] && menuDetail["4BE21ABF-8FF3-993D-4AA0-E27A0D6A12C8"].Visibility === "E925F86B") && //4BE21ABF-8FF3-993D-4AA0-E27A0D6A12C8
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.postalcode" /></Label>
									<DebounceInput
										readOnly={(menuDetail["4BE21ABF-8FF3-993D-4AA0-E27A0D6A12C8"].AccessRight === "11E6E7B0") ? true : false}
										minLength={0}
										debounceTimeout={300}
										className="form-control"
										type="text"
										name="postalcode"
										id="postalcode"
										value={sitesetting && sitesetting.local && sitesetting.local.postalcode}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "postalcode", e.target.value)}
									/>
									{errors.postalcode && <span className="text-danger"><IntlMessages id={errors.postalcode} /></span>}
								</FormGroup>}

							{(menuDetail["0A12127E-A0D5-0CEF-2C8F-C57E2FB606E3"] && menuDetail["0A12127E-A0D5-0CEF-2C8F-C57E2FB606E3"].Visibility === "E925F86B") && //0A12127E-A0D5-0CEF-2C8F-C57E2FB606E3
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.country" /></Label>
									<Input
										disabled={(menuDetail["0A12127E-A0D5-0CEF-2C8F-C57E2FB606E3"].AccessRight === "11E6E7B0") ? true : false}
										type="select" name="country" id="country"
										value={sitesetting && sitesetting.local && sitesetting.local.country}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "country", e.target.value)}
									>
										<IntlMessages id="sidebar.selCountry">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
										{countries && countries.map((country, key) => <option value={country.countryId} key={key}>{country.locale && country.locale.en}</option>)}
									</Input>
								</FormGroup>}

							{(menuDetail["401B0998-57A0-520D-37C8-ECC9E77335D2"] && menuDetail["401B0998-57A0-520D-37C8-ECC9E77335D2"].Visibility === "E925F86B") && //401B0998-57A0-520D-37C8-ECC9E77335D2
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.state" /></Label>
									<Input
										disabled={(menuDetail["401B0998-57A0-520D-37C8-ECC9E77335D2"].AccessRight === "11E6E7B0") ? true : false}
										type="select" name="state" id="state" value={sitesetting && sitesetting.local && sitesetting.local.state} onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "state", e.target.value)}>
										<IntlMessages id="sidebar.selState">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
										{stateAll && stateAll.map((list, index) => (
											<option key={index} value={list.stateId}>{list.locale && list.locale.en}</option>
										))}
									</Input>
								</FormGroup>}

							{(menuDetail["83617A3F-665F-5444-358D-CF7C6DAD130D"] && menuDetail["83617A3F-665F-5444-358D-CF7C6DAD130D"].Visibility === "E925F86B") && //83617A3F-665F-5444-358D-CF7C6DAD130D
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.phoneno" /><span className="text-danger">*</span></Label>
									<DebounceInput
										readOnly={(menuDetail["83617A3F-665F-5444-358D-CF7C6DAD130D"].AccessRight === "11E6E7B0") ? true : false}
										minLength={0}
										debounceTimeout={300}
										className="form-control"
										type="text"
										name="phoneno"
										id="phoneno"
										value={sitesetting && sitesetting.local && sitesetting.local.phoneno}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "phoneno", e.target.value)}
									/>
									{errors.phoneno && <span className="text-danger"><IntlMessages id={errors.phoneno} /></span>}
								</FormGroup>}

							{(menuDetail["5FF74363-593B-68DC-1DF7-E09AD92758B2"] && menuDetail["5FF74363-593B-68DC-1DF7-E09AD92758B2"].Visibility === "E925F86B") && //5FF74363-593B-68DC-1DF7-E09AD92758B2
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.emailaddress" /><span className="text-danger">*</span></Label>
									<DebounceInput
										readOnly={(menuDetail["5FF74363-593B-68DC-1DF7-E09AD92758B2"].AccessRight === "11E6E7B0") ? true : false}
										minLength={0}
										debounceTimeout={300}
										className="form-control"
										type="text"
										name="emailaddress"
										id="emailaddress"
										value={sitesetting && sitesetting.local && sitesetting.local.emailaddress}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "emailaddress", e.target.value)}
									/>
									{errors.emailaddress && <span className="text-danger"><IntlMessages id={errors.emailaddress} /></span>}
								</FormGroup>}

							{(menuDetail["03168A21-70C0-5D55-1939-A2D234BC1C8D"] && menuDetail["03168A21-70C0-5D55-1939-A2D234BC1C8D"].Visibility === "E925F86B") && //03168A21-70C0-5D55-1939-A2D234BC1C8D
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.language" /></Label>
									<Input
										disabled={(menuDetail["03168A21-70C0-5D55-1939-A2D234BC1C8D"].AccessRight === "11E6E7B0") ? true : false}
										type="select" name="language" id="language"
										value={sitesetting && sitesetting.local && sitesetting.local.language}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "language", e.target.value)}
									>
										<option value="">Select Language</option>
										{language.map((value, key) => <option value={value.id} key={key}>{value.language_name}</option>)}
									</Input>
								</FormGroup>}
						</TabContainer>}

						{activeIndex === 3 && <TabContainer>
							{(menuDetail["291EDB07-5427-1C14-0D7A-AE0AFCA784E1"] && menuDetail["291EDB07-5427-1C14-0D7A-AE0AFCA784E1"].Visibility === "E925F86B") && //291EDB07-5427-1C14-0D7A-AE0AFCA784E1
								<FormGroup row>
									<Label for="Text"><IntlMessages id="sitesetting.form.lable.googleanalytics_url" /></Label>
									<DebounceInput
										readOnly={(menuDetail["291EDB07-5427-1C14-0D7A-AE0AFCA784E1"].AccessRight === "11E6E7B0") ? true : false}
										minLength={0}
										debounceTimeout={300}
										className="form-control"
										type="text"
										name="googleanalytics_url"
										id="googleanalytics_url"
										value={sitesetting && sitesetting.seo && sitesetting.seo.googleanalytics_url || ''}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "googleanalytics_url", e.target.value)}
									/>
								</FormGroup>}

							{(menuDetail["F2694BEA-A5DB-54FD-7887-0361EB5188CE"] && menuDetail["F2694BEA-A5DB-54FD-7887-0361EB5188CE"].Visibility === "E925F86B") && //F2694BEA-A5DB-54FD-7887-0361EB5188CE
								<FormGroup row>
									<Label for="Text"><IntlMessages id="sitesetting.form.lable.googleanalytics" /></Label>
									<DebounceInput
										readOnly={(menuDetail["F2694BEA-A5DB-54FD-7887-0361EB5188CE"].AccessRight === "11E6E7B0") ? true : false}
										minLength={0}
										debounceTimeout={300}
										className="form-control"
										type="textarea"
										name="googleanalytics"
										id="googleanalytics"
										value={sitesetting && sitesetting.seo && sitesetting.seo.googleanalytics || ''}
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "googleanalytics", e.target.value)}
									/>
								</FormGroup>}
						</TabContainer>}

						{activeIndex === 4 && <TabContainer>
							{(menuDetail["E82AEA50-3831-52D5-8BCF-8A20066994D7"] && menuDetail["E82AEA50-3831-52D5-8BCF-8A20066994D7"].Visibility === "E925F86B") && //E82AEA50-3831-52D5-8BCF-8A20066994D7
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-facebook text-white">
												<i className="zmdi zmdi-facebook"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.facebbook" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["E82AEA50-3831-52D5-8BCF-8A20066994D7"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="facebooklink" id="facebooklink"
											value={sitesetting && sitesetting.seo && sitesetting.social.facebooklink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "facebooklink", e.target.value)}
										/>
										{errors.facebooklink && <span className="text-danger"><IntlMessages id={errors.facebooklink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["D3717B3B-7116-1F89-4BC5-C98F01235E53"] && menuDetail["D3717B3B-7116-1F89-4BC5-C98F01235E53"].Visibility === "E925F86B") && //D3717B3B-7116-1F89-4BC5-C98F01235E53
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-twitter text-white">
												<i className="zmdi zmdi-twitter"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.twitter" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["D3717B3B-7116-1F89-4BC5-C98F01235E53"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="twitterlink" id="twitterlink"
											value={sitesetting && sitesetting.seo && sitesetting.social.twitterlink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "twitterlink", e.target.value)}
										/>
										{errors.twitterlink && <span className="text-danger"><IntlMessages id={errors.twitterlink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["8EFA48A7-45F2-0C80-24F0-A9A903791D3E"] && menuDetail["8EFA48A7-45F2-0C80-24F0-A9A903791D3E"].Visibility === "E925F86B") && //8EFA48A7-45F2-0C80-24F0-A9A903791D3E
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-linkedin text-white">
												<i className="zmdi zmdi-linkedin"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.linkedin" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["8EFA48A7-45F2-0C80-24F0-A9A903791D3E"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="linkedinlink" id="linkedinlink"
											value={sitesetting && sitesetting.seo && sitesetting.social.linkedinlink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "linkedinlink", e.target.value)}
										/>
										{errors.linkedinlink && <span className="text-danger"><IntlMessages id={errors.linkedinlink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["1A0846F8-7058-63C1-0B95-3FD8271E4444"] && menuDetail["1A0846F8-7058-63C1-0B95-3FD8271E4444"].Visibility === "E925F86B") && //1A0846F8-7058-63C1-0B95-3FD8271E4444
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-google text-white">
												<i className="zmdi zmdi-google"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.googleplus" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["1A0846F8-7058-63C1-0B95-3FD8271E4444"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="googlepluslink" id="googlepluslink"
											value={sitesetting && sitesetting.seo && sitesetting.social.googlepluslink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "googlepluslink", e.target.value)}
										/>
										{errors.googlepluslink && <span className="text-danger"><IntlMessages id={errors.googlepluslink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["39F7F1AB-9D93-13DD-6B7F-9B4CFBB15ACF"] && menuDetail["39F7F1AB-9D93-13DD-6B7F-9B4CFBB15ACF"].Visibility === "E925F86B") && //39F7F1AB-9D93-13DD-6B7F-9B4CFBB15ACF
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-skype text-white">
												<i className="zmdi zmdi-skype"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.skype" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["39F7F1AB-9D93-13DD-6B7F-9B4CFBB15ACF"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="skypelink" id="skypelink"
											value={sitesetting && sitesetting.seo && sitesetting.social.skypelink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "skypelink", e.target.value)}
										/>
										{errors.skypelink && <span className="text-danger"><IntlMessages id={errors.skypelink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["23B8833A-A0E0-51DF-6E99-2AC438A3896A"] && menuDetail["23B8833A-A0E0-51DF-6E99-2AC438A3896A"].Visibility === "E925F86B") && //23B8833A-A0E0-51DF-6E99-2AC438A3896A
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-youtube text-white">
												<i className="zmdi zmdi-youtube"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.youtube" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["23B8833A-A0E0-51DF-6E99-2AC438A3896A"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="youtubelink" id="youtubelink"
											value={sitesetting && sitesetting.seo && sitesetting.social.youtubelink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "youtubelink", e.target.value)}
										/>
										{errors.youtubelink && <span className="text-danger"><IntlMessages id={errors.youtubelink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["6E4C3467-198A-71E7-215A-75CF2E5617FE"] && menuDetail["6E4C3467-198A-71E7-215A-75CF2E5617FE"].Visibility === "E925F86B") && //6E4C3467-198A-71E7-215A-75CF2E5617FE
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-pinterest text-white">
												<i className="zmdi zmdi-pinterest"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.pinterest" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["6E4C3467-198A-71E7-215A-75CF2E5617FE"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="pinetrestlink" id="pinetrestlink"
											value={sitesetting && sitesetting.seo && sitesetting.social.pinetrestlink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "pinetrestlink", e.target.value)}
										/>
										{errors.pinetrestlink && <span className="text-danger"><IntlMessages id={errors.pinetrestlink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["9669CC18-89F6-737A-3F40-47C4B48494A9"] && menuDetail["9669CC18-89F6-737A-3F40-47C4B48494A9"].Visibility === "E925F86B") && //9669CC18-89F6-737A-3F40-47C4B48494A9
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn-instagram text-white">
												<i className="zmdi zmdi-instagram"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.instagram" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["9669CC18-89F6-737A-3F40-47C4B48494A9"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="instagramlink" id="instagramlink"
											value={sitesetting && sitesetting.seo && sitesetting.social.instagramlink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "instagramlink", e.target.value)}
										/>
										{errors.instagramlink && <span className="text-danger"><IntlMessages id={errors.instagramlink} /></span>}
									</div>
								</FormGroup>}

							{(menuDetail["F835EE50-5788-9DE6-72C9-8AEA32021E1B"] && menuDetail["F835EE50-5788-9DE6-72C9-8AEA32021E1B"].Visibility === "E925F86B") && //F835EE50-5788-9DE6-72C9-8AEA32021E1B
								<FormGroup row>
									<div className="col-md-3">
										<Label className="mb-0">
											<MatButton variant="fab" mini className="btn btn-success text-white">
												<i className="zmdi zmdi-whatsapp"></i>
											</MatButton>
											<em className="pl-30"><IntlMessages id="sitesetting.form.lable.whatsapp" /></em>
										</Label>
									</div>
									<div className="col-md-9">
										<DebounceInput
											readOnly={(menuDetail["F835EE50-5788-9DE6-72C9-8AEA32021E1B"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300} className="form-control col-md-9" type="text" name="whatsapplink" id="whatsapplink"
											value={sitesetting && sitesetting.seo && sitesetting.social.whatsapplink || ''}
											onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "whatsapplink", e.target.value)}
										/>
										{errors.whatsapplink && <span className="text-danger"><IntlMessages id={errors.whatsapplink} /></span>}
									</div>
								</FormGroup>}
						</TabContainer>}

						{activeIndex === 5 && <TabContainer>
							{(menuDetail["E5C76EAA-93BF-681E-69E4-EF0D552715B1"] && menuDetail["E5C76EAA-93BF-681E-69E4-EF0D552715B1"].Visibility === "E925F86B") && //E5C76EAA-93BF-681E-69E4-EF0D552715B1
								<FormGroup row>
									<Label><IntlMessages id="sitesetting.form.lable.maintenancemode" /></Label>
									<Input
										disabled={(menuDetail["E5C76EAA-93BF-681E-69E4-EF0D552715B1"].AccessRight === "11E6E7B0") ? true : false}
										type="select" name="maintenance_mode" id="maintenance_mode"
										onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "maintenance_mode", e.target.value)}
										value={sitesetting && sitesetting.server && sitesetting.server.maintenance_mode}>
										<option value="0">Disable</option>
										<option value="1">Enable</option>
									</Input>
								</FormGroup>}
						</TabContainer>}

						{activeIndex === 6 && <TabContainer>
							{/* Added by Jayesh for Chat API on 26-12-2018 */}
							<div className="activity-board-wrapper">
								<div className="comment-box mb-4 p-20">
									<div className="alert alert-info">
										<strong>Notes :</strong> <strong>Zendesk API :</strong> Enter URL instead of script.  <strong>Zoho API :</strong> Remove d.write() line at the end of the script.
									</div>
									<div>
										<div className="row">
											<div className="col-sm-3 col-3 col-md-3 d-inline-block">
												<Label className="">
													<IntlMessages id="sitesetting.form.lable.api" />
												</Label>
											</div>
											<div className="col-sm-6 col-6 col-md-6 d-inline-block">
												<Label className="">
													<IntlMessages id="sitesetting.form.lable.script" />
												</Label>
											</div>
											<div className="col-sm-3 col-3 col-md-3 d-inline-block">
												<Label className="text-center d-block">
													<IntlMessages id="sitesetting.form.lable.active" />
												</Label>
											</div>
										</div>
									</div>

									{(menuDetail["D21625BF-8236-0181-7E0D-AF7D8FB68298"] && menuDetail["D21625BF-8236-0181-7E0D-AF7D8FB68298"].Visibility === "E925F86B") && //D21625BF-8236-0181-7E0D-AF7D8FB68298
										<div>
											<div className="row">
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
													<Label className="mb-0">
														<em className=""><IntlMessages id="sitesetting.form.lable.tawk" /></em>
													</Label>
												</FormGroup>
												<FormGroup className="col-sm-6 col-6 col-md-6 d-inline-block">
													<DebounceInput
														readOnly={(menuDetail["D21625BF-8236-0181-7E0D-AF7D8FB68298"].AccessRight === "11E6E7B0") ? true : false}
														minLength={0}
														debounceTimeout={300}
														className="form-control"
														type="textarea"
														name="tawk"
														id="tawk"
														value={sitesetting && sitesetting.chatscript && sitesetting.chatscript.tawk || ''}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "tawk", e.target.value)}
													/>
												</FormGroup>
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block text-center">
													<Input
														disabled={(menuDetail["D21625BF-8236-0181-7E0D-AF7D8FB68298"].AccessRight === "11E6E7B0") ? true : false}
														className="ml-0"
														type="radio"
														name="isActive"
														value={this.state.sitesetting.chatscript.tawk_active}
														checked={this.state.sitesetting.chatscript.tawk_active == 1}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "tawk_active", e.target.value, '', 1)}

													/>
												</FormGroup>
											</div>
										</div>}

									{(menuDetail["A450736A-612C-583B-A64D-9BC23864778A"] && menuDetail["A450736A-612C-583B-A64D-9BC23864778A"].Visibility === "E925F86B") && //A450736A-612C-583B-A64D-9BC23864778A
										<div>
											<div className="row">
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
													<Label className="mb-0">
														<em className=""><IntlMessages id="sitesetting.form.lable.zendesk" /></em>
													</Label>
												</FormGroup>
												<FormGroup className="col-sm-6 col-6 col-md-6 d-inline-block">
													<DebounceInput
														minLength={0}
														debounceTimeout={300}
														className="form-control"
														readOnly={(menuDetail["A450736A-612C-583B-A64D-9BC23864778A"].AccessRight === "11E6E7B0") ? true : false}
														type="textarea"
														name="zendesk"
														id="zendesk"
														value={sitesetting && sitesetting.chatscript && sitesetting.chatscript.zendesk || ''}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "zendesk", e.target.value)}
													/>
												</FormGroup>
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block text-center">
													<Input
														disabled={(menuDetail["A450736A-612C-583B-A64D-9BC23864778A"].AccessRight === "11E6E7B0") ? true : false}
														className="ml-0"
														type="radio"
														name="isActive"
														value={this.state.sitesetting.chatscript.zendesk_active}
														checked={this.state.sitesetting.chatscript.zendesk_active == 1}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "zendesk_active", e.target.value, '', 1)}
													/>
												</FormGroup>
											</div>
										</div>}

									{(menuDetail["F32A0025-9A9B-7BA7-53BB-B6DFE4359B90"] && menuDetail["F32A0025-9A9B-7BA7-53BB-B6DFE4359B90"].Visibility === "E925F86B") && //F32A0025-9A9B-7BA7-53BB-B6DFE4359B90
										<div>
											<div className="row">
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
													<Label className="mb-0">
														<em className=""><IntlMessages id="sitesetting.form.lable.zoho" /></em>
													</Label>
												</FormGroup>
												<FormGroup className="col-sm-6 col-6 col-md-6 d-inline-block">
													<DebounceInput
														minLength={0}
														debounceTimeout={300}
														className="form-control"
														readOnly={(menuDetail["F32A0025-9A9B-7BA7-53BB-B6DFE4359B90"].AccessRight === "11E6E7B0") ? true : false}
														type="textarea"
														name="zoho"
														id="zoho"
														value={sitesetting && sitesetting.chatscript && sitesetting.chatscript.zoho || ''}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "zoho", e.target.value)}
													/>
												</FormGroup>
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block text-center">
													<Input
														disabled={(menuDetail["F32A0025-9A9B-7BA7-53BB-B6DFE4359B90"].AccessRight === "11E6E7B0") ? true : false}
														className="ml-0"
														type="radio"
														name="isActive"
														value={this.state.sitesetting.chatscript.zoho_active}
														checked={this.state.sitesetting.chatscript.zoho_active == 1}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "zoho_active", e.target.value, '', 1)}
													/>
												</FormGroup>
											</div>
										</div>}

									{(menuDetail["EDCA3B52-54C5-23AB-8AFB-4F99CB6B78FE"] && menuDetail["EDCA3B52-54C5-23AB-8AFB-4F99CB6B78FE"].Visibility === "E925F86B") && //EDCA3B52-54C5-23AB-8AFB-4F99CB6B78FE
										<div>
											<div className="row">
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
													<Label className="mb-0">
														<em className=""><IntlMessages id="sitesetting.form.lable.livechatinc" /></em>
													</Label>
												</FormGroup>
												<FormGroup className="col-sm-6 col-6 col-md-6 d-inline-block">
													<DebounceInput
														minLength={0}
														debounceTimeout={300}
														className="form-control"
														readOnly={(menuDetail["EDCA3B52-54C5-23AB-8AFB-4F99CB6B78FE"].AccessRight === "11E6E7B0") ? true : false}
														type="textarea"
														name="livechatinc"
														id="livechatinc"
														value={sitesetting && sitesetting.chatscript && sitesetting.chatscript.livechatinc || ''}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "livechatinc", e.target.value)}
													/>
												</FormGroup>
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block text-center">
													<Input
														disabled={(menuDetail["EDCA3B52-54C5-23AB-8AFB-4F99CB6B78FE"].AccessRight === "11E6E7B0") ? true : false}
														className="ml-0"
														type="radio"
														name="isActive"
														value={this.state.sitesetting.chatscript.livechatinc_active}
														checked={this.state.sitesetting.chatscript.livechatinc_active == 1}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "livechatinc_active", e.target.value, '', 1)}
													/>
												</FormGroup>
											</div>
										</div>}

									{(menuDetail["E56E1280-0DC1-2225-3E23-731412292110"] && menuDetail["E56E1280-0DC1-2225-3E23-731412292110"].Visibility === "E925F86B") && //E56E1280-0DC1-2225-3E23-731412292110
										<div>
											<div className="row">
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
													<Label className="mb-0">
														<em className=""><IntlMessages id="sitesetting.form.lable.livehelpnow" /></em>
													</Label>
												</FormGroup>
												<FormGroup className="col-sm-6 col-6 col-md-6 d-inline-block">
													<DebounceInput
														minLength={0}
														debounceTimeout={300}
														className="form-control"
														readOnly={(menuDetail["E56E1280-0DC1-2225-3E23-731412292110"].AccessRight === "11E6E7B0") ? true : false}
														type="textarea"
														name="livehelpnow"
														id="livehelpnow"
														value={sitesetting && sitesetting.chatscript && sitesetting.chatscript.livehelpnow || ''}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "livehelpnow", e.target.value)}
													/>
												</FormGroup>
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block text-center">
													<Input
														disabled={(menuDetail["E56E1280-0DC1-2225-3E23-731412292110"].AccessRight === "11E6E7B0") ? true : false}
														className="ml-0"
														type="radio"
														name="isActive"
														value={this.state.sitesetting.chatscript.livehelpnow_active}
														checked={this.state.sitesetting.chatscript.livehelpnow_active == 1}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "livehelpnow_active", e.target.value, '', 1)}
													/>
												</FormGroup>
											</div>
										</div>}

									{(menuDetail["36E18F27-7902-3752-42DB-4659B9F64223"] && menuDetail["36E18F27-7902-3752-42DB-4659B9F64223"].Visibility === "E925F86B") && //36E18F27-7902-3752-42DB-4659B9F64223
										<div>
											<div className="row">
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block">
													<Label className="mb-0">
														<em className=""><IntlMessages id="sitesetting.form.lable.smartsupp" /></em>
													</Label>
												</FormGroup>
												<FormGroup className="col-sm-6 col-6 col-md-6 d-inline-block">
													<DebounceInput
														minLength={0}
														debounceTimeout={300}
														className="form-control"
														readOnly={(menuDetail["36E18F27-7902-3752-42DB-4659B9F64223"].AccessRight === "11E6E7B0") ? true : false}
														type="textarea"
														name="smartsupp"
														id="smartsupp"
														value={sitesetting && sitesetting.chatscript && sitesetting.chatscript.smartsupp || ''}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "smartsupp", e.target.value)}
													/>
												</FormGroup>
												<FormGroup className="col-sm-3 col-3 col-md-3 d-inline-block text-center">
													<Input
														disabled={(menuDetail["36E18F27-7902-3752-42DB-4659B9F64223"].AccessRight === "11E6E7B0") ? true : false}
														className="ml-0"
														type="radio"
														name="isActive"
														value={this.state.sitesetting.chatscript.smartsupp_active}
														checked={this.state.sitesetting.chatscript.smartsupp_active == 1}
														onChange={(e) => this.onChangeAddNewPageDetails(activeIndex, "smartsupp_active", e.target.value, '', 1)}
													/>
												</FormGroup>
											</div>
										</div>}
								</div>
							</div>
						</TabContainer>}

						{Object.keys(menuDetail).length > 0 &&
							<FormGroup>
								<Button
									className="text-white text-bold btn mr-10 pull-left"
									variant="raised"
									color="primary"
									onClick={(e) => this.handleSubmit(e)}
									disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
								>
									<IntlMessages id="sidebar.btnSubmit" />
								</Button>
								<Button
									className="text-white text-bold btn-danger mr-10 pull-left"
									variant="raised"
									onClick={(e) => this.handleCancel()}
									disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
								>
									<IntlMessages id="sidebar.btnCancel" />
								</Button>
							</FormGroup>}
					</Form>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ languages, sitesetting, country, state, authTokenRdcer }) => {
	var response = {
		data: sitesetting.data,
		loading: sitesetting.loading,
		language: languages.language,
		sitesetting: sitesetting.SiteSettingInfo,
		SiteSettingInfosuccess: sitesetting.SiteSettingInfosuccess,
		updatestatus: sitesetting.updatestatus,
		localebit: languages.localebit,
		countries: country.country_list.data,
		countrystateData: state.country_state_list,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof sitesetting.localebit != 'undefined' && sitesetting.localebit != '') {
		response['localebit'] = sitesetting.localebit;
	}
	return response;
}

export default connect(mapStateToProps, {
	getSiteSettingInfo, getLanguage, postSiteSettingInfo, getCountry, getStateByCountryId, getMenuPermissionByID
})(SiteSetting);