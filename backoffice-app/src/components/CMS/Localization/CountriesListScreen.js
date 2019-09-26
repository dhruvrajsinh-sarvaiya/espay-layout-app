import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget';
import { getListCountryApi, ClearListCountryData } from '../../../actions/CMS/LocalizationActions';

class CountriesListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			titleScreen: R.strings.countries,
			refreshing: false,
			search: '',
			response: [],
			countryListDataState: null,
			isFirstTime: true,
			selectedPage: 1,
			row: [],
		};
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		if (await isInternet()) {
			//To get callCountryListApi 
			this.callCountryListApi()
		}
	}



	//api call for list and filter reset
	callCountryListApi = async () => {

		if (!this.state.isFirstTime) {
			this.setState({
				selectedPage: 1,
			})
		}

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getListCountryApi list
			this.props.getListCountryApi({
				PageIndex: 0,
				PageSize: AppConfig.pageSize,
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.ClearListCountryData()
	}

	static oldProps = {};

	//handle reponse 
	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return {
				...state,
				isFirstTime: false,
			};
		}

		// To Skip Render if old and new props are equal
		if (CountriesListScreen.oldProps !== props) {
			CountriesListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { countryListData } = props.data;

			if (countryListData) {
				try {
					//if local countryListData state is null or its not null and also different then new response then and only then validate response.
					if (state.countryListDataState == null || (state.countryListDataState != null && countryListData !== state.countryListDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({
							response: countryListData,
							returnCode: countryListData.responseCode,
							isList: true,
						})) {

							let res = parseArray(countryListData.data);

							//for add status static
							for (var keyData in res) {
								let item = res[keyData];

								if (item.status == 1)
									item.statusStatic = R.strings.active
								else if (item.status == 0)
									item.statusStatic = R.strings.inActive
							}

							return {
								...state, countryListDataState: countryListData,
								response: res, refreshing: false,
								row: addPages(countryListData.totalCount)
							};
						} else {
							return { ...state, countryListDataState: countryListData, response: [], refreshing: false, row: [] };
						}
					}
				} catch (e) {
					return { ...state, response: [], refreshing: false, row: [] };
				}
			}
		}
		return null;
	}

	// this method is called when swipe page api call
	onRefresh = async () => {

		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getListCountryApi list
			this.props.getListCountryApi(
				{
					PageIndex: this.state.selectedPage - 1,
					PageSize: AppConfig.pageSize,
				});
		} else {
			this.setState({ refreshing: false });
		}
	}

	// this method is called when page change and also api call
	onPageChange = async (pageNo) => {

		//if selected page is diffrent than call api
		if (pageNo != this.state.selectedPage) {

			//Check NetWork is Available or not
			if (await isInternet()) {

				this.setState({ selectedPage: pageNo });

				//To get getListCountryApi list
				this.props.getListCountryApi({
					PageIndex: pageNo - 1,
					PageSize: AppConfig.pageSize
				});
			}
		}
	}


	render() {
		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.locale.en.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.countryCode.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={this.state.titleScreen}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('AddEditCountriesScreen',
						{ onSuccess: this.callCountryListApi })}
					onSearchText={(input) => this.setState({ search: input })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(this.props.data.countryListFetching && !this.state.refreshing)
						?
						<ListLoader />
						:
						filteredList.length > 0 ?
							<FlatList
								data={filteredList}
								extraData={this.state}
								showsVerticalScrollIndicator={false}
								// render all item in list
								renderItem={({ item, index }) =>
									<ArbiTradeReconListItem
										index={index}
										item={item}
										onAction={() => this.props.navigation.navigate('AddEditCountriesScreen',
											{ item, onSuccess: this.callCountryListApi })}
										size={this.state.response.length} />
								}
								// assign index as key value to list item
								keyExtractor={(_item, index) => index.toString()}
								// Refresh functionality in list
								refreshControl={<RefreshControl
									refreshing={this.state.refreshing}
									colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
									onRefresh={this.onRefresh}
								/>}
							/>
							:
							// Displayed empty component when no record found
							<ListEmptyComponent />
					}
					{/*To Set Pagination View  */}
					<View>
						{filteredList.length > 0 && <PaginationWidget row={this.state.row} onPageChange={(item) => { this.onPageChange(item) }} selectedPage={this.state.selectedPage} />}
					</View>
				</View>
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
class ArbiTradeReconListItem extends Component {
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
		let { index, size, item } = this.props;

		return (
			// flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginRight: R.dimens.widget_left_right_margin,
					marginLeft: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
						borderRadius: 0,
						borderTopRightRadius: R.dimens.margin,
						flex: 1,
					}} onPress={this.props.onDetailPress}>

						<View style={{ flexDirection: 'row' }}>

							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									{/* for show country name */}
									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
										<Text style={{
											fontSize: R.dimens.smallText, color: R.colors.textPrimary,
											fontFamily: Fonts.MontserratSemiBold,
										}}>{validateValue(item.locale.en)}</Text>
									</View>

									{/* for show edit icon */}
									<View style={{ flexDirection: 'row', alignItems: 'center', }}>
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
											onPress={this.props.onAction} />
									</View>
								</View>

								{/* for show countryId, countryCode  */}
								<View style={{ flex: 1, }}>
									{/* 			<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.countryId + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.countryId)}</TextViewHML>
									</View> */}
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
											{R.strings.countryCode + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
											{validateValue(item.countryCode)}</TextViewHML>
									</View>
								</View>
							</View>
						</View>

						{/* for show status and date */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
							<StatusChip
								color={item.status == 1 ? R.colors.successGreen : R.colors.failRed}
								value={item.statusStatic}></StatusChip>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<ImageTextButton
									iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
									style={{ margin: 0, paddingRight: R.dimens.LineHeight, }} icon={R.images.IC_TIMER}
								/>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.createdDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For LocalizationReducer Data 
	let data = {
		...state.LocalizationReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getListCountryApi List Action 
		getListCountryApi: (request) => dispatch(getListCountryApi(request)),
		//Perform ClearListCountryData Action 
		ClearListCountryData: () => dispatch(ClearListCountryData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(CountriesListScreen);