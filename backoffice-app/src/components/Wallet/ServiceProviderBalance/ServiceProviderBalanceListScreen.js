import React, { Component } from 'react'
import { Text, View, FlatList, Easing } from 'react-native'
import { changeTheme, parseFloatVal, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import CardView from '../../../native_theme/components/CardView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import { validateValue, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { getProviderList, getWalletType } from '../../../actions/PairListAction';
import { getServiceProviderBalList } from '../../../actions/Wallet/ServiceProviderBalActions';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';

export class ServiceProviderBalanceListScreen extends Component {
	constructor(props) {
		super(props)

		// get data from previous screen
		let { item, serviceProvider, currencyName, transType } = props.navigation.state.params
		// Define all state initial state
		this.state = {
			searchInput: '',
			refreshing: false,
			isFirstTime: true,

			ServiceProviderId: 0,
			ServiceProvider: [],
			selectedServiceProvider: serviceProvider !== undefined ? serviceProvider : R.strings.select_serivce_provider,

			TransTypeId: 0,
			TransType: [
				{ value: R.strings.selectTransactionType },
				{ code: 6, value: 'Withdrawal' },
				{ code: 9, value: 'AddressGeneration' }
			],
			selectedTransType: transType !== undefined ? transType : R.strings.selectTransactionType,

			Currency: [],
			selectedCurrency: currencyName !== undefined ? currencyName : R.strings.selectCurrency,
			isDrawerOpen: false,
			disabled: false,

			WalletDataList: null,

			ServiceProviderBalResponse: item !== undefined ? item : [],
		}

		// create reference
		this.drawer = React.createRef();

		//To Bind All Method
		this.onBackPress = this.onBackPress.bind(this);

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Service Provider List Api 
			this.props.getProviderList()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	//for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
	onBackPress() {
		if (this.state.isDrawerOpen) {
			this.drawer.closeDrawer();
			this.setState({ isDrawerOpen: false })
		}
		else {
			//going back screen
			this.props.navigation.goBack();
		}
	}

	onServiceProviderChange = async (item, object) => {
		let obj = {}
		if (item !== R.strings.select_serivce_provider) {
			// Api not call when user already select selected item 
			if (this.state.selectedServiceProvider !== item) {
				obj = {
					...obj,
					ServiceProviderId: object.Id,
				}

				// check internet connection
				if (await isInternet()) {
					// Call Get Wallet Type Api
					this.props.getWalletType({ ServiceProviderId: object.Id })
				}
			}
		}

		obj = {
			...obj,
			selectedServiceProvider: item,
			selectedCurrency: R.strings.selectCurrency,
			disabled: false,
		}
		this.setState(obj)
	}

	// Reset Filter
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer();
	}

	// Api Call when press on complete button
	onCompletePress = async () => {
		if (this.state.selectedServiceProvider === R.strings.select_service_provider) {
			this.toast.Show(R.strings.select_serivce_provider)
			return
		}

		// Currency dropdown displayed on Service Provider list item
		if (this.state.WalletDataList !== null && this.state.WalletDataList.Types.length > 0) {

			// display toast
			if (this.state.selectedCurrency === R.strings.selectCurrency) {
				this.toast.Show(R.strings.selectCurrency)
			} else {
				// Close drawer
				this.drawer.closeDrawer();

				// check internet connection
				if (await isInternet()) {

					let req = {
						ServiceProviderId: this.state.ServiceProviderId,
						CurrencyName: this.state.selectedCurrency,
						TransactionType: this.state.selectedTransType === R.strings.selectTransactionType ? '' : this.state.TransTypeId
					}
					// Call Service Provicer List Api
					this.props.getServiceProviderBalList(req)
				}
			}
		} else {
			this.setState({ disabled: true })
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return {
				...state,
				isFirstTime: false,
			};
		}

		// To Skip Render if old and new props are equal
		if (ServiceProviderBalanceListScreen.oldProps !== props) {
			ServiceProviderBalanceListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { SerProviderList, WalletDataList, ServiceProviderBalList } = props.ServiceProviderBalResult;

			// ServiceProviderBalList is not null
			if (ServiceProviderBalList) {
				try {
					if (state.ServiceProviderBalList == null || (state.ServiceProviderBalList != null && ServiceProviderBalList !== state.ServiceProviderBalList)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: ServiceProviderBalList, isList: true })) {

							return Object.assign({}, state, {
								ServiceProviderBalList,
								ServiceProviderBalResponse: parseArray(ServiceProviderBalList.Data),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ServiceProviderBalList: null,
								ServiceProviderBalResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ServiceProviderBalList: null,
						ServiceProviderBalResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// SerProviderList is not null
			if (SerProviderList) {
				try {
					//if local SerProviderList state is null or its not null and also different then new response then and only then validate response.
					if (state.SerProviderList == null || (state.SerProviderList != null && SerProviderList !== state.SerProviderList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: SerProviderList, isList: true })) {
							let res = parseArray(SerProviderList.Response);

							for (var dataItem in res) {
								let item = res[dataItem]
								item.value = item.ProviderName
							}

							let serviceProviderName = [
								{ value: R.strings.select_serivce_provider },
								...res
							];

							return { ...state, SerProviderList, ServiceProvider: serviceProviderName, };
						} else {
							return { ...state, SerProviderList, ServiceProvider: [{ value: R.strings.select_serivce_provider }] };
						}
					}
				} catch (e) {
					return { ...state, ServiceProvider: [{ value: R.strings.select_serivce_provider }] };
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							let res = parseArray(WalletDataList.Types);

							for (var WalletDataListKey in res) {
								let item = res[WalletDataListKey]
								item.value = item.TypeName
							}

							let walletName = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, WalletDataList, Currency: walletName, selectCurrency: R.strings.selectCurrency };
						} else {
							return { ...state, WalletDataList: null, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, WalletDataList: null, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null
	}

	// Drawer Navigation
	navigationDrawer() {
		let pickers = [
			{
				title: R.strings.ServiceProvider,
				array: this.state.ServiceProvider,
				selectedValue: this.state.selectedServiceProvider,
				onPickerSelect: (index, object) => this.onServiceProviderChange(index, object)
			},
		]
		if (this.state.WalletDataList !== null && this.state.WalletDataList.Types.length > 0) {
			pickers = [
				...pickers,
				{
					title: R.strings.Currency,
					array: this.state.Currency,
					selectedValue: this.state.selectedCurrency,
					onPickerSelect: (index) => this.setState({ selectedCurrency: index })
				}
			]
		}
		pickers = [
			...pickers,
			{
				title: R.strings.transType,
				array: this.state.TransType,
				selectedValue: this.state.selectedTransType,
				onPickerSelect: (index, object) => this.setState({ selectedTransType: index, code: object.code })
			}
		]
		return (
			/* for show filter of fromdate, todate,currency and status data */
			<FilterWidget
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				completeButtonStyle={{ backgroundColor: this.state.disabled ? R.colors.textSecondary : R.colors.buttonBackground }}
				comboPickerStyle={{ marginTop: 0 }}
				toastRef={component => this.toast = component}
				pickers={pickers}
			/>
		)
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		const { ServiceProviderBalLoading } = this.props.ServiceProviderBalResult;

		// for searching functionality
		let finalItems = this.state.ServiceProviderBalResponse.filter(item => (
			item.CurrencyName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Address.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Balance.toString().includes(this.state.searchInput) ||
			item.Fee.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Leverage Request Filteration
			<Drawer
				ref={cmpDrawer => this.drawer = cmpDrawer} drawerWidth={R.dimens.FilterDrawarWidth}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })} drawerContent={this.navigationDrawer()}
				easingFunc={Easing.ease}
				>

				<SafeView style={{ 
					flex: 1, 
					backgroundColor: R.colors.background }}
					>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						title={R.strings.serviceProviderBalance}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />
					<View style={{ flex: 1 }}>
						{
							(ServiceProviderBalLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <ServiceProviderBalListItem
										index={index}
										item={item}
										size={finalItems.length}
									/>}
									// assign index as key valye to Withdrawal list item
									keyExtractor={(item, index) => index.toString()}

									contentContainerStyle={contentContainerStyle(finalItems)}
									// Displayed Empty Component when no record found 
									ListEmptyComponent={<ListEmptyComponent />}
								/>
						}
					</View>

				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class ServiceProviderBalListItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item) {
			return false
		}
		return true
	}

	render() {
		let { size,onPress , index, item, } = this.props

		return (
			<AnimatableItem>
				<View style={{
					marginLeft: R.dimens.widget_left_right_margin, flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						borderRadius: 0, 	elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
						flex: 1,
					}} onPress={onPress}>

						<View style={{ 
							flex: 1, 
							flexDirection: 'row' 
							}}>
							{/* Currency Image */}
							<ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.CurrencyName ? item.CurrencyName : '-'}</Text>
								</View>

								<View style={{ flex: 1, }}>
									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Address}: </TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Address)}</TextViewHML>
									</View>

									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Balance}: </TextViewHML>
										<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
											{(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}
										</TextViewHML>
									</View>

									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.fee}: </TextViewHML>
										<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
											{(parseFloatVal(item.Fee).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Fee).toFixed(8)) : '-')}
										</TextViewHML>
									</View>
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
		// get service provider balance data from reducer
		ServiceProviderBalResult: state.ServiceProviderBalanceReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Get Provider List Action
	getProviderList: () => dispatch(getProviderList()),
	// To Get Currency List Action
	getWalletType: (payload) => dispatch(getWalletType(payload)),
	// To Get Service Provider Bal List Action
	getServiceProviderBalList: (payload) => dispatch(getServiceProviderBalList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceProviderBalanceListScreen);