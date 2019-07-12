import React, { Component } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Image, } from 'react-native';
import { getAffiliateCommissionPattern, clearAffiliate } from '../../actions/Affiliate/AffiliateSignUpAction'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { isCurrentScreen } from '../Navigation'
import { changeTheme } from '../../controllers/CommonUtils';
import R from '../../native_theme/R';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import Accordion from 'react-native-collapsible/Accordion';
import ListLoader from '../../native_theme/components/ListLoader';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { getCardStyle } from '../../native_theme/components/CardView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

let title = ''

class CommissionPatternScreen extends Component {

	constructor(props) {
		super(props);

		//Define All State initial state
		this.state = {
			response: [],
			searchInput: '',
			type: 1, //0 For basic & 1 for full details
			isFirstTime: true,
			finalArray: [],
			activeSections: [],
		}
	}

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {
			//Call Fetch commission pattern
			this.props.getAffiliateCommissionPattern({ type: this.state.type });
			//----
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return isCurrentScreen(nextProps);
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
			//Get All Updated Feild of Particular actions
			const { getPlan, loading } = props.AffiliateSignUpReducer;

			//To Check Normal SignUp Api Data Fetch or Not
			if (!loading) {
				if (getPlan) {
					try {
						if (validateResponseNew({ response: getPlan, isList: true })) {
							//get list of response details in array
							let mainResponse = []
							getPlan.Response.map((item, index) => {

								//for using common title name
								let isUniqueTitle = true
								if (title === item.Value + ' : ' + item.Name) {
									isUniqueTitle = false
								}
								else {
									title = item.Value + ' : ' + item.Name
									isUniqueTitle = true
								}

								//adding title and other required arrys for further use
								mainResponse.push({
									title: isUniqueTitle ? item.Value + ' : ' + item.Name : '',
									AvailableScheme: item.AvailableScheme
								})
							})
							//clear reducer data
							props.clearAffiliate()

							return {
								...state,
								finalArray: mainResponse
							}

						} else {
							//clear reducer data
							props.clearAffiliate()
							return {
								...state,
								finalArray: []
							}
						}
					} catch (e) {
						return {
							...state,
							finalArray: []
						}
						//Handle Catch and Notify User to Exception.
						//logger(e)
					}
				}
			}
		}
		return null
	}

	//this Method is used to focus on next feild
	focusNextField(id) {
		this.inputs[id].focus();
	}

	setSection = sections => {
		this.setState({ activeSections: sections.includes(undefined) ? [] : sections, });
	};

	renderHeader = (section, _, isActive) => {
		return (
			<View>
				{/* title is not empty then display title view */}
				{section.title !== '' &&
					<View style={this.styles().simpleItem}>
						<View style={this.styles().cardViewStyle}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<View style={{ flex: 1 }}>
									<View style={{ width: wp('2%'), backgroundColor: R.colors.accent }} />
									<TextViewMR style={[this.styles().headerText, { margin: R.dimens.widgetMargin }]}>{section.title}</TextViewMR>
								</View>
								<View style={{ margin: R.dimens.widgetMargin, }}>
									<Image
										source={isActive ? R.images.IC_COLLAPSE_ARROW : R.images.IC_EXPAND_ARROW}
										style={{
											tintColor: R.colors.textPrimary,
											height: R.dimens.SMALL_MENU_ICON_SIZE,
											width: R.dimens.SMALL_MENU_ICON_SIZE
										}}
									/>
								</View>
							</View>
							{/* Display answer when the active bit is true means need to display answer */}
							{isActive && this.content(section, _, isActive)}
						</View>
					</View>
				}
			</View>
		)
	};

	content = (section, _, isActive) => {
		return (
			<View style={[this.styles().content,]}>
				<View>
					{/* Add HTML View for parsing HTML tags to react native */}
					<TextViewHML style={{
						fontSize: R.dimens.smallestText,
						color: R.colors.failRed,
					}}>{R.strings.commission_count_on} :</TextViewHML>

					{/* displaying detail view */}
					{section.AvailableScheme !== undefined && section.AvailableScheme.map((item, index) => {

						return <View key={index}>
							<TextViewHML style={{
								fontSize: R.dimens.smallText,
								color: R.colors.textPrimary,
								marginTop: R.dimens.widgetMargin
							}}>{item.SchemeName.toUpperCase()}</TextViewHML>
							<View style={{ marginLeft: R.dimens.widget_left_right_margin }}>

								{/* for details after sub header with bullets */}
								{section.AvailableScheme !== undefined && item.SchemeDetail.map((dItem, dIndex) => {

									return <TextViewHML key={dIndex} style={{
										fontSize: R.dimens.smallestText,
										color: R.colors.textSecondary,
										marginTop: R.dimens.widgetMargin,
									}}>{'\u2022'} {dItem}</TextViewHML>
								})}
							</View>
						</View>
					})}
				</View>
			</View>
		)
	}

	render() {
		let { loading } = this.props.AffiliateSignUpReducer
		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.commission_pattern}
					isBack={true}
					nav={this.props.navigation}
				/>

				<View style={{ flex: 1 }}>
					{/* To Check Response fetch or not if loading = true then display progress bar else display List*/}
					{loading ?
						<ListLoader /> :
						<View style={{ flex: 1 }}>
							<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={contentContainerStyle(this.state.finalArray)}>
								{this.state.finalArray.length > 0 ?
									<Accordion
										activeSections={this.state.activeSections}
										sections={this.state.finalArray}
										touchableComponent={TouchableWithoutFeedback}
										renderHeader={this.renderHeader}
										renderContent={() => null}
										onChange={this.setSection}
									/>
									: <ListEmptyComponent />}

							</ScrollView>
						</View>
					}
				</View>
			</SafeView >
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background,
			},
			headerText: {
				textAlign: 'left',
				fontSize: R.dimens.smallText,
				color: R.colors.textPrimary,
			},
			content: {
				marginTop: R.dimens.widgetMargin,
				marginRight: R.dimens.widgetMargin,
				marginBottom: R.dimens.widgetMargin,
				paddingLeft: R.dimens.WidgetPadding,
				paddingRight: R.dimens.WidgetPadding,
			},
			simpleItem: {
				flex: 1,
				marginLeft: R.dimens.margin,
				marginRight: R.dimens.margin,
			},
			cardViewStyle: {
				flex: 1,
				...getCardStyle(R.dimens.CardViewElivation),
				margin: R.dimens.widgetMargin,
				padding: R.dimens.widgetMargin,
				backgroundColor: R.colors.cardBackground,
				borderRadius: R.dimens.cardBorderRadius,
			}
		}
	}
}

function mapStateToProps(state) {
	return {
		//For Update isPortrait true or false
		preference: state.preference.dimensions.isPortrait,
		//Updated Data For Affiliate Signup
		AffiliateSignUpReducer: state.AffiliateSignUpReducer,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform Normal SignUp Action
		getAffiliateCommissionPattern: (registerRequest) => dispatch(getAffiliateCommissionPattern(registerRequest)),
		// Perform Action for clear AffiliateCommissionPattern data from reducer
		clearAffiliate: () => dispatch(clearAffiliate()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CommissionPatternScreen)