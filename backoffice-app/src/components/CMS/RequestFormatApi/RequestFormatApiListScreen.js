import { Fonts } from '../../../controllers/Constants';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { getAllRequestFormat } from '../../../actions/CMS/ApiManagerActions';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { clearRequestFormatApiData } from '../../../actions/CMS/RequestFormatApiActions';

class RequestFormatApiListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],
			requestFormatDataState: null,
			isFirstTime: true,
		}
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {
			//To get callTopupHistoryApi 
			this.callGetAllRequestFormatApi()
		}
	}

	//api call for list 
	callGetAllRequestFormatApi = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To getAllRequestFormat list
			this.props.getAllRequestFormat();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearRequestFormatApiData()
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
		if (RequestFormatApiListScreen.oldProps !== props) {
			RequestFormatApiListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			const { requestFormatData } = props.data;

			if (requestFormatData) {
				try {
					//if local requestFormatData state is null or its not null and also different then new response then and only then validate response.
					if (state.requestFormatDataState == null || (state.requestFormatDataState != null && requestFormatData !== state.requestFormatDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: requestFormatData, isList: true })) {

							let res = parseArray(requestFormatData.Result);

							//for status static
							for (var requestFormatDataKey in res) {
								let item = res[requestFormatDataKey];
								//active
								if (item.Status == 1) {
									item.statusStatic = R.strings.active
								}
								//inactive
								else if (item.Status == 0) {
									item.statusStatic = R.strings.Inactive
								}
								else {
									item.statusStatic = ''
								}
							}

							return {
								...state, requestFormatDataState: requestFormatData,
								response: res, refreshing: false,
							};
						} else {
							return { ...state, requestFormatDataState: requestFormatData, response: [], refreshing: false };
						}
					}
				} catch (e) {
					return { ...state, response: [], refreshing: false };
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

			//To getAllRequestFormat list
			this.props.getAllRequestFormat();
		} else {
			this.setState({ refreshing: false });
		}
	}

	render() {
		let filteredList = [];

		//for search all fields if response length > 0
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.RequestName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.ContentType.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.MethodType.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (

			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.requestFormatApi}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('RequestFormatApiAddEditScreen', { onSuccess: this.callGetAllRequestFormatApi })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(this.props.data.requestFormatDataFetching && !this.state.refreshing)
						?
						<ListLoader />
						:
						filteredList.length > 0 ?
							<FlatList
								data={filteredList}
								extraData={this.state}
								showsVerticalScrollIndicator={false}
								renderItem={({ item, index }) =>
									<RequestFormatApiListItem
										index={index}
										item={item}
										onEdit={() => { this.props.navigation.navigate('RequestFormatApiAddEditScreen', { item, onSuccess: this.callGetAllRequestFormatApi }) }}
										onDetailPress={() => { this.props.navigation.navigate('RequestFormatApiListDetailScreen', { item }) }}
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
							<ListEmptyComponent module={R.strings.addRequestFormatApi} onPress={() => this.props.navigation.navigate('RequestFormatApiAddEditScreen', { onSuccess: this.callGetAllRequestFormatApi })} />
					}
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
class RequestFormatApiListItem extends Component {

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
					marginRight: R.dimens.widget_left_right_margin,
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
						flex: 1,
						borderRadius: 0,
					}}
						onPress={this.props.onDetailPress}>

						<View style={{
							flexDirection: 'row'
						}}>

							{/* for show RequestName  */}
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									<Text numberOfLines={1} ellipsizeMode={'tail'} style={{
										flex: 1, textAlign: 'left',
										fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold
									}}>
										{validateValue(item.RequestName)}
									</Text>
									<ImageTextButton
										style={{ margin: 0 }}
										iconStyle={{
											width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary
										}}
										icon={R.images.RIGHT_ARROW_DOUBLE}
										onPress={this.props.onDetailPress}
									/>
								</View>

								{/* for show method */}
								<View
									style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
										{R.strings.method + ': '}
									</TextViewHML>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>
										{validateValue(item.MethodType)}
									</TextViewHML>
								</View>

								{/* for show ContentType */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
										{R.strings.contentType + ': '}
									</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>
										{validateValue(item.ContentType)}
									</TextViewHML>
								</View>

								{/* for show RequestFormat */}
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
									<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
										{R.strings.requestFormat + ': '}
									</TextViewHML>
									<TextViewHML numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>
										{validateValue(item.RequestFormat)}
									</TextViewHML>
								</View>
							</View>
						</View>

						{/* for show status and button for edit */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
							<StatusChip
								color={item.Status == 1 ? R.colors.successGreen
									: R.colors.failRed}
								value={item.statusStatic}
							/>

							<View style={{
								flexDirection: 'row'
							}}>
								<ImageTextButton
									style={
										{
											justifyContent: 'center',
											padding: R.dimens.CardViewElivation,
											backgroundColor: R.colors.accent,
											borderRadius: R.dimens.titleIconHeightWidth,
											margin: 0,
											alignItems: 'center',
										}}
									onPress={this.props.onEdit}
									icon={R.images.IC_EDIT}
									iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
								/>
							</View>
						</View>
					</CardView>

				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	
	//Updated Data For RequestFormatApiReducer Data 
	let data = {
		...state.RequestFormatApiReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getAllRequestFormat List Action 
		getAllRequestFormat: () => dispatch(getAllRequestFormat()),
		//Perform clearRequestFormatApiData Action 
		clearRequestFormatApiData: () => dispatch(clearRequestFormatApiData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(RequestFormatApiListScreen);