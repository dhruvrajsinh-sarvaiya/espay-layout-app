import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { isInternet, validateValue, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { getRuleToolList } from '../../../actions/account/UserManagementActions';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import { AppConfig } from '../../../controllers/AppConfig';
import ListLoader from '../../../native_theme/components/ListLoader';
import PaginationWidget from '../../widget/PaginationWidget';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import SafeView from '../../../native_theme/components/SafeView';

export class RuleToolListScreen extends Component {
	constructor(props) {
		super(props)

		// Define all initial state
		this.state = {
			RuleToolListResponse: [],
			refreshing: false,
			selectedPage: 1,
			isFirstTime: true,
			row: [],
			search: '',
		}

		// Create request
		this.request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		//stop twice api call
		return isCurrentScreen(nextProps);
	};

	componentDidMount = () => {
		//Add this method to change theme based on stored theme name.
		changeTheme()
		// Call Rule Tool Module List Api
		this.ruleToolModuleListApi()
	};

	// Call rule tool module api
	ruleToolModuleListApi = async () => {
		// check internet connection
		if (await isInternet()) {
			// call api
			this.props.getRuleToolList(this.request)
		}
	}

	//For Swipe to referesh Functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			this.request = {
				...this.request,
				PageNo: this.state.selectedPage - 1,
			}
			// call api
			this.props.getRuleToolList(this.request)
		}
		else {
			this.setState({ refreshing: false });
		}
	}

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {
		if (this.state.selectedPage !== pageNo) {
			this.setState({ selectedPage: pageNo });

			this.request = {
				...this.request,
				PageNo: pageNo - 1,
			}

			// Called Rule Module List Api
			this.props.getRuleToolList(this.request)
		}
	}

	// For editing new item
	onEditPress = (item) => {
		let { navigate } = this.props.navigation
		//redirect screen for edit rule tool
		navigate('AddEditRuleToolModuleScreen', { onRefresh: this.onRefresh, item: item, })
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
		if (RuleToolListScreen.oldProps !== props) {
			RuleToolListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { RuleToolModuleData } = props.RuleModuleListResult;

			//To Check  Data Fetch or Not
			if (RuleToolModuleData) {
				try {
					if (state.RuleToolModuleData == null || (state.RuleToolModuleData != null && RuleToolModuleData !== state.RuleToolModuleData)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: RuleToolModuleData, isList: true })) {

							let res = parseArray(RuleToolModuleData.Result);

							//for add status static
							for (var keyData in res) {
								let item = res[keyData];
								if (item.Status == 1)
									item.statusStatic = R.strings.Active
								else
									item.statusStatic = R.strings.Inactive
							}

							return Object.assign({}, state, {
								RuleToolModuleData,
								RuleToolListResponse: res,
								refreshing: false,
								row: addPages(RuleToolModuleData.TotalCount)
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								RuleToolModuleData: null,
								refreshing: false,
								RuleToolListResponse: [],
								row: []
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						RuleToolModuleData: null,
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

	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { RuleToolModuleLoading } = this.props.RuleModuleListResult;

		let filteredList = [];

		// For searching functionality
		if (this.state.RuleToolListResponse.length) {
			filteredList = this.state.RuleToolListResponse.filter(item => (
				item.ToolName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.ListRuleTool}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(RuleToolModuleLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={filteredList}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) =>
									<RuleToolListItem
										item={item}
										index={index}
										size={filteredList.length}
										onEditPress={() => this.onEditPress(item)}
									/>
								}
								// assign index as key valye to Transfer In History list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Transfer In History FlatList Item
								refreshControl={
									<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={() => this.onRefresh(true, true)}
									/>
								}
								contentContainerStyle={contentContainerStyle(filteredList)}
								ListEmptyComponent={<ListEmptyComponent />}
							/>
					}

					{/*To Set Pagination View  */}
					<View>
						{
							this.state.RuleToolListResponse.length > 0 &&
							<PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
						}
					</View>
				</View>
			</SafeView>
		)
	}
}

// This Class is used for display record in list
export class RuleToolListItem extends Component {
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
		// Get required fields from props
		let { item, index, size, onEditPress } = this.props

		return (
			// Animation applied on flatlist item
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						flex: 1,
						borderRadius: 0, elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
					}}>

						{/* for show ToolName */}
						<View style={{ flex: 1 }}>
							<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{item.ToolName}</TextViewHML>
						</View>

						{/* for show status , edit icon */}
						<View style={{ flex: 1, marginTop: R.dimens.widgetMargin, flexDirection: 'row' }}>
							<View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
								<StatusChip
									color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
									value={validateValue(item.statusStatic)}></StatusChip>
							</View>
							<ImageTextButton
								style={
									{
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: R.colors.accent,
										borderRadius: R.dimens.titleIconHeightWidth,
										margin: 0,
										padding: R.dimens.CardViewElivation,
									}}
								icon={R.images.IC_EDIT}
								iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								onPress={onEditPress}
							/>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get updated data from reducer
		RuleModuleListResult: state.UserManagementReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Rule Tool List Action
	getRuleToolList: (payload) => dispatch(getRuleToolList(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleToolListScreen);