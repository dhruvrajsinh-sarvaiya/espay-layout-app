import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray, parseFloatVal, parseIntVal, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import { getArbiChargeConfigDetailList, clearArbitrageChargeConfigData, updateArbiChargeConfigDetail } from '../../../actions/Arbitrage/ArbitrageChargeConfigActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import PaginationWidget from '../../widget/PaginationWidget';

export class ArbitrageChargeConfigDetailScreen extends Component {
	constructor(props) {
		super(props)

		// getting response from previous screen
		let MasterId = props.navigation.state.params && props.navigation.state.params.MasterId
		let CurrencyName = props.navigation.state.params && props.navigation.state.params.CurrencyName
		let WalletTypeId = props.navigation.state.params && props.navigation.state.params.WalletTypeId

		// Define all initial state
		this.state = {
			MasterId: MasterId ? MasterId : 0,
			WalletTypeId: WalletTypeId ? WalletTypeId : 0,
			CurrencyName: CurrencyName ? CurrencyName : '',

			row: [],
			ChargeConfigDetail: [],
			ChargeConfigDetailListState: null,
			UpdateChargeConfigDetailState: null,

			selectedPage: 1,
			searchInput: '',
			refreshing: false,
			isFirstTime: true,
		}

		this.request = {
			/* 			Page: 0,
						PageSize: AppConfig.pageSize */
		}
	}

	componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()

		// Call Arbitrage Charge Config Detail Api
		this.chargeConfigDetailApi()
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearArbitrageChargeConfigData()
	}

	chargeConfigDetailApi = async () => {
		// check internet connection
		if (await isInternet()) {
			// Bind Request for Api
			this.request = {
				...this.request,
				MasterId: this.state.MasterId
				//Page: 0
			}
			// Call Arbitrage Charge Config Detail Api
			this.props.getArbiChargeConfigDetailList(this.request)
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
				//Page: this.state.selectedPage - 1,
				MasterId: this.state.MasterId,
			}
			//call api for get Arbitrage Charge Configr detail
			this.props.getArbiChargeConfigDetailList(this.request)
		} else {
			this.setState({ refreshing: false });
		}
	}

	// Show alert dialog when user press on delete button
	onDeletePress = (response) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				// Delete Arbitrage Charge Config Detail Api Call
				this.props.updateArbiChargeConfigDetail({
					ChargeConfigDetailId: response.ChargeConfigDetailId,
					ChargeConfigurationMasterID: response.ChargeConfigurationMasterID,
					ChargeDistributionBasedOn: response.ChargeDistributionBasedOn,
					ChargeType: response.ChargeType,
					DeductionWalletTypeId: response.DeductionWalletTypeId,
					ChargeValue: parseIntVal(response.ChargeValue),
					ChargeValueType: parseIntVal(response.ChargeValueType),
					MakerCharge: parseFloatVal(response.MakerCharge),
					TakerCharge: parseFloatVal(response.TakerCharge),
					MinAmount: parseFloatVal(response.MinAmount),
					MaxAmount: parseFloatVal(response.MaxAmount),
					Remarks: response.Remarks,
					Status: 9
				})
			}
		}, R.strings.cancel, () => { })
	}

	// Navigate to AddEditArbiChargeConfigDetailScreen when user press on add button
	onAddPress = () => {
		this.props.navigation.navigate('AddEditArbiChargeConfigDetailScreen', {
			onRefresh: this.chargeConfigDetailApi,
			WalletTypeId: this.state.WalletTypeId,
			CurrencyName: this.state.CurrencyName,
			MasterId: this.state.MasterId,
		})
	}

	// Navigate to AddEditArbiChargeConfigDetailScreen when user press on edit button
	onEditPress = (item) => {
		this.props.navigation.navigate('AddEditArbiChargeConfigDetailScreen', {
			item,
			onRefresh: this.chargeConfigDetailApi,
			WalletTypeId: this.state.WalletTypeId,
			CurrencyName: this.state.CurrencyName,
			MasterId: this.state.MasterId,
		})
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (ArbitrageChargeConfigDetailScreen.oldProps !== props) {
			ArbitrageChargeConfigDetailScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { ChargeConfigDetailList, } = props.ArbitrageChargeConfigResult

			// ChargeConfigDetailList is not null
			if (ChargeConfigDetailList) {
				try {
					if (state.ChargeConfigDetailListState == null || (state.ChargeConfigDetailListState !== null && ChargeConfigDetailList !== state.ChargeConfigDetailListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: ChargeConfigDetailList, isList: true, })) {

							return Object.assign({}, state, {
								ChargeConfigDetailListState: ChargeConfigDetailList,
								ChargeConfigDetail: parseArray(ChargeConfigDetailList.Details),
								refreshing: false,
								//row: addPages(ChargeConfigDetailList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ChargeConfigDetailListState: null,
								ChargeConfigDetail: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ChargeConfigDetailListState: null,
						ChargeConfigDetail: [],
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
		const { UpdateChargeConfigDetail, } = this.props.ArbitrageChargeConfigResult;

		// compare response with previous response
		if (UpdateChargeConfigDetail !== prevProps.ArbitrageChargeConfigResult.UpdateChargeConfigDetail) {

			// UpdateChargeConfigDetail is not null
			if (UpdateChargeConfigDetail) {
				try {
					// if local UpdateChargeConfigDetail state is null or its not null and also different then new response then and only then validate response.
					if (this.state.UpdateChargeConfigDetailState == null || (this.state.UpdateChargeConfigDetailState != null && UpdateChargeConfigDetail !== this.state.UpdateChargeConfigDetailState)) {
						//handle response of API
						if (validateResponseNew({ response: UpdateChargeConfigDetail, })) {
							//Display Success Message and Refresh Arbitrage Charge Configuration List
							showAlert(R.strings.Success + '!', R.strings.recordDeletedSuccessfully, 0, async () => {
								this.setState({ UpdateChargeConfigDetailState: UpdateChargeConfigDetail })

								// Clear Arbitrage Charge Configuration Data 
								this.props.clearArbitrageChargeConfigData();

								// Call Arbitrage Charge Configuration List Api 
								this.props.getArbiChargeConfigDetailList(this.request)

							})
						} else {
							this.setState({ UpdateChargeConfigDetailState: null })

							// Clear Arbitrage Charge Configuration Data 
							this.props.clearArbitrageChargeConfigData()
						}
					}
				} catch (error) {
					this.setState({ UpdateChargeConfigDetailState: null })
					// Clear Arbitrage Charge Configuration Data   
					this.props.clearArbitrageChargeConfigData();
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { ChargeConfigDetailLoading, UpdateChargeConfigDetailLoading } = this.props.ArbitrageChargeConfigResult

		// For searching functionality
		let finalItems = this.state.ChargeConfigDetail.filter(item => (
			item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrChargeType.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.chargeConfigDetail}
					nav={this.props.navigation}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.onAddPress()}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				{/* Progressbar */}
				<ProgressDialog isShow={UpdateChargeConfigDetailLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(ChargeConfigDetailLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <ChargeConfigDetailItem
									index={index}
									item={item}
									size={finalItems.length}
									onDelete={() => this.onDeletePress(item)}
									onEdit={() => this.onEditPress(item)}
								/>}
								// assign index as key value to Arbitrage Charge Config Detail list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Arbitrage Charge Config Detail FlatList Item
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
								ListEmptyComponent={<ListEmptyComponent module={R.strings.addChargeConfigDetail} onPress={() => this.onAddPress()} />}
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
class ChargeConfigDetailItem extends Component {

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

		// Change status button background
		let statusBgColor = R.colors.failRed
		if (item.Status == 1)
			statusBgColor = R.colors.successGreen

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin, flex: 1,
				}}>
					<CardView style={{
						borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
						borderBottomLeftRadius: R.dimens.margin,
						flex: 1,
					}}>
						<View style={{
							flex: 1, flexDirection: 'row'
						}}>
							{/* Currency Image */}
							<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							{/* for show WalletTypeName, ChargeValueType  */}
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{
									justifyContent: 'space-between', flexDirection: 'row'
								}}>
									<Text style={{
										fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold,
									}}>
										{validateValue(item.WalletTypeName)}
									</Text>
									<Text style={{
										fontSize: R.dimens.smallText, color: R.colors.yellow, fontFamily: Fonts.MontserratSemiBold,
									}}>
										{(item.StrChargeType ? item.StrChargeType : '')}
									</Text>
								</View>

								{/* for Show Remarks  */}
								<View style={{
									flex: 1,
									flexDirection: 'row'
								}}>
									<TextViewHML style={{
										flex: 1,
										fontSize: R.dimens.smallestText, color: R.colors.textPrimary,
									}}>{item.Remarks ? item.Remarks : ''}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show Charge, Maker Charge and Taker Charge */}
						<View style={{
							flex: 1,
							flexDirection: 'row',
						}}>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Charge}</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>(%)</TextViewHML>
									}
								</View>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(parseFloatVal(item.ChargeValue).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.ChargeValue).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.maker}</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>(%)</TextViewHML>
									}
								</View>
								<TextViewHML style={{
									color: R.colors.textPrimary, fontSize: R.dimens.smallestText
								}}>
									{(parseFloatVal(item.MakerCharge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.MakerCharge).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{
								flex: 1,
								alignItems: 'center',
							}}>
								<View style={{
									alignItems: 'center',
									flexDirection: 'row',
								}}>
									<TextViewHML style={{
										fontSize: R.dimens.smallestText,
										color: R.colors.textSecondary,
									}}>
										{R.strings.Taker}
									</TextViewHML>
									{(item.ChargeValueType == 2) &&
										<TextViewHML style={{
											color: R.colors.textSecondary,
											fontSize: R.dimens.smallestText,
										}}>
											(%)
										</TextViewHML>}
								</View>
								<TextViewHML style={{
									color: R.colors.textPrimary,fontSize: R.dimens.smallestText
								}}>
									{
										(parseFloatVal(item.TakerCharge).toFixed(8) !== 'NaN' ?
											validateValue(parseFloatVal(item.TakerCharge).toFixed(8)) :
											'-')
									}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and button for edit,status,delete */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={statusBgColor}
								value={item.StrStatus} />

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											padding: R.dimens.CardViewElivation,
											marginRight: R.dimens.widgetMargin,
											alignItems: 'center',
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											backgroundColor: R.colors.accent,
										}}
									icon={R.images.IC_EDIT}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onEdit} />

								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											alignItems: 'center',
											margin: 0,
											padding: R.dimens.CardViewElivation,
											backgroundColor: R.colors.failRed,
											borderRadius: R.dimens.titleIconHeightWidth,
										}}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									icon={R.images.IC_DELETE} onPress={this.props.onDelete} />
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}


const mapStateToProps = (state) => {
	return {// Get arbitrage charge config data from reducer
		ArbitrageChargeConfigResult: state.ArbitrageChargeConfigReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Arbitrage Charge Config Detail Action
	getArbiChargeConfigDetailList: (payload) => dispatch(getArbiChargeConfigDetailList(payload)),
	// Clear Arbitrage Charge Config Detail Action
	clearArbitrageChargeConfigData: () => dispatch(clearArbitrageChargeConfigData()),
	// Perform Update Arbitrage Charge Config Detail Action
	updateArbiChargeConfigDetail: (payload) => dispatch(updateArbiChargeConfigDetail(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageChargeConfigDetailScreen)