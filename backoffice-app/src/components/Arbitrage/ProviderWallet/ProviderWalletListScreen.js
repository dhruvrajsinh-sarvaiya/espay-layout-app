import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, parseFloatVal, } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { clearProviderWalletData } from '../../../actions/Arbitrage/ProviderWalletActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import { getArbitrageCurrencyList, getArbitrageProviderList, getProviderWalletList } from '../../../actions/PairListAction';
import FilterWidget from '../../widget/FilterWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';

export class ProviderWalletListScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			row: [],
			Provider: [],
			Currency: [],
			Status: [
				{ value: R.strings.select_status },
				{ value: R.strings.Enable },
				{ value: R.strings.Disable },
			],
			ProviderWalletResponse: [],
			ProviderWalletListState: null,
			ArbitrageProviderListState: null,
			ArbitrageCurrencyListState: null,

			SerProId: 0,
			selectedPage: 1,
			searchInput: '',
			selectedCurrency: R.strings.selectCurrency,
			selectedStatus: R.strings.select_status,
			selectedProvider: R.strings.selectProvider,

			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false,
		}

		//Initial request
		this.request = {
			PageNo: 1,
			PageSize: AppConfig.pageSize,
		}

		// Create Reference
		this.drawer = React.createRef()

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	// If drawer is open then first, it will close the drawer and after it will return to previous screen
	onBackPress = () => {
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
			// Call Provider Wallet List Api
			this.props.getProviderWalletList(this.request)
			// Call Arbitrage Currency List Api
			this.props.getArbitrageCurrencyList()
			// Call Arbitrage Provider List Api
			this.props.getArbitrageProviderList()
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearProviderWalletData()
	}

	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Provider Wallet List
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage,
				Status: this.state.selectedStatus !== R.strings.select_status ? (this.state.selectedStatus === R.strings.Enable ? 1 : 0) : '',
				SerProId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.SerProId : '',
				SMSCode: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
			}
			// Call Get Provider Wallet List API
			this.props.getProviderWalletList(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Reset Filter
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer()

		// set Initial State
		this.setState({
			searchInput: '',
			selectedPage: 1,

			SerProId: 0,
			selectedStatus: R.strings.select_status,
			selectedCurrency: R.strings.selectCurrency,
			selectedProvider: R.strings.selectProvider,
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Provider Wallet List
			this.request = {
				...this.request,
				PageNo: 1,
				SMSCode: '',
				Status: '',
				SerProId: ''
			}
			//Call Get Provider Wallet List API
			this.props.getProviderWalletList(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {

		this.setState({
			selectedPage: 1,
			PageSize: AppConfig.pageSize,
		})

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Provider Wallet List
			this.request = {
				...this.request,
				PageNo: 1,
				SMSCode: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
				Status: this.state.selectedStatus !== R.strings.select_status ? (this.state.selectedStatus === R.strings.Enable ? 1 : 0) : '',
				SerProId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.SerProId : ''
			}
			//Call Get Provider Wallet List API
			this.props.getProviderWalletList(this.request);

		} else {
			this.setState({ refreshing: false });
		}

		//If Filter from Complete Button Click then empty searchInput
		this.setState({ searchInput: '' })

	}

	// Pagination Method Called When User Change Page 
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {
			//if user selecte other page number then and only then API Call elase no need to call API
			this.setState({ selectedPage: pageNo });

			// Check NetWork is Available or not
			if (await isInternet()) {
				// Bind request for Provider Wallet List
				this.request = {
					...this.request,
					PageNo: pageNo,
					SMSCode: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
					Status: this.state.selectedStatus !== R.strings.select_status ? (this.state.selectedStatus === R.strings.Enable ? 1 : 0) : '',
					SerProId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.SerProId : ''
				}
				//Call Get Provider Wallet List API
				this.props.getProviderWalletList(this.request);
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
		if (ProviderWalletListScreen.oldProps !== props) {
			ProviderWalletListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { ProviderWalletList, ArbitrageProviderList, ArbitrageCurrencyList } = props.ProviderWalletResult

			// ArbitrageProviderList is not null
			if (ArbitrageProviderList) {
				try {
					//if local ArbitrageProviderList state is null or its not null and also different then new response then and only then validate response.
					if (state.ArbitrageProviderListState == null || (ArbitrageProviderList !== state.ArbitrageProviderListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ArbitrageProviderList, isList: true })) {
							let res = parseArray(ArbitrageProviderList.Response);

							for (var arbiProviderListKey in res) {

								let item = res[arbiProviderListKey]
								item.value = item.ProviderName
							}

							let providerNames = [
								{ value: R.strings.selectProvider },
								...res
							];

							return {
								...state,
								ArbitrageProviderListState: ArbitrageProviderList,
								Provider: providerNames
							};
						}
						else {
							return {
								...state, ArbitrageProviderListState: ArbitrageProviderList,
								Provider: [{ value: R.strings.selectProvider }]
							};
						}
					}
				} catch (e) {
					return {
						...state, Provider: [{ value: R.strings.selectProvider }]
					};
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

							for (var currencyKey in res) {
								let item = res[currencyKey]
								item.value = item.CoinName
							}

							let providerNames = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: providerNames };
						} else {
							return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}

			// ProviderWalletList is not null
			if (ProviderWalletList) {
				try {
					if (state.ProviderWalletListState == null || (ProviderWalletList !== state.ProviderWalletListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: ProviderWalletList, isList: true, })) {

							return Object.assign({}, state, {
								ProviderWalletListState: ProviderWalletList,
								ProviderWalletResponse: parseArray(ProviderWalletList.Data),
								refreshing: false,
								row: addPages(ProviderWalletList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ProviderWalletListState: null,
								ProviderWalletResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ProviderWalletListState: null,
						ProviderWalletResponse: [],
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
				onCompletePress={this.onCompletePress}
				toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0 }}
				pickers={[
					{
						title: R.strings.Provider,
						array: this.state.Provider,
						selectedValue: this.state.selectedProvider,
						onPickerSelect: (index, object) => this.setState({ selectedProvider: index, SerProId: object.Id })
					},
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index) => this.setState({ selectedCurrency: index })
					},
					{
						title: R.strings.Status,
						array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index) => this.setState({ selectedStatus: index })
					},
				]}
			/>
		)
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ProviderWalletLoading, } = this.props.ProviderWalletResult

		// For searching functionality
		let finalItems = this.state.ProviderWalletResponse.filter(item => (
			item.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.SerProIdName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Balance.toFixed(8).toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Provider Wallet Filteration
			<Drawer
				drawerWidth={R.dimens.FilterDrawarWidth}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })} type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				drawerContent={this.navigationDrawer()} ref={cmpDrawer => this.drawer = cmpDrawer}
				easingFunc={Easing.ease}>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.providerWallet}
						onBackPress={() => this.onBackPress()}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						isBack={true}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(ProviderWalletLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <ProviderWalletListItem
										index={index} item={item} size={finalItems.length}
									/>
									}
									// assign index as key value to Provider Wallet list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In Provider Wallet FlatList Item
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]}
											onRefresh={this.onRefresh}
											progressBackgroundColor={R.colors.background} refreshing={this.state.refreshing}
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
								<PaginationWidget selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} row={this.state.row} />
							}
						</View>
					</View>
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class ProviderWalletListItem extends Component {

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
		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1,
				}}>
					<CardView
						onPress={onPress}
						style={{
							flex: 1,
							elevation: R.dimens.listCardElevation,
							borderBottomLeftRadius: R.dimens.margin,
							borderTopRightRadius: R.dimens.margin,
							borderRadius: 0,
						}}
					>

						<View style={{ flexDirection: 'row', flex: 1, }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.WalletTypeIDName ? item.WalletTypeIDName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show username,amount and currency */}
								<View style={{ alignItems: 'center', flexDirection: 'row', }}>
									<Text style={{ fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary, }}>{item.WalletName}</Text>
									<Text style={{ color: R.colors.successGreen, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.SerProIdName ? ' ' + item.SerProIdName : ''}</Text>
								</View>

								{/* Wallet Id */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.WalletId + ': '}</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.AccWalletID)}</TextViewHML>
								</View>

							</View>
						</View>

						{/* for show Amount, charge and leverage amount */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.InBoundBalance}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(parseFloatVal(item.InBoundBalance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.InBoundBalance).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.OutBoundBalance}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.OutBoundBalance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.OutBoundBalance).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and DateTime */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between', }}>
							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.StrStatus ? item.StrStatus : '-'}></StatusChip>

							<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
								{(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}
							</Text>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get provider wallet data from reducer
		ProviderWalletResult: state.ProviderWalletReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Provider Wallet Action
	getProviderWalletList: (payload) => dispatch(getProviderWalletList(payload)),
	// Clear Provider Wallet Data Action
	clearProviderWalletData: () => dispatch(clearProviderWalletData()),
	// Arbitrage Currency List Action
	getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
	// Arbitrage Provider List Action
	getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProviderWalletListScreen)