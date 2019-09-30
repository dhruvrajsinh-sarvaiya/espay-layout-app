import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, validateIPaddress } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getIpAddressWiseReport, clearIpAndAddressWiseData } from '../../../actions/ApiKeyConfiguration/GetIpAndApiAddressWiseReportActions';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import { getUserDataList } from '../../../actions/PairListAction';
import { DateValidation } from '../../../validations/DateValidation';

class ActiveIpAddressReportListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],

			ipAddressWiseReportDataState: null,
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

			IPAddress: '',
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
			this.callgetIpAddressWiseReportApi()
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
	callgetIpAddressWiseReportApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				IPAddress: '',
				selectedUserName: R.strings.Please_Select,
				selectedUserNameCode: '',
			})
		}

		// Close Drawer user press on reset button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getIpAddressWiseReport list
			this.props.getIpAddressWiseReport({
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
		if (ActiveIpAddressReportListScreen.oldProps !== props) {
			ActiveIpAddressReportListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { ipAddressWiseReportData, userData } = props.data;

			if (ipAddressWiseReportData) {
				try {
					//if local ipAddressWiseReportData state is null or its not null and also different then new response then and only then validate response.
					if (state.ipAddressWiseReportDataState == null || (state.ipAddressWiseReportDataState != null && ipAddressWiseReportData !== state.ipAddressWiseReportDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ipAddressWiseReportData, isList: true })) {

							let res = parseArray(ipAddressWiseReportData.Response);

							//for add kyc status static
							for (var emailApiDataKey in res) {
								let item = res[emailApiDataKey];

								//yes
								if (item.WhitelistIP == 1) {
									item.whiteListedStatusStatic = R.strings.yes_text
								}
								//no
								else {
									item.whiteListedStatusStatic = R.strings.no
								}
							}

							return {
								...state, ipAddressWiseReportDataState: ipAddressWiseReportData,
								response: res, refreshing: false,
								row: addPages(ipAddressWiseReportData.TotalCount)
							};
						} else {
							return {
								...state,
								ipAddressWiseReportDataState: ipAddressWiseReportData,
								response: [],
								refreshing: false,
								row: []
							};
						}
					}
				} catch (e) {

					return {
						...state,
						response: [],
						refreshing: false,
						row: []
					};
				}
			}

			if (userData) {
				try {

					//if local userData state is null or its not null and also different then new response then and only then validate response.
					if (state.userDataState == null || (state.userDataState != null && userData !== state.userDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: userData, isList: true })) {
							let res = parseArray(userData.GetUserData);

							//for add userData
							for (var userDatakey in res) {
								let item = res[userDatakey];
								item.value = item.UserName;
							}

							let userNames = [
								{
									value: R.strings.Please_Select
								},
								...res
							];

							return {
								...state,
								userDataState: userData,
								userNames
							};
						} else {
							return {
								...state,
								userDataState: userData,
								userNames: [{ value: R.strings.Please_Select }]
							};
						}
					}
				} catch (e) {
					return {
						...state,
						userNames: [{ value: R.strings.Please_Select }]
					};
				}
			}
		}
		return null;
	}

	// this method is called when swipe page api call
	onRefresh = async () => {
		this.setState(
			{
				refreshing: true
			});
		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getIpAddressWiseReport list
			this.props.getIpAddressWiseReport(
				{
					PageIndex: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
					IPAddress: this.state.IPAddress,
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

				//To get getIpAddressWiseReport list
				this.props.getIpAddressWiseReport({
					PageIndex: pageNo,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
					IPAddress: this.state.IPAddress,
				});
			}
		}
	}

	// if press on complete button api calling
	onComplete = async () => {

		//Check Validation of FromDate and ToDate
		if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
			return;
		}
		//Check Validation IPAddress
		if (validateIPaddress(this.state.IPAddress)) {
			this.toast.Show(R.strings.enterValidIpAddress);
			return;
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getIpAddressWiseReport list
			this.props.getIpAddressWiseReport({
				PageIndex: 1,
				PageSize: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
				IPAddress: this.state.IPAddress,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();
		this.setState({ selectedPage: 1 })

	}
	navigationDrawer() {

		return (

			// for show filter of fromdate, todate,IPAddress and user data etc
			<FilterWidget
				sub_container={{ paddingBottom: 0, }}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				ToDate={this.state.ToDate}
				textInputStyle={{ marginTop: 0, marginBottom: 0, }}
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				toastRef={component => this.toast = component}
				textInputs={[
					{
						header: R.strings.IPAddress,
						placeholder: R.strings.IPAddress,
						multiline: false,
						keyboardType: 'numeric',
						returnKeyType: "done",
						onChangeText: (text) => { this.setState({ IPAddress: text }) },
						value: this.state.IPAddress,
					}
				]}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				pickers={[
					{
						title: R.strings.userName,
						array: this.state.userNames,
						selectedValue: this.state.selectedUserName,
						onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
					},
				]}
				onCompletePress={this.onComplete}
				onResetPress={this.callgetIpAddressWiseReportApi}
			/>
		)
	}

	render() {
		let filteredList = [];

		//for search all fields if response length > 0

		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.CreatedDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.EmailID.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.IPAddress.toLowerCase().includes(this.state.search.toLowerCase()) ||
				(item.Host + item.Path).toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.whiteListedStatusStatic.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			<Drawer
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				drawerContent={this.navigationDrawer()}
				type={Drawer.types.Overlay}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerPosition={Drawer.positions.Right}
				ref={component => this.drawer = component}
				easingFunc={Easing.ease}>

				<SafeView style={this.styles().container}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set Progress bar as per our theme */}
					<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.lpChargeConfigAddEditDeleteFetching} />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.mostActiveAddress}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.ipAddressWiseReportDataFetching && !this.state.refreshing)
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
										<ActiveIpAddressReportListItem
											item={item}
											onDetailPress={() => this.props.navigation.navigate('ActiveIpAddressReportListDetailScreen', { item })}
											index={index}
											size={this.state.response.length} />
									}
									// assign index as key value to list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In FlatList Item
									refreshControl={<RefreshControl
										refreshing={this.state.refreshing}
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										onRefresh={this.onRefresh}
									/>}
								/>
								:
								// Displayed empty component when no record found 
								<ListEmptyComponent />
						}
						{/*To Set Pagination View  */}
						<View>
							{
								filteredList.length > 0 &&
								<PaginationWidget
									selectedPage={this.state.selectedPage}
									row={this.state.row}
									onPageChange={(item) => { this.onPageChange(item) }} />
							}
						</View>
					</View>
				</SafeView>

			</Drawer>
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1, backgroundColor: R.colors.background,
			},
		}
	}
}

// This Class is used for display record in list
class ActiveIpAddressReportListItem extends Component {
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
				<View style={{
					flex: 1,
					marginRight: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						borderBottomLeftRadius: R.dimens.margin,
						flex: 1,
						borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
					}}
						onPress={this.props.onDetailPress}
					>
						<View style={{
							flexDirection: 'row'
						}}>

							{/* for show image ip */}
							<View style={{
								justifyContent: 'flex-start',
								alignSelf: 'flex-start', alignItems: 'flex-start',
								alignContent: 'flex-start'
							}}>
								<ImageTextButton
									style={
										{
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											justifyContent: 'center',
											padding: R.dimens.CardViewElivation,
											alignItems: 'center',
											marginRight: R.dimens.widgetMargin,
										}}
									icon={R.images.IC_IP_LIST}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								/>
							</View>

							<View style={{
								flex: 1,
								paddingLeft: R.dimens.widgetMargin,
								justifyContent: 'center'
							}}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									{/* for show UserName */}
									<Text style={{
										flex: 1, fontSize: R.dimens.smallText,
										color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold,
									}}>{validateValue(item.UserName)}</Text>

									{/* for show Detail icon */}
									<ImageTextButton
										style={{ margin: 0 }}
										icon={R.images.RIGHT_ARROW_DOUBLE}
										iconStyle={{
											height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary,
											width: R.dimens.dashboardMenuIcon,
										}}
										onPress={this.props.onDetailPress} />
								</View>

								{/* for show EmailID, IPAddress ,apiAccess,WhitelistIP  */}
								<TextViewHML style={{
									flex: 1, fontSize: R.dimens.smallestText,
									color: R.colors.textSecondary,
								}}>{validateValue(item.EmailID)}</TextViewHML>

								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{
										color: R.colors.textSecondary,
										fontSize: R.dimens.smallestText,
									}}>{R.strings.IPAddress + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
										{validateValue(item.IPAddress)}</TextViewHML>
								</View>

								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{
										color: R.colors.textSecondary, fontSize: R.dimens.smallestText,
										fontFamily: Fonts.MontserratSemiBold,
									}}>{R.strings.ipWhitelisting + ': '}</TextViewHML>

									<TextViewHML
										style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
										{item.whiteListedStatusStatic}
									</TextViewHML>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<TextViewHML
										style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.apiAccess + ': '}</TextViewHML>
									<TextViewHML
										numberOfLines={1} ellipsizeMode={'tail'}
										style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
										{validateValue(item.Host) + validateValue(item.Path)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show date */}
						<View style={{
							justifyContent: 'flex-end',
							flex: 1, flexDirection: 'row',
						}}>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
								/>
								<TextViewHML
									style={{
										fontSize: R.dimens.smallestText,
										alignSelf: 'center',
										color: R.colors.textSecondary,
									}}>{convertDateTime(item.CreatedDate)}</TextViewHML>
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
		//Perform getIpAddressWiseReport List Action 
		getIpAddressWiseReport: (request) => dispatch(getIpAddressWiseReport(request)),

		//Perform getUserDataList Action 
		getUserDataList: () => dispatch(getUserDataList()),
		//Perform clearIpAndAddressWiseData Action 
		clearIpAndAddressWiseData: () => dispatch(clearIpAndAddressWiseData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ActiveIpAddressReportListScreen);