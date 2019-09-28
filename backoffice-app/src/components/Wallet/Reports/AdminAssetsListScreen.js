import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, parseFloatVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import FilterWidget from '../../widget/FilterWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { getAdminAssetsList } from '../../../actions/Wallet/AdminAssetsActions';
import { getWalletType } from '../../../actions/PairListAction';
import ListLoader from '../../../native_theme/components/ListLoader';
import { connect } from 'react-redux';
import PaginationWidget from '../../widget/PaginationWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';

export class AdminAssetsListScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			row: [],
			Currency: [],
			UsageType: [
				{ value: R.strings.selectUsageType },
				{ code: 0, value: R.strings.tradingWallet },
				{ code: 1, value: R.strings.marketWallet },
				{ code: 2, value: R.strings.coldWallet },
				{ code: 3, value: R.strings.changeCrWalletOrg },
				{ code: 4, value: R.strings.depositionAdminWallet },
			],
			AdminAssetsResponse: [],

			WalletTypeId: 0,
			WalletUsageTypeId: 0,

			searchInput: '',
			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false,
			selectedPage: 1,
			selectedCurrency: R.strings.selectCurrency,
			selectedUsageType: R.strings.selectUsageType,
		}

		// create reference
		this.drawer = React.createRef();
		this.toast = React.createRef();

		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize
		}

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Admin Assets List Api
			this.props.getAdminAssetsList(this.request)
			// Call Get Wallet List Api
			this.props.getWalletType()
		}
	}

	// For Swipe to referesh Functionality
	onRefresh = async () => {

		this.setState({ refreshing: true });

		// check internet connection
		if (await isInternet()) {
			// Bind request for Admin Assets
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage - 1,
				WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
				WalletUsageTypeId: this.state.selectedUsageType !== R.strings.selectUsageType ? this.state.WalletUsageTypeId : '',
			}

			//Call Get Admin Assets API
			this.props.getAdminAssetsList(this.request);

		} else {
			this.setState({ refreshing: false });
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

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}



	// Reset Filter
	onResetPress = async () => {
		this.drawer.closeDrawer();

		// set Initial State
		this.setState({
			searchInput: '',
			selectedPage: 1,
			WalletTypeId: 0,
			WalletUsageTypeId: 0,
			PageSize: AppConfig.pageSize,
			selectedCurrency: R.strings.selectCurrency,
			selectedUsageType: R.strings.selectUsageType,
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Admin Assets
			this.request = {
				...this.request,
				PageNo: 0,
				WalletTypeId: '',
				WalletUsageTypeId: '',
			}

			// Call Admin Assets List API
			this.props.getAdminAssetsList(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {
		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({
			PageNo: 0,
			PageSize: AppConfig.pageSize,
		})

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Admin Assets
			this.request = {
				...this.request,
				WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
				WalletUsageTypeId: this.state.selectedUsageType !== R.strings.selectUsageType ? this.state.WalletUsageTypeId : '',
				PageNo: 0,
			}

			//Call Get Admin Assets API
			this.props.getAdminAssetsList(this.request);

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

				// Bind request for Admin Assets
				this.request = {
					...this.request,
					WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
					PageNo: pageNo - 1,
					WalletUsageTypeId: this.state.selectedUsageType !== R.strings.selectUsageType ? this.state.WalletUsageTypeId : '',
				}
				//Call Get Admin Assets API
				this.props.getAdminAssetsList(this.request);

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
		if (AdminAssetsListScreen.oldProps !== props) {
			AdminAssetsListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { AdminAssetsList, WalletDataList } = props.AdminAssetsResult;

			// AdminAssetsList is not null
			if (AdminAssetsList) {
				try {
					if (state.AdminAssetsList == null || (state.AdminAssetsList != null && AdminAssetsList !== state.AdminAssetsList)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: AdminAssetsList, isList: true })) {

							return Object.assign({}, state, {
								AdminAssetsList,
								AdminAssetsResponse: parseArray(AdminAssetsList.Data),
								refreshing: false,
								row: addPages(AdminAssetsList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								AdminAssetsList: null,
								refreshing: false,
								AdminAssetsResponse: [],
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						AdminAssetsList: null,
						AdminAssetsResponse: [], refreshing: false, row: [],
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null
						|| (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ isList: true, response: WalletDataList, })) {
							let res = parseArray(WalletDataList.Types);

							for (var dataItem in res) {

								let item = res[dataItem]
								item.value = item.TypeName
							}

							let walletNames = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return {
								...state,
								WalletDataList,
								Currency: walletNames
							};
						} else {
							return {
								...state,
								WalletDataList, Currency: [{ value: R.strings.selectCurrency }]
							};
						}
					}
				} catch (e) {
					return {
						...state,
						Currency: [
							{ value: R.strings.selectCurrency }
						]
					};
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
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				toastRef={component => this.toast = component}
				pickers={[
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.ID })
					},
					{
						title: R.strings.usageType,
						array: this.state.UsageType,
						selectedValue: this.state.selectedUsageType,
						onPickerSelect: (index, object) => this.setState({ selectedUsageType: index, WalletUsageTypeId: object.code })
					},
				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { AdminAssetsLoading, } = this.props.AdminAssetsResult;

		// For searching value
		let finalItems = this.state.AdminAssetsResponse.filter(item => (
			item.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Balance.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Admin Assets Filteration
			<Drawer
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				drawerContent={this.navigationDrawer()}
				ref={cmpDrawer => this.drawer = cmpDrawer}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				drawerWidth={R.dimens.FilterDrawarWidth}
				easingFunc={Easing.ease}>

				<SafeView style={{
					flex: 1,
					backgroundColor: R.colors.background
				}}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.admin_asset}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(AdminAssetsLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <AdminAssetsListItem
										onPress={() => this.props.navigation.navigate('AdminAssetsDetailScreen', { item })}
										index={index}
										item={item}
										size={finalItems.length}
									/>
									}
									// assign index as key valye to Admin Assets list item
									keyExtractor={(_item, index) => index.toString()}

									// For Refresh Functionality In Admin Assets FlatList Item
									refreshControl={
										<RefreshControl
											refreshing={this.state.refreshing}
											progressBackgroundColor={R.colors.background}
											onRefresh={this.onRefresh}
											colors={[R.colors.accent]}
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
								finalItems.length > 0
								&&
								<PaginationWidget
									row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
							}
						</View>

					</View>

				</SafeView>

			</Drawer>
		)
	}
}

// This Class is used for display record in list
class AdminAssetsListItem extends Component {

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
		let { size, index, item, onPress } = this.props

		// set color
		let color = R.colors.accent
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 0)
			color = R.colors.failRed

		// Getting usage type from id
		let usageType = ''
		if (item.WalletUsageType == 0)
			usageType = R.strings.tradingWallet
		else if (item.WalletUsageType == 1)
			usageType = R.strings.marketWallet
		else if (item.WalletUsageType == 2)
			usageType = R.strings.coldWallet
		else if (item.WalletUsageType == 3)
			usageType = R.strings.changeCrWalletOrg
		else if (item.WalletUsageType == 4)
			usageType = R.strings.depositionAdminWallet

		return (
			// flatlist item animation

			<AnimatableItem>

				<View
					style={{
						flex: 1, marginRight: R.dimens.widget_left_right_margin,
						marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
						marginLeft: R.dimens.widget_left_right_margin,
						marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					}}>
					<CardView style={{
						flex: 1,
						borderBottomLeftRadius: R.dimens.margin,
						borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
					}} onPress={onPress}
					>

						<View style={{ flex: 1, flexDirection: 'row' }}>

							{/* Currency Image */}
							<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

								{/* for show username and wallet type name */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.WalletTypeName)}</Text>

									<View style={{ flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
											{validateValue(parseFloatVal(item.Balance).toFixed(8))}

										</Text>
										<ImageTextButton
											icon={R.images.RIGHT_ARROW_DOUBLE}
											style={{ padding: 0, margin: 0, }}
											iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.usageType + ': '}</TextViewHML>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(usageType)}</TextViewHML>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.WalletName + ': '}</TextViewHML>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.WalletName)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status  */}
						<View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StrStatus ? item.StrStatus : '-'}></StatusChip>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get transfer fee data from reducer
		AdminAssetsResult: state.AdminAssetsReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Transfer Fee List Action
	getAdminAssetsList: (payload) => dispatch(getAdminAssetsList(payload)),
	// To Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminAssetsListScreen);