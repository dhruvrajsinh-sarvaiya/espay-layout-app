import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { AppConfig } from '../../../controllers/AppConfig';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { getRuleSubModuleList, clearRuleSubModuleData } from '../../../actions/account/UserManagementActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import PaginationWidget from '../../widget/PaginationWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';

class RuleSubModuleScreen extends Component {
	constructor(props) {
		super(props);

		//define all initial state
		this.state = {
			RuleSubModuleResponse: [],
			row: [],
			selectedPage: 1,
			refreshing: false,
			searchInput: '',
			SubModuleID: 0,
			isFirstTime: true,
		};

		//initial request
		this.Request = {
			PageNo: 0,
			PageSize: AppConfig.pageSize,
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// Stop twice api calling
		return isCurrentScreen(nextProps)
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme()
		// Call Rule Module List Api
		this.ruleSubModuleListApi()
	};

	ruleSubModuleListApi = async () => {
		// Check internet connection
		if (await isInternet()) {
			// Call Rule Sub Module List Api
			this.props.getRuleSubModuleList(this.Request)
		}
	}

	onRefresh = async (needUpdate, fromRefreshControl = false) => {
		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {
			// Call Rule Module List
			this.props.getRuleSubModuleList(this.Request);
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

			// Called Rule sub Module List Api
			this.ruleSubModuleListApi()
		}
	}

	onEditPress = (item) => {
		let { navigate } = this.props.navigation
		navigate('AddEditRuleSubModuleScreen', { item: item, onRefresh: this.onRefresh })
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
		if (RuleSubModuleScreen.oldProps !== props) {
			RuleSubModuleScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated field of Particular actions
			const { RuleSubModuleListData } = props.RuleSubModuleListResult

			// RuleSubModuleListData is not null
			if (RuleSubModuleListData) {
				try {
					if (state.RuleSubModuleListData == null || (state.RuleSubModuleListData != null && RuleSubModuleListData !== state.RuleSubModuleListData)) {
						if (validateResponseNew({ response: RuleSubModuleListData, isList: true })) {
							//check Rule Sub Module List Response is an Array Or not
							//If Response is Array then Direct set in state otherwise conver response to Array form then set state.
							let finalRes = parseArray(RuleSubModuleListData.Result);


							for (var keyData in finalRes) {
								let item = finalRes[keyData];

								//for add Type static
								if (item.Type == 0)
									item.typeText = R.strings.main
								else if (item.Type == 1)
									item.typeText = R.strings.Card
								else if (item.Type == 2)
									item.typeText = R.strings.list
								else if (item.Type == 3)
									item.typeText = R.strings.form
								else if (item.Type == 4)
									item.typeText = R.strings.chart
								else if (item.Type == 5)
									item.typeText = R.strings.slider
								else
									item.typeText = R.strings.none

								//for add ModuleDomainType static
								if (item.ModuleDomainType == 1)
									item.ModuleDomainTypeText = R.strings.backoffice
								else
									item.ModuleDomainTypeText = ''

								//for add status static
								if (item.Status == 1)
									item.statusText = R.strings.Active
								else
									item.statusText = R.strings.Inactive
							}

							return Object.assign({}, state, {
								RuleSubModuleListData,
								RuleSubModuleResponse: finalRes,
								refreshing: false,
								row: addPages(RuleSubModuleListData.TotalCount)
							})
						} else {
							return Object.assign({}, state, {
								RuleSubModuleListData: null,
								RuleSubModuleResponse: [],
								refreshing: false,
								row: []
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						RuleSubModuleListData: null,
						RuleSubModuleResponse: [],
						refreshing: false,
						row: []
					})
				}
			}
		}
		return null
	}

	render() {
		let { RuleSubModuleListLoading } = this.props.RuleSubModuleListResult

		//for search
		let finalItems = this.state.RuleSubModuleResponse.filter(item => (
			item.SubModuleName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.typeText.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.ModuleDomainTypeText.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.statusText.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())
		))

		return (
			<SafeView style={this.styles().container}>
				{/* Statusbar of Rule Sub Module List */}
				<CommonStatusBar />

				{/* Custom Toolbar of Rule Sub Module List */}
				<CustomToolbar
					title={R.strings.ListRuleSubModule}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{
						(RuleSubModuleListLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<View style={{ flex: 1, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}>

								<FlatList
									showsVerticalScrollIndicator={false}
									data={finalItems}
									renderItem={({ item, index }) => {
										return <RuleSubModuleItem
											item={item}
											index={index}
											size={this.state.RuleSubModuleResponse.length}
											onEditPress={() => this.onEditPress(item)}
										/>
									}}
									keyExtractor={(_item, index) => index.toString()}
									refreshing={this.state.refreshing}
									refreshControl={ <RefreshControl
										progressBackgroundColor={R.colors.background}
										colors={[R.colors.accent]}
										onRefresh={() => this.onRefresh(true, true)}
										refreshing={this.state.refreshing}
										/>
									}
									contentContainerStyle=
									{contentContainerStyle(finalItems)}
									ListEmptyComponent=
									{<ListEmptyComponent />}
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
							onPageChange={(item) => { this.onPageChange(item) }} />
						}
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

export class RuleSubModuleItem extends Component {
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

		let typeColor

		// Main
		if (item.Type == 0)
			typeColor = R.colors.yellow
		// Card
		else if (item.Type == 1)
			typeColor = R.colors.successGreen
		// List
		else if (item.Type == 2)
			typeColor = R.colors.accent
		// Form
		else if (item.Type == 3)
			typeColor = R.colors.boTrade4
		// Chart
		else if (item.Type == 4)
			typeColor = R.colors.successGreen
		// Slider
		else if (item.Type == 5)
			typeColor = R.colors.cardBalanceBlue
		// None
		else
			typeColor = R.colors.yellow


		return (
			// Flatlist item animation
			<AnimatableItem>
				<View style={{
					marginRight: R.dimens.widget_left_right_margin, marginLeft: R.dimens.widget_left_right_margin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
						flex: 1,
						padding: 0,
						borderRadius: 0,
					}}>
						<View style={{ paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding }}>

							<View style={{ flexDirection: 'row' }}>
								{/* for show list icon */}
								<ImageTextButton
									icon={R.images.ic_list_alt}
									style={{
										margin: 0, padding: 0,
										width: R.dimens.SignUpButtonHeight,
										height: R.dimens.SignUpButtonHeight,
										backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight,
										justifyContent: 'center', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start'
									}}
									iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
								/>

								<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin }}>

									{/* for show SubModuleName , module type */}
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', }} >
										<Text style={{
											fontSize: R.dimens.smallText, color: R.colors.textPrimary,
											fontFamily: Fonts.MontserratSemiBold,
										}}>{validateValue(item.SubModuleName)}</Text>
										<Text style={{
											fontSize: R.dimens.smallText, color: R.colors.yellow,
											fontFamily: Fonts.MontserratSemiBold,
										}}>{item.ModuleDomainTypeText}</Text>
									</View>

									{/* for show GUID */}
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
											{R.strings.guid + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
											{validateValue(item.GUID)}</TextViewHML>
									</View>

									{/* for show ParentGUID */}
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
											{R.strings.parentGuid + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
											{validateValue(item.ParentGUID)}</TextViewHML>
									</View>

									{/* for show Type */}
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
											{R.strings.Type + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: typeColor }}>
											{validateValue(item.typeText)}</TextViewHML>
									</View>
								</View>
							</View>

							{/* for show Status , edit icon */}
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }} >
								<StatusChip
									style={{ marginLeft: R.dimens.widgetMargin }}
									color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
									value={item.statusText}></StatusChip>

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
		RuleSubModuleListResult: state.UserManagementReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Rule module sub list
	getRuleSubModuleList: (payload) => dispatch(getRuleSubModuleList(payload)),
	// Clear Rule Sub Module Data
	clearRuleSubModuleData: () => dispatch(clearRuleSubModuleData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RuleSubModuleScreen);