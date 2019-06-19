/* 
	Createdby : Megha Kariya
	Date : 06/02/2019
    Description : Language List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { Badge } from "reactstrap";
import MUIDataTable from "mui-datatables";
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import AddLanguage from './add';
import EditLanguage from './edit';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { getAllLanguage, getLanguageById } from 'Actions/Language';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
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
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.languages" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.languagesList" />,
		link: '',
		index: 0
	}
];

// componenet listing
const components = {
	AddLanguage: AddLanguage,
	EditLanguage: EditLanguage
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, languagedata, reload) => {
	return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, languagedata, reload });
};
//Table Object...
const columns = [
	{
		name: <IntlMessages id="languages.title.languageId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.languageName" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.code" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.locale" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.sortOrder" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="languages.title.status" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];
class LanguagesList extends Component {
	constructor(props) {
		super();
		// default ui local state
		this.state = {
			loading: false, // loading activity
			languagelist: [],
			errors: {},
			err_msg: "",
			err_alert: true,
			open: false,
			componentName: "",
			languagedata: {},
			menudetail: [],
			Pflag: true,
		};
		this.onDismiss = this.onDismiss.bind(this);
	}

	onDismiss() {
		let err = delete this.state.errors['message'];
		this.setState({ err_alert: false, errors: err });
	}

	//On Reload
	reload() {
		this.props.getAllLanguage();
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('7F33C202-1E6E-22BD-9CDA-8408C3E07682');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getAllLanguage();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		this.setState({
			languagelist: nextProps.language_list.data,
			loading: false
		});
	}

	onClick = () => {
		this.setState({
			open: !this.state.open,
		})
	}

	showComponent = (componentName, permission, language = '') => {
		// check permission go on next page or not
		if (permission) {
			if (typeof language != 'undefined' && language != '') {
				this.setState({ languagedata: language });
				this.props.getLanguageById(language._id);
			}
			this.setState({
				componentName: componentName,
				open: !this.state.open,
			});
		} else {
			NotificationManager.error(<IntlMessages id={"error.permission"} />);
		}
	}

	closeAll = () => {
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
		var response = false;
		var index;
		const { menudetail } = this.state;
		if (menudetail.length) {
			for (index in menudetail) {
				if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
					response = menudetail[index];
			}
		}
		return response;
	}

	render() {
		var menuPermissionDetail = this.checkAndGetMenuAccessDetail('F6A362CA-7764-624E-6834-693FD7BEA210'); //F6A362CA-7764-624E-6834-693FD7BEA210
		if (!menuPermissionDetail) {
			menuPermissionDetail = { Utility: [], CrudOption: [] }
		}
		const { loading, err_alert, errors, languagelist, permission } = this.state;
		const { drawerClose } = this.props;
		const options = {
			filterType: "dropdown",
			responsive: "scroll",
			selectableRows: false,
			print: false,
			download: false,
			resizableColumns: false,
			viewColumns: false,
			filter: false,
			rowsPerPageOptions: [10, 25, 50, 100],
			serverSide: false,
			search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
			customToolbar: () => {
				if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
					return (
						<MatButton
							onClick={(e) => this.showComponent('AddLanguage', (this.checkAndGetMenuAccessDetail('F6A362CA-7764-624E-6834-693FD7BEA210')).HasChild)}
							className="btn-primary text-white"
						>
							<IntlMessages id="button.add" />
						</MatButton>
					);
				}
			}
		};

		return (
			<Fragment>
				<div className="jbs-page-content">
					<DashboardPageTitle title={<IntlMessages id="sidebar.languagesList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
					{(loading || this.props.menuLoading) && <JbsSectionLoader />}

					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}

					<JbsCollapsibleCard fullBlock>
						<div className="StackingHistory">
							<MUIDataTable
								data={
									languagelist &&
									languagelist.map(language => {
										return [
											language.id,
											language.language_name,
											language.code,
											language.locale,
											language.sort_order,
											language.status == 1 ? (
												<Badge className="mb-10 mr-10" color="primary">
													<IntlMessages id="global.form.status.active" />
												</Badge>
											) : (
													<Badge className="mb-10 mr-10" color="danger">
														<IntlMessages id="global.form.status.inactive" />
													</Badge>
												),
											<div className="list-action">
												{menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
													<a
														href="javascript:void(0)"
														color="primary"
														onClick={(e) => this.showComponent('EditLanguage', (this.checkAndGetMenuAccessDetail('F6A362CA-7764-624E-6834-693FD7BEA210')).HasChild, language)}
													>
														<i className="ti-pencil" />
													</a>
												}
											</div>
										];
									})}
								columns={columns}
								options={options}
							/>
						</div>
					</JbsCollapsibleCard>

					<Drawer
						width="100%"
						handler={false}
						open={this.state.open}
						className="drawer2"
						level=".drawer1"
						placement="right"
						levelMove={100}
					>
						{this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.close2Level, this.closeAll, this.state.languagedata, this.reload)}
					</Drawer>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ languages, authTokenRdcer }) => {
	var response = {
		loading: languages.loading,
		language_list: languages.language_list,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	return response;
};

export default connect(
	mapStateToProps,
	{
		getAllLanguage,
		getLanguageById,
		getMenuPermissionByID,
	}
)(LanguagesList);