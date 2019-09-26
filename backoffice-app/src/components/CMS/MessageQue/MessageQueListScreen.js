import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, getCurrentDate, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getMessageQue, getResendMessage, clearMessageQueData } from '../../../actions/CMS/MessageQueActions';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import { DateValidation } from '../../../validations/DateValidation';
import AlertDialog from '../../../native_theme/components/AlertDialog';

class MessageQueListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],
			messageQueListState: null,
			isFirstTime: true,
			selectedPage: 1,
			row: [],
			isDrawerOpen: false,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			MobileNo: '',
			statuses: [
				{ value: R.strings.select_status, code: '' },
				{ value: R.strings.Initialize, code: 0 },
				{ value: R.strings.Pending, code: 6 },
				{ value: R.strings.Success, code: 1 },
				{ value: R.strings.fail, code: 9 },
			],
			selectedStatus: R.strings.select_status,
			selectedStatusCode: '',
			showFullMessage: false,
			selectedItem: {}
		};

		// create reference
		this.toast = React.createRef();
		this.drawer = React.createRef();

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);
		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get callGetMessageQueApi 
			this.callGetMessageQueApi()
		}
	}

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

	//api call for list and filter reset
	callGetMessageQueApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				MobileNo: '',
				selectedStatus: R.strings.Please_Select,
				selectedStatusCode: '',
			})
		}

		// Close Drawer user press on reset button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getMessageQue list
			this.props.getMessageQue({
				Page: 1,
				PageSize: AppConfig.pageSize,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearMessageQueData()
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
		if (MessageQueListScreen.oldProps !== props) {
			MessageQueListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			const { messageQueListData } = props.data;

			if (messageQueListData) {
				try {
					//if local messageQueListData state is null or its not null and also different then new response then and only then validate response.
					if (state.messageQueListState == null || (state.messageQueListState != null && messageQueListData !== state.messageQueListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: messageQueListData, isList: true })) {

							let res = parseArray(messageQueListData.MessagingQueueObj);

							//for add status static
							for (var keyMessageQue in res) {
								let item = res[keyMessageQue];

								if (item.Status == 0)
									item.statusStatic = R.strings.Initialize
								else if (item.Status == 6)
									item.statusStatic = R.strings.Pending
								else if (item.Status == 1)
									item.statusStatic = R.strings.Success
								else if (item.Status == 9)
									item.statusStatic = R.strings.fail
								else
									item.statusStatic = ''
							}

							return {
								...state, messageQueListState: messageQueListData,
								response: res, refreshing: false,
								row: addPages(messageQueListData.Count)
							};
						} else {
							return { ...state, messageQueListState: messageQueListData, response: [], refreshing: false, row: [] };
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

			//To getMessageQue list
			this.props.getMessageQue(
				{
					Page: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					MobileNo: this.state.MobileNo,
					Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
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

				//To get getMessageQue list
				this.props.getMessageQue({
					Page: pageNo,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					MobileNo: this.state.MobileNo,
					Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
				});
			}
		}
	}

	// if press on complete button api calling
	onComplete = async (chek = true) => {

		if (chek) {
			//Check Validation of FromDate and ToDate
			if (DateValidation(this.state.FromDate, this.state.ToDate, true, 2)) {
				this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true, 2));
				return;
			}

			if (this.state.MobileNo.length > 0 && this.state.MobileNo.length < 10) {
				this.toast.Show(R.strings.Valid_mobile);
				return;
			}
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getMessageQue list
			this.props.getMessageQue({
				Page: 1,
				PageSize: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
				ToDate: this.state.ToDate,
				MobileNo: this.state.MobileNo,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState(
			{ selectedPage: 1 }
		)
	}

	navigationDrawer() {

		return (
			<FilterWidget
				sub_container={{ paddingBottom: 0, }}
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				textInputStyle={{ marginTop: 0, marginBottom: 0, }}
				ToDate={this.state.ToDate}
				textInputs={[
					{
						header: R.strings.MobileNo,
						placeholder: R.strings.MobileNo,
						multiline: false,
						maxLength: 10,
						keyboardType: 'numeric',
						returnKeyType: "done",
						onlyDigit: true,
						validate: true,
						onChangeText: (text) => { this.setState({ MobileNo: text }) },
						value: this.state.MobileNo,
					}
				]}
				pickers={[
					{
						title: R.strings.status,
						array: this.state.statuses,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
					},
				]}
				onResetPress={this.callGetMessageQueApi}
				onCompletePress={this.onComplete}
			/>
		)
	}

	onViewPress = (item) => {
		//for show full message
		this.setState({ showFullMessage: true, selectedItem: item })
	}

	onResendPress = async () => {
		this.setState({ showFullMessage: false })

		//Check NetWork is Available or not
		if (await isInternet()) {
			//To call getResendMessage 
			this.props.getResendMessage({
				MessageID: this.state.selectedItem.MessageID
			});
		}
	}

	async componentDidUpdate(prevProps, prevState) {

		const { resendMessagedata } = this.props.data;

		if (resendMessagedata !== prevProps.data.resendMessagedata) {
			// for show responce resendMessagedata
			if (resendMessagedata) {
				try {
					if (validateResponseNew({
						response: resendMessagedata,
					})) {
						showAlert(R.strings.Success, R.strings.resendMessageSuccesffully, 0, () => {
							this.props.clearMessageQueData()
							this.onComplete(false)
						});
					} else {
						this.props.clearMessageQueData()
					}
				} catch (e) {
					this.props.clearMessageQueData()
				}
			}
		}
	}

	render() {
		let filteredList = [];

		//for search all fields if response length > 0
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				('' + item.MobileNo).includes(this.state.search.toLowerCase()) ||
				item.SMSDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.SMSText.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			<Drawer
				drawerWidth={R.dimens.FilterDrawarWidth} onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				drawerPosition={Drawer.positions.Right}
				ref={component => this.drawer = component}
				type={Drawer.types.Overlay} onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				drawerContent={this.navigationDrawer()}
				easingFunc={Easing.ease}
				>

				<SafeView style={this.styles().container}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set Progress bar as per our theme */}
					<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.resendMessageFetching} />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.messageQueue}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.messageQueListFetching && !this.state.refreshing)
							?
							<ListLoader />
							:
							filteredList.length > 0 ?
								<FlatList
									data={filteredList}
									extraData={this.state}
									showsVerticalScrollIndicator={false}
									renderItem={({ item, index }) =>
										<MessageQueListItem
											index={index}
											item={item}
											size={this.state.response.length} 
											onViewPress={() => this.onViewPress(item)}
											/>
									}
									keyExtractor={(_item, index) => index.toString()}
									refreshControl={
									<RefreshControl
									onRefresh={this.onRefresh}
									progressBackgroundColor={R.colors.background}
									colors={[R.colors.accent]}
										refreshing={this.state.refreshing}
									/>}
								/>
								:
								<ListEmptyComponent />
						}
						{/*To Set Pagination View  */}
						<View>
							{filteredList.length > 0 && 
							<PaginationWidget 
							row={this.state.row} 
							selectedPage={this.state.selectedPage} 
							onPageChange={(item) => { this.onPageChange(item) }} />
							}
						</View>
					</View>

					{/*To Show Full message  */}
					<AlertDialog
						visible={this.state.showFullMessage}
						title={R.strings.Message}
						negativeButton={{
							title: R.strings.no,
							onPress: () => this.setState({ showFullMessage: !this.state.showFullMessage })
						}}
						positiveButton={{
							title: this.state.selectedItem.Status == 9 ? R.strings.Resend : R.strings.OK,
							onPress: () => this.state.selectedItem.Status == 9 ? this.onResendPress() : this.setState({ showFullMessage: false }),
							progressive: false
						}}
						requestClose={() => null}
						toastRef={component => this.toastUpdate = component}>

						<View>
							<View style={{ padding: R.dimens.widgetMargin }}>
								<View style={{ flexDirection: 'row' }}>
									<TextViewHML style={{ flex: 1, textAlign: 'left', fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{this.state.selectedItem.SMSText ? this.state.selectedItem.SMSText : ''}</TextViewHML>
								</View>
							</View>
						</View>
					</AlertDialog>
				</SafeView>
			</Drawer>
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background,
			},
		}
	}
}

// This Class is used for display record in list
class MessageQueListItem extends Component {
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
		let { index, size, item } = this.props;

		let statusColor = R.colors.accent

		// initialize=0, pending=6
		if (item.Status == 0 || item.Status == 6)
			{statusColor = R.colors.yellow}
		// success
		else if (item.Status == 1)
			{statusColor = R.colors.successGreen}
		// fail
		else if (item.Status == 9)
			{statusColor = R.colors.failRed}

		return (
			// flatlist item animation
			<AnimatableItem>
				<View 
				style=
				{{ marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1, marginLeft: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						borderBottomLeftRadius: R.dimens.margin,
						borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						flex: 1,
						borderTopRightRadius: R.dimens.margin,
					}}>

						<View style={{ flexDirection: 'row' }}>
							{/* for show Mobile icon  */}
							<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
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
									icon={R.images.IC_MOBILE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								/>
							</View>

							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									{/* for show MobileNo  */}
									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
										<Text style={{
											fontSize: R.dimens.smallText, color: R.colors.textPrimary,
											fontFamily: Fonts.MontserratSemiBold,
										}}>{validateValue(item.MobileNo)}</Text>
									</View>

									{/* for show detail Message Dialog Show*/}
									<View style={{ flexDirection: 'row', alignItems: 'center', }}>

										<ImageTextButton
											style={
												{
													justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',
													borderRadius: R.dimens.titleIconHeightWidth, margin: 0, padding: R.dimens.CardViewElivation,
												}}
												iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
											icon={R.images.IC_EYE_FILLED}
											onPress={this.props.onViewPress} 
											/>
									</View>
								</View>

								{/* for show sms  */}
								<View style={{ flex: 1, }}>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{validateValue(item.SMSText)}</TextViewHML>
									</View>
								</View>
							</View>
						</View>

						{/* for show status and date */}
						<View style={{ flex: 1, 
							flexDirection: 'row', 
							justifyContent: 'space-between', 
							marginTop: R.dimens.widgetMargin, }
							}>
							<StatusChip
								color={statusColor}
								value={item.statusStatic}>
								</StatusChip>
							<View style={{ 
								flexDirection: 'row',
								 alignItems: 'center', 
								 justifyContent: 'center' }}
								 >
								<ImageTextButton
									style={{ 
										margin: 0, 
										paddingRight: R.dimens.LineHeight, 
									}}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
									icon={R.images.IC_TIMER}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(item.SMSDate)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For MessageQueReducer Data 
	let data = {
		...state.MessageQueReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getMessageQue List Action 
		getMessageQue: (request) => dispatch(getMessageQue(request)),
		//Perform getResendMessage List Action 
		getResendMessage: (request) => dispatch(getResendMessage(request)),
		//Perform clearMessageQueData Action 
		clearMessageQueData: () => dispatch(clearMessageQueData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(MessageQueListScreen);