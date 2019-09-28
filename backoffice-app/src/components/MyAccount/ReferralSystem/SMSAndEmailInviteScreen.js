import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Easing } from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, convertDate, convertTime } from '../../../controllers/CommonUtils';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { getReferralPaytype, getReferralService } from '../../../actions/PairListAction';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { getAdminRefChannelList } from '../../../actions/account/ReferralSystemAction';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class SMSAndEmailInviteScreen extends Component {
	constructor(props) {
		super(props);
		let referralChannelTypeId = props.navigation.state.params ? props.navigation.state.params.ReferralChannelTypeId : 0
		this.state = {
			SMSInviteResponse: [],
			flag: true,
			row: [],
			selectedPage: 1,
			refreshing: false,
			searchInput: '',
			FromDate: '',
			ToDate: '',
			UserName: '',
			selectedPayType: R.strings.Please_Select,
			selectedPayTypeId: 0,
			selectedServiceSlab: R.strings.Please_Select,
			selectedServiceSlabId: 0,
			referralChannelTypeId: referralChannelTypeId,
			isFirstTime: true,
			payTypes: [{ value: R.strings.Please_Select }],
			serviceSlabTypes: [{ value: R.strings.Please_Select }]
		};

		//initial request
		this.Request = {
			ReferralChannelTypeId: referralChannelTypeId,
			PageIndex: 1,
			Page_Size: AppConfig.pageSize,
		}

		// Create Ref
		this.drawer = React.createRef();
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		// Stop twice api calling
		return isCurrentScreen(nextProps);
	};

	componentDidMount = async () => {
		// Change theme as per night or light theme which is stored by user
		changeTheme()

		// Check internet connection
		if (await isInternet()) {

			// Call SMS Invite List Api
			this.props.getAdminRefChannelList(this.Request)
			// Call Referral PayType Api
			this.props.getReferralPaytype()
			// Call Service Slab Type Api
			this.props.getReferralService({ PayTypeId: 0 })
		}
	}

	// Reset value of drawer widget
	onResetPress = async () => {
		// Close Drawer
		this.drawer.closeDrawer();
		// change state to empty
		this.setState({
			selectedPayType: R.strings.Please_Select,
			selectedServiceSlab: R.strings.Please_Select,
			FromDate: '',
			selectedPayTypeId: 0,
			selectedServiceSlabId: 0,
			ToDate: '',
			UserName: '',
		})

		//Check NetWork is Available or not
		if (await isInternet()) {

			this.Request = {
				...this.Request,
				ReferralPayTypeId: 0,
				FromDate: '',
				ReferralServiceId: 0,
				UserName: '',
				ToDate: '',
			}

			//Call Get SMS Invite API
			this.props.getAdminRefChannelList(this.Request);
		}
	}

	// Called when user press on complete button from drawer
	onCompletePress = async () => {

		//Check All From Date Validation
		if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {

			this.toast.Show(R.strings.bothDateRequired);
			return
		}

		if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {

			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
		} else {

			this.drawer.closeDrawer();

			this.Request = {
				...this.Request,
				FromDate: this.state.FromDate,
				ReferralPayTypeId: R.strings.Please_Select === this.state.selectedPayType ? 0 : this.state.selectedPayTypeId,
				ToDate: this.state.ToDate,
				UserName: this.state.UserName,
				ReferralServiceId: R.strings.Please_Select === this.state.selectedServiceSlab ? 0 : this.state.selectedServiceSlabId
			}

			// Check internet connection
			if (await isInternet()) {

				// Call SMS Invite Api with filteration
				this.props.getAdminRefChannelList(this.Request)
			}
		}
	}

	onPayTypeChange = async (item, object) => {
		try {

			if (item !== R.strings.Please_Select) {

				if (object.Id != this.state.selectedPayTypeId) {

					//Check NetWork is Available or not
					if (await isInternet()) {

						// Referral Service Slab Api Call
						this.props.getReferralService({ PayTypeId: object.Id })

						this.setState({ flag: false, selectedPayType: item, selectedPayTypeId: object.Id, selectedServiceSlab: R.strings.Please_Select })
					}
				}
			} else {
				this.setState({ selectedPayType: item, selectedPayTypeId: 0, selectedServiceSlab: R.strings.Please_Select })
			}
		} catch (error) {

		}
	}

	onRefresh = async () => {
		this.setState({ refreshing: true });
		// Check internet connection
		if (await isInternet()) {
			// Call SMS Invite Api
			this.props.getAdminRefChannelList(this.Request)
		} else {
			this.setState({ refreshing: false })
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
		if (SMSAndEmailInviteScreen.oldProps !== props) {
			SMSAndEmailInviteScreen.oldProps = props;

		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated field of Particular actions
			const { AdminRefChannelData, } = props.AdminReferralList
			const { referralServiceData, referralPaytypeData } = props.PairListData

			// AdminRefChannelData is not null
			if (AdminRefChannelData) {
				try {

					if (state.AdminRefChannelData == null || (state.AdminRefChannelData != null && AdminRefChannelData !== state.AdminRefChannelData)) {

						if (validateResponseNew({ response: AdminRefChannelData, isList: true })) {
							//check Admin Referral Channel List is an Array Or not

							//If Response is Array then Direct set in state otherwise conver response to Array form then set state.
							let res = parseArray(AdminRefChannelData.ReferralChannelList)

							return Object.assign({}, state, {
								SMSInviteResponse: res,
								AdminRefChannelData,
								refreshing: false
							})
						}
					}
				} catch (error) {

					return Object.assign({}, state, {
						SMSInviteResponse: [],
						AdminRefChannelData: null,
						refreshing: false
					})
				}
			}

			// referralPaytypeData
			if (referralPaytypeData) {
				try {

					if (state.referralPaytypeData == null || (state.referralPaytypeData != null && referralPaytypeData !== state.referralPaytypeData)) {

						// Handle response
						if (validateResponseNew({ response: referralPaytypeData, isList: true })) {
							// Fill dropdown data
							let res = parseArray(referralPaytypeData.ReferralPayTypeDropDownList)

							res.map((item, index) => {
								res[index].Id = item.Id;
								res[index].value = item.PayTypeName;
							})

							let payTypes = [
								{ value: R.strings.Please_Select },
								...res
							];

							return Object.assign({}, state, {
								referralPaytypeData,
								payTypes,
							})

						} else {
							return Object.assign({}, state, {
								referralPaytypeData: null,
								payTypes: [{ value: R.strings.Please_Select }],
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						referralPaytypeData: null,
						payTypes: [{ value: R.strings.Please_Select }],
					})
				}
			}

			// referralServiceData is not null
			if (referralServiceData) {
				try {
					if (state.referralServiceData == null || (state.referralServiceData != null && referralServiceData !== state.referralServiceData)) {
						// Handle response
						if (validateResponseNew({ response: referralServiceData, isList: true })) {
							// Fill dropdown data

							let res = parseArray(referralServiceData.ReferralServiceDropDownList)
							res.map((item, index) => {
								res[index].Id = item.Id;
								res[index].value = item.ServiceSlab;
							})

							let serviceSlabTypes = [
								{ value: R.strings.Please_Select },
								...res
							]

							return Object.assign({}, state, {
								referralServiceData,
								serviceSlabTypes,
							})
						} else {
							return Object.assign({}, state, {
								referralServiceData: null,
								serviceSlabTypes: [],
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						referralServiceData: null,
						serviceSlabTypes: [],
					})
				}
			}
		}
		return null
	}

	navigationDrawer = () => {
		return (
			<FilterWidget
				ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
				FromDate={this.state.FromDate}
				onCompletePress={this.onCompletePress}
				toastRef={component => this.toast = component}
				ToDate={this.state.ToDate}
				onResetPress={this.onResetPress}
				FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
				textInputs={[
					{
						header: R.strings.UserName,
						onChangeText: (text) => { this.setState({ UserName: text }) },
						keyboardType: 'default',
						returnKeyType: "done",
						value: this.state.UserName,
						multiline: false,
						placeholder: R.strings.UserName,
					},
				]}
				firstPicker={{
					selectedValue: this.state.selectedPayType,
					array: this.state.payTypes,
					title: R.strings.PayType,
					onPickerSelect: (item, object) => { this.onPayTypeChange(item, object) }
				}}
				secondPicker={{
					selectedValue: this.state.selectedServiceSlab,
					array: this.state.serviceSlabTypes,
					onPickerSelect: (item, object) => this.setState({ selectedServiceSlab: item, selectedServiceSlabId: object.Id }),
					title: R.strings.ServiceSlab,
				}}
				comboPickerStyle={{ marginTop: R.dimens.LineHeight, }}
			/>
		)
	}

	render() {

		//set screen title
		let actionbarTitle = ''

		if (this.state.referralChannelTypeId == 1)
			actionbarTitle = R.strings.emailInvite
		else if (this.state.referralChannelTypeId == 2)
			actionbarTitle = R.strings.smsInvite

		let { AdminRefChannelLoading } = this.props.AdminReferralList
		let { isLoadingReferralService } = this.props.PairListData

		// for seraching
		let finalItems = this.state.SMSInviteResponse.filter(item => (
			item.UserName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.PayTypeName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.ChannelTypeName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.ReferralReceiverAddress.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())
		))
		return (
			//DrawerLayout for SMSInvite History Filteration
			<Drawer
				ref={cmpDrawer => this.drawer = cmpDrawer}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerContent={this.navigationDrawer()}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				easingFunc={Easing.ease}>

				<SafeView style={this.styles().container}>
					{/* Statusbar for SMSInvite  */}
					<CommonStatusBar />

					{/* CustomToolbar for SMSInvite */}
					<CustomToolbar
						title={actionbarTitle}
						isBack={true}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()} />

					{/* Progress bar for Referral Service Slab Dropdown */}
					{
						(!this.state.flag) &&
						<ProgressDialog isShow={isLoadingReferralService} />
					}

					<View style={{ flex: 1, }}>

						<View style={{ flex: 1, paddingBottom: R.dimens.WidgetPadding }}>
							{
								(AdminRefChannelLoading && !this.state.refreshing) ?
									<ListLoader />
									:
									<FlatList
										data={finalItems}
										showsVerticalScrollIndicator={false}
										renderItem={({ item, index }) => {
											return <SMSAndEmailInviteItem
												item={item}
												size={finalItems.length}
												index={index}
												icon={this.state.referralChannelTypeId == 1 ? R.images.IC_EMAIL_FILLED : R.images.IC_SMS_LOGO}
											/>
										}}
										keyExtractor={(item, index) => index.toString()}
										refreshControl={
											<RefreshControl
												colors={[R.colors.accent]}
												progressBackgroundColor={R.colors.background}
												refreshing={this.state.refreshing}
												onRefresh={this.onRefresh}
											/>
										}
										contentContainerStyle={contentContainerStyle(finalItems)}
										ListEmptyComponent={<ListEmptyComponent />}
									/>
							}
						</View>
					</View>

				</SafeView>
			</Drawer>
		);
	}

	styles = () => {

		return {

			container: {
				flex: 1, backgroundColor: R.colors.background,
			},
			headerContainer: {
				paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding,
				paddingTop: R.dimens.widgetMargin,
				flexDirection: "row", paddingBottom: R.dimens.widgetMargin
			},
			contentItem: {
				fontSize: R.dimens.smallestText,
				flex: 1, color: R.colors.textPrimary,
			}
		}
	}
}

export class SMSAndEmailInviteItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False

		if (this.props.item === nextProps.item) {
			return false
		}
		return true
	}

	render() {
		let { item, size, index, icon } = this.props
		return (
			// Flatlist item animation

			<AnimatableItem>
				<View style={{
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>

					<CardView style={{
						elevation: R.dimens.listCardElevation,
						flex: 1,
						borderRadius: 0,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

							{/* for show email or message icon */}
							<ImageTextButton
								icon={icon}
								iconStyle={{
									width: R.dimens.dashboardMenuIcon,
									height: R.dimens.dashboardMenuIcon,
									tintColor: R.colors.white
								}}
								style={{
									justifyContent: 'center', alignSelf: 'flex-start',
									width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight,
									margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight
								}}
							/>

							{/* for show ReferralReceiverAddress ,PayType,Description  */}
							<View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>
									{R.strings.invited} {item.ReferralReceiverAddress ? item.ReferralReceiverAddress : ''} {R.strings.via} {item.ChannelTypeName ? item.ChannelTypeName : '-'}</Text>
								<TextViewHML style={this.styles().titleStyle}>{R.strings.PayType + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.PayTypeName ? item.PayTypeName : '-'}</TextViewHML></TextViewHML>
								<TextViewHML style={this.styles().valueStyle}>{item.Description ? item.Description : '-'}</TextViewHML>
							</View>
						</View>

						{/* for show time */}
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
							<ImageTextButton
								style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
								icon={R.images.IC_TIMER}
								iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
							/>
							<TextViewHML style={this.styles().titleStyle}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}

	styles = () => {
		return {
			titleStyle: {
				color: R.colors.textSecondary, fontSize: R.dimens.smallestText,
			},
			valueStyle: {
				fontSize: R.dimens.smallestText,
				color: R.colors.textPrimary,
			}
		}
	}
}

function mapStateToProps(state) {
	//Updated data for reducer

	return {
		AdminReferralList: state.ReferralSystemReducer,
		PairListData: state.pairListReducer,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// SMS Invite List

		getAdminRefChannelList: (payload) => dispatch(getAdminRefChannelList(payload)),

		// Pay Type

		getReferralPaytype: () => dispatch(getReferralPaytype()),

		// Service Slab Type

		getReferralService: (payload) => dispatch(getReferralService(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SMSAndEmailInviteScreen)
