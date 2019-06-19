/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : Edit Region Form
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
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';
import 'rc-drawer/assets/index.css';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getRegionById, updateRegion } from 'Actions/Regions';
import { getLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { Editor } from "@tinymce/tinymce-react"; // Added By Megha Kariya (18/02/2019)
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
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.regions" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="region.title.edit-Region" />,
		link: '',
		index: 0
	}
];
//Validation for Region Form
const validateRegionformInput = require('../../../validation/Regions/regions');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 2 * 3 }}>
			{children}
		</Typography>
	);
}

class EditRegion extends Component {

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
			regiondetail: {
				regionname: "",
				locale: {
					en: {
						content: "",
					}
				},
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
		this.onUpdateRegionDetail = this.onUpdateRegionDetail.bind(this);
		this.updateRegionDetail = this.updateRegionDetail.bind(this);
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

	//On Update Region Details
	onUpdateRegionDetail(key, value, lang = '') {
		if (typeof lang != 'undefined' && lang != '') {
			let statusCopy = Object.assign({}, this.state.regiondetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				regiondetail: {
					...this.state.regiondetail,
					[key]: value
				}
			});
		}
	}

	//Update Region Detail
	updateRegionDetail() {
		const { locale, status, regionname } = this.state.regiondetail;
		const { errors, isValid } = validateRegionformInput(this.state.regiondetail);
		this.setState({ errors: errors, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : add btn_disabled
		if (!isValid) {
			let data = {
				id: this.state.regiondetail._id,
				regionname,
				locale,
				status
			}
			setTimeout(() => {
				this.props.updateRegion(data);
			}, 2000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('4C768434-4849-3940-9FFB-2B04892D37AA');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				let RegionId = this.props.regiondata._id;
				if (RegionId != '') {
					this.props.getLanguage();
					this.props.getRegionById(RegionId);
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
						content: "",
					};
				})
			}
			this.state.regiondetail.locale = locale;
			this.setState({
				regiondetail: this.state.regiondetail
			});
		}

		if (typeof nextProps.regiondata != 'undefined' && typeof nextProps.regiondata.locale != 'undefined' && nextProps.regiondata != '') {
			const newlocale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {
					newlocale[lang.code] = {
						content: nextProps.regiondata.locale[lang.code] && nextProps.regiondata.locale[lang.code].content ? nextProps.regiondata.locale[lang.code].content : '',
					};
				})
			}

			this.state.regiondetail.locale = newlocale;
			this.state.regiondetail._id = nextProps.regiondata._id;
			this.state.regiondetail.regionname = nextProps.regiondata.regionname;
			this.state.regiondetail.status = nextProps.regiondata.status + "";// Change by Khushbu Badheka D:29/01/2019
			this.setState({
				regiondetail: this.state.regiondetail
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
		var menudetail = this.checkAndGetMenuAccessDetail('120746ED-4C4B-3BE1-871D-40614F03112E');
		const { err_alert, err_msg, activeIndex, language, errors, regiondetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		const { drawerClose } = this.props;

		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="region.title.edit-Region" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
									{(menudetail["A86B08BF-4B88-067D-01AF-6D90C0AB2295"] && menudetail["A86B08BF-4B88-067D-01AF-6D90C0AB2295"].Visibility === "E925F86B") && //A86B08BF-4B88-067D-01AF-6D90C0AB2295
										<FormGroup>
											<Label><IntlMessages id="region.regionform.label.regionname" /><span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["A86B08BF-4B88-067D-01AF-6D90C0AB2295"].AccessRight === "11E6E7B0") ? true : false}
												minLength={0}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="regionname"
												id="regionname"
												maxLength={30}
												value={regiondetail.regionname}
												onChange={(e) => this.onUpdateRegionDetail('regionname', e.target.value)}
											/>
											{errors.regionname && <span className="text-danger"><IntlMessages id={errors.regionname} /></span>}
										</FormGroup>}

									{(menudetail["1EA600B8-99B7-8078-32CD-749877123B0B"] && menudetail["1EA600B8-99B7-8078-32CD-749877123B0B"].Visibility === "E925F86B") && //1EA600B8-99B7-8078-32CD-749877123B0B
										<FormGroup>
											<Label><IntlMessages id="region.regionform.label.regionname" />  ({lang.code})<span className="text-danger">*</span></Label>
											<Editor
												disabled={(menudetail["1EA600B8-99B7-8078-32CD-749877123B0B"].AccessRight === "11E6E7B0") ? true : false}
												init={{
													height: 500,
													plugins: 'link image code lists advlist table preview',
													toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
													statusbar: false
												}}
												value={regiondetail && regiondetail.locale && regiondetail.locale[lang.code] && regiondetail.locale[lang.code].content}
												onChange={(e) => this.onUpdateRegionDetail("content", e.target.getContent(), lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
										</FormGroup>}

									{(menudetail["5D344047-8351-8E09-3614-416C8403570F"] && menudetail["5D344047-8351-8E09-3614-416C8403570F"].Visibility === "E925F86B") && //5D344047-8351-8E09-3614-416C8403570F
										<FormGroup>
											<Label><IntlMessages id="cmspage.pageform.label.status" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["5D344047-8351-8E09-3614-416C8403570F"].AccessRight === "11E6E7B0") ? true : false}
												type="select" name="status" id="status" onChange={(e) => this.onUpdateRegionDetail('status', e.target.value)} value={regiondetail.status}>>
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
												onClick={() => this.updateRegionDetail()}
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

const mapStateToProps = ({ languages, regions, authTokenRdcer }) => {
	var response = {
		data: regions.data,
		loading: regions.loading,
		language: languages.language,
		regiondetail: regions.regiondetail,
		updatestatus: regions.updatestatus,
		localebit: languages.localebit,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof regions.localebit != 'undefined' && regions.localebit != '') {
		response['localebit'] = regions.localebit;
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	updateRegion,
	getRegionById,
	getLanguage,
	getMenuPermissionByID,
})(EditRegion));