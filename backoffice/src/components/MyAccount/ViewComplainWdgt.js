/**
 * CreatedBy : Salim Deraiya
 * Date :08/10/2018
 * Complain Reports
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormGroup, Input, Label, Alert } from "reactstrap";
import { changeDateFormat } from "Helpers/helpers";
//redux action
import { getComplainById, replayComplain } from "Actions/MyAccount";
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";

// intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
const validateComplainForm = require("../../validation/MyAccount/complain_form");

class ViewComplainWdgt extends Component {
	constructor(props) {
		super();
		this.state = {
			replyData: {
				ComplainId: '',
				description: '',
				remark: '',
				ComplainstatusId: 0,
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '',
				HostName: getHostName(),
			},
			err_msg: '',
			err_alert: true,
			success_msg: '',
			success_alert: true,
			loading: false,
			errors: {},
			list: [],
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillMount() {
		var cId = this.props.location.state.id;
		var status = this.props.location.state.status;
		var reqObj = Object.assign({}, this.state.replyData);
		reqObj.ComplainId = this.props.location.state.id;

		if (status === 'Open') {
			reqObj.ComplainstatusId = 1;
		}
		else if (status === 'Close') {
			reqObj.ComplainstatusId = 2;
		} else {
			reqObj.ComplainstatusId = 3;
		}

		//reqObj.ComplainId = this.props.location.state.id;
		this.setState({ replyData: reqObj });

		if (cId !== "") {
			this.props.getComplainById(cId);
		} else {
			this.props.history("/app/my-account/complain-reports");
		}
	}

	onChange(event) {
		var newObj = Object.assign({}, this.state.replyData);
		newObj[event.target.name] = event.target.value;
		this.setState({ replyData: newObj });
	}

	onSubmit(event) {
		event.preventDefault();
		const { errors, isValid } = validateComplainForm(this.state.replyData);
		this.setState({ errors: errors });
		if (isValid) {
			let self = this;
            var reqObj = Object.assign({},this.state.replyData);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.props.replayComplain(reqObj);
            });
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

		if (nextProps.ext_flag) {
			if (nextProps.data.ReturnCode === 1) {
				var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
				this.setState({ err_alert: true, err_msg: errMsg });
			} else if (nextProps.data.ReturnCode === 0) {
				this.setState({ success_msg: nextProps.data.ReturnMsg, success_alert: true, replyData: '' });
				setTimeout(() => this.props.getComplainById(this.state.replyData.ComplainId), 2000);
			}
		} else if (Object.keys(nextProps.getData).length > 0 && Object.keys(nextProps.getData.CompainAllData).length > 0) {
			this.setState({ list: nextProps.getData.CompainAllData });
		}
	}

	render() {
		const { errors, list, err_alert, err_msg, success_msg, success_alert } = this.state;
		const { loading } = this.props;
		const { description, remark, ComplainstatusId } = this.state.replyData;
		return (
			<Fragment>
				{success_msg && <div className="alert_area">
					<Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
				</div>}
				{err_msg && <div className="alert_area">
					<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
				</div>}
				{loading
					?
					<div className="text-center py-40"><CircularProgress className="progress-primary" thickness={2} /></div>
					:
					<div className="card p-15">
						{list.ComplainMasterData &&
							list.ComplainMasterData.map((list, index) => (
								<div key={index}>
									<h4 className="heading">#{list.ComplainId + " " + list.Subject}</h4>
									<h2 className="heading mb-10">#{list.ComplainId}</h2>
								</div>
							))}
						{list.CompainTrailData &&
							list.CompainTrailData.map((list, index) => (
								<div className="card p-10 mb-10" key={index}>
									<div className="media">
										<div className="media-left mr-25">
											<img
												src={require("Assets/img/user-8.jpg")}
												className="img-fluid rounded-circle"
												alt="user profile"
												width="50"
												height="50"
											/>
										</div>
										<div className="media-body pt-10">
											<span className="mb-5 text-primary fs-14 d-block">
												{list.Username}{" "}
												<span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>
											</span>
											<p>{list.Description}</p>
										</div>
									</div>
								</div>
							))}
						<form className="mt-25">
							<FormGroup>
								<Label for="ComplainstatusId" className="control-label col-md-4"><IntlMessages id="sidebar.status" /></Label>
								<Input type="select" name="ComplainstatusId" value={ComplainstatusId} id="ComplainstatusId" onChange={this.onChange}>
									<option value="1">Open</option>
									<option value="2">Close</option>
								</Input>
							</FormGroup>
							<FormGroup>
								<Label for="description" className="control-label col-md-4"><IntlMessages id="sidebar.description" /></Label>
								<Input type="textarea" name="description" className="form-control bg-secondary text-white" rows="5" id="description" value={description} onChange={this.onChange} />
								{errors.description && (<span className="text-danger"><IntlMessages id={errors.description} /></span>)}
							</FormGroup>
							<FormGroup>
								<Label for="remark" className="control-label col-md-4"><IntlMessages id="my_account.remark" /></Label>
								<Input type="textarea" name="remark" className="form-control bg-secondary text-white" rows="5" id="remark" value={remark} onChange={this.onChange} />
								{errors.remark && (<span className="text-danger"><IntlMessages id={errors.remark} /></span>)}
							</FormGroup>
							<div className="col-md-2 float-right">
								<MatButton variant="raised" className="btn-primary mr-10 mb-10 text-white" onClick={this.onSubmit}>
									{<IntlMessages id="sidebar.btnReplay" />}
								</MatButton>
							</div>
						</form>
					</div>
				}
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ complainRdcer }) => {
	const { data, getData, loading, ext_flag } = complainRdcer;
	return { getData, loading, data, ext_flag };
};

export default withRouter(connect(mapStateToProps,
	{
		getComplainById,
		replayComplain
	}
)(ViewComplainWdgt));
