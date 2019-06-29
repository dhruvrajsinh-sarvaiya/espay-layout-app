/**
   Developer : Kevin Ladani
    Date : 25-09-2018
	File Comment : Raise Complain Form Component
	Updated by:Saloni Rathod(09th April 2019)
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import {
	addComplain,
	getComplainType,
	complainList,
	getComplainPriority
} from "Actions/MyAccount";
const validateComplainForm = require("../../../validation/MyAccount/complain_form");

class ComplainFormWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				TypeId: '',
				Subject: '',
				Description: '',
				ComplaintPriorityId: ''
			},
			datalist: {
				FromDate: new Date().toISOString().slice(0, 10),
				ToDate: new Date().toISOString().slice(0, 10),
				Subject: "",
			},
			loading: false,
			errors: {},
			typeList: [],
			pList: []
		};
		this.initState = this.state.data;
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	onChange(event) {
		var newObj = Object.assign({}, this.state.data);
		newObj[event.target.name] = event.target.value;
		this.setState({ data: newObj });
	}
	onCancel() {
		this.setState({
			data: {
				TypeId: '',
				Subject: '',
				Description: '',
				ComplaintPriorityId: ''
			},
			errors:'',
	})
}
	componentWillMount() {
		this.props.getComplainType();
		this.props.getComplainPriority();
	}

	onSubmit(event) {
		event.preventDefault();
		const { errors, isValid } = validateComplainForm(this.state.data);
		this.setState({ errors: errors });
		if (isValid) {
			this.props.addComplain(this.state.data);
			this.setState({ data: this.initState });
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });

		//Get Type List
		if (nextProps.getComplainTypeData.hasOwnProperty('TypeMasterList') && nextProps.getComplainTypeData.TypeMasterList.length > 0) {
			this.setState({ typeList: nextProps.getComplainTypeData.TypeMasterList });
		}

		//Get Priority List
		if (nextProps.priorityList.hasOwnProperty('ComplaintPriorityGet') && nextProps.priorityList.ComplaintPriorityGet.length > 0) {
			this.setState({ pList: nextProps.priorityList.ComplaintPriorityGet });
		}

		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			NotificationManager.success(nextProps.data.ReturnMsg);
			this.props.complainList(this.state.datalist);
		}
	}

	render() {
		const { TypeId, Subject, Description, ComplaintPriorityId } = this.state.data;
		const { typeList, pList, errors, loading } = this.state;
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<form>
					<FormGroup className="row">
						<label className="col-md-2 col-sm-12 form-label d-inline"><IntlMessages id="sidebar.type" /><span className="text-danger">*</span></label>
						<div className="col-md-3 col-sm-12">
							<Input tabIndex="1" type="select" name="TypeId" className="" id="TypeId" value={TypeId} onChange={this.onChange}>
								<IntlMessages id="sidebar.openOrders.filterLabel.type.selectType">{(selectType) => <option value="">{selectType}</option>}</IntlMessages>
								{typeList.length > 0 && typeList.map((list, index) => (
									<option key={index} value={list.id}>{list.Type}</option>
								))}
							</Input>
							{errors.TypeId && <span className="text-danger"><IntlMessages id={errors.TypeId} /></span>}
						</div>
					</FormGroup>
					<FormGroup className="row">
						<label className="col-md-2 col-sm-12 form-label d-inline"><IntlMessages id="sidebar.priorityType" /><span className="text-danger">*</span></label>
						<div className="col-md-3 col-sm-12">
							<Input tabIndex="2" type="select" name="ComplaintPriorityId" className="" id="ComplaintPriorityId" value={ComplaintPriorityId} onChange={this.onChange}>
								<IntlMessages id="sidebar.selPriorityType">{(selectType) => <option value="">{selectType}</option>}</IntlMessages>
								{pList.length > 0 && pList.map((list, index) => (
									<option key={index} value={list.Id}>{list.Priority}</option>
								))}
							</Input>
							{errors.ComplaintPriorityId && <span className="text-danger"><IntlMessages id={errors.ComplaintPriorityId} /></span>}
						</div>
					</FormGroup>
					<FormGroup className="row">
						<label className="col-md-2 col-sm-12 form-label d-inline"><IntlMessages id="sidebar.subject" /><span className="text-danger">*</span></label>
						<div className="col-md-10 col-sm-12">
							<Input tabIndex="3" type="text" name="Subject" className="form-control" placeholder="Subject" id="Subject1" value={Subject} onChange={this.onChange} />
							{errors.Subject && <span className="text-danger"><IntlMessages id={errors.Subject} /></span>}
						</div>
					</FormGroup>
					<FormGroup className="row">
						<label className="col-md-2 col-sm-12 form-label d-inline"><IntlMessages id="sidebar.description" /><span className="text-danger">*</span></label>
						<div className="col-md-10 col-sm-12">
							<Input tabIndex="4" type="textarea" name="Description" className="form-control" placeholder="Description" id="Description" value={Description} onChange={this.onChange} />
							{errors.Description && <span className="text-danger"><IntlMessages id={errors.Description} /></span>}
							<p className="small-text"><IntlMessages id="my_account.helpNote" /></p>
						</div>
					</FormGroup>
					<FormGroup className="row">
						<div className="offset-md-2 mb-15 btn_area pl-15">
							<Button tabIndex="5" type="submit" variant="raised" className="rounded-0 border-0 perverbtn" onClick={this.onSubmit}><IntlMessages id="sidebar.btnSubmit" /></Button>
							<Button tabIndex="5" variant="raised" className="ml-15 rounded-0 border-0 btn-danger" onClick={this.onCancel}><IntlMessages id="sidebar.btnCancel" /></Button>
						</div>
					</FormGroup>
				</form>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ complainRdcer }) => {
	const { data, loading, getComplainTypeData, getList, priorityList } = complainRdcer;
	return { data, loading, getComplainTypeData, getList, priorityList };
};

export default connect(mapStateToProps, {
	addComplain,
	getComplainType,
	complainList,
	getComplainPriority
})(ComplainFormWdgt);