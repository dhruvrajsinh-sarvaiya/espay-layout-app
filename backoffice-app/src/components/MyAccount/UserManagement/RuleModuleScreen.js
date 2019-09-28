import React, { Component } from 'react';
import { View, RefreshControl, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import PaginationWidget from '../../widget/PaginationWidget';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { getRuleModuleList, updateRuleModuleStatus, clearRuleModuleData } from '../../../actions/account/UserManagementActions';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import ListLoader from '../../../native_theme/components/ListLoader';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class RuleModuleScreen extends Component {
	constructor(props) {
		super(props);

		//define all initial state
		this.state = {
			RuleModuleResponse: [],
			row: [],
			selectedPage: 1,
			refreshing: false,
			searchInput: '',
			ModuleID: 0,
			isFirstTime: true,
		};

		//initial request
		this.Request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize,
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		// Stop twice api calling
		return isCurrentScreen(nextProps)
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme()
		// Call Rule Module List Api
		this.ruleModuleListApi()
	};

	// Called when user press on edit button from list
	onEditPress = (item) => {
		let { navigate } = this.props.navigation
		navigate('AddEditRuleModuleScreen', { item, onRefresh: this.onRefresh })
	}

	// Called when user change switch on/off status
	updateSwitch = async (item) => {
		// Check internet connection
		if (await isInternet()) {

			this.setState({ ModuleID: item.ModuleID })

			let req = {
				id: item.ModuleID,
				Status: item.Status == 1 ? 0 : 1
			}
			// Call rule module status api
			this.props.updateRuleModuleStatus(req)
		}
	}

	ruleModuleListApi = async () => {
		// Check internet connection
		if (await isInternet()) {
			// Call Rule Module List Api
			this.props.getRuleModuleList(this.Request)
		}
	}

	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			// Call Rule Module List
			this.props.getRuleModuleList(this.Request);
		}
		else {
			this.setState({ refreshing: false });
		}
	}

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {
		if (this.state.selectedPage !== pageNo) {
			this.setState({ selectedPage: pageNo });

			this.Request = {
				...this.Request,
				PageNo: pageNo - 1,
			}

			// Called Rule Module List Api
			this.ruleModuleListApi()

		} else {
			this.setState({ refreshing: false })
		}
	}

	componentDidUpdate(prevProps, _prevState) {
		const { UpdatedRuleModuleStatus } = this.props.RuleModuleListResult

		if (UpdatedRuleModuleStatus !== prevProps.RuleModuleListResult.UpdatedRuleModuleStatus) {
			// UpdatedRuleModuleStatus is not null
			if (UpdatedRuleModuleStatus) {
				try {
					if (this.state.UpdatedRuleModuleStatus == null || (this.state.UpdatedRuleModuleStatus != null && UpdatedRuleModuleStatus !== this.state.UpdatedRuleModuleStatus)) {
						// Handle response
						if (validateResponseNew({ response: UpdatedRuleModuleStatus })) {
							let response = this.state.RuleModuleResponse

							/* Find index of particular id and replace data into existing data only */
							let findIndexOfId = this.state.ModuleID == null ? -1 : response.findIndex(el => el.ModuleID == this.state.ModuleID);

							//if index is >-1 then record is found
							if (findIndexOfId > -1) {
								response[findIndexOfId].Status = response[findIndexOfId].Status == 1 ? 0 : 1;
							}

							this.setState({ RuleModuleResponse: response, UpdatedRuleModuleStatus })

							this.props.clearRuleModuleData()
							// Rule Module List Api Call
							this.ruleModuleListApi()
						}
					}
				} catch (error) {
					this.setState({ RuleModuleResponse: [], UpdatedRuleModuleStatus: null })
				}
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
		if (RuleModuleScreen.oldProps !== props) {
			RuleModuleScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated field of Particular actions
			const { RuleModuleListData } = props.RuleModuleListResult

			// RuleModuleListData is not null
			if (RuleModuleListData) {
				try {
					if (state.RuleModuleListData == null || (state.RuleModuleListData != null && RuleModuleListData !== state.RuleModuleListData)) {

						if (validateResponseNew({ response: RuleModuleListData, isList: true })) {
							//check Rule Module List Response is an Array Or not
							//If Response is Array then Direct set in state otherwise conver response to Array form then set state.
							let finalRes = parseArray(RuleModuleListData.Result);

							return Object.assign({}, state, {
								RuleModuleListData,
								RuleModuleResponse: finalRes,
								refreshing: false,
								row: addPages(RuleModuleListData.TotalCount)
							})
						} else {
							return Object.assign({}, state, { RuleModuleListData: null, RuleModuleResponse: [], refreshing: false, row: [] })
						}
					}
				} catch (error) {
					return Object.assign({}, state, { RuleModuleListData: null, RuleModuleResponse: [], refreshing: false, row: [] })
				}
			}
		}
		return null
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { RuleModuleListLoading, UpdatedRuleModuleStatusLoading } = this.props.RuleModuleListResult

		// For searching
		let finalItems = this.state.RuleModuleResponse.filter(item => (
			item.ModuleName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

		return (
			<SafeView style={this.styles().container}>
				{/* Statusbar of Rule Module List */}
				<CommonStatusBar />

				{/* Custom Toolbar of Rule Module List */}
				<CustomToolbar
					title={R.strings.ListRuleModule}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })}
				/>

				{/* Progressbar for Rule Module Status */}
				<ProgressDialog isShow={UpdatedRuleModuleStatusLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(RuleModuleListLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<View style={{ flex: 1, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}>

								<FlatList
									showsVerticalScrollIndicator={false}
									data={finalItems}
									renderItem={({ item, index }) => {
										return <RuleModuleItem
											item={item}
											index={index}
											size={this.state.RuleModuleResponse.length}
											updateSwitch={() => this.updateSwitch(item)}
											onEditPress={() => this.onEditPress(item)}
										/>
									}}
									keyExtractor={(item, index) => index.toString()}
									refreshing={this.state.refreshing}
									refreshControl={
										<RefreshControl
										refreshing={this.state.refreshing}
										progressBackgroundColor={R.colors.background}
										colors={[R.colors.accent]}
											onRefresh={() => this.onRefresh(true, true)}
										/>
									} contentContainerStyle={contentContainerStyle(finalItems)}
									ListEmptyComponent={<ListEmptyComponent />}
								/>
							</View>
					}

					{/*To Set Pagination View  */}
					<View>
						{
							finalItems.length > 0 &&
							<PaginationWidget 
							row={this.state.row} 
							selectedPage={this.state.selectedPage} 
							onPageChange={(item) => { this.onPageChange(item) }} 
							/>
						}
					</View>
				</View>
			</SafeView>
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1, backgroundColor: R.colors.background,
			},
		}
	}
}

export class RuleModuleItem extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//Check If Old Props and New Props are Equal then do not render component
		if (this.props.item !== nextProps.item || this.props.updateSwitch !== nextProps.updateSwitch)
			return true
		return false
	}

	render() {
		let { item, size, index } = this.props

		return (
			// Flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView 
					style={{
						borderBottomLeftRadius: R.dimens.margin, flex: 1,
						borderRadius: 0, borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,
						padding: 0
					}}>
						<View style={{ paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, paddingTop: R.dimens.WidgetPadding, }}>

							<View style={{ flexDirection: 'row' }}>

								{/* icon for list */}
								<View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
									<ImageTextButton
										icon={R.images.ic_list_alt}
										style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
										iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
									/>
								</View>

								{/* for show ModuleName , edit icon */}
								<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
											{R.strings.ModuleName + ': '}</TextViewHML>
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
											onPress={this.props.onEditPress} />
									</View>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.ModuleName ? item.ModuleName : '-'}</TextViewHML>
								</View>
							</View>

							{/* for change status */}
							<FeatureSwitch
								isToggle={item.Status == 1 ? true : false}
								onValueChange={this.props.updateSwitch}
								style={{
									justifyContent: 'flex-start',
									backgroundColor: 'transparent',
									paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding,
									paddingRight: R.dimens.WidgetPadding, paddingLeft: R.dimens.WidgetPadding,
								}}
							/>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

// return state from saga or reducer
const mapStateToProps = (state) => {
	return {
		RuleModuleListResult: state.RuleModuleReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Rule module list
	getRuleModuleList: (payload) => dispatch(getRuleModuleList(payload)),
	// Update Rule Module Status
	updateRuleModuleStatus: (payload) => dispatch(updateRuleModuleStatus(payload)),
	// Clear Rule Module Data
	clearRuleModuleData: () => dispatch(clearRuleModuleData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RuleModuleScreen);
