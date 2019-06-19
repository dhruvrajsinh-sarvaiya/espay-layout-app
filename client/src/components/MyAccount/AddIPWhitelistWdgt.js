/**
 * Auther : Kevin Ladani
 * Created : 09/10/2018
 * Updated : 24/10/2018 (Salim Deraiya)
 * Add IP Whitelist Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { AddIPToWhitelist,listIPWhitelist } from "Actions/MyAccount";
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
const validateAddIPWhiteList = require("../../validation/MyAccount/add_ipwhitelist");


class AddIPWhitelist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				SelectedIPAddress: '',
				IpAliasName: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '',
				HostName: getHostName()
			},
			datalist: {
				PageIndex: 0,
				Page_Size: AppConfig.totalRecordDisplayInList,
				FromDate: new Date().toISOString().slice(0, 10),
				ToDate: new Date().toISOString().slice(0, 10),
			},
			loading: false,
			redirect: false,
			firsttime: true,
			errors: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}


	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.add_loading });

		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.statusCode === 200) {
			let newObj = Object.assign({}, this.state.data);
			newObj.SelectedIPAddress = '';
			newObj.IpAliasName = '';
			NotificationManager.success(nextProps.data.ReturnMsg);
			this.setState({
				data: newObj
			});
			this.props.listIPWhitelist(this.state.datalist);
		}
	}

	onChange(event) {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}
	onCancel() {
		this.setState({
			data: {
				SelectedIPAddress: '',
				IpAliasName: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '',
				HostName: getHostName()
			},
			errors:''
	})
}
	onSubmit(event) {
		event.preventDefault();

		const { errors, isValid } = validateAddIPWhiteList(this.state.data);
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

	render() {
		const { SelectedIPAddress, IpAliasName } = this.state.data;
		const { loading, errors } = this.state;
		return (
			<Fragment>
				<div className="p-30">
					{loading && <JbsSectionLoader />}
					<Form>
						<FormGroup className="has-wrapper row">
							<Label for="IpAliasName" className="control-label col"><IntlMessages id="my_account.IPWhitelis.addColumn.aliasName" /><span className="text-danger">*</span></Label>
							<div className="col-md-8">
								<IntlMessages id="myaccount.enterIPAliasName">
									{(placeholder) =>
										<Input type="text" tabIndex="1" name="IpAliasName" value={IpAliasName} id="IpAliasName" placeholder={placeholder} onChange={this.onChange} />
									}
								</IntlMessages>
								{errors.IpAliasName && <span className="text-danger text-left"><IntlMessages id={errors.IpAliasName} /></span>}
							</div>
						</FormGroup>
						<FormGroup className="has-wrapper row">
							<Label for="SelectedIPAddress" className="control-label col"><IntlMessages id="my_account.IPWhitelis.addColumn.ip" /><span className="text-danger">*</span></Label>
							<div className="col-md-8">
								<IntlMessages id="myaccount.enterIPAddress">
									{(placeholder) =>
										<Input type="text" tabIndex="2" name="SelectedIPAddress" value={SelectedIPAddress} id="SelectedIPAddress" placeholder={placeholder} onChange={this.onChange} />
									}
								</IntlMessages>
								{errors.SelectedIPAddress && <span className="text-danger text-left"><IntlMessages id={errors.SelectedIPAddress} /></span>}
							</div>
						</FormGroup>
						<FormGroup>
							<div className="offset-md-4 btn_area">
								<Button disabled={loading} tabIndex="3" type="submit" className="rounded-0 border-0 perverbtn" variant="raised" onClick={this.onSubmit}><IntlMessages id="button.submit" /></Button>
								<Button disabled={loading} tabIndex="3" className="ml-15 rounded-0 border-0 btn-danger" variant="raised" onClick={this.onCancel}><IntlMessages id="sidebar.btnCancel" /></Button>
							</div>
						</FormGroup>
					</Form>
				</div>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ ipWhitelist }) => {
	var response = {
		data: ipWhitelist.addData,
		add_loading: ipWhitelist.add_loading
	};
	return response;
};

export default connect(mapStateToProps, {
	AddIPToWhitelist,
	listIPWhitelist
})(AddIPWhitelist);