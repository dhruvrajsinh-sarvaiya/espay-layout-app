import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, } from 'react-native'
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getWalletTrnTypesList, changeWalletTrnTypes, clearWalletTrnTypes } from '../../../actions/Wallet/WalletTrnTypesActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class WalletTrnTypesListScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			WalletTrnTypeResponse: [],

			refreshing: false,
			isFirstTime: true,
			searchInput: '',
		}
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Wallet Transaction Types Api
			this.props.getWalletTrnTypesList()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	// for swipe to refresh functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (needUpdate && await isInternet()) {

			// Call Get Wallet Transaction Types API
			this.props.getWalletTrnTypesList();

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Call when user press on delete button
	onDeletePress = async (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				// Delete Levaerage Config Data Api Call
				this.props.changeWalletTrnTypes({ Id: item.Id, Status: 9 })
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
		if (WalletTrnTypesListScreen.oldProps !== props) {
			WalletTrnTypesListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { WalletTrnTypesList } = props.WalletTrnTypesResult

			// WalletTrnTypesList is not null
			if (WalletTrnTypesList) {
				try {
					if (state.WalletTrnTypesList == null || (state.WalletTrnTypesList !== null && WalletTrnTypesList !== state.WalletTrnTypesList)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: WalletTrnTypesList, isList: true, })) {

							return Object.assign({}, state, {
								WalletTrnTypesList,
								WalletTrnTypeResponse: parseArray(WalletTrnTypesList.Data),
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								WalletTrnTypesList: null,
								WalletTrnTypeResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						WalletTrnTypesList: null,
						WalletTrnTypeResponse: [],
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
		const { ChangeWalletTrnType, } = this.props.WalletTrnTypesResult;

		// compare response with previous response
		if (ChangeWalletTrnType !== prevProps.WalletTrnTypesResult.ChangeWalletTrnType) {

			// ChangeWalletTrnType is not null
			if (ChangeWalletTrnType) {
				try {
					// if local ChangeWalletTrnType state is null or its not null and also different then new response then and only then validate response.
					if (this.state.ChangeWalletTrnType == null || (this.state.ChangeWalletTrnType != null && ChangeWalletTrnType !== this.state.ChangeWalletTrnType)) {
						//handle response of API
						if (validateResponseNew({ response: ChangeWalletTrnType })) {
							//Display Success Message and Refresh Wallet Trn Type List
							showAlert(R.strings.Success + '!', R.strings.recordDeletedSuccessfully, 0, async () => {
								this.setState({ ChangeWalletTrnType })

								// Clear Wallet Trn Type Data 
								this.props.clearWalletTrnTypes();

								// Call Wallet Trn Type List Api 
								this.props.getWalletTrnTypesList()

							});
						}
					}
				} catch (error) {
					this.setState({ ChangeWalletTrnType: null })
					// Clear Wallet Trn Type Data   
					this.props.clearWalletTrnTypes();
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { WalletTrnTypesLoading, ChangeWalletTrnTypeLoading } = this.props.WalletTrnTypesResult

		// For searching
		let finalItems = this.state.WalletTrnTypeResponse.filter(item => (
			item.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.WalletType.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.TrnTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.WalletId.toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.walletTransactionTypes}
					nav={this.props.navigation}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('AddEditWalletTrnTypesScreen', { onRefresh: this.onRefresh })}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				{/* Progressbar */}
				<ProgressDialog isShow={ChangeWalletTrnTypeLoading} />

				{
					(WalletTrnTypesLoading && !this.state.refreshing) ?
						<ListLoader />
						:
						<FlatList
							data={finalItems}
							showsVerticalScrollIndicator={false}
							// render all item in list
							renderItem={({ item, index }) => <WalletTrnTypesListItem
								index={index}
								item={item}
								size={finalItems.length}
								onDelete={() => this.onDeletePress(item)}
								onEdit={() => this.props.navigation.navigate('AddEditWalletTrnTypesScreen', { item, onRefresh: this.onRefresh })} />
							}
							// assign index as key value to Wallet Trn Types list item
							keyExtractor={(_item, index) => index.toString()}
							// For Refresh Functionality In Wallet Trn Types FlatList Item
							refreshControl={
								<RefreshControl
									colors={[R.colors.accent]}
									progressBackgroundColor={R.colors.background}
									refreshing={this.state.refreshing}
									onRefresh={() => this.onRefresh(true, true)}
								/>
							}
							contentContainerStyle={contentContainerStyle(finalItems)}
							// Displayed empty component when no record found 
							ListEmptyComponent={<ListEmptyComponent />}
						/>
				}
			</SafeView>
		)
	}
}

// This Class is used for display record in list
class WalletTrnTypesListItem extends Component {

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
		let { size, index, item, onEdit, onDelete } = this.props

		let color = R.colors.failRed
		if (item.Status == 1)
			color = R.colors.successGreen

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{ flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{ flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.WalletType ? item.WalletType : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* Currency and Wallet Id */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.WalletType)}</Text>
									<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.WalletId)}</Text>
								</View>

								{/* Wallet Name */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.WalletName + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.WalletName)}</TextViewHML>
								</View>

								{/* Transaction Type */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.TransactionType + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.TrnTypeName)}</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status and edit/delete icon */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
							<StatusChip
								color={color}
								value={item.StrStatus ? item.StrStatus : '-'} />

							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton icon={R.images.IC_EDIT}
									style={
										{
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth, margin: 0,
											padding: R.dimens.CardViewElivation,
											justifyContent: 'center', alignItems: 'center',
											marginRight: R.dimens.widgetMargin,
										}}
									
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={onEdit} />

								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											borderRadius: R.dimens.titleIconHeightWidth, margin: 0,
											padding: R.dimens.CardViewElivation,
											alignItems: 'center', backgroundColor: R.colors.failRed,
										}}
									icon={R.images.IC_DELETE}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
									onPress={onDelete} />
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
		// get wallet transaction data from reducer
		WalletTrnTypesResult: state.WalletTrnTypesReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// To Perform Wallet Transaction Types Action
	getWalletTrnTypesList: () => dispatch(getWalletTrnTypesList()),
	// To Perform Clear Wallet Transaction Types Action
	clearWalletTrnTypes: () => dispatch(clearWalletTrnTypes()),
	// To Change Wallet Transaction Types Action
	changeWalletTrnTypes: (payload) => dispatch(changeWalletTrnTypes(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletTrnTypesListScreen)