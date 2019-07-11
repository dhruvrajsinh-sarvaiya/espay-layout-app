/**
 * Reply Complain Form Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { getComplainById, replayComplain } from "Actions/MyAccount";
//change date formate from the helper.js
import { changeDateFormat } from "Helpers/helpers";
const validateComplainForm = require("../../../validation/MyAccount/complain_form");

class ComplainReplayFormWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: '',
			remark: '',
			complainStatus: 'Open',
			ComplainId: '',
			loading: false,
			list: [],
			errors: {},
			ListComplain: true,
			flag: true,
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentWillMount() {
		let cId = this.props.ComplainNumber;
		this.setState({ ComplainId: this.props.ComplainNumber });
		if (cId !== "") {
			this.props.getComplainById(cId);
		} else {
			this.props.history("/complain");
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		//Get Complain conversation list
		if (Object.keys(nextProps.list).length > 0 && Object.keys(nextProps.list.ComplainViewmodel).length > 0) {
			this.setState({ list: nextProps.list.ComplainViewmodel });
		}
		if (nextProps.reply_data.ReturnCode === 1 || nextProps.reply_data.ReturnCode === 9) {
			var errMsg = nextProps.reply_data.ErrorCode === 1 ? nextProps.reply_data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.reply_data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
			this.props.myCallbackComplainWdgt1(this.state.ListComplain);
		} else if (nextProps.reply_data.ReturnCode === 0) {
			NotificationManager.success(nextProps.reply_data.ReturnMsg);
			this.props.myCallbackComplainWdgt1(this.state.ListComplain);
			this.setState({ description: '', ListComplain: true });
		}
	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	onSubmit(event) {
		event.preventDefault();
		const { ComplainId, description, remark, complainStatus } = this.state;
		const { errors, isValid } = validateComplainForm(this.state);
		this.setState({ errors: errors });
		if (isValid) {
			this.props.replayComplain({ ComplainId, description, remark, complainStatus });
		}
	}

	onCancel() {
		this.props.myCallbackComplainWdgt1(this.state.ListComplain);
	}

	render() {
		const { description, errors, loading, list } = this.state;
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<div className="card mx-auto w-100 p-15">
					{list.ComplainMasterDataViewModel &&
						list.ComplainMasterDataViewModel.map((item, index) => (
							<div key={index}>
								<h4 className="heading">#{item.ComplainId + " " + item.Subject}</h4>
								<h2 className="heading mb-10">#{item.ComplainId}</h2>
							</div>
						))}
					{list.CompainTrailViewModel &&
						list.CompainTrailViewModel.map((items, index) => (
							<div className="card p-10 mb-10" key={index}>
								<div className="media">
									<div className="media-body pt-10">
										<span className="mb-5 text-primary fs-14 d-block">
											{items.Username}
											<span className="date ml-10">{changeDateFormat(items.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>
										</span>
										<p>{items.Description}</p>
									</div>
								</div>
							</div>
						))}
					<Form className="mt-25">
						<FormGroup>
							<Input tabIndex="1" type="textarea" name="description" className="form-control" rows="5" value={description} onChange={this.onChange} />
							{errors.description && <span className="text-danger"><IntlMessages id={errors.description} /></span>}
						</FormGroup>
						<FormGroup>
							<div className="text-right">
								<Button tabIndex="2" type="submit" variant="raised" className="rounded-0 border-0 perverbtn" onClick={this.onSubmit}><IntlMessages id="sidebar.btnReplay" /></Button>
								<Button tabIndex="3" variant="raised" color="danger" className="ml-10 rounded-0 border-0" onClick={this.onCancel}><IntlMessages id="sidebar.btnCancel" /></Button>
							</div>
						</FormGroup>
					</Form>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ complainRdcer }) => {
	const { reply_data, list, loading } = complainRdcer;
	return { reply_data, list, loading };
};

export default connect(mapStateToProps,
	{ getComplainById, replayComplain }
)(ComplainReplayFormWdgt);