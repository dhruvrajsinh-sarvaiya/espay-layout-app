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
import { loginHistoryList, clearLoginHistoryData } from '../../actions/Reports/LoginHistoryAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import PaginationWidget from '../Widget/PaginationWidget';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../Widget/FilterWidget';
import CommonToast from '../../native_theme/components/CommonToast';
import { DateValidation } from '../../validations/DateValidation';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class LoginHistoryResult extends Component {

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
			isDrawerOpen: false, // First Time Drawer is Closed
		};

		//Initial Request Parameter
		this.Request = {
			PageIndex: 0,
			PAGE_SIZE: AppConfig.pageSize,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props);

		//To Bind All Method
		this.onPageChange = this.onPageChange.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.onBackPress = this.onBackPress.bind(this);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });

		// create reference
		this.drawer = React.createRef()
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
			//Call Get Login History from API
			this.props.loginHistoryList(this.Request);
			//----------
		}
	}

	componentWillUnmount() {
		//for clear the data on BackPress
		this.props.clearLoginHistoryData();
	}

	//For Swipe to referesh Functionality
	async onRefresh() {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {
			//Bind Login History Api Object Bit
			this.Request = {
				...this.Request,
				PageIndex: this.state.selectedPage,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
			}
			//Call Get Login History from API
			this.props.loginHistoryList(this.Request);
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	/* this method is called when page change and also api call */
	async onPageChange(pageNo) {
		//if selected page is NotSame then call Api 
		if (this.state.selectedPage !== pageNo - 1) {
			this.setState({ selectedPage: pageNo - 1 });

			//Check NetWork is Available or not
			if (await isInternet()) {
				//Bind Login History Api Object Bit
				this.Request = {
					...this.Request,
					PageIndex: pageNo - 1,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
				}
				/* Called Domain List Api */
				this.props.loginHistoryList(this.Request)
			} else {
				this.setState({ refreshing: false })
			}
		}
	}

	// Called when user press on Reset Button from Drawer
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer();
		this.setState({ FromDate: getCurrentDate(), ToDate: getCurrentDate(), selectedPage: 0 })

		//Check NetWork is Available or not
		if (await isInternet()) {
			//Bind Login History Api Object Bit
			this.Request = {
				...this.Request,
				PageIndex: 0,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate()
			}
			//Call Get Ip History from API
			this.props.loginHistoryList(this.Request)
		}
	}

	// Called when user press on Complete Button from Drawer
	onCompletePress = async () => {
		//Check All From Date Validation
		if (DateValidation(this.state.FromDate, this.state.ToDate)) {
			this.refs.Toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
			return;
		}
		// Close Drawer user press on Complete button bcoz display flatlist item on Screen */
		this.drawer.closeDrawer();

		//Change Selected Page on First Position After Apply The Filter
		this.setState({ selectedPage: 0 })

		//Check NetWork is Available or not
		if (await isInternet()) {
			//Bind Request Login History 
			this.Request = {
				...this.Request,
				PageIndex: 0,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate
			}
			//Call Get Ip History from API
			this.props.loginHistoryList(this.Request)
		} else {
			this.setState({ refreshing: false });
		}
		// searchInput empty when user click on Complete button from Drawer
		this.setState({ searchInput: '' })
	}

	shouldComponentUpdate(nextProps, _nextState) {
		return isCurrentScreen(nextProps);
	};

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
		if (LoginHistoryResult.oldProps !== props) {
			LoginHistoryResult.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { LoginHistorydata } = props;

			//To Check Login History Data Fetch or Not
			if (LoginHistorydata) {
				try {
					//if local LoginHistorydata state is null or its not null and also different then new response then and only then validate response.
					if (state.LoginHistorydata == null || (state.LoginHistorydata != null && LoginHistorydata !== state.LoginHistorydata)) {
						if (validateResponseNew({ response: LoginHistorydata, isList: true })) {

							//check Ip History Response is an Array Or not
							//If Response is Array then Direct set in state otherwise conver response to Array form then set state.
							var res = parseArray(LoginHistorydata.LoginHistoryList);

							//Set State For Api response , Selected Item and Refershing Bit
							return {
								...state,
								LoginHistorydata,
								response: res,
								row: addPages(LoginHistorydata.TotalCount),
								refreshing: false,
							}
						} else {
							return {
								...state,
								LoginHistorydata,
								response: [],
								refreshing: false,
								row: []
							}
						}
					}

				} catch (e) {
					return {
						...state, response: [],
						refreshing: false, row: []
					}
				}
			}
		}
		return null;
	}

	// Drawer Navigation
	navigationDrawer = () => {
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
				{/* For Toast */}
				<CommonToast styles={{ width: R.dimens.FilterDrawarWidth }} ref="Toast" />

				{/* FilterWidget For From Date , To Date */}
				<FilterWidget
					FromDatePickerCall={(date) =>
						this.setState({ FromDate: date })}
					ToDatePickerCall={(date) =>
						this.setState({ ToDate: date })}
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
		const { LoginIsFetching } = this.props;
		//----------

		//for final items from search input (validate on Device , Data , Location and IpAddress)
		//default searchInput is empty so it will display all records.
		let finalItems = this.state.response.filter(item => item.Device.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.Date.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.IpAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.Location.toLowerCase().includes(this.state.searchInput.toLowerCase()));

		return (

			//DrawerLayout for Login History Filteration
			<Drawer
				ref={cmp => this.drawer = cmp}
				drawerWidth={R.dimens.FilterDrawarWidth}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
				drawerContent={this.navigationDrawer()}
				drawerPosition={Drawer.positions.Right}
				easingFunc={Easing.ease}>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.Login_History}
						isBack={true}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{/* To Check Response fetch or not if LoginIsFetching = true then display progress bar else display List*/}
						{LoginIsFetching && !this.state.refreshing ?
							<ListLoader />
							:
							<View style={{ flex: 1, }}>
								{finalItems.length > 0 ?
									<ScrollView showsVerticalScrollIndicator={false}
										/* For Refresh Functionality In Login History FlatList Item */
										refreshControl={
											<RefreshControl
												colors={[R.colors.accent]}
												progressBackgroundColor={R.colors.background}
												refreshing={this.state.refreshing}
												onRefresh={this.onRefresh}
											/>
										}>
										<View style={{ flex: 1 }}>
											<CardView style={{
												flex: 1,
												elevation: R.dimens.listCardElevation,
												borderRadius: R.dimens.detailCardRadius,
												flexDirection: 'column',
												margin: R.dimens.WidgetPadding,
												paddingTop: 0,
												paddingBottom: 0,
												paddingRight: 0,
											}}>
												<FlatList
													data={finalItems}
													showsVerticalScrollIndicator={false}
													/* render all item in list */
													renderItem={({ item, }) =>
														<FlatListItem item={item} />
													}
													/* assign index as key valye to Login History list item */
													keyExtractor={(item, index) => index.toString()}
													/* for item seprator on Login History list item */
													ItemSeparatorComponent={() => <Separator style={{ marginLeft: R.dimens.paginationButtonHeightWidth, marginRight: 0 }} />}
													contentContainerStyle={contentContainerStyle(finalItems)}
												/>
											</CardView>
										</View>
									</ScrollView> :
									<ListEmptyComponent />
								}
							</View>
						}
						<View>
							{/*To Set Pagination View  */}
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
export class FlatListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item) {
			return true;
		}
		return false;
	}

	render() {
		let { item } = this.props;
		let Date = convertDateTime(item.Date);
		let imgBackgroundColor = R.colors.successGreen;
		let icon = R.images.IC_EARTH_NEW;

		//if Device Name Contains android or Iphone Os than Diplay Mobile Icon else Web icon 
		if ((item.Device).toLowerCase().includes("android") || (item.Device).toLowerCase().includes("ios") || (item.Device).toLowerCase().includes("iphone os")) {
			icon = R.images.IC_MOBILE
			imgBackgroundColor = R.colors.accent;
		}
		else {
			icon = R.images.IC_EARTH_NEW
			imgBackgroundColor = R.colors.successGreen;
		}

		return (
			<AnimatableItem>
				<View style={{ flex: 1, marginBottom: R.dimens.widget_top_bottom_margin, flexDirection: 'row', justifyContent: 'center' }}>

					<View style={{ width: '10%', justifyContent: 'center' }}>
						{/* icon */}
						<ImageTextButton
							icon={icon}
							style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, margin: 0, backgroundColor: imgBackgroundColor, borderRadius: R.dimens.ButtonHeight }}
							iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
						/>
					</View>

					<View style={{ width: '90%' }}>
						<View style={this.styles().simpleItem}>
							<View style={{ width: '50%' }}>
								{/* Ip Address */}
								<Text style={[this.styles().simpleText, { fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.smallText }]}>{item.IpAddress}</Text>
							</View>
							<View style={{ width: '50%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
								{/* Location */}
								<TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Location}</TextViewMR>
							</View>
						</View>
						{/* Device*/}
						<TextViewHML style={[this.styles().simpleText, { flex: 1, marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }]} >{item.Device}</TextViewHML>
						{/* Date */}
						<TextViewHML style={[this.styles().simpleText, this.styles().simpleItem, { fontSize: R.dimens.smallestText, marginTop: 0, color: R.colors.textSecondary, }]}>{Date}</TextViewHML>
					</View>
				</View>
			</AnimatableItem>
		)
	};

	// styles for this class
	styles = () => {
		return {
			simpleItem: {
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: R.dimens.widget_top_bottom_margin,
				marginLeft: R.dimens.widget_left_right_margin,
				marginRight: R.dimens.widget_left_right_margin,
			},
			simpleText: {
				color: R.colors.textPrimary,
				fontSize: R.dimens.smallestText
			}
		}
	}
}

function mapStateToProps(state) {
	return {
		//Updated Data For Login History
		LoginIsFetching: state.LoginHistoryReducer.LoginIsFetching,
		LoginHistorydata: state.LoginHistoryReducer.LoginHistorydata,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform Login history 
		loginHistoryList: (LoginHistoryReqObj) => dispatch(loginHistoryList(LoginHistoryReqObj)),
		clearLoginHistoryData: () => dispatch(clearLoginHistoryData()),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginHistoryResult)

