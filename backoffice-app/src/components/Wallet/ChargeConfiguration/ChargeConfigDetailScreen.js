import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';
import CardView from '../../../native_theme/components/CardView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import R from '../../../native_theme/R';
import { getChargeConfigDetail, clearChargeConfigData, UpdateChargesConfigurationDetail } from '../../../actions/Wallet/ChargeConfigActions';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, showAlert, parseFloatVal, } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { Fonts } from '../../../controllers/Constants';

export class ChargeConfigDetailScreen extends Component {
	constructor(props) {
		super(props);

		//item for from List screen 
		let item = props.navigation.state.params && props.navigation.state.params.item

		//Define all initial state
		this.state = {

			//item for from List screen 
			item: item,

			search: '',
			refreshing: false,
			isFirstTime: true,
			response: [],
			ChargeConfigDetail: null,
		};
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Charge Configuration List Api 
			this.props.getChargeConfigDetail({ MasterId: this.state.item.Id })
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			//Call Get Charge Configuration API
			this.props.getChargeConfigDetail({ MasterId: this.state.item.Id })

		} else {
			this.setState({ refreshing: false });
		}
	}

	onDeletePress = (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				let request = {
					ChargeConfigDetailId: item.ChargeConfigDetailId,
					ChargeConfigurationMasterID: item.ChargeConfigurationMasterID,
					ChargeDistributionBasedOn: item.ChargeDistributionBasedOn,
					ChargeType: item.ChargeType,
					DeductionWalletTypeId: item.DeductionWalletTypeId,
					ChargeValue: item.ChargeValue,
					ChargeValueType: item.ChargeValueType,
					MakerCharge: item.MakerCharge,
					TakerCharge: item.TakerCharge,
					MinAmount: item.MinAmount,
					MaxAmount: item.MaxAmount,
					Remarks: item.Remarks,
					Status: 9, //fix for delete
				}

				// Delete Config Data Api Call
				this.props.deleteChargeConfigDetailData(request)
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
		if (ChargeConfigDetailScreen.oldProps !== props) {
			ChargeConfigDetailScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { ChargeConfigDetail, } = props.data;

			// ChargeConfigList is not null
			if (ChargeConfigDetail) {
				try {
					if (state.ChargeConfigDetail == null || (state.ChargeConfigDetail != null && ChargeConfigDetail !== state.ChargeConfigDetail)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: ChargeConfigDetail, isList: true })) {

							return Object.assign({}, state, {
								ChargeConfigDetail,
								response: parseArray(ChargeConfigDetail.Details),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ChargeConfigDetail: null,
								refreshing: false,
								response: [],
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ChargeConfigDetail: null,
						response: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}
		return null
	}

	componentDidUpdate = async (prevProps, prevState) => {
		const { updateDetailData } = this.props.data;

		// compare response with previous response
		if (updateDetailData !== prevProps.data.updateDetailData) {
			//Check updateDetailData Response for delete
			if (updateDetailData) {
				try {
					//handle response of API
					if (validateResponseNew({
						response: updateDetailData,
						isList: false,
					})) {
						showAlert(R.strings.Success, R.strings.delete_success + '\n' + ' ', 0, () => {

							//Clear Charge Config Data 
							this.props.clearChargeConfigData();

							//To call getChargeConfigDetail api
							this.props.getChargeConfigDetail({ MasterId: this.state.item.Id })
						});
					}
					else {
						//Clear Charge Config Data 
						this.props.clearChargeConfigData();
					}
				} catch (e) {
					//Clear Charge Config Data 
					this.props.clearChargeConfigData();
				}
			}
		}
	}

	//this method is call when user add or update success from the add or update screen 
	onSuccessAddEdit = async () => {
		//Check NetWork is Available or not
		if (await isInternet()) {
			//call getChargeConfigDetail list Api 
			this.props.getChargeConfigDetail({ MasterId: this.state.item.Id });
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { updateDetailLoading, ChargeConfigDetailLoading } = this.props.data

		// for searching
		let filteredList = this.state.response.filter(item => (
			item.StrChargeType.toLowerCase().includes(this.state.search.toLowerCase()) ||
			item.StrChargeValueType.toLowerCase().includes(this.state.search.toLowerCase()) ||
			item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase())
		));

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* Progress bar */}
				<ProgressDialog isShow={updateDetailLoading} />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.chargeConfig + ' ' + R.strings.detail}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('ChargeConfigDetailAddEditScreen', { edit: false, MasterItem: this.state.item, onSuccess: this.onSuccessAddEdit })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(ChargeConfigDetailLoading && !this.state.refreshing)
						?
						<ListLoader />
						:
						<FlatList
							data={filteredList}
							extraData={this.state}
							showsVerticalScrollIndicator={false}
							// render all item in list
							renderItem={({ item, index }) =>
								<ChargeConfigDetailItem
									index={index}
									item={item}
									onEdit={() => this.props.navigation.navigate('ChargeConfigDetailAddEditScreen', { item, MasterItem: this.state.item, edit: true, onSuccess: this.onSuccessAddEdit })}
									onDelete={() => this.onDeletePress(item)}
									size={filteredList.length} />
							}
							// assign index as key valye to Withdrawal list item
							keyExtractor={(_item, index) => index.toString()}
							// For Refresh Functionality In Withdrawal FlatList Item
							refreshControl={<RefreshControl
								colors={[R.colors.accent]}
								progressBackgroundColor={R.colors.background}
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh}
							/>}
							contentContainerStyle={contentContainerStyle(filteredList)}
							// Displayed Empty Component when no record found 
							ListEmptyComponent={<ListEmptyComponent module={R.strings.addChrgeConfiguration + '' + R.strings.detail} onPress={() => this.props.navigation.navigate('ChargeConfigDetailAddEditScreen', { edit: false, MasterItem: this.state.item, onSuccess: this.onSuccessAddEdit })} />}
						/>
					}
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
		//if old item and new item are different than only render list item
		if (this.props.item === nextProps.item) {
			return false
		}
		return true
	}

	render() {
		let { index, size, item } = this.props;
		let statusTextColor = R.colors.successGreen

		//if status is inactive=0 than set icons and colors
		if (item.Status == 0) {
			statusTextColor = R.colors.failRed
		}

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
						flex: 1,
						borderRadius: 0,
						elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
						borderBottomLeftRadius: R.dimens.margin,
					}}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							{/* for show WalletTypeName, ChargeValueType  */}
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{
									justifyContent: 'space-between',
									flexDirection: 'row'
								}}>
									<Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>
										{validateValue(item.WalletTypeName)}
									</Text>
									<Text style={{ fontSize: R.dimens.smallText, color: R.colors.yellow, fontFamily: Fonts.MontserratSemiBold, }}>
										{(item.StrChargeType ? item.StrChargeType : '')}
									</Text>
								</View>

								{/* for show Remarks  */}
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.Remarks ? item.Remarks : ''}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show Charge, Maker Charge and Taker Charge */}
						<View style={{
							flexDirection: 'row',
							flex: 1,
						}}>

							<View style={{
								flex: 1,
								alignItems: 'center',
							}}>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}>
									<TextViewHML style={{
										color: R.colors.textSecondary,
										fontSize: R.dimens.smallestText,
									}}>{R.strings.Charge}
									</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{
											fontSize: R.dimens.smallestText,
											color: R.colors.textSecondary,
										}}>(%)
											 </TextViewHML>
									}
								</View>
								<TextViewHML style={{
									fontSize: R.dimens.smallestText,
									color: R.colors.textPrimary,
								}}>
									{(parseFloatVal(item.ChargeValue).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.ChargeValue).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.maker}</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{
											color: R.colors.textSecondary,
											fontSize: R.dimens.smallestText,
										}}>(%)</TextViewHML>
									}
								</View>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.MakerCharge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.MakerCharge).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}>
									<TextViewHML style={{
										color: R.colors.textSecondary, fontSize: R.dimens.smallestText
									}}>{R.strings.Taker}</TextViewHML>
									{
										(item.ChargeValueType == 2) &&
										<TextViewHML style={{
											color: R.colors.textSecondary,
											fontSize: R.dimens.smallestText,
										}}>(%)</TextViewHML>
									}
								</View>
								<TextViewHML style={{
									color: R.colors.textPrimary,
									fontSize: R.dimens.smallestText
								}}>
									{(parseFloatVal(item.TakerCharge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.TakerCharge).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and button for edit,status,delete */}
						<View style={{
							flex: 1, flexDirection: 'row',
							justifyContent: 'space-between', marginTop: R.dimens.widgetMargin,
						}}>
							<StatusChip
								value={item.StrStatus}
								color={statusTextColor}
							/>

							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth,
											marginRight: R.dimens.widgetMargin,
											margin: 0,
											padding: R.dimens.CardViewElivation,
										}} icon={R.images.IC_EDIT}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onEdit} />

								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											backgroundColor: R.colors.failRed,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation,
											alignItems: 'center',
										}} icon={R.images.IC_DELETE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onDelete} />
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
		// Get charge configuration data from reducer
		data: state.ChargeConfigReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Charge Config List Action
	getChargeConfigDetail: (request) => dispatch(getChargeConfigDetail(request)),
	// To Perform Delete Charge Configuration Data Action
	deleteChargeConfigDetailData: (payload) => dispatch(UpdateChargesConfigurationDetail(payload)),
	// To Perform Clear Charge Config Data
	clearChargeConfigData: () => dispatch(clearChargeConfigData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChargeConfigDetailScreen);