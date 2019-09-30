import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages, showAlert, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getLpChargeConfigDetailList, clearLpChargeConfigData, addEditDeleteLpChargeConfigDetail } from '../../../actions/Arbitrage/ArbitrageLpChargeConfigActions';
import { AppConfig } from '../../../controllers/AppConfig';
import ImageViewWidget from '../../widget/ImageViewWidget';
import PaginationWidget from '../../widget/PaginationWidget';

class ArbitrageLpChargeConfigDetailScreen extends Component {

	constructor(props) {
		super(props);

		//item for from List screen 
		let item = props.navigation.state.params && props.navigation.state.params.item

		//Define all initial state
		this.state = {
			//item for from List screen 
			item: item,
			refreshing: false,
			search: '',
			response: [],
			lpChargeConfigDetailListDataState: null,
			isFirstTime: true,

			selectedPage: 1,
			row: [],
		};
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// Check internet is Available or not
		if (await isInternet()) {
			//To get callTopupHistoryApi 
			this.callLpChargeConfigDetailListApi()
		}
	}

	//api call for list and filter reset
	callLpChargeConfigDetailListApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
			})
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getLpChargeConfigDetailList list
			this.props.getLpChargeConfigDetailList({
				PageNo: 1,
				PageSize: AppConfig.pageSize,
				MasterId: this.state.item.Id
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearLpChargeConfigData()
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
		if (ArbitrageLpChargeConfigDetailScreen.oldProps !== props) {
			ArbitrageLpChargeConfigDetailScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { lpChargeConfigDetailListData } = props.data;

			if (lpChargeConfigDetailListData) {
				try {
					//if local lpChargeConfigDetailListData state is null or its not null and also different then new response then and only then validate response.
					if (state.lpChargeConfigDetailListDataState == null || (state.lpChargeConfigDetailListDataState != null && lpChargeConfigDetailListData !== state.lpChargeConfigDetailListDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: lpChargeConfigDetailListData, isList: true })) {

							let res = parseArray(lpChargeConfigDetailListData.Details);

							//for add kyc status static
							for (var convertedKey in res) {
								let item = res[convertedKey];

								//yes
								if (item.IsCurrencyConverted == 0) {
									item.IsCurrencyConvertedText = R.strings.no
								}
								//no
								else if (item.IsCurrencyConverted == 1) {
									item.IsCurrencyConvertedText = R.strings.yes_text
								}
								else {
									item.IsCurrencyConvertedText = ''
								}
							}

							return {
								...state, lpChargeConfigDetailListDataState: lpChargeConfigDetailListData,
								response: res, refreshing: false,
								row: addPages(lpChargeConfigDetailListData.TotalCount)
							};
						} else {
							return { ...state, lpChargeConfigDetailListDataState: lpChargeConfigDetailListData, response: [], refreshing: false, row: [] };
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

			//To getLpChargeConfigDetailList list
			this.props.getLpChargeConfigDetailList(
				{
					PageNo: this.state.selectedPage,
					PageSize: AppConfig.pageSize,
					MasterId: this.state.item.Id
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

				//To get getLpChargeConfigDetailList list
				this.props.getLpChargeConfigDetailList({
					PageNo: pageNo,
					PageSize: AppConfig.pageSize,
					MasterId: this.state.item.Id
				});
			}
		}
	}

	onDeletePress = (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				// Delete Api Call
				this.props.addEditDeleteLpChargeConfigDetail({
					Id: parseFloatVal(item.ChargeConfigDetailId), //if edit than pass id for insert 0 fixed
					IsCurrencyConverted: parseFloatVal(item.IsCurrencyConverted),
					ChargeValue: parseFloatVal(item.ChargeValue),
					Remarks: item.Remarks,
					DeductionWalletTypeId: parseFloatVal(item.DeductionWalletTypeId),
					MakerCharge: parseFloatVal(item.MakerCharge),
					TakerCharge: parseFloatVal(item.TakerCharge),
					ChargeType: parseFloatVal(item.ChargeType),
					ChargeConfigurationMasterID: parseFloatVal(item.ChargeConfigurationMasterID),
					ChargeDistributionBasedOn: parseFloatVal(item.ChargeDistributionBasedOn),
					ChargeValueType: parseFloatVal(item.ChargeValueType),
					Status: 9,//9 fix for delete
				})
			}
		}, R.strings.cancel, () => { })
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { lpChargeConfigDetailAddEditDeleteData } = this.props.data;

		// compare response with previous response
		if (lpChargeConfigDetailAddEditDeleteData !== prevProps.data.lpChargeConfigDetailAddEditDeleteData) {

			// lpChargeConfigDetailAddEditDeleteData is not null
			if (lpChargeConfigDetailAddEditDeleteData) {
				try {
					//handle response of delete API
					if (validateResponseNew({ response: lpChargeConfigDetailAddEditDeleteData })) {
						//Display Success Message and Refresh Wallet User List
						showAlert(R.strings.Success + '!', R.strings.delete_success, 0, async () => {

							//Clear Lp Charge Config Data 
							this.props.clearLpChargeConfigData();

							// Call Lp Charge Configuration List Api 
							this.callLpChargeConfigDetailListApi()
						});
					}
					else {
						//Clear Lp Charge Config Data 
						this.props.clearLpChargeConfigData();
					}
				} catch (error) {
					//Clear Lp Charge Config Data 
					this.props.clearLpChargeConfigData();
				}
			}
		}
	}

	render() {
		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.StrChargeValueType.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Remarks.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.IsCurrencyConvertedText.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (

			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set Progress bar as per our theme */}
				<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.lpChargeConfigDetailAddEditDeleteFetching} />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.LPChargeConfiguration + ' ' + R.strings.detail}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('ArbitrageLpChargeConfigDetailAddEditScreen', { MasterItem: this.state.item, onSuccess: this.callLpChargeConfigDetailListApi })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(this.props.data.lpChargeConfigDetailListFetching && !this.state.refreshing)
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
									<LpChargeConfigDetailItem
										index={index}
										item={item}
										onDelete={() => this.onDeletePress(item)}
										onEdit={() => { this.props.navigation.navigate('ArbitrageLpChargeConfigDetailAddEditScreen', { MasterItem: this.state.item, item, onSuccess: this.callLpChargeConfigDetailListApi }) }}
										size={this.state.response.length} />
								}
								// assign index as key value list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In FlatList Item
								refreshControl={<RefreshControl
									colors={[R.colors.accent]}
									progressBackgroundColor={R.colors.background}
									refreshing={this.state.refreshing}
									onRefresh={this.onRefresh}
								/>}
							/>
							:
							// Displayed empty component when no record found 
							<ListEmptyComponent module={R.strings.addLPChargeConfiguration + ' ' + R.strings.detail} onPress={() => this.props.navigation.navigate('ArbitrageLpChargeConfigDetailAddEditScreen', { MasterItem: this.state.item, onSuccess: this.callLpChargeConfigDetailListApi })} />
					}
					{/*To Set Pagination View  */}
					<View>
						{filteredList.length > 0
							&& <PaginationWidget
								onPageChange={(item) => { this.onPageChange(item) }}
								row={this.state.row}
								selectedPage={this.state.selectedPage}
							/>}
					</View>
				</View>
			</SafeView>
		);
	}
	styles = () => {
		return {
			container: {
				backgroundColor: R.colors.background,
				flex: 1,
			},
		}
	}
}

// This Class is used for display record in list
class LpChargeConfigDetailItem extends Component {
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
		let { index, item, size } = this.props;

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						borderRadius: 0,
						flex: 1,
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>
						<View style={{ flexDirection: 'row', flex: 1, }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							{/* for show WalletTypeName, ChargeValueType  */}
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{
									flex: 1, alignItems: 'center',
									justifyContent: 'space-between',
									flexDirection: 'row',
								}}>
									<Text style={{
										fontSize: R.dimens.smallText,
										color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold,
									}}>
										{validateValue(item.WalletTypeName)}
									</Text>
									<Text style={{
										color: R.colors.yellow,
										fontSize: R.dimens.smallText,
										fontFamily: Fonts.MontserratSemiBold,
									}}>
										{(validateValue(item.StrChargeType))}
									</Text>
								</View>

								{/* for show Remarks  */}
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<TextViewHML style={{
										fontSize: R.dimens.smallestText,
										color: R.colors.textPrimary,
										flex: 1,
									}}>{item.Remarks ? item.Remarks : ''}</TextViewHML>
								</View>
								{/* 	<View style={{ flex: 1, flexDirection: 'row' }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.currencyConverted + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.IsCurrencyConvertedText}</TextViewHML>
								</View> */}
							</View>
						</View>

						{/* for show Charge, Maker Charge and Taker Charge */}
						<View style={{ flex: 1, flexDirection: 'row', }}>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{
										fontSize: R.dimens.smallestText,
										color: R.colors.textSecondary,
									}}>{R.strings.Charge}</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>(%)</TextViewHML>
									}
								</View>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(parseFloatVal(item.ChargeValue).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.ChargeValue).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ alignItems: 'center', flex: 1, }}>
								<View style={{ alignItems: 'center', flexDirection: 'row', }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.maker}</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{
											fontSize: R.dimens.smallestText,
											color: R.colors.textSecondary,
										}}>(%)</TextViewHML>
									}
								</View>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.MakerCharge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.MakerCharge).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Taker}</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>(%)</TextViewHML>
									}
								</View>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.TakerCharge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.TakerCharge).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and button for edit,delete */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.StrStatus} />

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											margin: 0,
											padding: R.dimens.CardViewElivation,
											marginRight: R.dimens.widgetMargin,
											alignItems: 'center',
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth,
										}}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									icon={R.images.IC_EDIT}
									onPress={this.props.onEdit} />

								<ImageTextButton
									style={
										{
											margin: 0,
											padding: R.dimens.CardViewElivation,
											justifyContent: 'center',
											backgroundColor: R.colors.failRed,
											alignItems: 'center',
											borderRadius: R.dimens.titleIconHeightWidth,
										}}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onDelete}
									icon={R.images.IC_DELETE}
								/>
							</View>

						</View>
					</CardView>

				</View>

			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	
	//Updated Data For ArbitrageLpChargeConfigReducer Data 
	let data = {
		...state.ArbitrageLpChargeConfigReducer,
	}
	return {
		data
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getLpChargeConfigDetailList List Action 
		getLpChargeConfigDetailList: (request) => dispatch(getLpChargeConfigDetailList(request)),
		
		//for addEditDeleteLpChargeConfigDetailDetail list action 
		addEditDeleteLpChargeConfigDetail: (request) => dispatch(addEditDeleteLpChargeConfigDetail(request)),
		
		//Perform clearLpChargeConfigData Action 
		clearLpChargeConfigData: () => dispatch(clearLpChargeConfigData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ArbitrageLpChargeConfigDetailScreen);