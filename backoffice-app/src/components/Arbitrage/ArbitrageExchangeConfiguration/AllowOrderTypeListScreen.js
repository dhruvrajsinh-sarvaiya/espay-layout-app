import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray, addPages, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getArbiAllowOrderTypeList, clearArbiAllowOrderTypeData, allowOrderTypeData } from '../../../actions/Arbitrage/AllowOrderTypeActions';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import PaginationWidget from '../../widget/PaginationWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import AlertDialog from '../../../native_theme/components/AlertDialog';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class AllowOrderTypeListScreen extends Component {
	constructor(props) {
		super(props)

		// Define all initial state
		this.state = {
			Item: null,
			row: [],
			AllowOrderTypeResponse: [],
			AllowOrderTypeListState: null,
			UpdateOrderTypeDataState: null,

			searchInput: '',
			selectedPage: 1,
			modalVisible: false,
			refreshing: false,
			isFirstTime: false,

			isLimit: false,
			isMarket: false,
			isSpot: false,
			isStopLimit: false,
		}

		//Initial request
		this.request = {
			PageNo: 1,
			PageSize: AppConfig.pageSize
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()

		// check internet connection
		if (await isInternet()) {
			// Call Allow Order Type List Api
			this.props.getArbiAllowOrderTypeList(this.request)
		}
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearArbiAllowOrderTypeData()
	}

	// Pagination Method Called When User Change Page 
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {
			//if user select other page number then and only then API Call elase no need to call API
			this.setState({ selectedPage: pageNo });

			// Check NetWork is Available or not
			if (await isInternet()) {
				// Bind request for Arbitrage Allow Order Type List
				this.request = {
					...this.request,
					PageNo: pageNo,
				}
				//Call Get Arbitrage Allow Order Type List API
				this.props.getArbiAllowOrderTypeList(this.request)
			} else {
				this.setState({ refreshing: false })
			}
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			// Bind Request for Api
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage,
			}
			//call api for get Arbitrage Allow Order Type 
			this.props.getArbiAllowOrderTypeList(this.request)
		} else {
			this.setState({ refreshing: false });
		}
	}

	// user press on save button from edit dialog
	onSavePress = async () => {
		this.setState({ modalVisible: false })

		// check internet connection
		if (await isInternet()) {

			let orderType = []
			if (this.state.isLimit) {
				orderType.push({
					OrderType: 1,
					ProviderDetailID: this.state.Item.Id,
					Status: 1
				})
			} else {
				orderType.push({
					OrderType: 1,
					ProviderDetailID: this.state.Item.Id,
					Status: 0
				})
				this.setState({ isLimit: false })
			}

			if (this.state.isMarket) {
				orderType.push({
					OrderType: 2,
					ProviderDetailID: this.state.Item.Id,
					Status: 1
				})
			} else {
				orderType.push({
					OrderType: 2,
					ProviderDetailID: this.state.Item.Id,
					Status: 0
				})
				this.setState({ isMarket: false })
			}

			if (this.state.isSpot) {
				orderType.push({
					OrderType: 3,
					ProviderDetailID: this.state.Item.Id,
					Status: 1
				})
			} else {
				orderType.push({
					OrderType: 3,
					ProviderDetailID: this.state.Item.Id,
					Status: 0
				})
				this.setState({ isSpot: false })
			}

			if (this.state.isStopLimit) {
				orderType.push({
					OrderType: 4,
					ProviderDetailID: this.state.Item.Id,
					Status: 1
				})
			} else {
				orderType.push({
					OrderType: 4,
					ProviderDetailID: this.state.Item.Id,
					Status: 0
				})
				this.setState({ isStopLimit: false })
			}

			// Create req for Allow Order Type
			let req = {
				Id: this.state.Item.Id,
				APIProviderId: this.state.Item.APIProviderId,
				ServiceProviderCongigId: this.state.Item.ServiceProviderCongigId,
				ProviderTypeId: this.state.Item.ProviderTypeId,
				Status: this.state.Item.Status,
				ProviderMasterId: this.state.Item.ProviderMasterId,
				Trntype: this.state.Item.Trntype,
				OrderType: orderType
			}

			// Call Allow Order Type Api
			this.props.allowOrderTypeData(req)
		}
	}

	onEditPress = (item) => {
		this.setState({ isLimit: false, isMarket: false, isSpot: false, isStopLimit: false })

		let OrderType = item.OrderType

		// Ser limit based on order type and status
		for (var type of OrderType) {

			if (type.OrderType == 1) {
				if (type.Status == 1)
					this.setState({ isLimit: true })
				else
					this.setState({ isLimit: false })
			}

			if (type.OrderType == 2) {
				if (type.Status == 1)
					this.setState({ isMarket: true })
				else
					this.setState({ isMarket: false })
			}

			if (type.OrderType == 3) {
				if (type.Status == 1)
					this.setState({ isSpot: true })
				else
					this.setState({ isSpot: false })
			}

			if (type.OrderType == 4) {
				if (type.Status == 1)
					this.setState({ isStopLimit: true })
				else
					this.setState({ isStopLimit: false })
			}
		}

		this.setState({ modalVisible: true, Item: item })
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (AllowOrderTypeListScreen.oldProps !== props) {
			AllowOrderTypeListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { AllowOrderTypeList, } = props.AllowOrderTypeResult

			// AllowOrderTypeList is not null
			if (AllowOrderTypeList) {
				try {
					if (state.AllowOrderTypeListState == null || (state.AllowOrderTypeListState !== null && AllowOrderTypeList !== state.AllowOrderTypeListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: AllowOrderTypeList, isList: true, })) {

							let res = parseArray(AllowOrderTypeList.Response)

							// Append statusText into response
							for (var allowOrderKey in res) {
								let item = res[allowOrderKey]
								if (item.Status == 1)
									item.StatusText = R.strings.Active
								else
									item.StatusText = R.strings.inActive
							}

							return Object.assign({}, state, {
								AllowOrderTypeListState: AllowOrderTypeList,
								AllowOrderTypeResponse: res,
								refreshing: false,
								row: addPages(AllowOrderTypeList.Count)
							})
						} else {
							//if response is not validate then list is empty
							return Object.assign({}, state, {
								AllowOrderTypeListState: null,
								AllowOrderTypeResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						AllowOrderTypeListState: null,
						AllowOrderTypeResponse: [],
						refreshing: false,
						row: [],
					})

				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { UpdateOrderTypeData } = this.props.AllowOrderTypeResult

		// check previous props and existing props
		if (UpdateOrderTypeData !== prevProps.AllowOrderTypeResult.UpdateOrderTypeData) {
			// UpdateOrderTypeData is not null
			if (UpdateOrderTypeData) {
				try {
					if (this.state.UpdateOrderTypeDataState == null || (this.state.UpdateOrderTypeDataState != null && UpdateOrderTypeData !== this.state.UpdateOrderTypeDataState)) {
						// Handle Response
						if (validateResponseNew({ response: UpdateOrderTypeData, })) {

							this.setState({ UpdateOrderTypeDataState: UpdateOrderTypeData })

							showAlert(R.strings.Success + '!', UpdateOrderTypeData.ReturnMsg, 0, async () => {
								// Clear Allow Order Type data
								this.props.clearArbiAllowOrderTypeData()
								// Check internet connection
								if (await isInternet()) {
									//call api for get Arbitrage Allow Order Type 
									this.props.getArbiAllowOrderTypeList(this.request)
								}
							})
						} else {
							this.setState({ UpdateOrderTypeDataState: null })
							// Clear Allow Order Type data
							this.props.clearArbiAllowOrderTypeData()
						}
					}
				} catch (error) {
					// Clear Allow Order Type data
					this.props.clearArbiAllowOrderTypeData()
					this.setState({ UpdateOrderTypeDataState: null })
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar or Flatlist which is fetching from reducer
		let { AllowOrderTypeLoading, UpdateOrderTypeLoading } = this.props.AllowOrderTypeResult

		// For searching functionality
		let finalItems = this.state.AllowOrderTypeResponse.filter(item => (
			item.Name.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.arbitrageAllowOrderType}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				{/* Progress Dialog for Allow Order Type */}
				<ProgressDialog isShow={UpdateOrderTypeLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(AllowOrderTypeLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <AllowOrderTypeListItem
									index={index}
									dataItem={item}
									size={finalItems.length}
									onEdit={() => this.onEditPress(item)}
								/>}
								// assign index as key value to Arbitrage Allow Order Type list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Arbitrage Allow Order Type FlatList Item
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing} onRefresh={this.onRefresh}
										colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
									/>
								}
								contentContainerStyle={contentContainerStyle(finalItems)}
								// Displayed empty component when no record found 
								ListEmptyComponent={<ListEmptyComponent />}
							/>
					}

					{/*To Set Pagination View  */}
					<View>
						{
							finalItems.length > 0 &&
							<PaginationWidget row={this.state.row} 
							selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
						}
					</View>

				</View>
				<AlertDialog
					visible={this.state.modalVisible}
					title={R.strings.allowOrderType}
					requestClose={() => this.setState({ modalVisible: false })}
					negativeButton={{ onPress: () => this.setState({ modalVisible: !this.state.modalVisible }) }}
					positiveButton={{
						title: R.strings.Save,
						onPress: () => this.onSavePress(),
						progressive: false
					}}>

					<View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
						<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.LIMIT}</TextViewHML>
						<ImageTextButton
							icon={this.state.isLimit ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
							onPress={() => this.setState({ isLimit: !this.state.isLimit })}
							style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
							textStyle={{ color: R.colors.textPrimary }}
							iconStyle={{ tintColor: this.state.isLimit ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
						/>
					</View>

					<View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
						<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.MARKET}</TextViewHML>
						<ImageTextButton
							icon={this.state.isMarket ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
							onPress={() => this.setState({ isMarket: !this.state.isMarket })}
							style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
							textStyle={{ color: R.colors.textPrimary }}
							iconStyle={{ tintColor: this.state.isMarket ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
						/>
					</View>

					<View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
						<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.SPOT}</TextViewHML>
						<ImageTextButton
							icon={this.state.isSpot ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
							onPress={() => this.setState({ isSpot: !this.state.isSpot })}
							style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
							textStyle={{ color: R.colors.textPrimary }}
							iconStyle={{ tintColor: this.state.isSpot ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
						/>
					</View>

					<View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
						<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.STOPLIMIT}</TextViewHML>
						<ImageTextButton
							icon={this.state.isStopLimit ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
							onPress={() => this.setState({ isStopLimit: !this.state.isStopLimit })}
							style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
							textStyle={{ color: R.colors.textPrimary }}
							iconStyle={{ tintColor: this.state.isStopLimit ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
						/>
					</View>

				</AlertDialog>
			</SafeView>
		)
	}
}

// This Class is used for display record in list
class AllowOrderTypeListItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.dataItem === nextProps.dataItem)
			return false
		return true
	}

	render() {
		let { size, index, dataItem, } = this.props

		// display multiple order type on list
		let orderTypeText = []

		// for status
		let statusText = R.strings.inActive
		let statusTextColor = R.colors.failRed

		if (item.Status == 1) {
			statusTextColor = R.colors.successGreen
			statusText = R.strings.active
		}

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
					}}>

						{/* for App Name */}
						<View>
							<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.apiName + ': '}</TextViewHML>
							<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Name)}</TextViewHML>
						</View>
						{/* for App Name */}
						<View>
							<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.orderType + ': '}</TextViewHML>
							{
								dataItem.OrderType.map((item) => {
									if (item.OrderType == 1 && item.Status == 1)
										orderTypeText.push(R.strings.LIMIT)
									else if (item.OrderType == 2 && item.Status == 1)
										orderTypeText.push(R.strings.MARKET)
									else if (item.OrderType == 3 && item.Status == 1)
										orderTypeText.push(R.strings.SPOT)
									else if (item.OrderType == 4 && item.Status == 1)
										orderTypeText.push(R.strings.STOPLIMIT)
								})
							}
							<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{orderTypeText.length > 0 ? orderTypeText.join(', ') : '-'}</TextViewHML>
						</View>

						{/* for show status and button for edit,status,delete */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={statusTextColor}
								value={statusText}></StatusChip>

							<ImageTextButton
								style={
									{
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: R.colors.accent,
										borderRadius: R.dimens.titleIconHeightWidth,
										margin: 0,
										padding: R.dimens.CardViewElivation,
									}}
								icon={R.images.IC_EDIT}
								iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								onPress={this.props.onEdit} />
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get arbitrage charge config data from reducer
		AllowOrderTypeResult: state.AllowOrderTypeReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Arbitrage Allow Order Type Action
	getArbiAllowOrderTypeList: (payload) => dispatch(getArbiAllowOrderTypeList(payload)),
	// Perform Allow Order Type Action
	allowOrderTypeData: (payload) => dispatch(allowOrderTypeData(payload)),
	// Clear Arbitrage Allow Order Type Action
	clearArbiAllowOrderTypeData: () => dispatch(clearArbiAllowOrderTypeData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllowOrderTypeListScreen)