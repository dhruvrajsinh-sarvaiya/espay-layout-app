import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image, Easing, Linking, Text, TouchableOpacity } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime, getCurrentDate } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { ListTopupHistory, clearTopupHistoryData } from '../../../actions/Arbitrage/TopupHistoryActions';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { getArbitrageProviderList, getArbitrageCurrencyList } from '../../../actions/PairListAction';
import Separator from '../../../native_theme/components/Separator';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { DateValidation } from '../../../validations/DateValidation';

class TopupHistoryListScreen extends Component {

	constructor(props) {
		super(props);

		//create refrence
		this.toast = React.createRef();
		this.drawer = React.createRef();

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],
			topupHistoryDataState: null,
			arbitrageProviderDataState: null,
			arbitrageCurrencyDataState: null,
			isFirstTime: true,

			selectedPage: 1,
			row: [],

			currencies: [{ value: R.strings.selectCurrency }],
			selectedCurrency: R.strings.selectCurrency,

			fromProviders: [{ value: R.strings.Please_Select }],
			selectedFromProvider: R.strings.Please_Select,
			selectedFromProviderCode: -1,

			toProviders: [{ value: R.strings.Please_Select }],
			selectedToProvider: R.strings.Please_Select,
			selectedToProviderCode: -1,

			transactionId: '',
			fromDate: getCurrentDate(),
			toDate: getCurrentDate(),
			address: '',
			statuses: [
				{ value: R.strings.select_status, code: -1 },
				{ value: R.strings.Initialize, code: 0 },
				{ value: R.strings.Success, code: 1 },
				{ value: R.strings.providerFail, code: 2 },
				{ value: R.strings.SystemFail, code: 3 },
				{ value: R.strings.Hold, code: 4 },
				{ value: R.strings.Cancelled, code: 5 },
				{ value: R.strings.Pending, code: 6 },
				{ value: R.strings.confirmationPending, code: 9 },
				{ value: R.strings.other, code: 999 }
			],
			selectedStatus: R.strings.select_status,
			selectedStatusCode: -1,

			//For Drawer First Time Close
			isDrawerOpen: false,
		};

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress); this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	// If drawer is open then first, it will close the drawer and after it will return to previous screen
	onBackPress() {
		if (this.state.isDrawerOpen) {
			this.drawer.closeDrawer(); this.setState({ isDrawerOpen: false })
		}
		else {
			//goging back screen
			this.props.navigation.goBack();
		}
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		if (await isInternet()) {
			//To getArbitrageCurrencyList 
			this.props.getArbitrageCurrencyList()
			//To getArbitrageProviderList
			this.props.getArbitrageProviderList()
			//To get callTopupHistoryApi 
			this.callTopupHistoryApi()
		}
	}

	//api call for list
	callTopupHistoryApi = async () => {

		this.setState({
			selectedPage: 1,
			selectedCurrency: R.strings.selectCurrency,
			selectedFromProvider: R.strings.Please_Select,
			selectedFromProviderCode: -1,
			selectedToProvider: R.strings.Please_Select,
			selectedToProviderCode: -1,
			fromDate: getCurrentDate(),
			toDate: getCurrentDate(),
			address: '',
			transactionId: '',
			selectedStatus: R.strings.select_status,
			selectedStatusCode: -1,
		})

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To ListTopupHistory list
			this.props.ListTopupHistory(
				{
					PageIndex: 0,
					PageSize: AppConfig.pageSize,
					FromDate: '',
					ToDate: '',
				}
			);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearTopupHistoryData()
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
		if (TopupHistoryListScreen.oldProps !== props) {
			TopupHistoryListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { topupHistoryData, arbitrageCurrencyData, arbitrageProviderData } = props.data;

			if (topupHistoryData) {
				try {
					//if local topupHistoryData state is null or its not null and also different then new response then and only then validate response.
					if (state.topupHistoryDataState == null || (state.topupHistoryDataState != null && topupHistoryData !== state.topupHistoryDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: topupHistoryData, isList: true })) {

							let res = parseArray(topupHistoryData.Data);

							//for add userData
							for (var walletTopUpKey in res) {
								let item = res[walletTopUpKey];
								//Initialize
								if (item.Status === 0) {
									item.statusText = R.strings.Initialize
								}
								//Success 
								else if (item.Status === 1) {
									item.statusText = R.strings.Success
								}
								//providerFail 
								else if (item.Status === 2) {
									item.statusText = R.strings.providerFail
								}
								//SystemFail 
								else if (item.Status === 3) {
									item.statusText = R.strings.SystemFail
								}
								//Hold 
								else if (item.Status === 4) {
									item.statusText = R.strings.Hold
								}
								//Cancelled 
								else if (item.Status === 5) {
									item.statusText = R.strings.Cancelled
								}
								//Pending 
								else if (item.Status === 6) {
									item.statusText = R.strings.Pending
								}
								//confirmationPending 
								else if (item.Status === 9) {
									item.statusText = R.strings.confirmationPending
								}
								else {
									item.statusText = R.strings.other
								}
							}

							return { ...state, topupHistoryDataState: topupHistoryData, response: res, refreshing: false, row: addPages(topupHistoryData.TotalCount) };
						} else {
							return { ...state, topupHistoryDataState: topupHistoryData, response: [], refreshing: false, row: [] };
						}
					}
				} catch (e) {
					return { ...state, response: [], refreshing: false, row: [] };
				}
			}

			if (arbitrageCurrencyData) {
				try {
					//if local currencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.arbitrageCurrencyDataState == null || (state.arbitrageCurrencyDataState != null && arbitrageCurrencyData !== state.arbitrageCurrencyDataState)) {

						//if currencyList response is success then store array list else store empty list
						if (validateResponseNew({ response: arbitrageCurrencyData, isList: true })) {
							let res = parseArray(arbitrageCurrencyData.ArbitrageWalletTypeMasters);

							//for add pairCurrencyList
							for (var pairKey in res) {
								let item = res[pairKey];
								item.value = item.CoinName;
							}

							let currencies = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state,  arbitrageCurrencyDataState: arbitrageCurrencyData, currencies, };
						} else {
							return { ...state,arbitrageCurrencyDataState: arbitrageCurrencyData,  currencies: [{ value: R.strings.selectCurrency }],  };
						}
					}
				} catch (e) {
					return { ...state, currencies: [{ value: R.strings.selectCurrency }] };
				}
			}

			if (arbitrageProviderData) {
				try {
					//if local arbitrageProviderData state is null or its not null and also different then new response then and only then validate response.
					if (state.arbitrageProviderDataState == null || (state.arbitrageProviderDataState != null && arbitrageProviderData !== state.arbitrageProviderDataState)) {

						//if currencyList response is success then store array list else store empty list
						if (validateResponseNew({ response: arbitrageProviderData, isList: true })) {
							let res = parseArray(arbitrageProviderData.Response);

							//for add Provider
							for (var currencyPairKey in res) {
								 let item = res[currencyPairKey];
								 item.value = item.ProviderName;
							}

							let providers = [
								{ value: R.strings.Please_Select },
								...res
							];

							return { ...state,  toProviders: providers, arbitrageProviderDataState: arbitrageProviderData,fromProviders: providers, };
						} else {
							return { ...state, fromProviders: [{ value: R.strings.Please_Select }], toProviders: [{ value: R.strings.Please_Select }], arbitrageProviderDataState: arbitrageProviderData };
						}
					}
				} catch (e) {
					return { ...state,  toProviders: [{ value: R.strings.Please_Select }], fromProviders: [{ value: R.strings.Please_Select }], };
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

			//To ListTopupHistory list
			this.props.ListTopupHistory(
				{
					FromDate: this.state.fromDate,PageSize: AppConfig.pageSize,
					PageIndex: this.state.selectedPage - 1,
					Status: this.state.selectedStatus == R.strings.select_status ? '' : this.state.selectedStatusCode,
					Address: this.state.address,
					CoinName: this.state.selectedCurrency == R.strings.selectCurrency ? '' : this.state.selectedCurrency,
					FromServiceProviderId: this.state.selectedFromProvider == R.strings.Please_Select ? '' : this.state.selectedFromProviderCode,
					ToDate: this.state.toDate,
					ToServiceProviderId: this.state.selectedToProvider == R.strings.Please_Select ? '' : this.state.selectedToProviderCode,
					TrnId: this.state.transactionId,
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

				//To get ListTopupHistory list
				this.props.ListTopupHistory({
					PageIndex: pageNo - 1,
					PageSize: AppConfig.pageSize,
					CoinName: this.state.selectedCurrency == R.strings.selectCurrency ? '' : this.state.selectedCurrency,
					ToDate: this.state.toDate,
					Status: this.state.selectedStatus == R.strings.select_status ? '' : this.state.selectedStatusCode,
					Address: this.state.address,
					FromDate: this.state.fromDate,
					FromServiceProviderId: this.state.selectedFromProvider == R.strings.Please_Select ? '' : this.state.selectedFromProviderCode,
					ToServiceProviderId: this.state.selectedToProvider == R.strings.Please_Select ? '' : this.state.selectedToProviderCode,
					TrnId: this.state.transactionId,
				});
			}
		}
	}

	// Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
	rightMenuRender = () => {
		return (
			<View style={{ flexDirection: 'row' }}>
				<ImageTextButton
					icon={R.images.IC_PLUS}
					style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
					iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
					onPress={() => this.props.navigation.navigate('TopupHistoryAddScreen', { onSuccess: this.callTopupHistoryApi })} />
				<ImageTextButton
					icon={R.images.FILTER}
					style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
					iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
					onPress={() => this.drawer.openDrawer()} />
			</View>
		)
	}

	// When user press on reset button then all values are reset
	onReset = async () => {

		// Set state to original value
		this.setState({
			selectedPage: 1,
			selectedCurrency: R.strings.selectCurrency,
			selectedFromProvider: R.strings.Please_Select,
			selectedFromProviderCode: -1,
			selectedToProvider: R.strings.Please_Select,
			selectedToProviderCode: -1,
			fromDate: getCurrentDate(),
			toDate: getCurrentDate(),
			address: '',
			transactionId: '',
			selectedStatus: R.strings.select_status,
			selectedStatusCode: -1,
		})

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//To get callTopupHistoryApi 
		this.callTopupHistoryApi()
	}

	// if press on complete button api calling
	onComplete = async () => {

		//Check Validation of FromDate and ToDate
		if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
			this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true));
			return;
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get ListTopupHistory list
			this.props.ListTopupHistory({
				FromServiceProviderId: this.state.selectedFromProvider == R.strings.Please_Select ? '' : this.state.selectedFromProviderCode,
				PageIndex: 0,
				PageSize: AppConfig.pageSize,
				FromDate: this.state.fromDate,
				ToDate: this.state.toDate,
				Status: this.state.selectedStatus == R.strings.select_status ? '' : this.state.selectedStatusCode,
				Address: this.state.address,
				CoinName: this.state.selectedCurrency == R.strings.selectCurrency ? '' : this.state.selectedCurrency,
				ToServiceProviderId: this.state.selectedToProvider == R.strings.Please_Select ? '' : this.state.selectedToProviderCode,
				TrnId: this.state.transactionId,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({ selectedPage: 1 })
	}

	navigationDrawer() {
		// for show filter of fromdate, todate,transactionId, Address, Currency, fromProvider, toProvider and status data etc
		return (
			<FilterWidget
				FromDatePickerCall={(date) => this.setState({ fromDate: date })}
				toastRef={component => this.toast = component}
				ToDatePickerCall={(date) => this.setState({ toDate: date })}
				FromDate={this.state.fromDate} ToDate={this.state.toDate}
				sub_container={{ paddingBottom: 0, }}
				textInputStyle={{ marginTop: 0, marginBottom: 0, }}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				textInputs={[
					{
						header: R.strings.transactionId,
						placeholder: R.strings.transactionId,
						multiline: false,
						keyboardType: 'default',
						returnKeyType: "next",
						onChangeText: (text) => { this.setState({ transactionId: text }) },
						value: this.state.transactionId,
					},
					{
						header: R.strings.Address,
						placeholder: R.strings.Address,
						multiline: false,
						keyboardType: 'default',
						returnKeyType: "done",
						onChangeText: (text) => { this.setState({ address: text }) },
						value: this.state.address,
					},
				]}
				pickers={[
					{
						title: R.strings.Currency,
						array: this.state.currencies,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index) => this.setState({ selectedCurrency: index, })
					},
					{
						title: R.strings.fromProvider,
						array: this.state.fromProviders,
						selectedValue: this.state.selectedFromProvider,
						onPickerSelect: (index, object) => this.setState({ selectedFromProvider: index, selectedFromProviderCode: object.Id })
					},
					{
						title: R.strings.toProvider,
						array: this.state.toProviders,
						selectedValue: this.state.selectedToProvider,
						onPickerSelect: (index, object) => this.setState({ selectedToProvider: index, selectedToProviderCode: object.Id })
					},
					{
						title: R.strings.status,
						array: this.state.statuses,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
					},
				]}
				onResetPress={this.onReset}
				onCompletePress={this.onComplete}
			/>
		)
	}

	//This Method Is used to open Address in Browser With Specific Link
	onTrnLinkPress = (item) => {
		try {
			let hasLink = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
			Linking.openURL((hasLink.length) ? hasLink[0].Data + '/' + item.TrnId : item.TrnId);
		} catch (error) {
			//handle catch block here
		}
	}

	render() {
		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.TrnNo.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.FromServiceProviderName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.ToServiceProviderName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.CoinName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.TrnId.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.TrnDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusText.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Remarks.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Amount.toFixed(8).toString().includes(this.state.search.toLowerCase()) ||
				item.Address.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			//DrawerLayout for Filteration
			<Drawer
				ref={component => this.drawer = component}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })} drawerContent={this.navigationDrawer()}
				drawerWidth={R.dimens.FilterDrawarWidth} drawerPosition={Drawer.positions.Right}
				type={Drawer.types.Overlay} easingFunc={Easing.ease}>

				<SafeView style={this.styles().container}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set Progress bar as per our theme */}
					<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.deleteLoading} />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.topupHistory}
						isBack={true}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightMenuRenderChilds={this.rightMenuRender()}
						onBackPress={this.onBackPress}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.listFetching && !this.state.refreshing)
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
										<TopupHistoryListItem
											index={index}
											item={item}
											onEdit={() => { this.props.navigation.navigate('TopupHistoryAddScreen', { item, onSuccess: this.callTopupHistoryApi, edit: true }) }}
											onTrnIdPress={() => this.onTrnLinkPress(item)}
											size={this.state.response.length} />
									}
									// assign index as key value list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In List Item
									refreshControl={<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh}
									/>}
								/>
								:
								// Displayed empty component when no record found 
								<ListEmptyComponent module={R.strings.topupRequest} onPress={() => this.props.navigation.navigate('TopupHistoryAddScreen', { onSuccess: this.callTopupHistoryApi })} />
						}
						{/*To Set Pagination View  */}
						<View>
							{filteredList.length > 0 && <PaginationWidget selectedPage={this.state.selectedPage} row={this.state.row}  onPageChange={(item) => { this.onPageChange(item) }} />}
						</View>
					</View>
				</SafeView>
			</Drawer>
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
class TopupHistoryListItem extends Component {
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

		//To Display various Status Color in ListView
		let color = R.colors.accent;

		//Initialize
		if (item.Status === 0) {
			color = R.colors.failRed
		}
		//Success 
		else if (item.Status === 1) {
			color = R.colors.successGreen
		}
		//providerFail 
		else if (item.Status === 2) {
			color = R.colors.failRed
		}
		//SystemFail 
		else if (item.Status === 3) {
			color = R.colors.failRed
		}
		//Hold 
		else if (item.Status === 4) {
			color = R.colors.yellow
		}
		//Cancelled 
		else if (item.Status === 5) {
			color = R.colors.failRed
		}
		//Pending 
		else if (item.Status === 6) {
			color = R.colors.successGreen
		}
		//confirmationPending 
		else if (item.Status === 9) {
			color = R.colors.successGreen
		}

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin,
					flexDirection: 'column',	flex: 1, marginLeft: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation,
						flex: 1,
						borderRadius: 0,
						flexDirection: 'column',
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}
					>
						<View style={{ flex: 1, flexDirection: 'row', }}>

							{/* CoinName Image */}
							<ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ marginLeft: R.dimens.widgetMargin, flex: 1, }}>

								{/* Amount ,CoinName*/}
								<View style={{ flexDirection: 'row' }}>
									<Text style={{ fontSize: R.dimens.smallText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(parseFloatVal(item.Amount).toFixed(8))} </Text>
									<Text style={{ fontSize: R.dimens.smallText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.CoinName).toUpperCase()} </Text>
								</View>


								{/* for show FromAddress and ToAddress name */}
								<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
									<Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.topup + " : "}</Text>
									<TextViewHML numberOfLines={1} ellipsizeMode="tail"
										style={{ alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.FromServiceProviderName)}</TextViewHML>
									<Image
										source={R.images.IC_RIGHT_LONG_ARROW}
										style={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
									/>
									<TextViewHML numberOfLines={1} ellipsizeMode="tail"
										style={{ alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.ToServiceProviderName)}</TextViewHML>
								</View>

								{/* address */}
								<View style={{ flexDirection: 'row', }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Address} : </TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode="tail"
										style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.Address)}</TextViewHML>
								</View>
							</View>
						</View >

						{/* TrnId*/}
						<View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
							<View style={{ flexDirection: 'row', }}>
								<Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.TrnId.toUpperCase()}</Text>
								<Separator style={{ flex: 1, justifyContent: 'center', }} />
							</View>
							<TouchableOpacity onPress={this.props.onTrnIdPress}>
								<TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.accent, }}>{validateValue(item.TrnId)}</TextViewHML>
							</TouchableOpacity>
						</View>

						{/*status , DateTime */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin, }}>
							<StatusChip
								color={color}
								value={item.statusText}
							/>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{tintColor: R.colors.textSecondary, width: R.dimens.smallestText, height: R.dimens.smallestText,  }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View >
			</AnimatableItem >
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For TopUpHistoryReducer Data 
	let data = {
		...state.TopUpHistoryReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform ListTopupHistory List Action 
		ListTopupHistory: (request) => dispatch(ListTopupHistory(request)),
		//for getArbitrageCurrencyList list action 
		getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
		//for getArbitrageProviderList list action 
		getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
		//Perform clearTopupHistoryData Action 
		clearTopupHistoryData: () => dispatch(clearTopupHistoryData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(TopupHistoryListScreen);