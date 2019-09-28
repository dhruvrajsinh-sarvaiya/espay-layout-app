import React, { Component } from 'react'
import { View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime, getPlanValidity } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getApiPlanSubHistory } from '../../../actions/ApiKeyConfiguration/ApiPlanSubcriptionHistoryActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import ListLoader from '../../../native_theme/components/ListLoader';
import PaginationWidget from '../../widget/PaginationWidget';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { getUserDataList, getApiPlanConfigList } from '../../../actions/PairListAction';
import { DateValidation } from '../../../validations/DateValidation';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import { clearApiPlanConfigurationHistory } from '../../../actions/ApiKeyConfiguration/ApiPlanConfigHistoryAction';

export class ApiPlanSubscriptionHistory extends Component {
	constructor(props) {
		super(props);

		// Define all initial state
		this.state = {
			row: [],
			Status: [
				{ value: R.strings.select_status },
				{ value: R.strings.active, Id: 1 },
				{ value: R.strings.inProcess, Id: 9 },
				{ value: R.strings.expire, Id: 0 },
				{ value: R.strings.Disable, Id: 2 },
			],
			UserNames: [],
			ApiPlan: [],
			ApiPlanConfigHistoryRes: [],

			ApiPlanSubscriptionHistoryState: null,
			ApiPlanConfigListState: null,
			UserDataListState: null,

			selectedUser: R.strings.Please_Select,
			selectedApiPlan: R.strings.Select_Plan,
			selectedStatus: R.strings.select_status,

			selectedPage: 1,
			UserId: 0,
			PlanId: 0,
			StatusId: 0,

			searchInput: '',
			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false,

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}

		// create references
		this.toast = React.createRef();
		this.drawer = React.createRef();

		//initial request
		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	//for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
	onBackPress = () => {
		if (this.state.isDrawerOpen) {
			this.drawer.closeDrawer();
			this.setState({ isDrawerOpen: false })
		}
		else {
			//going back screen
			this.props.navigation.goBack();
		}
	}

	async componentDidMount() {

		// Add this method to change theme based on stored theme name.
		changeTheme()

		// check internet connection
		if (await isInternet()) {
			// Call api plan subsciption history
			this.props.getApiPlanSubHistory(this.request)
			// Call User Data List Api
			this.props.getUserDataList()
			// Call Api Plan List Api
			this.props.getApiPlanConfigList()
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearApiPlanConfigurationHistory()
	}

	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Api Plan Subscription History List
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage - 1,
			}
			// Call Get Api Plan Subscription History List API
			this.props.getApiPlanSubHistory(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Pagination Method Called When User Change Page 
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {
			//if user selecte other page number then and only then API Call elase no need to call API
			this.setState({ selectedPage: pageNo });

			// Check NetWork is Available or not
			if (await isInternet()) {
				// Bind request for Api Plan Subscription History List
				this.request = {
					...this.request,
					PageNo: pageNo - 1,
				}
				//Call Get Api Plan Subscription History List API
				this.props.getApiPlanSubHistory(this.request);
			} else {
				this.setState({ refreshing: false });
			}
		}
	}

	// Reset Filter
	onResetPress = async () => {
		// Close Drawer 
		this.drawer.closeDrawer();

		this.setState({
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			UserId: 0,
			PlanId: 0,
			StatusId: 0,
			selectedApiPlan: R.strings.Select_Plan,
			selectedStatus: R.strings.select_status,
			selectedUser: R.strings.Please_Select
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			this.request = {
				...this.request,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				UserId: '',
				PlanId: '',
				Status: '',
			}
			// Call Get Api Plan Subscription History
			this.props.getApiPlanSubHistory(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Api Call when press on complete button
	onCompletePress = async () => {

		//Check date validaion
		if (DateValidation(this.state.FromDate, this.state.ToDate, true))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
		else {

			this.setState({
				searchInput: '',
				selectedPage: 1,
			})

			// Close Drawer user press on Complete button because display flatlist item on Screen
			this.drawer.closeDrawer();

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Api Plan Subscription History
				this.request = {
					...this.request,
					PageNo: 0,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
					PlanId: this.state.selectedApiPlan !== R.strings.Select_Plan ? this.state.PlanId : '',
				}

				// Call Get Api Plan Subscription History API
				this.props.getApiPlanSubHistory(this.request);

			} else {
				this.setState({ refreshing: false });
			}
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (ApiPlanSubscriptionHistory.oldProps !== props) {
			ApiPlanSubscriptionHistory.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { ApiPlanSubscriptionHistoryData, UserDataList, ApiPlanConfigList } = props.ApiPlanHistoryResult

			// UserDataList is not null
			if (UserDataList) {
				try {
					//if local UserDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.UserDataListState == null || (state.UserDataListState != null && UserDataList !== state.UserDataListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: UserDataList, isList: true })) {
							let res = parseArray(UserDataList.GetUserData);

							for (var userDataKey in res) {
								let item = res[userDataKey]
								item.value = item.UserName
							}

							let userNames = [
								{ value: R.strings.Please_Select },
								...res
							];

							return { ...state, UserDataListState: UserDataList, UserNames: userNames };
						} else {
							return { ...state, UserDataListState: null, UserNames: [{ value: R.strings.Please_Select }] };
						}
					}
				} catch (e) {
					return { ...state, UserNames: [{ value: R.strings.Please_Select }], UserDataListState: null };
				}
			}

			// ApiPlanConfigList is not null
			if (ApiPlanConfigList) {
				try {
					//if local ApiPlanConfigList state is null or its not null and also different then new response then and only then validate response.
					if (state.ApiPlanConfigListState == null || (state.ApiPlanConfigListState != null && ApiPlanConfigList !== state.ApiPlanConfigListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ApiPlanConfigList, isList: true })) {
							let res = parseArray(ApiPlanConfigList.Response);

							for (var planKey in res) {
								let item = res[planKey]
								item.value = item.PlanName
							}

							let planNames = [
								{ value: R.strings.Select_Plan },
								...res
							];

							return { ...state, ApiPlanConfigListState: ApiPlanConfigList, ApiPlan: planNames };
						} else {
							return { ...state, ApiPlanConfigListState: ApiPlanConfigList, ApiPlan: [{ value: R.strings.Select_Plan }] };
						}
					}
				} catch (e) {
					return { ...state, ApiPlan: [{ value: R.strings.Select_Plan }], ApiPlanConfigListState: ApiPlanConfigList };
				}
			}

			// ApiPlanSubscriptionHistoryData is not null
			if (ApiPlanSubscriptionHistoryData) {
				try {
					if (state.ApiPlanSubscriptionHistoryState == null || (ApiPlanSubscriptionHistory !== state.ApiPlanSubscriptionHistoryState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: ApiPlanSubscriptionHistoryData, isList: true, })) {

							let res = parseArray(ApiPlanSubscriptionHistoryData.Response)

							for (var itemData in res) {
								let item = res[itemData]

								let statusText = ''
								// Expire
								if (item.Status == 0)
									statusText = R.strings.expire
								// Active
								else if (item.Status == 1)
									statusText = R.strings.active
								// Disable
								else if (item.Status == 2)
									statusText = R.strings.Disable
								// In Process
								else if (item.Status == 9)
									statusText = R.strings.inProcess

								item.StatusText = statusText
							}

							return Object.assign({}, state, {
								ApiPlanSubscriptionHistoryState: ApiPlanSubscriptionHistoryData,
								ApiPlanConfigHistoryRes: res,
								refreshing: false,
								row: addPages(ApiPlanSubscriptionHistoryData.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ApiPlanSubscriptionHistoryState: null,
								ApiPlanConfigHistoryRes: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ApiPlanSubscriptionHistoryState: null,
						ApiPlanConfigHistoryRes: [],
						refreshing: false,
						row: [],
					})
				}
			}
		} return null
	}

	// Drawer Navigation
	navigationDrawer() {

		return (
			// for show filter of fromdate, todate,currency and user data etc
			<FilterWidget FromDatePickerCall={(FromDate) => this.setState({ FromDate })} ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
				ToDate={this.state.ToDate}
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				toastRef={component => this.toast = component}
				FromDate={this.state.FromDate} comboPickerStyle={{ marginTop: 0 }}
				pickers={[
					{
						title: R.strings.userName,
						array: this.state.UserNames,
						selectedValue: this.state.selectedUser,
						onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
					},
					{
						title: R.strings.planID,
						array: this.state.ApiPlan,
						selectedValue: this.state.selectedApiPlan,
						onPickerSelect: (index, object) => this.setState({ selectedApiPlan: index, PlanId: object.ID })
					},
					{
						title: R.strings.status,
						array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, StatusId: object.Id })
					},
				]}
			/>
		)
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ApiPlanSubscriptionHistoryLoading, } = this.props.ApiPlanHistoryResult

		//For Searching Functionality
		let finalItems = this.state.ApiPlanConfigHistoryRes.filter(item => (
			item.PlanName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.UserID.toString().includes(this.state.searchInput) ||
			item.TotalAmt.toString().includes(this.state.searchInput)
		))

		return (
			// DrawerLayout for Api Plan Subscription History Filteration
			<Drawer
				drawerPosition={Drawer.positions.Right} easingFunc={Easing.ease}
				ref={cmpDrawer => this.drawer = cmpDrawer}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerContent={this.navigationDrawer()}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })} onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
			>

				<SafeView style={{
					flex: 1,
					backgroundColor: R.colors.background
				}}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						title={R.strings.apiPlanSubscriptionHistory}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(ApiPlanSubscriptionHistoryLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) =>
										<ApiPlanSubscriptionHistoryItem
											index={index}
											size={finalItems.length}
											item={item}
											onPress={() => this.props.navigation.navigate('ApiPlanSubscriptionHistoryDetail', { item })}
										/>}
									// assign index as key value to Withdraw Report list item
									keyExtractor={(_item, index) => index.toString()}
									// Refresh functionality in api plan configuration
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
											onRefresh={this.onRefresh}
											refreshing={this.state.refreshing}
										/>
									}
									contentContainerStyle=
									{contentContainerStyle(finalItems)}
									// Displayed empty component when no record found 
									ListEmptyComponent={<ListEmptyComponent />}
								/>
						}

						{/*To Set Pagination View  */}
						<View>
							{
								finalItems.length > 0 &&
								<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
							}
						</View>
					</View>
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class ApiPlanSubscriptionHistoryItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		// If new props and old props are equal then it will return false otherwise it will return true
		if (this.props.item === nextProps.item)
			return false
		return true
	}

	render() {
		let { size, index, item, onPress, } = this.props

		// Get Plan Validity in Year/Month/Days
		let planValidity = getPlanValidity(item.PlanValidityType)

		let statusColor = R.colors.textSecondary
		let statusText = ''
		// Expire
		if (item.Status == 0) {
			statusText = R.strings.expire
			statusColor = R.colors.failRed
		}
		// Active
		else if (item.Status == 1) {
			statusText = R.strings.active
			statusColor = R.colors.successGreen
		}
		// Disable
		else if (item.Status == 2) {
			statusText = R.strings.Disable 
		}
		// In Process
		else if (item.Status == 9) {
			statusText = R.strings.inProcess
			statusColor = R.colors.accent
		}

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin,
					marginLeft: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						borderRadius: 0,
						flex: 1,
						borderBottomLeftRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
					}} onPress={onPress}>

						<View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
								{/* Api Plan Name and Recursive */}
								<TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.PlanName}</TextViewMR>
							</View>

							{/* Year and Detail Button */}
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.yellow }}>{validateValue(item.PlanValidity + ' ' + planValidity)}</TextViewHML>
								<ImageTextButton
									icon={R.images.RIGHT_ARROW_DOUBLE}
									style={{ margin: 0 }}
									iconStyle={{
										width: R.dimens.dashboardMenuIcon,
										height: R.dimens.dashboardMenuIcon,
										tintColor: R.colors.textPrimary
									}}
								/>
							</View>
						</View>

						{/* Total Amount */}
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.planNetTotal + ': '}</TextViewHML>
							<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.TotalAmt)}</TextViewHML>
						</View>

						{/* User Id */}
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.userId + ': '}</TextViewHML>
							<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserID)}</TextViewHML>
						</View>

						{/* for show status and date */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={statusColor}
								value={statusText}></StatusChip>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.RequestedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get api plan subscription history data from reducer
		ApiPlanHistoryResult: state.ApiPlanSubscriptionHistoryReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Api Plan Subscription History Action
	getApiPlanSubHistory: (payload) => dispatch(getApiPlanSubHistory(payload)),
	// Perform User List Action
	getUserDataList: () => dispatch(getUserDataList()),
	// Perform Api Plan List Action
	getApiPlanConfigList: () => dispatch(getApiPlanConfigList()),
	// Perform Clear Api Plan Subscription History Action
	clearApiPlanConfigurationHistory: () => dispatch(clearApiPlanConfigurationHistory()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiPlanSubscriptionHistory)