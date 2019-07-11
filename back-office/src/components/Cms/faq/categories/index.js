/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 24-11-2018
    UpdatedDate : 24-11-2018
    Description : Faq Category List
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
//Import List Faq Category Actions...
import { getFaqcategories, deleteFaqCategory, getFaqCategoryById } from "Actions/Faq"; // getFaqCategoryById Added by Khushbu Badheka D:29/01/2019
import AddFaqCategories from './add';
import EditFaqCategories from './edit';
import { DashboardPageTitle } from '../../DashboardPageTitle';
import { getLanguage } from 'Actions/Language';// Added by Khushbu Badheka D:29/01/2019
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
		title: <IntlMessages id="sidebar.faq" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.Faq-Categories" />,
		link: '',
		index: 0
	}
];

// componenet listing
const components = {
	AddFaqCategories: AddFaqCategories,
	EditFaqCategories: EditFaqCategories
};
// dynamic component binding
// Added By Megha Kariya (05-02-2019) : Add close2Level
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll, faqcategorydata, reload, permission) => {
	return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll, faqcategorydata, reload, permission });
};
//Table Object...
const columns = [
	{
		name: <IntlMessages id="sidebar.colId" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="faq.categoryform.label.category_name" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="faq.categoryform.label.sort_order" />,
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

class FaqCategories extends Component {
	constructor(props) {
		super();
		// default ui local state
		this.state = {
			loading: false, // loading activity
			faqs_categories_list: [],
			errors: {},
			err_msg: "",
			err_alert: true,
			selectedcategory: "",
			open: false,
			componentName: "",
			faqcategorydata: {},
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
		this.props.getFaqcategories();
		// setTimeout(() => {
		//   this.setState({ loading: false });
		// }, 2000);
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('B2D2F534-7887-7C6A-5BB3-15C5AF543D89');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getFaqcategories();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 0 && nextProps.deleteevent == 1) {
			this.setState({ loading: false, selectedcategory: null });
			this.reload();
			//window.location.reload();
		}

		if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
			if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
				this.setState({ err_alert: true });
			}
			this.setState({
				errors: nextProps.data.errors
			});
		}

		this.setState({
			faqs_categories_list: nextProps.faqs_categories_list,
			loading: false
		});
	}

	// On Delete
	onDelete(data) {
		this.refs.deleteConfirmationDialog.open();
		this.setState({ selectedcategory: data });
	}

	// Delete Faq Category Permanently
	deleteFaqcategoryPermanently() {
		const { selectedcategory } = this.state;
		this.refs.deleteConfirmationDialog.close();
		this.setState({ loading: true });
		let FaqcategoryId = selectedcategory._id;
		if (FaqcategoryId != undefined && FaqcategoryId != "") {
			this.props.deleteFaqCategory(FaqcategoryId);
		}
	}

	onClick = () => {
		this.setState({
			open: this.state.open ? false : true,
		})
	}

	showComponent = (componentName, permission, category = '') => {
		// check permission go on next page or not
		if (permission) {
			if ( category != undefined && category != '') {
				this.setState({ faqcategorydata: category });
				this.props.getFaqCategoryById(category._id); // Added by Khushbu Badheka D:29/01/2019
			}
			this.props.getLanguage();// Added by Khushbu Badheka D:29/01/2019
			this.setState({
				componentName: componentName,
				open: this.state.open ? false : true,
				permission: permission
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
		var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7DE451D3-46A7-95EF-374B-F2C2AF9E4C58'); //7DE451D3-46A7-95EF-374B-F2C2AF9E4C58
		if (!menuPermissionDetail) {
			menuPermissionDetail = { Utility: [], CrudOption: [] }
		}
		const { loading, err_alert, errors, faqs_categories_list} = this.state;
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
				if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) {
					return (
						<MatButton
							onClick={(e) => this.showComponent('AddFaqCategories', (this.checkAndGetMenuAccessDetail('7DE451D3-46A7-95EF-374B-F2C2AF9E4C58')).HasChild)}
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
					<DashboardPageTitle title={<IntlMessages id="sidebar.Faq-Categories" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
					{(loading || this.props.menuLoading) && <JbsSectionLoader />}

					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}

					<JbsCollapsibleCard fullBlock>
						<div className="StackingHistory">
							<MUIDataTable
								data={
									faqs_categories_list &&
									faqs_categories_list.map(category => {
										return [
											category.category_id,
											category.locale.en.category_name,
											category.sort_order,
											new Date(category.date_modified).toLocaleString(),  // Added by Jayesh 22-01-2019
											category.status == 1 ? (
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
														onClick={(e) => this.showComponent('EditFaqCategories', (this.checkAndGetMenuAccessDetail('7DE451D3-46A7-95EF-374B-F2C2AF9E4C58')).HasChild, category)}
													>
														<i className="ti-pencil" />
													</a>
												}
												{menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for delete permission
													<a
														href="javascript:void(0)"
														color="primary"
														onClick={() => this.onDelete(category)}
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
						onConfirm={() => this.deleteFaqcategoryPermanently()}
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
						{this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.close2Level, this.closeAll, this.state.faqcategorydata, this.reload)}
					</Drawer>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ faqcategories, authTokenRdcer }) => {
	var response = {
		data: faqcategories.data,
		loading: faqcategories.loading,
		faqs_categories_list: faqcategories.faqs_categories_list,
		deleteevent: faqcategories.deleteevent,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	return response;
};

export default connect(
	mapStateToProps,
	{
		getFaqcategories,
		deleteFaqCategory,
		getLanguage,// Added by Khushbu Badheka D:29/01/2019
		getFaqCategoryById, // Added by Khushbu Badheka D:29/01/2019
		getMenuPermissionByID,
	}
)(FaqCategories);