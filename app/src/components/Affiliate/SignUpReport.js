import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../components/Widget/FilterWidget';
import { DateValidation } from '../../validations/DateValidation';
import CommonToast from '../../native_theme/components/CommonToast';
import PaginationWidget from '../../components/Widget/PaginationWidget';
import R from '../../native_theme/R';
import { getAffiliateCommissionPattern } from '../../actions/Affiliate/AffiliateSignUpAction';
import { GetAffiliateSignupData, getAffiliateUserList, clearAffiliateData } from '../../actions/Affiliate/AffiliateAction';
import { AppConfig } from '../../controllers/AppConfig';
import StatusChip from '../Widget/StatusChip';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class SignUpReport extends Component {

	constructor(props) {
		super(props);

		//Define All initial State
		this.state = {
			row: [],
			selectedPage: 1,
			data: [],//for store data from the responce
			search: '',//for search value for data
			refreshing: false,//for refresh data
			FromDate: getCurrentDate(),//for display Current Date
			ToDate: getCurrentDate(),//for display Current Date
			statusItem: [{ value: R.strings.select_status, code: -1 }, { value: R.strings.confirm, code: 1 }, { value: R.strings.notConfirm, code: 0 }],
			selectedStatus: R.strings.select_status,//for get selected status 
			Status: -1,
			//for scheme type spinner
			type: 0,//0 For basic & 1 for full details
			// for SchemeType
			spinnerSchemeTypeData: [],
			selectedSchemeType: R.strings.select_scheme_type,
			SchemeTypeId: 0,
			// for user list
			userList: [],
			selectedUser: R.strings.Please_Select,
			ParentUser: 0,

			PageSize: AppConfig.pageSize,
			isFirstTime: true,
			isDrawerOpen: false, // First Time Drawer is Closed
		}

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props);

		// Bind All Method
		this.onRefresh = this.onRefresh.bind(this);
		this.onPageChange = this.onPageChange.bind(this);
		this.onResetPress = this.onResetPress.bind(this);
		this.onCompletePress = this.onCompletePress.bind(this);
		this.onBackPress = this.onBackPress.bind(this);

		this.props.navigation.setParams({ onBackPress: this.onBackPress });

		// Create Reference	
		this.toast = React.createRef();
		this.drawer = React.createRef();
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

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {

			// call api for get Affiliate Commission pattern data 
			this.props.getAffiliateCommissionPattern({ type: this.state.type });

			// call api for get AffiliateUserList data 
			this.props.getAffiliateUserList();

			//Bind Request For get Sign Report
			let requestSignUpData = {
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				PageNo: 0,
				PageSize: this.state.PageSize,
			}
			//Call Api for get affiliatesignupreport
			this.props.GetAffiliateSignupData(requestSignUpData)
		} else {
			this.setState({ refreshing: false });
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return isCurrentScreen(nextProps);
	};

	//For Swipe to referesh Functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			//Bind Request For get Sign Report
			let requestSignUpData = {
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Status: this.state.Status,
				SchemeType: this.state.SchemeTypeId,
				ParentUser: this.state.ParentUser,
				PageNo: this.state.selectedPage - 1,
				PageSize: this.state.PageSize,
			}
			//Call Api for get affiliatesignupreport
			this.props.GetAffiliateSignupData(requestSignUpData)
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	//call items
	onPageChange = async (pNo) => {
		if ((pNo) !== (this.state.selectedPage)) {
			this.setState({ selectedPage: pNo });

			// Check NetWork is Available or not
			if (await isInternet()) {

				//Bind Request For get Sign Report
				let requestSignUpData = {
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					Status: this.state.Status,
					SchemeType: this.state.SchemeTypeId,
					ParentUser: this.state.ParentUser,
					PageNo: this.state.selectedPage - 1,
					PageSize: this.state.PageSize,
				}
				//Call Api for get affiliatesignupreport
				this.props.GetAffiliateSignupData(requestSignUpData)
			}
			else {
				this.setState({ refreshing: false });
			}
		}
	}

	// Drawer Navigation
	navigationDrawer() {
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* for display Toast */}
				<CommonToast ref={cmpToast => this.toast = cmpToast} styles={{ width: R.dimens.FilterDrawarWidth }} />

				{/* filterwidget for display fromdate, todate,status,schemeType,Parentuser data */}
				<FilterWidget
					FromDatePickerCall={(date) => this.setState({ FromDate: date })}
					FromDate={this.state.FromDate}
					ToDatePickerCall={(date) => this.setState({ ToDate: date })}
					ToDate={this.state.ToDate}
					onResetPress={this.onResetPress}
					onCompletePress={this.onCompletePress}
					comboPickerStyle={{ marginTop: 0 }}
					pickers={[
						{
							title: R.strings.status,
							array: this.state.statusItem,
							selectedValue: this.state.selectedStatus,
							onPickerSelect: (index, object) => { this.setState({ selectedStatus: index, Status: object.code }) }
						},
						{
							title: R.strings.scheme_type,
							array: this.state.spinnerSchemeTypeData,
							selectedValue: this.state.selectedSchemeType,
							onPickerSelect: (index, object) => { this.setState({ selectedSchemeType: index, SchemeTypeId: object.Id }) }
						},
						{
							title: R.strings.parentUser,
							array: this.state.userList,
							selectedValue: this.state.selectedUser,
							onPickerSelect: (index, object) => { this.setState({ selectedUser: index, ParentUser: object.Id }) }
						},
					]}
				/>
			</SafeView>
		)
	}

	// When user press on reset button then reset all state and call api
	onResetPress = async () => {
		this.drawer.closeDrawer();

		// setstate data as initial value
		this.setState({
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			selectedStatus: R.strings.select_status,
			Status: -1,
			selectedSchemeType: R.strings.select_scheme_type,
			selectedUser: R.strings.Please_Select,
			selectedPage: 1,
			search: '',
			SchemeTypeId: 0,
			ParentUser: 0,
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			//Bind Request For get Sign Report
			let requestSignUpData = {
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				PageNo: 0,
				PageSize: this.state.PageSize,
			}
			//Call Api for get affiliatesignupreport
			this.props.GetAffiliateSignupData(requestSignUpData)
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	// if press on complete button then check validation and api calling
	onCompletePress = async () => {

		// check date validation
		if (DateValidation(this.state.FromDate, this.state.ToDate)) {
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
			return;
		} else {
			this.drawer.closeDrawer();
			this.setState({ selectedPage: 1 })

			// Check NetWork is Available or not
			if (await isInternet()) {

				//Bind Request For get Sign Report
				let requestSignUpData = {
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					Status: this.state.Status == -1 ? '' : this.state.Status,
					SchemeType: this.state.SchemeTypeId,
					ParentUser: this.state.ParentUser,
					PageNo: 0,
					PageSize: this.state.PageSize,
				}
				//Call Api for get affiliatesignupreport
				this.props.GetAffiliateSignupData(requestSignUpData)
			}
			else {
				this.setState({ refreshing: false });
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
		if (SignUpReport.oldProps !== props) {
			SignUpReport.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Field of Particular actions
			const { signupReportData, signupReportDataFetch, affiliateUserDataFetch, affiliateUserData } = props;
			const { getPlan } = props.AffiliateSignUpReducer;

			//To Check affiliateUser Data Fetch or Not
			if (!affiliateUserDataFetch) {
				try {
					if (validateResponseNew({ response: affiliateUserData, isList: true })) {
						//Store Api Response Field and display in Screen.
						var resAffiliateUserDataArray = parseArray(affiliateUserData.Response);
						resAffiliateUserDataArray.map((item, index) => {
							resAffiliateUserDataArray[index].value = resAffiliateUserDataArray[index].UserName
							resAffiliateUserDataArray[index].Id = resAffiliateUserDataArray[index].Id
						})
						//----
						let resAffiliateUserData = [{ value: R.strings.Please_Select, Id: 0 }, ...resAffiliateUserDataArray]

						return { ...state, userList: resAffiliateUserData };
					}
					else {
						return { ...state, userList: [], selectedUser: R.strings.Please_Select, ParentUser: 0 };
					}
				} catch (e) {
					return { ...state, userList: [], selectedUser: R.strings.Please_Select, ParentUser: 0 };
				}
			}

			//To Check Plan Data Fetch or Not
			if (getPlan) {
				try {
					if (state.getPlan == null || (state.getPlan != null && getPlan !== state.getPlan)) {
						if (validateResponseNew({ response: getPlan })) {
							//Store Api Response Field and display in Screen.
							let resPlanArray = parseArray(getPlan.Response)
							resPlanArray.map((item, index) => {
								resPlanArray[index].value = resPlanArray[index].Value
								resPlanArray[index].Id = resPlanArray[index].Id
							})
							//----
							let resPlan = [{ value: R.strings.select_scheme_type }, ...resPlanArray]

							return { ...state, spinnerSchemeTypeData: resPlan, getPlan };
						}
						else {
							return { ...state, spinnerSchemeTypeData: [], selectedSchemeType: R.strings.select_scheme_type, SchemeTypeId: 0 };
						}
					}
				} catch (e) {
					return { ...state, spinnerSchemeTypeData: [], selectedSchemeType: R.strings.select_scheme_type, SchemeTypeId: 0 }
				}
			}

			//To Check signupReport Data Fetch or Not
			if (!signupReportDataFetch) {
				try {
					if (validateResponseNew({ response: signupReportData, isList: true })) {
						//Store Api Response Field and display in Screen.
						var resSignUpReportData = parseArray(signupReportData.Response);
						return { ...state, data: resSignUpReportData, signupReportData, row: addPages(signupReportData.TotalCount), refreshing: false };
					}
					else {
						return { ...state, refreshing: false, data: [], row: [] };
					}
				} catch (e) {
					return { ...state, refreshing: false, data: [], row: [] };
				}
			}
		}
		return null;
	}

	componentWillUnmount() {
		// call action for clear Reducer value 
		this.props.clearAffiliateData()
	}

	render() {

		// loading bit for display listloader
		const { isSignupReportFetch } = this.props;

		let list = this.state.data;

		//for final items from search input (validate on FirstName , LastName , Email and SchemeType)
		//default searchInput is empty so it will display all records.
		let finalItems = list.filter(signUpReportItem =>
			(signUpReportItem.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
			(signUpReportItem.LastName.toLowerCase().includes(this.state.search.toLowerCase())) ||
			(signUpReportItem.Email.toLowerCase().includes(this.state.search.toLowerCase())) ||
			(signUpReportItem.SchemeType.toLowerCase().includes(this.state.search.toLowerCase()))
		);

		return (
			//apply filter for signup report 
			<Drawer
				ref={cmp => this.drawer = cmp}
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
						title={R.strings.signupReport}
						isBack={true}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{/* To Check Response fetch or not if isSignupReportFetch = true then display progress bar else display List*/}
						{
							isSignupReportFetch && !this.state.refreshing ?
								<ListLoader />
								:
								<View style={{ flex: 1 }}>
									{/* for display Headers for list  */}
									{finalItems.length > 0 ?
										<View style={{ flex: 1 }}>
											<FlatList
												data={finalItems}
												showsVerticalScrollIndicator={false}
												renderItem={({ item, index }) => {
													return <SignUpReportList
														signUpReportItem={item}
														signUpReportIndex={index}
														signUpReportSize={this.state.data.length}
													/>
												}}
												keyExtractor={(item, index) => index.toString()}
												contentContainerStyle={[
													{ flexGrow: 1 },
													this.state.data.length ? null : { justifyContent: 'center' }
												]}
												/* for refreshing data of flatlist */
												refreshControl={
													<RefreshControl
														colors={[R.colors.accent]}
														progressBackgroundColor={R.colors.background}
														refreshing={this.state.refreshing}
														onRefresh={this.onRefresh}
													/>}
											/>
										</View>
										:
										<ListEmptyComponent />}
								</View>
						}

						{/* to show Pagination */}
						<View>
							{finalItems.length > 0 &&
								<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
						</View>
					</View>
				</SafeView>
			</Drawer >
		)
	}
}

// This Class is used for display record in list
class SignUpReportList extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.signUpReportItem === nextProps.signUpReportItem) {
			return false
		}
		return true
	}

	render() {
		let signUpReportItem = this.props.signUpReportItem;
		let { signUpReportIndex, signUpReportSize, } = this.props;
		let color = signUpReportItem.StatusMsg === 'Confirm' ? R.colors.successGreen : R.colors.failRed;

		return (
			<AnimatableItem>
				<View style={{
					flex: 1,
					flexDirection: 'column',
					marginTop: (signUpReportIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (signUpReportIndex == signUpReportSize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation,
						flex: 1,
						borderRadius: 0,
						flexDirection: 'column',
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}} onPress={this.props.onPress}>

						{/* for display user icon, username, email and scheme type */}
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
							<ImageTextButton
								icon={R.images.IC_OUTLINE_USER}
								style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
								iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
							/>
							<View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{signUpReportItem.FirstName ? signUpReportItem.FirstName + ' ' + signUpReportItem.LastName : '-'}</Text>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{signUpReportItem.Email ? signUpReportItem.Email : '-'}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.scheme}<TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallText }}> {signUpReportItem.SchemeType ? signUpReportItem.SchemeType : '-'}</TextViewHML></TextViewHML>
							</View>
						</View>

						{/* for show Datetime and status */}
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
							<View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
								<StatusChip
									color={color}
									value={signUpReportItem.StatusMsg === 'Confirm' ? signUpReportItem.StatusMsg : 'Failed'}></StatusChip>
							</View>
							<ImageTextButton
								style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
								icon={R.images.IC_TIMER}
								iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
							/>
							<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{signUpReportItem.JoinDate ? convertDateTime(signUpReportItem.JoinDate) : '-'}</TextViewHML>
						</View>
					</CardView>
				</View >
			</AnimatableItem>
		)
	}
}

function mapStateToProps(state) {
	return {
		// Updated Data for Signup report
		isSignupReportFetch: state.AffiliateReducer.isSignupReportFetch,
		signupReportData: state.AffiliateReducer.signupReportData,
		signupReportDataFetch: state.AffiliateReducer.signupReportDataFetch,

		// Updated Data for affiliate user
		isAffiliateUser: state.AffiliateReducer.isAffiliateUser,
		affiliateUserData: state.AffiliateReducer.affiliateUserData,
		affiliateUserDataFetch: state.AffiliateReducer.affiliateUserDataFetch,

		// Updated Data for schemeType
		AffiliateSignUpReducer: state.AffiliateSignUpReducer,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//perform Signup action
		GetAffiliateSignupData: (requestSignUpData) => dispatch(GetAffiliateSignupData(requestSignUpData)),
		//perform commission pattern action for get schemetype
		getAffiliateCommissionPattern: (registerRequest) => dispatch(getAffiliateCommissionPattern(registerRequest)),
		//perform affiliate user list Action
		getAffiliateUserList: () => dispatch(getAffiliateUserList()),
		//Perform action for clear data from reducer
		clearAffiliateData: () => dispatch(clearAffiliateData()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpReport)