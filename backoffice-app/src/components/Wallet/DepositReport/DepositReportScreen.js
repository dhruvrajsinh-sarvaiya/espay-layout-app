import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, addPages, parseArray, parseFloatVal, convertDateTime, getCurrentDate, addListener } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getWalletType, getUserDataList, getOrgList } from '../../../actions/PairListAction';
import { getDepositReport, clearDepositReportData } from '../../../actions/Wallet/DepositReportAction';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import ListLoader from '../../../native_theme/components/ListLoader';
import { Fonts, Events } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import StatusChip from '../../widget/StatusChip';
import { DateValidation } from '../../../validations/DateValidation';
import PaginationWidget from '../../widget/PaginationWidget';

export class DepositReportScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			row: [],
			Status: [
				{ value: R.strings.select_status },
				{ ID: 0, value: R.strings.processing },
				{ ID: 1, value: R.strings.Success },
				{ ID: 9, value: R.strings.Failed },
			],
			Currency: [],
			UserNames: [],
			Organization: [],
			DepositCheckRes: [],
			DepositReportResponse: [],

			WalletDataListState: null,
			DepositReportListState: null,
			UserDataListState: null,
			OrganizationListState: null,

			selectedStatus: R.strings.select_status,
			selectedCurrency: R.strings.selectCurrency,
			selectedUser: R.strings.Please_Select,
			selectedOrganization: R.strings.SelectOrg,

			isFirstTime: true,
			refreshing: false,
			isDrawerOpen: false,
			isSelectAll: false,

			TrnId: '',
			Address: '',
			searchInput: '',
			OrgId: 0,
			UserId: 0,
			StatusId: 0,
			selectedPage: 1,
			selectedItemCount: 0,

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate()
		}

		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate()
		}

		// Create Reference

		this.drawer = React.createRef()

		//Bind all methods

		this.onBackPress = this.onBackPress.bind(this);

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams(
			{ onBackPress: this.onBackPress }
			);
	}

	// If drawer is open then first, it will close the drawer and after it will return to previous screen
	onBackPress() {
		if (this.state.isDrawerOpen) 
		{
			this.drawer.closeDrawer();
			this.setState({ isDrawerOpen: false }
				)
		}
		else {
			//going back screen
			this.props.navigation.goBack();
		}
	}

	componentDidMount = async () => {
		// Call Listener from Deposit Recon
		this.eventListener = addListener(Events.DepositReconEvent, () => {
			this.callDepositeReportApi()
		})

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Deposit Report Api Call
			this.props.getDepositReport(this.request)
			// Call Wallet Data Api
			this.props.getWalletType()
			// Call Get User List Api
			this.props.getUserDataList()
			// Call Get Organization List Api
			this.props.getOrgList()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearDepositReportData()

		if (this.eventListener) {
			this.eventListener.remove();
		}
	}

	callDepositeReportApi = async () => {
		this.setState({ selectedItemCount: 0 })

		// check internet connection
		if (await isInternet()) {
			this.request = {
				PageNo: 0,
				PageSize: AppConfig.pageSize,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate()
			}

			// Deposit Report Api Call
			this.props.getDepositReport(this.request)
		}
	}

	// Get Selected Item From List Of Records
	getSelectedItems = () => {

		let selectItemList = [];
		this.state.DepositCheckRes.map((item, index) => {

			if (item.isSelected) {
				selectItemList.push(this.state.DepositReportResponse[index].TrnNo);
			}
		})
		this.setState({ selectedItemCount: selectItemList.length })
		return selectItemList;
	}

	//For Select All Items From List 
	selectAllItems = () => {

		//reverse curent all select value
		let isSelectAll = !this.state.isSelectAll;
		let checkArr = [];

		//loop through all records and set isSelected = isSelectAll
		this.state.DepositCheckRes.map((item) => {
			item.isSelected = isSelectAll;
			checkArr.push(item)
		})
		this.setState({ DepositCheckRes: checkArr, isSelectAll, selectedItemCount: checkArr.length })
		if (!isSelectAll) {
			this.setState({ selectedItemCount: 0 })
		}
	}

	// for swipe to refresh functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ selectedItemCount: 0, refreshing: true });

		// Check NetWork is Available or not
		if (needUpdate && await isInternet()) {

			// Bind request for Deposit Report
			this.request = {
				...this.request,
				CoinName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
				PageNo: this.state.selectedPage - 1,
				ToDate: this.state.ToDate,
				UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
				Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
				Address: this.state.Address,
				TrnId: this.state.TrnId,
				FromDate: this.state.FromDate,
				OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
			}
			// Call Get Deposit Report API
			this.props.getDepositReport(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Reset Filter
	onResetPress = async () => {
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
			selectedItemCount: 0,
			selectedStatus: R.strings.select_status,
			selectedCurrency: R.strings.selectCurrency,
			selectedUser: R.strings.Please_Select,
			selectedOrganization: R.strings.SelectOrg,
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Deposit Report
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
				OrgId: ''
			}
			//Call Get Deposit Report API
			this.props.getDepositReport(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {


		// Check validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true, 2))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true, 2))
		else {

			this.setState({
				selectedPage: 1,
				PageSize: AppConfig.pageSize,
				selectedItemCount: 0,
			})

			// Close Drawer user press on Complete button bcoz display flatlist item on Screen
			this.drawer.closeDrawer();

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Deposit Report
				this.request = {
					...this.request,
					TrnId: this.state.TrnId,
					PageNo: 0,
					CoinName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
					FromDate: this.state.FromDate,
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
					Address: this.state.Address,
					ToDate: this.state.ToDate,
					OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
				}
				//Call Get Deposit Report API
				this.props.getDepositReport(this.request);

			} else {
				this.setState({ refreshing: false });
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
			this.setState({ selectedPage: pageNo, selectedItemCount: 0 });

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Deposit Report
				this.request = {
					...this.request,
					PageNo: pageNo - 1,
					TrnId: this.state.TrnId,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					Address: this.state.Address,
					CoinName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
					OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
				}
				//Call Get Deposit Report API
				this.props.getDepositReport(this.request);

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
		if (DepositReportScreen.oldProps !== props) {
			DepositReportScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { DepositReportList, UserDataList, WalletDataList, OrganizationList } = props.DepositReportResult

			// UserDataList is not null
			if (UserDataList) {
				try {
					//if local UserDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.UserDataListState == null || (UserDataList !== state.UserDataListState)) {

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

							return { ...state, UserDataListState: UserDataList, UserNames: userNames };
						} else {
							return { ...state, UserDataListState: UserDataList, UserNames: [{ value: R.strings.Please_Select }] };
						}
					}
				} catch (e) {
					return { ...state, UserNames: [{ value: R.strings.Please_Select }] };
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataListState == null || (state.WalletDataListState != null && WalletDataList !== state.WalletDataListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							let res = parseArray(WalletDataList.Types);

							for (var walletDataKey in res) {
								let item = res[walletDataKey]
								item.value = item.TypeName
							}

							let walletNames = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, WalletDataListState: WalletDataList, Currency: walletNames };
						} else {
							return { ...state, WalletDataListState: null, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}

			// OrganizationList is not null
			if (OrganizationList) {
				try {
					//if local OrganizationList state is null or its not null and also different then new response then and only then validate response.
					if (state.OrganizationListState == null || (state.OrganizationListState != null && OrganizationList !== state.OrganizationListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: OrganizationList, isList: true })) {
							let res = parseArray(OrganizationList.Organizations);

							for (var orgDataKey in res) {
								let item = res[orgDataKey]
								item.value = item.OrgName
							}

							let orgList = [
								{ value: R.strings.SelectOrg },
								...res
							];

							return { ...state, OrganizationListState: OrganizationList, Organization: orgList };
						} else {
							return { ...state, OrganizationListState: OrganizationList, Organization: [{ value: R.strings.SelectOrg }] };
						}
					}
				} catch (e) {
					return { ...state, Organization: [{ value: R.strings.SelectOrg }] };
				}
			}

			// DepositReportList is not null
			if (DepositReportList) {
				try {
					if (state.DepositReportListState == null || (DepositReportList !== state.DepositReportListState)) {
						//succcess response fill the list 
						if (validateResponseNew({
							response: DepositReportList, isList: true,
							returnCode: DepositReportList.BizResponseObj.ReturnCode,
							returnMessage: DepositReportList.BizResponseObj.ReturnMsg,
						})) {

							let res = parseArray(DepositReportList.Deposit)
							res.map((_item, index) => {
								res[index].isSelected = false;
							})

							return Object.assign({}, state, {
								DepositReportListState: DepositReportList,
								DepositCheckRes: res,
								DepositReportResponse: parseArray(DepositReportList.Deposit),
								refreshing: false,
								row: addPages(DepositReportList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								DepositReportListState: null,
								DepositReportResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						DepositReportListState: null,
						DepositReportResponse: [],
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
			onResetPress={this.onResetPress}
			ToDatePickerCall={(date) => this.setState({ ToDate: date })}
			FromDate={this.state.FromDate}
			ToDate={this.state.ToDate}
			FromDatePickerCall={(date) => this.setState({ FromDate: date })}
			toastRef={component => this.toast = component}
			comboPickerStyle={{ marginTop: 0 }}
			textInputStyle={{ marginBottom: 0 }}
			onCompletePress={this.onCompletePress}
				pickers={[
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index) => this.setState({ selectedCurrency: index })
					},
					{
						title: R.strings.User,
						array: this.state.UserNames,
						selectedValue: this.state.selectedUser,
						onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
					},
					{
						title: R.strings.Status,
						array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, StatusId: object.ID })
					},
					{
						title: R.strings.Organization,
						array: this.state.Organization,
						selectedValue: this.state.selectedOrganization,
						onPickerSelect: (index, object) => this.setState({ selectedOrganization: index, OrgId: object.OrgID })
					},
				]}
				textInputs={[
					{
						blurOnSubmit: false,
						placeholder: R.strings.transactionNo,
						multiline: false,
						keyboardType: 'numeric',
						returnKeyType: "next",
						header: R.strings.transactionNo,
						maxLength: 5,
						onChangeText: (text) => { this.setState({ TrnNo: text }) },
						value: this.state.TrnNo,
					},
					{
						returnKeyType: "next",
						multiline: false,
						keyboardType: 'default',
						header: R.strings.Address,
						maxLength: 100,
						blurOnSubmit: false,
						placeholder: R.strings.Address,
						onChangeText: (text) => { this.setState({ Address: text }) },
						value: this.state.Address,
					},
					{
						header: R.strings.transactionId,
						placeholder: R.strings.transactionId,
						multiline: false,
						keyboardType: 'default',
						returnKeyType: "done",
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
		let { DepositReportLoading } = this.props.DepositReportResult

		// for searching functionality
		let finalItems = this.state.DepositReportResponse.filter(item => (
			item.CoinName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.OrganizationName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Address.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Amount.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Deposit Report Filteration
			<Drawer
			onDrawerClose={() => this.setState({ isDrawerOpen: false })}
			drawerWidth={R.dimens.FilterDrawarWidth}
			drawerContent={this.navigationDrawer()}
			onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
			ref={cmpDrawer => this.drawer = cmpDrawer}
			drawerPosition={Drawer.positions.Right}
			type={Drawer.types.Overlay}
				easingFunc={Easing.ease}
				>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						title={R.strings.deposit_report}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View>
						{this.state.selectedItemCount > 0 ?
							<CardView style={{
								elevation: R.dimens.listCardElevation,
								borderRadius: 0,
								margin: R.dimens.margin,
								flexDirection: 'row'
							}}>
								<Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.selectedItemCount + ' ' + R.strings.Selected}</Text>

								<ImageTextButton
									style={{ margin: 0, padding: 0, }}
									icon={R.images.IC_REFER_SHARE}
									onPress={() => this.props.navigation.navigate('DepositReconListScreen', { IDS: this.getSelectedItems(), item: finalItems })}
									iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
								/>
								<ImageTextButton
									style={{ margin: 0, padding: 0, }}
									icon={R.images.IC_SELECT_ALL}
									onPress={this.selectAllItems}
									iconStyle={{ padding: 0, margin: 0, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
								/>
							</CardView> : null
						}
					</View>

					<View style={{ flex: 1, justifyContent: 'space-between', }}>
						{
							(DepositReportLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <DepositReportItem
										index={index}
										item={item}
										size={finalItems.length}
										isSelected={this.state.DepositCheckRes[index].isSelected}
										onChecked={() => {
											let checkArray = this.state.DepositCheckRes
											checkArray[index].isSelected = !checkArray[index].isSelected
											this.setState({ DepositCheckRes: checkArray })
											this.getSelectedItems()
										}}
										onPress={() => this.props.navigation.navigate('DepositReportDetailScreen', { item })} />
									}
									// assign index as key value to Deposit Report list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In Deposit Report FlatList Item
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]}
											progressBackgroundColor={R.colors.background}
											refreshing={this.state.refreshing}
											onRefresh={() => this.onRefresh(true, true)}
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
class DepositReportItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item && this.props.isSelected === nextProps.isSelected && this.props.onChecked === nextProps.onChecked)
			return false
		return true
	}

	render() {
		let { size, index, item, onPress, onChecked, isSelected } = this.props

		let color = R.colors.yellow
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 9)
			color = R.colors.failRed
		else if (item.Status == 0)
			color = R.colors.accent
		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={
					{
					flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? (isSelected ? R.dimens.widgetMargin : R.dimens.widget_top_bottom_margin) : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin,
					marginLeft: R.dimens.widget_left_right_margin,
				}}>
					<CardView style= 
					{{
						borderBottomLeftRadius: R.dimens.margin,
						flex: 1,
						borderRadius: 0,
						borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,
					}} onPress={onPress}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show username,amount and currency */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.CoinName)}</Text>

									<View style={{ flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
											{(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}
										</Text>
										<ImageTextButton
											onPress={onChecked}
											icon={isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
											style={{ padding: 0, margin: 0, marginLeft: R.dimens.widgetMargin }}
											iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: isSelected ? R.colors.accent : R.colors.textPrimary }}
										/>
									</View>
								</View>

								{/* User Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Username + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* Address */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Address + ': '}</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Address)}</TextViewHML>
								</View>

								{/* Organization Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Organization + ': '}</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.OrganizationName)}</TextViewHML>
								</View>

							</View>
						</View>

						{/* for show status and recon icon */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StatusStr ? item.StatusStr : '-'} />

							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>

								<ImageTextButton
									icon={R.images.RIGHT_ARROW_DOUBLE}
									style={{ padding: 0, margin: 0, }}
									iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
								/>

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
		// get deposit report data from reducer
		DepositReportResult: state.DepositReportReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// Perform Deposit Report Action
	getDepositReport: (payload) => dispatch(getDepositReport(payload)),
	// Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// Perform User Data Action
	getUserDataList: () => dispatch(getUserDataList()),
	// Perform Organization List
	getOrgList: () => dispatch(getOrgList()),
	// Clear Deposit Report Data
	clearDepositReportData: () => dispatch(clearDepositReportData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositReportScreen)