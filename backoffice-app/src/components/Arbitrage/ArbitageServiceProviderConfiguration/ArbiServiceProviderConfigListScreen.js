import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { listArbitageServiceProvider, clearArbitageServiceProviderData } from '../../../actions/Arbitrage/ArbitrageServiceProviderConfigurationAction';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget';

class ArbiServiceProviderConfigListScreen extends Component {

	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			refreshing: false,
			search: '',
			response: [],
			serviceProviderDataState: null,
			isFirstTime: true,
			selectedPage: 1,
			row: [],
		};
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		//To get callWalletTypesApi 
		this.callArbitageServiceProviderListApi()
	}

	//api call for list
	callArbitageServiceProviderListApi = async () => {

		this.setState({
			selectedPage: 1,
		})

		//Check NetWork is Available or not
		if (await isInternet()) {

			//To listArbitageServiceProvider list
			this.props.listArbitageServiceProvider(
				{ Page: 0, PageSize: AppConfig.pageSize }
			);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//For stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentWillUnmount() {
		//for Data clear on Backpress
		this.props.clearArbitageServiceProviderData();
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
		if (ArbiServiceProviderConfigListScreen.oldProps !== props) {
			ArbiServiceProviderConfigListScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			// Get all upadated field of particular actions
			const { serviceProviderData } = props.data;

			if (serviceProviderData) {
				try {
					//if local serviceProviderData state is null or its not null and also different then new response then and only then validate response.
					if (state.serviceProviderDataState == null || (state.serviceProviderDataState != null && serviceProviderData !== state.serviceProviderDataState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: serviceProviderData, isList: true })) {

							let res = parseArray(serviceProviderData.Response);

							//for add status in reponse static
							for (var proKey in res) {
								let item = res[proKey];
								if (item.Status == 0) {
									item.statusText = R.strings.inActive
								}
								else if (item.Status == 1) {
									item.statusText = R.strings.active
								}
								else {
									item.statusText = ''
								}
							}

							return { ...state, serviceProviderDataState: serviceProviderData, response: res, refreshing: false, row: addPages(serviceProviderData.Count) };
						} else {
							return { ...state, serviceProviderDataState: serviceProviderData, response: [], refreshing: false, row: [] };
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

			//To listArbitageServiceProvider list
			this.props.listArbitageServiceProvider({ Page: this.state.selectedPage - 1, PageSize: AppConfig.pageSize });
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

				//To get listArbitageServiceProvider list
				this.props.listArbitageServiceProvider({ Page: pageNo - 1, PageSize: AppConfig.pageSize });
			}
		}
	}

	render() {

		let filteredList = [];

		// For searching functionality
		if (this.state.response.length) {
			filteredList = this.state.response.filter(item => (
				item.AppKey.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.APISecret.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.statusText.toLowerCase().includes(this.state.search.toLowerCase())
			));
		}

		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set Progress bar as per our theme */}
				<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.deleteLoading} />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.arbitrageServiceProviderConfiguration}
					isBack={true}
					nav={this.props.navigation}
					searchable={true}
					onSearchText={(input) => this.setState({ search: input })}
					rightIcon={R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('ArbiServiceProviderConfigAddEditScreen', { onSuccess: this.callArbitageServiceProviderListApi })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{(this.props.data.listFetching && !this.state.refreshing)
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
									<ServiceProviderConfigListItem
										index={index}
										item={item}
										onEdit={() => { this.props.navigation.navigate('ArbiServiceProviderConfigAddEditScreen', { item, onSuccess: this.callArbitageServiceProviderListApi, edit: true }) }}
										size={this.state.response.length} />
								}
								// assign index as key value list item
								keyExtractor={(_item, index) => index.toString()}
								// Refresh functionality in list
								refreshControl={<RefreshControl
									colors={[R.colors.accent]}
									progressBackgroundColor={R.colors.background}
									refreshing={this.state.refreshing}
									onRefresh={this.onRefresh}
								/>}
							/>
							:
							// Displayed empty component when no record found 
							<ListEmptyComponent module={R.strings.adddArbitrageProviderConfiguration} onPress={() => this.props.navigation.navigate('ArbiServiceProviderConfigAddEditScreen', { onSuccess: this.callArbitageServiceProviderListApi })} />
					}
					{/*To Set Pagination View  */}
					<View>
						{filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
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
class ServiceProviderConfigListItem extends Component {
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
					flexDirection: 'column',
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation,
						flex: 1,
						borderRadius: 0,
						flexDirection: 'column',
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>
						<View>
							<View style={{ flex: 1, flexDirection: 'row' }}>

								{/* User Image */}
								<Image
									source={R.images.IC_USER}
									style={{ width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, tintColor: R.colors.accent }}
								/>

								<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>

									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

										{/* for show UserName */}
										<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.UserName)}</TextViewMR>

										{/* for show id */}
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.id + ": "}</TextViewHML>
											<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.Id)}</TextViewHML>
										</View>

									</View>

									{/* for show AppKey */}
									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.appkey + ": "}</TextViewHML>
										<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.AppKey)}</TextViewHML>
									</View>

									{/* for show APISecret */}
									<View>
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.apiKey + ": "}</TextViewHML>
										<TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{validateValue(item.APISecret)}</TextViewHML>
									</View>
								</View>
							</View >

							{/* for show status and edit  */}
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>

								<StatusChip
									color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
									value={item.statusText}
								/>

								<View style={{ flexDirection: 'row' }}>
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
										onPress={this.props.onEdit} />
								</View>
							</View>
						</View>
					</CardView>
				</View >
			</AnimatableItem >
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For ArbiServiceProviderConfigReducer Data 
	let data = {
		...state.ArbiServiceProviderConfigReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform listArbitageServiceProvider List Action 
		listArbitageServiceProvider: (request) => dispatch(listArbitageServiceProvider(request)),
		//Perform clearArbitageServiceProviderData Action 
		clearArbitageServiceProviderData: () => dispatch(clearArbitageServiceProviderData())
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(ArbiServiceProviderConfigListScreen);