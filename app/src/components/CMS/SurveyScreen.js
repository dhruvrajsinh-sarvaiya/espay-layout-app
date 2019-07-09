import React, { Component } from 'react';
import { View, FlatList, Text, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, showAlert, parseArray, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../Navigation';
import { getSurvey, addSurveyResult, getSurveyResultsById, getSurveyResultsByIdClear } from '../../actions/CMS/SurveyAction'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import Survey from '../../native_theme/components/Survey/survey';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import { getData } from '../../App';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import ListLoader from '../../native_theme/components/ListLoader';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class SurveyScreen extends Component {
	constructor(props) {
		super(props)

		//get parameters from previous screen
		const { params } = this.props.navigation.state;

		//Define All State initial state
		this.state = {
			params: params,
			data: null,      // for store responce of survey data
			headerTitle: '', // for get Survey title from the responce
			jsonData: {},    // store Json data for display in web view
			resultData: [],  // for store data from the responce for list 
			isExist: null,   // for check data if 0 than display survey and 1 to display result

			/**
			 * 1- featuresurvey
			 * 2- coinlistsurvey
			 * 3- feedbacksurvey 
			 *  */
			surveyId: params.id, // get survey id from screen
			title: ' ', 		 // get survey title from screen
			isFirstTime: true,
		}
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// for check internet connection
		if (await isInternet()) {

			// this value is get from which activity,this screen is call 
			let surveytypeId = this.state.surveyId;

			// call api for get survey details
			this.props.getSurvey(surveytypeId)
		} else {
			this.setState({ title: this.state.params.title })
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return isCurrentScreen(nextProps);
	};

	componentDidUpdate = async (prevProps, prevState) => {

		//Get All Updated field of Particular actions
		const { addDataResult, surveydata } = this.props;

		// check both the survey data if both are different than call api
		if (surveydata !== prevProps.surveydata) {
			try {

				//for call result data for decide to show user a survey data or resultdata  
				let surveytypeId = {
					surveyId: surveydata.data._id,/* survey id get from the responce   */
					userId: getData(ServiceUtilConstant.Email),/* for get user email Address */
				};

				// check for internet connection
				if (await isInternet()) {

					// call api for get survey result list by id
					this.props.getSurveyResultsById(surveytypeId)
				}
			} catch (e) { }
		}

		// for display dialoag when user complete the survey and press ok
		if (addDataResult !== prevProps.addDataResult) {

			//check result is available or not
			if (addDataResult) {
				try {
					if (validateResponseNew({ response: addDataResult, returnCode: addDataResult.responseCode, returnMessage: addDataResult.message })) {

						// display success dialog
						showAlert(R.strings.Success + '!', addDataResult.message, 0, async () => {

							// when survey completed and display success dialog than call api for surveyResult 
							let surveytypeId = {
								surveyId: this.state.data.data._id, 		// survey id get from the responce
								userId: getData(ServiceUtilConstant.Email),	// for get user email Address
							};

							// check for internet connection
							if (await isInternet()) {

								// call api for get survey result list by id
								this.props.getSurveyResultsById(surveytypeId)
							}
						})
					}
				} catch (e) { }
			}
		}
	};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return {
				...state,
				isFirstTime: false,
			};
		}

		if (isCurrentScreen(props)) {

			// Get All Updated field of Particular actions
			const { surveydata, surveyresultsdetail } = props;

			// check for display survey data
			if (surveydata) {
				try {
					if (state.surveydata == null || (state.surveydata != null && surveydata !== state.surveydata)) {
						if (validateResponseNew({ response: surveydata, returnCode: surveydata.responseCode, returnMessage: surveydata.message, isList: true })) {

							// get title from the responce for selected language
							let title = surveydata.data.locale[R.strings.getLanguage()].surveyName

							// get json value from the responce and remove '\n' from the data  
							let response = surveydata.data.json.replace(/\n/g, " ");

							// set state and parse string data into json for Response set to jsonData
							return { ...state, headerTitle: title, data: surveydata, jsonData: JSON.parse(response), surveydata }
						} else {
							return { ...state, headerTitle: '', data: null };
						}
					}
				} catch (e) {
					return { ...state, headerTitle: '', data: null };
				}
			}

			// check for display survey result screen
			if (surveyresultsdetail) {
				try {
					if (state.surveyresultsdetail == null || (state.surveyresultsdetail != null && surveydata !== state.surveyresultsdetail)) {
						if (validateResponseNew({ response: surveyresultsdetail, returnCode: surveyresultsdetail.responseCode, returnMessage: surveyresultsdetail.message, isList: true })) {
							var res = parseArray(surveyresultsdetail.data.results);

							//Set responce to state and if isExist value is 0 than display survey otherwise display survey result 
							return { ...state, resultData: res, isExist: surveyresultsdetail.data.isExist, surveyresultsdetail };
						} else {
							return { ...state, resultData: [] };
						}
					}
				} catch (e) {
					return { ...state, resultData: [] };
				}
			}
		}
		return null;
	}

	componentWillUnmount() {

		// call action for clear Reducer value 
		this.props.getSurveyResultsByIdClear();
	}

	submitData = async (result) => {

		// for check internet connection
		if (await isInternet()) {
			let addDataRequest = {
				surveyId: this.state.data.data._id,			// survey id pass from the surveyresponce
				userId: getData(ServiceUtilConstant.Email), // for get user email Address
				answerjson: result							// pass selected coin
			}
			// call api for Add Survey data 
			this.props.addSurveyResult(addDataRequest)
		}
	}

	render() {

		//loading bit for handling progress dialog
		const { loading, addLoading } = this.props;

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				{/* If isExist true then Display Title Which is Comming From Previous Screen else Not Display Title in Custom Toolbar*/}
				<CustomToolbar
					isBack={true}
					title={((this.state.isExist === null) || (this.state.isExist === 1)) ? this.state.params.title : null}
					nav={this.props.navigation}
				/>
				<ProgressDialog isShow={addLoading} />

				{/* when isExit value is 0 than display Survey , when 1 than display surveyresult  */}
				{
					(this.state.isExist == 0)
						?
						<View style={{ flex: 1 }}>
							{/* for set title of the servey  */}
							<TextViewMR style={{
								color: R.colors.textPrimary,
								fontSize: R.dimens.mediumText,
								marginLeft: R.dimens.padding_left_right_margin,
								marginRight: R.dimens.padding_left_right_margin,
							}}>
								{this.state.headerTitle === '' ? null : this.state.headerTitle}
							</TextViewMR>

							{/* for display survey data */}
							<Survey
								surveyJSON={this.state.jsonData}
								title=""
								navigation={this.props.navigation}
								surveyResponseDateString={''}
								onSurveyComplete={(data) => this.submitData(data)}
								data={{}} />
						</View>
						:
						<View style={{ flex: 1, marginBottom: R.dimens.margin }}>
							{
								loading ?
									<ListLoader />
									:
									<View style={{ flex: 1 }}>
										{
											this.state.resultData.length ?
												<View style={{ flex: 1 }}>
													<FlatList
														data={this.state.resultData}
														showsVerticalScrollIndicator={false}
														renderItem={({ item, index }) =>
															<SurveyList
																item={item}
																surveyListIndex={index}
																surveyListSize={this.state.resultData.length}
															/>}
														keyExtractor={(item, index) => index.toString()}
														contentContainerStyle={[
															{ flexGrow: 1 },
															this.state.resultData.length ? null : { justifyContent: 'center' }
														]}
													/>
												</View>
												:
												<ListEmptyComponent />
										}
									</View>
							}
						</View>
				}
			</SafeView>
		);
	}
}

// This class is used for display records in list
class SurveyList extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		if (this.props.item === nextProps.item) {
			return false
		}
		return true
	}

	render() {

		//get required field from props
		let { surveyListIndex, surveyListSize, item } = this.props;
		return (
			<AnimatableItem>

				<View style={{
					flex: 1,
					marginTop: (surveyListIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (surveyListIndex == surveyListSize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						flex: 1, borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>
						<View>
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
								<View>
									<ImageTextButton
										icon={R.images.IC_VIEW_LIST}
										style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.SignUpButtonHeight / 2 }}
										iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
									/>
								</View>
								<View style={{ flex: 1, marginLeft: R.dimens.margin }}>
									<Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{item.answer ? item.answer : '-'}</Text>
									<View style={{ flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.count + " : "}</TextViewHML>
										<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.count ? item.count : '-'}</TextViewHML>
									</View>
								</View>


							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	};

}

function mapStateToProps(state) {
	return {
		//For Update isPortrait true or false
		preference: state.preference.dimensions.isPortrait,
		surveydata: state.SurveyReducer.surveydata,
		loading: state.SurveyReducer.loading,
		addLoading: state.SurveyReducer.addLoading,
		addDataResult: state.SurveyReducer.data,
		surveyresultsdetail: state.SurveyReducer.surveyresultsdetail,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// call action for get survey data 
		getSurvey: (surveytypeId) => dispatch(getSurvey(surveytypeId)),
		// call action for add survey result
		addSurveyResult: (addDataRequest) => dispatch(addSurveyResult(addDataRequest)),
		// call action for fetch Surveyresult of given id 
		getSurveyResultsById: (surveytypeId) => dispatch(getSurveyResultsById(surveytypeId)),
		// for clear id 
		getSurveyResultsByIdClear: () => dispatch(getSurveyResultsByIdClear()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyScreen)