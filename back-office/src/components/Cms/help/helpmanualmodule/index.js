/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Help Manual Module List
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
// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
//Import List Help Module Actions...
import { getHelpmanualmodules, deleteHelpmanualmodule, getHelpmanualmoduleById } from "Actions/HelpManual"; // getHelpmanualmoduleById Added by Khushbu Badheka D:30/01/2019
import AddHelpModule from './add';
import EditHelpModule from './edit';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { getLanguage } from 'Actions/Language'; // Added by Khushbu Badheka D:30/01/2019
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
		index: 0
	},
	// Added By Megha Kariya (05-02-2019)
	{
		title: <IntlMessages id="sidebar.help" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.helpmanualmodule" />,
		link: '',
		index: 0
	}
];

// componenet listing
const components = {
	AddHelpModule: AddHelpModule,
	EditHelpModule: EditHelpModule
};

// dynamic component binding
// Added By Megha Kariya (05-02-2019) : Add close2Level
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, helpmoduledata, reload, permission) => {
	return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, helpmoduledata, reload, permission });
};

//Table Object...
const columns = [
	{
		name: <IntlMessages id="sidebar.colId" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="help.label.module_name" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="help.label.sort_order" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="sidebar.date_modified" />,  // Added by Jayesh 22-01-2019
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="sidebar.colStatus" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];

class HelpModules extends Component {
	constructor(props) {
		super();
		// default ui local state
		this.state = {
			loading: false, // loading activity
			help_module_list: [],
			errors: {},
			err_msg: "",
			err_alert: true,
			selectedmodule: "",
			open: false,
			componentName: "",
			helpmoduledata: {},
			permission: {},
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
		//this.setState({ loading: true });
		this.props.getHelpmanualmodules();
		// setTimeout(() => {
		//   this.setState({ loading: false });
		// }, 2000);
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('0F113E9B-49BA-0BFB-786A-A1843D8D1468');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getHelpmanualmodules();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (nextProps.data !== undefined && nextProps.data.responseCode === 0 && nextProps.deleteevent == 1) {
			this.setState({ loading: false, selectedmodule: null });
			this.reload();
			//window.location.reload();
		}

		if (nextProps.data !== undefined && (nextProps.data.responseCode == 9 || nextProps.data.responseCode == 1)) {
			if (nextProps.data.errors.message !== undefined && nextProps.data.errors.message != '') {
				this.setState({ err_alert: true });
			}
			this.setState({
				errors: nextProps.data.errors
			});
		}

		this.setState({
			help_module_list: nextProps.help_module_list,
			loading: false
		});
	}

	// On Delete	
	onDelete(data) {
		this.refs.deleteConfirmationDialog.open();
		this.setState({ selectedmodule: data });
	}

	// Delete Help Module Permanently
	deleteHelpmanualmodulePermanently() {
		const { selectedmodule } = this.state;
		this.refs.deleteConfirmationDialog.close();
		this.setState({ loading: true });
		let moduleId = selectedmodule._id;
		if (moduleId != undefined && moduleId != "") {
			this.props.deleteHelpmanualmodule(moduleId);
		}
	}

	onClick = () => {
		this.setState({
			open: this.state.open ? false : true,
		})
	}

	showComponent = (componentName, permission, modules) => {
		// check permission go on next page or not
		if (permission) {
			if (modules !== undefined && modules != '') {
				this.setState({ helpmoduledata: modules });
				this.props.getHelpmanualmoduleById(modules._id); // Added by Khushbu Badheka D:30/01/2019
			}
			this.props.getLanguage(); // Added by Khushbu Badheka D:30/01/2019
			this.setState({
				componentName: componentName,
				open: true
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
	// Added By Megha Kariya (05-02-2019)
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
		var menuPermissionDetail = this.checkAndGetMenuAccessDetail('8F5D0912-8BC1-0513-11A2-2479649D25D5'); //8F5D0912-8BC1-0513-11A2-2479649D25D5
		if (!menuPermissionDetail) {
			menuPermissionDetail = { Utility: [], CrudOption: [] }
		}
		const { loading, err_alert, errors, help_module_list } = this.state;
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
			search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
			rowsPerPageOptions: [10, 25, 50, 100],
			customToolbar: () => {
				if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
					return (
						<MatButton
							onClick={(e) => this.showComponent('AddHelpModule', (this.checkAndGetMenuAccessDetail('8F5D0912-8BC1-0513-11A2-2479649D25D5')).HasChild)}
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
					<DashboardPageTitle title={<IntlMessages id="sidebar.helpmanualmodule" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
					{(loading || this.props.menuLoading) && <JbsSectionLoader />}

					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}

					<JbsCollapsibleCard fullBlock>
						<div className="StackingHistory">
							<MUIDataTable
								data={
									help_module_list &&
									help_module_list.map(modules => {
										return [
											modules._id,
											modules.locale.en.module_name,
											modules.sort_order,
											new Date(modules.date_modified).toLocaleString(),  // Added by Jayesh 22-01-2019
											modules.status == 1 ? (
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
														onClick={(e) => this.showComponent('EditHelpModule', (this.checkAndGetMenuAccessDetail('8F5D0912-8BC1-0513-11A2-2479649D25D5')).HasChild, modules)}
													>
														<i className="ti-pencil" />
													</a>
												}
												{menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
													<a
														href="javascript:void(0)"
														color="primary"
														onClick={() => this.onDelete(modules)}
													>
														<i className="ti-close" />
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

					<DeleteConfirmationDialog
						ref="deleteConfirmationDialog"
						title={<IntlMessages id="global.delete.message" />}
						message=""
						onConfirm={() => this.deleteHelpmanualmodulePermanently()}
					/>

					<Drawer
						width="100%"
						handler={false}
						open={this.state.open}
						className="drawer2"
						level=".drawer1"
						placement="right"
						levelMove={100}
					>
						{/* Added By Megha Kariya (05-02-2019) : Add close2Level */}
						{this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.close2Level, this.closeAll, this.state.helpmoduledata, this.reload)}
					</Drawer>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ helpmanualmodules, authTokenRdcer }) => {
	var response = {
		data: helpmanualmodules.data,
		loading: helpmanualmodules.loading,
		help_module_list: helpmanualmodules.help_module_list,
		deleteevent: helpmanualmodules.deleteevent,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	return response;
};

export default connect(
	mapStateToProps,
	{
		getHelpmanualmodules,
		deleteHelpmanualmodule,
		getLanguage, // Added by Khushbu Badheka D:30/01/2019
		getHelpmanualmoduleById, // Added by Khushbu Badheka D:30/01/2019
		getMenuPermissionByID,
	}
)(HelpModules);