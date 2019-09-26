import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { clearWalletMemberData, getWalletMemberList } from '../../../actions/Wallet/WalletMemberActions';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { validateResponseNew, isInternet, validateValue } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget';
import { Fonts } from '../../../controllers/Constants';
import ListLoader from '../../../native_theme/components/ListLoader';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';

export class WalletMemberListScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			row: [],
			WalletMemberResponse: [],
			WalletMemberListState: null,

			searchInput: '',
			selectedPage: 1,

			refreshing: false,
			isFirstTime: true,
		}

		this.request = {
			PageNo: 1,
			PageSize: AppConfig.pageSize
		}
	}

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()

		// check internet connection
		if (await isInternet()) {
			// Wallet Member Api Call
			this.props.getWalletMemberList(this.request)
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		// stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		// clear reducer data when user press on back button from their device
		this.props.clearWalletMemberData()
	}


	// Pagination Method Called When User Change Page  
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {
			//if user selecte other page number then and only then API Call elase no need to call API
			this.setState({ selectedPage: pageNo });

			// Check NetWork is Available or not
			if (await isInternet()) {

				// Bind request for Wallet Member
				this.request = {
					...this.request,
					PageNo: pageNo,
				}
				//Call Get Wallet Member API
				this.props.getWalletMemberList(this.request);

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

			// Bind request for Wallet Member
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage,
			}
			// Call Get Wallet Member API
			this.props.getWalletMemberList(this.request);

		} else {
			this.setState({ refreshing: false });
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (WalletMemberListScreen.oldProps !== props) {
			WalletMemberListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { WalletMemberList } = props.WalletMemberResult

			// WalletMemberList is not null
			if (WalletMemberList) {
				try {
					if (state.WalletMemberListState == null || (state.WalletMemberListState !== null && WalletMemberList !== state.WalletMemberListState)) {
						//succcess response fill the list 
						if (validateResponseNew({ response: WalletMemberList, isList: true, })) {

							return Object.assign({}, state, {
								WalletMemberListState: WalletMemberList,
								WalletMemberResponse: parseArray(WalletMemberList.Details),
								refreshing: false,
								row: addPages(WalletMemberList.TotalPages)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								WalletMemberListState: null,
								WalletMemberResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						WalletMemberListState: null,
						WalletMemberResponse: [],
						refreshing: false,
						row: []
					})
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}
		return null
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { WalletMemberLoading, } = this.props.WalletMemberResult

		// For searching
		let finalItems = this.state.WalletMemberResponse.filter(item => (
			item.FirstName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.LastName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.Email.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.TotalBalance.toString().includes(this.state.searchInput)
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.WalletMembers}
					onBackPress={this.onBackPress}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(WalletMemberLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <WalletMemberListItem
									index={index}
									item={item}
									size={finalItems.length} />
								}
								// assign index as key value to Wallet Member list item
								
								keyExtractor={(_item, index) => index.toString()}

								// For Refresh Functionality In Wallet Member FlatList Item
								refreshControl={
									<RefreshControl
									onRefresh={this.onRefresh}
									progressBackgroundColor={R.colors.background}
									refreshing={this.state.refreshing}
									colors={[R.colors.accent]}
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
				</View>
			</SafeView>
		)
	}
}

// This Class is used for display record in list
class WalletMemberListItem extends Component {

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

		return (
			// flatlist item animation
			<AnimatableItem>
				<View 
				style={{ flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{ flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderTopRightRadius: R.dimens.margin,
						borderBottomLeftRadius: R.dimens.margin,
					}}>

						<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

							{/* Username and Total Balance */}
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.FirstName + ' ' + item.LastName)}</Text>
								<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
									{(parseFloatVal(item.TotalBalance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.TotalBalance).toFixed(8)) : '-')}
								</Text>
							</View>

							{/* Email */}
							<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Email)}</TextViewHML>

							{/* User Type */}
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
								<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Type + ': '}</TextViewHML>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserType)}</TextViewHML>
							</View>

							{/* Organization Name */}
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
								<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Organization + ': '}</TextViewHML>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.OrganizationName)}</TextViewHML>
							</View>

							{/* Date */}
							<View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
								<ImageTextButton
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
									icon={R.images.IC_TIMER}
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
								/>
								<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, marginRight: R.dimens.widgetMargin }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
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
		// get Wallet Member data from reducer
		WalletMemberResult: state.WalletMemberReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// To Perform Wallet Member Action
	getWalletMemberList: (payload) => dispatch(getWalletMemberList(payload)),
	// Clear Wallet Member Data
	clearWalletMemberData: () => dispatch(clearWalletMemberData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletMemberListScreen)