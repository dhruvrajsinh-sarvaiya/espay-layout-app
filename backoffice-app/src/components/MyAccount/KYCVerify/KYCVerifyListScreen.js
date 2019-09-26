import React, { Component } from 'react';
import { View, FlatList, Image, Easing, RefreshControl } from 'react-native';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { getKycVerifyList, clearKycStatus } from '../../../actions/account/KYCVerifyActions';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateMobileNumber, validateValue, isEmpty } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { AppConfig } from '../../../controllers/AppConfig';
import R from '../../../native_theme/R';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import PaginationWidget from '../../widget/PaginationWidget';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import { CheckEmailValidation } from '../../../validations/EmailValidation';
import SafeView from '../../../native_theme/components/SafeView';

class KYCVerifyListScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			row: [],
			selectedPage: 1,
			searchInput: '',
			refreshing: false,
			KYCVerifyReponse: [],
			isFirstTime: true,
			isDrawerOpen: false,
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			Mobile: '',
			EmailAddress: '',
			Status: [
				{ value: R.strings.select_status, code: -1 },
				{ value: R.strings.Approval, code: 1 },
				{ value: R.strings.Reject, code: 2 },
				{ value: R.strings.Pending, code: 4 },
			],
			selectedStatus: R.strings.select_status,
			selectedStatusCode: -1,
		};

		//crate reference
		this.drawer = React.createRef();
		this.toast = React.createRef();
		this.inputs = {};

		addRouteToBackPress(props)

		// Bind Method
		this.onBackPress = this.onBackPress.bind(this);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	shouldComponentUpdate(nextProps, _nextState) {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearKycStatus();
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

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {
		if (this.state.selectedPage !== pageNo) {
			this.setState({ selectedPage: pageNo });

			//Check NetWork is Available or not
			if (await isInternet()) {
				let request = {
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					PageIndex: pageNo,
					Page_Size: AppConfig.pageSize,
					Status: this.state.selectedStatusCode == -1 ? '' : this.state.selectedStatusCode,
					Mobile: this.state.Mobile,
					EmailAddress: this.state.EmailAddress,
				}

				/* Called Domain List Api */
				this.props.getKycVerifyList(request)
			} else {
				this.setState({ refreshing: false })
			}
		}
	}

	// for swipe to refresh functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (needUpdate && await isInternet()) {

			// request for KYC Verify List
			let request = {
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				PageIndex: this.state.selectedPage,
				Page_Size: AppConfig.pageSize,
				Status: this.state.selectedStatusCode == -1 ? '' : this.state.selectedStatusCode,
				Mobile: this.state.Mobile,
				EmailAddress: this.state.EmailAddress,
			}

			// Called KYC Verify List Api
			this.props.getKycVerifyList(request)
		} else {
			this.setState({ refreshing: false })
		}
	}

	async componentDidMount() {

		//change theme 
		changeTheme()

		//call getKycVerifyList api
		this.callgetKycVerifyList()
	}

	callgetKycVerifyList = async () => {

		this.setState({
			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
			selectedStatus: R.strings.select_status,
			selectedStatusCode: -1,
			Mobile: '',
			EmailAddress: '',
			selectedPage: 1,
			searchInput: '',
		})

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		// Check internet connection
		if (await isInternet()) {
			let request = {
				FromDate: getCurrentDate(),
				ToDate: getCurrentDate(),
				PageIndex: 1,
				Page_Size: AppConfig.pageSize,
				Status: '',
				Mobile: '',
				EmailAddress: '',
			}

			// Called KYC Verify List Api
			this.props.getKycVerifyList(request)
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
		if (KYCVerifyListScreen.oldProps !== props) {
			KYCVerifyListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated field of Particular actions
			const { KYCVerifyListData, } = props.KYCVerifyListResult

			// KYCVerifyListData is not null
			if (KYCVerifyListData) {
				try {
					if (state.KYCVerifyListData == null || (state.KYCVerifyListData != null && KYCVerifyListData !== state.KYCVerifyListData)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: KYCVerifyListData, isList: true })) {
							//check Domain List Response is an Array Or not
							//If Response is Array then Direct set in state otherwise conver response to Array form then set state.
							let res = KYCVerifyListData.kYCListFilterationDataViewModels;
							let finalRes = parseArray(res);

							return Object.assign({}, state, { KYCVerifyReponse: finalRes, refreshing: false, row: addPages(KYCVerifyListData.TotalCount) })
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, { KYCVerifyReponse: [], refreshing: false, KYCVerifyListData: null, row: [] })
						}
					}
				} catch (error) {
					return Object.assign({}, state, { KYCVerifyReponse: [], refreshing: false, KYCVerifyListData: null, row: [] })
				}
			}
		}
		return null
	}

	//To Validate Mobile Number
	validateMobileNumber = (MobileNumber) => {

		if (validateMobileNumber(MobileNumber)) {
			this.setState({ Mobile: MobileNumber })
		}
	}

	// When user presss on Apply button from Drawer
	onComplete = async () => {

		//chek validation
		if (CheckEmailValidation(this.state.EmailAddress)) {
			this.toast.Show(R.strings.Enter_Valid_Email)
			return
		}

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();
		this.setState({ searchInput: '', selectedPage: 1 })

		// Check internet connection
		if (await isInternet()) {

			let request = {
				PageIndex: 1,
				Page_Size: AppConfig.pageSize,
				FromDate: this.state.FromDate,
				ToDate: this.state.ToDate,
				Status: this.state.selectedStatusCode == -1 ? '' : this.state.selectedStatusCode,
				Mobile: this.state.Mobile,
				EmailAddress: this.state.EmailAddress,
			}

			//call getKycVerifyList api
			this.props.getKycVerifyList(request)
		}
	}

	// Drawer Navigation UI design
	navigationDrawer = () => {
		return (
			<FilterWidget
				FromDatePickerCall={(date) => this.setState({ FromDate: date })}
				ToDatePickerCall={(date) => this.setState({ ToDate: date })}
				FromDate={this.state.FromDate}
				toastRef={component => this.toast = component}
				ToDate={this.state.ToDate}
				onResetPress={this.callgetKycVerifyList}
				onCompletePress={this.onComplete}
				textInputs={[
					{
						header: R.strings.Mobile,
						placeholder: R.strings.Mobile,
						multiline: false,
						keyboardType: 'numeric',
						returnKeyType: "next",
						onChangeText: (text) => this.validateMobileNumber(text),
						value: this.state.Mobile,
					},
					{
						header: R.strings.EmailId,
						placeholder: R.strings.EmailId,
						multiline: false,
						keyboardType: 'default',
						returnKeyType: "done",
						onChangeText: (EmailAddress) => this.setState({ EmailAddress }),
						value: this.state.EmailAddress,
					},
				]}
				comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
				sub_container={{ paddingBottom: 0, }}
				pickers={[
					{
						title: R.strings.Status,
						array: this.state.Status,
						selectedValue: this.state.selectedStatus,
						onPickerSelect: (item, object) => this.setState({ selectedStatus: item, selectedStatusCode: object.code })
					},
				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { KYCVerifyListLoading } = this.props.KYCVerifyListResult

		let filteredList = [];

		//for search all fields if response length > 0
		if (this.state.KYCVerifyReponse.length) {
			filteredList = this.state.KYCVerifyReponse.filter(item => {
				let fName = isEmpty(item.FirstName) ? '' : item.FirstName;
				let lName = isEmpty(item.LastName) ? '' : item.LastName;
				let uName = isEmpty(item.UserName) ? '' : item.UserName;
				let mobile = isEmpty(item.Mobile) ? '' : item.Mobile;
				let statusName = isEmpty(item.Statusname) ? '' : item.Statusname;
				let createdDate = isEmpty(item.Createddate) ? '' : item.Createddate;

				return fName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
					lName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
					uName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
					mobile.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
					statusName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
					createdDate.toLowerCase().includes(this.state.searchInput.toLowerCase())
			});
		}

		return (
			// Drawer for KYC Verify Filteration
			<Drawer
				ref={component => this.drawer = component}
				drawerWidth={R.dimens.FilterDrawarWidth}
				drawerPosition={Drawer.positions.Right}
				drawerContent={this.navigationDrawer()}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				type={Drawer.types.Overlay}
				easingFunc={Easing.ease}>

				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						title={R.strings.KYCVerify}
						isBack={true}
						nav={this.props.navigation}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
					/>

					<View style={{ flex: 1 }}>
						{(KYCVerifyListLoading && !this.state.refreshing)
							?
							<ListLoader />
							:
							filteredList.length > 0 ?
								<FlatList
									data={filteredList}
									extraData={this.state}
									showsVerticalScrollIndicator={false}
									// render all item in list
									renderItem={({ item, index }) =>
										<KYCVerifyListItem
											index={index}
											item={item}
											onEdit={() => this.props.navigation.navigate('KYCVerifyListDetailScreen', { ITEM: item, edit: true, onRefresh: this.onRefresh })}
											size={this.state.KYCVerifyReponse.length} />
									}
									// assign index as key value list item
									keyExtractor={(_item, index) => index.toString()}
									// For Refresh Functionality FlatList Item
									refreshControl={<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={() => this.onRefresh(true, true)}
									/>}
								/>
								:
								// Displayed empty component when no record found 
								<ListEmptyComponent />
						}
					</View>

					{/*To Set Pagination View  */}
					{
						filteredList.length > 0 &&
						<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
					}
				</SafeView>
			</Drawer>
		);
	}
}

// This Class is used for display record in list
class KYCVerifyListItem extends Component {
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

		//To Display various Status Color in ListView
		let color = R.colors.accent;

		//Approval
		if (item.VerifyStatus == 1) {
			color = R.colors.successGreen
		}
		//reject 
		else if (item.VerifyStatus == 2) {
			color = R.colors.failRed
		}
		//Pending
		else if (item.VerifyStatus == 4) {
			color = R.colors.yellow
		}

		return (
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						flex: 1, borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>
						<View style={{ flex: 1, flexDirection: 'row' }}>

							{/* User Image */}
							<Image
								source={R.images.IC_USER}
								style={{ width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, tintColor: R.colors.accent }}
							/>

							<View style={{ flex: 1, marginLeft: R.dimens.WidgetPadding }}>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

									{/* for show FirstName,Lastname edit icon */}
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{validateValue(item.FirstName) + ' ' + validateValue(item.LastName)}</TextViewMR>
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
										onPress={this.props.onEdit} />
								</View>

								{/* for show UserName */}
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* for show Mobile */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Mobile + ": "}</TextViewHML>
									<TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.Mobile)}</TextViewHML>
								</View>
							</View>
						</View >

						{/* for show status and date */}
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>

							<StatusChip color={color} value={item.Statusname} />

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Createddate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View >
			</AnimatableItem >
		)
	}
}

/* return state from saga or reducer */
const mapStateToProps = (state) => {
	//Updated Data For KYCVerifyListResult Data  
	return {
		KYCVerifyListResult: state.KYCVerifyReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform getKycVerifyList Action 
	getKycVerifyList: (payload) => dispatch(getKycVerifyList(payload)),
	//Perform clearKycStatus Action 
	clearKycStatus: () => dispatch(clearKycStatus()),
})

export default connect(mapStateToProps, mapDispatchToProps)(KYCVerifyListScreen);