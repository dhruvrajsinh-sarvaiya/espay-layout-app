/* 
	Createdby : Megha Kariya
	Date : 06/02/2019
    Description : Add Language Form
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import Button from "@material-ui/core/Button";
// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
//Import CRUD Operation For Faq category Actions...
import { addNewLanguage } from 'Actions/Language';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
// jbsl card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
const validateLanguage = require('../../../../validation/Localization/language');



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
	{
		title: <IntlMessages id="sidebar.languages" />,
		link: '',
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.languagesList" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.addLanguage" />,
		link: '',
		index: 0
	}
];


class AddLanguage extends Component {

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
			data: {
				language_name: '',
				code: '',
				rtlLayout: 'false',
				locale: '',
				sort_order: '',
				status: ''
			},
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
			data: {
				language_name: '',
				code: '',
				rtlLayout: 'false',
				locale: '',
				sort_order: '',
				status: ''
			},
			fieldList: {},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
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

	// On Change Add New language Details
	onChange(key, value) {

		this.setState({
			data: {
				...this.state.data,
				[key]: value
			}
		});

	}

	//Add Language Detail
	onSubmit() {
		const { errors, isValid } = validateLanguage.validateAddLanguageInput(this.state.data);
		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		//let isValid=false;
		if (isValid) {

			setTimeout(() => {
				this.props.addNewLanguage(this.state.data);
				this.setState({ loading: true });
			}, 1000);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}

	//fetch details before render
	componentWillMount() {
		this.props.getMenuPermissionByID('F6A362CA-7764-624E-6834-693FD7BEA210');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });

			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
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

		if (typeof nextProps.addUpdateStatus != 'undefined' && nextProps.addUpdateStatus.responseCode == 0) {
			this.setState({ loading: false });
			this.resetData();
			this.props.reload();
		}

		this.setState({
			loading: nextProps.loading
		});
	}

	closeAll = () => {
		this.setState(this.initState);
		this.props.closeAll();
		this.setState({
			open: false,
		});
	}

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
						return response = fieldList;
					}
				}
			}
		} else {
			return response;
		}
	}

	render() {
		var menudetail = this.checkAndGetMenuAccessDetail('B40AEDE2-73A5-A157-8AD9-F79E8E507995');
		const { drawerClose } = this.props;
		const { language_name, code, locale, rtlLayout, sort_order, status } = this.state.data;
		const { errors, err_alert, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled

		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="languages.button.addLanguage" />} close2Level={this.close2Level} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
				{(loading || this.props.menuLoading) && <JbsSectionLoader />}

				<Fragment>
					<div>
						<JbsCollapsibleCard heading={<IntlMessages id="languages.button.addLanguage" />}>

							{errors.message && <div className="alert_area">
								<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
							</div>}

							<Form>
								{(menudetail["D09D0C61-9E98-2C09-8015-C6F967BB2913"] && menudetail["D09D0C61-9E98-2C09-8015-C6F967BB2913"].Visibility === "E925F86B") && //D09D0C61-9E98-2C09-8015-C6F967BB2913
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-name" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["D09D0C61-9E98-2C09-8015-C6F967BB2913"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="language_name"
											id="language_name"
											value={language_name}
											maxLength={50}
											onChange={(e) => this.onChange('language_name', e.target.value)}
										/>
										{errors.language_name && <span className="text-danger"><IntlMessages id={errors.language_name} /></span>}
									</FormGroup>}

								{(menudetail["F53BAB6D-0536-7A64-153A-FE6399C28F3B"] && menudetail["F53BAB6D-0536-7A64-153A-FE6399C28F3B"].Visibility === "E925F86B") && //F53BAB6D-0536-7A64-153A-FE6399C28F3B
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-code" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["F53BAB6D-0536-7A64-153A-FE6399C28F3B"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="code"
											id="code"
											value={code}
											onChange={(e) => this.onChange('code', e.target.value)}
										/>
										{errors.code && <span className="text-danger"><IntlMessages id={errors.code} /></span>}
									</FormGroup>}

								{(menudetail["04DDEE5B-668F-646F-8589-C3FAA54D49C2"] && menudetail["04DDEE5B-668F-646F-8589-C3FAA54D49C2"].Visibility === "E925F86B") && //04DDEE5B-668F-646F-8589-C3FAA54D49C2
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-locale" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["04DDEE5B-668F-646F-8589-C3FAA54D49C2"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="locale"
											id="locale"
											value={locale}
											onChange={(e) => this.onChange('locale', e.target.value)}
										/>
										{errors.locale && <span className="text-danger"><IntlMessages id={errors.locale} /></span>}
									</FormGroup>}

								{(menudetail["0E3B7353-808D-0FFC-2BCE-80DC71A89102"] && menudetail["0E3B7353-808D-0FFC-2BCE-80DC71A89102"].Visibility === "E925F86B") && //0E3B7353-808D-0FFC-2BCE-80DC71A89102
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-rtlLayout" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["0E3B7353-808D-0FFC-2BCE-80DC71A89102"].AccessRight === "11E6E7B0") ? true : false}
											type="select" name="rtlLayout" id="rtlLayout" value={rtlLayout} onChange={(e) => this.onChange('rtlLayout', e.target.value)}>
											<IntlMessages id="sidebar.no">{(selectOption) => <option value="false">{selectOption}</option>}</IntlMessages>
											<IntlMessages id="sidebar.yes">{(selectOption) => <option value="true">{selectOption}</option>}</IntlMessages>
										</Input>
										{errors.rtlLayout && <span className="text-danger"><IntlMessages id={errors.rtlLayout} /></span>}
									</FormGroup>}

								{(menudetail["CB4BF119-6010-0325-1535-D085CEA808F3"] && menudetail["CB4BF119-6010-0325-1535-D085CEA808F3"].Visibility === "E925F86B") && //CB4BF119-6010-0325-1535-D085CEA808F3
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-sort_order" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["CB4BF119-6010-0325-1535-D085CEA808F3"].AccessRight === "11E6E7B0") ? true : false}
											type="text"
											name="sort_order"
											id="sort_order"
											value={sort_order}
											onChange={(e) => this.onChange('sort_order', e.target.value)}
										/>
										{errors.sort_order && <span className="text-danger"><IntlMessages id={errors.sort_order} /></span>}
									</FormGroup>}


								{(menudetail["ADF77178-565A-0D31-083B-74BB1FA44679"] && menudetail["ADF77178-565A-0D31-083B-74BB1FA44679"].Visibility === "E925F86B") && //ADF77178-565A-0D31-083B-74BB1FA44679
									<FormGroup>
										<Label><IntlMessages id="languages.languageform.label.language-status" /><span className="text-danger">*</span></Label>
										<Input
											disabled={(menudetail["ADF77178-565A-0D31-083B-74BB1FA44679"].AccessRight === "11E6E7B0") ? true : false}
											type="select" name="status" id="status" value={status} onChange={(e) => this.onChange('status', e.target.value)}>
											<IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
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
											onClick={() => this.onSubmit()}
											disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
										>
											<IntlMessages id="button.add" />
										</Button>

										<Button
											className="text-white text-bold btn mr-10 btn bg-danger"
											variant="raised"
											onClick={this.resetData}
											disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
										>
											<IntlMessages id="button.cancel" />
										</Button>
									</FormGroup>}
							</Form>
						</JbsCollapsibleCard>
					</div>
				</Fragment>
			</div>
		);
	}
}

const mapStateToProps = ({ languages, authTokenRdcer }) => {
	var response = {
		data: languages.data,
		loading: languages.loading,
		addUpdateStatus: languages.addUpdateStatus,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};

	return response;
}

export default connect(mapStateToProps, {
	addNewLanguage,
	getMenuPermissionByID,
})(AddLanguage);