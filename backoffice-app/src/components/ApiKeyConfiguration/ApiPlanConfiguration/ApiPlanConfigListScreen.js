import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray, parseFloatVal, getPlanValidity } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { clearApiPlanConfigData, getRestMethodReadOnly, getRestMethodFullAccess } from '../../../actions/ApiKeyConfiguration/ApiPlanConfigActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import { getCurrencyList, getApiPlanConfigList } from '../../../actions/PairListAction';

export class ApiPlanConfigListScreen extends Component {
	constructor(props) {
		super(props);

		// Define all initial state
		this.state = {
			ReadOnlyAPI: [],
			FullAccessAPI: [],
			Currency: [],
			ApiPlanConfigResponse: [],
			ApiPlanConfigListState: null,

			statusId: 0,
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
			// Api Plan Configuration List Api Call
			this.props.getApiPlanConfigList()

			// Call Rest Method Read Only Api
			this.props.getRestMethodReadOnly()
			// Call Rest Method Full Access Api
			this.props.getRestMethodFullAccess()
			// Call List Currency Api
			this.props.getCurrencyList()
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearApiPlanConfigData()
	}

	// for swipe to refresh functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (needUpdate && await isInternet()) {

			// Call Get Withdraw Report API
			this.props.getApiPlanConfigList();

		} else {
			this.setState({ refreshing: false });
		}
	}

	onAddApiPlan = () => {
		let { navigate } = this.props.navigation
		navigate('AddApiPlanConfigScreen', {
			onRefresh: this.onRefresh,
			ReadOnlyAPI: this.state.ReadOnlyAPI,
			FullAccessAPI: this.state.FullAccessAPI,
			Currency: this.state.Currency
		})
	}

	onEditApiPlan = (item) => {
		this.props.navigation.navigate('EditApiPlanConfigScreen', {
			item,
			onRefresh: this.onRefresh,
			ReadOnlyAPI: this.state.ReadOnlyAPI,
			FullAccessAPI: this.state.FullAccessAPI,
			Currency: this.state.Currency
		})
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (ApiPlanConfigListScreen.oldProps !== props) {
			ApiPlanConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			// Get all upadated field of particular actions
			const { ApiPlanConfigList, RestMethodReadOnly, RestMethodFullAccess, CurrencyListData } = props.ApiPlanConfigResult

			// ApiPlanConfigList is not null
			if (ApiPlanConfigList) {
				try {
					if (state.ApiPlanConfigListState == null || (ApiPlanConfigList !== state.ApiPlanConfigListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: ApiPlanConfigList, isList: true, })) {

							return Object.assign({}, state, {
								ApiPlanConfigListState: ApiPlanConfigList,
								ApiPlanConfigResponse: parseArray(ApiPlanConfigList.Response),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ApiPlanConfigListState: null,
								ApiPlanConfigResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ApiPlanConfigListState: null,
						ApiPlanConfigResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// RestMethodReadOnly is not null
			if (RestMethodReadOnly) {
				try {
					//if local RestMethodReadOnly state is null or its not null and also different then new response then and only then validate response.
					if (state.RestMethodReadOnlyState == null || (state.RestMethodReadOnlyState != null && RestMethodReadOnly !== state.RestMethodReadOnlyState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: RestMethodReadOnly, isList: true })) {
							let res = parseArray(RestMethodReadOnly.Response);

							return { ...state, RestMethodReadOnlyState: RestMethodReadOnly, ReadOnlyAPI: res };
						} else {
							return { ...state, RestMethodReadOnlyState: null, ReadOnlyAPI: [] };
						}
					}
				} catch (e) {
					return { ...state, ReadOnlyAPI: [] };
				}
			}

			// RestMethodFullAccess is not null
			if (RestMethodFullAccess) {
				try {
					//if local RestMethodFullAccess state is null or its not null and also different then new response then and only then validate response.
					if (state.RestMethodFullAccessState == null || (state.RestMethodFullAccessState != null && RestMethodFullAccess !== state.RestMethodFullAccessState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: RestMethodFullAccess, isList: true })) {
							let res = parseArray(RestMethodFullAccess.Response);

							return { ...state, RestMethodFullAccessState: RestMethodFullAccess, FullAccessAPI: res };
						} else {
							return { ...state, RestMethodFullAccessState: null, FullAccessAPI: [] };
						}
					}
				} catch (e) {
					return { ...state, FullAccessAPI: [] };
				}
			}

			if (CurrencyListData) {
				try {
					//if local currencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.CurrencyListDataState == null || (state.CurrencyListDataState != null && CurrencyListData !== state.CurrencyListDataState)) {

						//if currencyList response is success then store array list else store empty list
						if (validateResponseNew({ response: CurrencyListData, isList: true })) {
							let res = parseArray(CurrencyListData.Response);

							//for add CurrencyListData
							for (var keyPairList in res) {
								let item = res[keyPairList];
								item.value = item.SMSCode;
							}

							let currencies = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, Currency: currencies, CurrencyListDataState: CurrencyListData };
						} else {
							return { ...state, Currency: [{ value: R.strings.selectCurrency }], CurrencyListDataState: null };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}

		}
		return null
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ApiPlanConfigListLoading, } = this.props.ApiPlanConfigResult

		//For Searching Functionality
		let finalItems = this.state.ApiPlanConfigResponse.filter(item => (
			item.PlanName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Priority.toString().includes(this.state.searchInput) ||
			item.Price.toFixed(8).includes(this.state.searchInput) ||
			item.Charge.toFixed().includes(this.state.searchInput)
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.apiPlanConfiguration}
					nav={this.props.navigation}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.onAddApiPlan()}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				<View style={{ flex: 1, }}>
					{
						(ApiPlanConfigListLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) =>
									<ApiPlanConfigListItem
										index={index}
										item={item}
										size={finalItems.length}
										onEdit={() => this.onEditApiPlan(item)}
										onPress={() => this.props.navigation.navigate('ApiPlanConfigDetailScreen', { item })}
									/>}
								// assign index as key value to Withdraw Report list item
								keyExtractor={(_item, index) => index.toString()}
								// Refresh functionality in api plan configuration
								refreshControl={
									<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={() => this.onRefresh(true, true)}
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
class ApiPlanConfigListItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		// If new props and old props are equal then it will return false otherwise it will return true
		if (this.props.item === nextProps.item)
			return false
		return true
	}

	render() {
		let { size, index, item, onPress, onEdit } = this.props

		// Get Plan Validity in Year/Month/Days
		let planValidity = getPlanValidity(item.PlanValidityType)

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
						flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
					}} onPress={onPress}>

						<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
								{/* Api Plan Name and Recursive */}
								<TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.PlanName}</TextViewMR>
								<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.accent }}>{item.IsPlanRecursive == 1 ? ' - ' + R.strings.recursive : ''}</TextViewHML>
							</View>

							{/* Year and Detail Button */}
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.yellow }}>{validateValue(item.PlanValidity + ' ' + planValidity)}</TextViewHML>
								<ImageTextButton
									style={{ margin: 0 }}
									icon={R.images.RIGHT_ARROW_DOUBLE}
									iconStyle={{
										width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary
									}}
								/>
							</View>
						</View>

						{/* Priority, Price and Charge */}
						<View style={{ flex: 1, flexDirection: 'row', }}>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.priority}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{validateValue(item.Priority)}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Price}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.Price).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Price).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Charge}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.Charge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Charge).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

						</View>

						{/* for show status and recon icon */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.Status == 1 ? R.strings.active : R.strings.inActive}
							/>

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
								icon={R.images.IC_EDIT}
								iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								onPress={onEdit} />
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get api plan configuration data from reducer
		ApiPlanConfigResult: state.ApiPlanConfigReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Api Plan Config List Action
	getApiPlanConfigList: () => dispatch(getApiPlanConfigList()),
	// Clear Api Plan Config Action
	clearApiPlanConfigData: () => dispatch(clearApiPlanConfigData()),
	// Perform Rest Method Read Only Action
	getRestMethodReadOnly: () => dispatch(getRestMethodReadOnly()),
	// Perform Rest Method Full Access Action
	getRestMethodFullAccess: () => dispatch(getRestMethodFullAccess()),
	//for Currency list action 
	getCurrencyList: () => dispatch(getCurrencyList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiPlanConfigListScreen)