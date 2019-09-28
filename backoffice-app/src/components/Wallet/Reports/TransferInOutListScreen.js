import React, { Component } from 'react'
import { Text, View, RefreshControl, Easing, FlatList, TouchableOpacity, Linking } from 'react-native'
import { changeTheme, parseArray, addPages, parseFloatVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getTransferInList, getTransferOutList, clearTransferInOutData } from '../../../actions/Wallet/TransferInOutActions';
import { connect } from 'react-redux';
import { getWalletType, getUserDataList, getOrgList } from '../../../actions/PairListAction';
import { validateResponseNew, isInternet, validateValue } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import ListLoader from '../../../native_theme/components/ListLoader';
import StatusChip from '../../widget/StatusChip';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import Separator from '../../../native_theme/components/Separator';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import PaginationWidget from '../../widget/PaginationWidget';

export class TransferInOutListScreen extends Component {
	constructor(props) {
		super(props);

		let { transferIn } = props.navigation.state.params
		//Define all initial state
		this.state = {
			row: [],
			Currency: [],
			UserNames: [],
			Organization: [],
			TransferInOutResponse: [],

			selectedPage: 1,
			selectedCurrency: '',
			selectedUser: R.strings.Please_Select,
			selectedOrganization: R.strings.SelectOrg,

			isTransferIn: transferIn,
			walletFlag: false,
			isFirstTime: true,
			refreshing: false,
			isDrawerOpen: false,
			searchInput: '',
			Address: '',
			TrnId: '',
			OrgId: 0,
			UserId: 0,
		}

		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize
		}

		// Create Reference
		this.drawer = React.createRef()

		//Bind all methods
		this.onBackPress = this.onBackPress.bind(this);

		//add current route for backpress handle
		addRouteToBackPress(props, this.onBackPress);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });
	}

	// If drawer is open then first, it will close the drawer and after it will return to previous screen
	onBackPress() {
		if (this.state.isDrawerOpen) {
			this.drawer.closeDrawer();
			this.setState({ isDrawerOpen: false })
		}
		else {
			this.props.clearTransferInOutData()
			//goging back screen
			this.props.navigation.goBack();
		}
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Wallet Data Api
			this.props.getWalletType()
			// Call Get User List Api
			this.props.getUserDataList()
			// Call Get Organization List Api
			this.props.getOrgList()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearTransferInOutData()
	}

	//This Method Is used to open Address in Browser With Specific Link
	onTrnLinkPress = (item) => {
		try {
			let res = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
			Linking.openURL((res.length) ? res[0].Data + '/' + item.TrnID : item.TrnID);
		} catch (error) {
			//handle catch block here
		}
	}

	// Reset Filter
	onResetPress = async () => {
		// Close drawer
		this.drawer.closeDrawer();

		// set Initial State
		this.setState({
			searchInput: '',
			selectedPage: 1,

			TrnId: '',
			Address: '',
			OrgId: 0,
			UserId: 0,
			selectedCurrency: this.state.Currency[0].value,
			selectedUser: R.strings.Please_Select,
			selectedOrganization: R.strings.SelectOrg,
		})

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Transfer In
			this.request = {
				...this.request,
				PageNo: 0,
				Coin: this.state.Currency[0].value,
				UserId: '',
				Address: '',
				TrnId: '',
				OrgId: ''
			}

			if (this.state.isTransferIn) {
				//Call Get Transfer In API
				this.props.getTransferInList(this.request);
			} else {
				// Call Get Transfer Out API
				this.props.getTransferOutList(this.request);
			}

		} else {
			this.setState({ refreshing: false });
		}
	}

	// Call api when user pressed on complete button
	onCompletePress = async () => {

		this.setState({
			PageSize: AppConfig.pageSize,
			selectedPage: 1,
		})

		// Close Drawer user press on Complete button bcoz display flatlist item on Screen
		this.drawer.closeDrawer();

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Transfer In
			this.request = {
				...this.request,
				PageNo: 0,
				Coin: this.state.selectedCurrency,
				TrnId: this.state.TrnId,
				UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
				Address: this.state.Address,
				OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
			}

			if (this.state.isTransferIn) 
			{
				//Call Get Transfer In API
				this.props.getTransferInList(this.request);
			} 
			else 
			{
				// Call Get Transfer Out API
				this.props.getTransferOutList(this.request);
			}
		}
		 else
		  {
			this.setState({ refreshing: false });
		}

		//If Filter from Complete Button Click then empty searchInput
		this.setState({ searchInput: '' })
	}

	// Pagination Method Called When User Change Page  
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {
			//if user selecte other page number then and only then API Call elase no need to call API
			this.setState({ selectedPage: pageNo });

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Transfer In
				this.request = {
					...this.request,
					PageNo: pageNo - 1,
					TrnId: this.state.TrnId,
					Address: this.state.Address,
					CoinName: this.state.selectedCurrency,
					UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
					OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
				}

				if (this.state.isTransferIn) {
					//Call Get Transfer In API
					this.props.getTransferInList(this.request);
				} else {
					// Call Get Transfer Out API
					this.props.getTransferOutList(this.request);
				}

			} else {
				this.setState({ refreshing: false });
			}
		}
	}

	// for swipe to refresh functionality
	onRefresh = async () => {
		this.setState({ refreshing: true });

		// Check NetWork is Available or not
		if (await isInternet()) {

			// Bind request for Transfer In
			this.request = {
				...this.request,
				Coin: this.state.selectedCurrency,
				Address: this.state.Address,
				PageNo: this.state.selectedPage - 1,
				UserId: this.state.selectedUser !== R.strings.Please_Select ? this.state.UserId : '',
				TrnId: this.state.TrnId,
				OrgId: this.state.selectedOrganization !== R.strings.SelectOrg ? this.state.OrgId : ''
			}

			if (this.state.isTransferIn) 
			{ //Call Get Transfer In API
				this.props.getTransferInList(this.request);
			} 
			else 
			{
				// Call Get Transfer Out API
				this.props.getTransferOutList(this.request);
			}

		} else { this.setState({ refreshing: false }); }
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (TransferInOutListScreen.oldProps !== props) {
			TransferInOutListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { UserDataList, WalletDataList, OrganizationList, TransferInList, TransferOutList } = props.TransferInResult

			// UserDataList is not null
			if (UserDataList) {
				try {
					//if local UserDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.UserDataList == null || 
						(UserDataList !== state.UserDataList)) 
							{

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: UserDataList, isList: true })) 
						{
							let res = parseArray(UserDataList.GetUserData);

							for (var dataItem in res) 
							{ let item = res[dataItem]
								item.value = item.UserName }

							let userNames = 
							[
								{ value: R.strings.Please_Select },
								...res
							];

							return { ...state, 
								UserDataList, 
								UserNames: userNames };
						} 
						else {
							return { ...state, UserDataList, 
								UserNames: [{ value: R.strings.Please_Select }] };
						}
					}
				} catch (e) 
				{
					return { ...state, 
						UserNames: [{ value: R.strings.Please_Select }] };
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							let res = parseArray(WalletDataList.Types);

							for (var walletDataKey in res) {
								let item = res[walletDataKey]
								item.value = item.TypeName
							}

							let walletNames = [
								...res
							];

							return { ...state, WalletDataList, Currency: walletNames, walletFlag: true, selectedCurrency: walletNames[0].value };
						} else {
							return { ...state, WalletDataList, Currency: [{ value: R.strings.selectCurrency }], walletFlag: false, };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }], walletFlag: false };
				}
			}

			// OrganizationList is not null
			if (OrganizationList) {
				try {
					//if local OrganizationList state is null or its not null and also different then new response then and only then validate response.
					if (state.OrganizationList == null || (state.OrganizationList != null && OrganizationList !== state.OrganizationList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: OrganizationList, isList: true })) {
							let res = parseArray(OrganizationList.Organizations);

							for (var orgListKey in res) {
								let item = res[orgListKey]
								item.value = item.OrgName
							}

							let orgList = [
								{ value: R.strings.SelectOrg },
								...res
							];

							return { ...state, OrganizationList, Organization: orgList };
						} else {
							return { ...state, OrganizationList, Organization: [{ value: R.strings.SelectOrg }] };
						}
					}
				} catch (e) {
					return { ...state, Organization: [{ value: R.strings.SelectOrg }] };
				}
			}

			// TransferInList is not null
			if (TransferInList) {
				try {
					if (state.TransferInList == null || (TransferInList !== state.TransferInList)) {
						//succcess response fill the list 
						if (validateResponseNew({
							response: TransferInList, isList: true,
							returnCode: TransferInList.BizResponseObj.ReturnCode,
							returnMessage: TransferInList.BizResponseObj.ReturnMsg,
						})) {

							return Object.assign({}, state, {
								TransferInList,
								TransferInOutResponse: parseArray(TransferInList.Transfers),
								refreshing: false,
								row: addPages(TransferInList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								TransferInList: null,
								TransferInOutResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						TransferInList: null,
						TransferInOutResponse: [],
						refreshing: false,
						row: [],
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// TransferOutList is not null
			if (TransferOutList) {
				try {
					if (state.TransferOutList == null || (TransferOutList !== state.TransferOutList)) {
						//succcess response fill the list 
						if (validateResponseNew({
							response: TransferOutList, isList: true,
							returnCode: TransferOutList.BizResponseObj.ReturnCode,
							returnMessage: TransferOutList.BizResponseObj.ReturnMsg,
						})) {

							return Object.assign({}, state, {
								TransferOutList,
								TransferInOutResponse: parseArray(TransferOutList.Transfers),
								refreshing: false,
								row: addPages(TransferOutList.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								TransferOutList: null,
								TransferInOutResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						TransferOutList: null,
						TransferInOutResponse: [],
						refreshing: false,
						row: [],
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}
		return null
	}

	async componentDidUpdate(prevProps, _prevState) {
		//Get All Updated Feild of Particular actions From Reducers
		const { WalletDataList } = this.props.TransferInResult;

		// compare response with previous response
		if (WalletDataList !== prevProps.TransferInResult.WalletDataList) {
			// WalletDataList is not null
			if (WalletDataList) {

				if (this.state.walletFlag) {
					// check internet connection
					if (await isInternet()) {

						// request for Transfer In Api
						this.request = {
							...this.request,
							Coin: this.state.Currency[0].value
						}

						if (this.state.isTransferIn) {
							//Call Get Transfer In API
							this.props.getTransferInList(this.request);
						} else {
							// Call Get Transfer Out API
							this.props.getTransferOutList(this.request);
						}
					}
				}
			}
		}
	}

	// Drawer Navigation
	navigationDrawer() {

		return (
			// for show filter of fromdate, todate,currency and user data etc
			<FilterWidget
				onResetPress={this.onResetPress}
				onCompletePress={this.onCompletePress}
				comboPickerStyle={{ marginTop: 0 }}
				textInputStyle={{ marginBottom: 0 }}
				pickers={[
					{
						title: R.strings.Currency,
						array: this.state.Currency,
						selectedValue: this.state.Currency.length > 0 ? this.state.selectedCurrency : '',
						onPickerSelect: (index) => this.setState({ selectedCurrency: index })
					},
					{
						title: R.strings.User,
						array: this.state.UserNames,
						selectedValue: this.state.selectedUser,
						onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
					},
					{
						title: R.strings.Organization,
						array: this.state.Organization,
						selectedValue: this.state.selectedOrganization,
						onPickerSelect: (index, object) => this.setState({ selectedOrganization: index, OrgId: object.OrgID })
					},
				]}
				textInputs={[
					{
						multiline: false, keyboardType: 'default',
						blurOnSubmit: false,
						returnKeyType: "next",
						maxLength: 100,
						header: R.strings.Address, placeholder: R.strings.Address,
						onChangeText: (text) => { this.setState({ Address: text }) },
						value: this.state.Address,
					},
					{
						maxLength: 100,
						placeholder: R.strings.transactionId,
						multiline: false,
						keyboardType: 'default',
						returnKeyType: "done",
						header: R.strings.transactionId,
						onChangeText: (text) => { this.setState({ TrnId: text }) },
						value: this.state.TrnId,
					}
				]}
			/>
		)
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { CommonLoading } = this.props.TransferInResult

		// for searching
		let finalItems = this.state.TransferInOutResponse.filter(item => (
			item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Amount.toString().includes(this.state.searchInput) ||
			item.Confirmations.toString().includes(this.state.searchInput) ||
			item.ConfirmationCount.toString().includes(this.state.searchInput)
		))

		return (
			//DrawerLayout for Transfer In Filteration
			<Drawer drawerContent={this.navigationDrawer()} drawerWidth={R.dimens.FilterDrawarWidth}
				onDrawerClose={() => this.setState({ isDrawerOpen: false })}
				ref={cmpDrawer => this.drawer = cmpDrawer}
				onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
				type={Drawer.types.Overlay}
				drawerPosition={Drawer.positions.Right}
				easingFunc={Easing.ease}>
				<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						isBack={true}
						title={this.state.isTransferIn ? R.strings.transfer_in : R.strings.transfer_out}
						onBackPress={this.onBackPress}
						nav={this.props.navigation}
						rightIcon={R.images.FILTER}
						onRightMenuPress={() => this.drawer.openDrawer()}
						searchable={true}
						onSearchText={(text) => this.setState({ searchInput: text })} />
					{
						(CommonLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <TransferInOutListItem
									index={index}
									item={item}
									size={finalItems.length}
									onTrnIdPress={() => this.onTrnLinkPress(item)}
								/>
								}
								// assign index as key value to Deposit Route list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Deposit Route FlatList Item
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
								ListEmptyComponent={<ListEmptyComponent />}
							/>
					}

					{/*To Set Pagination View  */}
					<View>
						{
							finalItems.length > 0 &&
							<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
						}
					</View>
				</SafeView>
			</Drawer>
		)
	}
}

// This Class is used for display record in list
class TransferInOutListItem extends Component {

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
		let { size, index, item, onTrnIdPress } = this.props

		return (
			// flatlist item animation
			<AnimatableItem>
				<View 
				style={{ flex: 1, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin, marginLeft: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						borderRadius: 0, elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
						flex: 1,
						borderTopRightRadius: R.dimens.margin,
					}}>
						<View style={{ flex: 1, flexDirection: 'row' }}>

							{/* Currency Image */}
							<ImageViewWidget url={item.WalletType ? item.WalletType : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

								{/* Amount , Currecncy Name and Transaction No */}
								<View style={{ flexDirection: 'row', }}>
									<Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{(parseFloatVal(item.Amount).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(item.Amount).toFixed(8).toString() : '-'} {validateValue(item.WalletType.toUpperCase())}</Text>
									{item.TrnNo ?
										<View style={{ flexDirection: 'row', }}>
											<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Trn_No + ': '}</TextViewHML>
											<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.TrnNo)}</TextViewHML>
										</View>
										: null
									}
								</View>

								{/* User name */}
								<View style={{ flexDirection: 'row', }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Username + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* To Address */}
								<View style={{ flexDirection: 'row', }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.to + ': '}</TextViewHML>
									<TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.Address)}</TextViewHML>
								</View>
							</View>
						</View >

						{/* Transaction Id */}
						<View style={{ flex: 1, }}>
							<View style={{ flexDirection: 'row', }}>
								<Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.txnid.toUpperCase()}</Text>
								<Separator style={{ flex: 1, justifyContent: 'center', }} />
							</View>
							{
								(item.TrnID && item.ExplorerLink) ?
									<TouchableOpacity onPress={onTrnIdPress}>
										<TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.accent, }}>{item.TrnID ? item.TrnID : '-'}</TextViewHML>
									</TouchableOpacity> :
									<TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.TrnID ? item.TrnID : '-'}</TextViewHML>
							}
						</View>

						{/* Confiramtion , Confiramation Count */}
						<View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								style={{ justifyContent: 'flex-start', alignSelf: 'flex-start' }}
								color={R.colors.yellow}
								value={(item.ConfirmationCount ? item.ConfirmationCount : '-') + '/' + (item.Confirmations ? item.Confirmations : '-') + ' ' + R.strings.Conf}></StatusChip>
						</View>

					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get Transfer In data from reducer
		TransferInResult: state.TransferInOutReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Transfer In List Action
	getTransferInList: (payload) => dispatch(getTransferInList(payload)),
	// To Perform Transfer Out List Action
	getTransferOutList: (payload) => dispatch(getTransferOutList(payload)),
	// To Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// To Perform User Data Action
	getUserDataList: () => dispatch(getUserDataList()),
	// To Perform Organization List
	getOrgList: () => dispatch(getOrgList()),
	// To Clear Transfer In/Out
	clearTransferInOutData: () => dispatch(clearTransferInOutData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferInOutListScreen);