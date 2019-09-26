import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray/* , addPages */, parseFloatVal } from '../../../controllers/CommonUtils';
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
import { getArbiUserWalletsList, clearArbiUserWalletsData } from '../../../actions/Arbitrage/ArbitrageUserWalletsActions';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import { getArbitrageCurrencyList, getUserDataList } from '../../../actions/PairListAction';

class ArbiUserWalletsListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {

			refreshing: false,
			search: '',
			response: [],

			userWalletsListDataState: null,
			currencyListState: null,
			userDataState: null,

			isFirstTime: true,

			selectedPage: 1,
			row: [],

			//For Drawer First Time Close
			isDrawerOpen: false,

			statuses: [
				{ value: R.strings.Please_Select, code: '' },
				{ value: R.strings.Active, code: 1 },
				{ value: R.strings.inActive, code: 0 },
				{ value: R.strings.deleted, code: 9 },
			],
			selectedStatus: R.strings.Please_Select,
			selectedStatusCode: '',

			userNames: [{ value: R.strings.Please_Select }],
			selectedUserName: R.strings.Please_Select,
			selectedUserNameCode: '',

			currencyPairs: [{ value: R.strings.Please_Select }],
			selectedCurrencyPair: R.strings.Please_Select,
			selectedCurrencyPairCode: '',
		};

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

		if (await isInternet()) {

			//to get pair list
			this.props.getArbitrageCurrencyList({});

			//To get all users
			this.props.getUserDataList();

			//To get callTopupHistoryApi 
			this.callgetArbiUserWalletsListApi()
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
	callgetArbiUserWalletsListApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,

				selectedStatus: R.strings.Please_Select,
				selectedStatusCode: '',

				selectedUserName: R.strings.Please_Select,
				selectedUserNameCode: '',

				selectedCurrencyPair: R.strings.Please_Select,
				selectedCurrencyPairCode: '',
			})

			// Close Drawer user press on reset button bcoz display flatlist item on Screen
			this.drawer.closeDrawer();
		}


		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getArbiUserWallets list
			this.props.getArbiUserWalletsList({
				/* 	PageIndex: 1,
					PageSize: AppConfig.pageSize, */
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearArbiUserWalletsData()
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
		if (ArbiUserWalletsListScreen.oldProps !== props) {
			ArbiUserWalletsListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { userWalletsListData, currencyList, userData } = props.data;

			if (userWalletsListData) {
				try {
					//if local userWalletsListData state is null or its not null and also different then new response then and only then validate response.
					if (state.userWalletsListDataState == null || (state.userWalletsListDataState != null && userWalletsListData !== state.userWalletsListDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: userWalletsListData, isList: true })) {

							return {
								...state, userWalletsListDataState: userWalletsListData,
								response: parseArray(userWalletsListData.Data), refreshing: false,
								//row: addPages(userWalletsListData.TotalCount)
							};
						} else {
							return { ...state, userWalletsListDataState: userWalletsListData, response: [], refreshing: false, row: [] };
						}
					}
				} catch (e) {
					return { ...state, response: [], refreshing: false, row: [] };
				}
			}

			if (currencyList) {
				try {
					//if local currencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.currencyListState == null || (state.currencyListState != null && currencyList !== state.currencyListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: currencyList, isList: true })) {
							let res = parseArray(currencyList.ArbitrageWalletTypeMasters);

							for (var walletTypeMaster in res) {
								let item = res[walletTypeMaster]
								item.value = item.CoinName
							}

							let currencyPairs = [
								{ value: R.strings.Please_Select },
								...res
							];

							return { ...state, currencyListState: currencyList, currencyPairs };
						} else {
							return { ...state, currencyListState: currencyList, currencyPairs: [{ value: R.strings.Please_Select }] };
						}
					}
				} catch (e) {
					return { ...state, currencyPairs: [{ value: R.strings.Please_Select }] };
				}
			}

			if (userData) {
				try {
					//if local userData state is null or its not null and also different then new response then and only then validate response.
					if (state.userDataState == null || (state.userDataState != null && userData !== state.userDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ isList: true, response: userData, })) {
							let res = parseArray(userData.GetUserData);

							//for add userData
							for (var keyList in res) {
								 let item = res[keyList];
								 item.value = item.UserName;
							}

							let userNames = [
								{ value: R.strings.Please_Select },
								...res
							];

							return { ...state, userDataState: userData, userNames };
						} else {
							return { ...state, userNames: [{ value: R.strings.Please_Select }], userDataState: userData, };
						}
					}
				} catch (e) {
					return { ...state, userNames: [{ value: R.strings.Please_Select }] };
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

			//To getArbiUserWallets list
			this.props.getArbiUserWalletsList(
				{
					/* 		PageIndex: this.state.selectedPage,
							PageSize: AppConfig.pageSize, */
					Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
					WalletTypeId: this.state.selectedCurrencyPair === R.strings.Please_Select ? '' : this.state.selectedCurrencyPairCode,
					UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
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

				//To get getArbiUserWallets list
				this.props.getArbiUserWalletsList({
					/* 	PageIndex: pageNo,
						PageSize: AppConfig.pageSize, */
					Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
					WalletTypeId: this.state.selectedCurrencyPair === R.strings.Please_Select ? '' : this.state.selectedCurrencyPairCode,
					UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
				});
			}
		}
	}

	// if press on complete button api calling
	onComplete = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getArbiUserWallets list
			this.props.getArbiUserWalletsList({
				/* 		PageIndex: 1,
						PageSize: AppConfig.pageSize, */
				Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
				WalletTypeId: this.state.selectedCurrencyPair === R.strings.Please_Select ? '' : this.state.selectedCurrencyPairCode,
				UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({ selectedPage: 1 })
	}

	navigationDrawer() {
		// for show filter of status, userNames, Currency etc
		return (
			<FilterWidget
				toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				sub_container={{ paddingBottom: 0, }}
				pickers={[
					{
						title: R.strings.status,
						array: this.state.statuses,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
					},
					{
						title: R.strings.User,
						array: this.state.userNames,
						selectedValue: this.state.selectedUserName,
						onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
					},
					{
						title: R.strings.Currency,
						array: this.state.currencyPairs,
						selectedValue: this.state.selectedCurrencyPair,
						onPickerSelect: (index, object) => this.setState({ selectedCurrencyPair: index, selectedCurrencyPairCode: object.Id })
					},
				]}
				onResetPress={this.callgetArbiUserWalletsListApi}
				onCompletePress={this.onComplete}
			/>
		)
	}

	render() {
		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.CoinName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.WalletName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Balance.toString().includes(this.state.search.toString())
			));
		}

		return (
			//DrawerLayout for Filteration
			<Drawer
				ref={component => this.drawer = component}
				drawerWidth={R.dimens.FilterDrawarWidth} type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				drawerContent={this.navigationDrawer()} easingFunc={Easing.ease}>

				<SafeView style={this.styles().container}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.UserWallets} isBack={true}
						nav={this.props.navigation} searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						onBackPress={this.onBackPress}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.userWalletsListFetching && !this.state.refreshing)
							?
							<ListLoader />
							:
							filteredList.length > 0 ?
								<FlatList
									extraData={this.state}
									data={filteredList}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) =>
										<UserWalletsList
											onDetailPress={() => this.props.navigation.navigate('ArbiUserWalletsListDetailScreen', { item })}
											index={index}
											item={item}
											size={this.state.response.length} />
									}
									// assign index as key value to list item
									keyExtractor={(_item, index) => index.toString()}
									// Refresh functionality in list
									refreshControl={<RefreshControl
										refreshing={this.state.refreshing}
										colors={[R.colors.accent]}
										onRefresh={this.onRefresh}
										progressBackgroundColor={R.colors.background}
									/>}
								/>
								:
								// Displayed empty component when no record found 
								<ListEmptyComponent />
						}
						{/*To Set Pagination View  */}
						<View>
							{filteredList.length > 0 && <PaginationWidget
								row={this.state.row}
								selectedPage={this.state.selectedPage}
								onPageChange={(item) => { this.onPageChange(item) }} />}
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
class UserWalletsList extends Component {
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
		let { size, index, item, onDetailPress } = this.props
		let color = R.colors.failRed
		//set status color based on status code
		if (item.Status == 1)
			color = R.colors.successGreen

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin, flex: 1,
				}}>
					<CardView style={{
						flex: 1,
						borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
						borderBottomLeftRadius: R.dimens.margin,
					}} onPress={onDetailPress}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show username,amount and currency */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.CoinName}</Text>
										<TextViewHML style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, }}>{item.IsDefaultWallet == 1 ? ' - ' + R.strings.default : ''}</TextViewHML>
									</View>

									<View style={{ flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
											{(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}
										</Text>
										<ImageTextButton
											icon={R.images.RIGHT_ARROW_DOUBLE} style={{ padding: 0, margin: 0, }}
											iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								{/* User Name */}
								<View style={{ alignItems: 'center', flex: 1, flexDirection: 'row', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Username + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* Wallet Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.WalletName + ': '}</TextViewHML>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, flex: 1, }}>{validateValue(item.WalletName)}</TextViewHML>
								</View>

							</View>

						</View>
						{/* for show status and date time */}
						<View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={validateValue(item.StrStatus)} />

							{/* 	<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.ExpiryDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View> */}
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For ArbitrageUserWalletsReducer Data 
	let data = {
		...state.ArbitrageUserWalletsReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getArbiUserWallets List Action 
		getArbiUserWalletsList: (request) => dispatch(getArbiUserWalletsList(request)),
		//Perform getArbitrageCurrencyList Action 
		getArbitrageCurrencyList: (request) => dispatch(getArbitrageCurrencyList(request)),
		//Perform getUserDataList Action 
		getUserDataList: () => dispatch(getUserDataList()),
		//Perform clearArbiUserWalletsData Action 
		clearArbiUserWalletsData: () => dispatch(clearArbiUserWalletsData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ArbiUserWalletsListScreen);