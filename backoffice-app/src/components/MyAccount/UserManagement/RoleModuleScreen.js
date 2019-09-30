import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, addPages, parseArray, showAlert } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { getRoleModuleList, changeRoleStatus, clearRoleModuleData } from '../../../actions/account/UserManagementActions';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';
import ListLoader from '../../../native_theme/components/ListLoader';
import PaginationWidget from '../../widget/PaginationWidget';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import AlertDialog from '../../../native_theme/components/AlertDialog';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class RoleModuleScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			RoleModuleResponse: [],
			row: [],
			selectedPage: 1,
			refreshing: false,
			searchInput: '',
			AlertData: {
				title: '',
				description: '',
				btnText: ''
			},
			isShowAlert: false,
			RoleId: 0,
			Status: 0,
			isFirstTime: true,
		};

		this.Request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// Stop twice api calling
		return isCurrentScreen(nextProps)
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme()
		// Call Role Module List Api
		this.roleModuleListApi()
	};

	roleModuleListApi = async () => {
		// Check internet connection
		if (await isInternet()) {
			// Call Role Module List Api
			this.props.getRoleModuleList(this.Request)
		}
	}

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {
		if (this.state.selectedPage !== pageNo) {
			this.setState({ selectedPage: pageNo });

			this.Request = {
				...this.Request,
				PageNo: pageNo - 1,
			}

			// Call Role Module List Api
			this.roleModuleListApi()
		}
	}

	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			// Call Rule Module List
			this.props.getRoleModuleList(this.Request);
		}
		else {
			this.setState({ refreshing: false });
		}
	}

	// Call when user press on edit button from flatlist item
	onEditPress = (item) => {
		let { navigate } = this.props.navigation

		//redrict edit screen for role module
		navigate('AddEditRoleModuleScreen', { item, onRefresh: this.onRefresh })
	}

	changeRoleStatus = async () => {
		this.setState({ isShowAlert: false })
		// Check internet connection
		if (await isInternet()) {
			let Req = {
				RoleId: this.state.RoleId,
				Status: this.state.Status
			}

			// Change Role Status Api Call
			this.props.changeRoleStatus(Req)
		}
	}

	openAlert = (roleId, status) => {
		var alertData = Object.assign({}, this.state.AlertData)

		//for show title decription and button text based on status
		if (status == 0) {
			alertData['title'] = R.strings.DisableRole
			alertData['description'] = R.strings.DisableRoleDesc
			alertData['btnText'] = R.strings.Disable
		}

		if (status == 1) {
			alertData['title'] = R.strings.EnableRole
			alertData['description'] = R.strings.EnableRoleDesc
			alertData['btnText'] = R.strings.Enable
		}

		if (status == 9) {
			alertData['title'] = R.strings.DeleteRole
			alertData['description'] = R.strings.DeleteRoleDesc
			alertData['btnText'] = R.strings.Delete
		}

		this.setState({ AlertData: alertData, RoleId: roleId, Status: status, isShowAlert: true })
	}

	componentDidUpdate(prevProps, _prevState) {
		const { ChangeRoleStatus } = this.props.RoleModuleListResult

		if (ChangeRoleStatus !== prevProps.RoleModuleListResult.ChangeRoleStatus) {
			// ChangeRoleStatus is not null
			if (ChangeRoleStatus) {
				try {
					if (this.state.ChangeRoleStatus == null || (this.state.ChangeRoleStatus != null && ChangeRoleStatus !== this.state.ChangeRoleStatus)) {
						if (validateResponseNew({ response: ChangeRoleStatus })) {

							this.setState({ ChangeRoleStatus })
							showAlert(R.strings.status, ChangeRoleStatus.ReturnMsg, 0, () => {

								//clear data
								this.props.clearRoleModuleData()

								this.Request = {
									PageNo: 0,
									PageSize: AppConfig.pageSize
								}

								// Call Role Module List Api
								this.roleModuleListApi()
							})
						}
					}
				} catch (error) {

					//clear data
					this.props.clearRoleModuleData()
				}
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
		if (RoleModuleScreen.oldProps !== props) {
			RoleModuleScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated field of Particular actions
			const { RoleModuleListData } = props.RoleModuleListResult

			// RoleModuleListData is not null
			if (RoleModuleListData) {
				try {
					if (state.RoleModuleListData == null || (state.RoleModuleListData != null && RoleModuleListData !== state.RoleModuleListData)) {

						if (validateResponseNew({ response: RoleModuleListData, isList: true })) {
							//check Role Module List Response is an Array Or not
							//If Response is Array then Direct set in state otherwise convert response to Array form then set state.
							let finalRes = parseArray(RoleModuleListData.Details);

							//add static status in reponse
							finalRes.map((item, index) => {
								let text = ''
								if (item.Status == 9)
									text = R.strings.Delete
								else if (item.Status == 0)
									text = R.strings.Inactive
								else if (item.Status == 1)
									text = R.strings.Active
								finalRes[index].StatusText = text
							})

							return Object.assign({}, state, {
								RoleModuleListData,
								RoleModuleResponse: finalRes,
								refreshing: false,
								row: addPages(RoleModuleListData.TotalCount)
							})
						} else {
							return Object.assign({}, state, { RoleModuleListData: null, RoleModuleResponse: [], refreshing: false, row: [] })
						}
					}
				} catch (error) {
					return Object.assign({}, state, { RoleModuleListData: null, RoleModuleResponse: [], refreshing: false, row: [] })
				}
			}
		}
		return null
	}

	render() {
		let { RoleModuleListLoading, ChangeRoleStatusLoading } = this.props.RoleModuleListResult

		let finalItems = this.state.RoleModuleResponse.filter(item => (
			item.RoleName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StatusText.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())
		))
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* Statusbar of Role Module List */}
				<CommonStatusBar />

				{/* Custom Toolbar of Role Module List */}
				<CustomToolbar
					title={R.strings.ListRoles}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })}
				/>

				{/* Progressbar */}
				<ProgressDialog isShow={ChangeRoleStatusLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(RoleModuleListLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<View style={{ flex: 1 }}>
								<FlatList
									showsVerticalScrollIndicator={false}
									data={finalItems}
									renderItem={({ item, index }) => {
										return <RoleModuleItem
											item={item}
											index={index}
											size={this.state.RoleModuleResponse.length}
											onEditPress={() => this.onEditPress(item)}
											onActivePress={() => this.openAlert(item.RoleID, 1)}
											onInActivePress={() => this.openAlert(item.RoleID, 0)}
											onDetailPress={() => this.props.navigation.navigate('RoleModuleDetailScreen', { item })}
											onDeletePress={() => this.openAlert(item.RoleID, 9)}
											onUserAssignRolePress={() => this.props.navigation.navigate('UserAssignRoleScreeen', { item, onRefresh: this.onRefresh })}
										/>

									}}
									refreshing={this.state.refreshing}
									refreshControl={
										<RefreshControl
											progressBackgroundColor={R.colors.background}
											colors={[R.colors.accent]}
											onRefresh={() => this.onRefresh(true, true)}
											refreshing={this.state.refreshing}
										/>
									}
									keyExtractor={(_item, index) => index.toString()}
									ListEmptyComponent={<ListEmptyComponent />}
									contentContainerStyle={contentContainerStyle(finalItems)}
								/>
							</View>
					}

					{/*To Set Pagination View  */}
					<View>
						{
							finalItems.length > 0 &&
							<PaginationWidget
								onPageChange={(item) => { this.onPageChange(item) }}
								selectedPage={this.state.selectedPage}
								row={this.state.row}
							/>
						}
					</View>
				</View>

				{/* Alert for Enable, Disable and Delete Role */}
				<AlertDialog
					visible={this.state.isShowAlert}
					title={this.state.AlertData.title}
					negativeButton={{
						title: R.strings.cancel,
						onPress: () => this.setState({ isShowAlert: !this.state.isShowAlert, })
					}}
					positiveButton={{
						title: this.state.AlertData.btnText,
						onPress: () => this.changeRoleStatus(),
						disabled: ChangeRoleStatusLoading,
						progressive: false
					}}
					requestClose={() => null}
					toastRef={component => this.toastDialog = component}>
					{/* Description */}
					<Text style={{
						paddingTop: R.dimens.WidgetPadding,
						paddingBottom: R.dimens.WidgetPadding,
						color: R.colors.textPrimary,
						fontSize: R.dimens.smallText,
					}}> {this.state.AlertData.description}</Text>
				</AlertDialog>
			</SafeView>
		);
	}
}

class RoleModuleItem extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//Check If Old Props and New Props are Equal then do not render component
		if (this.props.item !== nextProps.item)
			return true
		return false
	}

	render() {
		let { item, size, index } = this.props
		let color = R.colors.accent

		//set status color based on status
		if (item.Status == 9) {
			color = R.colors.failRed
		}
		else if (item.Status == 1) {
			color = R.colors.successGreen
		}
		else if (item.Status == 0) {
			color = R.colors.yellow
		}

		return (
			// Flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ?
						R.dimens.widget_top_bottom_margin :
						R.dimens.widgetMargin,
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,
						flex: 1, borderRadius: 0, borderBottomLeftRadius: R.dimens.margin,
					}}>
						<View style={{ flexDirection: 'row' }}>

							<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>

								{/* icon for list */}
								<ImageTextButton
									icon={R.images.ic_list_alt}
									style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
									iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
								/>
							</View>
							{/* for show RoleName , RoleDescription */}
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.RoleName ? item.RoleName : '-'}</TextViewHML>
								<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.RoleDescription + ': '}</TextViewHML>
								<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.RoleDescription ? item.RoleDescription : '-'}</TextViewHML>
							</View>
						</View>

						{/* for show status,edit actions delete */}
						<View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StatusText}></StatusChip>

							<View style={{ flexDirection: 'row' }}>

								<ImageTextButton
									style={
										{
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
									onPress={this.props.onEditPress} />

								{
									item.Status != 1 &&
									<ImageTextButton
										style={
											{
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: R.colors.successGreen,
												borderRadius: R.dimens.titleIconHeightWidth,
												margin: 0,
												padding: R.dimens.CardViewElivation,
												marginRight: R.dimens.widgetMargin,
											}}
										icon={R.images.IC_CHECKMARK}
										iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
										onPress={this.props.onInActivePress} />
								}
								{
									item.Status == 1 &&
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
										icon={R.images.IC_CANCEL}
										iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
										onPress={this.props.onActivePress} />

								}
								{
									item.Status != 9 &&
									<ImageTextButton
										style={
											{
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: R.colors.failRed,
												borderRadius: R.dimens.titleIconHeightWidth,
												margin: 0,
												padding: R.dimens.CardViewElivation,
												marginRight: R.dimens.widgetMargin,
											}}
										icon={R.images.IC_DELETE}
										iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
										onPress={this.props.onDeletePress} />
								}
								{/* 	{
									item.Status == 1 && */}
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: R.colors.leaderListEdit,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation,
											marginRight: R.dimens.widgetMargin,
										}}
									onPress={this.props.onDetailPress}
									icon={R.images.IC_EYE_FILLED}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								/>
								{/* 	} */}
								{
									item.Status == 1 &&
									<ImageTextButton
										style={
											{
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: R.colors.yellow,
												borderRadius: R.dimens.titleIconHeightWidth,
												margin: 0,
												padding: R.dimens.CardViewElivation,
											}}
										onPress={this.props.onUserAssignRolePress}
										icon={R.images.IC_CLIPBOARD_CHECKLIST}
										iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									/>
								}
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

// return state from saga or reducer
const mapStateToProps = (state) => {
	return {
		RoleModuleListResult: state.UserManagementReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Rule module list
	getRoleModuleList: (payload) => dispatch(getRoleModuleList(payload)),
	// Change role status
	changeRoleStatus: (payload) => dispatch(changeRoleStatus(payload)),
	// Clear role module detail
	clearRoleModuleData: () => dispatch(clearRoleModuleData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RoleModuleScreen);
