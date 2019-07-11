/**
 * Auther : Kevin Ladani
 * Add IP Whitelist Component
 */
import React, { Component, Fragment } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { connect } from "react-redux";
import { AddIPToWhitelist } from "Actions/MyAccount";
import IntlMessages from "Util/IntlMessages";
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import validateAllowIPDashboard from "Validations/MyAccount/allow_ip_dashboard"
import {
	getMenuPermissionByID
} from 'Actions/MyAccount';
class AddIPWhitelist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				SelectedIPAddress: '',
				IpAliasName: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '', //getIPAddress(),
				HostName: getHostName()
			},
			loading: false,
			redirect: false,
			firsttime: true,
			errors: {},
			fieldList: {},
			menudetail: [],
			menuLoading: false,
			notificationFlag: true,
		};
		this.initState = this.state;
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ open: false });
		this.setState(this.initState);
	}

	resetData = () => {
		let newObj = Object.assign({}, this.initState);
		newObj.menudetail = this.state.menudetail;
		this.setState(newObj);
		this.props.drawerClose();
	}
	componentWillMount() {
		this.props.getMenuPermissionByID('a9255fc9-19d5-9081-4641-902863327716');

	}
	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.add_loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
		this.setState({ menuLoading: nextProps.menuLoading });

		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				this.props.drawerClose();
			}
		}
		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
		} else if (nextProps.data.statusCode === 200) {
			let newObj = Object.assign({}, this.state.data);
			newObj.SelectedIPAddress = '';
			newObj.IpAliasName = '';
			this.setState({ data: newObj });
			NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
		}
	}


	onChange = (event) => {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	onSubmit = (event) => {
		event.preventDefault();

		const { errors, isValid } = validateAllowIPDashboard(this.state.data);
		this.setState({ errors: errors, redirect: true, firsttime: false });

		if (isValid) {
			let self = this;
			var reqObj = Object.assign({}, this.state.data);
			getIPAddress().then(function (ipAddress) {
				reqObj.IPAddress = ipAddress;
				self.props.AddIPToWhitelist(reqObj);
			});
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
						response = fieldList;
					}
				}
			}
		}
		return response;
	}
	render() {
		const { SelectedIPAddress, IpAliasName } = this.state.data;
		const { drawerClose } = this.props;
		const { loading, errors } = this.state;
		var menuDetail = this.checkAndGetMenuAccessDetail('589080F8-03E1-08AC-0800-666CFFD75798');
		if (!menuDetail) {
			menuDetail = { Utility: [], CrudOption: [] }
		}
		return (
			<Fragment>
				<div className="jbs-page-content">
					<WalletPageTitle title={<IntlMessages id="my_account.allowIP" />} drawerClose={drawerClose} closeAll={this.closeAll} />
					{(this.state.menuLoading || loading) && <JbsSectionLoader />}
					<Form>
						{(menuDetail["4DC7658E-76F5-4BD8-55C1-9FECCBBE692D"] && menuDetail["4DC7658E-76F5-4BD8-55C1-9FECCBBE692D"].Visibility === "E925F86B") && //4DC7658E-76F5-4BD8-55C1-9FECCBBE692D
							<FormGroup className="has-wrapper row">
								<Label for="IpAliasName" className="control-label col"><IntlMessages id="my_account.IPWhitelis.addColumn.aliasName" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="myaccount.enterIPAliasName">
										{(placeholder) =>
											<Input disabled={(menuDetail["4DC7658E-76F5-4BD8-55C1-9FECCBBE692D"].AccessRight === "11E6E7B0") ? true : false} type="text" tabIndex="1" name="IpAliasName" value={IpAliasName} id="IpAliasName" placeholder={placeholder} onChange={this.onChange} />
										}
									</IntlMessages>
									{errors.IpAliasName && <span className="text-danger text-left"><IntlMessages id={errors.IpAliasName} /></span>}
								</div>
							</FormGroup>
						}
						{(menuDetail["A75C375C-3D15-47F7-8CB9-B85705FE95C3"] && menuDetail["A75C375C-3D15-47F7-8CB9-B85705FE95C3"].Visibility === "E925F86B") && //A75C375C-3D15-47F7-8CB9-B85705FE95C3
							<FormGroup className="has-wrapper row">
								<Label for="SelectedIPAddress" className="control-label col"><IntlMessages id="my_account.IPWhitelis.addColumn.ip" /><span className="text-danger">*</span></Label>
								<div className="col-md-8 col-sm-8 col-xs-12">
									<IntlMessages id="myaccount.enterIPAddress">
										{(placeholder) =>
											<Input disabled={(menuDetail["A75C375C-3D15-47F7-8CB9-B85705FE95C3"].AccessRight === "11E6E7B0") ? true : false} type="text" tabIndex="2" maxLength={15} name="SelectedIPAddress" value={SelectedIPAddress} id="SelectedIPAddress" placeholder={placeholder} onChange={this.onChange} />
										}
									</IntlMessages>
									{errors.SelectedIPAddress && <span className="text-danger text-left"><IntlMessages id={errors.SelectedIPAddress} /></span>}
								</div>
							</FormGroup>
						}
						{Object.keys(menuDetail).length > 0 &&
							<FormGroup row>
								<div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
									<div className="btn_area">
										<Button disabled={loading} type="submit" color="primary" variant="raised" onClick={this.onSubmit}><IntlMessages id="button.submit" /></Button>
										<Button variant="raised" color="danger" className="ml-15" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
									</div>
								</div>
							</FormGroup>
						}
					</Form>
				</div>
			</Fragment>
		);
	}
}

//map state to props
const mapStateToProps = ({ ipwhitelistDashboard, authTokenRdcer }) => {
	var response = {
		data: ipwhitelistDashboard.addData,
		add_loading: ipwhitelistDashboard.add_loading,
		menuLoading: authTokenRdcer.menuLoading,
		menu_rights: authTokenRdcer.menu_rights

	};
	return response;
};

export default connect(mapStateToProps, {
	AddIPToWhitelist,
	getMenuPermissionByID
})(AddIPWhitelist);