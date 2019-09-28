import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, parseFloatVal, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getStakingPolicyList, deleteStakingPolicy, clearStakingConfig } from '../../../actions/Wallet/StakingConfigurationAction';
import ListLoader from '../../../native_theme/components/ListLoader';
import { validateResponseNew, validateValue, isInternet } from '../../../validations/CommonValidation';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { connect } from 'react-redux';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class StakingPolicyListScreen extends Component {
	constructor(props) {
		super(props)

		// get item from previous screen
		let { item } = props.navigation.state.params

		// Define all state initial state
		this.state = {
			StakingPolicyResponse: [],

			item: item,
			searchInput: '',
			refreshing: false,
		}
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Get Staking Policy List Api Call
			this.props.getStakingPolicyList({ PolicyMasterId: this.state.item.Id })
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearStakingConfig()
	}

	//For Swipe to referesh Functionality
	onRefresh = async (needUpdate, fromRefreshControl = false) => {

		if (fromRefreshControl)
			this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (needUpdate && await isInternet()) {

			// Get Staking Policy List Api Call
			this.props.getStakingPolicyList({ PolicyMasterId: this.state.item.Id });

		} else {
			this.setState({ refreshing: false });
		}
	}

	onDelete = (item) => {
		showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

			// check internet connection
			if (await isInternet()) {
				// Delete Staking Policy Data Api Call
				this.props.deleteStakingPolicy({ Id: item.PolicyDetailID })
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
		if (StakingPolicyListScreen.oldProps !== props) {
			StakingPolicyListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { stakingPolicyData, } = props.StakingPolicyResult;

			// stakingPolicyData is not null
			if (stakingPolicyData) {
				try {
					if (state.stakingPolicyData == null || (state.stakingPolicyData != null && stakingPolicyData !== state.stakingPolicyData)) {

						//succcess response fill the list 
						if (validateResponseNew({ response: stakingPolicyData, isList: true })) {

							let res = parseArray(stakingPolicyData.Details)

							for (var dataItem in res) {
								let item = res[dataItem]
								// Add statusText to response 
								// for searching purpose
								item.StatusText = item.Status == 1 ? 'Enable' : 'Disable'
							}

							return Object.assign({}, state, {
								stakingPolicyData,
								StakingPolicyResponse: res,
								refreshing: false,
							})
						} else {
							//if response is not validate than list is empty
							return Object.assign({}, state, {
								stakingPolicyData: null,
								StakingPolicyResponse: [],
								refreshing: false,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						stakingPolicyData: null,
						StakingPolicyResponse: [],
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
		const { deleteStakingPolicyData, } = this.props.StakingPolicyResult;

		// compare response with previous response
		if (deleteStakingPolicyData !== prevProps.StakingPolicyResult.deleteStakingPolicyData) {

			// deleteStakingPolicyData is not null
			if (deleteStakingPolicyData) {
				try {
					// if local deleteStakingPolicyData state is null or its not null and also different then new response then and only then validate response.
					if (this.state.deleteStakingPolicyData == null || (this.state.deleteStakingPolicyData != null && deleteStakingPolicyData !== this.state.deleteStakingPolicyData)) {
						//handle response of API
						if (validateResponseNew({ response: deleteStakingPolicyData })) {
							//Display Success Message and Refresh Staking Policy List
							showAlert(R.strings.Success + '!', deleteStakingPolicyData.ReturnMsg, 0, async () => {
								this.setState({ deleteStakingPolicyData })

								// Clear Staking Config Data 
								this.props.clearStakingConfig();

								// Call Staking Policy List Api 
								this.props.getStakingPolicyList({ PolicyMasterId: this.state.item.Id })

							});
						}
					}
				} catch (error) {
					this.setState({ deleteStakingPolicyData: null })
					// Clear Staking Config Data  
					this.props.clearStakingConfig();
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { stakingPolicyLoading, deleteStakingPolicyLoading } = this.props.StakingPolicyResult;

		// for searching
		let finalItems = this.state.StakingPolicyResponse.filter(item => (
			item.StakingCurrency.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StakingTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.SlabTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.DurationWeek.toString().includes(this.state.searchInput) ||
			item.DurationMonth.toString().includes(this.state.searchInput)
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('AddEditStakingPolicyScreen', { masterItem: this.state.item, onRefresh: this.onRefresh })}
					title={R.strings.stakingPoliciesList}
					isBack={true}
					onBackPress={this.onBackPress}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				{/* Progressbar */}
				<ProgressDialog isShow={deleteStakingPolicyLoading} />

				<View style={{ flex: 1 }}>
					{
						(stakingPolicyLoading && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								data={finalItems}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) => <StakingPolicyListItem
									index={index}
									item={item}
									size={finalItems.length}
									onEdit={() => this.props.navigation.navigate('AddEditStakingPolicyScreen', { item, masterItem: this.state.item, onRefresh: this.onRefresh })}
									onDelete={() => this.onDelete(item)}
								/>}
								// assign index as key valye to Withdrawal list item
								keyExtractor={(_item, index) => index.toString()}
								// For Refresh Functionality In Withdrawal FlatList Item
								refreshControl={
									<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={() => this.onRefresh(true, true)}
									/>
								}
								contentContainerStyle={contentContainerStyle(finalItems)}
								// Displayed Empty Component when no record found 
								ListEmptyComponent={<ListEmptyComponent module={R.strings.addStakingPlan}
									onPress={() =>
										this.props.navigation.navigate('AddEditStakingPolicyScreen', { masterItem: this.state.item, onRefresh: this.onRefresh })
									} />}
							/>
					}
				</View>
			</SafeView>
		)
	}
}

// This Class is used for display record in list
class StakingPolicyListItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item) {
			return false
		}
		return true
	}

	render() {
		let { size, index, item, onEdit, onDelete } = this.props
		//To Display various Status Color in ListView
		let color = R.colors.accent;

		if (item.Status === 0) {
			color = R.colors.textSecondary
		}
		if (item.Status === 1) {
			color = R.colors.successGreen
		}
		if (item.Status === 3) {
			color = R.colors.failRed
		}
		if (item.Status === 6) {
			color = R.colors.accent
		}
		if (item.Status === 9) {
			color = R.colors.failRed
		}

		return (
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						flex: 1,
						borderRadius: 0,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
						elevation: R.dimens.listCardElevation,
					}} >
						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={validateValue(item.StakingCurrency)} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

								{/* Currency Name */}
								<Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.StakingCurrency)} </Text>

								{/* Staking Type */}
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Staking_Type}: </TextViewHML>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.StakingTypeName)}</TextViewHML>
								</View>

								{/* Slab Type */}
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Slab_Type}: </TextViewHML>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.SlabTypeName)}</TextViewHML>
								</View>

							</View>
						</View>

						{/* for show Amount, charge and leverage amount */}
						<View style={{ flex: 1, flexDirection: 'row', }}>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Amount}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(parseFloatVal(item.AvailableAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.AvailableAmount).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.month}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.DurationMonth)}</TextViewHML>
							</View>

							<View style={{ flex: 1, alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.week}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{validateValue(item.DurationWeek)}
								</TextViewHML>
							</View>
						</View>

						{/* for show status and DateTime */}
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.margin }}>
							<StatusChip
								color={color}
								value={item.StatusText}></StatusChip>
							<View style={{ flexDirection: 'row' }}>
								<ImageTextButton
									style={this.styles().imageButtonStyle}
									icon={R.images.IC_EDIT}
									iconStyle={this.styles().iconStyle}
									onPress={onEdit} />

								<ImageTextButton
									icon={R.images.IC_DELETE}
									style={[this.styles().imageButtonStyle, { backgroundColor: R.colors.failRed, marginRight: 0 }]}
									iconStyle={this.styles().iconStyle}
									onPress={onDelete} />
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}

	styles = () => {
		return {
			iconStyle: {
				tintColor: R.colors.white,
				width: R.dimens.titleIconHeightWidth,
				height: R.dimens.titleIconHeightWidth,
			},
			imageButtonStyle: {
				margin: 0,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: R.colors.accent,
				borderRadius: R.dimens.titleIconHeightWidth,
				padding: R.dimens.CardViewElivation,
				marginRight: R.dimens.margin,
			}
		}
	}
}

const mapStateToProps = (state) => {
	return {
		// get position report data from reducer
		StakingPolicyResult: state.StakingConfigurationReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Staking Policy List Action
	getStakingPolicyList: (payload) => dispatch(getStakingPolicyList(payload)),
	// To Perform Delete Staking Policy Data Action
	deleteStakingPolicy: (payload) => dispatch(deleteStakingPolicy(payload)),
	// Clear Staking Policy Data Action
	clearStakingConfig: () => dispatch(clearStakingConfig()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StakingPolicyListScreen);