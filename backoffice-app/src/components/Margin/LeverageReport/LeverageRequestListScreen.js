import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing, Image } from 'react-native'
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { AppConfig } from '../../../controllers/AppConfig';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { connect } from 'react-redux';
import { getLeverageReqList, clearLeverageReqData } from '../../../actions/Margin/LeverageRequestActions';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { changeTheme, parseArray, addPages, getCurrentDate, parseFloatVal, convertDateTime, logger } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../../widget/PaginationWidget';
import FilterWidget from '../../widget/FilterWidget';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import { getUserDataList, getWalletType } from '../../../actions/PairListAction';
import { DateValidation } from '../../../validations/DateValidation';
import SafeView from '../../../native_theme/components/SafeView';

export class LeverageRequestListScreen extends Component {
	constructor(props) {
		super(props);

		//To Bind All Method
		this.onBackPress = this.onBackPress.bind(this);

		// Define all initial state
		this.state = {
			row: [],
			Currency: [],
			UserNames: [],
			LeverageReqListResponse: [],

			searchInput: '',
			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false, // First Time Drawer is Closed
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),

			UserId: 0,
			WalletTypeId: 0,
			selectedPage: 1,
			selectedUser: R.strings.Please_Select,
			selectedCurrency: R.strings.selectCurrency,
		}

		// create reference
		this.drawer = React.createRef();
		this.toast = React.createRef();

		// Initial request
		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate()

		}

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({
			onBackPress: this.onBackPress
		});
	}

	//for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
	onBackPress() {
		if (this.state.isDrawerOpen) {

			this.drawer.closeDrawer();

			this.setState({
				isDrawerOpen: false
			})
		}
		else {

			//going back screen
			this.props.navigation.goBack();
		}
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.

		changeTheme();

		// Check internet connection
		if (await isInternet()) {
			// Get Leverage Request Api 
			this.props.getLeverageReqList(this.request)
			// Call Get User List Api
			this.props.getUserDataList()
			// Call Get Wallet List Api
			this.props.getWalletType()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentWillUnmount = () => {
		//for Data clear on Backpress
		this.props.clearLeverageReqData();
	}

	// Pagination Method Called When User Change Page  
	onPageChange = async (pageNo) => {

		//if user selecte other page number then and only then API Call elase no need to call API
		this.setState({ selectedPage: pageNo });

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Leverage Report
			this.request = {
				...this.request,
				PageNo: pageNo - 1,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
				UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
			}
			//Call Get Leverage Report API
			this.props.getLeverageReqList(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Reset Filter
	onResetPress = async () => {
		this.drawer.closeDrawer();

		// set Initial State
		this.setState({
			selectedPage: 1,
			PageSize: AppConfig.pageSize,
			selectedUser: R.strings.Please_Select,
			selectCurrency: R.strings.selectCurrency,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			searchInput: '',
			WalletTypeId: 0,
		})

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Leverage Report
			this.request = {
				...this.request,
				PageNo: 0,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				WalletTypeId: '',
				UserId: '',
			}

			//Call Get Leverage Report API
			this.props.getLeverageReqList(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Api Call when press on complete button
	onCompletePress = async () => {

		//Check All From Date Validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
			return;
		}
		else {
			// Close Drawer user press on Complete button bcoz display flatlist item on Screen
			this.drawer.closeDrawer();

			this.setState({
				PageNo: 0,
				PageSize: AppConfig.pageSize,
			})

			//Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Leverage Report
				this.request = {
					...this.request,
					PageNo: 0,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
				}

				//Call Get Leverage Report API
				this.props.getLeverageReqList(this.request);

			} else {
				this.setState({ refreshing: false });
			}
			//If Filter from Complete Button Click then empty searchInput
			this.setState({ searchInput: '' })
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Leverage Request
			this.request = {
				...this.request,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				PageNo: this.state.selectedPage - 1,
				WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
				UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
			}

			//Call Get Leverage Request API
			this.props.getLeverageReqList(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (LeverageRequestListScreen.oldProps !== props) {
			LeverageRequestListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { LeverageReqList, UserDataList, WalletDataList } = props.LeverageRequestResult;

			// LeverageReqList is not null
			if (LeverageReqList) {
				try {
					if (state.LeverageReqList == null || (state.LeverageReqList != null && LeverageReqList !== state.LeverageReqList)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: LeverageReqList, isList: true })) {

							return Object.assign({}, state, {
								LeverageReqList,
								LeverageReqListResponse: parseArray(LeverageReqList.Data),
								refreshing: false,
								row: addPages(LeverageReqList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								LeverageReqList: null,
								refreshing: false,
								LeverageReqListResponse: [],
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						LeverageReqList: null,
						LeverageReqListResponse: [],
						refreshing: false,
						row: [],
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// UserDataList is not null
			if (UserDataList) {
				try {
					//if local UserDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.UserDataList == null || (state.UserDataList != null && UserDataList !== state.UserDataList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: UserDataList, isList: true })) {

							// Parsing array from data

							let res = parseArray(UserDataList.GetUserData);

							// fetching only UserName from response

							for (var dataUser in res) {
								let item = res[dataUser]

								item.value = item.UserName
							}

							let userNames = [
								{ value: R.strings.Please_Select },
								...res
							];

							return {
								...state,
								UserDataList, UserNames: userNames
							};
						} else {
							return {
								...state, UserDataList,
								UserNames: [{ value: R.strings.Please_Select }]
							};
						}
					}
				} catch (e) {
					return {
						...state, UserNames: [{
							value: R.strings.Please_Select
						}]
					};
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {

				try {

					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

						//if  response is success then store array list else store empty list

						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							logger('WalletDataList', WalletDataList.Types)

							// Parsing array from data
							let res = parseArray(WalletDataList.Types)

							// fetching only UserName from response
							for (var walletListKey in res) {
								let item = res[walletListKey]
								item.value = item.TypeName
							}

							let walletNames = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, WalletDataList, Currency: walletNames };
						} else {
							return { ...state, WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}

			}

		}
		return null
	}

	// Drawer Navigation

	navigationDrawer() {

		return (
			// for show filter of fromdate, todate,currency and user data
			<FilterWidget
				ToDate={this.state.ToDate}
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				comboPickerStyle={{ marginTop: 0 }}
				FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
				ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
				FromDate={this.state.FromDate}
				toastRef={component => this.toast = component}
				pickers={[
					{
						title: R.strings.Currency,
						array: this.state.Currency, selectedValue: this.state.selectedCurrency, onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.ID })
					},
					{
						title: R.strings.User,
						array: this.state.UserNames,
						selectedValue: this.state.selectedUser,
						onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
					}
				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { LeverageReqListLoading, } = this.props.LeverageRequestResult;

		//for final items from search input (validate on Amount, WalletTypeName, UserName, SystemRemarks)
		//default searchInput is empty so it will display all records.
		let finalItems = this.state.LeverageReqListResponse.filter(item => ('' + item.Amount).includes(this.state.searchInput) ||
			item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()));

		return (
			//DrawerLayout for Leverage Request Filteration
			<Drawer
				drawerWidth={R.dimens.FilterDrawarWidth}
				type={Drawer.types.Overlay} ref={cmpDrawer => this.drawer = cmpDrawer}
				drawerPosition={Drawer.positions.Right}
				drawerContent={this.navigationDrawer()}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				easingFunc={Easing.ease}>

				<SafeView style={{
					flex: 1,
					backgroundColor: R.colors.background
				}}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}

					<CustomToolbar
						onRightMenuPress={() => this.drawer.openDrawer()}
						rightIcon={R.images.FILTER}
						title={R.strings.leverageRequests}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(LeverageReqListLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <LeverageRequestListItem
										index={index}
										item={item}
										size={finalItems.length}
										onPress={() => this.props.navigation.navigate('LeverageRequestDetailScreen', { item })}
									/>
									}
									// assign index as key valye to Withdrawal list item
									keyExtractor={(item, index) => index.toString()}
									// For Refresh Functionality In Withdrawal FlatList Item
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]}
											onRefresh={this.onRefresh}
											refreshing={this.state.refreshing}
											progressBackgroundColor={R.colors.background}
										/>
									}
									// Displayed Empty Component when no record found 
									ListEmptyComponent={<ListEmptyComponent />}
									contentContainerStyle={contentContainerStyle(finalItems)}
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
class LeverageRequestListItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item)
			return false
		return true
	}

	render() {
		let { size, index, item, onPress } = this.props

		//To Display various Status Color in ListView
		let color = R.colors.accent;

		if (item.Status == 0) {
			color = R.colors.textSecondary
		}
		if (item.Status == 1) {
			color = R.colors.successGreen
		}
		if (item.Status === 3 || item.Status == 9) {
			color = R.colors.failRed
		}
		if (item.Status == 6) {
			color = R.colors.yellow
		}

		return (
			// for Flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						flex: 1,
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
						borderRadius: 0,
					}} onPress={onPress}>
						<View style={{ flex: 1, flexDirection: 'row' }}>

							{/* Currency Image */}
							<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

								{/* for show username and  creadit amount */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.UserName}</Text>

									<View style={{ flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
											{(parseFloatVal(item.CreditAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.CreditAmount).toFixed(8)) : '-') + " " + item.WalletTypeName}
										</Text>
										<Image
											source={R.images.RIGHT_ARROW_DOUBLE}
											style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								{/* for show fromwallte and toWallte name */}
								<View style={{ flexDirection: 'row', flex: 1 }}>
									<Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.wallet + ': '}</Text>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.FromWalletName}</Text>
									<Image
										source={R.images.IC_RIGHT_LONG_ARROW}
										style={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
									/>
									<Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.ToWalletName}</Text>
								</View>

							</View>
						</View >

						{/* for show Amount, charge and leverage amount */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Amount}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Charge}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.ChargeAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.ChargeAmount).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.levAmount}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.LeverageAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.LeverageAmount).toFixed(8)) : '-')}
								</TextViewHML>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>   {item.LeveragePer + " % " + R.strings.lev}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and DateTime */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StrStatus ? item.StrStatus : '-'}></StatusChip>

							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
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
		// get leverage request from reducer
		LeverageRequestResult: state.LeverageRequestReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Leverage Req List Action
	getLeverageReqList: (payload) => dispatch(getLeverageReqList(payload)),
	// To Perform User Data Action
	getUserDataList: () => dispatch(getUserDataList()),
	// To Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// To clear leverage data action
	clearLeverageReqData: () => dispatch(clearLeverageReqData())
});

export default connect(mapStateToProps, mapDispatchToProps)(LeverageRequestListScreen);
