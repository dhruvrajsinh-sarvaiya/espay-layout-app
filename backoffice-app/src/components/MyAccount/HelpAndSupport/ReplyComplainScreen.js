import React, { Component, PureComponent } from 'react';
import { View, Text, FlatList, RefreshControl, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, getDeviceID, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import { getComplainById, replyComplain, replyClearData } from '../../../actions/account/HelpAndSupportActions';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { ServiceUtilConstant, Fonts } from '../../../controllers/Constants';
import { getData } from '../../../App';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ListLoader from '../../../native_theme/components/ListLoader';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../../components/widget/ComboPickerWidget';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import EditText from '../../../native_theme/components/EditText';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import Button from '../../../native_theme/components/Button';
import TextViewHML from '../../../native_theme/components/TextViewHML';

class ReplyComplainScreen extends Component {
	constructor(props) {
		super(props)

		// Getting data from previous screen 
		let { params } = props.navigation.state

		// Define initial state
		this.state = {
			ComplainId: params && params.ComplainId,
			Subject: params && params.Subject,

			ComplainListResponse: [],
			refreshing: false,
			ReplyMessage: '',
			Remarks: '',
			Status: [
				{ value: R.strings.open, id: 1 },
				{ value: R.strings.Close, id: 2 },
				{ value: R.strings.Pending, id: 3 },
			],
			selectedStatus: R.strings.open,
			isFirstTime: true,
			statusId: 0,

			tabNames: [R.strings.reply, R.strings.ChatHistory],
		}

		// Create reference
		this.toast = React.createRef();
		this.flatList = React.createRef();

		// for focus on next field
		this.inputs = {};
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// Call complain id api
		this.callComplainIdApi()
	}

	callComplainIdApi = async () => {
		// Check internet connection
		if (await isInternet()) {

			// Called Complain By Id Api
			this.props.getComplainById({ ComplainId: this.state.ComplainId })
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			// call api for related complain id 
			this.props.getComplainById({ ComplainId: this.state.ComplainId })
		}
		else {
			this.setState({ refreshing: false });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		// stop twice api call
		return isCurrentScreen(nextProps)
	}

	// After reply complain, clear data and call api
	clearSendData = async () => {
		// clear state
		this.setState({ ReplyMessage: '', Remarks: '' })

		// Clear Reply Data Api
		this.props.replyClearData()
	}

	// Call api after check all validation
	onReplyPress = async () => {

		if (isEmpty(this.state.Remarks))
			this.toast.Show(R.strings.enterRemarks);
		else if (isEmpty(this.state.ReplyMessage)) {
			this.toast.Show(R.strings.msgblankvalidation);
		} else {

			//Check NetWork is Available or not
			if (await isInternet()) {

				let request = {
					ComplainId: this.state.ComplainId,
					Description: this.state.ReplyMessage,
					Remark: this.state.Remarks,
					ComplainstatusId: this.state.statusId,
					DeviceId: await getDeviceID(),
					Mode: ServiceUtilConstant.Mode,
					HostName: ServiceUtilConstant.hostName,
					//Note : ipAddress parameter is passed in its saga.
				}

				// Called Reply Complain Api
				this.props.replyComplain(request)
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {

		//Get All Updated field of Particular actions
		const { ReplyComplainData } = this.props.ComplainListResult

		if (ReplyComplainData !== prevProps.ComplainListResult) {

			if (ReplyComplainData) {
				//if local ComplaintByIdData state is null or its not null and also different then new response then and only then validate response.
				if (this.state.ReplyComplainData == null || (this.state.ReplyComplainData != null && ReplyComplainData !== this.state.ReplyComplainData)) {

					try {
						if (validateResponseNew({ response: ReplyComplainData })) {

							this.setState({ ReplyComplainData })

							// Clear state and reducer data
							this.clearSendData()
							// Call complain Id Api
							this.callComplainIdApi()
						} else {
							this.setState({ ReplyComplainData: null })
							// Clear state and reducer data
							this.clearSendData()
						}
					} catch (error) {
						this.setState({ ReplyComplainData: null })
						// Clear state and reducer data
						this.clearSendData()
					}
				}
			}
		}
	}

	//this Method is used to focus on next feild 
	focusNextField(id) {
		this.inputs[id].focus();
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {
		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, }
		}

		// To Skip Render if old and new props are equal
		if (ReplyComplainScreen.oldProps !== props) {
			ReplyComplainScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated field of Particular actions
			const { ComplainByIdData, } = props.ComplainListResult

			// ComplainByIdData is not null
			if (ComplainByIdData) {
				try {

					//if local ComplainByIdData state is null or its not null and also different then new response then and only then validate response.
					if (state.ComplainByIdData == null || (state.ComplainByIdData != null && ComplainByIdData !== state.ComplainByIdData)) {

						// Check success/failure response and fill state
						if (validateResponseNew({ response: ComplainByIdData })) {
							// Getting user name from preference
							let currentUsername = getData(ServiceUtilConstant.LOGINUSERNAME)
							let res = parseArray(ComplainByIdData.CompainAllData.CompainTrailData)

							for (var complainData in res) {
								let item = res[complainData]
								// check current user name to other user
								item.isExistingUser = currentUsername === item.Username
							}

							return Object.assign({}, state, { ComplainListResponse: res, refreshing: false, ComplainByIdData })

						} else {
							return Object.assign({}, state, { ComplainListResponse: [], refreshing: false, ComplainByIdData: null })
						}
					}
				} catch (error) {
					return Object.assign({}, state, { ComplainListResponse: [], refreshing: false, ComplainByIdData: null })
				}
			}
		}
		return null
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { ComplainByIdLoading, ReplyComplainLoading } = this.props.ComplainListResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
				{/* Common Statusbar for Raise Complain */}
				<CommonStatusBar />

				{/* CustomToolbar for Raise Complain */}
				<CustomToolbar
					title={R.strings.Reply_Complain}
					isBack={true}
					nav={this.props.navigation}
				/>

				{/* For Progressbar */}
				<ProgressDialog isShow={ReplyComplainLoading} />

				{/* Common Toast */}
				<CommonToast ref={component => this.toast = component} />

				<View style={{ flex: 1, }}>
					{/* View Pager Indicator (Tab) */}
					<IndicatorViewPager
						ref='ReplyComplainTab'
						titles={this.state.tabNames}
						numOfItems={2}
						isGradient={true}
						style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
					>

						{/* Reply Complain Tab */}
						<View>
							<View style={{ flex: 1, justifyContent: 'space-between', }}>

								<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, }}>
									<ScrollView showsVerticalScrollIndicator={false}>

										{/* Picker for Status */}
										<TitlePicker
											title={R.strings.status}
											array={this.state.Status}
											selectedValue={this.state.selectedStatus}
											onPickerSelect={(item, object) => this.setState({ selectedStatus: item, statusId: object.id })} />

										{/* Set Remark value in EditText */}
										<EditText
											isRequired={true}
											header={R.strings.remarks}
											reference={input => { this.inputs['etRemarks'] = input; }}
											placeholder={R.strings.remarks}
											multiline={false}
											keyboardType='default'
											returnKeyType={"next"}
											maxLength={200}
											blurOnSubmit={false}
											onChangeText={(Label) => this.setState({ Remarks: Label })}
											onSubmitEditing={() => { this.focusNextField('etDescription') }}
											value={this.state.Remarks}
										/>

										{/* Set Description value in EditText */}
										<EditText
											isRequired={true}
											header={R.strings.description}
											reference={input => { this.inputs['etDescription'] = input; }}
											placeholder={R.strings.description}
											multiline={true}
											numberOfLines={4}
											keyboardType='default'
											returnKeyType={"done"}
											maxLength={4000}
											blurOnSubmit={true}
											textAlignVertical={'top'}
											onChangeText={(Label) => this.setState({ ReplyMessage: Label })}
											onSubmitEditing={() => { this.focusNextField('etDescription') }}
											value={this.state.ReplyMessage}
										/>

									</ScrollView>
								</View>

								<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
									{/* To Set Submit Button */}
									<Button title={R.strings.reply} onPress={this.onReplyPress}></Button>
								</View>

							</View>
						</View>

						{/* Chat History Tab */}
						<View>
							<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>

									{/* for header content as id, subject and complain id */}
									<Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{'#' + this.state.ComplainId + ': '}</Text>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{this.state.Subject}</TextViewHML>
								</View>

								{
									(ComplainByIdLoading && !this.state.refreshing) ?
										<ListLoader />
										:
										<FlatList
											ref={ref => this.flatList = ref}
											onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
											onLayout={() => this.flatList.scrollToEnd({ animated: true })}
											style={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}
											showsVerticalScrollIndicator={false}
											data={this.state.ComplainListResponse}
											renderItem={({ item, index }) =>
												<ReplyComplainItem item={item} index={index} />
											}
											keyExtractor={(item, index) => index.toString()}
											refreshControl={
												<RefreshControl
													colors={[R.colors.accent]}
													progressBackgroundColor={R.colors.background}
													refreshing={this.state.refreshing}
													onRefresh={() => this.onRefresh(true, true)}
												/>}
											contentContainerStyle={contentContainerStyle(this.state.ComplainListResponse)}
											ListEmptyComponent={<ListEmptyComponent />}
										/>
								}
							</View>
						</View>

					</IndicatorViewPager>
				</View>

			</SafeView>
		)
	}
}

class ReplyComplainItem extends PureComponent {
	constructor(props) {
		super(props)
	}
	render() {
		let { item } = this.props
		let flexDirection = item.isExistingUser ? 'row-reverse' : 'row';
		let cardBackground = item.isExistingUser ? R.colors.accent : R.colors.cardBackground;
		let textColor = item.isExistingUser ? R.colors.chatCardTextColor : R.colors.textPrimary;
		let marginLeft = item.isExistingUser ? 0 : R.dimens.margin;
		let marginRight = item.isExistingUser ? R.dimens.margin : 0;
		let borderBottomEndRadius = item.isExistingUser ? 0 : R.dimens.margin;
		let borderBottomLeftRadius = item.isExistingUser ? R.dimens.margin : 0;

		return (
			<View style={{ flexDirection: flexDirection, margin: R.dimens.margin, justifyContent: 'center', alignItems: 'center' }}>
				<View style={{
					width: R.dimens.signup_screen_logo_height,
					height: R.dimens.signup_screen_logo_height,
					backgroundColor: R.colors.background,
				}}>
					<Image source={R.images.AVATAR_05} style={{ width: R.dimens.signup_screen_logo_height, height: R.dimens.signup_screen_logo_height, padding: R.dimens.margin, borderRadius: R.dimens.paginationButtonRadious }}></Image>
				</View>
				<View style={{ flex: 1, flexDirection: 'column', marginLeft: marginLeft, marginRight: marginRight, backgroundColor: cardBackground, justifyContent: 'center', elevation: R.dimens.CardViewElivation, padding: R.dimens.widgetMargin, borderRadius: R.dimens.margin, borderBottomEndRadius: borderBottomEndRadius, borderBottomLeftRadius: borderBottomLeftRadius }}>
					<Text style={{ fontSize: R.dimens.smallText, color: textColor, fontWeight: 'bold' }}>{item.Username ? item.Username : ' '}</Text>
					<Text style={{ fontSize: R.dimens.smallText, color: textColor }}>{item.Description ? item.Description : ' '}</Text>
				</View>
			</View>
		)
	}
}

// return state from saga or reducer
const mapStateToProps = (state) => {
	return {
		ComplainListResult: state.HelpAndSupportReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Method for Complain By Id
	getComplainById: (payload) => dispatch(getComplainById(payload)),
	// Method for Reply Complain
	replyComplain: (payload) => dispatch(replyComplain(payload)),
	// Method for Clear Reply Complain Data
	replyClearData: () => dispatch(replyClearData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComplainScreen);
