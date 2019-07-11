/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
 * Updated By : Bharat Jograna (BreadCrumb)09 March 2019
  Affiliate Report 
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { changeDateFormat } from "Helpers/helpers";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { Badge } from "reactstrap";
import { affiliateSignupReport } from "Actions/MyAccount";
import validateAffiliateReport from 'Validations/MyAccount/affiliate_report';
import AppConfig from 'Constants/AppConfig';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

//BreadCrumb Data...
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
		title: <IntlMessages id="sidebar.adminPanel" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.affiliateManagement" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.affiliateReport" />,
		link: '',
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.affiliateSignupReport" />,
		link: '',
		index: 3
	}
];

//colums names
const columns = [
	{
		name: <IntlMessages id="sidebar.colHash" />,
		options: { filter: true, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colName" />,
		options: { filter: true, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.mobileNumber" />,
		options: { filter: true, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colUserName" />,
		options: { filter: true, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colEmail" />,
		options: { filter: true, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colStatus" />,
		options: { filter: true, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.schemeType" />,
		options: { filter: true, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colDateTime" />,
		options: { filter: true, sort: true }
	}
];

const StatusBadges = ({ data }) => {
	switch (data) {
		case 1: return <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>
		case 0: return <Badge color="warning"><IntlMessages id="sidebar.inActive" /></Badge>
		default: return null;
	}
}

//affiliate dashboard class
class ListAffiliateSignupReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signupList: [],
			filter: {
				status: '',
				SchemeType: '',
				from_date: new Date().toISOString().slice(0, 10),
				to_date: new Date().toISOString().slice(0, 10),
				PageIndex: 1,
				Page_Size: AppConfig.totalRecordDisplayInList,
			},
			totalcount: '',
			errors: {},
			showReset: false,
			loading: false,
			open: false,
			menudetail: [],
			menuLoading: false,
			notificationFlag: true,
		};
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
	}

	applyFilter = (event) => {
		event.preventDefault();
		const { errors, isValid } = validateAffiliateReport(this.state.filter);
		const { from_date, to_date } = this.state.filter;
		this.setState({ errors: errors, showReset: true });
		if (isValid) {
			if (from_date === "" || to_date === "") {
				NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
			} else {
				this.getAffiliateSignupReport(0, this.state.filter.Page_Size);
			}
		}
	}

	clearFilter = () => {
		let curDate = new Date().toISOString().slice(0, 10);
		var newObj = Object.assign({}, this.state.filter);
		newObj.Page_Size = AppConfig.totalRecordDisplayInList;
		newObj.email = "";
		newObj.status = "";
		newObj.username = "";
		newObj.from_date = curDate;
		newObj.to_date = curDate;
		this.setState({ showReset: false, filter: newObj, errors: '' });
		this.props.affiliateSignupReport(newObj);
	}

	getAffiliateSignupReport = (PageIndex, Page_Size) => {
		var newObj = Object.assign({}, this.state.filter);
		newObj['PageIndex'] = PageIndex > 0 ? PageIndex : this.state.filter.PageIndex;
		newObj['Page_Size'] = Page_Size > 0 ? Page_Size : this.state.filter.Page_Size;
		this.setState({ filter: newObj });

		//For Action API...
		var reqObj = newObj;
		reqObj.PageIndex = PageIndex > 0 ? PageIndex - 1 : 1;
		this.props.affiliateSignupReport(reqObj);
	}

	//Pagination Change Method...
	handlePageChange = (pageNumber) => {
		this.getAffiliateSignupReport(pageNumber);
	}

	//Row Per Page Change Method...
	onChangeRowsPerPage = event => {
		this.getAffiliateSignupReport(1, event.target.value);
	};

	onChange = (event) => {
		var newObj = Object.assign({}, this.state.filter);
		newObj[event.target.name] = event.target.value;
		this.setState({ filter: newObj });
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('173BE5C4-22B2-6CDA-29A0-4339D9C70ED0'); // get wallet menu permission
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				this.getAffiliateSignupReport(this.state.filter.PageIndex, this.state.filter.Page_Size);
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				this.props.drawerClose();
			}
		}

		//Added by Bharat Jograna, (BreadCrumb)09 March 2019
		//To Close the drawer using breadcrumb data 
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
			this.setState({ open: false });
		}

		if (nextProps.signupData.ReturnCode === 1 || nextProps.signupData.ReturnCode === 9) {
			this.setState({ signupList: [], totalcount: [] })
		} else if (nextProps.signupData.ReturnCode === 0) {
			this.setState({ signupList: nextProps.signupData.Response, totalcount: nextProps.signupData.TotalCount });
		}
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
		const { loading, totalcount, signupList } = this.state;
		const { from_date, to_date, PageIndex, Page_Size } = this.state.filter;
		const { drawerClose } = this.props;

		//Check list permission....
		var menuPermissionDetail = this.checkAndGetMenuAccessDetail('e4a60201-126d-7826-8a4b-84c9071a3ca3'); //E4A60201-126D-7826-8A4B-84C9071A3CA3
		if (!menuPermissionDetail) {
			menuPermissionDetail = { Utility: [], CrudOption: [] }
		}

		const options = {
			filterType: "select",
			responsive: "scroll",
			selectableRows: false,
			resizableColumns: false,
			search: false, //menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
			print: false,
			download: false,
			viewColumns: false,
			filter: false,
			sort: false,
			serverSide: signupList.length !== 0 ? true : false,
			page: PageIndex,
			count: totalcount,
			rowsPerPage: Page_Size,
			textLabels: {
				body: {
					noMatch: <IntlMessages id="wallet.emptyTable" />,
					toolTip: <IntlMessages id="wallet.sort" />,
				}
			},
			downloadOptions: {
				filename: 'Login_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
			},
			customFooter: (count, page, rowsPerPage) => {
				var tblPage = page > 0 ? page + 1 : 1;
				return (
					<CustomFooter count={count} page={tblPage} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
				);
			},
			onTableChange: (action, tableState) => {
				if (action === 'changeRowsPerPage' || action === 'changePage') {
					this.getAffiliateSignupReport(tableState.page, tableState.rowsPerPage);
				}
			},
		};

		return (
			<div className="jbs-page-content">
				<WalletPageTitle title={<IntlMessages id="sidebar.affiliateReportDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
				{(this.state.menuLoading || loading) && <JbsSectionLoader />}
				{menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation */}
					<JbsCollapsibleCard>
						<div className="top-filter">
							<Form className="tradefrm row">
								<FormGroup className="col-md-2 col-sm-4">
									<Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
									<Input type="date" name="from_date" id="from_date" placeholder="dd/mm/yyyy" value={from_date} onChange={this.onChange} />
								</FormGroup>
								<FormGroup className="col-md-2 col-sm-4">
									<Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
									<Input type="date" name="to_date" id="to_date" placeholder="dd/mm/yyyy" value={to_date} onChange={this.onChange} />
								</FormGroup>
								<FormGroup className="col-md-2 col-sm-4">
									<div className="btn_area">
										<Button color="primary" onClick={this.applyFilter}><IntlMessages id="sidebar.btnApply" /></Button>
										{this.state.showReset && <Button color="danger" className="ml-15" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
									</div>
								</FormGroup>
							</Form>
						</div>
					</JbsCollapsibleCard>
				}
				<div className="StackingHistory">
					<MUIDataTable
						columns={columns}
						options={options}
						data={signupList.map((item, key) => {
							return [
								item.AffiliateId,
								item.FirstName + " " + item.LastName,
								item.Mobile,
								item.UserName,
								item.Email,
								<StatusBadges data={item.Status} />,
								item.SchemeType,
								changeDateFormat(item.JoinDate, 'YYYY-MM-DD HH:mm:ss')
							];
						})}
					/>
				</div>
			</div>
		);
	}
}

//Mapstatetoprops...
const mapStateToProps = ({ AffiliateRdcer, drawerclose, authTokenRdcer }) => {
	//To Close the drawer using breadcrumb data 
	if (drawerclose.bit === 1) {
		setTimeout(function () { drawerclose.bit = 2 }, 1000);
	}
	const { menuLoading, menu_rights } = authTokenRdcer;
	const { signupData, loading } = AffiliateRdcer;
	return { signupData, loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
	affiliateSignupReport,
	getMenuPermissionByID
})(ListAffiliateSignupReport);