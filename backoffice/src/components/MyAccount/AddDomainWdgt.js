/* 
    Developer : Salim Deraiya
    Date : 26-11-2018
    File Comment : Organization Form Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Label, Form, FormGroup, Input, Alert, Button } from "reactstrap";

// added by Bharat Jograna for Loader and NotificationManager
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";

import MatButton from "@material-ui/core/Button";
//intl messages
import IntlMessages from "Util/IntlMessages";
import { DebounceInput } from 'react-debounce-input';
import { addDomain, getDomainData } from 'Actions/MyAccount';
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";
//Validation
const validateDomain = require("../../validation/MyAccount/domain_form");

class AddDomainWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				AliasName: '',
				DomainName: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '',
				HostName: getHostName(),
			},
			loading: false,
			getListValue: true,
			errors: {}
		};
		this.initState = this.state;
		this.onChange = this.onChange.bind(this);
		this.addDomain = this.addDomain.bind(this);
		this.resetData = this.resetData.bind(this);
	}

	resetData() {
		this.setState(this.initState);
	}

	onChange(event) {
		var newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	addDomain(event) {
		event.preventDefault();
		const { errors, isValid } = validateDomain(this.state.data);
		this.setState({ errors: errors });
		this.setState({ err_alert: false, success_alert: false, errors: errors, get_info: 'show' });
		if (isValid) {
			let self = this;
			var reqObj = Object.assign({}, this.state.data);
			getIPAddress().then(function (ipAddress) {
				reqObj.IPAddress = ipAddress;
				self.props.addDomain(reqObj);
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

		if (nextProps.addEditDomainData.ReturnCode === 1) {
			var errMsg = nextProps.addEditDomainData.ErrorCode === 1 ? nextProps.addEditDomainData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addEditDomainData.ErrorCode}`} />;

			// added by Bharat Jograna for errMsg
			NotificationManager.error(errMsg);

		} else if (nextProps.addEditDomainData.ReturnCode === 0) {
			let success_msg = this.state.get_info === 'hide' ? '' : nextProps.addEditDomainData.ReturnMsg;

			//added by Bharat Jograna for success_msg
			NotificationManager.success(success_msg);

			if (this.state.getListValue) {
				this.props.getDomainData();
				this.setState({ getListValue: false });
			}
		}
	}


	render() {
		const { AliasName, DomainName } = this.state.data;
		const { loading, errors } = this.state;
		return (
			<div className="w-xs-full">
				{loading && <JbsSectionLoader />}
				<Form className="tradefrm">
					<FormGroup className="row">
						<Label for="AliasName" className="control-label col-md-4"><IntlMessages id="sidebar.aliasName" /></Label>
						<div className="col-md-8">
							<DebounceInput className="form-control" minLength={0} debounceTimeout={300} name="AliasName" value={AliasName} id="AliasName" onChange={this.onChange} />
							{/* <Input type="text" name="AliasName" value={AliasName} id="AliasName" onChange={this.onChange} /> */}
							{errors.AliasName && <div className="text-danger text-left"><IntlMessages id={errors.AliasName} /></div>}
						</div>
					</FormGroup>
					<FormGroup className="row">
						<Label for="DomainName" className="control-label col-md-4"><IntlMessages id="sidebar.domainName" /></Label>
						<div className="col-md-8">
							<DebounceInput className="form-control" minLength={0} debounceTimeout={300} name="DomainName" value={DomainName} id="DomainName" onChange={this.onChange} />
							{/* <Input type="text" name="DomainName" value={DomainName} id="DomainName" onChange={this.onChange} /> */}
							{errors.DomainName && <div className="text-danger text-left"><IntlMessages id={errors.DomainName} /></div>}
						</div>
					</FormGroup>
					<FormGroup className="offset-md-4">
						<Button onClick={this.addDomain} color="primary" className="mr-10"><IntlMessages id="sidebar.btnAdd" /></Button>
						<Button onClick={this.resetData} color="danger"><IntlMessages id="sidebar.btnCancel" /></Button>
					</FormGroup>
				</Form>
			</div>
		);
	}
}
const mapPropsToState = ({ domainDashRdcer }) => {
	const { addEditDomainData, loading } = domainDashRdcer;
	return { addEditDomainData, loading };
}

export default connect(mapPropsToState, {
	addDomain,
	getDomainData
})(AddDomainWdgt);
