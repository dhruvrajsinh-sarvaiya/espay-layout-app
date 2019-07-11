/* 
    Createdby : dhara gajera
    CreatedDate : 21/1/2019
    Description : Survey component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import { JbsCard } from "Components/JbsCard";
// redux actions
import { getSurvey, addSurveyResult, getSurveyResultsById } from "Actions/Survey";//used actions,reducers,sagas og page survey made by kushal parekh
//For Meta Tag and SEO Configuration
import * as Survey from "survey-react";
import "survey-react/survey.css";
//Validation for Faq Category Form
const validateSurveyInput = require('../../validation/Survey/surveys');

class SurveyPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			surveydata: {},
			loading: false, // loading activity
			errors: {},
			err_msg: "",
			err_alert: true,
			btn_disabled: false,
			allresults: [],
			isgetsurveydata: 0,
			displaysurveyform: 0,
			addNewSurveyModal: false, // add new survey form modal
			surveytypeIdNew: "" //Added by dhara gejara
		};
		this.onDismiss = this.onDismiss.bind(this);
		this.onComplete = this.onComplete.bind(this);
	}

	onDismiss() {
		let err = delete this.state.errors['message'];
		this.setState({ err_alert: false, errors: err });
	}

	/**
	 * On view coin list detail
	 */
	onViewFields(sid) {
		this.setState({ addNewSurveyModal: true, surveytypeIdNew: sid });//to open popup
		if (sid != undefined && sid != '') {//if surveyid available then show Coin Listing Voting Survey question
			this.props.getSurvey(sid);
		}
	}

	/**
	 * On Close coin list detail Modal 
	 */
	closeViewDetailsDialog() {
		this.setState({ addNewSurveyModal: false, surveytypeIdNew: null, surveydata: {}, isgetsurveydata: 0 });
	}

	componentWillReceiveProps(nextProps) {
		//to get userlist data. on 1st call will get result data from here then 2nd time from popup open method
		if (nextProps.surveydata !== undefined && nextProps.surveydata.json !== undefined && this.state.isgetsurveydata == 0) {
			this.setState({
				surveydata: nextProps.surveydata,
				isgetsurveydata: 1
			});
			let useremail = '';
			if (this.props.location.state.hasOwnProperty('userData')) {
				useremail = this.props.location.state.userData.Email;
			}
			let checkdata = {
				surveyId: nextProps.surveydata._id,
				userId: useremail,
			}
			this.props.getSurveyResultsById(checkdata);
		}

		if (nextProps.data !== undefined && nextProps.data.responseCode === 0) {
			this.setState({ err_msg: '', err_alert: false, loading: nextProps.loading });
			this.closeViewDetailsDialog();
		}

		if (nextProps.data !== undefined && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
			if (nextProps.data.errors.message !== undefined && nextProps.data.errors.message != '') {
				this.setState({ err_alert: true, loading: nextProps.loading });
			}
			this.setState({ errors: nextProps.data.errors });
		}
		if (nextProps.surveyresultsdetail !== undefined && nextProps.surveyresultsdetail.responseCode === 0) {
			this.setState({
				allresults: nextProps.surveyresultsdetail.data.results,
				displaysurveyform: nextProps.surveyresultsdetail.hasOwnProperty('data') && nextProps.surveyresultsdetail.data.isExist === 1 ? 0 : 1,
				loading: false
			});
		}
	}

	// On Complete Survey call the API
	onComplete(result) {
		let useremail = '';
		if (this.props.location.state.hasOwnProperty('userData')) {
			useremail = this.props.location.state.userData.Email;
		}

		let data = {
			surveyId: this.state.surveydata._id,
			userId: useremail,
			answerjson: result.data
		}
		const { errors, isValid } = validateSurveyInput.validateAddSurveyResultInput(data);

		this.setState({ err_alert: true, errors: errors, btn_disabled: true });
		if (isValid) {
			setTimeout(() => {
				this.props.addSurveyResult(data);
				this.setState({ loading: true });
				this.setState({ surveydata: {}, isgetsurveydata: 0 });
			}, 1000);
		}
	}

	render() {
		const { err_alert, errors, loading, surveydata, allresults, displaysurveyform } = this.state;
		const json = this.state.surveydata.json;
		Survey.Survey.cssType = "bootstrap";
		Survey.surveyLocalization.supportedLocales = ["en", "de", "es", "fr"];
		var model = new Survey.Model(json);
		model.locale = localStorage.getItem('locale');

		return (
			<Fragment>
				<a href="javascript:void(0)" onClick={() => this.onViewFields(this.props.surveytypeId)}>Here</a>
				<Modal isOpen={this.state.addNewSurveyModal} size="lg" toggle={() => this.closeViewDetailsDialog()}>
					<ModalHeader toggle={() => this.closeViewDetailsDialog()}>{surveydata.locale && surveydata.locale[localStorage.getItem('locale')] && surveydata.locale[localStorage.getItem('locale')].surveyName || ''}</ModalHeader>
					<ModalBody>
						<Fragment>
							{errors.message && <div className="alert_area">
								<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
							</div>}
							<div className="row news-content">
								<JbsCard colClasses="col-sm-12 col-md-6 col-lg-6" fullBlock>
									<div className="about-wrapper surveyjs">
										{displaysurveyform == 1 ?
											<Survey.Survey
												model={model}
												onComplete={this.onComplete}
											/> : <h3 className="text-center"><IntlMessages id="surveys.usergivenans" /></h3>
										}
									</div>
									{loading && <JbsSectionLoader />}
								</JbsCard>
								<JbsCard heading={<IntlMessages id="surveys.surveyResults" />} colClasses="col-sm-12 col-md-6 col-lg-6" fullBlock>
									<div className="StackingHistory">
										<div className="table-responsive">
											<Table>
												<TableHead>
													<TableRow hover>
														<TableCell>{<IntlMessages id="surveys.options" />}</TableCell>
														<TableCell numeric>{<IntlMessages id="surveys.totalanswer" />}</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													<Fragment>
														{allresults && allresults.length > 0 ?
															allresults.map((result, key) => {
																return (
																	<TableRow hover key={key}>
																		<TableCell>{result.answer}</TableCell>
																		<TableCell numeric>{result.count}</TableCell>
																	</TableRow>
																);
															}) :
															<TableRow hover>
																<TableCell colSpan={2} className="text-center">{<IntlMessages id="surveys.recordnotfound" />}</TableCell>
															</TableRow>
														}
													</Fragment>
												</TableBody>
											</Table>
										</div>
										{loading && <JbsSectionLoader />}
									</div>
								</JbsCard>
							</div>
						</Fragment>
					</ModalBody>
					<ModalFooter>
					</ModalFooter>
				</Modal>
			</Fragment>
		);
	}
}

//map state to props
const mapStateToProps = ({ survey }) => {
	var response = {
		data: survey.data,
		loading: survey.loading,
		surveydata: survey.surveydata,
		surveyresultsdetail: survey.surveyresultsdetail
	};
	return response;
};

export default connect(mapStateToProps,{
	getSurvey,
	addSurveyResult,
	getSurveyResultsById
})(SurveyPage);