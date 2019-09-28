import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { connect } from 'react-redux';
import { getCurrencyConfigList, clearCurrencyConfigListData } from '../../../actions/Arbitrage/CurrencyConfigActions';
import { validateResponseNew, isInternet, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';

export class CurrencyConfigListScreen extends Component {
	constructor(props) {
		super(props)

		// Define all initial state
		this.state = {
			CurrencyConfigResponse: [],

			searchInput: '',
			refreshing: false,
			isFirstTime: true,
		}
	}

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()

		// check internet connection
		if (await isInternet()) {
			// Call Currency Config
			this.props.getCurrencyConfigList()
		}
	}

	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Call Get Currency Config List API
			this.props.getCurrencyConfigList();

		} else {
			this.setState({ refreshing: false });
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (CurrencyConfigListScreen.oldProps !== props) {
			CurrencyConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { CurrencyConfigList, } = props.CurrencyConfigResult

			// CurrencyConfigList is not null
			if (CurrencyConfigList) {
				try {
					if (state.CurrencyConfigListState == null || (CurrencyConfigList !== state.CurrencyConfigListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: CurrencyConfigList, isList: true, })) {
							let res = parseArray(CurrencyConfigList.ArbitrageWalletTypeMasters)
							//for add userData
							for (var walleCurtKey in res) {
								let item = res[walleCurtKey];
								if (item.Status === 1) {
									item.statusText = R.strings.enabled
								}
								else
									item.statusText = R.strings.disabled
							}

							return Object.assign({}, state, {
								CurrencyConfigListState: CurrencyConfigList,
								CurrencyConfigResponse: res,
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								CurrencyConfigListState: null,
								CurrencyConfigResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						CurrencyConfigListState: null,
						CurrencyConfigResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}
		return null
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { CurrencyConfigLoading } = this.props.CurrencyConfigResult

		// For searching functionality
		let finalItems = this.state.CurrencyConfigResponse.filter(item => (
			item.CoinName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.statusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.currencyConfig}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(CurrencyConfigLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <CurrencyConfigListItem
									index={index} item={item} size={finalItems.length}
									onPress={() => this.props.navigation.navigate('CurrencyConfigDetailScreen', { item })}
								/>}
								// assign index as key value to Currency Config list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Currency Config FlatList Item
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing} onRefresh={this.onRefresh}
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
									/>
								}
								contentContainerStyle={contentContainerStyle(finalItems)}
								// Displayed empty component when no record found 
								ListEmptyComponent={<ListEmptyComponent />}
							/>
					}
				</View>
			</SafeView>
		)
	}
}

// This Class is used for display record in list
class CurrencyConfigListItem extends Component {

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
		let { onPress, size, item, index } = this.props

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						borderRadius: 0,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,
						flex: 1,
					}} onPress={onPress}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show CoinName,CreatedDate */}
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.CoinName)}</TextViewMR>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<ImageTextButton
											style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
											icon={R.images.IC_TIMER}
											iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
										/>
										<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
										<ImageTextButton
											icon={R.images.RIGHT_ARROW_DOUBLE}
											style={{ padding: 0, margin: 0, }}
											iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								<TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.Description)}</TextViewHML>

								{/* for show DepositionAllow */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.allowDeposition + ': '}</TextViewHML>
									<ImageTextButton
										icon={item.IsDepositionAllow == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
										style={{ padding: 0, margin: 0, }}
										iconStyle={{ width: R.dimens.SMALLEST_ICON_SIZE, height: R.dimens.SMALLEST_ICON_SIZE, tintColor: item.IsDepositionAllow == 1 ? R.colors.successGreen : R.colors.failRed }}
									/>

								</View>

								{/* for show WithdrawalAllow */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.allowWithdrawal + ': '}</TextViewHML>
									<ImageTextButton
										icon={item.IsWithdrawalAllow == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
										style={{ padding: 0, margin: 0, }}
										iconStyle={{ width: R.dimens.SMALLEST_ICON_SIZE, height: R.dimens.SMALLEST_ICON_SIZE, tintColor: item.IsWithdrawalAllow == 1 ? R.colors.successGreen : R.colors.failRed }}
									/>

								</View>

								{/* for show TransactionWallet */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.allowTransaction + ': '}</TextViewHML>
									<ImageTextButton
										icon={item.IsTransactionWallet == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
										style={{ padding: 0, margin: 0, }}
										iconStyle={{ width: R.dimens.SMALLEST_ICON_SIZE, height: R.dimens.SMALLEST_ICON_SIZE, tintColor: item.IsTransactionWallet == 1 ? R.colors.successGreen : R.colors.failRed }}
									/>
								</View>
							</View>
						</View>

						{/* for show status and edit delete */}
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>

							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.statusText}
								onPress={this.props.onChangeStatus}
							/>

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: R.colors.yellow,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation,
											marginRight: R.dimens.widgetMargin,
										}}
									icon={R.images.IC_VIEW_LIST}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onDetailPress} />

								<ImageTextButton
									icon={R.images.IC_EDIT}
									style={
										{
											justifyContent: 'center', alignItems: 'center', backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0, padding: R.dimens.CardViewElivation,
											marginRight: R.dimens.widgetMargin,
										}}
									iconStyle={{ tintColor: 'white', width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, }}
									onPress={this.props.onEdit} />

								<ImageTextButton
									onPress={this.props.onDelete}
									style={
										{
											backgroundColor: R.colors.failRed,
											borderRadius: R.dimens.titleIconHeightWidth, margin: 0,
											padding: R.dimens.CardViewElivation, justifyContent: 'center', alignItems: 'center',
										}}
									icon={R.images.IC_DELETE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								/>
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
		CurrencyConfigResult: state.CurrencyConfigReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Currency Config Action
	getCurrencyConfigList: (payload) => dispatch(getCurrencyConfigList(payload)),
	// Clear Currency Config Action
	clearCurrencyConfigListData: () => dispatch(clearCurrencyConfigListData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyConfigListScreen)