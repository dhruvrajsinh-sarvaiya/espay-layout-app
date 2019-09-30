import React, { Component } from 'react'
import { Text, View, FlatList, Easing, RefreshControl } from 'react-native'
import { changeTheme, parseArray, parseFloatVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getProviderBalList } from '../../../actions/account/ProviderBalCheckAction';
import { validateResponseNew, validateValue, isInternet } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ListLoader from '../../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { Fonts } from '../../../controllers/Constants';

export class ProviderBalCheckListScreen extends Component {
	constructor(props) {
		super(props);

		// get data from previous screen
		let { item, selectedServiceProvider, currencyName, Currency, ServiceProvider, ServiceProviderId, GenerateMismatch } = props.navigation.state.params

		//Define all initial state
		this.state = {
			Currency: Currency !== undefined ? Currency : [],
			selectedCurrency: currencyName !== undefined ? currencyName : R.strings.selectCurrency,

			ServiceProvider: ServiceProvider !== undefined ? ServiceProvider : [],
			selectedServiceProvider: selectedServiceProvider !== undefined ? selectedServiceProvider : R.strings.select_serivce_provider,
			ServiceProviderId: ServiceProviderId !== undefined ? ServiceProviderId : '',

			GenerateMismatch: GenerateMismatch,

			ProviderBalResponse: item !== undefined ? item : [],
			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false,
			searchInput: '',
		}

		// Create Reference
		this.drawer = React.createRef();

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this)

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	onBackPress() {
		if (this.state.isDrawerOpen) {
			this.drawer.closeDrawer(); this.setState({ isDrawerOpen: false })
		}
		else 
		{
			//goging back screen
			this.props.navigation.goBack()
		}
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme()
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps)
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
		if (ProviderBalCheckListScreen.oldProps !== props) {
			ProviderBalCheckListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { ProviderBalCheckList } = props.ProviderBalCheckResult;

			// ProviderBalCheckList is not null
			if (ProviderBalCheckList) {
				try {
					if (state.ProviderBalCheckList == null || (state.ProviderBalCheckList != null && ProviderBalCheckList !== state.ProviderBalCheckList)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: ProviderBalCheckList, isList: true })) {

							return Object.assign({}, state, {
								ProviderBalCheckList,
								ProviderBalResponse: parseArray(ProviderBalCheckList.Data),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ProviderBalCheckList: null,
								ProviderBalResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ProviderBalCheckList: null,
						ProviderBalResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

		}
		return null
	}

	// Reset Filter
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer()

		this.setState({
			selectedCurrency: this.state.Currency[1].TypeName,
			selectedServiceProvider: R.strings.select_serivce_provider,
			GenerateMismatch: false,
		})

		// check internet connection
		if (await isInternet()) {
			let req = {
				SMSCode: this.state.Currency[1].TypeName,
				ServiceProviderId: this.state.selectedServiceProvider !== R.strings.select_service_provider ? this.state.ServiceProviderId : ''
			}

			// Call Provider Balance Check List Api
			this.props.getProviderBalList(req)
		}
	}

	// Api Call when press on complete button
	onCompletePress = async () => {
		if (this.state.selectedCurrency === R.strings.selectCurrency) {
			this.toast.Show(R.strings.selectCurrency)
		} else {
			// Close drawer
			this.drawer.closeDrawer()

			// check internet connection
			if (await isInternet()) {
				let req = {
					SMSCode: this.state.selectedCurrency,
					ServiceProviderId: this.state.selectedServiceProvider !== R.strings.select_service_provider ? this.state.ServiceProviderId : '',
					GenerateMismatch: (this.state.GenerateMismatch == true &&
						(this.state.selectedCurrency != R.strings.selectCurrency &&
							this.state.selectedServiceProvider != R.strings.select_serivce_provider)) ? 1 : '', // For genrate mismatch functionality 
				}

				// Call Provider Balance Check List Api
				this.props.getProviderBalList(req)
			}
		}
	}

	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Provider Bal Check
			let req = {
				SMSCode: this.state.selectedCurrency,
				ServiceProviderId: this.state.selectedServiceProvider !== R.strings.select_service_provider ? this.state.ServiceProviderId : '',
				GenerateMismatch: (this.state.GenerateMismatch == true &&
					(this.state.selectedCurrency != R.strings.selectCurrency &&
						this.state.selectedServiceProvider != R.strings.select_serivce_provider)) ? 1 : '', // For genrate mismatch functionality 
			}

			// Call Get Provider Bal Check API
			this.props.getProviderBalList(req);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Drawer Navigation
	navigationDrawer() {

		let resolveBalanceMismatchData = null

		if (this.state.selectedServiceProvider !== R.strings.select_serivce_provider
			&& this.state.selectedCurrency !== R.strings.selectCurrency) {
			resolveBalanceMismatchData = [{
				backgroundColor: 'transparent',
				title: R.strings.resolveBalanceMismatch,
				isToggle: this.state.GenerateMismatch,
				onValueChange: () => this.setState({ GenerateMismatch: !this.state.GenerateMismatch })
			},
			]
		}

		return (
			// for show filter of fromdate, todate,currency and status data
			<FilterWidget
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				toastRef={component => this.toast = component}
				featureSwitchs={resolveBalanceMismatchData}
				pickers={[
					{
						title: R.strings.ServiceProvider,
						array: this.state.ServiceProvider,
						selectedValue: this.state.selectedServiceProvider,
						onPickerSelect: (index, object) => this.setState({ selectedServiceProvider: index, ServiceProviderId: object.Id })
					},
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index) => this.setState({ selectedCurrency: index })
					}
				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { ProviderBalCheckLoading, } = this.props.ProviderBalCheckResult

		let finalItems = this.state.ProviderBalResponse.filter(item => (
			item.CurrencyName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.ProviderName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Balance.toString().includes(this.state.searchInput) ||
			item.WalletBalance.toString().includes(this.state.searchInput)
		))
		return (
			//DrawerLayout for Provider Bal Check Filteration
			<Drawer
			onDrawerClose={() => this.setState({ isDrawerOpen: false })}
			drawerWidth={R.dimens.FilterDrawarWidth}
			drawerContent={this.navigationDrawer()}
			onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
			ref={cmpDrawer => this.drawer = cmpDrawer}
			drawerPosition={Drawer.positions.Right}
				type={Drawer.types.Overlay}
				easingFunc={Easing.ease}>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						title={R.strings.providerBalanceCheck}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(ProviderBalCheckLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <ProviderBalCheckListItem
										index={index}
										item={item}
										size={finalItems.length}
									/>
									}
									// assign index as key value to Provider Bal Check list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In Provider Bal Check FlatList Item
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]}
											progressBackgroundColor={R.colors.background}
											refreshing={this.state.refreshing}
											onRefresh={this.onRefresh}
										/>
									}
									contentContainerStyle={contentContainerStyle(finalItems)}
									// Displayed empty component when no record found 
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
class ProviderBalCheckListItem extends Component {

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
				<View style={{ marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						borderTopRightRadius: R.dimens.margin,
						borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						flex: 1,
					}} onPress={onPress}
					>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

								{/* for show amount and currency */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.CurrencyName}</Text>
									<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
										{(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}
									</Text>
								</View>

								{/* Provider Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Provider_Name + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.ProviderName)}</TextViewHML>
								</View>

								{/* Wallet Balance */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.walletBalance + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.WalletBalance.toFixed(8))}</TextViewHML>
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
		// get provider balance check data from reducer
		ProviderBalCheckResult: state.ProviderBalCheckReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// Perform Provider Balance Check Action
	getProviderBalList: (payload) => dispatch(getProviderBalList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProviderBalCheckListScreen)
