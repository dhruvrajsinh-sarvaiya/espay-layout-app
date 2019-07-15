import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, showAlert, getDeviceID, addPages, parseArray, createOptions, createActions } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, isEmpty } from '../../validations/CommonValidation';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CommonToast from '../../native_theme/components/CommonToast';
import { getLeaderList as getLeaderListApi, unFollowLeader, clearLeader, getGroupList, addNewWatchList, addToWatchList as addToWatchListApi, removeFromWatchList as removeFromWatchListApi } from '../../actions/SocialProfile/SocialProfileActions';
import PaginationWidget from '../Widget/PaginationWidget';
import { AppConfig } from '../../controllers/AppConfig';
import R from '../../native_theme/R';
import EditText from '../../native_theme/components/EditText';
import AlertDialog from '../../native_theme/components/AlertDialog';
import OptionsMenu from "react-native-options-menu";
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import CardView from '../../native_theme/components/CardView';
import Button from '../../native_theme/components/Button';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class LeaderList extends Component {

	constructor(props) {
		super(props);

		//Add Current Screen to Manual Handling BackPress Events
		addRouteToBackPress(props);

		//To Bind All Method
		this.onBackPress = this.onBackPress.bind(this);
		this.props.navigation.setParams({ onBackPress: this.onBackPress });

		//Define All initial State
		this.state = {
			row: [],
			response: [],
			searchInput: '',
			SelectedItemCount: 0,
			SelectedUnfollowItemCount: 0,
			isSelectAll: false,
			isSelectUnfollowAll: false,
			refreshing: false,
			selectedPage: 1,
			getLeaderList: null,
			isCreateGroup: false,
			NewWatchList: '',
			GroupName: [],
			GroupIndex: [],
			GroupList: [],
			isFirstTime: true,
		};

		//create Reference
		this.toastDialog = React.createRef();

		//initial Request For Leader List Api
		this.Request = {
			PageIndex: 1,
			Page_Size: AppConfig.pageSize,
		}
	}

	onBackPress() {
		//call previuos screen method
		this.props.navigation.state.params.onProgress()

		//go to previous screen
		this.props.navigation.goBack();
	}

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {

			//Call Get leader list from API
			this.props.getLeaderList(this.Request);

			// Called Group List from Api
			this.props.getGroupList();
			//----------
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true, SelectedItemCount: 0, SelectedUnfollowItemCount: 0, isSelectAll: false, isSelectUnfollowAll: false, selectedPage: 1 });

		//To set Selected Pagination 1
		if (needUpdate && !fromRefreshControl)
			this.setState({ selectedPage: 1 });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {

			//To Bind Request 
			this.Request = {
				...this.Request,
				PageIndex: !fromRefreshControl ? 1 : this.state.selectedPage,
			}

			//Call Get leader list from API
			this.props.getLeaderList(this.Request);
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	onGroupRefresh = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To Bind Request
			this.Request = {
				...this.Request,
				PageIndex: this.state.selectedPage,
			}

			//Call Get leader list from API
			this.props.getLeaderList(this.Request);

			// Called Group List from Api
			this.props.getGroupList();
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		/* stop twice api call  */
		return isCurrentScreen(nextProps);
	}

	// Get Selected Item From List Of Records
	GetSelectedItems = () => {
		let selectItemList = [];
		this.state.rescheckArr.map((item, index) => {
			if (item.isSelected) {
				selectItemList.push(this.state.response[index].LeaderId);
			}
		})
		this.setState({ SelectedItemCount: selectItemList.length })
		return selectItemList;
	}

	// Get Selected Item From List Of Records
	GetSelectedUnfollowItems = () => {
		let selectItemList = [];
		this.state.resCheckUnFollowArr.map((item, index) => {
			if (item.isSelected) {
				selectItemList.push(this.state.response[index].LeaderId);
			}
		})
		this.setState({ SelectedUnfollowItemCount: selectItemList.length })
		return selectItemList;
	}

	//For Select All Items From List 
	SelecetAllItems = () => {

		//reverse curent all select value
		let isSelectAll = !this.state.isSelectAll;
		let checkArr = [];

		//loop through all records and set isSelected = isSelectAll
		this.state.rescheckArr.map((item) => {
			item.isSelected = isSelectAll;
			checkArr.push(item)
		})
		this.setState({ rescheckArr: checkArr, isSelectAll, SelectedItemCount: checkArr.length, isSelectUnfollowAll: false })

		if (!isSelectAll) {
			this.setState({ SelectedItemCount: 0 })
		}
	}

	// For Select All UnFollow Items for UnFollow
	SelectAllUnFollowItems = () => {
		//reverse curent all select value
		let isSelectUnfollowAll = !this.state.isSelectUnfollowAll;
		let checkArr = [];

		//loop through all records and set isSelected = isSelectUnfollowAll
		this.state.resCheckUnFollowArr.map((item) => {
			item.isSelected = isSelectUnfollowAll;
			checkArr.push(item)
		})

		this.setState({ resCheckUnFollowArr: checkArr, isSelectUnfollowAll, SelectedUnfollowItemCount: checkArr.length, isSelectAll: false })

		if (!isSelectUnfollowAll) {
			this.setState({ SelectedUnfollowItemCount: 0 })
		}
	}

	// follow leader
	Follow = async () => {
		if (this.state.isSelectAll) {

			//Check NetWork is Available or not
			if (await isInternet()) {

				//redirect to FollowerProfileConfiguration screen
				if (this.GetSelectedItems().length > 0) {
					this.props.navigation.navigate('FollowerProfileConfiguration', { leaderIds: this.GetSelectedItems().toString(), LeaderId: this.state.response[0].LeaderId, onRefresh: this.onRefresh })
				}
				else {
					this.refs.Toast.Show(R.strings.Please_Select);
				}
				//----------
			}
		}
	}

	//unfollow leader 
	UnFollow = async () => {
		if (this.state.isSelectUnfollowAll) {

			//Check NetWork is Available or not
			if (await isInternet()) {
				if (this.GetSelectedUnfollowItems().length > 0) {

					// Request For unfollow leader 
					let followUnfollowRequest = {
						LeaderId: this.GetSelectedUnfollowItems().toString(),
					}
					this.props.unFollowLeader(followUnfollowRequest);
				}
				else {
					this.refs.Toast.Show(R.strings.Please_Select);
				}
			}
			//----------
		}
	}

	// Pagination Method Called When User Change Page  
	onPageChange = async (pageNo) => {
		this.setState({ isSelectAll: false, isSelectUnfollowAll: false })

		//if user select other page number then and only then API Call else no need to call API
		if ((pageNo) !== (this.state.selectedPage)) {
			this.setState({ selectedPage: pageNo });
			if (await isInternet()) {

				//Bind request 
				this.Request = {
					...this.Request,
					PageIndex: pageNo,
				}

				//call leader list api
				this.props.getLeaderList(this.Request)
			} else {
				this.setState({ refreshing: false });
			}
		}
	}

	//for singal unfollow 
	unFollowSingle = async (leaderId) => {
		if (await isInternet()) {

			let followUnfollowRequest = {
				LeaderId: leaderId.toString(),
			}

			//call unfollowleader api
			this.props.unFollowLeader(followUnfollowRequest);
		}
	}

	addToWatchList = async (groupId, leaderId) => {
		let req = {
			GroupId: groupId,
			LeaderId: leaderId,
			DeviceId: await getDeviceID(),
			Mode: ServiceUtilConstant.Mode,
			HostName: ServiceUtilConstant.hostName,
			//Note : ipAddress parameter is passed in its saga.
		}

		// Check internet connection
		if (await isInternet()) {

			// Call Add to Watchlist Api
			this.props.addToWatchList(req)
		}
	}

	removeFromWatchList = async (groupId, leaderId) => {
		let req = {
			GroupId: groupId,
			LeaderId: leaderId,
			DeviceId: await getDeviceID(),
			Mode: ServiceUtilConstant.Mode,
			HostName: ServiceUtilConstant.hostName,
			//Note : ipAddress parameter is passed in its saga.
		}

		// Check internet connection
		if (await isInternet()) {

			// Call Add to Watchlist Api
			this.props.removeFromWatchList(req)
		}
	}

	// Create New Watch List Group
	createWatchlist = async () => {
		if (isEmpty(this.state.NewWatchList))
			this.toastDialog.Show(R.strings.EnterNewWatchList)
		else {

			// check internet connection
			if (await isInternet()) {
				let req = {
					GroupName: this.state.NewWatchList,
					DeviceId: await getDeviceID(),
					Mode: ServiceUtilConstant.Mode,
					HostName: ServiceUtilConstant.hostName,
					//Note : ipAddress parameter is passed in its saga.
				}

				// Called New Watch List Item Api
				this.props.addNewWatchList(req)

				// Close Alert Dialog
				this.setState({ isCreateGroup: !this.state.isCreateGroup })
			}
		}
	}

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
		if (LeaderList.oldProps !== props) {
			LeaderList.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { getLeaderList, groupListData } = props.Listdata;

			//To Check  Data Fetch or Not
			if (getLeaderList) {

				try {
					if (state.getLeaderList == null || (state.getLeaderList != null && getLeaderList !== state.getLeaderList)) {
						if (validateResponseNew({ response: getLeaderList, isList: true })) {

							//check  Response is an Array Or not
							//If Response is Array then Direct set in state otherwise conver response to Array form then set state.
							var res = parseArray(getLeaderList.LeaderList);
							var resCheckUnFollowArr = [];
							var rescheckArr = [];
							res.map((item, index) => rescheckArr.push({ index: index, isSelected: false }))
							res.map((item, index) => resCheckUnFollowArr.push({ index: index, isSelectUnfollowAll: false }))

							//Set State For Api response , Selected Item and Refershing Bit
							return {
								...state,
								getLeaderList,
								response: res,
								rescheckArr,
								resCheckUnFollowArr,
								refreshing: false,
								row: addPages(getLeaderList.TotalCount)
							}

						} else {
							return {
								...state,
								getLeaderList: null,
								refreshing: false,
								rescheckArr: [],
								resCheckUnFollowArr: [],
								response: [],
								row: []
							}
						}
					}
				} catch (e) {
					return {
						...state,
						getLeaderList: null,
						refreshing: false,
						rescheckArr: [],
						resCheckUnFollowArr: [],
						response: [],
						row: []
					}
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}

			// groupListData is not null
			if (groupListData) {
				let GroupName = []
				try {
					if (state.groupListData == null || (state.groupListData != null && groupListData !== state.groupListData)) {
						if (validateResponseNew({ response: groupListData, isList: true })) {
							let GroupIndex = []
							if (groupListData.GroupList.length > 0) {
								for (var i = 0; i < groupListData.GroupList.length; i++) {
									GroupName[i] = groupListData.GroupList[i].GroupName
									GroupIndex[i] = groupListData.GroupList[i].Id
								}
								GroupName.push(R.strings.AddToNewList)
							}
							return {
								...state,
								GroupList: groupListData.GroupList,
								groupListData,
								GroupName: GroupName,
								GroupIndex: GroupIndex
							}
						} else {
							GroupName = []
							return {
								...state,
								groupListData
							}
						}
					}
				} catch (error) {
					GroupName = []
					return {
						...state,
						groupListData
					}
				}
			}
		}
		return null
	}

	componentDidUpdate = (prevProps, prevState) => {

		//Get All Updated Feild of Particular actions
		const { unfollowData, addWatchListItemData, addToWatchList, removeFromWatchList } = this.props.Listdata;

		if (addWatchListItemData !== prevProps.Listdata.addWatchListItemData) {

			// addWatchListItemData is not null
			if (addWatchListItemData) {
				try {
					if (validateResponseNew({ response: addWatchListItemData })) {
						this.props.clearLeader();
						showAlert(R.strings.Success + '!', addWatchListItemData.ReturnMsg, 0, this.onGroupRefresh)
					}
					else {
						this.props.clearLeader();
					}
				} catch (error) {
					this.props.clearLeader();
				}
			}
		}

		if (addToWatchList !== prevProps.Listdata.addToWatchList) {
			// addToWatchList is not null
			if (addToWatchList) {
				try {
					if (validateResponseNew({ response: addToWatchList })) {
						this.props.clearLeader();
						showAlert(R.strings.Success + '!', addToWatchList.ReturnMsg, 0, this.onGroupRefresh)
					}
					else {
						this.props.clearLeader();
					}
				} catch (error) {
					this.props.clearLeader();
				}
			}
		}

		if (removeFromWatchList !== prevProps.Listdata.removeFromWatchList) {

			// addToWatchList is not null
			if (removeFromWatchList) {
				try {
					if (validateResponseNew({ response: removeFromWatchList })) {
						this.props.clearLeader();
						showAlert(R.strings.Success + '!', removeFromWatchList.ReturnMsg, 0, this.onGroupRefresh)
					}
					else {
						this.props.clearLeader();
					}
				} catch (error) {
					this.props.clearLeader();
				}
			}
		}

		if (unfollowData !== prevProps.Listdata.unfollowData) {

			//Check unfollow Response 
			if (unfollowData) {
				try {
					//Get Api response
					if (validateResponseNew({
						response: unfollowData,
					})) {
						showAlert(R.strings.Success + '!', unfollowData.ReturnMsg + '\n' + ' ', 0, () => {
							this.props.clearLeader();
							let req = {
								...this.Request,
								PageIndex: 1,
							}
							this.props.getLeaderList(req)
						});
					}
					else {
						this.props.clearLeader();
					}
				} catch (e) {
					this.props.clearLeader();
					//Handle Catch and Notify User to Exception.
					//Alert.alert('Status', e);
				}
			}
		}

	}

	onGroupItemClick = (item, subItem, index) => {
		if (this.state.GroupName.length - 1 == index) {
			this.setState({ isCreateGroup: true })
		} else {
			let indexOfGroupItem = this.state.GroupList.findIndex(el => el.GroupName === subItem);
			if (indexOfGroupItem > -1) {
				let groupID = this.state.GroupList[indexOfGroupItem].Id;

				if (item.GroupId.indexOf(groupID) !== -1) {

					// item remove from watch list
					this.removeFromWatchList(groupID, item.LeaderId)
				} else {

					// item add to watch list
					this.addToWatchList(groupID, item.LeaderId)
				}
			}
		}
	}

	render() {

		//Get is Fetching value For All APIs to handle Progress bar in All Activity
		const { Loading, isUnFollow, addWatchListItemLoading, removeFromWatchLoading, addToWatchLoading } = this.props.Listdata;

		//for final items from search input 
		//default searchInput is empty so it will display all records.
		let finalItems = this.state.response.filter(item => item.LeaderName.toLowerCase().includes(this.state.searchInput.toLowerCase()));

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.leaders}
					titleClickable={false}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })}
					onBackPress={this.onBackPress}
				/>

				{/* Progress Dialog */}
				<ProgressDialog isShow={isUnFollow || addWatchListItemLoading || addToWatchLoading || removeFromWatchLoading} />

				{/* For Toast */}
				<CommonToast ref="Toast" />

				<AlertDialog
					visible={this.state.isCreateGroup}
					title={R.strings.CreateNewWatchList}
					negativeButton={{
						title: R.strings.cancel,
						onPress: () => this.setState({ isCreateGroup: !this.state.isCreateGroup, NewWatchList: '' })
					}}
					positiveButton={{
						title: R.strings.add,
						onPress: () => this.createWatchlist(),
						//disabled: AddIpToWhitelistisFetching,
						progressive: false
					}}
					requestClose={() => null}
					toastRef={component => this.toastDialog = component}>

					{/* Input of Alias Name */}
					<EditText
						/* header={R.strings.NewWatchListTitle} */
						placeholder={R.strings.EnterNewWatchList}
						multiline={false}
						keyboardType='default'
						returnKeyType={"done"}
						onChangeText={(item) => this.setState({ NewWatchList: item })}
						value={this.state.aliasName}
						style={{ marginTop: 0, width: '100%' }} />
				</AlertDialog>

				{/* Display Data in CardView */}
				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(finalItems.length > 0 && this.state.searchInput.length <= 0) &&

						<View style={{ flexDirection: 'row', marginLeft: R.dimens.margin, marginRight: R.dimens.margin }}>
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
								<ImageTextButton
									icon={this.state.isSelectAll ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
									onPress={this.SelecetAllItems}
									style={{ margin: 0, flexDirection: 'row-reverse', }}
									iconStyle={this.styles().checkboxIconStyle}
								/>
								<ImageTextButton
									name={R.strings.follow}
									style={{ margin: 0 }}
									textStyle={this.styles().checkboxTextStyle}
									onPress={() => this.Follow()}
								/>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
								<ImageTextButton
									icon={this.state.isSelectUnfollowAll ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
									onPress={this.SelectAllUnFollowItems}
									style={{ margin: 0, flexDirection: 'row-reverse', }}
									iconStyle={this.styles().checkboxIconStyle}
								/>
								<ImageTextButton
									name={R.strings.unFollow}
									style={{ margin: 0 }}
									textStyle={this.styles().checkboxTextStyle}
									onPress={() => this.UnFollow()}
								/>
							</View>
						</View>
					}

					{/* To Check Response fetch then display progress bar else display List*/}
					{(Loading && !this.state.refreshing) ?
						<ListLoader />
						:
						<FlatList
							data={finalItems}
							showsVerticalScrollIndicator={false}
							/* render all item in list */
							renderItem={({ item, index }) =>
								<FlatListItem
									onGroupItemClick={(subitem, itemIndex) => this.onGroupItemClick(item, subitem, itemIndex)}
									groupName={this.state.GroupName}
									item={item}
									index={index}
									size={finalItems.length}
									isSelected={this.state.rescheckArr[index].isSelected}
									onEdit={() => { this.props.navigation.navigate('FollowerProfileConfiguration', { LeaderId: item.LeaderId, onRefresh: this.onRefresh }) }}
									unFollowSingle={() => this.unFollowSingle(item.LeaderId)}
								></FlatListItem>}

							/* assign index as key value to Address Whitelist item */
							keyExtractor={(item, index) => index.toString()}
							/* For Refresh Functionality In Withdrawal FlatList Item */
							refreshControl={
								<RefreshControl
									colors={[R.colors.accent]}
									progressBackgroundColor={R.colors.background}
									refreshing={this.state.refreshing}
									onRefresh={() => this.onRefresh(true, true)}
								/>
							}
							contentContainerStyle={contentContainerStyle(finalItems)}
							ListEmptyComponent={<ListEmptyComponent />}
						/>
					}

					{finalItems.length > 0 &&
						<View>
							<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
						</View>
					}
				</View>
			</SafeView>
		);
	}

	// styles for this class
	styles = () => {
		return {
			checkboxIconStyle: {
				tintColor: R.colors.accent,
				width: R.dimens.dashboardMenuIcon,
				height: R.dimens.dashboardMenuIcon
			},
			checkboxTextStyle: {
				marginLeft: R.dimens.widgetMargin,
				color: R.colors.textPrimary,
				alignContent: 'flex-start',
			}
		}
	}
}

// This Class is used for display record in list
class FlatListItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { item, onEdit, index, size, unFollowSingle, groupName } = this.props
		let actions = [];
		this.props.groupName.map((groupItem, itemIndex) => {
			actions.push(() => this.props.onGroupItemClick(groupItem, itemIndex))
		})

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
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
							<View style={{ flex: 1 }}>
								{/* Leader name*/}
								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.LeaderName} <Text style={{ color: item.UserDefaultVisible === 'Public' ? R.colors.successGreen : R.colors.failRed, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold }}>- {validateValue(item.UserDefaultVisible)}</Text></Text>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{validateValue(item.NoOfFollowerFollow)} {R.strings.Followers}</TextViewHML>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<ImageTextButton
									icon={R.images.IC_EDIT}
									iconStyle={{ width: R.dimens.etHeaderImageHeightWidth, height: R.dimens.etHeaderImageHeightWidth, tintColor: R.colors.white }}
									style={{ margin: R.dimens.widgetMargin, padding: R.dimens.widgetMargin, borderRadius: R.dimens.paginationButtonRadious, backgroundColor: R.colors.leaderListEdit, }}
									onPress={onEdit} />
								<OptionsMenu
									ref={component => this.optionGroup = component}
									customButton={
										<ImageTextButton
											icon={item.IsWatcher === false ? R.images.IC_PLUS : R.images.IC_CHECKMARK}
											iconStyle={{ width: R.dimens.etHeaderImageHeightWidth, height: R.dimens.etHeaderImageHeightWidth, tintColor: R.colors.white }}
											style={{ margin: R.dimens.widgetMargin, padding: R.dimens.widgetMargin, borderRadius: R.dimens.paginationButtonRadious, backgroundColor: item.IsWatcher === false ? R.colors.accent : R.colors.successGreen, }}
											onPress={() => this.optionGroup.handlePress()} />
									}
									destructiveIndex={1}
									options={createOptions(groupName)}
									actions={createActions(actions)}
								/>
							</View>
						</View>

						{/* if isfollow=true than diplay unfollow button */}
						{
							item.IsFollow ?
								<Button
									textStyle={{ fontSize: R.dimens.smallestText }}
									style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, alignSelf: 'flex-start', height: R.dimens.titleIconHeightWidth, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin, }}
									title={R.strings.Followed}
									isRound={true}
									onPress={unFollowSingle}
								/>
								:
								null
						}
					</CardView>
				</View>
			</AnimatableItem>
		)
	};
}

function mapStateToProps(state) {
	return {
		//Updated Data For Leader List Action
		Listdata: state.SocialProfileReducer
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//get leader list
		getLeaderList: (Request) => dispatch(getLeaderListApi(Request)),
		//unfollow leader
		unFollowLeader: (Request) => dispatch(unFollowLeader(Request)),
		//clear 
		clearLeader: () => dispatch(clearLeader()),
		// Get Group List
		getGroupList: () => dispatch(getGroupList()),
		// Add New Group Item (WatchList Item)
		addNewWatchList: (payload) => dispatch(addNewWatchList(payload)),
		// Item add to Watchlist
		addToWatchList: (payload) => dispatch(addToWatchListApi(payload)),
		// Removing item from watchlist
		removeFromWatchList: (payload) => dispatch(removeFromWatchListApi(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderList)