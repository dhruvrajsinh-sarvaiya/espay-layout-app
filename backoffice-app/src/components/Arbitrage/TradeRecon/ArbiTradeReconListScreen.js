import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime, parseFloatVal } from '../../../controllers/CommonUtils';
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
import { getArbiTradeReconList, clearArbiTradeReconData } from '../../../actions/Arbitrage/ArbitrageTradeReconActions';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import { getPairList, getUserDataList } from '../../../actions/PairListAction';
import { DateValidation } from '../../../validations/DateValidation';

class ArbiTradeReconListScreen extends Component {

	constructor(props) {
		super(props);

		// 1 for arbitrage trade recon , 2 for trading trade recon
		let screenType = props.navigation.state.params && props.navigation.state.params.screenType

		// 1 for arbitrage trade recon , 2 for trading trade recon
		let titleScreen

		if (screenType == 1)
			titleScreen = R.strings.arbitrageTradeReconcile
		else if (screenType == 2)
			titleScreen = R.strings.tradeReconcile

		//Define all initial state
		this.state = {
			titleScreen: titleScreen,
			screenType: screenType,
			refreshing: false,
			search: '',
			response: [],

			tradeReconListDataState: null,
			pairListState: null,
			userDataState: null,

			isFirstTime: true,

			selectedPage: 1,
			row: [],

			//For Drawer First Time Close
			isDrawerOpen: false,

			userNames: [{ value: R.strings.Please_Select }],
			selectedUserName: R.strings.Please_Select,
			selectedUserNameCode: '',

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),

			lpTypes: [
				{ value: R.strings.Please_Select, code: '' },
				{ value: 'Binance', code: 9 },
				{ value: 'Bitrex', code: 10 },
				{ value: 'TradeSatoshi', code: 11 },
				{ value: 'Poloniex', code: 12 },
				{ value: 'Coinbase', code: 13 },
				{ value: 'ERC20Withdraw', code: 14 },
				{ value: 'Twilio', code: 15 }
			],
			selectedLPType: R.strings.Please_Select,
			selectedLPTypeCode: '',

			orderTypes: [{ value: R.strings.Please_Select }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
			selectedOrderType: R.strings.Please_Select,
			selectedOrderTypeCode: '',

			currencyPairs: [{ value: R.strings.all }],
			selectedCurrencyPair: R.strings.all,

			TrnNo: '',

			statuses: [
				{ value: R.strings.Please_Select, code: '' },
				{ value: R.strings.Success, code: 1 },
				{ value: R.strings.OperatorFail, code: 2 },
				{ value: R.strings.SystemFail, code: 3 },
				{ value: R.strings.Hold, code: 4 },
				{ value: R.strings.Inactive, code: 9 },
			],
			selectedStatus: R.strings.Please_Select,
			selectedStatusCode: '',

			processStatuses: [
				{ value: R.strings.Please_Select, code: '' },
				{ value: R.strings.inProcess, code: 0 },
				{ value: R.strings.processed, code: 1 },
			],
			selectedProcessStatus: R.strings.Please_Select,
			selectedProcessStatusCode: '',

			marketTypes: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.limit, code: 'Limit' }, { value: R.strings.market, code: 'Market' }, { value: R.strings.stopLimit, code: 'STOP_Limit' }, { value: R.strings.stop, code: 'STOP' }],
			selectedMarketType: R.strings.Please_Select,
			selectedMarketTypeCode: '',

			IsMargin: 0,
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

		if (await isInternet()) {

			//for Data clear 
			this.props.clearArbiTradeReconData()

			//to get pair list
			this.props.getCurrencyPairs({});

			//To get all users
			this.props.getUserDataList();

			//To get callTopupHistoryApi 
			this.callgetArbiTradeReconListApi()
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
	callgetArbiTradeReconListApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				selectedLPType: R.strings.Please_Select,
				selectedLPTypeCode: '',
				selectedOrderType: R.strings.Please_Select,
				selectedOrderTypeCode: '',
				selectedCurrencyPair: R.strings.all,
				TrnNo: '',
				selectedStatus: R.strings.Please_Select,
				selectedStatusCode: '',
				selectedProcessStatus: R.strings.Please_Select,
				selectedProcessStatusCode: '',
				selectedMarketType: R.strings.Please_Select,
				selectedMarketTypeCode: '',
				selectedUserName: R.strings.Please_Select,
				selectedUserNameCode: '',
			})
		}

		// Close Drawer user press on reset button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getArbiTradeReconList list
			this.props.getArbiTradeReconList({
				PageIndex: 1,
				PageSize: AppConfig.pageSize,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				screenType: this.state.screenType
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearArbiTradeReconData()
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
		if (ArbiTradeReconListScreen.oldProps !== props) {
			ArbiTradeReconListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { tradeReconListData, pairList, userData } = props.data;

			if (tradeReconListData) {
				try {
					//if local tradeReconListData state is null or its not null and also different then new response then and only then validate response.
					if (state.tradeReconListDataState == null || (state.tradeReconListDataState != null && tradeReconListData !== state.tradeReconListDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: tradeReconListData, isList: true })) {

							let res = parseArray(tradeReconListData.Response);

							//for add status static
							for (var keyData in res) {
								let item = res[keyData];

								if (item.IsCancelled == 1)
									item.statusStatic = R.strings.Cancelled
								else if (item.StatusCode == 1)
									item.statusStatic = R.strings.Success
								else if (item.StatusCode == 2)
									item.statusStatic = R.strings.OperatorFail
								else if (item.StatusCode == 3)
									item.statusStatic = R.strings.SystemFail
								else if (item.StatusCode == 4)
									item.statusStatic = R.strings.Active
								else if (item.StatusCode == 9)
									item.statusStatic = R.strings.Inactive
							}

							return {
								...state, tradeReconListDataState: tradeReconListData,
								response: res, refreshing: false,
								row: addPages(tradeReconListData.TotalCount)
							};
						} else {
							return { ...state, tradeReconListDataState: tradeReconListData, response: [], refreshing: false, row: [] };
						}
					}
				} catch (e) {

					return { ...state, response: [], refreshing: false, row: [] };
				}
			}

			if (pairList) {
				try {
					//if local pairList state is null or its not null and also different then new response then and only then validate response.
					if (state.pairListState == null || (state.pairListState != null && pairList !== state.pairListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: pairList, isList: true })) {
							let res = parseArray(pairList.Response);

							for (var dataPairListKey in res) {
								let item = res[dataPairListKey]
								item.value = item.PairName
							}

							let currencyPairs = [
								{ value: R.strings.all },
								...res
							];

							return { ...state, pairListState: pairList, currencyPairs };
						} else {
							return { ...state, pairListState: pairList, currencyPairs: [{ value: R.strings.all }] };
						}
					}
				} catch (e) {
					return { ...state, currencyPairs: [{ value: R.strings.all }] };
				}
			}

			if (userData) {
				try {
					//if local userData state is null or its not null and also different then new response then and only then validate response.
					if (state.userDataState == null || (state.userDataState != null && userData !== state.userDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: userData, isList: true })) {
							let res = parseArray(userData.GetUserData);

							//for add userData
							for (var userDatakey in res) {
								let item = res[userDatakey];
								item.value = item.UserName;
							}

							let userNames = [
								{ value: R.strings.Please_Select },
								...res
							];

							return { ...state, userNames, userDataState: userData, };
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

			//To getArbiTradeReconList list
			this.props.getArbiTradeReconList(
				{
					PageIndex: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
					ToDate: this.state.ToDate, TrnNo: this.state.TrnNo,
					FromDate: this.state.FromDate,
					Trade: this.state.selectedOrderType === R.strings.Please_Select ? '' : this.state.selectedOrderTypeCode,
					MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
					Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
					Pair: this.state.selectedCurrencyPair === R.strings.all ? '' : this.state.selectedCurrencyPair,
					LPType: this.state.selectedLPType === R.strings.Please_Select ? '' : this.state.selectedLPTypeCode,
					IsMargin: this.state.IsMargin,
					IsProcessing: this.state.selectedProcessStatus === R.strings.Please_Select ? '' : this.state.selectedProcessStatusCode,
					MarketType: this.state.selectedMarketType === R.strings.Please_Select ? '' : this.state.selectedMarketTypeCode,
					screenType: this.state.screenType
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

				//To get getArbiTradeReconList list
				this.props.getArbiTradeReconList({
					PageIndex: pageNo,
					MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					PageSize: AppConfig.pageSize, TrnNo: this.state.TrnNo,
					Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
					Trade: this.state.selectedOrderType === R.strings.Please_Select ? '' : this.state.selectedOrderTypeCode,
					MarketType: this.state.selectedMarketType === R.strings.Please_Select ? '' : this.state.selectedMarketTypeCode,
					LPType: this.state.selectedLPType === R.strings.Please_Select ? '' : this.state.selectedLPTypeCode,
					IsMargin: this.state.IsMargin,
					IsProcessing: this.state.selectedProcessStatus === R.strings.Please_Select ? '' : this.state.selectedProcessStatusCode,
					Pair: this.state.selectedCurrencyPair === R.strings.all ? '' : this.state.selectedCurrencyPair,
					screenType: this.state.screenType
				});
			}
		}
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
			this.props.getArbiTradeReconList({
				PageIndex: 1, PageSize: AppConfig.pageSize,
				FromDate: this.state.FromDate, ToDate: this.state.ToDate,
				MemberID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
				TrnNo: this.state.TrnNo,
				Status: this.state.selectedStatus === R.strings.Please_Select ? '' : this.state.selectedStatusCode,
				Trade: this.state.selectedOrderType === R.strings.Please_Select ? '' : this.state.selectedOrderTypeCode,
				MarketType: this.state.selectedMarketType === R.strings.Please_Select ? '' : this.state.selectedMarketTypeCode,
				LPType: this.state.selectedLPType === R.strings.Please_Select ? '' : this.state.selectedLPTypeCode,
				Pair: this.state.selectedCurrencyPair === R.strings.all ? '' : this.state.selectedCurrencyPair,
				IsProcessing: this.state.selectedProcessStatus === R.strings.Please_Select ? '' : this.state.selectedProcessStatusCode,
				screenType: this.state.screenType,
				IsMargin: this.state.IsMargin,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({ selectedPage: 1 })
	}

	navigationDrawer() {
		// for show filter of fromdate, todate,transactionNo, userNames, lpTypes, orderType, currencyPair   and user data etc
		return (
			<FilterWidget
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })} FromDate={this.state.FromDate}
				ToDate={this.state.ToDate} toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				sub_container={{ paddingBottom: 0, }}
				textInputStyle={{ marginTop: 0, marginBottom: 0, }}
				textInputs={[
					{
						placeholder: R.strings.transactionNo,
						returnKeyType: "done",
						multiline: false,
						keyboardType: 'numeric',
						onlyDigit: true,
						header: R.strings.transactionNo,
						onChangeText: (text) => { this.setState({ TrnNo: text }) },
						value: this.state.TrnNo,
					}
				]}

				pickers={[
					{
						title: R.strings.User,
						array: this.state.userNames,
						selectedValue: this.state.selectedUserName,
						onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
					},
					{
						title: R.strings.lpType,
						array: this.state.lpTypes,
						selectedValue: this.state.selectedLPType,
						onPickerSelect: (index, object) => this.setState({ selectedLPType: index, selectedLPTypeCode: object.code })
					},
					{
						title: R.strings.orderType,
						array: this.state.orderTypes,
						selectedValue: this.state.selectedOrderType,
						onPickerSelect: (index, object) => this.setState({ selectedOrderType: index, selectedOrderTypeCode: object.code })
					},
					{
						title: R.strings.currencyPair,
						array: this.state.currencyPairs,
						selectedValue: this.state.selectedCurrencyPair,
						onPickerSelect: (index) => this.setState({ selectedCurrencyPair: index })
					},
					{
						title: R.strings.status,
						array: this.state.statuses,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
					},
					{
						title: R.strings.processstatus,
						array: this.state.processStatuses,
						selectedValue: this.state.selectedProcessStatus,
						onPickerSelect: (index, object) => this.setState({ selectedProcessStatus: index, selectedProcessStatusCode: object.code })
					},
					{
						title: R.strings.marketType,
						array: this.state.marketTypes,
						selectedValue: this.state.selectedMarketType,
						onPickerSelect: (index, object) => this.setState({ selectedMarketType: index, selectedMarketTypeCode: object.code })
					},
				]}
				onResetPress={this.callgetArbiTradeReconListApi}
				onCompletePress={this.onComplete}
			/>
		)
	}

	render() {
		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.TrnNo.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			//DrawerLayout for Filteration
			<Drawer
				ref={component => this.drawer = component}
				drawerPosition={Drawer.positions.Right}
				drawerWidth={R.dimens.FilterDrawarWidth}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				drawerContent={this.navigationDrawer()}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay} easingFunc={Easing.ease}>

				<SafeView style={this.styles().container}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set Progress bar as per our theme */}
					<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.lpChargeConfigAddEditDeleteFetching} />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={this.state.titleScreen}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.tradeReconListFetching && !this.state.refreshing)
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
										<ArbiTradeReconListItem
											index={index}
											item={item}
											onDetailPress={() => this.props.navigation.navigate('ArbiTradeReconListDetailScreen', { item, titleScreen: this.state.titleScreen })}
											onAction={() => this.props.navigation.navigate('ArbiTradeReconSetScreen', { item, onSuccess: this.callgetArbiTradeReconListApi, screenType: this.state.screenType })}
											size={this.state.response.length} />
									}
									// assign index as key value to Withdraw Report list item
									keyExtractor={(_item, index) => index.toString()}
									// Refresh functionality in list
									refreshControl={<RefreshControl
										refreshing={this.state.refreshing}
										colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
										onRefresh={this.onRefresh}
									/>}
								/>
								:
								// Displayed empty component when no record found 
								<ListEmptyComponent />
						}
						{/*To Set Pagination View  */}
						<View>
							{filteredList.length > 0 && <PaginationWidget row={this.state.row} onPageChange={(item) => { this.onPageChange(item) }} selectedPage={this.state.selectedPage} />}
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

//for the dynamic actions 
const actionsTypes = [
	{ value: R.strings.successAndDebit, code: 2 },
	{ value: R.strings.Success, code: 3 },
	{ value: R.strings.inProcess, code: 4 },
	{ value: R.strings.fail, code: 5 },
	{ value: R.strings.cancel, code: 8 },
	{ value: R.strings.forceCancel, code: 9 },
	{ value: R.strings.Inactive, code: 10 },
	{ value: R.strings.active, code: 11 },
	{ value: R.strings.releaseInProcess, code: 12 },
	{ value: R.strings.reInitialize, code: 13 }
]


// This Class is used for display record in list
class ArbiTradeReconListItem extends Component {
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

		let statusColor = R.colors.accent

		// Cancelled
		if (item.IsCancelled == 1)
			statusColor = R.colors.failRed
		// Success
		else if (item.StatusCode == 1)
			statusColor = R.colors.successGreen
		// OperatorFail = 2, SystemFail = 3, Inactive = 9
		else if (item.StatusCode == 2 || item.StatusCode == 3 || item.StatusCode == 9)
			statusColor = R.colors.failRed
		// Hold
		else if (item.StatusCode == 4)
			statusColor = R.colors.yellow

		let dynamicActions = []

		//for show action button if actions available
		if (item.ActionStage) {
			let Actions = item.ActionStage.split(',')
			Actions.map((action, key) => {
				actionsTypes.map((act, key1) => {
					if (action == act.code) {
						if (!(act.code == 12 && item.IsProcessing == 0 ||
							act.code == 13 && item.IsAPITrade == 0))
							dynamicActions.push(act)
					}
				})
			})
		}

		return (

			// flatlist item animation
			<AnimatableItem>
				<View
					style={{
						marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
						marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
						flex: 1,
						marginLeft: R.dimens.widget_left_right_margin,
						marginRight: R.dimens.widget_left_right_margin,
					}}>
					<CardView style={{
						flex: 1,
						borderRadius: 0,
						borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
					}}
						onPress={this.props.onDetailPress}
					>

						<View style={{ flexDirection: 'row' }}>
							{/* for show PairName image or WalletTypeName  */}
							<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
								{/*  PairName icon  */}
								<ImageViewWidget url={!isEmpty(item.PairName) ? item.PairName.split('_')[0] : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
							</View>

							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									{/* for show PairName , OrderType ,market type */}
									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
										<Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.PairName) ? item.PairName.replace('_', '/') + '  ' : '-'}</Text>
										<Text style={{ fontSize: R.dimens.smallestText, color: item.Type.toLowerCase() === 'buy' ? R.colors.successGreen : R.colors.failRed, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.OrderType) + ' - ' + validateValue(item.Type)}</Text>
									</View>

									{/* for show ActionButton , Detail icon */}
									<View style={{ flexDirection: 'row', alignItems: 'center', }}>
										{
											dynamicActions.length > 0 &&
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
												onPress={this.props.onAction} />
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

								{/* for show UserName, TrnNo  */}
								<View style={{ flex: 1, }}>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{validateValue(item.UserName)}</TextViewHML>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Trn_No + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.TrnNo)}</TextViewHML>
									</View>
								</View>
							</View>
						</View>

						{/* for show Price, Amount and Total */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.price}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
									{(parseFloatVal(item.Price).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Price).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Amount}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.total}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.Total).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Total).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and date */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={statusColor}
								value={item.statusStatic}></StatusChip>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }} icon={R.images.IC_TIMER}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.DateTime, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For ArbitrageTradeReconReducer Data 
	let data = {
		...state.ArbitrageTradeReconReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getArbiTradeReconList List Action 
		getArbiTradeReconList: (request) => dispatch(getArbiTradeReconList(request)),
		//Perform getCurrencyPairs Action 
		getCurrencyPairs: (request) => dispatch(getPairList(request)),
		//Perform getUserDataList Action 
		getUserDataList: () => dispatch(getUserDataList()),
		//Perform clearArbiTradeReconData Action 
		clearArbiTradeReconData: () => dispatch(clearArbiTradeReconData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ArbiTradeReconListScreen);