import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, getCurrentDate, addPages, parseArray, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { getProviderLedger, clearProviderLedgerData } from '../../../actions/Arbitrage/ProviderLedgerActions';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';
import { DateValidation } from '../../../validations/DateValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import PaginationWidget from '../../widget/PaginationWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import Separator from '../../../native_theme/components/Separator';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getProviderWalletList } from '../../../actions/PairListAction';

export class ProviderLedgerListScreen extends Component {
	constructor(props) {
		super(props)

		// get data from previous screen
		let { item, Currency, CurrencyId, SelectedCurrency, FromDate, ToDate, TotalCount, SelectedWallet, Wallet, WalletTypeId, AccWalletId } = props.navigation.state.params

		// Define all initial state
		this.state = {
			row: TotalCount !== undefined ? addPages(TotalCount) : [],
			Currency: Currency !== undefined ? Currency : [],
			Wallet: Wallet !== undefined ? Wallet : [],
			ProviderLedgerResponse: item !== undefined ? item : [],

			ProviderWalletListState: null,
			ProviderLedgerListState: null,

			CurrencyId: CurrencyId !== undefined ? CurrencyId : 0,
			WalletId: WalletTypeId !== undefined ? WalletTypeId : 0,
			AccWalletId: AccWalletId !== undefined ? AccWalletId : '',

			FromDate: FromDate !== undefined ? FromDate : getCurrentDate(),
			ToDate: ToDate !== undefined ? ToDate : getCurrentDate(),

			selectedCurrency: SelectedCurrency !== undefined ? SelectedCurrency : R.strings.selectCurrency,
			selectedWallet: SelectedWallet !== undefined ? SelectedWallet : R.strings.selectWalletType,

			oldCurrencyName: SelectedCurrency !== undefined ? SelectedCurrency : R.strings.selectCurrency,
			oldWalletName: SelectedWallet !== undefined ? SelectedWallet : R.strings.selectWalletType,

			oldCurrency: Currency !== undefined ? Currency : [],
			oldWallet: Wallet !== undefined ? Wallet : [],

			oldCurrencyId: CurrencyId !== undefined ? CurrencyId : 0,
			oldWalletId: WalletTypeId !== undefined ? WalletTypeId : 0,
			oldAccWalletId: AccWalletId !== undefined ? AccWalletId : '',

			oldFromDate: FromDate !== undefined ? FromDate : getCurrentDate(),
			oldToDate: ToDate !== undefined ? ToDate : getCurrentDate(),

			selectedPage: 1,
			searchInput: '',
			refreshing: false,
			isDrawerOpen: false,
			isFirstTime: true,
		}

		//Initial request
		this.request = {
			Page: 0,
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

	componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearProviderLedgerData()
	}

	//For Swipe to referesh Functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind Request for marginWallet Ledger
			this.request = {
				...this.request,
				Page: this.state.selectedPage - 1,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				AccWalletId: this.state.AccWalletId,
			}
			//call api for get Provider Ledger detail
			this.props.getProviderLedger(this.request)
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

			FromDate: this.state.oldFromDate,
			ToDate: this.state.oldToDate,

			Currency: this.state.oldCurrency,
			CurrencyId: this.state.oldCurrencyId,
			selectedCurrency: this.state.oldCurrencyName,

			Wallet: this.state.oldWallet,
			WalletId: this.state.oldWalletId,
			selectedWallet: this.state.oldWalletName,

			AccWalletId: this.state.oldAccWalletId,
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Provider Ledger List
			this.request = {
				...this.request,
				FromDate: this.state.oldFromDate,
				ToDate: this.state.oldToDate,
				AccWalletId: this.state.oldAccWalletId,
			}

			//Call Get Provider Ledger List API
			this.props.getProviderLedger(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {

		// Check validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
		else if (this.state.selectedCurrency === R.strings.selectCurrency)
			this.toast.Show(R.strings.selectCurrency)
		else if (this.state.selectedWallet === R.strings.selectWalletType)
			this.toast.Show(R.strings.selectWalletType)
		else {
			// set Initial State
			this.setState({
				searchInput: '',
				selectedPage: 1,
				PageSize: AppConfig.pageSize
			})

			// Close drawer
			this.drawer.closeDrawer()

			// check internet connection
			if (await isInternet()) {
				// create request
				this.request = {
					...this.request,
					Page: 0,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					AccWalletId: this.state.AccWalletId,
				}

				// Call Provider Ledger 
				this.props.getProviderLedger(this.request)
			}
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
				// Bind request for Provider Ledger List
				this.request = {
					...this.request,
					Page: pageNo - 1,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					AccWalletId: this.state.AccWalletId,
				}
				//Call Get Provider Ledger List API
				this.props.getProviderLedger(this.request)
			} else {
				this.setState({ refreshing: false })
			}
		}
	}

	// Called when user change currency from Currency Dropdown
	onCurrencyChange = async (item, object) => {

		try {
			// To Check Currencyname is Selected or Not
			if (item !== R.strings.selectCurrency) {

				if (item !== this.state.selectedCurrency) {
					this.setState({ CurrencyId: object.Id, selectedCurrency: item, selectedWallet: R.strings.selectWalletType, WalletTypeId: 0, })
					// Check internet connection
					if (await isInternet()) {
						// Call Provider Ledger List Api
						this.props.getProviderWalletList({ SMSCode: item })
					}
				}
			} else {
				this.setState({
					CurrencyId: 0, WalletTypeId: 0,
					selectedCurrency: R.strings.selectCurrency, selectedWallet: R.strings.selectWalletType,
				})
			}
		} catch (error) {
			this.setState({
				selectedCurrency: R.strings.selectCurrency, selectedWallet: R.strings.selectWalletType,
				CurrencyId: 0, WalletTypeId: 0,
			})
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (ProviderLedgerListScreen.oldProps !== props) {
			ProviderLedgerListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { ProviderLedgerList, ProviderWalletList } = props.ProviderLedgerResult

			// ProviderWalletList is not null
			if (ProviderWalletList) {
				try {
					//if local ProviderWalletList state is null or its not null and also different then new response then and only then validate response.
					if (state.ProviderWalletListState == null || (ProviderWalletList !== state.ProviderWalletListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ProviderWalletList, isList: true })) {
							let res = parseArray(ProviderWalletList.Data);

							for (var providerWalletKey in res) {
								let item = res[providerWalletKey]
								item.value = item.WalletName
							}

							let currency = [
								{ value: R.strings.selectWalletType },
								...res
							]

							return { ...state, Wallet: currency, ProviderWalletListState: ProviderWalletList, };
						} else {
							return { ...state, ProviderWalletListState: ProviderWalletList, Wallet: [{ value: R.strings.selectWalletType }] };
						}
					}
				} catch (e) {
					return { ...state, Wallet: [{ value: R.strings.selectWalletType }] };
				}
			}

			// ProviderLedgerList is not null
			if (ProviderLedgerList) {
				try {
					if (state.ProviderLedgerListState == null || (ProviderLedgerList !== state.ProviderLedgerListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: ProviderLedgerList, isList: true, })) {

							return Object.assign({}, state, {
								ProviderLedgerListState: ProviderLedgerList,
								ProviderLedgerResponse: parseArray(ProviderLedgerList.ProviderWalletLedgers),
								refreshing: false,
								row: addPages(ProviderLedgerList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ProviderLedgerListState: null,
								ProviderLedgerResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ProviderLedgerListState: null,
						ProviderLedgerResponse: [],
						row: [],
						refreshing: false,
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
			// for show filter of fromdate, todate,currency and status data
			<FilterWidget
				FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
				ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
				ToDate={this.state.ToDate} onResetPress={this.onResetPress}
				FromDate={this.state.FromDate}
				onCompletePress={this.onCompletePress} comboPickerStyle={{ marginTop: 0 }}
				toastRef={component => this.toast = component}
				pickers={[
					{
						array: this.state.Currency, selectedValue: this.state.selectedCurrency,
						title: R.strings.Currency,
						onPickerSelect: (item, object) => this.onCurrencyChange(item, object)
					},
					{
						title: R.strings.wallet,
						array: this.state.Wallet,
						selectedValue: this.state.selectedWallet,
						onPickerSelect: (index, object) => this.setState({ selectedWallet: index, AccWalletId: object.AccWalletID })
					},
				]}
			/>
		)
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ProviderLedgerLoading } = this.props.ProviderLedgerResult

		// For searching functionality
		let finalItems = this.state.ProviderLedgerResponse.filter(item => (
			item.Remarks.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.LedgerId.toString().includes(this.state.searchInput) ||
			item.Amount.toString().includes(this.state.searchInput) ||
			item.PreBal.toString().includes(this.state.searchInput) ||
			item.PostBal.toString().includes(this.state.searchInput) ||
			item.CrAmount.toString().includes(this.state.searchInput) ||
			item.DrAmount.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Provider Ledger Filteration
			<Drawer
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerContent={this.navigationDrawer()} ref={cmpDrawer => this.drawer = cmpDrawer}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })} onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				easingFunc={Easing.ease}>

				<SafeView style={{ backgroundColor: R.colors.background, flex: 1, }}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						title={R.strings.providerWallet}
						onBackPress={() => this.onBackPress()}
						onRightMenuPress={() => this.drawer.openDrawer()}
						nav={this.props.navigation} rightIcon={R.images.FILTER}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(ProviderLedgerLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <ProviderLedgerListItem
										size={finalItems.length}
										index={index} item={item}
									/>
									}
									// assign index as key value to Provider Ledger list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In Provider Ledger FlatList Item
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
											refreshing={this.state.refreshing} onRefresh={this.onRefresh}
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
								<PaginationWidget selectedPage={this.state.selectedPage} row={this.state.row}  onPageChange={(item) => { this.onPageChange(item) }} />
							}
						</View>
					</View>
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class ProviderLedgerListItem extends Component {

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

		let crColor = R.colors.textSecondary
		let drColor = R.colors.textSecondary

		// Cr amount color
		if (item.CrAmount != 0)
			crColor = R.colors.successGreen

		// Dr amount color
		if (item.DrAmount != 0)
			drColor = R.colors.failRed

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{ flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, 	marginRight: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{ flex: 1, borderRadius: 0,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,
					}} onPress={onPress}>

						<View>
							{/* for show trn id and Amount */}
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>
									{R.strings.ledger_id + ': ' + item.LedgerId}
								</Text>
								<TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.yellow, textAlign: 'right' }}>
									{parseFloatVal(item.Amount).toFixed(8).toString()}
								</TextViewMR>
							</View>

							{/* for show Remarks */}
							<TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Remarks}</TextViewHML>

							{/* for show pre and post Balance */}
							<View style={{ flexDirection: 'row' }}>

								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Pre_Bal}</TextViewHML>
									<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PreBal.toFixed(8)}</TextViewHML>
								</View>

								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Post_Bal}</TextViewHML>
									<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PostBal.toFixed(8)}</TextViewHML>
								</View>
							</View>

							{/* for show horizontal line */}
							<Separator style={{ marginTop: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />

							{/* for show CR Amount*/}
							<View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', }}>
									<StatusChip
										color={crColor}
										value={R.strings.Cr}></StatusChip>

									<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: crColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.CrAmount).toFixed(8).toString()}</TextViewHML>
								</View>
							</View>

							{/* for show DR Amount and Date*/}
							<View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center' }}>
								<View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
									<StatusChip
										color={drColor}
										value={R.strings.Dr}></StatusChip>

									<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: drColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.DrAmount).toFixed(8).toString()}</TextViewHML>
								</View>

								<View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '50%' }}>
									<ImageTextButton
										style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
										icon={R.images.IC_TIMER}
										iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
									/>
									<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
								</View>
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
		// get provider ledger data from reducer
		ProviderLedgerResult: state.ProviderLedgerReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Provider Ledger Action
	getProviderLedger: (payload) => dispatch(getProviderLedger(payload)),
	// Clear Provider Ledger Action
	clearProviderLedgerData: () => dispatch(clearProviderLedgerData()),
	// Perform Provider Wallet Action
	getProviderWalletList: (payload) => dispatch(getProviderWalletList(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProviderLedgerListScreen)