/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : ContactUs List
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For ContactUs Actions...
import { getContactUs } from 'Actions/ContactUs';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { DashboardPageTitle } from '../DashboardPageTitle';
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
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.contactUs" />,
		link: '',
		index: 0
	},
];
const buttonSizeSmall = {
	maxHeight: '28px',
	minHeight: '28px',
	maxWidth: '28px',
	fontSize: '1rem'
}
const columns = [
	{
		name: <IntlMessages id="contactus.title.id" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="contactus.title.email" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="contactus.title.subject" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="contactus.title.description" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="contactus.title.dateAdded" />,
		options: { sort: true, filter: true }
	}
];

const sortColumns = [
	{
		orderBy: "id",
		sortOrder: 1,
	},
	{
		orderBy: "email",
		sortOrder: 1,
	},
	{
		orderBy: "subject",
		sortOrder: 1,
	},
	{
		orderBy: "description",
		sortOrder: 1,
	},
	{
		orderBy: "date_added",
		sortOrder: 1,
	}
];

class ContactUs extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: true, // loading activity
			contactlist: [],
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			count: 0,
			orderBy: 'id',
			sortOrder: 1,
			errors: {},
			menudetail: [],
			Pflag: true,
		};

	}

	componentWillMount() {
		this.props.getMenuPermissionByID('3C2684B7-98A4-2388-0EF8-0A5006CD21BA');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.props.getContactUs({
					page: 0,
					rowsPerPage: 10,
					searchValue: null,
					orderBy: sortColumns[0].orderBy,
					sortOrder: sortColumns[0].sortOrder
				});
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}


		this.setState({
			contactlist: nextProps.contact_list.data,
			count: nextProps.contact_list.totalCount,
			loading: nextProps.loading
		});

	}

	onChildClick = () => {
		this.setState({
			openChild: !this.state.openChild,
		})
	}

	showComponent = (componentName, page = '') => {
		if (typeof page != 'undefined' && page != '') {
			this.setState({ pagedata: page });
		}
		this.setState({
			componentName: componentName,
			openChild: !this.state.open,
		});
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({
			openChild: false,
		});
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
		var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7F54B9EC-814D-86B9-2BAE-FA0649BC85AB'); //7F54B9EC-814D-86B9-2BAE-FA0649BC85AB
		if (!menuPermissionDetail) {
			menuPermissionDetail = { Utility: [], CrudOption: [] }
		}
		const { loading, contactlist, page, rowsPerPage, searchValue, count, orderBy, sortOrder } = this.state;
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
			serverSide: true,
			page: page,
			count: count,
			rowsPerPage: rowsPerPage,
			searchValue: searchValue,
			search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
			onTableChange: (action, tableState) => {

				switch (action) {
					case 'changeRowsPerPage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							orderBy: orderBy,
							sortOrder: sortOrder,
							loading: false
						});
						this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						break;
					case 'changePage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							orderBy: orderBy,
							sortOrder: sortOrder,
							loading: false
						});
						this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						break;
					case 'search':
						if (typeof tableState.searchText != 'undefined' && tableState.searchText != null && tableState.searchText.length > 2) {
							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								searchValue: tableState.searchText,
								orderBy: orderBy,
								sortOrder: sortOrder,
								loading: false
							});
							this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						}
						else if (typeof tableState.searchText != 'undefined' && tableState.searchText == null) {

							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								searchValue: tableState.searchText,
								orderBy: orderBy,
								sortOrder: sortOrder,
								loading: false
							});
							this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						}
						break;
					case 'sort':
						let sortingDirectionString = sortOrder == 1 ? -1 : 1;
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							orderBy: sortColumns[tableState.activeColumn].orderBy,
							sortOrder: sortingDirectionString,
							loading: false
						});
						this.props.getContactUs({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: sortColumns[tableState.activeColumn].orderBy, sortOrder: sortingDirectionString });
						break;
				}
			}
		};

		return (
			<Fragment>
				<div className="jbs-page-content">
					{/* <div className="page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2><IntlMessages id="sidebar.contactUs" /></h2>
                        </div>
                        <div className="page-title-wrap">
                            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                        </div>
					</div> */}
					<DashboardPageTitle title={<IntlMessages id="sidebar.contactUs" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

					<div className="responsive-table-wrapper">

						<JbsCollapsibleCard fullBlock>
							<div className="StackingHistory">
								<MUIDataTable
									// title={<IntlMessages id="sidebar.contactUs" />}
									data={contactlist && contactlist.map(contact => {
										return [
											contact.id,
											contact.email,
											contact.subject,
											contact.description,
											new Date(contact.date_added).toLocaleString(),  // Added by Jayesh 22-01-2019
										]
									})}
									columns={columns}
									options={options}
								/>
								{(loading || this.props.menuLoading) &&
									<JbsSectionLoader />
								}
							</div>
						</JbsCollapsibleCard>
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ contactus, authTokenRdcer }) => {
	const { contact_list, loading } = contactus;
	const { menuLoading, menu_rights } = authTokenRdcer;
	return { contact_list, loading, menuLoading, menu_rights }
}

export default withRouter(connect(mapStateToProps, {
	getContactUs,
	getMenuPermissionByID,
})(ContactUs));