/* 
    Developer : Salim Deraiya
    Date : 15-01-2019
    UpdatedBy : Salim Deraiya (22-01-2019)..
    File Comment : Leader List Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Checkbox from "@material-ui/core/Checkbox";
import MUIDataTable from "mui-datatables";
import { Input, Badge, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { NotificationManager } from "react-notifications";
// intl messages
import IntlMessages from 'Util/IntlMessages';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import $ from "jquery";
//change date formate from the helper.js
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode,
	changeDateFormat,
	convertObjectToString
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
//Import Referral Friends Actions...
import {
	getLeaderList,
	unFollowLeader,
	getWatchlist,
	addWatchlistGroup,
	addWatchlist,
	removeWatchlist
} from 'Actions/SocialProfile';
const validateLeaderProfileConfigForm = require("../../validation/SocialProfile/leader_profile_configuration");

//Table Object...
const columns = [
	{
		// name: <Checkbox value="all" color="primary" onChange={e => this.onSelectAllAddresses(e)} />,
		name: <IntlMessages id="sidebar.colHash" />,
		options: { filter: false, sort: false }
	},
	{
		name: <IntlMessages id="sidebar.colName" />,
		options: { filter: false, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colNoOfFollower" />,
		options: { filter: false, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colProfile" />,
		options: { filter: false, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colIsFollow" />,
		options: { filter: false, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colIsWatchlist" />,
		options: { filter: false, sort: true }
	},
	{
		name: <IntlMessages id="sidebar.colActions" />,
		options: { filter: false, sort: false }
	}
];
const options = {
	filterType: "select",
	responsive: "scroll",
	selectableRows: false,
	resizableColumns: false,
	viewColumns: false,
	filter: false,
	download: false,
	textLabels: {
		body: {
			noMatch: <IntlMessages id="wallet.emptyTable" />,
			toolTip: <IntlMessages id="wallet.sort" />,
		}
	},
	downloadOptions: {
		filename: 'LEADER_LIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
	}
};

class LeaderListDataTbl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			selectedIDs: [],
			defaultWatchlist: [],
			anchorEl: null,
			watchDialog: false,
			groupName: '',
			refLdrList: false,
			loading: false,
			selLeaderId: '',
			selLeaderGrpIds: [],
			PageIndex: 0,
			Page_Size: AppConfig.totalRecordDisplayInList,
			errors: {}
		};

		this.onDismiss = this.onDismiss.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	onDismiss() {
		this.setState({ err_alert: false, success_alert: false });
	}

	getLeaderList() {
		const reqObj = {
			PageIndex: this.state.PageIndex,
			Page_Size: this.state.Page_Size
		}
		this.props.getLeaderList(reqObj);
		this.props.getWatchlist();
	}

	componentWillMount() {
		var leaderConfig = this.props.history.location.state;
		if (leaderConfig.profileId !== '') {
			this.getLeaderList();
		} else {
			this.setState({ showForm: false, err_msg: <IntlMessages id="apiErrCode.0" />, err_alert: false });
			this.props.history.push('/app/social-profile');
		}
	}

	onSelectAllAddresses(e) {
		if (e.target.checked) {
			let tempArry = [];
			this.state.list.forEach(function (items) {
				tempArry.push(items.LeaderId);
			});
			this.setState({ selectedIDs: tempArry });
		} else {
			this.setState({ selectedIDs: [] });
		}
	}

	onSelectAddress(e, recId) {
		let tempArry = this.state.selectedIDs;
		//checked if not in list
		if (e.target.checked && tempArry.indexOf(recId) == -1) {
			tempArry.push(recId);
		} else if (!e.target.checked) {
			let pos = tempArry.indexOf(recId);
			if (pos !== -1) tempArry.splice(pos, 1);
		}
		this.setState({ selectedIDs: tempArry });
	}

	addToWatchlist(GroupId) {
		this.closeWatchDialog();
		var watchObj = {
			GroupId: GroupId,
			LeaderId: this.state.selLeaderId,
			DeviceId: getDeviceInfo(),
			Mode: getMode(),
			HostName: getHostName()
		}

		let self = this;
		getIPAddress().then(function (ipAddress) {
			watchObj.IPAddress = ipAddress;
			self.props.addWatchlist(watchObj);
			self.setState({ refLdrList: true });
		});
	}

	removeToWatchlist(GroupId) {
		this.closeWatchDialog();
		var delWatchObj = {
			GroupId: GroupId,
			LeaderId: this.state.selLeaderId,
			DeviceId: getDeviceInfo(),
			Mode: getMode(),
			HostName: getHostName()
		}

		let self = this;
		getIPAddress().then(function (ipAddress) {
			delWatchObj.IPAddress = ipAddress;
			self.props.removeWatchlist(delWatchObj);
			self.setState({ refLdrList: true });
		});
	}

	openWatchDialog() {
		this.setState({ anchorEl: null });
		this.setState({ watchDialog: true });
	}

	closeWatchDialog() {
		this.setState({ watchDialog: false });
		this.handleClose();
	}

	addNewWatchlist() {
		event.preventDefault();
		const { errors, isValid } = validateLeaderProfileConfigForm({ groupName: this.state.groupName });
		this.setState({ errors: errors });

		if (isValid) {
			var addGrpWatchObj = {
				GroupName: this.state.groupName,
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				HostName: getHostName()
			}

			let self = this;
			getIPAddress().then(function (ipAddress) {
				addGrpWatchObj.IPAddress = ipAddress;
				self.props.addWatchlistGroup(addGrpWatchObj);
				self.setState({ refLdrList: true });
			});
		}
	}

	onFollowToLeader() {
		if (this.state.selectedIDs.length) {
			var leaderIds = convertObjectToString(this.state.selectedIDs);
			this.props.history.push({ pathname: '/app/social-profile/follower-profile-configuration', state: { LeaderId: leaderIds, type: 'all' } });
		}
	}

	onUnfollowToLeader(leaderID = '') {
		var leaderIds = leaderID;
		if (this.state.selectedIDs.length && leaderID === '') {
			leaderIds = convertObjectToString(this.state.selectedIDs);
		}
		this.props.unFollowLeader({ LeaderId: leaderIds });
		this.setState({ refLdrList: true });
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

		//Get Leader List
		if (nextProps.ldrList.hasOwnProperty('LeaderList') && nextProps.ldrList.LeaderList.length > 0) {
			this.setState({ list: nextProps.ldrList.LeaderList, selectedIDs: [] });
		}

		//Get Watch list
		if (nextProps.watchList.hasOwnProperty('GroupList') && nextProps.watchList.GroupList.length > 0) {
			this.setState({ defaultWatchlist: nextProps.watchList.GroupList });
		}

		if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			// this.setState({ err_alert: true, err_msg: errMsg });
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			NotificationManager.success(nextProps.data.ReturnMsg);
			// if(watchGrpFlag)
			if (this.state.refLdrList) {
				this.setState({ refLdrList: false });
				this.getLeaderList();
				this.closeWatchDialog();
			}
		}
	}

	handleClose() {
		this.setState({ anchorEl: null, selLeaderId: '' });
	};

	handleClick(event, LeaderId, LeaderGrpIds) {
		this.setState({ anchorEl: event.currentTarget, selLeaderId: LeaderId, selLeaderGrpIds: LeaderGrpIds });
	};

	handleChange(event) {
		this.setState({ groupName: event.target.value });
	};

	render() {
		const { list, selLeaderId, selLeaderGrpIds, groupName, defaultWatchlist, anchorEl, watchDialog, errors, loading } = this.state;
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<Fragment>
					<div className="f_area">
						<Checkbox checked={this.state.selectedIDs.length ? true : false} onChange={e => this.onSelectAllAddresses(e)} value="all" color="primary" />
						<Button size="small" className={this.state.selectedIDs.length ? "my-10 mr-10 perverbtn" : "disabled my-10 mr-10 perverbtn"} onClick={() => this.onFollowToLeader()}><IntlMessages id="sidebar.btnbulkFollow" /></Button>
						<Button size="small" className={this.state.selectedIDs.length ? "my-10 mr-10 perverbtn" : "disabled my-10 mr-10 perverbtn"} onClick={() => this.onUnfollowToLeader()}><IntlMessages id="sidebar.btnbulkUnfollow" /></Button>
					</div>
					<div id="scl_ldr_lst">
						<MUIDataTable title={<IntlMessages id="sidebar.leaderList" />} columns={columns} options={options}
							data={list.map((item, key) => {
								return [
									<Checkbox style={{ width: 'auto' }} checked={this.state.selectedIDs.indexOf(item.LeaderId) >= 0 ? true : false} onChange={e => this.onSelectAddress(e, item.LeaderId)} color="primary" />,
									item.LeaderName,
									item.NoOfFollowerFollow,
									item.UserDefaultVisible,
									<Fragment>
										{item.IsFollow ? <Badge color="success"><IntlMessages id="sidebar.yes" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.no" /></Badge>}
									</Fragment>,
									<Fragment>
										{item.IsWatcher ? <Badge color="success"><IntlMessages id="sidebar.yes" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.no" /></Badge>}
									</Fragment>,
									<Fragment>
										<Link className="text-primary" to={{ pathname: "/app/social-profile/follower-profile-configuration", state: { LeaderId: item.LeaderId, type: 'single' } }}><i className="zmdi zmdi-settings zmdi-hc-2x"></i></Link>
										{item.IsFollow && <a href="javascript:void(0)" className="ml-10 text-danger" onClick={() => this.onUnfollowToLeader(item.LeaderId)}><i className="zmdi zmdi-thumb-down zmdi-hc-2x" /></a>}
										{item.IsWatcher
											? <IconButton aria-owns={anchorEl ? 'long-menu' : null} aria-haspopup="true" className="ml-10 text-warning ldbtn" onClick={(e) => this.handleClick(e, item.LeaderId, item.GroupId)}><i className="zmdi zmdi-check-circle zmdi-hc-2x" /></IconButton>
											: <IconButton aria-owns={anchorEl ? 'long-menu' : null} aria-haspopup="true" className="ml-10 text-success ldbtn" onClick={(e) => this.handleClick(e, item.LeaderId, item.GroupId)}><i className="zmdi zmdi-plus-circle zmdi-hc-2x" /></IconButton>
										}
									</Fragment>
								];
							})}
						/>
						{defaultWatchlist.length > 0 &&
							<Menu id="long-menu" className="wtc_list" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose} >
								{defaultWatchlist.map((wlst, index) => (
									selLeaderGrpIds.indexOf(wlst.Id) !== -1
										? <MenuItem key={index} className="wtc_true" onClick={() => this.removeToWatchlist(wlst.Id, selLeaderId)}>{wlst.GroupName}</MenuItem>
										: <MenuItem key={index} onClick={() => this.addToWatchlist(wlst.Id, selLeaderId)}>{wlst.GroupName}</MenuItem>

								))
								}
								<MenuItem onClick={() => this.openWatchDialog()}><IntlMessages id="sidebar.addToNewList" /></MenuItem>
							</Menu>
						}
					</div>
				</Fragment>
				<Modal isOpen={watchDialog} className="watch_model modal-dialog-centered" toggle={() => this.closeWatchDialog()}>
					<a href="javascript:void(0)" className="btn_cls" onClick={() => this.closeWatchDialog()}><i className="zmdi zmdi-close zmdi-hc-2x" /></a>
					<ModalHeader><IntlMessages id="sidebar.createNewWatchlist" /></ModalHeader>
					<ModalBody>
						<div className="clearfix">
							<div className="watch_img">
								<img src={require('Assets/image/createlist.png')} alt={<IntlMessages id="sidebar.image" />} />
							</div>
							<div className="watch_cnt">
								<h2><IntlMessages id="sidebar.createNewWatchlistNote" /></h2>
								<IntlMessages id="sidebar.enterNewWatchListGrp">
									{(placeholder) =>
										<Input type="text" tabIndex="1" name="groupName" className="w-50" value={groupName} placeholder={placeholder} id="groupName" onChange={e => this.handleChange(e)} />
									}
								</IntlMessages>
								{errors.groupName && (<span className="text-danger text-left"><IntlMessages id={errors.groupName} /></span>)}
							</div>
						</div>
						<Button variant="raised" tabIndex="2" type="submit" size="large" className="perverbtn" onClick={() => this.addNewWatchlist()}><IntlMessages id="sidebar.btnCreateNewList" /></Button>
					</ModalBody>
				</Modal>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ socialProfileRdcer, settings }) => {
	var response = {
		darkMode: settings.darkMode,
		data: socialProfileRdcer.response,
		ldrList: socialProfileRdcer.getLeaderList,
		watchList: socialProfileRdcer.watchlst,
		watchGrpData: socialProfileRdcer.watchGrpData,
		watchData: socialProfileRdcer.watchData,
		loading: socialProfileRdcer.loading
	}

	return response;
}

export default connect(mapStateToProps, {
	getLeaderList,
	unFollowLeader,
	getWatchlist,
	addWatchlistGroup,
	addWatchlist,
	removeWatchlist
})(LeaderListDataTbl);