import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, addPages, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getArbiPairConfigList, clearArbiPairConfigData } from '../../../actions/Arbitrage/ArbitragePairConfigurationActions';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';

class ArbiPairConfigListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],

			pairConfigListDataState: null,

			isFirstTime: true,

			selectedPage: 1,
			row: [],
		};
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// Check internet is Available or not
		if (await isInternet()) {
			//To get callTopupHistoryApi 
			this.callgetArbiPairConfigListApi()
		}
	}

	//api call for list 
	callgetArbiPairConfigListApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
			})
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getArbiPairConfigList list
			this.props.getArbiPairConfigList({
				Page: 1,
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
		this.props.clearArbiPairConfigData()
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
		if (ArbiPairConfigListScreen.oldProps !== props) {
			ArbiPairConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { pairConfigListData } = props.data;

			if (pairConfigListData) {
				try {
					//if local lpChargeConfigListData state is null or its not null and also different then new response then and only then validate response.
					if (state.pairConfigListDataState == null || (state.pairConfigListDataState != null && pairConfigListData !== state.pairConfigListDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: pairConfigListData, isList: true })) {

							let res = parseArray(pairConfigListData.Response)

							//for add status static
							for (var keyDataKey in res) {
								let item = res[keyDataKey];
								if (item.Status == 1)
									item.statusStatic = R.strings.Active
								else
									item.statusStatic = R.strings.Inactive
							}

							return {
								...state,
								pairConfigListDataState: pairConfigListData,
								response: res, refreshing: false,
								row: addPages(pairConfigListData.Count)
							};
						} else {
							return {
								...state,
								pairConfigListDataState: pairConfigListData,
								response: [],
								refreshing: false,
								row: []
							};
						}
					}
				} catch (e) {
					return { ...state, response: [], refreshing: false, row: [] };
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

			//To getArbiPairConfigList list
			this.props.getArbiPairConfigList(
				{
					Page: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
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

				//To get getArbiPairConfigList list
				this.props.getArbiPairConfigList({
					Page: pageNo,
					PageSize: AppConfig.pageSize,
				});
			}
		}
	}

	render() {
		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.MarketName.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (

			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.arbitragePairConfig}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('ArbiPairConfigAddEditScreen', { activityName: 'Add', onSuccess: this.callgetArbiPairConfigListApi })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(this.props.data.pairConfigListFetching && !this.state.refreshing)
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
									<ArbiPairConfigListItem
										index={index}
										item={item}
										onDetailPress={() => this.props.navigation.navigate('ArbiPairConfigListDetailScreen', { item })}
										onEdit={() => this.props.navigation.navigate('ArbiPairConfigAddEditScreen', { activityName: 'Edit', ITEM: item, onSuccess: this.callgetArbiPairConfigListApi })}
										size={this.state.response.length} />
								}
								// assign index as key value list item
								keyExtractor={(_item, index) => index.toString()}
								// Refresh functionality in list
								refreshControl={<RefreshControl
									colors={[R.colors.accent]}
									progressBackgroundColor={R.colors.background}
									refreshing={this.state.refreshing}
									onRefresh={this.onRefresh}
								/>}
							/>
							:
							// Displayed empty component when no record found 
							<ListEmptyComponent module={R.strings.AddNewPair} onPress={() => this.props.navigation.navigate('ArbiPairConfigAddEditScreen', { activityName: 'Add', onSuccess: this.callgetArbiPairConfigListApi })} />
					}
					{/*To Set Pagination View  */}
					<View>
						{filteredList.length > 0 && <PaginationWidget selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} row={this.state.row} />}
					</View>
				</View>
			</SafeView>
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
class ArbiPairConfigListItem extends Component {
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
		let { index, item, size, } = this.props;

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginRight: R.dimens.widget_left_right_margin,
					flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						flex: 1,
						borderTopRightRadius: R.dimens.margin,
						borderRadius: 0,
						elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
					}}
						onPress={this.props.onDetailPress}
					>

						<View style={{ flexDirection: 'row' }}>

							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'space-between', flexDirection: 'row' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									{/* for show PairName or MarketName  */}
									<TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{!isEmpty(item.PairName) ? item.PairName.replace('_', '/') + ' - ' : '-'}</TextViewMR>
									<TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{validateValue(item.MarketName)}</TextViewMR>
								</View>
								<ImageTextButton
									icon={R.images.RIGHT_ARROW_DOUBLE}
									style={{ margin: 0 }}
									iconStyle={{
										width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary
									}}
									onPress={this.props.onDetailPress} />
							</View>
						</View>

						{/* for show CurrencyPrice, charge and Volume */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

							<View style={{ width: '50%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.volume}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(parseFloatVal(item.Volume) !== 'NaN' ? validateValue(parseFloatVal(item.Volume)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ width: '50%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Rate}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.CurrentRate).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.CurrentRate).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and button for edit */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.statusStatic}></StatusChip>

							<ImageTextButton
								style={
									{
										justifyContent: 'center', alignItems: 'center',
										backgroundColor: R.colors.accent,
										borderRadius: R.dimens.titleIconHeightWidth, margin: 0,
										padding: R.dimens.CardViewElivation,
									}}
								iconStyle={{ width: R.dimens.titleIconHeightWidth, tintColor: 'white', height: R.dimens.titleIconHeightWidth, }}
								icon={R.images.IC_EDIT}
								onPress={this.props.onEdit} />
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For ArbitragePairConfigurationReducer Data 
	let data = {
		...state.ArbitragePairConfigurationReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getArbiPairConfigList List Action 
		getArbiPairConfigList: (request) => dispatch(getArbiPairConfigList(request)),
		//Perform clearArbiPairConfigData Action 
		clearArbiPairConfigData: () => dispatch(clearArbiPairConfigData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ArbiPairConfigListScreen);