/* 
    Createdby : Dhara gajera
	CreatedDate : 27-12-2018
	Updated :2/1/2019 by dhara
    Description : Update chat user block status
*/
import React, { Component, Fragment } from 'react';
import { Form, FormGroup, Label, Button } from 'reactstrap';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { changeBlockUserChatStatus, getSingleUserData } from 'Actions/ChatDashboard';
import { DashboardPageTitle } from '../DashboardPageTitle';
import { DebounceInput } from 'react-debounce-input';
import { Alert } from "reactstrap";
import Switch from 'react-toggle-switch';
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
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.chatuserlist" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.editChatuserblockList" />,
		link: '',
		index: 0
	}
];
const validateChatListBlockInput = require('../../../validation/Chat/userBlock');

class EditCHatUserBlockStatus extends Component {

	constructor(props) {
		super(props);
		// default ui local state
		this.state = {
			loading: false, // loading activity
			errors: {},
			err_alert: true,
			showError: false,
			showSuccess: false,
			update_error: "",
			switched: false,
			name: "",
			uname: "",
			Email: "",
			Mobile: "",
			blockReason: "",
			btn_disabled: false, // Added By Megha Kariya (08/02/2019)
			fieldList: {},
			menudetail: [],
			Pflag: true,
		};
		this.initState = {
			loading: false, // loading activity
			errors: {},
			err_alert: true,
			showError: false,
			showSuccess: false,
			update_error: "",
			blockReason: "",
			btn_disabled: false,
		}
		this.onUpdateBlockStatusDetails = this.onUpdateBlockStatusDetails.bind(this);
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

	//Update chat user block Detail
	changeBlockUserChatStatus() {
		const updateData = {
			blockReason: this.state.blockReason,
			IsBlocked: this.state.switched,
			prevIsBlocked: this.props.chatUserlistData.IsBlocked  // Added by Jayesh 25-01-2019
		}
		const { errors, isValid } = validateChatListBlockInput(updateData);

		this.setState({ err_alert: true, errors: errors, btn_disabled: true }); // Added By Megha Kariya (08/02/2019) : Add btn_disabled
		if (!isValid) {
			let data = {
				Username: this.state.uname,
				Reason: this.state.blockReason,
				IsBlocked: this.state.switched
			}
			setTimeout(() => {
				this.props.changeBlockUserChatStatus(data);
				this.setState({ loading: true });
			}, 500);
		}
		else { // Added By Megha Kariya (08/02/2019)
			this.setState({ btn_disabled: false });
		}
	}
	componentWillMount() {
		this.props.getMenuPermissionByID('550A8B6B-34F5-3328-32D3-FE1C19DD359B');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				//to set first user data on edit form as 1st time will come here not in componentWillReceiveProps 
				if (typeof this.props.chatUserlistData !== 'undefined' && this.props.chatUserlistData !== '') {
					this.setState({ switched: this.props.chatUserlistData.IsBlocked });
					this.setState({ name: this.props.chatUserlistData.Name });
					this.setState({ uname: this.props.chatUserlistData.UserName });
					this.setState({ Email: this.props.chatUserlistData.Email });
					this.setState({ Mobile: this.props.chatUserlistData.Mobile });
					this.setState({ blockReason: "", btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : Add btn_disabled
				}
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					this.props.drawerClose();
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		//to Set data in edit form
		if (typeof nextProps.chatUserlistData !== 'undefined' && nextProps.chatUserlistData !== '' && typeof nextProps.statusChecker != 'undefined' && nextProps.statusChecker == 0) {
			this.setState({ switched: nextProps.chatUserlistData.IsBlocked });
			this.setState({ name: nextProps.chatUserlistData.Name });
			this.setState({ uname: nextProps.chatUserlistData.UserName });
			this.setState({ Email: nextProps.chatUserlistData.Email });
			this.setState({ Mobile: nextProps.chatUserlistData.Mobile });
			this.setState({ blockReason: "", btn_disabled: false }); // Added By Megha Kariya (08/02/2019) : Add btn_disabled
		}
		//on update success move on list
		if (typeof nextProps.statusupdatedData != 'undefined' && nextProps.statusupdatedData != null && nextProps.statusupdatedData != "" && nextProps.statusupdatedData.ReturnCode == 0) {
			this.setState({ loading: false, showSuccess: true, update_error: nextProps.statusupdatedData.ReturnMsg, btn_disabled: false });// Added By Megha Kariya (08/02/2019) : Add btn_disabled
			setTimeout(function () {
				this.setState({ showSuccess: false, update_error: '', err_alert: false });
				this.props.drawerClose();
				this.props.reload();
			}.bind(this), 4000);
		} else if (typeof nextProps.errors != 'undefined' && nextProps.errors.ReturnCode == 9) { //on from API error
			this.setState({ loading: false, showError: true, update_error: nextProps.errors.ReturnMsg, btn_disabled: false })  // Added By Megha Kariya (08/02/2019): add btn_disabled
			setTimeout(function () {
				this.setState({ showError: false, update_error: '', err_alert: false });
			}.bind(this), 3000);
		}
	}

	closeAll = () => {
		this.setState(this.initState);
		this.props.closeAll();
		this.setState({ open: false });
	}

	toggleSwitch = () => {
		this.setState(prevState => {
			return {
				switched: !prevState.switched
			};
		});
	};
	onUpdateBlockStatusDetails(key, value) {
		this.setState({ [key]: value });
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
		var menudetail = this.checkAndGetMenuAccessDetail('F0A55B77-8010-888E-8CAE-8EC5A2C26ED7');

		const { err_alert, errors, loading, btn_disabled } = this.state; // Added By Megha Kariya (08/02/2019) : add btn_disabled
		const { drawerClose } = this.props;
		return (
			<Fragment>
				<div className="jbs-page-content">
					<DashboardPageTitle title={<IntlMessages id="sidebar.editChatuserblockList" />} breadCrumbData={BreadCrumbData} drawerClose={this.resetData} closeAll={this.closeAll} />
					{(loading || this.props.menuLoading) && <JbsSectionLoader />}

					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}

					<div className="StackingHistory">

						<Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
							{this.state.update_error}
						</Alert>
						<Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
							{this.state.update_error}
						</Alert>

						<Form className="tradefrm1">
							{(menudetail["5877BD49-8579-0F93-39D1-817C2243790C"] && menudetail["5877BD49-8579-0F93-39D1-817C2243790C"].Visibility === "E925F86B") && //5877BD49-8579-0F93-39D1-817C2243790C
								<FormGroup className="row">
									<div className="col-md-2 col-sm-3 col-xs-6">
										<Label className="mb-0"><IntlMessages id="chatuserlist.title.name" /> :</Label>
									</div>
									<div className="col-md-10 col-sm-9 col-xs-6">
										<Label> {this.state.name && (this.state.name).trim() != '' ? this.state.name : '-'}</Label>
									</div>
								</FormGroup>}
							{(menudetail["1D9D7490-964F-1F52-49EA-915994B51B35"] && menudetail["1D9D7490-964F-1F52-49EA-915994B51B35"].Visibility === "E925F86B") && //1D9D7490-964F-1F52-49EA-915994B51B35
								<FormGroup className="row">
									<div className="col-md-2 col-sm-3 col-x">
										<Label className="mb-0"><IntlMessages id="chatUserListEdit.form.label.username" /> :</Label>
									</div>
									<div className="col-md-10 col-sm-9 col-xs-6">
										<Label> {this.state.uname && (this.state.uname).trim() != '' ? this.state.uname : '-'}</Label>
									</div>
								</FormGroup>}
							{(menudetail["E961C07E-2DE1-4842-9D4E-FFD817F07EA1"] && menudetail["E961C07E-2DE1-4842-9D4E-FFD817F07EA1"].Visibility === "E925F86B") && //E961C07E-2DE1-4842-9D4E-FFD817F07EA1
								<FormGroup className="row">
									<div className="col-md-2 col-sm-3 col-x">
										<Label><IntlMessages id="chatuserlist.title.email" /> :</Label>
									</div>
									<div className="col-md-10 col-sm-9 col-xs-6">
										<Label> {this.state.Email && (this.state.Email).trim() != '' ? this.state.Email : '-'}</Label>
									</div>
								</FormGroup>}
							{(menudetail["90955277-8380-78FC-2FFF-8BE7E1E0024E"] && menudetail["90955277-8380-78FC-2FFF-8BE7E1E0024E"].Visibility === "E925F86B") && //90955277-8380-78FC-2FFF-8BE7E1E0024E
								<FormGroup className="row">
									<div className="col-md-2 col-sm-3 col-x">
										<Label><IntlMessages id="chatuserlist.title.mobile" /> :</Label>
									</div>
									<div className="col-md-10 col-sm-9 col-xs-6">
										<Label> {this.state.Mobile && (this.state.Mobile).trim() != '' ? this.state.Mobile : '-'}</Label>
									</div>
								</FormGroup>}
							{(menudetail["9B3506EF-4B3D-15D5-9C2A-167CCE3721BE"] && menudetail["9B3506EF-4B3D-15D5-9C2A-167CCE3721BE"].Visibility === "E925F86B") && //9B3506EF-4B3D-15D5-9C2A-167CCE3721BE
								<FormGroup className="row">
									<div className="col-md-2 col-sm-3 col-x">
										<Label><IntlMessages id="chatuserlist.title.switchstatus" /> :</Label>
									</div>
									<div className="col-md-10 col-sm-9 col-xs-6">
										<Switch
											enabled={(menudetail['9B3506EF-4B3D-15D5-9C2A-167CCE3721BE'].AccessRight === "11E6E7B0") ? false : true}
											onClick={this.toggleSwitch} on={this.state.switched} />
										{errors.IsBlocked && <span className="text-danger"><IntlMessages id={errors.IsBlocked} /></span>}
									</div>
								</FormGroup>}
							{(menudetail["46F51375-A28A-3129-633C-EE56626650BD"] && menudetail["46F51375-A28A-3129-633C-EE56626650BD"].Visibility === "E925F86B") && //46F51375-A28A-3129-633C-EE56626650BD
								<FormGroup className="row">
									<Label className="col"><IntlMessages id="chatUserListEdit.form.label.reason" /><span className="text-danger">*</span></Label>
									<div className="col-md-10 col-sm-9 col-xs-6">
										<DebounceInput
											readOnly={(menudetail["46F51375-A28A-3129-633C-EE56626650BD"].AccessRight === "11E6E7B0") ? true : false}
											minLength={0}
											debounceTimeout={300}
											className="form-control col-md-10 col-sm-9 col-xs-12 w-50"
											type="text"
											name="blockReason"
											id="blockReason"
											value={this.state.blockReason}
											onChange={(e) => this.onUpdateBlockStatusDetails("blockReason", e.target.value)}
										/>
										{errors.blockReason && <span className="text-danger"><IntlMessages id={errors.blockReason} /></span>}
									</div>
								</FormGroup>}
							{(menudetail) &&
								<FormGroup row>
									<div className="col-md-10 col-sm-9 col-xs-12">
										<div className="btn_area">
											<Button
												className="text-white text-bold btn mr-10"
												variant="raised"
												color="primary"
												onClick={() => this.changeBlockUserChatStatus()}
												disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
											>
												<IntlMessages id="button.update" />
											</Button>

											<Button
												className="text-white text-bold btn"
												variant="raised"
												color="danger"
												onClick={this.resetData}
												disabled={btn_disabled} // Added By Megha Kariya (08/02/2019)
											>
												<IntlMessages id="button.cancel" />
											</Button>
										</div>
									</div>
								</FormGroup>}
						</Form>
					</div>
				</div>
			</Fragment>
		);
	}
}
const mapStateToProps = ({ chatUserList, authTokenRdcer }) => {
	var response = {
		errors: chatUserList.errors,
		loading: chatUserList.loading,
		statusChecker: chatUserList.statusChecker,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights,
	};
	if (typeof chatUserList.chatUserStatus != "undefined" && chatUserList.chatUserStatus != null && chatUserList.chatUserStatus != "") {
		response['statusupdatedData'] = chatUserList.chatUserStatus;
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	changeBlockUserChatStatus,
	// getSingleUserData,
	getMenuPermissionByID,
})(EditCHatUserBlockStatus));