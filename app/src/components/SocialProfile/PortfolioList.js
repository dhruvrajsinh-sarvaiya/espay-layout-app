import React, { Component } from 'react';
import { View, Easing, FlatList, RefreshControl, TouchableWithoutFeedback, Text } from 'react-native';
import R from '../../native_theme/R';
import CommonToast from '../../native_theme/components/CommonToast';
import FilterWidget from '../Widget/FilterWidget';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../Widget/PaginationWidget';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import ListLoader from '../../native_theme/components/ListLoader';
import { getLeaderPortfolioList } from '../../actions/SocialProfile/SocialProfileActions';
import Separator from '../../native_theme/components/Separator';
import { AppConfig } from '../../controllers/AppConfig';
import { changeTheme, parseArray, addPages, convertDate, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { getPairList } from '../../actions/PairListAction';
import { DateValidation } from '../../validations/DateValidation';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class PortfolioList extends Component {
	constructor(props) {
		super(props);

		//initial state
		this.state = {
			row: [],
			response: [],
			searchInput: '',
			FromDate: '',
			ToDate: '',
			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false,
			selectedPage: 1,
			portfolioListData: null,
			PageSize: AppConfig.pageSize,
			ScreenName: props.ScreenName,
			CurrencyPair: [],
			selCurrencyPair: R.strings.all,
			Type: [{ value: R.strings.all }, { value: 'Buy' }, { value: 'Sell' }],
			selectedType: R.strings.all,
		};

		// Create Ref
		this.toastRef = React.createRef()
		this.drawerRef = React.createRef()

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props);

		//To Bind All Method
		this.onRefresh = this.onRefresh.bind(this);
		this.onResetPress = this.onResetPress.bind(this);
		this.onCompletePress = this.onCompletePress.bind(this);
		this.onPageChange = this.onPageChange.bind(this);
		this.onBackPress = this.onBackPress.bind(this);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	//for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
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

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme();
		//Check NetWork is Available or not
		if (await isInternet()) {
			//Call Get from API
			this.props.getLeaderPortfolioList({});
			//to get pair list
			this.props.getPairList();
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
		if (PortfolioList.oldProps !== props) {
			PortfolioList.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { portfolioListData, pairList } = props.Listdata;

			//To Check  Data Fetch or Not
			if (portfolioListData) {
				try {
					if (state.portfolioListData == null || (state.portfolioListData != null && portfolioListData !== state.portfolioListData)) {
						if (validateResponseNew({ response: portfolioListData, isList: true })) {
							return Object.assign({}, state, {
								portfolioListData,
								response: parseArray(portfolioListData.Response),
								refreshing: false,
								row: addPages(portfolioListData.TotalCount)
							})
						} else {
							return Object.assign({}, state, {
								portfolioListData: null,
								refreshing: false,
								response: [],
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						refreshing: false,
						portfolioListData: null,
						response: [],
						row: []
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			//if pairList response is not null then handle resposne
			if (pairList) {
				try {
					if (state.pairList == null || (state.pairList != null && pairList !== state.pairList)) {

						if (validateResponseNew({ response: pairList, isList: true })) {

							let res = parseArray(pairList.Response);

							// Push value property for PairName Picker
							res.map((item, index) => { res[index].value = item.PairName; })

							let CurrencyPair = [{ value: R.strings.all }, ...res];

							return Object.assign({}, state, { pairList, CurrencyPair })
						} else {
							return Object.assign({}, state, {
								pairList: null,
								CurrencyPair: [{ value: R.strings.all }]
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						pairList: null,
						CurrencyPair: [{ value: R.strings.all }]
					})
				}
			}
		}
		return null
	}

	onResetPress = async () => {
		this.setState({
			FromDate: '',
			ToDate: '',
			selectedType: R.strings.all,
			selCurrencyPair: R.strings.all,
			searchInput: '',
			selectedPage: 1,
		})

		/* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
		this.drawerRef.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {
			this.props.getLeaderPortfolioList({});
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	/* Api Call when press on complete button */
	onCompletePress = async () => {
		if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {
			this.toastRef.Show(R.strings.bothDateRequired);
			return
		}
		//Check All From Date Validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
			this.toastRef.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
			return;
		}

		/* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
		this.drawerRef.closeDrawer();
		this.setState({ selectedPage: 1, })

		//Check NetWork is Available or not
		if (await isInternet()) {
			let request = {
				PageNo: this.state.selectedPage - 1,
				PageSize: this.state.PageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Pair: this.state.selCurrencyPair !== R.strings.all ? this.state.selCurrencyPair : '',
				TrnType: this.state.selectedType !== R.strings.all ? this.state.selectedType : '',
			}

			this.props.getLeaderPortfolioList(request);
			//----------
		} else {
			this.setState({ refreshing: false });
		}

		//If Filter from Complete Button Click then empty searchInput
		this.setState({ searchInput: '' })
	}

	/* Drawer Navigation */
	navigationDrawer() {
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* For Toast */}
				<CommonToast ref={cmp => this.toastRef = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

				<FilterWidget
					isCancellable
					comboPickerStyle={{ marginTop: 0, }}
					textInputStyle={{ marginBottom: 0, marginTop: 0 }}
					FromDatePickerCall={(date) => this.setState({ FromDate: date })}
					ToDatePickerCall={(date) => this.setState({ ToDate: date })}
					FromDate={this.state.FromDate}
					ToDate={this.state.ToDate}
					onResetPress={this.onResetPress}
					onCompletePress={this.onCompletePress}
					pickers={[
						{
							title: R.strings.currencyPair,
							array: this.state.CurrencyPair,
							selectedValue: this.state.selCurrencyPair,
							onPickerSelect: (index) => { this.setState({ selCurrencyPair: index }) }
						},
						{
							title: R.strings.Type,
							array: this.state.Type,
							selectedValue: this.state.selectedType,
							onPickerSelect: (index) => { this.setState({ selectedType: index }) }
						},

					]}
				/>
			</SafeView>
		)
	}

	// Pagination Method Called When User Change Page  
	onPageChange = async (pageNo) => {
		//if user select other page number then and only then API Call else no need to call API
		if ((pageNo) !== (this.state.selectedPage)) {
			this.setState({ selectedPage: pageNo });

			if (await isInternet()) {
				//bind request for portfoilo list
				let request = {
					PageNo: pageNo - 1,
					PageSize: this.state.PageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					Pair: this.state.selCurrencyPair !== R.strings.all ? this.state.selCurrencyPair : '',
					TrnType: this.state.selectedType !== R.strings.all ? this.state.selectedType : '',
				}
				//call portfolio list api
				this.props.getLeaderPortfolioList(request)
			} else {
				this.setState({ refreshing: false });
			}
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {
			//bind request for portfoilo list
			let request = {
				PageNo: this.state.selectedPage - 1,
				PageSize: this.state.PageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Pair: this.state.selCurrencyPair !== R.strings.all ? this.state.selCurrencyPair : '',
				TrnType: this.state.selectedType !== R.strings.all ? this.state.selectedType : '',
			}
			//call portfolio list api
			this.props.getLeaderPortfolioList(request)
		} else {
			this.setState({ refreshing: false });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		/* stop twice api call  */
		return isCurrentScreen(nextProps);
	};

	render() {
		//Get is Fetching value For All APIs to handle Progress bar in All Activity
		const { portfolioListLoading } = this.props.Listdata;

		//for final items from search input (validate on PairName and Type,OrderType,DateTime )
		//default searchInput is empty so it will display all records.
		let finalItems = this.state.response
		if (finalItems.length > 0) {
			finalItems = finalItems.filter(item =>
				(item.PairName.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
				(item.Type.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
				(item.OrderType.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
				(item.DateTime.toLowerCase().includes(this.state.searchInput.toLowerCase()))
			)
		}

		if (this.state.ScreenName === 'SocialProfileDashboard') {
			return (
				<SafeView style={{ marginBottom: R.dimens.margin }}>
					{/* Portfolio List */}
					<CardView style={this.styles().cardViewStyle}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.portfolio}</Text>
							{
								this.state.response.length > 0 &&
								<ImageTextButton
									icon={R.images.RIGHT_ARROW_DOUBLE}
									iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
									style={{ margin: 0 }}
									onPress={() => this.props.navigation.navigate('PortfolioList')} />
							}
						</View>

						{/* To Check Response fetch or not if portfolioListLoading = true then display progress bar else display List*/}
						{portfolioListLoading ? <ListLoader style={{ marginTop: R.dimens.margin }} />
							:
							<View style={{ flex: 1, marginTop: R.dimens.margin }}>

								<FlatList
									showsVerticalScrollIndicator={false}
									data={finalItems}
									/* render all item in list */
									renderItem={({ item, index }) => {
										if (index < 5) {
											return <PortfolioListItem
												isContainInMainScreen={true}
												item={item}
												index={index}
												size={finalItems.length}
												onDetailPress={() => this.props.navigation.navigate('PortfolioListDetail', { item })} />
										} else return null

									}}
									/* assign index as key valye to  list item */
									keyExtractor={(item, index) => index.toString()}
									contentContainerStyle={contentContainerStyle(finalItems)}
									ListEmptyComponent={<ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
								/>

							</View>
						}
					</CardView>
				</SafeView>
			)
		} else {

			return (
				//DrawerLayout for Portfolio list
				<Drawer
					ref={drawerCmp => this.drawerRef = drawerCmp}
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
							title={R.strings.portfolio}
							isBack={true}
							nav={this.props.navigation}
							rightIcon={R.images.FILTER}
							searchable={true}
							onSearchText={(text) => this.setState({ searchInput: text })}
							onRightMenuPress={() => this.drawerRef.openDrawer()}
						/>
						<View style={{ flex: 1, justifyContent: 'space-between' }}>

							{/* List Items */}
							{/* To Check Response fetch or not if portfolioListLoading = true then display progress bar else display List*/}
							{
								(portfolioListLoading && !this.state.refreshing) ?
									<ListLoader />
									:
									<FlatList
										showsVerticalScrollIndicator={false}
										data={finalItems}
										renderItem={({ item, index }) =>
											<CardView style={{
												flex: 1,
												borderRadius: 0,
												elevation: R.dimens.listCardElevation,
												borderBottomLeftRadius: R.dimens.margin,
												borderTopRightRadius: R.dimens.margin,
												marginLeft: R.dimens.margin,
												marginRight: R.dimens.margin,
												marginTop: (index == 0) ? R.dimens.margin : R.dimens.widgetMargin,
												marginBottom: (index == finalItems.length - 1) ? R.dimens.margin : R.dimens.widgetMargin,
											}}>
												<PortfolioListItem item={item} onDetailPress={() => this.props.navigation.navigate('PortfolioListDetail', { item })} />
											</CardView>
										}
										/* assign index as key valye to list item */
										keyExtractor={(_item, index) => index.toString()}
										contentContainerStyle={contentContainerStyle(finalItems)}
										ListEmptyComponent={<ListEmptyComponent />}
										/* For Refresh Functionality In  FlatList Item */
										refreshControl={
											<RefreshControl
												colors={[R.colors.accent]}
												progressBackgroundColor={R.colors.background}
												refreshing={this.state.refreshing}
												onRefresh={this.onRefresh}
											/>
										}
									/>
							}
							{/*To Set Pagination View  */}
							<View>
								{finalItems.length > 0 &&
									<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
								}
							</View>
						</View>
					</SafeView>

				</Drawer>
			);
		}
	}

	// styles for this class
	styles = () => {
		return {
			cardViewStyle: {
				borderTopLeftRadius: 0,
				borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
				borderBottomLeftRadius: R.dimens.LoginButtonBorderRadius,
				borderBottomRightRadius: 0,
				margin: R.dimens.margin
			},
		}
	}
}

// This Class is used for display record in list
class PortfolioListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item &&
			this.props.isContainInMainScreen === nextProps.isContainInMainScreen) {
			return false
		}
		return true
	}

	render() {
		let { item, index, size } = this.props;
		return (
			<AnimatableItem>
				<TouchableWithoutFeedback onPress={this.props.onDetailPress}>
					<View style={{ flex: 1 }} >
						<View>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.PairName}</Text>
									<TextViewMR style={{ color: item.Type === 'Buy' ? R.colors.successGreen : R.colors.failRed, fontSize: R.dimens.smallestText, }}> {item.Type}-{item.OrderType}</TextViewMR>
								</View>
								<ImageTextButton
									icon={R.images.RIGHT_ARROW_DOUBLE}
									iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
									style={{ margin: 0 }} />
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{item.Amount}</TextViewHML>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}> {item.PairName.split('/')[0]}</TextViewHML>
								</View>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText, }}>{convertDate(item.DateTime)}</TextViewHML>
							</View>
						</View>
						{
							(this.props.isContainInMainScreen && index !== size - 1) &&
							<Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, }} />
						}
					</View>
				</TouchableWithoutFeedback>
			</AnimatableItem>
		)
	}
}

function mapStateToProps(state) {
	return {
		// updated state from reducer
		Listdata: { ...state.SocialProfileReducer, ...state.pairListReducer },
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//get portfolio list
		getLeaderPortfolioList: (Request) => dispatch(getLeaderPortfolioList(Request)),
		//get pairlist
		getPairList: () => dispatch(getPairList()),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PortfolioList)