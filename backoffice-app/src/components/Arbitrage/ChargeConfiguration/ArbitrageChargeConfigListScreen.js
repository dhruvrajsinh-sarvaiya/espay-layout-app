import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { changeTheme, parseArray, addPages, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getArbitrageChargeConfigList, clearArbitrageChargeConfigData, addArbitrageChargeConfigData } from '../../../actions/Arbitrage/ArbitrageChargeConfigActions';
import { validateResponseNew, isInternet, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import PaginationWidget from '../../widget/PaginationWidget';

export class ArbitrageChargeConfigListScreen extends Component {
	constructor(props) {
		super(props)

		// Define all initial state
		this.state = {
			row: [],
			ChargeConfigResponse: [],

			AddChargeConfigDataState: null,
			ChargeConfigListState: null,

			searchInput: '',
			selectedPage: 1,
			isFirstTime: false,
			refreshing: false,
		}

		//Initial request
		this.request = {
			PageNo: 1,
			PageSize: AppConfig.pageSize
		}
	}

	componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()

		// Call Arbitrage Charge Configuration Api
		this.chargeConfigApi()
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearArbitrageChargeConfigData()
	}

	chargeConfigApi = async () => {
		// check internet connection
		if (await isInternet()) {
			// Bind Request for Api
			this.request = {
				...this.request,
				PageNo: 1
			}
			// Call Arbitrage Charge Config Api
			this.props.getArbitrageChargeConfigList(this.request)
		} else {
			this.setState({ refreshing: false })
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
			//call api for get Arbitrage Charge Configr detail
			this.props.getArbitrageChargeConfigList(this.request)
		} else {
			this.setState({ refreshing: false });
		}
	}

	// Pagination Method Called When User Change Page 
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {
			//if user select other page number then and only then API Call elase no need to call API
			this.setState({ selectedPage: pageNo });

			// Check NetWork is Available or not
			if (await isInternet()) {
				// Bind request for Arbitrage Charge Configr List
				this.request = {
					...this.request,
					PageNo: pageNo,
				}
				//Call Get Arbitrage Charge Configr List API
				this.props.getArbitrageChargeConfigList(this.request)
			} else {
				this.setState({ refreshing: false })
			}
		}
	}

	// Show alert dialog when user press on delete button
	onDeletePress = (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				// Delete Arbitrage Charge Config Api Call
				this.props.addArbitrageChargeConfigData({
					Id: item.Id,
					WalletTypeId: item.WalletTypeID,
					TrnType: item.TrnType,
					KYCComplaint: item.KYCComplaint,
					Status: 9,
					SlabType: item.SlabType,
					SpecialChargeConfigurationID: 0,
					Remarks: item.Remarks
				})
			}
		}, R.strings.cancel, () => { })
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (ArbitrageChargeConfigListScreen.oldProps !== props) {
			ArbitrageChargeConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			
			//Get All Updated Feild of Particular actions
			const { ChargeConfigList, } = props.ArbitrageChargeConfigResult

			// ChargeConfigList is not null
			if (ChargeConfigList) {
				try {
					if (state.ChargeConfigListState == null || (ChargeConfigList !== state.ChargeConfigListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: ChargeConfigList, isList: true, })) {

							return Object.assign({}, state, {
								ChargeConfigListState: ChargeConfigList,
								ChargeConfigResponse: parseArray(ChargeConfigList.Data),
								refreshing: false,
								row: addPages(ChargeConfigList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ChargeConfigListState: null,
								ChargeConfigResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ChargeConfigListState: null,
						ChargeConfigResponse: [],
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
		const { AddChargeConfigData, } = this.props.ArbitrageChargeConfigResult;

		// compare response with previous response
		if (AddChargeConfigData !== prevProps.ArbitrageChargeConfigResult.AddChargeConfigData) {

			// AddChargeConfigData is not null
			if (AddChargeConfigData) {
				try {
					// if local AddChargeConfigData state is null or its not null and also different then new response then and only then validate response.
					if (this.state.AddChargeConfigDataState == null || (this.state.AddChargeConfigDataState != null && AddChargeConfigData !== this.state.AddChargeConfigDataState)) {
						//handle response of API
						if (validateResponseNew({ response: AddChargeConfigData, })) {
							//Display Success Message and Refresh Arbitrage Charge Configuration List
							showAlert(R.strings.Success + '!', R.strings.recordDeletedSuccessfully, 0, async () => {
								this.setState({ AddChargeConfigDataState: AddChargeConfigData })

								// Clear Arbitrage Charge Configuration Data 
								this.props.clearArbitrageChargeConfigData();

								// Call Arbitrage Charge Configuration List Api 
								this.props.getArbitrageChargeConfigList(this.request)

							})
						} else {
							this.setState({ AddChargeConfigDataState: null })

							// Clear Arbitrage Charge Configuration Data 
							this.props.clearArbitrageChargeConfigData()
						}
					}
				} catch (error) {
					this.setState({ AddChargeConfigDataState: null })
					// Clear Arbitrage Charge Configuration Data   
					this.props.clearArbitrageChargeConfigData();
				}
			}
		}
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ChargeConfigLoading, AddChargeConfigLoading } = this.props.ArbitrageChargeConfigResult

		// For searching functionality
		let finalItems = this.state.ChargeConfigResponse.filter(item => (
			item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.TrnTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.chargeConfig}
					nav={this.props.navigation}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('AddEditArbitrageChargeConfigScreen', { onRefresh: this.chargeConfigApi })}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				{/* Progressbar */}
				<ProgressDialog isShow={AddChargeConfigLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(ChargeConfigLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <ChargeConfigListItem
									index={index}
									item={item}
									size={finalItems.length}
									onDelete={() => this.onDeletePress(item)}
									onEdit={() => this.props.navigation.navigate('AddEditArbitrageChargeConfigScreen', { item, onRefresh: this.chargeConfigApi })}
									onDetailPress={() => this.props.navigation.navigate('ArbitrageChargeConfigDetailScreen', { MasterId: item.Id, WalletTypeId: item.WalletTypeID, CurrencyName: item.WalletTypeName })}
								/>}
								// assign index as key value to Arbitrage Charge Config list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Arbitrage Charge Config FlatList Item
								refreshControl={
									<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh}
									/>
								}
								contentContainerStyle={contentContainerStyle(finalItems)}
								// Displayed empty component when no record found 
								ListEmptyComponent={<ListEmptyComponent module={R.strings.addChrgeConfiguration} onPress={() => this.props.navigation.navigate('AddEditArbitrageChargeConfigScreen', { onRefresh: this.chargeConfigApi })} />}
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
		)
	}
}

// This Class is used for display record in list
class ChargeConfigListItem extends Component {

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
		let { size, index, item, } = this.props

		let statusTextColor = R.colors.failRed
		let statusText = R.strings.inActive

		//Set status color based on status code
		if (item.Status == 1) {
			statusText = R.strings.active
			statusTextColor = R.colors.successGreen
		}

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
						borderBottomLeftRadius: R.dimens.margin,
					}}>

						<View style={{ flexDirection: 'row' }}>
							{/* for show coin image */}
							<View style={{ alignSelf: 'flex-start', justifyContent: 'flex-start',  alignItems: 'flex-start', alignContent: 'flex-start' }}>
								<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
							</View>


							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>

								{/* for show WalletTypeName and TrnTypeName */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									<Text style={{
										fontSize: R.dimens.smallText, color: R.colors.textPrimary,
										fontFamily: Fonts.MontserratSemiBold,
									}}>{item.WalletTypeName ? item.WalletTypeName : '-'}</Text>
									<Text style={{
										fontSize: R.dimens.smallText, color: R.colors.yellow,
										fontFamily: Fonts.MontserratSemiBold,
									}}>{validateValue(item.TrnTypeName)}</Text>
								</View>

								{/* for show kycCompliant and IsKYCEnable */}
								<View style={{ flex: 1, }}>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{
											fontSize: R.dimens.smallestText,
											color: R.colors.textSecondary,
										}}>{R.strings.kycCompliant + ': '}</TextViewHML>
										<TextViewHML style={{
											flex: 1, fontSize: R.dimens.smallestText,
											color: R.colors.textPrimary,
										}}>{item.IsKYCEnable == 0 ? R.strings.no : R.strings.yes_text}</TextViewHML>
									</View>

									{/* for show Remarks */}
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{
											fontSize: R.dimens.smallestText,
											color: R.colors.textSecondary,
										}}>{R.strings.remarks + ': '}</TextViewHML>
										<TextViewHML style={{
											flex: 1, fontSize: R.dimens.smallestText,
											color: R.colors.textPrimary,
										}}>{validateValue(item.Remarks)}</TextViewHML>
									</View>
								</View>
							</View>
						</View>

						{/* for show status and button for edit,status,delete */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={statusTextColor}
								value={statusText}></StatusChip>

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={
										{
											alignItems: 'center',backgroundColor: R.colors.yellow,
											justifyContent: 'center',
											borderRadius: R.dimens.titleIconHeightWidth, margin: 0,
											padding: R.dimens.CardViewElivation,
											marginRight: R.dimens.widgetMargin,
										}}
									icon={R.images.IC_VIEW_LIST} onPress={this.props.onDetailPress}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									 />

								<ImageTextButton
									style={
										{
											alignItems: 'center', backgroundColor: R.colors.accent,
											justifyContent: 'center',
											borderRadius: R.dimens.titleIconHeightWidth,margin: 0,padding: R.dimens.CardViewElivation,
											marginRight: R.dimens.widgetMargin,
										}}
									
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onEdit} icon={R.images.IC_EDIT} />

								<ImageTextButton
									style={
										{
											alignItems: 'center',
											backgroundColor: R.colors.failRed,	borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,padding: R.dimens.CardViewElivation,
											justifyContent: 'center',
										}}
									icon={R.images.IC_DELETE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}  onPress={this.props.onDelete}
									 />
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
		// get arbitrage charge config data from reducer
		ArbitrageChargeConfigResult: state.ArbitrageChargeConfigReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Arbitrage Charge Config Action
	getArbitrageChargeConfigList: (payload) => dispatch(getArbitrageChargeConfigList(payload)),
	// Clear Arbitrage Charge Config Action
	clearArbitrageChargeConfigData: () => dispatch(clearArbitrageChargeConfigData()),
	// Perform Arbitrage Add Charge Config
	addArbitrageChargeConfigData: (payload) => dispatch(addArbitrageChargeConfigData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageChargeConfigListScreen)