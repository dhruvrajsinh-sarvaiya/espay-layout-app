import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { changeTheme, getCurrentDate, parseArray, addPages, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import Drawer from 'react-native-drawer-menu';
import R from '../../../native_theme/R';
import { getWalletType, getUserDataList, getOrgList } from '../../../actions/PairListAction';
import { getWithdrawReport } from '../../../actions/Wallet/WithdrawReportActions';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import FilterWidget from '../../widget/FilterWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import PaginationWidget from '../../widget/PaginationWidget';
import { DateValidation } from '../../../validations/DateValidation';

export class WithdrawReportScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			row: [],
			Status: [
				{ value: R.strings.select_status },
				{ ID: 1, value: R.strings.Success },
				{ ID: 2, value: R.strings.OperatorFail },
				{ ID: 3, value: R.strings.SystemFail },
				{ ID: 4, value: R.strings.Hold },
				{ ID: 5, value: R.strings.Refunded },
				{ ID: 6, value: R.strings.Pending },
			],
			Currency: [],
			UserNames: [],
			Organization: [],
			WithdrawReportResponse: [],
			WithdrawReportListState: null,

			searchInput: '',
			TrnId: '',
			Address: '',
			TrnNo: '',
			OrgId: 0,
			UserId: 0,
			StatusId: 0,
			selectedPage: 1,
			selectedStatus: R.strings.select_status,
			selectedCurrency: R.strings.selectCurrency,
			selectedUser: R.strings.Please_Select,
			selectedOrganization: R.strings.SelectOrg,

			isFirstTime: true,
			isDrawerOpen: false,
			refreshing: false,

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}

		//initial request
		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}

		// Create Reference
		this.drawer = React.createRef()

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
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

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme()

		// check internet connection
		if (await isInternet()) {
			// Withdraw Report Api Call
			this.props.getWithdrawReport(this.request)
			// Call Wallet Data Api
			this.props.getWalletType()
			// Call Get User List Api
			this.props.getUserDataList()
			// Call Get Organization List Api
			this.props.getOrgList()
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	// Reset Filter
	async onResetPress() {
		// Close drawer
		this.drawer.closeDrawer();

		// set Initial State
		this.setState({
			searchInput: '',
			selectedPage: 1,

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			TrnId: '',
			Address: '',
			TrnNo: '',
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

			// Bind request for Withdraw Report
			this.request = {
				...this.request,
				PageNo: 0,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				CoinName: '',
				UserId: '',
				Status: '',
				Address: '',
				TrnId: '',
				TrnNo: '',
				OrgId: ''
			}
			//Call Get Withdraw Report API
			this.props.getWithdrawReport(this.request);
		}
	}

	// Call api when user pressed on complete button
	async onCompletePress() {

		// Check validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true, 2))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true, 2))
		else {
			this.setState({
				PageSize: AppConfig.pageSize,
				selectedPage: 1,
			})

			// Close Drawer user press on Complete button bcoz display flatlist item on Screen
			this.drawer.closeDrawer();

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Withdraw Report
				this.request = {
					...this.request,
					FromDate: this.state.FromDate,
					Address: this.state.Address,
					TrnId: this.state.TrnId,
					TrnNo: this.state.TrnNo,
					OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : '',
					PageNo: 0,
					ToDate: this.state.ToDate,
					CoinName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
				}

				//Call Get Withdraw Report API
				this.props.getWithdrawReport(this.request);

			}

			//If Filter from Complete Button Click then empty searchInput
			this.setState({ searchInput: '' })
		}
	}

	// Pagination Method Called When User Change Page 
	async onPageChange(pageNo) {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {

			//if user selecte other page number then and only then API Call elase no need to call API
			this.setState({
				selectedPage: pageNo
			});

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Withdraw Report
				this.request = {
					...this.request,
					TrnId: this.state.TrnId,
					TrnNo: this.state.TrnNo,
					OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : '',
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
					Address: this.state.Address,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					CoinName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
					PageNo: pageNo - 1,
				}

				//Call Get Withdraw Report API
				this.props.getWithdrawReport(this.request);
			}
		}
	}

	// for swipe to refresh functionality
	async onRefresh(needUpdate, fromRefreshControl = false) {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (needUpdate && await isInternet()) {

			// Bind request for Withdraw Report
			this.request = {
				...this.request,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Address: this.state.Address,
				Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
				PageNo: this.state.selectedPage - 1,
				OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : '',
				TrnId: this.state.TrnId,
				TrnNo: this.state.TrnNo,
				CoinName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
				UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
			}
			// Call Get Withdraw Report API
			this.props.getWithdrawReport(this.request);

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
		if (WithdrawReportScreen.oldProps !== props) {
			WithdrawReportScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { WithdrawReportList, UserDataList, WalletDataList, OrganizationList } = props.WithdrawReportResult

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

							return { ...state, UserDataList, UserNames: userNames };
						} else {
							return { ...state, UserDataList, UserNames: [{ value: R.strings.Please_Select }] };
						}
					}
				} catch (e) {
					return { ...state, UserNames: [{ value: R.strings.Please_Select }] };
				}
			}

			// WalletDataList is not null
			if (WalletDataList) 
			{
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null 
						|| (state.WalletDataList != null && 
							WalletDataList !== state.WalletDataList)) 
							{

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) 
						{
							let res = parseArray(WalletDataList.Types);

							for (var WalletDataListKey in res) 
							{
								let item = res[WalletDataListKey]
								item.value = item.TypeName
							}

							let walletNames = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state,  Currency: walletNames, WalletDataList, };
						} else {
							return { ...state, Currency: [{ value: R.strings.selectCurrency }],  WalletDataList, };
						}
					}
				} catch (e) {
					return { ...state, 
						Currency: [{ value: R.strings.selectCurrency }] };
				}
			}

			// OrganizationList is not null
			if (OrganizationList) {
				try {
					//if local OrganizationList state is null or its not null and also different then new response then and only then validate response.
					if (state.OrganizationList == null || (state.OrganizationList != null && OrganizationList !== state.OrganizationList)) {

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

							return { ...state, OrganizationList, Organization: orgList };
						} else {
							return { ...state, OrganizationList, Organization: [{ value: R.strings.SelectOrg }] };
						}
					}
				} catch (e) {
					return { ...state, Organization: [{ value: R.strings.SelectOrg }] };
				}
			}

			// WithdrawReportList is not null
			if (WithdrawReportList) {
				try {
					if (state.WithdrawReportListState == null || (state.WithdrawReportListState !== null && WithdrawReportList !== state.WithdrawReportListState)) {
						//succcess response fill the list 
						if (validateResponseNew({
							response: WithdrawReportList, isList: true,
							returnCode: WithdrawReportList.BizResponseObj.ReturnCode,
							returnMessage: WithdrawReportList.BizResponseObj.ReturnMsg,
						})) {

							let withdrawResponseData = parseArray(WithdrawReportList.Withdraw)

							//for add status static
							for (var keyData in withdrawResponseData) {
								let item = withdrawResponseData[keyData];

								if (item.Status == 999)
									item.statusStatic = R.strings.other
								else if (item.Status == 1)
									item.statusStatic = R.strings.Success
								else if (item.Status == 2)
									item.statusStatic = R.strings.OperatorFail
								else if (item.Status == 3)
									item.statusStatic = R.strings.SystemFail
								else if (item.Status == 4)
									item.statusStatic = R.strings.Hold
								else if (item.Status == 5)
									item.statusStatic = R.strings.Refunded
								else if (item.Status == 6)
									item.statusStatic = R.strings.Pending
							}

							return Object.assign({}, state, {
								WithdrawReportListState: WithdrawReportList,
								WithdrawReportResponse: withdrawResponseData,
								refreshing: false,
								row: addPages(WithdrawReportList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								WithdrawReportListState: null,
								WithdrawReportResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						WithdrawReportList: null,
						WithdrawReportListState: [],
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
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				ToDate={this.state.ToDate}
				onResetPress={() => this.onResetPress()}
				comboPickerStyle={{ marginTop: 0 }}
				onCompletePress={() => this.onCompletePress()}
				toastRef={component => this.toast = component}
				textInputStyle={{ marginBottom: 0 }}
				pickers={[
					{
						title: R.strings.Currency, array: this.state.Currency, selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index) => this.setState({ selectedCurrency: index })
					},
					{
						title: R.strings.User,
						array: this.state.UserNames, selectedValue: this.state.selectedUser,
						onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
					},
					{
						title: R.strings.Status, array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, StatusId: object.ID })
					},
					{
						title: R.strings.Organization, array: this.state.Organization,
						selectedValue: this.state.selectedOrganization,
						onPickerSelect: (index, object) => this.setState({ selectedOrganization: index, OrgId: object.OrgID })
					},
				]}
				textInputs={[
					{
						header: R.strings.transactionNo, placeholder: R.strings.transactionNo,
						multiline: false, keyboardType: 'numeric',
						returnKeyType: "next", maxLength: 5,
						blurOnSubmit: false,
						onChangeText: (text) => { this.setState({ TrnNo: text }) },
						value: this.state.TrnNo,
					},
					{
						header: R.strings.Address,
						placeholder: R.strings.Address,
						multiline: false,
						keyboardType: 'default',
						returnKeyType: "next",
						maxLength: 100, blurOnSubmit: false,
						onChangeText: (text) => { this.setState({ Address: text }) }, value: this.state.Address,
					},
					{
						header: R.strings.transactionId, placeholder: R.strings.transactionId,
						multiline: false,
						keyboardType: 'default', returnKeyType: "done",
						maxLength: 100,
						onChangeText: (text) => { this.setState({ TrnId: text }) },
						value: this.state.TrnId,
					}

				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { WithdrawReportLoading, } = this.props.WithdrawReportResult

		// for searching functionality
		let finalItems = this.state.WithdrawReportResponse.filter(item => (
			item.CoinName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.OrganizationName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.statusStatic.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Amount.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Withdraw Report Filteration
			<Drawer
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })} type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				easingFunc={Easing.ease}
				ref={cmpDrawer => this.drawer = cmpDrawer} drawerWidth={R.dimens.FilterDrawarWidth} drawerContent={this.navigationDrawer()}
			>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />
					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						title={R.strings.withdrawalReport}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(WithdrawReportLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									showsVerticalScrollIndicator={false}
									data={finalItems}
									// render all item in list
									renderItem={({ item, index }) => <WithdrawReportItem
										onReconPress={() => this.props.navigation.navigate('WithdrawReconScreen', { item, onRefresh: this.onRefresh, })}
										item={item}
										size={finalItems.length}
										onPress={() => this.props.navigation.navigate('WithdrawReportDetailScreen', { item })}
										index={index}
									/>

									}
									// assign index as key value to Withdraw Report list item
									keyExtractor={(_item, index) => index.toString()}

									// For Refresh Functionality In Withdraw Report FlatList Item
									refreshControl={
										<RefreshControl
											oFnRefresh={() => this.onRefresh(true, true)}
											colors={[R.colors.accent]}
											refreshing={this.state.refreshing}
											progressBackgroundColor={R.colors.background}
										/>
									}
									contentContainerStyle={contentContainerStyle(finalItems)}
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
class WithdrawReportItem extends Component {

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
		let { size, index, item, onReconPress, onPress } = this.props

		let color = R.colors.yellow

		//set status color based on status code
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 2 || item.Status == 3)
			color = R.colors.failRed
		else if (item.Status == 5 || item.Status == 999 || item.Status == 4)
			color = R.colors.cardBalanceBlue

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						borderTopRightRadius: R.dimens.margin,
						flex: 1,
						borderRadius: 0, elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
					}} onPress={onPress}>

						<View style={{
							flex: 1,
							flexDirection: 'row'
						}}>
							{/* Currency Image */}
							<ImageViewWidget url={item.CoinName 
								? item.CoinName : ''} 
								height={R.dimens.drawerMenuIconWidthHeight}
								width={R.dimens.drawerMenuIconWidthHeight} 
								/>

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show username,amount and currency */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.CoinName}</Text>

									<View style={{ flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
											{(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}
										</Text>
										<ImageTextButton
											style={{ 
												padding: 0, 
												margin: 0, 
											}}
											icon={R.images.RIGHT_ARROW_DOUBLE}
											iconStyle={{ width: R.dimens.dashboardMenuIcon, 
												height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								{/* User Name */}
								<View 
								style={{ 
									flex: 1,
									flexDirection: 'row', 
									alignItems: 'center', 
									}}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, 
										color: R.colors.textSecondary, }}>{R.strings.Username + ': '}</TextViewHML>
									<TextViewHML style={{ 
										flex: 1, 
										fontSize: R.dimens.smallestText, 
										color: R.colors.textPrimary, }}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* Organization Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText,
										 color: R.colors.textSecondary, }}>{R.strings.Organization + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.OrganizationName)}</TextViewHML>
								</View>

								{/* From Address */}
								{/* 				<View style={{ flex: 1, flexDirection: 'row', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.From_Address + ': '}</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.FromAddress)}</TextViewHML>
								</View>
 */}
								{/* To Address */}
								<View style={{ flex: 1, flexDirection: 'row', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.toAddress + ': '}</TextViewHML>
									<TextViewHML numberOfLines={1}
									 ellipsizeMode="tail" style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.ToAddress)}</TextViewHML>
								</View>

							</View>
						</View>

						{/* for show status and recon icon */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.statusStatic} />

							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									style={{ margin: 0,
										 paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, marginRight: R.dimens.widgetMargin }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											margin: 0,
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth,
											padding: R.dimens.CardViewElivation,
											alignItems: 'center',
										}}
									icon={R.images.IC_REFER_SHARE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={onReconPress} />

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
		// get withdraw report data from reducer
		WithdrawReportResult: state.WithdrawReportReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// To Perform Withdraw Report Action
	getWithdrawReport: (payload) => dispatch(getWithdrawReport(payload)),
	// To Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// To Perform User Data Action
	getUserDataList: () => dispatch(getUserDataList()),
	// To Perform Organization List
	getOrgList: () => dispatch(getOrgList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawReportScreen)