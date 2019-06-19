/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : CMS Add Region Form
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import $ from 'jquery';
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import JoditEditor from "Components/Joditeditor";
import 'jodit/build/jodit.min.css';
import 'jodit';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import CRUD Operation For Region Actions...
import { addNewRegion } from 'Actions/Regions';
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
		title: <IntlMessages id="region.button.add-Region" />,
		link: '',
		index: 0
	}
];

//Validation for Region Form
const validateRegionformInput = require('../../../validation/Regions/regions');

function TabContainer({ children }) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{children}
		</Typography>
	);
}

class AddRegion extends Component {

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
			addNewRegionDetail: {
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
			btn_disabled: false,
			addNewRegionDetail: {
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
			} // Adde by Khushbu Badheka D:29/01/2019
		};
		this.onChangeAddNewRegionDetails = this.onChangeAddNewRegionDetails.bind(this);
		this.addRegionDetail = this.addRegionDetail.bind(this);
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

	//On Change Add New Region Details
	onChangeAddNewRegionDetails(key, value, lang = '') {
		if (typeof lang != 'undefined' && lang != '') {
			let statusCopy = Object.assign({}, this.state.addNewRegionDetail);
			statusCopy.locale[lang][key] = value;
			this.setState(statusCopy);
		}
		else {
			this.setState({
				addNewRegionDetail: {
					...this.state.addNewRegionDetail,
					[key]: value
				}
			});
		}
	}

	//Add Region Detail
	addRegionDetail() {
		const { locale, status, regionname } = this.state.addNewRegionDetail;
		const { errors, isValid } = validateRegionformInput(this.state.addNewRegionDetail);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		//let isValid=false;
		if (!isValid) {
			let data = {
				regionname,
				locale,
				status
			}
			setTimeout(() => {
				let res = this.props.addNewRegion(data);
				this.setState({ loading: true });
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
				this.props.getLanguage();
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

		if (typeof nextProps.localebit != 'undefined' && nextProps.localebit != '' && nextProps.localebit == 1) {
			const locale = {};
			{
				nextProps.language && nextProps.language.map((lang, key) => {

					locale[lang.code] = {
						content: "",
					};
				})
			}
			this.state.addNewRegionDetail.locale = locale;
			this.setState({
				addNewRegionDetail: this.state.addNewRegionDetail
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
		var menudetail = this.checkAndGetMenuAccessDetail('64909BEF-455F-4935-6634-E77A38D76AE0');
		const { err_alert, activeIndex, language, errors, addNewRegionDetail, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		const { drawerClose } = this.props;

		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="region.button.add-Region" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
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
									{(menudetail["54C07160-5A9E-2A72-2920-C6C6B6683BE7"] && menudetail["54C07160-5A9E-2A72-2920-C6C6B6683BE7"].Visibility === "E925F86B") && //54C07160-5A9E-2A72-2920-C6C6B6683BE7
										<FormGroup>
											<Label><IntlMessages id="region.regionform.label.regionname" /><span className="text-danger">*</span></Label>
											<DebounceInput
												readOnly={(menudetail["54C07160-5A9E-2A72-2920-C6C6B6683BE7"].AccessRight === "11E6E7B0") ? true : false}
												debounceTimeout={300}
												className="form-control"
												type="text"
												name="regionname"
												id="regionname"
												maxLength={30}
												value={addNewRegionDetail.regionname}
												onChange={(e) => this.onChangeAddNewRegionDetails('regionname', e.target.value)}
											/>
											{errors.regionname && <span className="text-danger"><IntlMessages id={errors.regionname} /></span>}
										</FormGroup>}

									{(menudetail["52870BF7-22C8-0D99-01F0-0FB9D3055391"] && menudetail["52870BF7-22C8-0D99-01F0-0FB9D3055391"].Visibility === "E925F86B") && //52870BF7-22C8-0D99-01F0-0FB9D3055391
										<FormGroup>
											<Label><IntlMessages id="region.regionform.label.regioncontent" />  ({lang.code})<span className="text-danger">*</span></Label>
											{/* Added By Megha Kariya (18/02/2019) */}
											<Editor
												disabled={(menudetail["52870BF7-22C8-0D99-01F0-0FB9D3055391"].AccessRight === "11E6E7B0") ? true : false}
												init={{
													height: 500,
													plugins: 'link image code lists advlist table preview',
													toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
													statusbar: false
												}}
												value={addNewRegionDetail.locale[lang.code].content}
												onChange={(e) => this.onChangeAddNewRegionDetails("content", e.target.getContent(), lang.code)}
											/>
											{errors && errors[lang.code] && errors[lang.code].content && <span className="text-danger"><IntlMessages id={errors[lang.code].content} /></span>}
										</FormGroup>}

									{(menudetail["7A0FC5D4-0A59-2C02-A485-E43AA9E358EC"] && menudetail["7A0FC5D4-0A59-2C02-A485-E43AA9E358EC"].Visibility === "E925F86B") && //7A0FC5D4-0A59-2C02-A485-E43AA9E358EC
										<FormGroup className="mt-20">
											<Label><IntlMessages id="cmspage.pageform.label.status" /><span className="text-danger">*</span></Label>
											<Input
												disabled={(menudetail["7A0FC5D4-0A59-2C02-A485-E43AA9E358EC"].AccessRight === "11E6E7B0") ? true : false}
												type="select" name="status" id="status" onChange={(e) => this.onChangeAddNewRegionDetails('status', e.target.value)} value={addNewRegionDetail.status}>
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
												onClick={() => this.addRegionDetail()}
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

const mapStateToProps = ({ languages, regions, authTokenRdcer }) => {
	var response = {
		data: regions.data,
		loading: regions.loading,
		language: languages.language,
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
	addNewRegion, getLanguage, getMenuPermissionByID
})(AddRegion));