/* 
    Createdby : dhara gajera
    CreatedDate : 26-12-2018
	Description :chat user list List
	Updated :2/1/2019 by dhara
	TODO: Need to Update Display Date when api response change 
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import MUIDataTable from "mui-datatables";
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
//Import List chat user Actions...
import { getChatUserList, getChatUserhistory } from 'Actions/ChatDashboard';
import EditCHatUserBlockStatus from './edit';
import ChatHistory from './history';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { Badge } from "reactstrap";
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
		title: <IntlMessages id="sidebar.Chat" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.chatuserlist" />,
		link: '',
		index: 0
	}
];

//Table Object...
const columns = [
	{
		name: <IntlMessages id="chatuserlist.title.id" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="chatuserlist.title.name" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="chatuserlist.title.email" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="chatuserlist.title.mobile" />,
		options: { sort: true, filter: false }
	},
	{
		name: <IntlMessages id="chatuserlist.title.dateAdded" />,
		options: { sort: false, filter: false }
	},
	{
		name: <IntlMessages id="chatuserlist.title.switchstatus" />,
		options: { sort: false, filter: false }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];

// componenet listing
const components = {
	EditCHatUserBlockStatus: EditCHatUserBlockStatus,
	ChatHistory: ChatHistory
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, chatUserlistData, reload) => {
	return React.createElement(components[TagName], { props, drawerClose, closeAll, chatUserlistData, reload });
};

class chatUserBlockStatus extends Component {
	constructor(props) {
		super(props);
		// default ui local state
		this.state = {
			loading: false, // loading activity
			errors: {},
			err_alert: true,
			open: false,
			chatUser_list: [],
			componentName: "",
			chatUserlistData: {},
			permission: {},
			menudetail: [],
			Pflag: true,
			GUID: this.props.GUID,
		};
	}

	// Action for Get ChatUser List 
	componentWillMount() {
		this.props.getMenuPermissionByID('2A5EECB2-3621-6012-64F3-118863AE0FB1');
	}

	showComponent = (componentName, usersInfo, permission) => {
		if (permission) {
			if (typeof usersInfo != 'undefined' && usersInfo != '') {
				if (componentName === 'ChatHistory') {
					let UserName = usersInfo.UserName;
					if (UserName != '') {
						let data = {
							Username: UserName,
							Page: 0 // Changed by Jayesh from Score to Page 28-01-2019
						}
						this.props.getChatUserhistory(data);
					}
				}
				this.setState({ chatUserlistData: usersInfo });
			}
			this.setState({
				componentName: componentName,
				open: this.state.open ? false : true,
			});
		} else {
			NotificationManager.error(<IntlMessages id={"error.permission"} />);
		}
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
				this.props.getChatUserList();
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		if (typeof nextProps.chatUser_list != 'undefined' && typeof nextProps.chatUser_list.Users != 'undefined' && nextProps.chatUser_list.ReturnCode == 0) {
			this.setState({ userlist_error: nextProps.chatUser_list.ReturnMsg, chatUser_list: nextProps.chatUser_list.Users })
		}
		this.setState({ loading: nextProps.loading });
	}

	onClick = () => {
		this.setState({ open: false });
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
	}

	//On Reload
	reload() {
		this.props.getChatUserList();
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
		var menudetail = this.checkAndGetMenuAccessDetail('550A8B6B-34F5-3328-32D3-FE1C19DD359B');
		if (!menudetail) {
			menudetail = { Utility: [], CrudOption: [] }
		}

		const { loading, err_alert, errors, chatUser_list } = this.state;
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
			search: menudetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
		};
		
		return (
			<Fragment>
				<div className="jbs-page-content">
					<DashboardPageTitle title={<IntlMessages id="sidebar.chatuserlist" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
					{(loading || this.props.menuLoading) && <JbsSectionLoader />}
					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}

					<JbsCollapsibleCard fullBlock>
						<div className="StackingHistory statusbtn-chat">
							<MUIDataTable
								title={<IntlMessages id="sidebar.chatuserlist" />}
								data={
									chatUser_list &&
									chatUser_list.map((usersInfo, key) => {
										let dt = new Date(usersInfo.CreatedDate);
										var dd = dt.getDate();

										var mm = dt.getMonth() + 1;
										dd = dd < 10 ? '0' + dd : dd;
										mm = mm < 10 ? '0' + mm : mm;
										let formatted_date = dd + '/' + mm + '/' + dt.getFullYear();
										return [
											usersInfo.Id,
											usersInfo.Name && (usersInfo.Name).trim() != '' ? usersInfo.Name : '-',
											usersInfo.Email && (usersInfo.Email).trim() != '' ? usersInfo.Email : '-',
											usersInfo.Mobile && (usersInfo.Mobile).trim() != '' ? usersInfo.Mobile : '-',
											formatted_date,
											usersInfo.IsBlocked === true ? (
												<Badge className="mb-10 mr-10" color="danger">
													<IntlMessages id="chatBlock.form.status.blocked" />
												</Badge>
											) : (
													<Badge className="mb-10 mr-10" color="primary">
														<IntlMessages id="chatBlock.form.status.unblocked" />
													</Badge>),
											<div className="list-action">
												{menudetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
													<a href="javascript:void(0)"
														color="primary"
														onClick={(e) => this.showComponent('EditCHatUserBlockStatus', usersInfo, (this.checkAndGetMenuAccessDetail('550A8B6B-34F5-3328-32D3-FE1C19DD359B')).HasChild)} >
														<i className="ti-pencil" />
													</a>}
												{menudetail.CrudOption.indexOf('6AF64827') !== -1 && // check for delete permission
													<a href="javascript:void(0)"
														color="primary"
														onClick={(e) => this.showComponent('ChatHistory', usersInfo, (this.checkAndGetMenuAccessDetail('550A8B6B-34F5-3328-32D3-FE1C19DD359B')).HasChild)} >
														<i className="ti-list" />
													</a>}
											</div>
										]
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
						onMaskClick={this.onClick}
						className="drawer2"
						level=".drawer1"
						placement="right"
						levelMove={100}
					>
						{this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.onClick, this.closeAll, this.state.chatUserlistData, this.reload)}
					</Drawer>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ chatUserList, authTokenRdcer }) => {
	const { chatUser_list, errors, loading } = chatUserList;
	const { menuLoading, menu_rights } = authTokenRdcer;
	return { chatUser_list, errors, menuLoading, menu_rights, loading }
};

export default connect(mapStateToProps,{
	getChatUserList,
	getChatUserhistory,
	getMenuPermissionByID
})(chatUserBlockStatus);