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
import { getChargeConfigList, deleteChargeConfigData, clearChargeConfigData } from '../../../actions/Wallet/ChargeConfigActions';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, showAlert, } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { Fonts } from '../../../controllers/Constants';

export class ChargeConfigListScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			search: '',
			refreshing: false,
			isFirstTime: true,
			ChargeConfigListResponse: [],
		};
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Leverage Configuration List Api 
			this.props.getChargeConfigList()
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			//Call Get Leverage Configuration API
			this.props.getChargeConfigList();

		} else {
			this.setState({ refreshing: false });
		}
	}

	onDeletePress = (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {

				// Delete Levaerage Config Data Api Call
				this.props.deleteChargeConfigData({ MasterId: item.Id, SlabType: item.SlabType, Status: 9, })
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
		if (ChargeConfigListScreen.oldProps !== props) {
			ChargeConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { ChargeConfigList, } = props.ChargeConfigResult;

			// ChargeConfigList is not null
			if (ChargeConfigList) {
				try {
					if (state.ChargeConfigList == null || (state.ChargeConfigList != null && ChargeConfigList !== state.ChargeConfigList)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: ChargeConfigList, isList: true })) {

							return Object.assign({}, state, {
								ChargeConfigList,
								ChargeConfigListResponse: parseArray(ChargeConfigList.Details),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								ChargeConfigList: null,
								refreshing: false,
								ChargeConfigListResponse: [],
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						ChargeConfigList: null,
						ChargeConfigListResponse: [],
						refreshing: false,
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, _prevState) {
		const { DelChargeConfigData, } = this.props.ChargeConfigResult;

		// compare response with previous response
		if (DelChargeConfigData !== prevProps.ChargeConfigResult.DelChargeConfigData) {

			// DelChargeConfigData is not null
			if (DelChargeConfigData) {
				try {
					// if local DelChargeConfigData state is null or its not null and also different then new response then and only then validate response.
					if (this.state.DelChargeConfigData == null || (this.state.DelChargeConfigData != null && DelChargeConfigData !== this.state.DelChargeConfigData)) {
						//handle response of API
						if (validateResponseNew({ response: DelChargeConfigData })) {
							//Display Success Message and Refresh Wallet User List
							showAlert(R.strings.Success + '!', R.strings.delete_success, 0, async () => {
								this.setState({ DelChargeConfigData })

								//Clear Charge Config Data 
								this.props.clearChargeConfigData();

								// Call Charge Configuration List Api 
								this.props.getChargeConfigList()

							});
						}
					}
				} catch (error) {
					this.setState({ DelChargeConfigData: null })
					//Clear Add User Data 
					this.props.clearChargeConfigData();
				}
			}
		}
	}

	//this method is call when user add or update success from the add or update screen 
	onSuccessAddEdit = async () => {
		//Check NetWork is Available or not
		if (await isInternet()) {
			//call referral list Api 
			this.props.getChargeConfigList();
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { DelChargeConfigLoading, ChargeConfigLoading } = this.props.ChargeConfigResult

		let filteredList = this.state.ChargeConfigListResponse.filter(item => (
			item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
			item.TrnTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
			item.StrKYCComplaint.toLowerCase().includes(this.state.search.toLowerCase())
		));

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* Progress bar */}
				<ProgressDialog isShow={DelChargeConfigLoading} />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.chargeConfig}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('ChargeConfigAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(ChargeConfigLoading && !this.state.refreshing)
						?
						<ListLoader />
						:
						<FlatList
							data={filteredList}
							extraData={this.state}
							showsVerticalScrollIndicator={false}
							// render all item in list
							renderItem={({ item, index }) =>
								<ChargeConfigListItem
									index={index}
									item={item}
									onEdit={() => this.props.navigation.navigate('ChargeConfigAddEditScreen', { item, edit: true, onSuccess: this.onSuccessAddEdit })}
									onDetailPress={() => this.props.navigation.navigate('ChargeConfigDetailScreen', { item })}
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
							ListEmptyComponent={
								<ListEmptyComponent
									module={R.strings.addChrgeConfiguration}
									onPress={() =>
										this.props.navigation.navigate('ChargeConfigAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })}
								/>}
						/>

					}
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
		//if old item and new item are different than only render list item
		if (this.props.item === nextProps.item) { return false }
		return true
	}

	render() {
		let statusText = ''
		let { index, size, item } = this.props;
		let statusTextColor = R.colors.successGreen
		let color = R.colors.failRed
		let icon = R.images.IC_DELETE

		//if status is inactive=0 than set icons and colors
		if (item.Status == 0) {
			statusTextColor = R.colors.failRed
			statusText = R.strings.inActive
		}

		//if status is active=1 than set icons and colors
		else if (item.Status == 1) {
			statusText = R.strings.active 
		}

		return (
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						flex: 1,
						borderRadius: 0,
						padding: 0,
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}} onPress={this.props.onPress}>

						<View style={{ padding: R.dimens.WidgetPadding, }}>

							<View style={{ flexDirection: 'row' }}>
								{/* for show coin image */}
								<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
									<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
								</View>

								<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
									<View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
										<Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName ? item.WalletTypeName : '-'}</Text>
									</View>

									<View style={{ flex: 1, }}>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.TrnType + ': '}</TextViewHML>
											<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.TrnTypeName ? item.TrnTypeName : '-'}</TextViewHML>
										</View>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.kycCompliant + ': '}</TextViewHML>
											<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.IsKYCEnable == 0 ? R.strings.no : R.strings.yes_text}</TextViewHML>
										</View>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<TextViewHML style={{ flex: 1, fontSize: R.dimens.secondCurrencyText, color: R.colors.textPrimary, }}>{validateValue(item.Remarks)}</TextViewHML>
										</View>
									</View>
								</View>

							</View>

							{/* for show status and button for edit,status,delete */}
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
								<StatusChip
									color={statusTextColor}
									value={statusText}></StatusChip>
								<View>

									<View style={{ flexDirection: 'row' }}>
										<ImageTextButton
											style={
												{
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: R.colors.yellow,
													borderRadius: R.dimens.titleIconHeightWidth,
													margin: 0,
													padding: R.dimens.CardViewElivation,
													marginRight: R.dimens.widgetMargin,
												}}
											icon={R.images.IC_VIEW_LIST}
											iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
											onPress={this.props.onDetailPress} />

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

										<ImageTextButton
											style={
												{
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: color,
													borderRadius: R.dimens.titleIconHeightWidth,
													margin: 0,
													padding: R.dimens.CardViewElivation,
												}}
											icon={icon}
											iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
											onPress={this.props.onDelete} />
									</View>
								</View>
							</View>
						</View>
					</CardView>
				</View >
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get charge configuration data from reducer
		ChargeConfigResult: state.ChargeConfigReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Charge Config List Action
	getChargeConfigList: () => dispatch(getChargeConfigList()),
	// To Perform Delete Leverage Configuration Data Action
	deleteChargeConfigData: (payload) => dispatch(deleteChargeConfigData(payload)),
	// To Perform Clear Charge Config Data
	clearChargeConfigData: () => dispatch(clearChargeConfigData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChargeConfigListScreen);