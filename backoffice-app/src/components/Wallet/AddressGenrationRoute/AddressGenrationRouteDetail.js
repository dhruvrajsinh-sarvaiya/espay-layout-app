import React, { Component } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert, } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import { clearAddressGenrationData, addAddressGenrationRoute, updateAddressGenrationRoute } from '../../../actions/Wallet/AddressGenrationRouteAction';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import Button from '../../../native_theme/components/Button';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getCurrencyList } from '../../../actions/PairListAction';
import CommonToast from '../../../native_theme/components/CommonToast';
import TextCard from '../../../native_theme/components/TextCard';

function forLoop(array, superMethod) {
	for (let index = 0; index <= array.length - 1; index++) {
		superMethod(index, array[index]);
	}
}


class AddressGenrationRouteDetail extends Component {

	constructor(props) {
		super(props);

		//item for edit from List screen 
		let item = props.navigation.state.params && props.navigation.state.params.item

		// edit bit for check edit true or false
		let edit = props.navigation.state.params && props.navigation.state.params.edit

		// TrnType=9 for address genration route else withdraw route
		let TrnType = props.navigation.state.params && props.navigation.state.params.TrnType

		//Define all initial state
		this.state = {
			TrnType: TrnType,
			edit: edit,
			item: item,
			refreshing: false,

			response: item ? item.AvailableRoute : [],
			Status: edit ? (item.status === 1 ? true : false) : false,

			currencies: [{ value: R.strings.selectCurrency }],
			selectedCurrency: edit ? item.CurrencyName.split('_')[0] : R.strings.selectCurrency,
			ServiceID: edit ? item.ServiceID : '',

			pairCurrencyList: null,
			isFirstTime: true,
		};

		// Create reference
		this.toast = React.createRef();
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		if (await isInternet()) {

			//to get currency list
			if (!this.state.edit) {
				this.props.getCurrencyList();
			}
		}
	};

	shouldComponentUpdate = (nextProps, nextState) => {
		//For stop twice api call
		return isCurrentScreen(nextProps);
	};

	componentWillUnmount = () => {
		//for Data clear on Backpress
		this.props.clearAddressGenrationData();
		this.props.navigation.state.params.onSuccess()
	};

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
		if (AddressGenrationRouteDetail.oldProps !== props) {
			AddressGenrationRouteDetail.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			const { pairCurrencyList } = props.data;

			if (pairCurrencyList) {
				try {
					//if local currencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.pairCurrencyList == null || (state.pairCurrencyList != null && pairCurrencyList !== state.pairCurrencyList)) {

						//if currencyList response is success then store array list else store empty list
						if (validateResponseNew({ response: pairCurrencyList, isList: true })) {
							let res = parseArray(pairCurrencyList.Response);

							//for add pairCurrencyList
							for (var keyPairList in res) {
								let item = res[keyPairList];
								item.value = item.SMSCode;
							}

							let currencies = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, currencies, pairCurrencyList };
						} else {
							return { ...state, currencies: [{ value: R.strings.selectCurrency }], pairCurrencyList };
						}
					}
				} catch (e) {
					return { ...state, currencies: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null;
	}

	// to move records above
	moveItemToAbove(index) {

		//if moving index is not 0 then move
		if (index != 0) {
			//fetch arranged item
			let response = rearrangeItems(this.state.response, index, 0);

			//Store list
			this.setState({ response });
		}
	}

	//handle to delete records statically 
	onDeletePress = (item, index) => {
		// for show selected Record in Dialog

		showAlert(
			R.strings.Delete + '!',
			R.strings.delete_message,
			6,
			async () => {
				let response = this.state.response
				response.splice(index, 1);

				if (response.length) {

					forLoop(response, (indexKey, el) => response[indexKey].Priority = (indexKey + 1))
					return response;
				}

				this.setState({ response })
			},
			R.strings.no_text,
			() => { }, R.strings.yes_text
		)
	}

	//For Getting Data of Adding new Route Static
	getResponseFromAdd = (AddResponse) => {
		//check for response available or not
		if (AddResponse) {
			let resArray = this.state.response;
			resArray.push(AddResponse);
			this.setState({ response: resArray });
		}
	}

	//For Getting Data of Update route by id
	getResponseFromEdit = (EditResponse, Editindex) => {

		//check for response available or not
		if (EditResponse) {

			let res = this.state.response
			res[Editindex] = EditResponse
			this.setState({ response: res });
		}
	}

	componentDidUpdate = async (prevProps, prevState) => {

		const { addAddressGenrationData, updateAddressGenrationData } = this.props.data;

		if (addAddressGenrationData !== prevProps.data.addAddressGenrationData) {
			// for show responce add
			if (addAddressGenrationData) {
				try {
					if (validateResponseNew({
						response: addAddressGenrationData,
					})) {
						showAlert(R.strings.Success, R.strings.insertSuccessFully, 0, () => {
							this.props.clearAddressGenrationData()
							this.props.navigation.goBack()
						});
					} else {
						this.props.clearAddressGenrationData()
					}
				} catch (e) {
					this.props.clearAddressGenrationData()
				}
			}
		}

		if (updateAddressGenrationData !== prevProps.data.updateAddressGenrationData) {
			// for show responce update
			if (updateAddressGenrationData) {
				try {
					if (validateResponseNew({
						response: updateAddressGenrationData
					})) {
						showAlert(R.strings.Success, updateAddressGenrationData.ReturnMsg, 0, () => {
							this.props.clearAddressGenrationData()
							this.props.navigation.goBack()
						});
					} else {
						this.props.clearAddressGenrationData()
					}
				} catch (e) {
					this.props.clearAddressGenrationData()
				}
			}
		}
	}

	//Add Or Update Button Presss
	onPress = async (Id) => {

		//validations for Inputs 
		if (this.state.selectedCurrency === R.strings.selectCurrency || this.state.ServiceID === '') {
			this.toast.Show(R.strings.selectCurrency)
			return;
		}

		if (await isInternet()) {

			//module not static then call for api otherwise handle adding whitelist at our side
			let request = {
				CurrencyName: this.state.selectedCurrency,
				ServiceID: this.state.ServiceID,
				status: this.state.Status === true ? 1 : 0,
				TrnType: this.state.TrnType,
				AvailableRoute: this.state.response
			}

			if (this.state.edit) {

				//call update address genration api
				this.props.updateAddressGenrationRoute(request)
			}
			else {

				//call add address genration api
				this.props.addAddressGenrationRoute(request)
			}
		}
	}


	render() {

		let filteredList = this.state.response;

		return (

			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set Progress bar as per our theme */}
				<ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.pairCurrencyLoading || this.props.data.addAddressGenrationLoading || this.props.data.updateAddressGenrationLoading} />

				{/* for common toast */}
				<CommonToast ref={cmpToast => this.toast = cmpToast} />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={this.state.edit ? (this.state.TrnType == 9 ? R.strings.updateAddressGenrationRoute : R.strings.updateWithdrawRoute) : (this.state.TrnType == 9 ? R.strings.addAddressGenrationRoute : R.strings.addWithdrawRoute)}
					isBack={true}
					nav={this.props.navigation}
					rightIcon={/* !this.state.edit && */ R.images.IC_PLUS}
					onRightMenuPress={() => this.props.navigation.navigate('AddressGenrationRouteAddEdit', { getResponseFromAdd: this.getResponseFromAdd, count: this.state.response.length, TrnType: this.state.TrnType })}
				/>

				{/* Toggle Button For Status Enable/Disable Functionality */}
				<FeatureSwitch
					isGradient={true}
					title={this.state.Status ? R.strings.Enable : R.strings.Disable}
					isToggle={this.state.Status}
					onValueChange={() => {
						this.setState({
							Status: !this.state.Status
						})
					}}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					{
						(this.props.data.loading && !this.state.refreshing)
							?
							<ListLoader />
							:
							<View style={{ flex: 1 }}>

								{
									!this.state.edit ?
										<TitlePicker
											isRequired={true}
											title={R.strings.Currency}
											array={this.state.currencies}
											selectedValue={this.state.selectedCurrency}
											style={{ marginTop: R.dimens.widget_top_bottom_margin, flex: 0, paddingBottom: R.dimens.widgetMargin, paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding }}
											onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, ServiceID: object.ServiceId })}
										/>
										:
										<TextCard style={{ paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, marginBottom: R.dimens.widgetMargin }} title={R.strings.Currency} value={this.state.selectedCurrency} isRequired={true} />
								}

								{filteredList.length > 0 ?
									<FlatList
										data={filteredList}
										extraData={this.state}
										showsVerticalScrollIndicator={false}
										renderItem={({ item, index }) =>
											<AddressGenrationRouteDetailItem
												index={index}
												item={item}
												edit={this.state.edit}
												onDelete={() => this.onDeletePress(item, index)}
												onDetailPress={() => this.props.navigation.navigate('AddressGenrationRouteDetailSubScreen', { item, TrnType: this.state.TrnType })}
												onTop={() => this.moveItemToAbove(index)}
												onEdit={() => this.props.navigation.navigate('AddressGenrationRouteAddEdit', { index: index, item, edit: true, getResponseFromEdit: this.getResponseFromEdit, TrnType: this.state.TrnType })}
												size={this.state.response.length} />
										}
										keyExtractor={(_item, index) => index.toString()}

									/>
									:
									<ListEmptyComponent module={/* !this.state.edit && */ (this.state.TrnType == 9 ? R.strings.addAddressGenrationRoute : R.strings.addWithdrawRoute)} onPress={() => this.props.navigation.navigate('AddressGenrationRouteAddEdit', { getResponseFromAdd: this.getResponseFromAdd, count: this.state.response.length, TrnType: this.state.TrnType })} />
								}

							</View>
					}
					<View style={{
						paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin
					}}>
						{/* To Set Add or Edit Button */}
						{(this.state.response.length > 0) &&
							<Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress(this.state.edit ? this.state.item.Id : null)}></Button>
						}
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

// for arrange records as per index
function rearrangeItems(items, moveFromIndex, moveToIndex) {

	const movingItem = items[moveFromIndex];
	items.splice(moveFromIndex, 1);
	items.splice(moveToIndex, 0, movingItem);

	forLoop(items, (index, el) => items[index].Priority = (index + 1))
	return items;
}

// This Class is used for display record in list
class AddressGenrationRouteDetailItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		// Get required fields from props
		let { index, size, item, onDetailPress } = this.props;

		return (
			// Flatlist item animation
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						flex: 1,
						elevation: R.dimens.listCardElevation,
						padding: R.dimens.WidgetPadding,
						borderRadius: 0,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}} onPress={onDetailPress}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

								{/* for show RouteName and  AssetName */}
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

									<View style={{ flex: 1, flexDirection: 'row', }}>
										<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.RouteName ? item.RouteName : ' - '}</Text>
										<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.AssetName.toUpperCase() ? " - " + item.AssetName.toUpperCase() : ' - '}</Text>
									</View>
									<View style={{ flexDirection: 'row', }}>
										<Image
											source={R.images.RIGHT_ARROW_DOUBLE}
											style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
										/>
									</View>
								</View>
							</View>
						</View >

						<View style={{ flexDirection: 'row' }}>
							<View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>

								{/* for show providerWalletId and  priority */}
								<View style={{ flex: 1, }}>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.providerWalletId + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.ProviderWalletID ? item.ProviderWalletID : '-'}</TextViewHML>
									</View>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.priority + ': '}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.Priority ? item.Priority : '-'}</TextViewHML>
									</View>
								</View>
							</View>

						</View>


						{/* for  button for edit,delete */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.margin }}>

							<View>
								<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>

									<ImageTextButton
										style={
											{
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: R.colors.accent,
												borderRadius: R.dimens.titleIconHeightWidth,
												margin: 0,
												padding: R.dimens.CardViewElivation,
												marginRight: R.dimens.margin,
											}}
										icon={R.images.IC_ARROW_COLLAPSE}
										iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
										onPress={this.props.onTop} />

									{this.props.edit &&
										<ImageTextButton
											style={
												{
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: R.colors.yellow,
													borderRadius: R.dimens.titleIconHeightWidth,
													margin: 0,
													padding: R.dimens.CardViewElivation,
													marginRight: R.dimens.margin,
												}}
											icon={R.images.IC_EDIT}
											iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
											onPress={this.props.onEdit} />}

									<ImageTextButton
										style={
											{
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: R.colors.failRed,
												borderRadius: R.dimens.titleIconHeightWidth,
												margin: 0,
												padding: R.dimens.CardViewElivation,
											}}
										icon={R.images.IC_DELETE}
										iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
										onPress={this.props.onDelete} />
								</View>
							</View>
						</View>
					</CardView>
				</View >
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	//Updated Data For AddressGenrationRouteReducer Data 
	let data = {
		...state.AddressGenrationRouteReducer,
	}
	return { data }
}

function mapDispatchToProps(dispatch) {
	return {
		//clear reducer data action for backpress
		clearAddressGenrationData: () => dispatch(clearAddressGenrationData()),
		//for Currency list action 
		getCurrencyList: () => dispatch(getCurrencyList()),
		//for addAddressGenrationRoute api data
		addAddressGenrationRoute: (add) => dispatch(addAddressGenrationRoute(add)),
		//for updateAddressGenrationRoute api data
		updateAddressGenrationRoute: (add) => dispatch(updateAddressGenrationRoute(add)),
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(AddressGenrationRouteDetail);