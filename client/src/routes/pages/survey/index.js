/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-12-2018
    UpdatedDate : 18-12-2018
    Description : Survey Page
*/
import React, { Component,Fragment } from "react";
import { connect } from "react-redux";
import {Alert} from "reactstrap";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import { JbsCard } from "Components/JbsCard";
// redux actions
import { getSurvey,addSurveyResult,getSurveyResultsById} from "Actions/Survey";
//For Meta Tag and SEO Configuration
import Page from "Components/page";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import $ from "jquery";
// app config
import AppConfig from "Constants/AppConfig";
//Validation for Faq Category Form
const validateSurveyInput = require('../../../validation/Survey/surveys');

class SurveyPage extends Component {
  
  	constructor(props) {
    	super(props);
		this.state = {
			surveydata: {},
			loading: false, // loading activity
			errors : {},
			err_msg : "",
			err_alert : true,
			btn_disabled : false,
      		allresults:[],
			isgetsurveydata:0,
			displaysurveyform:0  
		};
		// this.addSurveyResultData = this.addSurveyResultData.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.onComplete = this.onComplete.bind(this);
  	}
  	onDismiss() {
    	let err=delete  this.state.errors['message'];
    	this.setState({ err_alert: false, errors:err});
  	}
  	componentWillMount() {
		let surveytypeId = this.props.location.state.surveytypeId;
		if(surveytypeId != '') {
			this.props.getSurvey(surveytypeId);
		} else {
			this.props.getSurvey(AppConfig.survey["feature_survey"]);
		}
    	// import("icheck");
    	// window["$"] = window["jQuery"] = $;
	}

  	componentWillReceiveProps(nextProps) {
    	//console.log("123-nextProps",nextProps);
    	if(typeof nextProps.surveydata!='undefined' && typeof nextProps.surveydata.json!='undefined' && this.state.isgetsurveydata==0)
    	{
      		this.setState({
				surveydata: nextProps.surveydata,
				isgetsurveydata:1
			});
			let useremail='';
			if(this.props.location.state.hasOwnProperty('userData'))
			{
				useremail= this.props.location.state.userData.Email;
			}
			let checkdata = {
				surveyId:nextProps.surveydata._id,
				userId:useremail,
			}
			this.props.getSurveyResultsById(checkdata);
		}

		if(typeof nextProps.data != 'undefined' && nextProps.data.responseCode === 0) {
			this.setState({ err_msg : '', err_alert: false ,loading: nextProps.loading });
			this.props.history.goBack();
		}
		
    	if(typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      		if(typeof nextProps.data.errors.message !='undefined' && nextProps.data.errors.message!='')
      		{
          		this.setState({ err_alert: true, loading: nextProps.loading });
      		}
      		this.setState({ 
        		errors : nextProps.data.errors
      		});
		}
		if (typeof nextProps.surveyresultsdetail != 'undefined' && nextProps.surveyresultsdetail.responseCode === 0) {
			this.setState({
				allresults: nextProps.surveyresultsdetail.data.results,
				displaysurveyform: nextProps.surveyresultsdetail && nextProps.surveyresultsdetail.data && nextProps.surveyresultsdetail.data.isExist==1?0:1,
			  	loading: false
			});
		}
  	}

  	onValueChanged(result) {
    	//console.log("value changed!");
    	//console.log("result",result)
  	}

	// On Complete Survey call the API
  	onComplete(result) {
		//console.log("result",result);
		let useremail='';
		if(this.props.location.state.hasOwnProperty('userData'))
		{
			useremail=this.props.location.state.userData.Email;
		}
		let data = {
			surveyId:this.state.surveydata._id,
			userId:useremail,
			answerjson:result.data
		}
		//console.log("data",data);
		const { errors, isValid } = validateSurveyInput.validateAddSurveyResultInput(data);
		
    	this.setState({ err_alert: true, errors: errors, btn_disabled : true });
    	//let isValid=false;
      	if(isValid) {
			// let data = {
			// 	surveyId:this.state.surveydata._id,
			// 	userId:useremail,
			// 	answerjson:result.data
			// }
			setTimeout(() => {
				this.props.addSurveyResult(data);
				this.setState({loading: true });
			}, 1000);
    	}
  	}

  	render() {
		const {err_alert,errors,loading,surveydata,allresults,displaysurveyform} = this.state;
		const json =this.state.surveydata.json;
		//console.log("allresults",allresults);
		Survey.Survey.cssType = "bootstrap";
		Survey.surveyLocalization.supportedLocales = ["en", "de", "es", "fr"];
		var model = new Survey.Model(json);
		model.locale = localStorage.getItem('locale');
		// model
		// .onComplete
		// .add(function (result) {
		//   addSurveyResultData(JSON.stringify(result.data));
		// });
		//console.log(surveydata);

		
    	return (
      		<Page id="Survey" title="Survey" description="This is Survey">
      			<PageTitleBar
            		title={<IntlMessages id="sidebar.survey" />}
            		match={this.props.match}
      			/>

		<Fragment>
        		{errors.message && <div className="alert_area">
				<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
				</div>}
				<div className="row news-content">
					<JbsCard heading={surveydata && surveydata.locale && surveydata.locale[localStorage.getItem('locale')] && surveydata.locale[localStorage.getItem('locale')].surveyName|| ''} colClasses="col-sm-12 col-md-8 col-lg-8" fullBlock>
						
						<div className="about-wrapper surveyjs">
							{/* <h1>{surveydata && surveydata.locale && surveydata.locale[localStorage.getItem('locale')] && surveydata.locale[localStorage.getItem('locale')].surveyName|| ''}</h1> */}
							{displaysurveyform == 1 ?
							<Survey.Survey
								model={model}
								onComplete={this.onComplete}
								onValueChanged={this.onValueChanged}
							/>:<h3 className="text-center"><IntlMessages id="surveys.usergivenans" /></h3>
						}
						</div>
						{loading &&<JbsSectionLoader />}
        			</JbsCard>

          			<JbsCard heading={<IntlMessages id="surveys.surveyResults" />} colClasses="col-sm-12 col-md-4 col-lg-4" fullBlock>
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
										{allresults && allresults.length>0 ?
											allresults && allresults.map((result,key) => {
												return (
													<TableRow hover key={key}>
														<TableCell>{result.answer}</TableCell>
														<TableCell numeric>{result.count}</TableCell>
													</TableRow>
												);
											}):
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
      	</Page>
    	);
  	}
}

//map state to props
const mapStateToProps = ({ survey }) => {
  	var response = { 
		data: survey.data,
		loading: survey.loading,
		surveydata:survey.surveydata,
		surveyresultsdetail: survey.surveyresultsdetail
    };
    return response;
};

export default connect(
  	mapStateToProps,
  	{
    	getSurvey,addSurveyResult,getSurveyResultsById
  	}
)(SurveyPage);