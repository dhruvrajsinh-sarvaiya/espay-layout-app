import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseFloatVal, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import { validateValue, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getConflictHistory, clearConflictHistory } from '../../../actions/Arbitrage/ConflictHistoryActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import { getProviderList, getArbitrageCurrencyList, getArbitrageProviderList, getCurrencyList } from '../../../actions/PairListAction';
import StatusChip from '../../widget/StatusChip';
import { DateValidation } from '../../../validations/DateValidation';

export class ConflictHistoryScreen extends Component {
	constructor(props) {
		super(props);

		// 1 for conflict history , 2 for arbitrage conflict history
		let screenType = props.navigation.state.params && props.navigation.state.params.screenType

		//Define all initial state
		this.state = {
			titleScreen: R.strings.conflictHistory,
			screenType: screenType,
			ConflictHistoryResponse: [],

			ConflictHistoryListState: null,
			ArbitrageProviderListState: null,
			ArbitrageCurrencyListState: null,
			SerProvListState: null,
			CurrencyListDataState: null,

			searchInput: '',
			refreshing: false,
			isFirstTime: true,

			selectedPage: 1,
			row: [],

			//For Drawer First Time Close
			isDrawerOpen: false,

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),

			statuses: [
				{ value: R.strings.select_status, code: '' },
				{ value: R.strings.Success, code: 1 },
				{ value: R.strings.inProcess, code: 0 },
				{ value: R.strings.Reject, code: 9 },
			],
			selectedStatus: R.strings.select_status,
			selectedStatusCode: '',

			Provider: [],
			selectedProvider: R.strings.selectProvider,
			selectedProviderCode: '',

			Currency: [],
			selectedCurrency: R.strings.selectCurrency,
			selectedCurrencyCode: '',
		}

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
		changeTheme()

		// clear reducer data
		this.props.clearConflictHistory()

		// check internet connection
		if (await isInternet()) {

			if (this.state.screenType == 1) {

				// Call List Currency Api
				this.props.getCurrencyList()

				// Call List Provider Api
				this.props.getProviderList()

			}
			else if (this.state.screenType == 2) {

				// Call List Currency Api
				this.props.getArbitrageCurrencyList()

				// Call List Provider Api
				this.props.getArbitrageProviderList()
			}


			// Call Conflict History Api
			this.props.getConflictHistory(
				{
					FromDate: getCurrentDate(),
					ToDate: getCurrentDate(),
					PageNo: 0,
					PageSize: AppConfig.pageSize,
					screenType: this.state.screenType
				})
		}
	}

	//api call for list and filter reset
	callGetConflictHistory = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),

				selectedStatus: R.strings.select_status,
				selectedStatusCode: '',

				selectedProvider: R.strings.selectProvider,
				selectedProviderCode: '',

				selectedCurrency: R.strings.selectCurrency,
				selectedCurrencyCode: '',
			})
		}

		// Close Drawer user press on reset button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getConflictHistory list
			this.props.getConflictHistory({
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				PageNo: 0,
				PageSize: AppConfig.pageSize,
				screenType: this.state.screenType
			});
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


	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearConflictHistory()
	}

	//For Swipe to referesh Functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			//Call Conflict History Api
			this.props.getConflictHistory({

				PageNo: this.state.selectedPage - 1,
				PageSize: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,

				screenType: this.state.screenType,
				WalletId: this.state.selectedCurrency == R.strings.selectedCurrency ? '' : this.state.selectedCurrencyCode,
				SerProID: this.state.selectedProvider == R.strings.selectProvider ? '' : this.state.selectedProviderCode,
				Status: this.state.selectedStatus == R.strings.select_status ? '' : this.state.selectedStatusCode,
			});
		}
		else {
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
		if (ConflictHistoryScreen.oldProps !== props) {
			ConflictHistoryScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { ConflictHistoryList, ArbitrageProviderList,
				ArbitrageCurrencyList, SerProvList, CurrencyListData } = props.ConflictHistoryResult

			// ConflictHistoryList is not null
			if (ConflictHistoryList) {
				try {
					if (state.ConflictHistoryListState == null || (ConflictHistoryList !== state.ConflictHistoryListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: ConflictHistoryList, isList: true, })) {

							return Object.assign({}, state, {
								ConflictHistoryListState: ConflictHistoryList,
								ConflictHistoryResponse: parseArray(ConflictHistoryList.Data),
								refreshing: false,
								row: addPages(ConflictHistoryList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ConflictHistoryListState: ConflictHistoryList,
								ConflictHistoryResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ConflictHistoryListState: null,
						ConflictHistoryResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// ArbitrageProviderList is not null
			if (ArbitrageProviderList) {
				try {
					//if local ArbitrageProviderList state is null or its not null and also different then new response then and only then validate response.
					if (state.ArbitrageProviderListState == null || (ArbitrageProviderList !== state.ArbitrageProviderListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ArbitrageProviderList, isList: true })) {
							let res = parseArray(ArbitrageProviderList.Response);

							for (var providerKey in res) {
								let item = res[providerKey]
								item.value = item.ProviderName
							}

							let providerNames = [
								{ value: R.strings.selectProvider },
								...res
							];

							return { ...state, ArbitrageProviderListState: ArbitrageProviderList, Provider: providerNames };
						} else {
							return { ...state, Provider: [{ value: R.strings.selectProvider }], ArbitrageProviderListState: ArbitrageProviderList, };
						}
					}
				} catch (e) {
					return { ...state, Provider: [{ value: R.strings.selectProvider }] };
				}
			}

			// ArbitrageCurrencyList is not null
			if (ArbitrageCurrencyList) {
				try {
					//if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.ArbitrageCurrencyListState == null || (ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ArbitrageCurrencyList, isList: true })) {
							let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);

							for (var arbiCurrKey in res) {
								let item = res[arbiCurrKey]
								item.value = item.CoinName
							}

							let currenciesData = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: currenciesData };
						} else {
							return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}

			// SerProvList is not null
			if (SerProvList) {
				try {
					//if local SerProvList state is null or its not null and also different then new response then and only then validate response.
					if (state.SerProvListState == null || (state.SerProvList != null && SerProvList !== state.SerProvListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: SerProvList, isList: true })) {
							let res = parseArray(SerProvList.Response);

							for (var dataProviderItem in res) {
								let item = res[dataProviderItem]
								item.value = item.ProviderName
							}

							let serviceProviderName = [
								{ value: R.strings.selectProvider },
								...res
							];

							return { ...state, SerProvListState: SerProvList, Provider: serviceProviderName };
						} else {
							return { ...state, SerProvListState: SerProvList, Provider: [{ value: R.strings.selectProvider }] };
						}
					}
				} catch (e) {
					return { ...state, Provider: [{ value: R.strings.selectProvider }] };
				}
			}

			if (CurrencyListData) {
				try {
					//if local currencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.CurrencyListDataState == null || (state.CurrencyListDataState != null && CurrencyListData !== state.CurrencyListDataState)) {

						//if currencyList response is success then store array list else store empty list
						if (validateResponseNew({ response: CurrencyListData, isList: true })) {
							let res = parseArray(CurrencyListData.Response);

							//for add CurrencyListData
							for (var keyPairList in res) {
								let item = res[keyPairList]; item.value = item.SMSCode;
							}

							let currencies = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, CurrencyListDataState: CurrencyListData, Currency: currencies, };
						} else {
							return { ...state, Currency: [{ value: R.strings.selectCurrency }], CurrencyListDataState: null };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null
	}

	navigationDrawer() {
		// for show filter of fromdate, todate,status, Currency, Provider etc
		return (
			<FilterWidget
				FromDate={this.state.FromDate} ToDate={this.state.ToDate} toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				FromDatePickerCall={(date) => this.setState({ FromDate: date })} ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				sub_container={{ paddingBottom: 0, }}

				pickers={[
					{
						array: this.state.statuses, title: R.strings.status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
					},
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index, object) => this.setState({
							selectedCurrency: index,
							selectedCurrencyCode: this.state.screenType == 2 ? object.Id : object.ServiceId
						})
					},
					{
						title: R.strings.serivce_provider,
						array: this.state.Provider,
						selectedValue: this.state.selectedProvider,
						onPickerSelect: (index, object) => this.setState({ selectedProvider: index, selectedProviderCode: object.Id })
					},

				]}
				onResetPress={this.callGetConflictHistory}
				onCompletePress={this.onComplete}
			/>
		)
	}

	// if press on complete button api calling
	onComplete = async () => {

		//Check Validation of FromDate and ToDate
		if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
			return;
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getArbiTradeReconList list
			this.props.getConflictHistory({
				PageNo: 0,
				PageSize: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				screenType: this.state.screenType,
				WalletId: this.state.selectedCurrency == R.strings.selectedCurrency ? '' : this.state.selectedCurrencyCode,
				SerProID: this.state.selectedProvider == R.strings.selectProvider ? '' : this.state.selectedProviderCode,
				Status: this.state.selectedStatus == R.strings.select_status ? '' : this.state.selectedStatusCode,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({ selectedPage: 1 })
	}

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {

			//Check NetWork is Available or not
			if (await isInternet()) {

				this.setState({ selectedPage: pageNo });

				//To get getConflictHistory list
				this.props.getConflictHistory({
					PageNo: pageNo - 1,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					screenType: this.state.screenType,
					WalletId: this.state.selectedCurrency == R.strings.selectedCurrency ? '' : this.state.selectedCurrencyCode,
					SerProID: this.state.selectedProvider == R.strings.selectProvider ? '' : this.state.selectedProviderCode,
					Status: this.state.selectedStatus == R.strings.select_status ? '' : this.state.selectedStatusCode,
				});
			}
		}
	}


	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ConflictHistoryLoading, } = this.props.ConflictHistoryResult

		// For searching functionality
		let finalItems = this.state.ConflictHistoryResponse.filter(item => (
			item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.ResolvedByName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.SerProIDName.toLowerCase().includes(this.state.searchInput) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput) ||
			item.ResolvedDate.toLowerCase().includes(this.state.searchInput) ||
			item.MisMatchingAmount.toFixed(8).includes(this.state.searchInput) ||
			item.SettledAmount.toFixed(8).includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Filteration
			<Drawer
				ref={component => this.drawer = component}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerPosition={Drawer.positions.Right}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				drawerContent={this.navigationDrawer()}
				type={Drawer.types.Overlay}
				easingFunc={Easing.ease}>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						title={this.state.titleScreen}
						nav={this.props.navigation}
						searchable={true}
						onBackPress={this.onBackPress}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(ConflictHistoryLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <ConflictHistoryItem
										index={index}
										item={item}
										size={finalItems.length}
										onDetailPress={() => this.props.navigation.navigate('ConflictHistoryDetailScreen', { item, titleScreen: this.state.titleScreen, screenType: this.state.screenType })}
										onRecon={() =>
											this.props.navigation.navigate('ConflictReconScreen', { item, onRefresh: this.onRefresh, screenType: this.state.screenType })}
									/>
									}
									// assign index as key value to Conflict History list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In Conflict History FlatList Item
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
							{finalItems.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage}
								onPageChange={(item) => { this.onPageChange(item) }} />}
						</View>
					</View>
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class ConflictHistoryItem extends Component {

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
		let { size, index, item, onRecon } = this.props

		let statusColor = R.colors.accent

		// inProcess
		if (item.Status == 0)
			statusColor = R.colors.yellow
		// Success
		else if (item.Status == 1)
			statusColor = R.colors.successGreen
		// Reject
		else if (item.Status == 9)
			statusColor = R.colors.failRed

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}
						onPress={this.props.onDetailPress}
					>
						<View style={{ flexDirection: 'row' }}>
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

									{/* WalletTypeName */}
									<Text style={{
										color: R.colors.textPrimary, fontSize: R.dimens.smallText,
										fontFamily: Fonts.MontserratSemiBold,
									}}>{validateValue(item.WalletTypeName)}</Text>

									{/* for show ActionButton , Detail icon */}
									<View style={{ flexDirection: 'row', alignItems: 'center', }}>
										{
											item.Status == 0 &&
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
												icon={R.images.IC_REFER_SHARE}
												iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
												onPress={onRecon} />
										}

										<ImageTextButton
											icon={R.images.RIGHT_ARROW_DOUBLE}
											style={{ margin: 0 }}
											iconStyle={{
												width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary
											}}
											onPress={this.props.onDetailPress} />
									</View>
								</View>

								<View style={{ flex: 1, }}>
									{/* resolvedBy name */}
									<View style={{ flexDirection: 'row', alignItems: 'center', }}>
										<TextViewHML style={{
											fontSize: R.dimens.smallestText,
											color: R.colors.textSecondary,
										}}>{R.strings.resolvedBy + ': '}</TextViewHML>
										<TextViewHML style={{
											fontSize: R.dimens.smallestText,
											color: R.colors.textPrimary,
										}}>{validateValue(item.ResolvedByName)}</TextViewHML>
									</View>
								</View>
							</View>
						</View>

						{/* for show MisMatchingAmount and settledAmount */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.misMatchAmount}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(parseFloatVal(item.MisMatchingAmount).toFixed(8) !== 'NaN' ? (parseFloatVal(item.MisMatchingAmount).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.settledAmount}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.settledAmount).toFixed(8) !== 'NaN' ? (parseFloatVal(item.SettledAmount).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and ResolvedDate */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={statusColor}
								value={item.StrStatus}></StatusChip>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>
									{convertDateTime(item.ResolvedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	//Updated Data For ConflictHistoryReducer Data 
	let ConflictHistoryResult = {
		...state.ConflictHistoryReducer,
	}

	return { ConflictHistoryResult }
}

const mapDispatchToProps = (dispatch) => ({
	//for getArbitrageCurrencyList list action 
	getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
	//for getArbitrageProviderList list action 
	getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
	// To Perform Get Provider List Action
	getProviderList: () => dispatch(getProviderList()),
	// To Perform Get Provider List Action
	getCurrencyList: () => dispatch(getCurrencyList()),
	// Perform Conflict History Action
	getConflictHistory: (payload) => dispatch(getConflictHistory(payload)),
	// Clear Conflict History Data Action
	clearConflictHistory: () => dispatch(clearConflictHistory()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConflictHistoryScreen)