import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import R from '../../../native_theme/R';
import { connect } from 'react-redux';
import { changeTheme, parseArray, parseFloatVal, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { getLeverageConfigList, deleteLeverageConfigData, clearLeverageConfigData } from '../../../actions/Margin/LeverageConfigActions';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { getWalletType } from '../../../actions/PairListAction';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ListLoader from '../../../native_theme/components/ListLoader';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import SafeView from '../../../native_theme/components/SafeView';

export class LeverageConfigListScreen extends Component {
	constructor(props) {
		super(props);
		// create reference
		this.drawer = React.createRef();

		// Bind Method
		this.onBackPress = this.onBackPress.bind(this);

		//Define All State initial state
		this.state = {
			Status: [
				{ value: R.strings.select_status },
				{ Code: 0, value: R.strings.Disable },
				{ Code: 1, value: R.strings.Enable },
			],
			Currency: [],
			LeverageConfigListResponse: [],

			searchInput: '',
			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false, // First Time Drawer is Closed

			StatusId: 0,
			WalletTypeId: 0,
			selectedPage: 1,
			selectedCurrency: R.strings.selectCurrency,
			selectedStatus: R.strings.select_status,
		}

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}


	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Leverage Configuration List Api 
			this.props.getLeverageConfigList()
			// Call Get Wallet List Api
			this.props.getWalletType()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	// Api Call when press on complete button
	onCompletePress = async () => {

		this.drawer.closeDrawer();
		// Close Drawer user press on Complete button bcoz display flatlist item on Screen

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Leverage Report
			let request = {
				WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
				Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
			}

			//Call Get Leverage Report API
			this.props.getLeverageConfigList(request);

		} else {
			this.setState({ refreshing: false });
		}
		//If Filter from Complete Button Click then empty searchInput
		this.setState({ searchInput: '' })
	}

	// Reset Filter
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer();

		// set Initial State
		this.setState({
			selectedStatus: R.strings.select_status,
			selectedCurrency: R.strings.selectCurrency,
			searchInput: '',
			WalletTypeId: 0,
			StatusId: 0,
		})

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Leverage Config
			let request = {
				WalletTypeId: '',
				Status: '',
			}
			//Call Get Leverage Config API
			this.props.getLeverageConfigList(request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });
		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			// Bind request for Leverage Config
			let request = {
				WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
				Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
			}

			//Call Get Leverage Configuration API
			this.props.getLeverageConfigList(request);

		} else {
			this.setState({ refreshing: false });
		}
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

	onDeletePress = (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				// Delete Levaerage Config Data Api Call
				this.props.deleteLeverageConfigData({ Id: item.Id })
			}
		}, R.strings.cancel, () => { })
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (LeverageConfigListScreen.oldProps !== props) {
			LeverageConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { LeverageConfigList, WalletDataList, } = props.LeverageConfigResult;

			// LeverageConfigList is not null
			if (LeverageConfigList) {
				try {
					if (state.LeverageConfigList == null || (state.LeverageConfigList != null && LeverageConfigList !== state.LeverageConfigList)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: LeverageConfigList, isList: true })) {

							return Object.assign({}, state, {
								LeverageConfigList,
								LeverageConfigListResponse: parseArray(LeverageConfigList.Data),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								LeverageConfigList: null,
								refreshing: false,
								LeverageConfigListResponse: [],
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						LeverageConfigList: null,
						LeverageConfigListResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							// Parsing data
							let res = parseArray(WalletDataList.Types);

							// fetching only TypeName from data
							for (var typename in res) {
								let item = res[typename]
								item.value = item.TypeName
							}

							let walletNames = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, WalletDataList, Currency: walletNames };
						} else {
							return { ...state, WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, _prevState) {
		const { DelLeverageConfigData, } = this.props.LeverageConfigResult;

		// compare response with previous response
		if (DelLeverageConfigData !== prevProps.LeverageConfigResult.DelLeverageConfigData) {

			// DelLeverageConfigData is not null
			if (DelLeverageConfigData) {
				try {
					// if local DelLeverageConfigData state is null or its not null and also different then new response then and only then validate response.
					if (this.state.DelLeverageConfigData == null || (this.state.DelLeverageConfigData != null && DelLeverageConfigData !== this.state.DelLeverageConfigData)) {
						//handle response of API
						if (validateResponseNew({ response: DelLeverageConfigData })) {
							//Display Success Message and Refresh Wallet User List
							showAlert(R.strings.Success + '!', DelLeverageConfigData.ReturnMsg, 0, async () => {
								this.setState({ DelLeverageConfigData })

								//Clear Leverage Config Data 
								this.props.clearLeverageConfigData();

								// Call Leverage Configuration List Api 
								this.props.getLeverageConfigList()

							});
						}
					}
				} catch (error) {
					this.setState({ DelLeverageConfigData: null })
					//Clear Leverage Config Data 
					this.props.clearLeverageConfigData();
				}
			}
		}
	}

	// Drawer Navigation
	navigationDrawer() {

		return (
			// for show filter of fromdate, todate,currency and status data
			<FilterWidget
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				comboPickerStyle={{ marginTop: 0 }}
				pickers={[
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.selectedCurrency,
						onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.ID })
					},
					{
						title: R.strings.Status,
						array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, StatusId: object.Code })
					}
				]}
			/>
		)
	}

	// Render Right Side Menu For Add Staking Configuration , Filters for Staking list 
	rightMenuRender = () => {
		return (
			<View style={{ flexDirection: 'row' }}>
				<ImageTextButton
					icon={R.images.IC_PLUS}
					style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
					iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
					onPress={() => this.props.navigation.navigate('AddEditLeverageConfigScreen', { onRefresh: this.onRefresh, Currency: this.state.Currency, })} />
				<ImageTextButton
					icon={R.images.FILTER}
					style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
					iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
					onPress={() => this.drawer.openDrawer()} />
			</View>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { LeverageConfigListLoading, DelLeverageConfigLoading } = this.props.LeverageConfigResult;

		// for searching functionality
		let finalItems = this.state.LeverageConfigListResponse.filter(item => (
			item.LeveragePer.toString().includes(this.state.searchInput) ||
			item.SafetyMarginPer.toString().includes(this.state.searchInput) ||
			item.MarginChargePer.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Leverage Configuration Filteration
			<Drawer
				ref={cmpDrawer => this.drawer = cmpDrawer}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerContent={this.navigationDrawer()}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				easingFunc={Easing.ease}>
				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						rightMenuRenderChilds={this.rightMenuRender()}
						title={R.strings.leverageConfiguration}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					{/* Progress bar */}
					<ProgressDialog isShow={DelLeverageConfigLoading} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(LeverageConfigListLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) => <LeverageConfigListItem
										index={index}
										item={item}
										size={finalItems.length}
										onEdit={() => this.props.navigation.navigate('AddEditLeverageConfigScreen', { onRefresh: this.onRefresh, item, Currency: this.state.Currency })}
										onDelete={() => this.onDeletePress(item)}
									/>}
									// assign index as key valye to Withdrawal list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In Withdrawal FlatList Item
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]}
											progressBackgroundColor={R.colors.background}
											refreshing={this.state.refreshing}
											onRefresh={() => this.onRefresh(true, true)}
										/>
									}
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
class LeverageConfigListItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		// Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item)
			return false
		return true
	}

	render() {
		let { size, index, item, onEdit, onDelete } = this.props

		//To Display various Status Color in ListView
		let color = R.colors.accent;

		if (item.Status === 0) color = R.colors.textSecondary
		if (item.Status === 1) color = R.colors.successGreen
		if (item.Status === 3) color = R.colors.failRed
		if (item.Status === 6) color = R.colors.accent
		if (item.Status === 9) color = R.colors.failRed

		return (
			// for Flatlist item animation

			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
						flex: 1,
						borderRadius: 0,
					}}>

						<View style={{ flexDirection: 'row' }}>
							<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
								{/* Currency Image */}
								<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />
							</View>

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* Currency */}
								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.WalletTypeName)}</Text>

								{/* Deduction Type */}
								<View style={{ flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.deductionType + ': '}</TextViewHML>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{validateValue(item.LeverageChargeDeductionTypeName)}</TextViewHML>
								</View>

								{/* Auto Approve Text */}
								<View style={{ flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.autoApprove + ': '}</TextViewHML>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{item.IsAutoApprove == 1 ? R.strings.yes_text : R.strings.no_text}</TextViewHML>
								</View>

							</View>
						</View>

						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

							{/* Leverage Per */}
							<View style={{ width: '30%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.leverage}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
									{(item.LeveragePer !== 'NaN' ? validateValue(item.LeveragePer + 'X') : '-')}
								</TextViewHML>
							</View>

							{/* Safety Margin */}
							<View style={{ width: '40%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.safetyMargin}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.SafetyMarginPer).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.SafetyMarginPer).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							{/* Margin Charge */}
							<View style={{ width: '30%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.marginCharge}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.MarginChargePer).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.MarginChargePer).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>


						{/* for show status and edit, delete icon */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StrStatus ? item.StrStatus : '-'} />

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: R.colors.accent,
										borderRadius: R.dimens.titleIconHeightWidth,
										margin: 0,
										padding: R.dimens.CardViewElivation,
										marginRight: R.dimens.widgetMargin,
									}}
									icon={R.images.IC_EDIT}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={onEdit} />

								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: R.colors.failRed,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation
										}}
									icon={R.images.IC_DELETE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={onDelete} />
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
		// get leverage configuration data from reducer
		LeverageConfigResult: state.LeverageConfigReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Leverage Config List Action
	getLeverageConfigList: (payload) => dispatch(getLeverageConfigList(payload)),
	// To Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// To Perform Delete Leverage Configuration Data Action
	deleteLeverageConfigData: (payload) => dispatch(deleteLeverageConfigData(payload)),
	// To Perform Clear Leverage Config Data
	clearLeverageConfigData: () => dispatch(clearLeverageConfigData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeverageConfigListScreen);