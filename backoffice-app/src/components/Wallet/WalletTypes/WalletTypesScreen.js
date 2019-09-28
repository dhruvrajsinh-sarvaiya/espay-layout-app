import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import { getWalletTypeMaster } from '../../../actions/PairListAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { deleteWalletTypeMaster, clearWalletTypesData } from '../../../actions/Wallet/WalletTypesAction';
import ImageViewWidget from '../../widget/ImageViewWidget';

class WalletTypesScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],
			wallettypesData: null,
			deleteData: null,
			isFirstTime: true,
		};
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		//To get callWalletTypesApi 
		this.callWalletTypesApi()
	};

	//api call
	callWalletTypesApi = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getWalletTypeMaster list
			this.props.getWalletTypeMaster();
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		//For stop twice api call
		return isCurrentScreen(nextProps);
	};

	componentWillUnmount = () => {
		//for Data clear on Backpress
		this.props.clearWalletTypesData();
	};

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
		if (WalletTypesScreen.oldProps !== props) {
			WalletTypesScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			const { wallettypesData, } = props.data;

			if (wallettypesData) {
				try {
					//if local wallettypesData state is null or its not null and also different then new response then and only then validate response.
					if (state.wallettypesData == null || (state.wallettypesData != null && wallettypesData !== state.wallettypesData)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: wallettypesData, isList: true })) {

							let res = parseArray(wallettypesData.walletTypeMasters);

							//for add userData
							for (var walletTypeKey in res) {
								let item = res[walletTypeKey];
								if (item.Status === 0) {
									item.statusText = R.strings.disabled
								}
								else if (item.Status === 1) {
									item.statusText = R.strings.enabled
								}
								else {
									item.statusText = ''
								}
							}

							return { ...state, wallettypesData, response: res, refreshing: false };
						} else {
							return { ...state, wallettypesData, response: [], refreshing: false };
						}
					}
				} catch (e) {
					return { ...state, response: [], refreshing: false };
				}
			}
		}
		return null;
	}

	componentDidUpdate = async (prevProps, prevState) => {
		const { deleteData } = this.props.data;
		if (deleteData !== prevProps.data.deleteData) {
			//Check delete Response 
			if (deleteData) {
				try {
					//Get Api response
					if (validateResponseNew({
						response: deleteData,
					})) {

						showAlert(R.strings.Success, R.strings.delete_success + '\n' + ' ', 0, () => {

							//To call getTrnTypeRoleWise list api
							this.callWalletTypesApi()

							this.props.clearWalletTypesData();
						});
					}
					else {
						this.props.clearWalletTypesData();
					}
				} catch (e) {
					this.props.clearWalletTypesData();
				}
			}
		}
	}

	onRefresh = async () => {

		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getWalletTypeMaster list
			this.props.getWalletTypeMaster();
		} else {
			this.setState({ refreshing: false });
		}
	}

	onDeletePress = async (item) => {
		showAlert(R.strings.Delete_Record, R.strings.areyousure, 3, async () => {
			if (await isInternet()) {

				//call for deleteWalletTypeMaster api
				this.props.deleteWalletTypeMaster({ id: item.Id })
			}
		}, R.strings.cancel)
	}

	render() {

		let filteredList = [];

		//for search all fields if response length > 0
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.CoinName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Description.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusText.toLowerCase().includes(this.state.search.toLowerCase()) ||
				/*  item.CreatedDate.toLowerCase().includes(this.state.search.toLowerCase()) || */
				convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false).toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set Progress bar as per our theme */}
				<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.deleteLoading} />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.WalletTypes}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('WalletTypesAddEditScreen', { onSuccess: this.callWalletTypesApi })}
				/>

				{(this.props.data.Loading && !this.state.refreshing)
					?
					<ListLoader />
					:
					filteredList.length > 0 ?
						<FlatList
							data={filteredList}
							extraData={this.state}
							showsVerticalScrollIndicator={false}
							renderItem={({ item, index }) =>
								<WalletTypesItem
									index={index}
									item={item}
									onDelete={() => this.onDeletePress(item)}
									onDetailPress={() => this.props.navigation.navigate('WalletTypesDetailScreen', { item })}
									onEdit={() => { this.props.navigation.navigate('WalletTypesAddEditScreen', { item, onSuccess: this.callWalletTypesApi, edit: true }) }}
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
						<ListEmptyComponent module={R.strings.addWalletType} onPress={() => this.props.navigation.navigate('WalletTypesAddEditScreen', { onSuccess: this.callWalletTypesApi })} />
				}

			</SafeView>
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
class WalletTypesItem extends Component {
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
		let { index, size, item, onDetailPress } = this.props;

		return (
			<AnimatableItem>
				<View style={{
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1,
					marginRight: R.dimens.widget_left_right_margin,
					marginLeft: R.dimens.widget_left_right_margin,marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						borderTopRightRadius: R.dimens.margin,elevation: R.dimens.listCardElevation,flex: 1,
						borderRadius: 0,borderBottomLeftRadius: R.dimens.margin,
					}} onPress={onDetailPress}>
						<View style={{ flex: 1, flexDirection: 'row' }}>

							{/* WalletType Image */}
							<ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, }}>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

									{/* for show CoinName,CreatedDate */}
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.CoinName)}</TextViewMR>

									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
										<ImageTextButton
											style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
											icon={R.images.IC_TIMER}
											iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
										/>
										<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
										<Image
											source={R.images.RIGHT_ARROW_DOUBLE}
											style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>

								{/* for show Description */}
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.Description)}</TextViewHML>
								</View>

								{/* for show DepositionAllow */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.allowDeposition + ': '}</TextViewHML>
									<Image
										source={item.IsDepositionAllow == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
										style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.SMALLEST_ICON_SIZE, height: R.dimens.SMALLEST_ICON_SIZE, tintColor: item.IsDepositionAllow == 1 ? R.colors.successGreen : R.colors.failRed }}
									/>
								</View>

								{/* for show WithdrawalAllow */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.allowWithdrawal + ': '}</TextViewHML>
									<Image
										source={item.IsWithdrawalAllow == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
										style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.SMALLEST_ICON_SIZE, height: R.dimens.SMALLEST_ICON_SIZE, tintColor: item.IsWithdrawalAllow == 1 ? R.colors.successGreen : R.colors.failRed }}
									/>

								</View>

								{/* for show TransactionWallet */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.allowTransaction + ': '}</TextViewHML>
									<Image
										source={item.IsTransactionWallet == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
										style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.SMALLEST_ICON_SIZE, height: R.dimens.SMALLEST_ICON_SIZE, tintColor: item.IsTransactionWallet == 1 ? R.colors.successGreen : R.colors.failRed }}
									/>
								</View>
							</View>
						</View >

						{/* for show status and edit delete */}
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>

							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.statusText}
								onPress={this.props.onChangeStatus}
							/>
							<View style={{ flexDirection: 'row' }}>

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
											backgroundColor: R.colors.failRed,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											padding: R.dimens.CardViewElivation,
										}}
									icon={R.images.IC_DELETE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={this.props.onDelete} />
							</View>
						</View>
					</CardView>
				</View >
			</AnimatableItem >
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For WalletTypesReducer Data 
	let data = {
		...state.WalletTypesReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getWalletTypeMaster List Action 
		getWalletTypeMaster: () => dispatch(getWalletTypeMaster()),
		//Perform deleteWalletTypeMaster List Action 
		deleteWalletTypeMaster: (payload) => dispatch(deleteWalletTypeMaster(payload)),
		//Perform clearWalletTypesData Action 
		clearWalletTypesData: () => dispatch(clearWalletTypesData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(WalletTypesScreen);