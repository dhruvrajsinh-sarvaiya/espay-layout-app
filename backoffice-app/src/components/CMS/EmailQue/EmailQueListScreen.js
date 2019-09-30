import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, addPages, getCurrentDate } from '../../../controllers/CommonUtils';
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
import { getEmailQue, clearEmailQuedata } from '../../../actions/CMS/EmailQueActions';
import { AppConfig } from '../../../controllers/AppConfig';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import { DateValidation } from '../../../validations/DateValidation';

class EmailQueListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],
			EmailQueListState: null,
			isFirstTime: true,
			selectedPage: 1,
			row: [],
			isDrawerOpen: false,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			statuses: [
				{ value: R.strings.select_status, code: '' },
				{ value: R.strings.Initialize, code: 0 },
				{ value: R.strings.Pending, code: 6 },
				{ value: R.strings.Success, code: 1 },
				{ value: R.strings.fail, code: 9 },
			],
			selectedStatus: R.strings.select_status,
			selectedStatusCode: '',
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

			//To get callGetEmailQueApi 
			this.callGetEmailQueApi()
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
	callGetEmailQueApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				selectedStatus: R.strings.Please_Select,
				selectedStatusCode: '',
			})
		}

		// Close Drawer user press on reset button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getEmailQue list
			this.props.getEmailQue({
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
		this.props.clearEmailQuedata()
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
		if (EmailQueListScreen.oldProps !== props) {
			EmailQueListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			const { EmailQueListData } = props.data;

			if (EmailQueListData) {
				try {
					//if local EmailQueListData state is null or its not null and also different then new response then and only then validate response.
					if (state.EmailQueListState == null || (state.EmailQueListState != null && EmailQueListData !== state.EmailQueListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: EmailQueListData, isList: true })) {

							let res = parseArray(EmailQueListData.EmailQueueObj);

							//for add status static
							for (var keyEmailQue in res) {
								let item = res[keyEmailQue];

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
								...state, EmailQueListState: EmailQueListData,
								response: res, refreshing: false,
								row: addPages(EmailQueListData.Count)
							};
						} else {
							return { ...state, EmailQueListState: EmailQueListData, response: [], refreshing: false, row: [] };
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

			//To getEmailQue list
			this.props.getEmailQue(
				{
					Page: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
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

				//To get getEmailQue list
				this.props.getEmailQue({
					Page: pageNo,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
				});
			}
		}
	}

	// if press on complete button api calling
	onComplete = async () => {

		//Check Validation of FromDate and ToDate
		if (DateValidation(this.state.FromDate, this.state.ToDate, true, 2)) {
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true, 2));
			return;
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To get getEmailQue list
			this.props.getEmailQue({
				Page: 1,
				PageSize: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Status: this.state.selectedStatus === R.strings.select_status ? '' : this.state.selectedStatusCode,
			});
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		this.setState({ selectedPage: 1 })
	}

	navigationDrawer() {

		return (
			<FilterWidget
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				ToDate={this.state.ToDate}
				toastRef={component => this.toast = component}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				sub_container={{ paddingBottom: 0, }}
				pickers={[
					{
						title: R.strings.status,
						array: this.state.statuses,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
					},
				]}
				onResetPress={this.callGetEmailQueApi}
				onCompletePress={this.onComplete}
			/>
		)
	}

	render() {
		let filteredList = [];

		//for search all fields if response length > 0
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.RecepientEmail.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Subject.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.EmailDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			<Drawer
				ref={component => this.drawer = component}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerPosition={Drawer.positions.Right}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				drawerContent={this.navigationDrawer()}
				type={Drawer.types.Overlay}
				easingFunc={Easing.ease}>

				<SafeView style={this.styles().container}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.emailQueue}
						isBack={true}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(input) => this.setState({ search: input })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{(this.props.data.EmailQueListFetching && !this.state.refreshing)
							?
							<ListLoader />
							:
							filteredList.length > 0 ?
								<FlatList
									data={filteredList}
									extraData={this.state}
									showsVerticalScrollIndicator={false}
									renderItem={({ item, index }) =>
										<EmailQueListItem
											index={index}
											item={item}
											onViewPress={() => this.props.navigation.navigate('EmailQueResendEmailScreen', { item, onSuccess: this.callGetEmailQueApi })}
											size={this.state.response.length} />
									}
									keyExtractor={(_item, index) => index.toString()}
									refreshControl={<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh}
									/>}
								/>
								:
								<ListEmptyComponent />
						}
						{/*To Set Pagination View  */}
						<View>
							{filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
						</View>
					</View>
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
class EmailQueListItem extends Component {
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

		// initialize=0,pending=6
		if (item.status == 0 || item.Status == 6)
			statusColor = R.colors.yellow
		// success
		else if (item.Status == 1)
			statusColor = R.colors.successGreen
		// fail
		else if (item.Status == 9)
			statusColor = R.colors.failRed

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						borderRadius: 0, elevation: R.dimens.listCardElevation,
						flex: 1,
						borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
					}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							{/* for show email icon  */}
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
								icon={R.images.IC_EMAIL_FILLED}
								iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
							/>

							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									{/* for show RecepientEmail  */}
									<Text
										numberOfLines={1} ellipsizeMode={'tail'}
										style={{
											flex: 1,
											fontSize: R.dimens.smallText, color: R.colors.textPrimary,
											fontFamily: Fonts.MontserratSemiBold,
										}}>
										{validateValue(item.RecepientEmail)}
									</Text>

									{/* for show Resend Email Show*/}
									<View style={{ flexDirection: 'row', alignItems: 'center', }}>
										<ImageTextButton
											style={
												{
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: 'transparent',
													borderRadius: R.dimens.titleIconHeightWidth,
													margin: 0,
													padding: R.dimens.CardViewElivation,
												}}
											icon={R.images.IC_EYE_FILLED}
											iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
											onPress={this.props.onViewPress} />
									</View>
								</View>

								{/* for show Subject  */}
								<View style={{ flex: 1, }}>
									<TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{validateValue(item.Subject)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status and date */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={statusColor}
								value={item.statusStatic}></StatusChip>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(item.EmailDate)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For EmailQueReducer Data 
	let data = {
		...state.EmailQueReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getEmailQue List Action 
		getEmailQue: (request) => dispatch(getEmailQue(request)),
		//Perform clearEmailQuedata Action 
		clearEmailQuedata: () => dispatch(clearEmailQuedata())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(EmailQueListScreen);