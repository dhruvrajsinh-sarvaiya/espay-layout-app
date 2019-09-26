import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing, } from 'react-native'
import { changeTheme, parseArray, parseFloatVal, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getWithdrawalApprovalList, clearWithdrawalApprovalData } from '../../../actions/Wallet/WithdrawalApprovalActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue, isEmpty } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageViewWidget from '../../widget/ImageViewWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import FilterWidget from '../../widget/FilterWidget';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import AlertDialog from '../../../native_theme/components/AlertDialog';
import EditText from '../../../native_theme/components/EditText';

export class WithdrawalApprovalListScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			Status: [
				{ value: R.strings.select_status },
				{ ID: 0, value: R.strings.Pending },
				{ ID: 1, value: R.strings.accept },
				{ ID: 9, value: R.strings.Reject },
			],
			WithdrawalApprovalResponse: [],

			selectedStatus: R.strings.select_status,
			FromDate: '',
			ToDate: '',

			Bit: 1,
			ReqId: 0,
			TrnNo: '',
			Remarks: '',
			StatusId: 0,
			searchInput: '',
			askTwoFA: false,
			refreshing: false,
			isFirstTime: true,
			isDrawerOpen: false,
			isAlertShow: false,
			item: null,

			request: {},
		}

		// Create Reference
		this.drawer = React.createRef()

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

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

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Withdrawal Approval List Api
			this.props.getWithdrawalApprovalList()
		}
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearWithdrawalApprovalData()
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	// Reset Filter
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer();

		this.setState({
			TrnNo: '',
			FromDate: '',
			ToDate: '',
			selectedStatus: R.strings.select_status,
		})

		// check internet connection
		if (await isInternet()) {
			let req = {
				FromDate: '',
				ToDate: '',
				TrnNo: '',
				Status: '',
			}
			// Call Withdrawal Approval List Api
			this.props.getWithdrawalApprovalList(req)
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {

		// Both date required
		if (this.state.FromDate === "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate === "") {
			this.toast.Show(R.strings.bothDateRequired);
			return
		}

		// Check validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
		else {
			// Close Drawer user press on Complete button bcoz display flatlist item on Screen
			this.drawer.closeDrawer();

			// check internet connection
			if (await isInternet()) {
				// request url
				let req = {
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					TrnNo: this.state.TrnNo,
					Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
				}
				// Call Withdrawal Approval List Api
				this.props.getWithdrawalApprovalList(req)
			} else {
				this.setState({ refreshing: false });
			}

			//If Filter from Complete Button Click then empty searchInput
			this.setState({ searchInput: '' })
		}
	}

	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Withdrawal Approval
			let req = {
				TrnNo: this.state.TrnNo,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
			}
			// Call Get Withdrawal Approval API
			this.props.getWithdrawalApprovalList(req);

		} else {
			this.setState({ refreshing: false });
		}
	}

	onAcceptRejectPress = () => {
		if (isEmpty(this.state.Remarks))
			this.toastUpdate.Show(R.strings.enterRemarks)
		else {
			let req = {
				AdminReqId: parseIntVal(this.state.ReqId),
				Bit: this.state.Bit,
				Remarks: this.state.Remarks
			}
			this.setState({ isAlertShow: false, askTwoFA: true, request: req })
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (WithdrawalApprovalListScreen.oldProps !== props) {
			WithdrawalApprovalListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { WithdrawalApprovalList } = props.WithdrawalApprovalResult

			// WithdrawalApprovalList is not null
			if (WithdrawalApprovalList) {
				try {
					if (state.WithdrawalApprovalList == null || (state.WithdrawalApprovalList !== null && WithdrawalApprovalList !== state.WithdrawalApprovalList)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: WithdrawalApprovalList, isList: true, })) {

							return Object.assign({}, state, {
								WithdrawalApprovalList,
								WithdrawalApprovalResponse: parseArray(WithdrawalApprovalList.Data),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								WithdrawalApprovalList: null,
								WithdrawalApprovalResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						WithdrawalApprovalList: null,
						WithdrawalApprovalResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, _prevState) {
		//Get All Updated field of Particular actions
		const { AcceptRejWithdrawReq } = this.props.WithdrawalApprovalResult

		if (AcceptRejWithdrawReq !== prevProps.WithdrawalApprovalResult.AcceptRejWithdrawReq) {
			// AcceptRejWithdrawReq is not null
			if (AcceptRejWithdrawReq) {

				try {
					if (this.state.AcceptRejWithdrawReq == null || (this.state.AcceptRejWithdrawReq != null && AcceptRejWithdrawReq !== this.state.AcceptRejWithdrawReq)) {

						// Handle Response
						if (validateResponseNew({ response: AcceptRejWithdrawReq, isList: true })) {
							// Show success dialog
							showAlert(R.strings.status, AcceptRejWithdrawReq.ReturnMsg, 0, async () => {

								this.props.clearWithdrawalApprovalData()
								// Check NetWork is Available or not
								if (await isInternet()) {

									// Bind request for Withdrawal Approval
									let req = {
										TrnNo: this.state.TrnNo,
										FromDate: this.state.FromDate,
										ToDate: this.state.ToDate,
										Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
									}
									// Call Get Withdrawal Approval API
									this.props.getWithdrawalApprovalList(req);
								}
							})
							this.setState({ AcceptRejWithdrawReq })
						} else {
							// Show success dialog
							showAlert(R.strings.status, R.strings[`apiAcceptRejectWithdrawal.${AcceptRejWithdrawReq.ErrorCode}`], 1, () => {
								this.props.clearWithdrawalApprovalData()
							})
							this.setState({ AcceptRejWithdrawReq: null })
						}
					}
				} catch (error) {
					// clear reducer data
					this.props.clearWithdrawalApprovalData()
					this.setState({ AcceptRejWithdrawReq: null })
				}
			}
		}
	}

	// Drawer Navigation
	navigationDrawer() {

		return (
			// for show filter of fromdate, todate,currency and user data etc
			<FilterWidget
				isCancellable
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				ToDate={this.state.ToDate}
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0 }}
				textInputStyle={{ marginBottom: 0 }}
				pickers={[
					{
						title: R.strings.Status,
						array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, StatusId: object.ID })
					}
				]}
				textInputs={[
					{
						header: R.strings.transactionNo,
						placeholder: R.strings.transactionNo,
						multiline: false,
						keyboardType: 'numeric',
						returnKeyType: "done",
						maxLength: 5,
						onChangeText: (text) => { this.setState({ TrnNo: text }) },
						value: this.state.TrnNo,
					},

				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { WithdrawalApprovalLoading, } = this.props.WithdrawalApprovalResult

		// for searching
		let finalItems = this.state.WithdrawalApprovalResponse.filter(item => (
			item.Currency.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.ActionByUserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.TrnNo.toString().includes(this.state.searchInput) ||
			item.ActionByUserId.toString().includes(this.state.searchInput) ||
			item.Amount.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Withdrawal Approval Filteration
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
						isBack={true}
						title={R.strings.withdrawalApproval}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />

					{
						(WithdrawalApprovalLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <WithdrawalApprovalListItem
									index={index}
									item={item}
									size={finalItems.length}
									onPress={() => this.props.navigation.navigate('WithdrawalApprovalDetailScreen', { item })}
									onAcceptPress={() => this.setState({ isAlertShow: true, Bit: 1, ReqId: item.AdminReqId, Remarks: '' })}
									onRejectPress={() => this.setState({ isAlertShow: true, Bit: 9, ReqId: item.AdminReqId, Remarks: '' })} />
								}
								// assign index as key value to Withdrawal Approval list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Withdrawal Approval FlatList Item
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

					<AlertDialog
						visible={this.state.isAlertShow}
						title={R.strings.areYouSureYouWantToProceed}
						negativeButton={{
							title: R.strings.no,
							onPress: () => this.setState({ isAlertShow: !this.state.isAlertShow, Remarks: '' })
						}}
						positiveButton={{
							title: R.strings.yes_text,
							onPress: () => this.onAcceptRejectPress(),
							//disabled: UpdateIpWhitelistisFetching,
							progressive: false
						}}
						requestClose={() => null}
						toastRef={component => this.toastUpdate = component}>

						{/* Input of Remarks */}
						<EditText
							isRequired={true}
							header={R.strings.remarks}
							placeholder={R.strings.remarks}
							multiline={false}
							keyboardType='default'
							returnKeyType={"done"}
							onChangeText={(item) => this.setState({ Remarks: item })}
							value={this.state.Remarks}
						/>

					</AlertDialog>

					<LostGoogleAuthWidget
						generateTokenApi={4}
						navigation={this.props.navigation}
						isShow={this.state.askTwoFA}
						ApiRequest={this.state.request}
						onShow={() => this.setState({ askTwoFA: true })}
						onCancel={() => this.setState({ askTwoFA: false })}
					/>
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class WithdrawalApprovalListItem extends Component {

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
		let { size, index, item, onAcceptPress, onRejectPress, onPress } = this.props

		// Change status color at runtime
		let color = R.colors.accent
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 9)
			color = R.colors.failRed

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1,marginRight: R.dimens.widget_left_right_margin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						borderRadius: 0,
						flex: 1,
						borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,borderBottomLeftRadius: R.dimens.margin,
					}} onPress={onPress}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.Currency ? item.Currency : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* for show username,amount and currency */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.Currency}</Text>

									<View style={{ flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
											{(parseFloatVal(item.Amount) !== 'NaN' ? validateValue(item.Amount) : '-')}
										</Text>
										<ImageTextButton
											icon={R.images.RIGHT_ARROW_DOUBLE}
											style={{ padding: 0, margin: 0, }}
											iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								{/* User Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Username + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.ActionByUserName)}</TextViewHML>
								</View>

								{/* Transaction No */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.transactionNo + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.TrnNo)}</TextViewHML>
								</View>

								{/* User Id */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.userId + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.ActionByUserId)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status and accept and reject icon */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip color={color} value={item.StrStatus ? item.StrStatus : '-'} />

							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
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
									onPress={onAcceptPress} />
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: R.colors.failRed,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation,
										}}
									icon={R.images.IC_CANCEL}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={onRejectPress} />

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
		// get withdraw approval data from reducer
		WithdrawalApprovalResult: state.WithdrawalApprovalReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Withdraw Approval Action
	getWithdrawalApprovalList: (payload) => dispatch(getWithdrawalApprovalList(payload)),
	// To Clear Withdrawal Approval List
	clearWithdrawalApprovalData: () => dispatch(clearWithdrawalApprovalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawalApprovalListScreen)