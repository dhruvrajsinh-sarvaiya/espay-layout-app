/**
 * Auther : Salim Deraiya
 * Created : 04/11/2018
 * Edit IP Whitelist Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
// redux action
import { AddIPToWhitelist } from "Actions/MyAccount";
//intl messages
import IntlMessages from "Util/IntlMessages";
//Get IP,Hostname,deviceInfo and mode from the helper.js
import { 
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";

//Validation
const validateAddIPWhiteList = require("../../validation/MyAccount/add_ipwhitelist");

class EditIPWhitelistDialogWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				SelectedIPAddress: props.SelectedIPAddress,
				IpAliasName : props.IpAliasName,
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: getIPAddress(),
				HostName: getHostName()
			},
			err_msg: '',
			err_alert: true,
			success_msg: '',
			success_alert: true,
			loading: false,
			open: false,
			errors: {}
		};

		/* this.onDismiss = this.onDismiss.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this); */
	}

	componentWillReceiveProps(nextProps) {
		console.log('Props',nextProps);
		/* this.setState({ loading: nextProps.add_loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

		if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			this.setState({ err_alert: true, err_msg: errMsg });
		} else if (nextProps.data.statusCode === 200) {
			let newObj = Object.assign({}, this.state.data);
			newObj.SelectedIPAddress = '';
			newObj.IpAliasName = '';
			this.setState({ 
				success_msg: this.state.firsttime ? '' : nextProps.data.ReturnMsg, 
				success_alert: this.state.firsttime ? false : true,
				data : newObj
			});
		} */
	}

	// open dialog
	open() {
		this.setState({ open: true });
	 }
  
	 // close dialog
	 close() {
		this.setState({ open: false });
	 }

	/* onDismiss() {
		this.setState({ err_alert: false, success_alert: false });
	}

	onChange(event) {
		let newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}

	onSubmit(event) {
		event.preventDefault();
		
		const { errors, isValid } = validateAddIPWhiteList(this.state.data);
		this.setState({ err_alert: false, success_alert: false, errors: errors, redirect : true, firsttime : false });

		if (isValid) {
			this.props.AddIPToWhitelist(this.state.data);
		}
	} */

	render() {
		const { SelectedIPAddress, IpAliasName } = this.state.data;
		const { err_alert, err_msg, success_msg, success_alert, loading, errors } = this.state;
		return (
			<Fragment>
				<Dialog
					open={this.state.open}
					onClose={() => this.close()}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">Edit IPWhitelist</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{success_msg && <div className="alert_area">
								<Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
							</div>}
							{err_msg && <div className="alert_area">
								<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
							</div>}
							<Form>
								<FormGroup className="has-wrapper row">
									<Label for="IpAliasName" className="control-label text-right col-md-4"><IntlMessages id="my_account.IPWhitelis.addColumn.aliasName" /></Label>
									<div className="col-md-8">
										<Input type="text" name="IpAliasName" value={IpAliasName} id="IpAliasName" onChange={this.onChange} />
										{errors.IpAliasName && <span className="text-danger text-left"><IntlMessages id={errors.IpAliasName} /></span>}
									</div>
								</FormGroup>
								<FormGroup className="has-wrapper row">
									<Label for="SelectedIPAddress" className="control-label text-right col-md-4"><IntlMessages id="my_account.IPWhitelis.addColumn.ip" /></Label>
									<div className="col-md-8">
										<Input type="text" name="SelectedIPAddress" value={SelectedIPAddress} id="SelectedIPAddress" onChange={this.onChange} />
										{errors.SelectedIPAddress && <span className="text-danger text-left"><IntlMessages id={errors.SelectedIPAddress} /></span>}
									</div>
								</FormGroup>
							</Form>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
					<Button onClick={() => this.close()} className="btn-danger text-white">
						<IntlMessages id="sidebar.btnCancel" />
					</Button>
					<Button  className="btn-primary text-white" autoFocus>
						<IntlMessages id="sidebar.btnUpdate" />
					</Button>
					</DialogActions>
				</Dialog>
				{/* <div className="p-30">
					{loading && <div className="text-center py-40"><CircularProgress className="progress-primary" /></div>}
					{success_msg && <div className="alert_area">
						<Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
					</div>}
					{err_msg && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
					</div>}
					<Form>
						<FormGroup className="has-wrapper row">
							<Label for="IpAliasName" className="control-label text-right col-md-4"><IntlMessages id="my_account.IPWhitelis.addColumn.aliasName" /></Label>
							<div className="col-md-8">
								<Input type="text" name="IpAliasName" value={IpAliasName} id="IpAliasName" placeholder="Enter Alias name" onChange={this.onChange} />
								{errors.IpAliasName && <span className="text-danger text-left"><IntlMessages id={errors.IpAliasName} /></span>}
							</div>
						</FormGroup>
						<FormGroup className="has-wrapper row">
							<Label for="SelectedIPAddress" className="control-label text-right col-md-4"><IntlMessages id="my_account.IPWhitelis.addColumn.ip" /></Label>
							<div className="col-md-8">
								<Input type="text" name="SelectedIPAddress" value={SelectedIPAddress} id="SelectedIPAddress" placeholder="Enter Ip Address" onChange={this.onChange} />
								{errors.SelectedIPAddress && <span className="text-danger text-left"><IntlMessages id={errors.SelectedIPAddress} /></span>}
							</div>
						</FormGroup>
						<div className="has-wrapper row">
							<div className="offset-md-4 col-md-8">
								<div className="row">
									<div className="col-md-6">
										<Button disabled={loading} className="rounded-0 border-0" color="primary" onClick={this.onSubmit}>
											<IntlMessages id="my_account.ipWhitelist.addIPWhitelist" />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Form>
				</div> */}
			</Fragment>
		);
	}
}

// map state to props
/* const mapStateToProps = ({ ipWhitelist }) => {
	var response = {
		data: ipWhitelist.addData,
		add_loading: ipWhitelist.add_loading
	};
	return response;
};

export default connect(mapStateToProps, {
	AddIPToWhitelist
})(EditIPWhitelistDialogWdgt); */
export default EditIPWhitelistDialogWdgt;