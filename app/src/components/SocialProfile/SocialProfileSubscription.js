import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, windowPercentage, addListener } from '../../controllers/CommonUtils';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getSocialProfileSubscription, getSocialProfileSubscribe, getSocialProfileUnSubscribe, clearLeader } from '../../actions/SocialProfile/SocialProfileActions';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { ServiceUtilConstant, Fonts, Events } from '../../controllers/Constants';
import { setData } from '../../App';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import Button from '../../native_theme/components/Button';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import SafeView from '../../native_theme/components/SafeView';

class SocialProfileSubscription extends Component {
	constructor(props) {
		super(props);

		let { width, height } = Dimensions.get('window');
		let contentPercentage = width * 65 / 100;

		this.state = {
			activeSlide: 0,
			ProfileId: '',
			ProfileType: '',
			SocialProfileSubscriptionData: null,
			SocialProfileSubscribeData: null,
			SocialProfileUnSubscribeData: null,
			SocialProfileResponse: [],
			disablePlan: false,
			isFirstTime: true,
			isPortrait: width < height,
			itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		/* stop twice api call  */
		return isCurrentScreen(nextProps);
	};

	async  componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()

		// add listener for update Dimensions
		this.dimensionListener = addListener(Events.Dimensions, ({ width, height }) => {
			let contentPercentage = width * 65 / 100;
			this.setState({
				isPortrait: width < height,
				itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
			})
		});

		// Check internet connectivity 
		if (await isInternet()) {
			// Called Social Profile Subscription Api 
			this.props.getSocialProfileSubscription()
		}
	};

	componentWillUnmount() {
		if (this.dimensionListener) {

			// remove listener of dimensions
			this.dimensionListener.remove();
		}
	}

	onPress = async (item) => {
		// Check profile subscribe or not 
		if (item.Subscribe == false) {
			this.setState({ ProfileId: item.ProfileId, ProfileType: item.ProfileType })
			// Check internet connection 
			if (await isInternet()) {
				// Called Social Profile Subscribe Api 
				this.props.getSocialProfileSubscribe(item.ProfileId)
			}
		} else {
			this.setState({ ProfileId: '', ProfileType: '' })
			// Check internet connection 
			if (await isInternet()) {
				// Called Social Profile UnSubscribe Api 
				this.props.getSocialProfileUnSubscribe(item.ProfileId)
			}
		}
	}

	onProgress = async () => {
		// Check internet connection 
		if (await isInternet()) {
			// Called Social Profile Subscription Api
			this.props.getSocialProfileSubscription()
		}
	}

	// When user press on Edit Button 
	onEditPress = (item) => {
		let { navigate } = this.props.navigation
		if (item.ProfileType === 'Leader') {
			navigate('LeaderProfileConfiguration', { ProfileId: item.ProfileId, onProgress: this.onProgress, })
		} else if (item.ProfileType === 'Follower') {
			navigate('LeaderList', { onProgress: this.onProgress })
		}
	}

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return {
				...state,
				isFirstTime: false,
			};
		}

		if (isCurrentScreen(props)) {

			//Get All Updated field of Particular actions
			const { SocialProfileSubscriptionData, SocialProfileSubscribeData, SocialProfileUnSubscribeData } = props.SocialProfileResult

			// SocialProfileSubscriptionData is not null 
			if (SocialProfileSubscriptionData) {
				try {
					if (state.SocialProfileSubscriptionData == null || (state.SocialProfileSubscriptionData != null && SocialProfileSubscriptionData !== state.SocialProfileSubscriptionData)) {

						// Response is validate or not and if not then alert is displayed on screen
						if (validateResponseNew({ response: SocialProfileSubscriptionData })) {
							let res = parseArray(SocialProfileSubscriptionData.SocialProfileList)
							let disablePlan = false
							res.map((item) => {
								if (item.Subscribe)
									disablePlan = true
							})
							return {
								...state,
								disablePlan,
								SocialProfileResponse: res,
								SocialProfileSubscriptionData
							}
						} else {
							return {
								...state,
								SocialProfileResponse: [],
								SocialProfileSubscriptionData: null
							}
						}
					}
				} catch (error) {
					return {
						...state,
						SocialProfileResponse: [],
						SocialProfileSubscriptionData: null
					}
				}
			}

			// SocialProfileSubscribeData is not null 
			if (SocialProfileSubscribeData) {
				try {
					if (state.SocialProfileSubscribeData == null || (state.SocialProfileSubscribeData != null && SocialProfileSubscribeData !== state.SocialProfileSubscribeData)) {

						if (validateResponseNew({ response: SocialProfileSubscribeData })) {
							// set preference for social profile plan 
							setData({ [ServiceUtilConstant.KEY_SocialProfilePlan]: true });
							return {
								...state,
								SocialProfileSubscribeData: SocialProfileSubscribeData,
								disablePlan: false
							}
						} else {
							props.clearLeader();
							return {
								...state,
								ProfileId: '',
								ProfileType: '',
								SocialProfileSubscribeData
							}
						}
					}
				} catch (error) {
					props.clearLeader();
					return {
						...state,
						ProfileId: '',
						ProfileType: ''
					}
				}
			}

			// SocialProfileUnSubscribeData is not null 
			if (SocialProfileUnSubscribeData) {
				try {
					if (state.SocialProfileUnSubscribeData == null || (state.SocialProfileUnSubscribeData != null && SocialProfileUnSubscribeData !== state.SocialProfileUnSubscribeData)) {

						if (validateResponseNew({ response: SocialProfileUnSubscribeData })) {
							// set preference for social profile plan 
							setData({ [ServiceUtilConstant.KEY_SocialProfilePlan]: false });
							return {
								...state,
								SocialProfileUnSubscribeData: SocialProfileUnSubscribeData,
								disablePlan: false
							}
						} else {
							props.clearLeader();
							return {
								...state,
								SocialProfileUnSubscribeData
							}
						}
					}
				} catch (error) {
					props.clearLeader();
					return {
						...state,
					}
				}
			}
		}
		return null
	};

	componentDidUpdate = async (prevProps, prevState) => {
		//Get All Updated field of Particular actions
		const { SocialProfileSubscribeData, SocialProfileUnSubscribeData } = this.props.SocialProfileResult

		if (SocialProfileSubscribeData !== prevProps.SocialProfileResult.SocialProfileSubscribeData) {
			// EditFollowerConfigData is not null
			if (SocialProfileSubscribeData) {
				let { navigate } = this.props.navigation
				if (this.state.ProfileType != '' && this.state.ProfileType === 'Leader')
					navigate('LeaderProfileConfiguration', { ProfileId: this.state.ProfileId, onProgress: this.onProgress, })
				else if (this.state.ProfileType != '' && this.state.ProfileType === 'Follower')
					navigate('LeaderList', { onProgress: this.onProgress })
			}
		}

		if (SocialProfileUnSubscribeData !== prevProps.SocialProfileResult.SocialProfileUnSubscribeData) {
			// EditFollowerConfigData is not null
			if (SocialProfileUnSubscribeData) {
				if (await isInternet()) {
					// Call Social Profile Subscription Api when user unsubscribe the plan 
					this.props.getSocialProfileSubscription()
				}
			}
		}
	}

	render() {
		const { activeSlide } = this.state;
		let { SocialProfileSubscriptionLoading, SocialProfileSubscribeLoading, SocialProfileUnSubscribeLoading } = this.props.SocialProfileResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.SocialProfileSubscription}
					isBack={true}
					nav={this.props.navigation}
					rightIcon={R.images.IC_ADJUST_FILLED}
					onRightMenuPress={() => this.props.navigation.navigate('SocialProfileDashboard', { item: this.state.SocialProfileResponse, })}
				/>
				{/*  Progressbar  */}
				<ProgressDialog isShow={SocialProfileUnSubscribeLoading || SocialProfileSubscribeLoading} />

				{
					SocialProfileSubscriptionLoading ?
						<ListLoader />
						:
						<View style={{ flex: 1 }}>
							{
								this.state.SocialProfileResponse.length > 0 ?
									<View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1, }} >

										{/* for slider */}
										<Carousel
											extraData={this.state}
											ref={c => this._slider1Ref = c}
											data={this.state.SocialProfileResponse}
											/* render all item in card */
											renderItem={({ item }) => <FlatListItem
												item={item}
												disablePlan={this.state.disablePlan}
												onPress={() => this.onPress(item)}
												isPortrait={this.state.isPortrait}
												onEditPress={() => this.onEditPress(item)}
											></FlatListItem>}
											sliderWidth={Dimensions.get('window').width}
											itemWidth={this.state.itemWidth}
											hasParallaxImages={true}
											firstItem={0}
											inactiveSlideScale={0.94}
											inactiveSlideOpacity={0.7}
											inactiveSlideShift={20}
											loop={false}
											onSnapToItem={(index) => this.setState({ activeSlide: index })}
										/>
										{/* for pagination */}
										<Pagination
											dotsLength={this.state.SocialProfileResponse.length}
											activeDotIndex={activeSlide}
											dotColor={R.colors.accent}
											inactiveDotColor={R.colors.textSecondary}
											inactiveDotOpacity={R.dimens.Carousel.pagination.inactiveDotOpacity}
											inactiveDotScale={R.dimens.Carousel.pagination.inactiveDotScale}
										/>
									</View>
									:
									<ListEmptyComponent />
							}
						</View>
				}
			</SafeView>
		);
	}
}

// This Class is used for display record in list
class FlatListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item || this.props.isPortrait != nextProps.isPortrait) {
			return true;
		}
		return false;
	}

	render() {
		let item = this.props.item
		return (
			<CardView style={this.style().subContainer}>
				{this.props.isPortrait ?
					<View>
						{/* Title */}
						<View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', }}>
							<Text style={[this.style().card_tag_value, { flex: 1, textAlign: 'center', fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold }]}>{item.ProfileType}</Text>
							{
								item.Subscribe &&
								<ImageTextButton
									icon={R.images.IC_EDIT}
									style={{ margin: 0, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
									iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
									onPress={this.props.onEditPress} />
							}
						</View>

						{/* Value */}
						<View style={{ height: '40%', }}>
							<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
								<TextViewMR style={{ paddingTop: R.dimens.membershipItemPaddingTop, fontSize: R.dimens.membershipNormal, color: R.colors.textPrimary }}>$</TextViewMR>
								<Text style={{ fontSize: R.dimens.membershipMedium, fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary }}>{item.Price}</Text>
							</View>
						</View>

						{/*Button */}
						<Button
							style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
							disabled={!item.Subscribe && this.props.disablePlan ? true : false}
							onPress={this.props.onPress}
							title={item.Subscribe == true ? R.strings.UnSubscribe : R.strings.Subscribe} />

						< View style={{ height: '40%', justifyContent: 'flex-end', alignContent: 'flex-end' }}>
							<View style={{ flexDirection: 'row' }}>

								<View style={{ width: '70%', }}>
									<TextViewHML style={this.style().card_tag_value}>{R.strings.ProfileVisibility}</TextViewHML>
									<TextViewHML style={this.style().card_tag_value}>{R.strings.CanHaveFollower}</TextViewHML>
									<TextViewHML style={this.style().card_tag_value}>{R.strings.CanFollowLeader}</TextViewHML>
									<TextViewHML style={this.style().card_tag_value}>{R.strings.CanCopyTrade}</TextViewHML>
									<TextViewHML style={this.style().card_tag_value}>{R.strings.CanMirrorTrade}</TextViewHML>
									<TextViewHML style={this.style().card_tag_value}>{R.strings.MinTradeVolume}</TextViewHML>
								</View>
								<View style={{ width: '30%' }}>
									<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Profile_Visiblity}</TextViewHML>
									<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Have_Followers}</TextViewHML>
									<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Follow_Leaders}</TextViewHML>
									<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Copy_Trade}</TextViewHML>
									<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Mirror_Trade}</TextViewHML>
									<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Minimum_Trade_Volume}</TextViewHML>
								</View>

							</View>
						</View>
					</View>
					:
					<View style={{ flex: 1 }}>
						<View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
							{
								item.Subscribe &&
								<ImageTextButton
									icon={R.images.IC_EDIT}
									style={{ margin: 0, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
									iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
									onPress={this.props.onEditPress} />
							}
						</View>

						<View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
							<View style={{ flex: 1, justifyContent: 'center' }}>
								{/* Title */}
								<View style={{ alignItems: 'center', flexDirection: 'row', }}>
									<Text style={[this.style().card_tag_value, { flex: 1, textAlign: 'center', fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold }]}>{item.ProfileType}</Text>

								</View>
								{/* Value */}

								<View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: R.dimens.margin }}>
									<TextViewMR style={{ fontSize: R.dimens.membershipNormal, color: R.colors.textPrimary }}>$</TextViewMR>
									<Text style={{ fontSize: R.dimens.EditTextHeights, fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary }}>{item.Price}</Text>
								</View>

								{/*Button */}

								<Button
									style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
									disabled={!item.Subscribe && this.props.disablePlan ? true : false}
									onPress={this.props.onPress}
									title={item.Subscribe == true ? R.strings.UnSubscribe : R.strings.Subscribe} />

							</View>

							< View style={{ flex: 1, justifyContent: 'center' }}>
								<View style={{ flexDirection: 'row' }}>

									<View style={{ width: '70%', }}>
										<TextViewHML style={this.style().card_tag_value}>{R.strings.ProfileVisibility}</TextViewHML>
										<TextViewHML style={this.style().card_tag_value}>{R.strings.CanHaveFollower}</TextViewHML>
										<TextViewHML style={this.style().card_tag_value}>{R.strings.CanFollowLeader}</TextViewHML>
										<TextViewHML style={this.style().card_tag_value}>{R.strings.CanCopyTrade}</TextViewHML>
										<TextViewHML style={this.style().card_tag_value}>{R.strings.CanMirrorTrade}</TextViewHML>
										<TextViewHML style={this.style().card_tag_value}>{R.strings.MinTradeVolume}</TextViewHML>
									</View>
									<View style={{ width: '30%' }}>
										<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Profile_Visiblity}</TextViewHML>
										<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Have_Followers}</TextViewHML>
										<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Follow_Leaders}</TextViewHML>
										<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Copy_Trade}</TextViewHML>
										<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Can_Mirror_Trade}</TextViewHML>
										<TextViewHML style={[this.style().card_tag_value, { textAlign: 'right' }]}>{item.Minimum_Trade_Volume}</TextViewHML>
									</View>

								</View>
							</View>
						</View>
					</View>
				}
			</CardView >
		)
	}

	// styles for this class
	style = () => {
		return {
			subContainer: {
				flex: 1,
				margin: R.dimens.CardViewElivation,
			},
			card_tag_value: {
				fontSize: R.dimens.smallestText,
				color: R.colors.textPrimary
			},
		}
	}
}

// return state from saga or reducer 
const mapStateToProps = (state) => {
	return {
		//Updated Data Social Profile Subscription Action 
		SocialProfileResult: state.SocialProfileReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Social Profile subscription Action
	getSocialProfileSubscription: () => dispatch(getSocialProfileSubscription()),
	//Perform Social Profile subscribe Action
	getSocialProfileSubscribe: (payload) => dispatch(getSocialProfileSubscribe(payload)),
	//Perform Social Profile Unsubscribe Action
	getSocialProfileUnSubscribe: (payload) => dispatch(getSocialProfileUnSubscribe(payload)),
	//clear data Action
	clearLeader: () => dispatch(clearLeader()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SocialProfileSubscription);
