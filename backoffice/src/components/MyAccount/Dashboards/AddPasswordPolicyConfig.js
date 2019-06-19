/* 
    Developer : Salim Deraiya
    Date : 10-01-2019
    File Comment : MyAccount Add Password Policy Configuration Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Label, Form, FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addPasswordPolicyData } from 'Actions/MyAccount';
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import validatePasswordPolicy from "Validations/MyAccount/password_policy"
import {
	getMenuPermissionByID
} from 'Actions/MyAccount';
//Component for MyAccount Add Password Policy Configuration Dashboard
class AddPasswordPolicyConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				PwdExpiretime: '',
				MaxfppwdDay: '',
				MaxfppwdMonth: '',
				LinkExpiryTime: '',
				OTPExpiryTime: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '',
				HostName: getHostName(),
			},
			loading: false,
			getListValue: true,
			errors: {},
			Ntf_flage: true,
			dataList: {},
			fieldList: {},
			menudetail: [],
			menuLoading: false,
			notificationFlag: true,
		}
		this.initState = this.state;
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
	}

	resetData = () => {
		this.setState(this.initState);
		this.props.drawerClose();
		this.setState({ menudetail: this.state.menudetail, Ntf_flage: this.state.Ntf_flage })
	}

	onChange = (event) => {
		var newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	onSubmit = (event) => {
		event.preventDefault();
		const { errors, isValid } = validatePasswordPolicy(this.state.data);
		this.setState({ errors: errors });
		this.setState({ errors: errors, get_info: 'show' });
		if (isValid) {
			let self = this;
			var reqObj = Object.assign({}, this.state.data);
			getIPAddress().then(function (ipAddress) {
				reqObj.IPAddress = ipAddress;
				self.props.addPasswordPolicyData(reqObj);
			});
		}
	}

	componentWillMount() {
		this.props.getMenuPermissionByID('B477822D-4E20-8F0C-99DC-D0A25F4595ED'); // get myaccount menu permission
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

		if (this.state.Ntf_flage && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
			this.setState({ Ntf_flage: false })
		} else if (this.state.Ntf_flage && nextProps.data.ReturnCode === 0) {
			NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
			this.setState({ Ntf_flage: false })
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
		const { PwdExpiretime, MaxfppwdDay, MaxfppwdMonth, LinkExpiryTime, OTPExpiryTime } = this.state.data;
		const { loading, errors, fieldList } = this.state;
		const { drawerClose } = this.props;
		var menuDetail = this.checkAndGetMenuAccessDetail('0049a5f5-092d-3118-2aae-8c8c13a57d1c');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
		return (
			<div className="jbs-page-content">
				<WalletPageTitle title={<IntlMessages id="my_account.addPasswordPolicy" />} drawerClose={drawerClose} closeAll={this.closeAll} />
				{(this.props.menuLoading || loading) && <JbsSectionLoader />}
				<div>
					<Form className="tradefrm">
						{(menuDetail["841C02FB-0964-59AF-9DF0-B740B2EB8755"] && menuDetail["841C02FB-0964-59AF-9DF0-B740B2EB8755"].Visibility === "E925F86B") && //841C02FB-0964-59AF-9DF0-B740B2EB8755
							<FormGroup className="row">
								<Label for="PwdExpiretime" className="control-label col"><IntlMessages id="my_account.expireTime" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="sidebar.days">
										{(placeholder) =>
											<Input disabled={(menuDetail["841C02FB-0964-59AF-9DF0-B740B2EB8755"].AccessRight === "11E6E7B0") ? true : false} type="text" name="PwdExpiretime" value={PwdExpiretime} id="PwdExpiretime" placeholder={placeholder} onChange={this.onChange} />
										}
									</IntlMessages>
									{errors.PwdExpiretime && <div className="text-danger text-left"><IntlMessages id={errors.PwdExpiretime} /></div>}
								</div>
							</FormGroup>
						}
						{(menuDetail["4B430337-10A7-7DB2-00D7-3236E3FB7025"] && menuDetail["4B430337-10A7-7DB2-00D7-3236E3FB7025"].Visibility === "E925F86B") && //4B430337-10A7-7DB2-00D7-3236E3FB7025
							<FormGroup className="row">
								<Label for="MaxfppwdDay" className="control-label col"><IntlMessages id="my_account.forgotPassword" /><span className="text-danger">*</span></Label>
								<div className="col-md-4 col-sm-4 col-xs-4">
									<IntlMessages id="sidebar.days">
										{(placeholder) =>
											<Input disabled={(menuDetail["4B430337-10A7-7DB2-00D7-3236E3FB7025"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MaxfppwdDay" value={MaxfppwdDay} id="MaxfppwdDay" placeholder={placeholder} onChange={this.onChange} />
										}
									</IntlMessages>
									{errors.MaxfppwdDay && <div className="text-danger text-left"><IntlMessages id={errors.MaxfppwdDay} /></div>}
								</div>

								<div className="col-md-4 col-sm-4 col-xs-4">
									<IntlMessages id="sidebar.months">
										{(placeholder) =>
											<Input disabled={(menuDetail["4B430337-10A7-7DB2-00D7-3236E3FB7025"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MaxfppwdMonth" value={MaxfppwdMonth} id="MaxfppwdMonth" placeholder={placeholder} onChange={this.onChange} />
										}
									</IntlMessages>
									{errors.MaxfppwdMonth && <div className="text-danger text-left"><IntlMessages id={errors.MaxfppwdMonth} /></div>}
								</div>
							</FormGroup>
						}
						{(menuDetail["BEE7CCF3-6B3F-A49B-69D4-08448B4B32AE"] && menuDetail["BEE7CCF3-6B3F-A49B-69D4-08448B4B32AE"].Visibility === "E925F86B") && //BEE7CCF3-6B3F-A49B-69D4-08448B4B32AE
							<FormGroup className="row">
								<Label for="LinkExpiryTime" className="control-label col"><IntlMessages id="my_account.linkExpireTime" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="sidebar.minutes">
										{(placeholder) =>
											<Input disabled={(menuDetail["BEE7CCF3-6B3F-A49B-69D4-08448B4B32AE"].AccessRight === "11E6E7B0") ? true : false} type="text" name="LinkExpiryTime" value={LinkExpiryTime} id="LinkExpiryTime" placeholder={placeholder} onChange={this.onChange} />
										}
									</IntlMessages>
									{errors.LinkExpiryTime && <div className="text-danger text-left"><IntlMessages id={errors.LinkExpiryTime} /></div>}
								</div>
							</FormGroup>
						}
						{(menuDetail["F910CBC4-2040-0D1C-A281-07E78F7E056D"] && menuDetail["F910CBC4-2040-0D1C-A281-07E78F7E056D"].Visibility === "E925F86B") && //F910CBC4-2040-0D1C-A281-07E78F7E056D
							<FormGroup className="row">
								<Label for="OTPExpiryTime" className="control-label col"><IntlMessages id="my_account.otpExpireTime" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="sidebar.minutes">
										{(placeholder) =>
											<Input disabled={(menuDetail["F910CBC4-2040-0D1C-A281-07E78F7E056D"].AccessRight === "11E6E7B0") ? true : false} type="text" name="OTPExpiryTime" value={OTPExpiryTime} id="OTPExpiryTime" placeholder={placeholder} onChange={this.onChange} />
										}
									</IntlMessages>
									{errors.OTPExpiryTime && <div className="text-danger text-left"><IntlMessages id={errors.OTPExpiryTime} /></div>}
								</div>
							</FormGroup>
						}
						{(menuDetail &&
							<FormGroup row>
								<div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
									<div className="btn_area">
										<Button variant="raised" onClick={this.onSubmit} color="primary"><IntlMessages id="sidebar.btnAdd" /></Button>
										<Button variant="raised" onClick={this.resetData} color="danger" className="ml-15"><IntlMessages id="sidebar.btnCancel" /></Button>
									</div>
								</div>
							</FormGroup>
						)}
					</Form>
				</div>
			</div>
		);
	}
}

const mapPropsToState = ({ passwordPolicyRdcer, authTokenRdcer }) => {
	const { data, loading } = passwordPolicyRdcer;
	const { menuLoading, menu_rights } = authTokenRdcer;
	return { data, loading, menuLoading, menu_rights };
}

export default connect(mapPropsToState, {
	addPasswordPolicyData,
	getMenuPermissionByID
})(AddPasswordPolicyConfig);