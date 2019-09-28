import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, RefreshControl, FlatList, Easing } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { changeTheme, parseArray, addPages, getCurrentDate } from '../../../controllers/CommonUtils';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { getWalletLedgerList, getAuthUserList, clearUserWalletsData } from '../../../actions/Wallet/UserWalletsActions';
import { connect } from 'react-redux';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { isInternet, validateValue, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import PaginationWidget from '../../widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import WalletOrgLedgerListItem from '../Reports/WalletOrgLedgerListItem';

export class AuthUserAndWalletLedgerListScreen extends Component {
	constructor(props) {
		super(props);

		//fill all the data from previous screen
		this.state = {
			item: props.navigation.state.params && props.navigation.state.params.item,
			WalletId: props.navigation.state.params && props.navigation.state.params.item.AccWalletID,
			selectedPage: 1,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),

			isFirstTime: true,
			refreshing: false,
			hideSearch: false,
			searchInput: '',
			showUserList: true,
			isDrawerOpen: false,

			row: [],
			WalletLedgerResponse: [],
			AuthUserResponse: [],
		};

		//initial request
		this.request = {
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			WalletId: props.navigation.state.params && props.navigation.state.params.item.AccWalletID,
			PageNo: 0,
			PageSize: AppConfig.pageSize
		}
		// Create Reference

		this.drawer = React.createRef()

		//Bind methods

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

	componentDidMount = async () => {
		let { item } = this.state

		//Add this method to change theme based on stored theme name.
		changeTheme()

		// check internet connection
		if (await isInternet()) {
			// Wallet Ledger Api Call
			this.props.getWalletLedgerList(this.request)
			// Call Wallet Data Api
			this.props.getAuthUserList({ WalletId: item.AccWalletID })
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {

		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentWillUnmount() {
		// clear reducer 
		this.props.clearUserWalletsData()
	}

	// to show order history and recent order as per selection
	onTabChange(showUserList) {

		//hideSearch to true so that search view can hide
		this.setState({ showUserList, search: '', hideSearch: false })
	}

	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			if (this.state.showUserList) {
				this.props.getAuthUserList({ WalletId: this.state.WalletId })
			} else {

				// Bind request for Wallet Ledger
				this.request = {
					...this.request,
					PageNo: 0,
					FromDate: getCurrentDate(),
					ToDate: getCurrentDate(),
				}
				// Call Get Wallet Ledger API
				this.props.getWalletLedgerList(this.request);
			}

		} else {
			this.setState({ refreshing: false });
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

				// Bind request for Wallet Ledger
				this.request = {
					...this.request,
					PageNo: pageNo - 1,
					FromDate: getCurrentDate(),
					ToDate: getCurrentDate(),
				}
				// Call Get Wallet Ledger API
				this.props.getWalletLedgerList(this.request);
			}
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
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Wallet Ledger
			this.request = {
				...this.request,
				PageNo: 0,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
			}
			//Call Get Wallet Ledgers API
			this.props.getWalletLedgerList(this.request);
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {

		// Check validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
		else {

			this.setState({
				selectedPage: 1,
				PageSize: AppConfig.pageSize,
			})

			// Close Drawer user press on Complete button bcoz display flatlist item on Screen
			this.drawer.closeDrawer();

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Wallet Ledger
				this.request = {
					...this.request,
					PageNo: 0,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
				}
				//Call Get Wallet Ledger API
				this.props.getWalletLedgerList(this.request);
			}

			//If Filter from Complete Button Click then empty searchInput
			this.setState({ searchInput: '' })
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (AuthUserAndWalletLedgerListScreen.oldProps !== props) {
			AuthUserAndWalletLedgerListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { AuthUserList, WalletLedgerList, } = props.UserWalletsResult

			// AuthUserList is not null
			if (AuthUserList) {
				try {
					if (state.AuthUserList == null || (AuthUserList !== state.AuthUserList)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: AuthUserList, isList: true, })) {

							return Object.assign({}, state, {
								AuthUserList,
								AuthUserResponse: parseArray(AuthUserList.Data),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								AuthUserList: null,
								AuthUserResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						AuthUserList: null,
						AuthUserResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// WalletLedgerList is not null
			if (WalletLedgerList) {
				try {
					if (state.WalletLedgerList == null || (WalletLedgerList !== state.WalletLedgerList)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: WalletLedgerList, isList: true, })) {

							return Object.assign({}, state, {
								WalletLedgerList,
								WalletLedgerResponse: parseArray(WalletLedgerList.WalletLedgers),
								refreshing: false,
								row: addPages(WalletLedgerList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								WalletLedgerList: null,
								WalletLedgerResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						row: [],
						WalletLedgerList: null,
						WalletLedgerResponse: [],
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
			// for show filter of fromdate, todate,currency and user data etc
			<FilterWidget
				onResetPress={this.onResetPress}
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				FromDate={this.state.FromDate}
				toastRef={component => this.toast = component}
				ToDate={this.state.ToDate}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				onCompletePress={this.onCompletePress}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { AuthUserLoading, WalletLedgerLoading } = this.props.UserWalletsResult

		let finalItems = this.state.showUserList ? this.state.AuthUserResponse.filter(item => (
			item.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.OrgName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.WalletType.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.UserRoleName.toLowerCase().includes(this.state.searchInput.toLowerCase())
		)) : this.state.WalletLedgerResponse.filter(item => (
			item.PreBal.toFixed(8).toString().includes(this.state.searchInput) ||
			item.PostBal.toFixed(8).toString().includes(this.state.searchInput) ||
			item.CrAmount.toFixed(8).toString().includes(this.state.searchInput) ||
			item.DrAmount.toFixed(8).toString().includes(this.state.searchInput) ||
			item.Amount.toFixed(8).toString().includes(this.state.searchInput)
		))

		return (
			/* DrawerLayout for Order History Filteration */
			<Drawer
				ref={cmp => this.drawer = cmp}
				disabled={this.state.showUserList}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerPosition={Drawer.positions.Right}
				drawerContent={this.navigationDrawer()}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
				easingFunc={Easing.ease}>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						onBackPress={this.onBackPress}
						searchable={true}
						original={true}
						onRightMenuPress={() => this.drawer.openDrawer()}
						//To manually visible SearchView
						onVisibleSearch={(isVisible) => this.setState({ hideSearch: isVisible })}
						visibleSearch={this.state.hideSearch}

						//If search input change than show searchView with hideSearch to false
						onSearchText={(input) => this.setState({ searchInput: input, })}

						//On Search Cancel Button change hideSearch to true
						onSearchCancel={() => this.setState({ hideSearch: false })}
						titleStyle={{ justifyContent: 'flex-start', width: '80%' }}
						leftStyle={{ width: '10%' }}

						rightIcon={!this.state.showUserList && R.images.FILTER}
						rightStyle={{ width: '10%' }}
						nav={this.props.navigation} />

					<View style={{ flexDirection: 'row', }}>
						<TouchableWithoutFeedback
							onPress={() => this.onTabChange(true)}>
							<View style={{ marginRight: R.dimens.widgetMargin }}>
								<TextViewMR
									numberOfLines={1}
									ellipsizeMode={'tail'}
									style={{
										color: this.state.showUserList ? R.colors.textPrimary : R.colors.textSecondary,
										fontSize: R.dimens.mediumText,
										paddingLeft: R.dimens.margin_left_right,
									}}>{R.strings.authUser}</TextViewMR>
							</View>
						</TouchableWithoutFeedback>

						<TouchableWithoutFeedback
							onPress={() => this.onTabChange(false)}>
							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
								<TextViewMR
									numberOfLines={1}
									ellipsizeMode={'tail'}
									style={{
										color: !this.state.showUserList ? R.colors.textPrimary : R.colors.textSecondary,
										fontSize: R.dimens.mediumText,
										paddingRight: R.dimens.margin_left_right,
									}}>{R.strings.walletLedger}</TextViewMR>
							</View>
						</TouchableWithoutFeedback>
					</View>

					{
						this.state.showUserList ?
							<View style={{ flex: 1 }}>
								{
									(AuthUserLoading && !this.state.refreshing) ?
										<ListLoader />
										:
										<FlatList
											data={finalItems}
											showsVerticalScrollIndicator={false}
											// render all item in list
											renderItem={({ item, index }) => <AuthUserFlatListItem
												index={index}
												item={item}
												size={finalItems.length} />
											}
											// assign index as key value to Wallet Ledger list item
											keyExtractor={(_item, index) => index.toString()}
											// For Refresh Functionality In Wallet Ledger FlatList Item
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
							:
							<View style={{ flex: 1, justifyContent: 'space-between' }}>
								{
									(WalletLedgerLoading && !this.state.refreshing) ?
										<ListLoader />
										:
										<FlatList
											data={finalItems}
											showsVerticalScrollIndicator={false}
											// render all item in list
											renderItem={({ item, index }) => <WalletOrgLedgerListItem
												index={index}
												item={item}
												size={finalItems.length} />
											}
											// assign index as key value to Wallet Ledger list item
											keyExtractor={(_item, index) => index.toString()}
											// For Refresh Functionality In Wallet Ledger FlatList Item
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

								{/*To Set Pagination View  */}
								<View>
									{
										finalItems.length > 0 &&
										<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
									}
								</View>
							</View>
					}
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class AuthUserFlatListItem extends Component {

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

		let color = R.colors.accent

		//set status color based on status code
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 2 || item.Status == 5 || item.Status == 6 || item.Status == 9)
			color = R.colors.failRed

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, flex: 1,
					marginRight: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView
						style={{
							borderTopRightRadius: R.dimens.margin,
							flex: 1,
							borderBottomLeftRadius: R.dimens.margin,
							borderRadius: 0,
							elevation: R.dimens.listCardElevation,
						}}
						onPress={onPress}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.WalletType ? item.WalletType : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show username,amount and currency */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletType}</Text>
									</View>
									<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.WalletName)}</Text>
								</View>

								{/* User Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Username + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* Role */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Role + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserRoleName)}</TextViewHML>
								</View>

								{/* Role */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Organization + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.OrgName)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status  */}
						<View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StrStatus ? item.StrStatus : '-'} />
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get user wallets data from reducer
		UserWalletsResult: state.UserWalletsReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Wallet Ledger Action
	getWalletLedgerList: (payload) => dispatch(getWalletLedgerList(payload)),
	// Perform Auth User List Action
	getAuthUserList: (payload) => dispatch(getAuthUserList(payload)),
	// Clear User Wallets Data
	clearUserWalletsData: () => dispatch(clearUserWalletsData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthUserAndWalletLedgerListScreen)