/**
 * Auther : Salim Deraiya
 * Created : 04/11/2018
 * Edit IP Whitelist Component
 */
import React, { Component, Fragment } from "react";
import { Form, FormGroup, Input, Label, Alert } from "reactstrap";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
//intl messages
import IntlMessages from "Util/IntlMessages";
//Get IP,Hostname,deviceInfo and mode from the helper.js
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";

class EditIPWhitelistDialogWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				SelectedIPAddress: props.SelectedIPAddress,
				IpAliasName: props.IpAliasName,
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
	}

	// open dialog
	open() {
		this.setState({ open: true });
	}

	// close dialog
	close() {
		this.setState({ open: false });
	}

	render() {
		const { SelectedIPAddress, IpAliasName } = this.state.data;
		const { err_alert, err_msg, success_msg, success_alert, errors } = this.state;
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
						<Button className="btn-primary text-white" autoFocus>
							<IntlMessages id="sidebar.btnUpdate" />
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		);
	}
}

export default EditIPWhitelistDialogWdgt;