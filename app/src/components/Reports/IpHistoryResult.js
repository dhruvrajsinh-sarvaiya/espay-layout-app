import React, { Component } from 'react';
import {
	View,
	FlatList,
	RefreshControl,
	ScrollView,
	Text,
	Easing
} from 'react-native';
import { connect } from 'react-redux';
import { ipHistoryList } from '../../actions/Reports/IpHistoryAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import PaginationWidget from '../Widget/PaginationWidget';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../Widget/FilterWidget';
import CommonToast from '../../native_theme/components/CommonToast';
import { DateValidation } from '../../validations/DateValidation';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class IpHistoryResult extends Component {

	constructor(props) {
		super(props);

		//Define All initial State
		this.state = {
			row: [],
			selectedPage: 0,
			response: [],
			searchInput: '',
			refreshing: false,
			isFirstTime: true,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		};

		//To Bind All Method
		this.onRefresh = this.onRefresh.bind(this);
		this.onPageChange = this.onPageChange.bind(this);
		//-----------------

		//Initial Request Parameter
		this.Request = {
			PageIndex: 0,
			PAGE_SIZE: AppConfig.pageSize,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}
	}

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//Call Get Ip History from API
			this.props.ipHistoryList(this.Request);
			//----------
		}
	}

	//For Swipe to referesh Functionality
	async onRefresh() {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {
			this.Request = {
				PageIndex: this.state.selectedPage,
				PAGE_SIZE: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate
			}
			//Call Get Ip History from API
			this.props.ipHistoryList(this.Request);
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		return isCurrentScreen(nextProps);
	};

	// Called when user press on Reset Button from Drawer
	onResetPress = async () => {
		this.refs['drawer'].closeDrawer();

		this.setState({
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			selectedPage: 0
		})
		//Check NetWork is Available or not
		if (await isInternet()) {

			this.Request = {
				PageIndex: 0,
				PAGE_SIZE: AppConfig.pageSize,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate()
			}
			//Call Get Ip History from API
			this.props.ipHistoryList(this.Request)
		}
	}

	// Called when user press on Complete Button from Drawer
	onCompletePress = async () => {
		//Check All From Date Validation
		if (DateValidation(this.state.FromDate, this.state.ToDate)) {
			this.refs.Toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
			return;
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.refs['drawer'].closeDrawer();

		// set page to default pageno
		this.setState({ selectedPage: 0 })

		//Check NetWork is Available or not
		if (await isInternet()) {
			this.Request = {
				PageIndex: 0,
				PAGE_SIZE: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate
			}

			//Call Get Ip History from API
			this.props.ipHistoryList(this.Request)
		} else {
			this.setState({ refreshing: false });
		}

		// searchInput empty when user click on Complete button from Drawer
		this.setState({ searchInput: '' })

	}

	// this method is called when page change and also api call
	async onPageChange(pageNo) {
		if (this.state.selectedPage !== pageNo - 1) {

			this.setState({ selectedPage: pageNo - 1 });

			//Check NetWork is Available or not
			if (await isInternet()) {
				this.Request = {
					PageIndex: pageNo - 1,
					PAGE_SIZE: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate
				}
				//Call Get Ip History from API
				this.props.ipHistoryList(this.Request)
			} else {
				this.setState({ refreshing: false })
			}
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
		if (IpHistoryResult.oldProps !== props) {
			IpHistoryResult.oldProps = props;
		} else {
			return null;
		}

		// check for current screen
		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { IpHistoryFetchData, IpHistorydata } = props;

			//To Check Ip History Data Fetch or Not
			if (!IpHistoryFetchData) {
				try {

					if (validateResponseNew({ response: IpHistorydata, isList: true })) {
						return Object.assign({}, state, {
							response: parseArray(IpHistorydata.IpHistoryList),
							row: addPages(IpHistorydata.Totalcount),
							refreshing: false
						})
					} else {
						return Object.assign({}, state, {
							refreshing: false,
							response: [],
							row: []
						})
					}
				} catch (e) {
					return Object.assign({}, state, {
						refreshing: false,
						response: [],
						row: []
					})
				}
			}
		}
		return null;
	}

	//For Navigation Drawer Functionality
	navigationDrawer = () => {

		return (
			<SafeView
				style={{
					flex: 1,
					backgroundColor: R.colors.background
				}}>

				{/* For Toast */}
				<CommonToast ref="Toast" styles={{ width: R.dimens.FilterDrawarWidth }} />

				{/* filterwidget for IP history data */}
				<FilterWidget
					FromDatePickerCall={(date) => this.setState({ FromDate: date })}
					ToDatePickerCall={(date) => this.setState({ ToDate: date })}
					FromDate={this.state.FromDate}
					ToDate={this.state.ToDate}
					onCompletePress={this.onCompletePress}
					onResetPress={this.onResetPress}
				/>
			</SafeView>
		)
	}

	render() {

		//Get is Fetching value For All APIs to handle Progress bar in All Activity
		const { IpIsFetching } = this.props;
		//----------

		//for final items from search input (validate on IpAddress, Location)
		//default searchInput is empty so it will display all records.
		let finalItems = this.state.response.filter(item => (
			item.IpAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Location.toLowerCase().includes(this.state.searchInput.toLowerCase())
		));
		return (
			//DrawerLayout for Withdraw History Filteration
			<Drawer
				ref='drawer'
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerContent={this.navigationDrawer()}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				easingFunc={Easing.ease}>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.Ip_History}
						isBack={true}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.refs['drawer'].openDrawer()}
					/>

					<View style={{
						flex: 1,
						justifyContent: 'space-between'
					}}>
						{/* To Check Response fetch or not if IpIsFetching = true then display progress bar else display List*/}
						{
							(IpIsFetching && !this.state.refreshing) ?
								<ListLoader />
								:
								<View style={{ flex: 1 }}>

									{finalItems.length > 0 ?

										<ScrollView showsVerticalScrollIndicator={false}
											refreshControl={
												<RefreshControl
													colors={[R.colors.accent]}
													progressBackgroundColor={R.colors.background}
													refreshing={this.state.refreshing}
													onRefresh={this.onRefresh}
												/>
											}
										>
											<View style={{ flex: 1 }}>
												<CardView style={{
													flex: 1,
													elevation: R.dimens.listCardElevation,
													borderRadius: R.dimens.detailCardRadius,
													flexDirection: 'column',
													margin: R.dimens.WidgetPadding,
													padding: 0,
												}}>
													<FlatList
														data={finalItems}
														showsVerticalScrollIndicator={false}
														/* render all item in list */
														renderItem={({ item, index }) =>
															<FlatListItem item={item}
																index={index}
																size={this.state.response.length}
																finalItemsLength={finalItems.length}
															></FlatListItem>}
														/* assign index as key valye to Ip History list item */
														keyExtractor={(item, index) => index.toString()}
														contentContainerStyle={contentContainerStyle(finalItems)}
													/>
												</CardView>
											</View>
										</ScrollView>
										: <ListEmptyComponent />
									}
								</View>
						}
						<View>
							{/* To Set Pagination View */}
							{finalItems.length > 0 &&
								<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage + 1} onPageChange={(item) => { this.onPageChange(item) }} />
							}
						</View>
					</View>
				</SafeView>
			</Drawer>
		);
	}
}

// This Class is used for display record in list
class FlatListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item || this.props.finalItemsLength !== nextProps.finalItemsLength) {
			return true;
		}
		return false;
	}

	render() {

		// Get required fields from props
		let { item } = this.props;
		let { index, size } = this.props;
		let Date = convertDateTime(item.Date);

		return (
			<AnimatableItem>
				<View style={{ flexDirection: 'row', marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding, marginTop: index === 0 ? R.dimens.WidgetPadding : 0, marginBottom: (index === size - 1) ? R.dimens.WidgetPadding : 0, }}>

					<View style={{ width: '10%', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
						<View style={{ flex: 1, alignItems: 'center', alignContent: 'center', marginTop: R.dimens.CardViewElivation }}>
							<View style={{
								width: R.dimens.SMALLEST_ICON_SIZE,
								height: R.dimens.SMALLEST_ICON_SIZE,
								backgroundColor: R.colors.accent,
								borderColor: R.colors.textPrimary,
								borderRadius: R.dimens.LoginButtonBorderRadius,
							}} />
							{this.props.finalItemsLength !== 1 &&
								<View style={{
									flex: 1,
									width: R.dimens.normalizePixels(1),
									backgroundColor: R.colors.textPrimary,
								}} />
							}
						</View>
					</View>

					<View style={{ width: '60%', marginBottom: R.dimens.WidgetPadding, }}>
						<Text style={{ fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.IpAddress}</Text>
						<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{Date}</TextViewHML>
					</View>

					<View style={{ width: '30%', alignContent: 'flex-end', alignItems: 'flex-end' }}>
						<TextViewMR style={{
							color: R.colors.textSecondary,
							fontSize: R.dimens.smallestText
						}}>{item.Location}</TextViewMR>
					</View>
				</View>
			</AnimatableItem>
		)
	};
}

function mapStateToProps(state) {
	return {
		//Updated Data For Ip History Action
		IpHistoryFetchData: state.IpHistoryReducer.IpHistoryFetchData,
		IpIsFetching: state.IpHistoryReducer.IpIsFetching,
		IpHistorydata: state.IpHistoryReducer.IpHistorydata,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform Ip history Action
		ipHistoryList: (LoginHistoryReqObj) => dispatch(ipHistoryList(LoginHistoryReqObj)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IpHistoryResult)


