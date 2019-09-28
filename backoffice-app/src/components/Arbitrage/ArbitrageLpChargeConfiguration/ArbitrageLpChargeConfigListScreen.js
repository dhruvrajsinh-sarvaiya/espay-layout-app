import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, isEmpty } from '../../../validations/CommonValidation';
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
import { getLpChargeConfigList, clearLpChargeConfigData, addEditDeleteLpChargeConfig } from '../../../actions/Arbitrage/ArbitrageLpChargeConfigActions';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { getArbitrageProviderList, getArbitrageCurrencyList } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';
import PaginationWidget from '../../widget/PaginationWidget';

class ArbitrageLpChargeConfigListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],

			lpChargeConfigListDataState: null,
			arbitrageProviderDataState: null,
			arbitrageCurrencyDataState: null,

			isFirstTime: true,

			selectedPage: 1,
			row: [],

			currencies: [{ value: R.strings.selectCurrency }],
			selectedCurrency: R.strings.selectCurrency,
			selectedCurrencyCode: -1,

			providers: [{ value: R.strings.selectProvider }],
			selectedProvider: R.strings.selectProvider,
			selectedProviderCode: -1,

			//For Drawer First Time Close
			isDrawerOpen: false,
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

		// Check internet is Available or not
		if (await isInternet()) {
			//To getArbitrageCurrencyList 
			this.props.getArbitrageCurrencyList()
			//To getArbitrageProviderList
			this.props.getArbitrageProviderList()
			//To get callTopupHistoryApi 
			this.callLpChargeConfigListApi()
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
	callLpChargeConfigListApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
				selectedCurrency: R.strings.selectCurrency,
				selectedCurrencyCode: -1,
				selectedProvider: R.strings.selectProvider,
				selectedProviderCode: -1
			})
		}

		// Close Drawer user press on reset button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getLpChargeConfigList list
			this.props.getLpChargeConfigList({
				PageNo: 1,
				PageSize: AppConfig.pageSize
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearLpChargeConfigData()
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
		if (ArbitrageLpChargeConfigListScreen.oldProps !== props) {
			ArbitrageLpChargeConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { lpChargeConfigListData, arbitrageCurrencyData, arbitrageProviderData } = props.data;

			if (lpChargeConfigListData) {
				try {
					//if local lpChargeConfigListData state is null or its not null and also different then new response then and only then validate response.
					if (state.lpChargeConfigListDataState == null || (state.lpChargeConfigListDataState != null && lpChargeConfigListData !== state.lpChargeConfigListDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: lpChargeConfigListData, isList: true })) {

							let res = parseArray(lpChargeConfigListData.Data);

							//for add kyc status static
							for (var keyData in res) {
								let item = res[keyData];

								//yes
								if (item.KYCComplaint == 0) {
									item.KycStatusText = R.strings.no
								}
								//no
								else if (item.KYCComplaint == 1) {
									item.KycStatusText = R.strings.yes_text
								}
								else {
									item.KycStatusText = ''
								}
							}

							return {
								...state, lpChargeConfigListDataState: lpChargeConfigListData,
								response: res, refreshing: false,
								row: addPages(lpChargeConfigListData.TotalCount)
							};
						} else {
							return { ...state, lpChargeConfigListDataState: lpChargeConfigListData, response: [], refreshing: false, row: [] };
						}
					}
				} catch (e) {
					return { ...state, refreshing: false, row: [], response: [], };
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
							for (var currencyListData in res) {

								 let item = res[currencyListData];
								 item.value = item.CoinName;
							}

							let currencies = [
								{ value: R.strings.selectCurrency }, ...res
							];

							return { ...state, arbitrageCurrencyDataState: arbitrageCurrencyData, 
								currencies };
						} else {
							return { ...state, currencies: [{ value: R.strings.selectCurrency }], 
							arbitrageCurrencyDataState: arbitrageCurrencyData };
						}
					}
				} catch (e) {
					return { ...state, 
						currencies: [{ value: R.strings.selectCurrency }] };
				}
			}

			if (arbitrageProviderData) {
				try {
					//if local arbitrageProviderData state is null or its not null and also different then new response then and only then validate response.
					if (state.arbitrageProviderDataState == null || (state.arbitrageProviderDataState != null && arbitrageProviderData !== state.arbitrageProviderDataState)) {

						//if arbitrageProviderData response is success then store array list else store empty list
						if (validateResponseNew({ response: arbitrageProviderData, isList: true })) {
							let res = parseArray(arbitrageProviderData.Response);

							//for add Provider
							for (var keyProvider in res) {
								let item = res[keyProvider]; item.value = item.ProviderName;
							}

							let providers = [
								{ value: R.strings.selectProvider },
								...res
							];

							return { providers, ...state, arbitrageProviderDataState: arbitrageProviderData, };
						} else {
							return { ...state, arbitrageProviderDataState: arbitrageProviderData, providers: [{ value: R.strings.selectProvider }], };
						}
					}
				} catch (e) {
					return { ...state, providers: [{ value: R.strings.selectProvider }] };
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

			//To getLpChargeConfigList list
			this.props.getLpChargeConfigList(
				{
					PageNo: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
					WalletTypeId: this.state.selectedCurrency == R.strings.selectCurrency ? '' : this.state.selectedCurrencyCode,
					SerProId: this.state.selectedProvider == R.strings.selectProvider ? '' : this.state.selectedProviderCode,
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

				//To get getLpChargeConfigList list
				this.props.getLpChargeConfigList({
					PageNo: pageNo,
					PageSize: AppConfig.pageSize,
					WalletTypeId: this.state.selectedCurrency == R.strings.selectCurrency ? '' : this.state.selectedCurrencyCode,
					SerProId: this.state.selectedProvider == R.strings.selectProvider ? '' : this.state.selectedProviderCode,
				});
			}
		}
	}

	// Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
	rightMenuRender = () => {
		return (
			<View style={{ flexDirection: 'row' }}>
				<ImageTextButton
					style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
					icon={R.images.IC_PLUS}
					iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
					onPress={() => this.props.navigation.navigate('ArbitrageLpChargeConfigAddEditScreen', { onSuccess: this.callLpChargeConfigListApi })} />
				<ImageTextButton
					icon={R.images.FILTER} style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
					iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
					onPress={() => this.drawer.openDrawer()} />
			</View>
		)
	}

	// if press on complete button api calling
	onComplete = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getLpChargeConfigList list
			this.props.getLpChargeConfigList({
				PageNo: 1, PageSize: AppConfig.pageSize, SerProId: this.state.selectedProvider == R.strings.selectProvider ? '' : this.state.selectedProviderCode,
				WalletTypeId: this.state.selectedCurrency == R.strings.selectCurrency ? '' : this.state.selectedCurrencyCode,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({ selectedPage: 1 })
	}

	navigationDrawer() {
		// for show filter of fromdate, todate,currency and providers data etc
		return (
			<FilterWidget
				FromDatePickerCall={(date) => this.setState({ fromDate: date })}
				ToDatePickerCall={(date) => this.setState({ toDate: date })}
				FromDate={this.state.fromDate} ToDate={this.state.toDate}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				toastRef={component => this.toast = component}
				sub_container={{ paddingBottom: 0, }}

				pickers={[
					{
						title: R.strings.Currency, array: this.state.currencies,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.Id })
					},
					{
						title: R.strings.ServiceProvider,
						array: this.state.providers,
						selectedValue: this.state.selectedProvider,
						onPickerSelect: (index, object) => this.setState({ selectedProvider: index, selectedProviderCode: object.Id })
					},
				]}
				onResetPress={this.callLpChargeConfigListApi}
				onCompletePress={this.onComplete}
			/>
		)
	}

	onDeletePress = (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				// Delete Api Call
				this.props.addEditDeleteLpChargeConfig({
					Id: item.Id, WalletTypeId: item.WalletTypeID,
					PairID: item.PairID, SerProID: item.SerProID,
					TrnType: item.TrnType, KYCComplaint: item.KYCComplaint,
					Status: 9, Remarks: item.Remarks,
				})
			}
		}, R.strings.cancel, () => { })
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { lpChargeConfigAddEditDeleteData } = this.props.data;

		// compare response with previous response
		if (lpChargeConfigAddEditDeleteData !== prevProps.data.lpChargeConfigAddEditDeleteData) {

			// lpChargeConfigAddEditDeleteData is not null
			if (lpChargeConfigAddEditDeleteData) {
				try {
					//handle response of API for delete
					if (validateResponseNew({ response: lpChargeConfigAddEditDeleteData })) {
						//Display Success 
						showAlert(R.strings.Success + '!', R.strings.delete_success, 0, async () => {

							//Clear Lp Charge Config Data 
							this.props.clearLpChargeConfigData();

							// Call Lp Charge Configuration List Api 
							this.callLpChargeConfigListApi()
						});
					}
					else {
						//Clear Lp Charge Config Data 
						this.props.clearLpChargeConfigData();
					}
				} catch (error) {
					//Clear Lp Charge Config Data 
					this.props.clearLpChargeConfigData();
				}
			}
		}
	}

	render() {
		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.KycStatusText.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.ProviderName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.TrnTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Remarks.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			//DrawerLayout for Filteration
			<Drawer
				drawerWidth={R.dimens.FilterDrawarWidth}
				ref={component => this.drawer = component} drawerPosition={Drawer.positions.Right}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				drawerContent={this.navigationDrawer()} type={Drawer.types.Overlay}
				easingFunc={Easing.ease}>

				<SafeView style={this.styles().container}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set Progress bar as per our theme */}
					<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.lpChargeConfigAddEditDeleteFetching} />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true} onBackPress={this.onBackPress}
						title={R.strings.LPChargeConfiguration}
						nav={this.props.navigation} searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightMenuRenderChilds={this.rightMenuRender()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.lpChargeConfigListFetching && !this.state.refreshing)
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
										<LpChargeConfigListItem
											index={index}
											item={item}
											onDelete={() => this.onDeletePress(item)}
											onDetailPress={() => this.props.navigation.navigate('ArbitrageLpChargeConfigDetailScreen', { item })}
											onEdit={() => { this.props.navigation.navigate('ArbitrageLpChargeConfigAddEditScreen', { item, onSuccess: this.callLpChargeConfigListApi }) }}
											size={this.state.response.length} />
									}
									// assign index as key value item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In FlatList Item
									refreshControl={<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh}
									/>}
								/>
								:
								// Displayed empty component when no record found 
								<ListEmptyComponent 
								onPress={() => this.props.navigation.navigate('ArbitrageLpChargeConfigAddEditScreen', { onSuccess: this.callLpChargeConfigListApi })} module={R.strings.addLPChargeConfiguration}
								 />
						}
						{/*To Set Pagination View  */}
						<View>
							{filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
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
class LpChargeConfigListItem extends Component {
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
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, flex: 1, marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
						flex: 1, borderTopRightRadius: R.dimens.margin, borderRadius: 0,
					}}>

						<View style={{ flexDirection: 'row' }}>
							{/* for show PairName image or WalletTypeName  */}
							<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
								{/*  selltrade =8 buytrade=3  */}
								{item.TrnType == 3 || item.TrnType == 8 ?
									<ImageViewWidget url={!isEmpty(item.PairName) ? item.PairName.split('_')[0] : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} /> :
									<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
								}
							</View>

							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									{/* for show PairName or WalletTypeName  */}
									{item.TrnType == 3 || item.TrnType == 8 ?
										<Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.PairName) ? item.PairName.replace('_', '/') : '-'}</Text> :
										<Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.WalletTypeName) ? item.WalletTypeName : '-'}</Text>
									}
									<Text style={{ fontSize: R.dimens.smallText, color: R.colors.yellow, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.TrnTypeName)}</Text>
								</View>

								{/* for show provider, kycCompliant ,remarks  */}
								<View style={{ flex: 1, }}>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.provider + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.ProviderName)}</TextViewHML>
									</View>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.kycCompliant + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.KycStatusText}</TextViewHML>
									</View>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.remarks + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Remarks)}</TextViewHML>
									</View>
								</View>
							</View>
						</View>

						{/* for show status and button for detaillist ,edit,delete */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.StrStatus}></StatusChip>

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={
										{
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0, padding: R.dimens.CardViewElivation,
											backgroundColor: R.colors.yellow,
											marginRight: R.dimens.widgetMargin,
											justifyContent: 'center', alignItems: 'center',
										}}
									iconStyle={{ height: R.dimens.titleIconHeightWidth, width: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									icon={R.images.IC_VIEW_LIST}
									onPress={this.props.onDetailPress} />

								<ImageTextButton
									style={
										{
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth, margin: 0, padding: R.dimens.CardViewElivation,
											justifyContent: 'center',alignItems: 'center',
											marginRight: R.dimens.widgetMargin,
										}}
									icon={R.images.IC_EDIT} onPress={this.props.onEdit}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									 />

								<ImageTextButton
									style={
										{
											alignItems: 'center',
											backgroundColor: R.colors.failRed, borderRadius: R.dimens.titleIconHeightWidth,
											padding: R.dimens.CardViewElivation, margin: 0,
											justifyContent: 'center',
										}}
									
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onDelete}
									icon={R.images.IC_DELETE}
									 />
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For ArbitrageLpChargeConfigReducer Data 
	let data = {
		...state.ArbitrageLpChargeConfigReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getLpChargeConfigList List Action 
		getLpChargeConfigList: (request) => dispatch(getLpChargeConfigList(request)),
		//for getArbitrageCurrencyList list action 
		getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
		//for getArbitrageProviderList list action 
		getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
		//for addEditDeleteLpChargeConfig list action 
		addEditDeleteLpChargeConfig: (request) => dispatch(addEditDeleteLpChargeConfig(request)),
		//Perform clearLpChargeConfigData Action 
		clearLpChargeConfigData: () => dispatch(clearLpChargeConfigData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ArbitrageLpChargeConfigListScreen);