import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { connect } from 'react-redux';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getUsersList, changeUserStatus } from '../../../actions/account/UserManagementActions';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import { changeTheme, parseArray, addPages, showAlert, createOptions, createActions, getDeviceID, getIPAddress, getCurrentDate } from '../../../controllers/CommonUtils';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts, ServiceUtilConstant } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import PaginationWidget from '../../widget/PaginationWidget';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import SafeView from '../../../native_theme/components/SafeView';
import { clearUserListData, reinviteUserApi, disableTwoFaApi, unlockUserApi } from '../../../actions/account/UserListActions';
import OptionsMenu from "react-native-options-menu";
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import { CheckEmailValidation } from '../../../validations/EmailValidation';

export class UsersListScreen extends Component {
	constructor(props) {
		super(props)

		// Define all initial state
		this.state = {
			UserListResponse: [],
			searchInput: '',
			refreshing: false,
			selectedPage: 1,
			isFirstTime: true,
			UserId: 0,
			changedStatus: null,

			//For Drawer First Time Close
			isDrawerOpen: false,

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			userName: '',
			email: '',
			mobile: '',
			userTypes: [
				{ value: R.strings.Please_Select, code: '' },
				{ value: R.strings.frontUser, code: 0 },
				{ value: R.strings.backofficeUser, code: 1 },
			],
			selectedUserType: R.strings.Please_Select,
			selectedUserTypeCode: '',
		}

		// create reference
		this.toast = React.createRef();
		this.drawer = React.createRef();

		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme()
		// Call user List Api
		if (await isInternet()) {

			// call user list api
			this.props.getUsersList(this.request)
		}
	};


	shouldComponentUpdate = (nextProps, _nextState) => {
		//stop twice api call
		return isCurrentScreen(nextProps);
	};

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

	//For Swipe to referesh Functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage - 1,
			}
			// call api
			this.props.getUsersList(this.request)
		}
		else {
			this.setState({ refreshing: false });
		}
	}

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {
		if (this.state.selectedPage !== pageNo) {
			this.setState({ selectedPage: pageNo });

			this.request = {
				...this.request,
				PageNo: pageNo - 1,
			}

			// Called Rule Module List Api
			this.props.getUsersList(this.request)

		}
	}

	// User press on edit button
	onEditPress = async (item) => {
		let { navigate } = this.props.navigation

		//redirect to edit user screen
		navigate('AddEditUserScreen', { onRefresh: this.onRefresh, item: item, })
	}

	// User press on reinvite button
	onReinvitePress = async (item) => {

		// check internet connection
		if (await isInternet()) {

			// call reinvite user api
			this.props.reinviteUserApi({
				Email: item.Email
			})
		}
	}

	onUpdateStatus = async (item, changedStatusCode) => {

		//Check NetWork is Available or not
		if (await isInternet()) {
			let req = {
				UserId: item.UserId,
				Status: changedStatusCode
			}

			this.setState({ UserId: item.UserId, changedStatus: changedStatusCode })

			// call changeUserStatus api
			this.props.changeUserStatus(req);
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
		if (UsersListScreen.oldProps !== props) {
			UsersListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { UsersListData, ChangeUserStatus } = props.UsersListResult;

			//To Check  Data Fetch or 
			if (UsersListData) {
				try {
					if (state.UsersListData == null || (state.UsersListData != null && UsersListData !== state.UsersListData)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: UsersListData, isList: true })) {

							let res = parseArray(UsersListData.Data)

							for (var userListKey in res) {
								let item = res[userListKey]
								let statusText = ''
								let lockedStatusText = ''

								if (item.Status == 0)
									statusText = R.strings.inActive
								else if (item.Status == 2)
									statusText = R.strings.Confirmed
								else if (item.Status == 3)
									statusText = R.strings.Unconfirmed
								else if (item.Status == 4)
									statusText = R.strings.Unassigned
								else if (item.Status == 5)
									statusText = R.strings.Suspended
								else if (item.Status == 6)
									statusText = R.strings.Blocked
								else if (item.Status == 7)
									statusText = R.strings.ReqDeleted
								else if (item.Status == 8)
									statusText = R.strings.Suspicious
								else if (item.Status == 9)
									statusText = R.strings.Delete
								else if (item.Status == 10)
									statusText = R.strings.PolicyViolated


								if (item.IsLockOut == 0)
									lockedStatusText = R.strings.unlocked
								else if (item.IsLockOut == 1)
									lockedStatusText = R.strings.locked

								item.StatusText = statusText
								item.lockedStatusText = lockedStatusText
							}

							return Object.assign({}, state, {
								UsersListData,
								UserListResponse: res,
								refreshing: false,
								row: addPages(UsersListData.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								UsersListData: null,
								refreshing: false,
								UserListResponse: [],
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						UsersListData: null,
						refreshing: false,
						UserListResponse: [],
						row: [],
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// Check enable status Response 
			if (ChangeUserStatus) {
				try {
					if (state.ChangeUserStatus == null || (state.ChangeUserStatus != null && ChangeUserStatus !== state.ChangeUserStatus)) {
						//Get Api response
						if (validateResponseNew({ response: ChangeUserStatus, isList: true })) {
							let res = state.UserListResponse;
							let findIndexOfChangeID = state.UserId == null ? -1 : res.findIndex(el => el.UserId == state.UserId);

							//if index is >-1 then record is found
							if (findIndexOfChangeID > -1) {
								res[findIndexOfChangeID].Status = state.changedStatus;
							}

							return {
								...state,
								ChangeUserStatus,
								UserListResponse: res,
								UserId: null,
								changedStatus: null
							}
						}
						else {
							return {
								...state,
								ChangeUserStatus,
								UserListResponse: state.UserListResponse,
								UserId: null,
								changedStatus: null
							}
						}
					}

				} catch (e) {
				}
			}
		}
		return null
	}

	componentDidUpdate = async (prevProps, prevState) => {

		const { reinviteData, unlockUserResponse, twoFaDisableResponse } = this.props.UsersListResult;

		if (reinviteData !== prevProps.UsersListResult.reinviteData) {
			// for show responce reinvite Data
			if (reinviteData) {
				try {
					if (validateResponseNew({ response: reinviteData })) {
						showAlert(R.strings.Success, reinviteData.ReturnMsg, 0, () => {

							// clear data
							this.props.clearUserListData();
							// Call Users List Api
							this.onRefresh(true)
						});
					} else {
						// clear data
						this.props.clearUserListData();
					}
				} catch (e) {
					// clear data
					this.props.clearUserListData();
				}
			}
		}

		if (unlockUserResponse !== prevProps.UsersListResult.unlockUserResponse) {
			// for show responce reinvite Data
			if (unlockUserResponse) {
				try {
					if (validateResponseNew({ response: unlockUserResponse })) {
						showAlert(R.strings.Success, unlockUserResponse.ReturnMsg, 0, () => {

							// clear data
							this.props.clearUserListData();
							// Call Users List Api
							this.onRefresh(true)
						});
					} else {
						// clear data
						this.props.clearUserListData();
					}
				} catch (e) {
					// clear data
					this.props.clearUserListData();
				}
			}
		}

		if (twoFaDisableResponse !== prevProps.UsersListResult.twoFaDisableResponse) {
			// for show responce reinvite Data
			if (twoFaDisableResponse) {
				try {
					if (validateResponseNew({ response: twoFaDisableResponse })) {
						showAlert(R.strings.Success, twoFaDisableResponse.ReturnMsg, 0, () => {

							// clear data
							this.props.clearUserListData();
							// Call Users List Api
							this.onRefresh(true)
						});
					} else {
						// clear data
						this.props.clearUserListData();
					}
				} catch (e) {
					// clear data
					this.props.clearUserListData();
				}
			}
		}
	}

	onUnlockPress = async (item) => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//call unlockUserApi
			this.props.unlockUserApi({
				UserId: item.UserId,
				DeviceId: await getDeviceID(),
				Mode: ServiceUtilConstant.Mode,
				IPAddress: await getIPAddress(),
				HostName: ServiceUtilConstant.hostName
			});
		}
	}

	onTwofaDisablePress = async (item) => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//call disableTwoFaApi
			this.props.disableTwoFaApi({
				UserId: item.UserId,
			});
		}
	}

	// if press on complete button api calling
	onComplete = async () => {

		//Check Validation of FromDate and ToDate
		if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
			return;
		}
		if (this.state.email.length > 0 && CheckEmailValidation(this.state.email)) {
			this.toast.Show(R.strings.Enter_Valid_Email);
			return;
		}
		if (this.state.mobile.length < 10 && CheckEmailValidation(this.state.mobile)) {
			this.toast.Show(R.strings.Valid_mobile);
			return;
		}

		this.request = {
			...this.request,
			PageNo: 0,
			Username: this.state.userName,
			Mobile: this.state.mobile,
			Email: this.state.email,
			IsAdmin: this.state.selectedUserTypeCode,
			FromDate: this.state.FromDate,
			ToDate: this.state.ToDate,
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getUsersList list
			this.props.getUsersList(this.request);
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({ selectedPage: 1 })
	}

	onReset = async () => {

		this.setState({
			searchInput: '',
			selectedPage: 1,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			userName: '',
			email: '',
			mobile: '',
			selectedUserType: R.strings.Please_Select,
			selectedUserTypeCode: '',
		})

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		// check internet connection
		if (await isInternet()) {

			// call user list api
			this.props.getUsersList({
				PageNo: 0,
				PageSize: AppConfig.pageSize,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
			})
		}
	}

	navigationDrawer() {
		// for show filter of fromdate, todate,Username, userNames, email, MobileNo and UserType data etc
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
						placeholder: R.strings.Username,
						returnKeyType: "next",
						multiline: false,
						keyboardType: 'default',
						header: R.strings.Username,
						onChangeText: (text) => { this.setState({ userName: text }) },
						value: this.state.userName,
					},
					{
						placeholder: R.strings.email,
						returnKeyType: "next",
						multiline: false,
						keyboardType: 'default',
						header: R.strings.email,
						onChangeText: (text) => { this.setState({ email: text }) },
						value: this.state.email,
					},
					{
						placeholder: R.strings.MobileNo,
						returnKeyType: "done",
						multiline: false,
						keyboardType: 'numeric',
						maxLength: 10,
						onlyDigit: true,
						validate: true,
						header: R.strings.MobileNo,
						onChangeText: (text) => { this.setState({ mobile: text }) },
						value: this.state.mobile,
					}
				]}
				pickers={[
					{
						title: R.strings.UserType,
						array: this.state.userTypes,
						selectedValue: this.state.selectedUserType,
						onPickerSelect: (index, object) => this.setState({ selectedUserType: index, selectedUserTypeCode: object.code })
					},
				]}
				onResetPress={this.onReset}
				onCompletePress={this.onComplete}
			/>
		)
	}


	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { UsersListLoading, ChangeUserStatusLoading, reinviteDataFetching, unlockUserFetching, twoFaDisableFetching } = this.props.UsersListResult;

		//for search
		let finalItems = this.state.UserListResponse.filter(item => (
			item.UserName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Email !== null && item.Email.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Mobile.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.lockedStatusText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

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

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.listUsers}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						rightIcon={R.images.FILTER}
						onSearchText={(text) => this.setState({ searchInput: text })}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					{/* Progress bar */}
					<ProgressDialog isShow={ChangeUserStatusLoading || reinviteDataFetching || unlockUserFetching || twoFaDisableFetching} />

					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						{
							(UsersListLoading && !this.state.refreshing) ?
								<ListLoader />
								:
								<FlatList
									data={finalItems}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) =>
										<UsersListItem
											item={item}
											index={index}
											size={finalItems.length}
											onEdit={() => this.onEditPress(item)}
											onActivePress={() => this.onUpdateStatus(item, 1)}
											onInactivePress={() => this.onUpdateStatus(item, 0)}
											onReinvitePress={() => this.onReinvitePress(item)}
											onUnlockPress={() => this.onUnlockPress(item)}
											onTwofaDisablePress={() => this.onTwofaDisablePress(item)}
											onDetailPress={() => this.props.navigation.navigate('UsersListDetailScreen', { item })}
										/>
									}
									// assign index as key valye to Transfer In History list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality In Transfer In History FlatList Item
									refreshControl={
										<RefreshControl
											colors={[R.colors.accent]}
											progressBackgroundColor={R.colors.background}
											refreshing={this.state.refreshing}
											onRefresh={() => this.onRefresh(true, true)}
										/>
									}
									contentContainerStyle={contentContainerStyle(finalItems)}
									ListEmptyComponent={<ListEmptyComponent />}
								/>
						}

						{/*To Set Pagination View  */}
						<View>
							{
								finalItems.length > 0 &&
								<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
							}
						</View>
					</View>
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
export class UsersListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item ||
			this.props.onActivePress !== nextProps.onActivePress ||
			this.props.onInactivePress !== nextProps.onInactivePress ||
			this.props.onReinvitePress !== nextProps.onReinvitePress ||
			this.props.onUnlockPress !== nextProps.onUnlockPress ||
			this.props.onTwofaDisablePress !== nextProps.onTwofaDisablePress)
			return true
		return false
	}

	render() {
		// Get required fields from props
		let { item, index, size } = this.props
		let statusTextColor = R.colors.accent, statusText = '', menuItems, menuActions, optionMenuShow = true
		let appendArray = false;

		if (item.Status == 0) {
			statusText = R.strings.inActive
			statusTextColor = R.colors.failRed
			menuItems = [R.strings.edit, R.strings.active]
			menuActions = [this.props.onEdit, this.props.onActivePress]
			appendArray = true
		}
		else if (item.Status == 1) {
			statusText = R.strings.Active
			statusTextColor = R.colors.successGreen
			menuItems = [R.strings.edit, R.strings.Inactive]
			menuActions = [this.props.onEdit, this.props.onInactivePress]
			appendArray = true
		}
		else if (item.Status == 2) {
			statusText = R.strings.Confirmed
			menuItems = [R.strings.edit, R.strings.active, R.strings.Inactive]
			menuActions = [this.props.onEdit, this.props.onActivePress, this.props.onInactivePress]
			appendArray = true
		}
		else if (item.Status == 3) {
			statusText = R.strings.Unconfirmed
			menuItems = [R.strings.edit, R.strings.active, R.strings.Inactive, R.strings.reinviteUser]
			menuActions = [this.props.onEdit, this.props.onActivePress, this.props.onInactivePress, this.props.onReinvitePress]
			appendArray = true
		}
		else if (item.Status == 4) {
			statusText = R.strings.Unassigned
			statusTextColor = R.colors.failRed
			optionMenuShow = false
		}
		else if (item.Status == 5) {
			statusText = R.strings.Suspended
			optionMenuShow = false
		}
		else if (item.Status == 6) {
			statusText = R.strings.Blocked
			optionMenuShow = false
		}
		else if (item.Status == 7) {
			statusText = R.strings.ReqDeleted
			optionMenuShow = false
		}
		else if (item.Status == 8) {
			statusText = R.strings.Suspicious
			optionMenuShow = false
		}
		else if (item.Status == 9) {
			statusText = R.strings.Delete
			statusTextColor = R.colors.failRed
			optionMenuShow = false
		}
		else if (item.Status == 10) {
			statusText = R.strings.PolicyViolated
			optionMenuShow = false
		}

		let lockedTitile = item.IsLockOut == 1 ? R.strings.unlockUser : null
		let lockedMethod = item.IsLockOut == 1 ? this.props.onUnlockPress : null

		let twoFaDisableTitle = item.TwoFactorEnabled == 1 ? R.strings.twoFaDisable : null
		let twofaDisableMethod = item.TwoFactorEnabled == 1 ? this.props.onTwofaDisablePress : null


		if (appendArray) {
			if (lockedMethod) {
				menuItems.push(lockedTitile)
				menuActions.push(lockedMethod)
			}
			if (twofaDisableMethod) {
				menuItems.push(twoFaDisableTitle)
				menuActions.push(twofaDisableMethod)
			}
		}
		return (

			// Animation applied on flatlist item
			<AnimatableItem>
				<View style={{
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						borderRadius: 0,
						flex: 1,
						elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
					}}
						onPress={this.props.onDetailPress}
					>

						<View style={{ flexDirection: 'row' }}>

							{/* icon for account */}
							<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
								<ImageTextButton
									icon={item.IsAdmin == 0 ? R.images.IC_FILL_USER : R.images.IC_ADMIN}
									style={{
										margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight,
										backgroundColor: item.IsAdmin == 0 ? R.colors.accent : R.colors.yellow, borderRadius: R.dimens.ButtonHeight
									}}
									iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
								/>
							</View>


							<View style={{ flex: 1, marginLeft: R.dimens.margin, }}>

								{/* for show UserName ,locked status ,menu icon */}
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

									<Text style={{
										flex: 1,
										fontSize: R.dimens.smallText,
										color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold,
									}}>{validateValue(item.UserName)}
									</Text>

									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-start' }}>

										<Text style={{
											fontSize: R.dimens.smallText, color: item.IsLockOut == 1 ? R.colors.failRed : R.colors.successGreen,
											fontFamily: Fonts.MontserratSemiBold,
											marginRight: R.dimens.WidgetPadding
										}}>{item.IsLockOut == 1 ? R.strings.locked : R.strings.unlocked}</Text>

										{
											optionMenuShow &&
											< View style={{ width: '10%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

												<OptionsMenu
													ref={component => {
														this.optionExchange = component;
													}}
													customButton={
														<ImageTextButton
															icon={R.images.VERTICAL_MENU}
															onPress={() => {
																this.optionExchange.handlePress();
															}}
															style={{ margin: 0, padding: 0, alignSelf: 'flex-end' }}
															iconStyle={{ tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
														/>}
													destructiveIndex={1}
													options={createOptions(menuItems)}
													actions={createActions(menuActions)}
												/>
											</View>}
									</View>
								</View>

								{/* for show Email  */}
								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Email + ': '}</TextViewHML>
									{<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Email)}</TextViewHML>}
								</View>
								{/* for show MobileNo  */}
								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.MobileNo + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Mobile)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status and detail icon */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.margin }}>
							<StatusChip
								color={statusTextColor}
								value={statusText}></StatusChip>

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									icon={R.images.RIGHT_ARROW_DOUBLE}
									style={{ margin: 0 }}
									iconStyle={{
										width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary
									}}
									onPress={this.props.onDetailPress} />
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem >
		)
	}
}

const mapStateToProps = (state) => {

	//Updated Data For UserListReducer Data 
	let UsersListResult = {
		...state.UserListReducer,
	}
	return { UsersListResult }
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Users List Action
	getUsersList: (payload) => dispatch(getUsersList(payload)),
	// To Perform Change User Status Action
	changeUserStatus: (payload) => dispatch(changeUserStatus(payload)),
	// To Perform clear data Action
	clearUserListData: () => dispatch(clearUserListData()),
	// To Perform reinvite Action
	reinviteUserApi: (payload) => dispatch(reinviteUserApi(payload)),
	// To Perform unlockUserApi Action
	unlockUserApi: (payload) => dispatch(unlockUserApi(payload)),
	// To Perform disableTwoFaApi Action
	disableTwoFaApi: (payload) => dispatch(disableTwoFaApi(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersListScreen);