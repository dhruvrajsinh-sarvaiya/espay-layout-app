/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Change Password Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormGroup, Label, Form, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { changePasswordData } from "Actions/MyAccount";
import validateChangePasswordDashboard from "Validations/MyAccount/change_password_dashboard"
import {
	getMenuPermissionByID
} from 'Actions/MyAccount';
class ChangePasswordDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			},
			loading: false,
			errors: {},
			fieldList: {},
			Ntf_flag: true,
			menudetail: [],
			menuLoading: false,
			notificationFlag: true,
		};
		this.initState = this.state;
	}
	componentWillMount() {
		this.props.getMenuPermissionByID('6302D98A-830A-96E3-0955-7ACCE2921EE4');

	}
	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				this.props.drawerClose();
			}
		}
		if (this.state.Ntf_flag && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
			this.setState({ Ntf_flag: false })
		} else if (this.state.Ntf_flag && (nextProps.data.statusCode === 200)) {
			setTimeout(function () {
				NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
				this.setState({ Ntf_flag: false })
				this.props.drawerClose();
				this.resetData();
			}, 2000)
		}
	}

	resetData = () => {
		let newObj = Object.assign({}, this.initState);
		newObj.menudetail = this.state.menudetail;
		this.setState(newObj);
		this.props.drawerClose();
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
		this.setState(this.initState);

	};

	showComponent = componentName => {
		this.setState({
			componentName: componentName,
			open: this.state.open ? false : true
		});
	};

	handleChange = (event) => {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	OnChangePassword = (event) => {
		event.preventDefault();
		const { errors, isValid } = validateChangePasswordDashboard(this.state.data);
		this.setState({ errors: errors });
		if (isValid) {
			const { currentPassword, newPassword, confirmPassword } = this.state.data;
			let changeObj = {
				oldPassword: currentPassword,
				newPassword: newPassword,
				confirmPassword: confirmPassword
			}
			this.props.changePasswordData(changeObj);
		}
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
							fieldList[item.GUID] = item;
						});
						response = fieldList;
					}
				}
			}
		}
		return response;
	}
	render() {
		const { drawerClose } = this.props;
		const { loading, errors } = this.state;
		var menuDetail = this.checkAndGetMenuAccessDetail('14c823be-2c2a-6a86-9adb-8ce3204f2fe8');
		if (!menuDetail) {
			menuDetail = { Utility: [], CrudOption: [] }
		}
		return (
			<div className="jbs-page-content">
				<WalletPageTitle title={<IntlMessages id="my_account.changePassword" />} drawerClose={drawerClose} closeAll={this.closeAll} />
				{(this.state.menuLoading || loading) && <JbsSectionLoader />}
				<div className="jbs-page-content col-md-12 mx-auto">
					<Form>
						{(menuDetail["404831fa-9ed2-505c-5c9d-01ffb403656d"] && menuDetail["404831fa-9ed2-505c-5c9d-01ffb403656d"].Visibility === "E925F86B") && //404831FA-9ED2-505C-5C9D-01FFB403656D
							<FormGroup row>
								<Label for="currentPassword" className="control-label col" ><IntlMessages id="my_account.currentPassword" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="myaccount.enterCurrentPassword">
										{(placeholder) =>
											/*Added By Bharat Jograna */
											<Input disabled={(menuDetail["404831fa-9ed2-505c-5c9d-01ffb403656d"].AccessRight === "11E6E7B0") ? true : false} type="password" name="currentPassword" placeholder={placeholder} id="oldPassword" onChange={this.handleChange} />
										}
									</IntlMessages>
									{errors.currentPassword && (<span className="text-danger"><IntlMessages id={errors.currentPassword} /></span>)}
								</div>
							</FormGroup>
						}
						{(menuDetail["3c3afc43-9085-4386-7261-3bf6b9245067"] && menuDetail["3c3afc43-9085-4386-7261-3bf6b9245067"].Visibility === "E925F86B") && //3C3AFC43-9085-4386-7261-3BF6B9245067
							<FormGroup row>
								<Label for="newPassword" className="control-label col"><IntlMessages id="my_account.newPassword" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="myaccount.enterNewPassword">
										{(placeholder) =>
											/*Added By Bharat Jograna */
											<Input disabled={(menuDetail["3c3afc43-9085-4386-7261-3bf6b9245067"].AccessRight === "11E6E7B0") ? true : false} type="password" name="newPassword" id="newPassword" placeholder={placeholder} onChange={this.handleChange} />
										}
									</IntlMessages>
									{errors.newPassword && (<span className="text-danger"><IntlMessages id={errors.newPassword} /></span>)}
								</div>
							</FormGroup>
						}
						{(menuDetail["75279f0b-9468-3b1b-24f1-84180e211422"] && menuDetail["75279f0b-9468-3b1b-24f1-84180e211422"].Visibility === "E925F86B") && //75279F0B-9468-3B1B-24F1-84180E211422
							<FormGroup row>
								<Label for="confirmPassword" className="control-label col"><IntlMessages id="my_account.confirmPassword" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="myaccount.enterConfirmPassword">
										{(placeholder) =>
											/*Added By Bharat Jograna */
											<Input disabled={(menuDetail["75279f0b-9468-3b1b-24f1-84180e211422"].AccessRight === "11E6E7B0") ? true : false} type="password" name="confirmPassword" id="confirmPassword" placeholder={placeholder} onChange={this.handleChange} />
										}
									</IntlMessages>
									{errors.confirmPassword && (<span className="text-danger"><IntlMessages id={errors.confirmPassword} /></span>)}
								</div>
							</FormGroup>
						}
						{Object.keys(menuDetail).length > 0 &&
							<FormGroup row>
								<div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
									<div className="btn_area">
										<Button variant="raised" disabled={loading} color="primary" className="text-white" onClick={this.OnChangePassword}><IntlMessages id="my_account.changePasswordBtn" /></Button>
										<Button variant="raised" className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
									</div>
								</div>
							</FormGroup>
						}
					</Form>
				</div>
			</div>
		);
	}
}

const mapToProps = ({ changePasswordDashboard, authTokenRdcer }) => {
	const { data, loading } = changePasswordDashboard;
	const { menuLoading, menu_rights } = authTokenRdcer;
	return { data, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
	changePasswordData,
	getMenuPermissionByID,
})(ChangePasswordDashboard);