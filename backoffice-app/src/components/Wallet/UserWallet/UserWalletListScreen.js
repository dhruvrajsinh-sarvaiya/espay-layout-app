import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getUserWalletsList, clearUserWalletsData } from '../../../actions/Wallet/UserWalletsActions';
import { getWalletType, getUserDataList, getOrgList } from '../../../actions/PairListAction';
import { validateResponseNew, isInternet, validateValue } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import ListLoader from '../../../native_theme/components/ListLoader';
import PaginationWidget from '../../widget/PaginationWidget';
import { connect } from 'react-redux';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import FilterWidget from '../../widget/FilterWidget';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';

export class UserWalletListScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			row: [],
			Status: [
				{ value: R.strings.select_status },
				{ ID: 1, value: R.strings.Enable },
				{ ID: 2, value: R.strings.Disable },
				{ ID: 3, value: R.strings.freeze },
				{ ID: 4, value: R.strings.inoperative },
				{ ID: 5, value: R.strings.Suspended },
				{ ID: 6, value: R.strings.Blocked },
				{ ID: 9, value: R.strings.deleted },
			],
			Currency: [],
			UserNames: [],
			Organization: [],
			UserWalletsResponse: [],

			selectedStatus: R.strings.select_status,
			selectedCurrency: R.strings.selectCurrency,
			selectedUser: R.strings.Please_Select,
			selectedOrganization: R.strings.SelectOrg,

			searchInput: '',
			ToDate: '',
			FromDate: '',
			OrgId: 0,
			UserId: 0,
			StatusId: 0,
			selectedPage: 1,

			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false,
		}

		//initial request
		this.request = { PageNo: 0, PageSize: AppConfig.pageSize }
		// Create Reference
		this.drawer = React.createRef()
		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);
		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}



	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// User Wallets Api Call
			this.props.getUserWalletsList(this.request)
			// Call Wallet Data Api
			this.props.getWalletType()
			// Call Get User List Api
			this.props.getUserDataList()
			// Call Get Organization List Api
			this.props.getOrgList()
		}
	}
	// If drawer is open then first, it will close the drawer and after it will return to previous screen
	onBackPress() {
		if (this.state.isDrawerOpen) {
			this.drawer.closeDrawer();
			this.setState({ isDrawerOpen: false })
		} else {
			//goging back screen
			this.props.navigation.goBack();
		}
	}
	componentWillUnmount() {
		// clear reducer on backpress
		this.props.clearUserWalletsData()
	}
	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for User Wallets
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage - 1,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
				UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
				OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : '',
				WalletType: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
			}

			// Call Get User Wallets API
			this.props.getUserWalletsList(this.request);
		} else {
			this.setState({ refreshing: false });
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		//stop twice api call
		return isCurrentScreen(nextProps);
	}


	// Reset Filter
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer();

		// set Initial State
		this.setState({
			searchInput: '',
			selectedPage: 1,
			FromDate: '',
			ToDate: '',
			OrgId: 0,
			UserId: 0,
			StatusId: 0,
			selectedStatus: R.strings.select_status,
			selectedCurrency: R.strings.selectCurrency,
			selectedUser: R.strings.Please_Select,
			selectedOrganization: R.strings.SelectOrg,
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for User Wallets
			this.request = {
				...this.request,
				PageNo: 0,
				FromDate: '',
				ToDate: '',
				WalletType: '',
				UserId: '',
				Status: '',
				OrgId: ''
			}

			//Call Get User Wallets API
			this.props.getUserWalletsList(this.request);
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {
		// Both date required
		if (this.state.FromDate === ""
			&& this.state.ToDate !== "" ||
			this.state.FromDate !== "" &&
			this.state.ToDate === "") {
			this.toast.Show(R.strings.bothDateRequired);
			return
		}

		// Check validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
		else {
			this.setState({
				PageSize: AppConfig.pageSize,
				selectedPage: 1,
			})

			// Close Drawer user press on Complete button bcoz display flatlist item on Screen
			this.drawer.closeDrawer();
			// Check NetWork is Available or not
			if (await isInternet()) {
				// Bind request for User Wallets
				this.request = {
					...this.request,
					ToDate: this.state.ToDate,
					WalletType: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
					PageNo: 0,
					FromDate: this.state.FromDate,
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
					OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
				}
				//Call Get User Wallets API
				this.props.getUserWalletsList(this.request);
			}

			//If Filter from Complete Button Click then empty searchInput
			this.setState({ searchInput: '' })
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

				// Bind request for User Wallets
				this.request = {
					...this.request,
					PageNo: pageNo - 1,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					WalletType: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
					OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
				}

				//Call Get User Wallets API
				this.props.getUserWalletsList(this.request);
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
		if (UserWalletListScreen.oldProps !== props) {
			UserWalletListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { UserWalletsList, UserDataList, WalletDataList, OrganizationList } = props.UserWalletsResult

			// UserDataList is not null
			if (UserDataList) {
				try {
					//if local UserDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.UserDataList == null || (state.UserDataList !== null && UserDataList !== state.UserDataList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: UserDataList, isList: true })) {
							let res = parseArray(UserDataList.GetUserData);

							for (var dataItem in res) {
								let item = res[dataItem]

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
				}
				 catch (e) 
				{
					return { ...state, 
						yUserNames: [{ value: R.strings.Please_Select }] };
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null 
						|| (state.WalletDataList != null 
							&& WalletDataList !== state.WalletDataList))
							 {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							let res = parseArray(WalletDataList.Types);

							for (var WalletDataListKey in res) 
							{

								let item = res[WalletDataListKey]
								item.value = item.TypeName
							}

							let walletNames = 
							[
								{ value: R.strings.selectCurrency },
								...res
							];

							return {
								...state, WalletDataList,
								Currency: walletNames
							};
						} else {
							return { ...state, WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return {
						...state,
						Currency: [{ value: R.strings.selectCurrency }]
					};
				}
			}

			// OrganizationList is not null
			if (OrganizationList) {
				try {
					//if local OrganizationList state is null or its not null and also different then new response then and only then validate response.
					if (state.OrganizationList == null
						|| (state.OrganizationList != null
							&& OrganizationList !== state.OrganizationList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: OrganizationList, isList: true })) {
							let res = parseArray(OrganizationList.Organizations);

							for (var OrganizationListKey in res) {
								let item = res[OrganizationListKey]
								item.value = item.OrgName
							}

							let orgList = [
								{ value: R.strings.SelectOrg },
								...res
							];

							return {
								...state, OrganizationList,
								Organization: orgList
							};
						} else {
							return { ...state, OrganizationList, Organization: [{ value: R.strings.SelectOrg }] };
						}
					}
				} catch (e) {
					return {
						...state,
						Organization: [{ value: R.strings.SelectOrg }]
					};
				}
			}

			// UserWalletsList is not null
			if (UserWalletsList) {
				try {
					if (state.UserWalletsList == null || (state.UserWalletsList !== null && UserWalletsList !== state.UserWalletsList)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: UserWalletsList, isList: true, })) {

							return Object.assign({}, state, {
								UserWalletsList,
								UserWalletsResponse: parseArray(UserWalletsList.Data),
								refreshing: false,
								row: addPages(UserWalletsList.TotalWallet)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								UserWalletsList: null,
								UserWalletsResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						UserWalletsList: null,
						UserWalletsResponse: [],
						refreshing: false,
						row: [],
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}
		return null
	}

	// Drawer Navigation
	navigationDrawer() {

		return (
			// for show filter of fromdate, todate,currency and user data etc
			<FilterWidget
				isCancellable
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				ToDate={this.state.ToDate}
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0 }}
				pickers={[
					{
						title: R.strings.Status,
						array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, StatusId: object.ID })
					},
					{
						title: R.strings.User, array: this.state.UserNames,
						selectedValue: this.state.selectedUser, onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
					},
					{
						title: R.strings.Organization,
						array: this.state.Organization, selectedValue: this.state.selectedOrganization,
						onPickerSelect: (index, object) => this.setState({ selectedOrganization: index, OrgId: object.OrgID })
					},
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index) => this.setState({ selectedCurrency: index })
					},
				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { UserWalletsLoading, } = this.props.UserWalletsResult

		// For searching
		let finalItems = this.state.UserWalletsResponse.filter(item => (
			item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Walletname.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Balance.toString().includes(this.state.searchInput.toString())
		))

		return (
			//DrawerLayout for User Wallets Filteration
			<Drawer
				easingFunc={Easing.ease}
				ref={cmpDrawer => this.drawer = cmpDrawer}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerContent={this.navigationDrawer()}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
			>

				<SafeView style={{
					backgroundColor: R.colors.background,
					flex: 1,
				}}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.UserWallets}
						onBackPress={this.onBackPress}
						isBack={true}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(UserWalletsLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									// render all item in list
									renderItem={({ item, index }) => <UserWalletListItem
										index={index}
										item={item}
										size={finalItems.length}
										onPress={() => this.props.navigation.navigate('UserWalletsDetailScreen', { item })} />
									}
									// assign index as key value to User Wallets list item
									keyExtractor={(_item, index) => index.toString()}

									showsVerticalScrollIndicator={false}
									// For Refresh Functionality In User Wallets FlatList Item
									refreshControl={
										<RefreshControl
											onRefresh={this.onRefresh}
											progressBackgroundColor={R.colors.background}
											colors={[R.colors.accent]}
											refreshing={this.state.refreshing}
										/>
									}
									// Displayed empty component when no record found 
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
class UserWalletListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item) { return false }
		return true
	}

	render() {
		let color = R.colors.accent
		let { item, onPress, size, index } = this.props

		//set status color based on status code
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 2 || item.Status == 5 || item.Status == 6 || item.Status == 9)
			color = R.colors.failRed

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
						flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
					}} onPress={onPress}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show username,amount and currency */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName}</Text>
										<TextViewHML style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, }}>{item.IsDefaultWallet == 1 ? ' - ' + R.strings.default : ''}</TextViewHML>
									</View>

									<View style={{ flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
											{(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}
										</Text>
										<ImageTextButton
											icon={R.images.RIGHT_ARROW_DOUBLE}
											style={{ padding: 0, margin: 0, }}
											iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								{/* User Name */}
								<View style={{
									flexDirection: 'row',
									flex: 1,
									alignItems: 'center',
								}}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Username + ': '}</TextViewHML>
									<TextViewHML
										style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* Wallet Name */}
								<View style={{
									flex: 1, flexDirection: 'row',
									alignItems: 'center',
								}}>
									<TextViewHML style={{
										fontSize: R.dimens.smallestText,
										color: R.colors.textSecondary,
									}}>{R.strings.WalletName + ': '}</TextViewHML>
									<TextViewHML style={{
										flex: 1,
										fontSize: R.dimens.smallestText, color: R.colors.textPrimary,
									}}>{validateValue(item.Walletname)}</TextViewHML>
								</View>

							</View>

						</View>
						{/* for show status and recon icon */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StrStatus ? item.StrStatus : '-'} />

							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
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
		// get user wallets data from reducer
		UserWalletsResult: state.UserWalletsReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// Perform User Wallets Action
	getUserWalletsList: (payload) => dispatch(getUserWalletsList(payload)),
	// Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// Perform User Data Action
	getUserDataList: () => dispatch(getUserDataList()),
	// Perform Organization List
	getOrgList: () => dispatch(getOrgList()),
	// Clear User Wallets Data
	clearUserWalletsData: () => dispatch(clearUserWalletsData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserWalletListScreen)