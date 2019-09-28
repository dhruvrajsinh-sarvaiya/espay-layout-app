import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getEmailApiManagerList, clearApiManagerData } from '../../../actions/CMS/ApiManagerActions';
import { Fonts } from '../../../controllers/Constants';

class ApiManagerListScreen extends Component {

	constructor(props) {
		super(props);

		// 2 for Email , 1 for sms
		let screenType = props.navigation.state.params && props.navigation.state.params.screenType

		// 1 for sms  , 2 for Email 
		let titleScreen

		if (screenType == 1)
			titleScreen = R.strings.smsApiManager
		else if (screenType == 2)
			titleScreen = R.strings.emailApiManager

		//Define all initial state
		this.state = {
			screenType: screenType,
			titleScreen: titleScreen,
			refreshing: false,
			search: '',
			response: [],
			emailApiDataState: null,
			isFirstTime: true,
		};
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {
			//To get callTopupHistoryApi 
			this.callGetSmsAndEmailApiMangerApi()
		}
	}

	//api call for list 
	callGetSmsAndEmailApiMangerApi = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getEmailApiManagerList list
			this.props.getEmailApiManagerList({
				type: this.state.screenType
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearApiManagerData()
	}

	static oldProps = {};

	//handle reponse 
	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return {
				...state,
				isFirstTime: false,
			};
		}

		// To Skip Render if old and new props are equal
		if (ApiManagerListScreen.oldProps !== props) {
			ApiManagerListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			const { emailApiData } = props.data;

			if (emailApiData) {
				try {
					//if local emailApiData state is null or its not null and also different then new response then and only then validate response.
					if (state.emailApiDataState == null || (state.emailApiDataState != null && emailApiData !== state.emailApiDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: emailApiData, isList: true })) {

							let res = parseArray(emailApiData.Result);

							//for add kyc status static
							for (var emailApiDataKey in res) {
								let item = res[emailApiDataKey];

								//disabled
								if (item.status == 0) {
									item.statusStatic = R.strings.disabled
								}
								//enabled
								else if (item.status == 1) {
									item.statusStatic = R.strings.enabled
								}
								else {
									item.statusStatic = ''
								}
							}

							return {
								...state, emailApiDataState: emailApiData,
								response: res, refreshing: false,
							};
						} else {
							return { ...state, emailApiDataState: emailApiData, response: [], refreshing: false };
						}
					}
				} catch (e) {
					return { ...state, response: [], refreshing: false };
				}
			}
		}
		return null;
	}

	// this method is called when swipe page api call
	onRefresh = async () => {

		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getEmailApiManagerList list
			this.props.getEmailApiManagerList({ type: this.state.screenType });
		} else {
			this.setState({ refreshing: false });
		}
	}

	render() {
		let filteredList = [];

		//for search all fields if response length > 0
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.APID.includes(this.state.search.toLowerCase()) ||
				item.SenderID.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.ServiceName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.SendURL.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (

			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={this.state.titleScreen}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('ApiManagerAddEditScreen', { onSuccess: this.callGetSmsAndEmailApiMangerApi, screenType: this.state.screenType })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(this.props.data.emailApiDataFetching && !this.state.refreshing)
						?
						<ListLoader />
						:
						filteredList.length > 0 ?
							<FlatList
								data={filteredList}
								extraData={this.state}
								showsVerticalScrollIndicator={false}
								renderItem={({ item, index }) =>
									<ApiManagerListItem
										index={index}
										item={item}
										onEdit={() => { this.props.navigation.navigate('ApiManagerAddEditScreen', { item, onSuccess: this.callGetSmsAndEmailApiMangerApi, screenType: this.state.screenType }) }}
										onDetailPress={() => { this.props.navigation.navigate('ApiManagerListDetailScreen', { item, titleScreen: this.state.titleScreen }) }}
										size={this.state.response.length} />
								}
								keyExtractor={(_item, index) => index.toString()}
								refreshControl={<RefreshControl
									colors={[R.colors.accent]}
									progressBackgroundColor={R.colors.background}
									refreshing={this.state.refreshing}
									onRefresh={this.onRefresh}
								/>}
							/>
							:
							<ListEmptyComponent module={this.state.screenType == 2 ? R.strings.addEmailApiManager : R.strings.addSmsApiManager} onPress={() => this.props.navigation.navigate('ApiManagerAddEditScreen', { onSuccess: this.callGetSmsAndEmailApiMangerApi, screenType: this.state.screenType })} />
					}
				</View>
			</SafeView>
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background,
			},
		}
	}
}

// This Class is used for display record in list
class ApiManagerListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//if old item and new item are different than only render list item
		if (this.props.item === nextProps.item) {
			return false
		}
		return true
	}

	render() {
		// Get required fields from props
		let { index, size, item } = this.props;

		return (

			// flatlist item animation
			<AnimatableItem>

				<View
					style={{
						flex: 1,
						marginLeft: R.dimens.widget_left_right_margin,
						marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
						marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
						marginRight: R.dimens.widget_left_right_margin
					}}>
					<CardView style={{
						flex: 1,
						elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
						borderBottomLeftRadius: R.dimens.margin,
						borderRadius: 0,
					}}
						onPress={this.props.onDetailPress}
					>

						<View style={{ flexDirection: 'row' }}>

							{/* for show ServiceName  */}
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>

								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									<Text numberOfLines={1} ellipsizeMode={'tail'}
										style={{
											fontSize: R.dimens.smallText, color: R.colors.textPrimary,
											flex: 1, textAlign: 'left',
											fontFamily: Fonts.MontserratSemiBold
										}}>
										{validateValue(item.ServiceName)}
									</Text>
									<ImageTextButton
										icon={R.images.RIGHT_ARROW_DOUBLE}
										style={{ margin: 0 }}
										iconStyle={{
											width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary
										}}
										onPress={this.props.onDetailPress} />
								</View>

								{/* for show SenderID */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
										{R.strings.senderId + ': '}
									</TextViewHML>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>
										{validateValue(item.SenderID)}
									</TextViewHML>
								</View>

								{/* for show SendURL */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
										{R.strings.sendUrl + ': '}
									</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>
										{validateValue(item.SendURL)}
									</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status and button for edit */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
							<StatusChip
								color={item.status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.statusStatic} />

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation,
										}}
									icon={R.images.IC_EDIT}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onEdit} />
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For ApiManagerReducer Data 
	let data = {
		...state.ApiManagerReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getEmailApiManagerList List Action 
		getEmailApiManagerList: (request) => dispatch(getEmailApiManagerList(request)),
		//Perform clearApiManagerData Action 
		clearApiManagerData: () => dispatch(clearApiManagerData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ApiManagerListScreen);