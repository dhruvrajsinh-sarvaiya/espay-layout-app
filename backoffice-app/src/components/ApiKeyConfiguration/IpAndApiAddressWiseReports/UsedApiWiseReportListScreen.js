import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getApiWiseReport, clearIpAndAddressWiseData } from '../../../actions/ApiKeyConfiguration/GetIpAndApiAddressWiseReportActions';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import { getUserDataList } from '../../../actions/PairListAction';
import { DateValidation } from '../../../validations/DateValidation';
import StatusChip from '../../widget/StatusChip';

class UsedApiWiseReportListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],

			apiWiseReportDataState: null,
			userDataState: null,

			isFirstTime: true,

			selectedPage: 1,
			row: [],

			//For Drawer First Time Close
			isDrawerOpen: false,

			userNames: [{ value: R.strings.Please_Select }],
			selectedUserName: R.strings.Please_Select,
			selectedUserNameCode: '',

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		};

		// create reference
		this.toast = React.createRef();
		this.drawer = React.createRef();

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);
		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// Check NetWork is Available or not
		if (await isInternet()) {
			//To get all users
			this.props.getUserDataList();

			//To get callTopupHistoryApi 
			this.callgetApiWiseReportApi()
		}
	}

	// If drawer is open then first, it will close the drawer and after it will return to previous screen
	onBackPress() {
		if (this.state.isDrawerOpen) {
			this.drawer.closeDrawer();
			this.setState({ isDrawerOpen: false })
		}
		else {
			//goging back screen
			this.props.navigation.goBack();
		}
	}

	//api call for list and filter reset
	callgetApiWiseReportApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				selectedUserName: R.strings.Please_Select,
				selectedUserNameCode: '',
			})
		}

		// Close Drawer user press on reset button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getApiWiseReport list
			this.props.getApiWiseReport({
				PageIndex: 1,
				PageSize: AppConfig.pageSize,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearIpAndAddressWiseData()
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
		if (UsedApiWiseReportListScreen.oldProps !== props) {
			UsedApiWiseReportListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { apiWiseReportData, userData } = props.data;

			if (apiWiseReportData) {
				try {
					//if local apiWiseReportData state is null or its not null and also different then new response then and only then validate response.
					if (state.apiWiseReportDataState == null || (state.apiWiseReportDataState != null && apiWiseReportData !== state.apiWiseReportDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: apiWiseReportData, isList: true })) {

							let res = parseArray(apiWiseReportData.Response);

							//for add kyc status static
							for (var emailApiDataKey in res) {
								let item = res[emailApiDataKey];

								//failure
								if (item.Status == 1) {
									item.statusStatic = R.strings.failure
								}
								//Success
								else {
									item.statusStatic = R.strings.Success
								}
							}

							return {
								...state, apiWiseReportDataState: apiWiseReportData,
								response: res, refreshing: false,
								row: addPages(apiWiseReportData.TotalCount)
							};
						} else {
							return { ...state, apiWiseReportDataState: apiWiseReportData, response: [], refreshing: false, row: [] };
						}
					}
				} catch (e) {

					return { ...state, response: [], refreshing: false, row: [] };
				}
			}

			if (userData) {
				try {
					//if local userData state is null or its not null and also different then new response then and only then validate response.
					if (state.userDataState == null || 
						(state.userDataState != null && userData !== state.userDataState)) 
						{

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: userData, isList: true })) 
						{
							let res = parseArray(userData.GetUserData);

							//for add userData
							for (var userDatakey in res) {
								let item = res[userDatakey];
								item.value = item.UserName;
							}

							let userNames = [
								{ value: R.strings.Please_Select },
								...res
							];

							return { ...state, userNames, userDataState: userData,  };
						} else {
							return { ...state,  userNames: [{ value: R.strings.Please_Select }], userDataState: userData, };
						}
					}
				} 
				catch (e) 
				{
					return { ...state, userNames: [{ value: R.strings.Please_Select }] };
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

			//To getApiWiseReport list
			this.props.getApiWiseReport(
				{
					PageIndex: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
				});
		} else {
			this.setState({ refreshing: false });
		}
	}

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {

			//Check NetWork is Available or not
			if (await isInternet()) {

				this.setState({ selectedPage: pageNo });

				//To get getApiWiseReport list
				this.props.getApiWiseReport({
					PageIndex: pageNo,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
				});
			}
		}
	}

	// if press on complete button api calling
	onComplete = async () => {
		//Check Validation of FromDate and ToDate

		if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
			this.toast.Show(DateValidation
				(this.state.FromDate,
					this.state.ToDate, true));
			return;
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getApiWiseReport list
			this.props.getApiWiseReport({
				PageSize: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
				PageIndex: 1,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();
		this.setState({ selectedPage: 1 })
	}

	navigationDrawer() {

		return (
			// for show filter of fromdate, todate and user data etc
			<FilterWidget
				ToDate={this.state.ToDate}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				sub_container={{ paddingBottom: 0, }}
				toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				pickers={[
					{
						title: R.strings.userName,
						array: this.state.userNames,
						selectedValue: this.state.selectedUserName,
						onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
					},
				]}
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				onResetPress={this.callgetApiWiseReportApi}
				onCompletePress={this.onComplete}
			/>
		)
	}

	render() {
		let filteredList = [];

		//for search all fields if response length > 0
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.EmailID.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.CreatedDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
				(item.HTTPStatusCode).toString().includes(this.state.search.toLowerCase()) ||
				(item.Host + item.Path).toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}
		return (

			<Drawer

				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				drawerContent={this.navigationDrawer()}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				easingFunc={Easing.ease}
				type={Drawer.types.Overlay}
				ref={component => this.drawer = component}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerPosition={Drawer.positions.Right}
			>

				<SafeView
					style={this.styles().container}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set Progress bar as per our theme */}
					<ProgressDialog
						ref={component => this.progressDialog = component} isShow={this.props.data.lpChargeConfigAddEditDeleteFetching} />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.mostFrequentlyUsedApi}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.apiWiseReportDataFetching && !this.state.refreshing)
							?
							<ListLoader />
							:
							filteredList.length > 0 ?
								<FlatList
									data={filteredList}
									extraData={this.state}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) =>
										<UsedApiWiseReportListItem
											item={item}
											onDetailPress={() => this.props.navigation.navigate('UsedApiWiseReportListDetailScreen', { item })}
											index={index}
											size={this.state.response.length}
										/>
									}
									// assign index as key value to list item
									keyExtractor={(_item, index) => index.toString()}

									// For Refresh Functionality In FlatList Item
									refreshControl={<RefreshControl
										refreshing={this.state.refreshing}
										colors={[R.colors.accent]}
										onRefresh={this.onRefresh}
										progressBackgroundColor={R.colors.background}
									/>}
								/>
								:
								// Displayed empty component when no record found  
								<ListEmptyComponent />
						}
						{/*To Set Pagination View  */}
						<View>
							{filteredList.length > 0
								&&
								<PaginationWidget
									row={this.state.row}
									onPageChange={(item) => { this.onPageChange(item) }}
									selectedPage={this.state.selectedPage}
								/>}
						</View>

					</View>

				</SafeView>

			</Drawer>
		);
	}

	styles = () => {
		return {
			container: {
				backgroundColor: R.colors.background,
				flex: 1,
			},
		}
	}
}

// This Class is used for display record in list
class UsedApiWiseReportListItem extends Component {
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
		let { item, index, size, } = this.props;

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin,
					flex: 1,
				}}>
					<CardView style={{
						borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						flex: 1,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}
						onPress={this.props.onDetailPress}
					>
						<View style={{ flexDirection: 'row' }}>

							{/* for show image http */}
							<View
								style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
								<ImageTextButton

									style={
										{
											backgroundColor: R.colors.accent,
											marginRight: R.dimens.widgetMargin,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation,
											justifyContent: 'center',
											alignItems: 'center',
										}}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									icon={R.images.IC_EARTH}
								/>
							</View>

							<View style={{
								flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center'
							}}>
								<View
									style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									{/* for show UserName */}
									<Text style={{
										color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold,
										flex: 1, fontSize: R.dimens.smallText,
									}}>{validateValue(item.UserName)}</Text>

									{/* for show Detail icon */}
									<ImageTextButton
										iconStyle={{
											width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary
										}}
										icon={R.images.RIGHT_ARROW_DOUBLE}
										style={{ margin: 0 }}
										onPress={this.props.onDetailPress} />
								</View>

								{/* for show EmailID, HTTPStatusCode ,request  */}
								<TextViewHML style={{
									color: R.colors.textSecondary,
									flex: 1, fontSize: R.dimens.smallestText,
								}}>{validateValue(item.EmailID)}</TextViewHML>

								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{
										color: R.colors.textSecondary,
										fontSize: R.dimens.smallestText,
									}}>
										{R.strings.httpStatusCode + ': '}</TextViewHML>

									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
										{validateValue(item.HTTPStatusCode)}</TextViewHML>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.request + ': '}</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode={'tail'}
										style={{
											flex: 1,
											fontSize: R.dimens.smallestText, color: R.colors.textPrimary,
										}}>
										{validateValue(item.Host) + validateValue(item.Path)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status , date */}
						<View style={{
							flex: 1,
							flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: R.dimens.widgetMargin
						}}>
							<StatusChip
								value={item.statusStatic}
								color={item.Status == 0 ? R.colors.successGreen : R.colors.failRed}
							/>

							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

								<ImageTextButton
									icon={R.images.IC_TIMER}
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>

								<TextViewHML
									style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate)}</TextViewHML>
							</View>
						</View>

					</CardView>

				</View>

			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {

	//Updated Data For GetIpAndApiAddressWiseReportReducer Data 
	let data = {
		...state.GetIpAndApiAddressWiseReportReducer,
	}

	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getApiWiseReport List Action 
		getApiWiseReport: (request) => dispatch(getApiWiseReport(request)),
		//Perform getUserDataList Action 
		getUserDataList: () => dispatch(getUserDataList()),
		//Perform clearIpAndAddressWiseData Action 
		clearIpAndAddressWiseData: () => dispatch(clearIpAndAddressWiseData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(UsedApiWiseReportListScreen);