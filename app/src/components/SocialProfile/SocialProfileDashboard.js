import React, { Component } from 'react'
import { View, Image, ScrollView, FlatList, Text, TouchableWithoutFeedback, Dimensions } from 'react-native'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import R from '../../native_theme/R';
import Button from '../../native_theme/components/Button';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import Separator from '../../native_theme/components/Separator';
import CardView from '../../native_theme/components/CardView';
import { connect } from 'react-redux';
import { changeTheme, parseArray, addListener, } from '../../controllers/CommonUtils';
import ListLoader from '../../native_theme/components/ListLoader';
import ChartView from 'react-native-highcharts';
import { isCurrentScreen } from '../Navigation';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { getSocialProfileTopLeaderList, getHistoricalPerformChart, getSocialProfileSubscription } from '../../actions/SocialProfile/SocialProfileActions';
import SocialProfileTopGainerWidget from './SocialProfileTopGainerWidget';
import SocialProfileTopLooserWidget from './SocialProfileTopLooserWidget';
import Picker from '../../native_theme/components/Picker';
import PortfolioList from './PortfolioList';
import { getData } from '../../App';
import { ServiceUtilConstant, Fonts, Events } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

const { width: viewportWidth } = R.screen();
function wp(percentage) {
	const value = (percentage * viewportWidth) / 100;
	return Math.round(value);
}

const slideWidth = wp(85);
const itemWidth = slideWidth;
var largerHeight;
var needScale = true;

export class SocialProfileDashboard extends Component {
	constructor(props) {
		super(props);
		let item;
		if (props.navigation.state.params !== undefined && props.navigation.state.params.item !== undefined) {
			item = props.navigation.state.params.item;
		} else {
			item = [];
		}

		//initial state
		this.state = {
			SocialProfileResponse: item,
			FirstName: getData(ServiceUtilConstant.FIRSTNAME),
			LastName: getData(ServiceUtilConstant.LASTNAME),
			UserName: getData(ServiceUtilConstant.KEY_USER_NAME),
			refreshing: false,
			selectedYear: '',
			HistoricalPerformance: [],
			HistoricalPerfomanceData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			isFirstTime: true,
			TopLeaderResponse: [],
			viewHeight: 0,
			isGainer: true,
			Data: [
				{ id: '1', value: R.strings.WatchList, icon: R.images.FAVORITE, type: 2 },
				{ id: '2', value: R.strings.followerList, icon: R.images.IC_ACCOUNT, type: 1 },
			],
			displayYear: [],
			index: 0,
			secondItemX: 0,
			width: Dimensions.get('window').width
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		/* stop twice api call  */
		return isCurrentScreen(nextProps);
	};

	componentDidMount = async () => {
		// Change theme as per night and light mode
		changeTheme()
		// check internet connection
		if (await isInternet()) {
			if (this.state.SocialProfileResponse.length == 0) {
				// Called Social Profile Subscription Api
				this.props.getSocialProfileSubscription()
			}
			// Call Top Leader List Api
			this.props.getTopLeaderList()
			let reqChart = { LeaderId: 0 }
			// Call Historical Performance Chart
			this.props.getHistoricalPerfomance(reqChart)
		}

		try {
			this.dimensionListener = addListener(Events.Dimensions, (data) => this.setState(Object.assign({}, this.state, data)));
		} catch (error) {

		}
	}

	componentWillUnmount() {
		if (this.dimensionListener) {
			this.dimensionListener.remove();
		}
	}

	// Called when Top Gainer/Loser button
	onPressTopGainerLoser = (isGainer) => {
		this.setState({ isGainer })
	}

	// navigate to other screen
	screenToRedirect = (item) => {
		let { navigate } = this.props.navigation
		if (item === R.strings.WatchList)
			navigate('MyWatchList')
		else if (item === R.strings.followerList)
			navigate('FollowerList')
	}

	// Checked item is subscribe or not
	isSubscribe = (subscribeitem) => {
		let subscribe = false
		subscribeitem.map((item) => {
			if (item.Subscribe)
				subscribe = true
		})
		return subscribe
	}

	// Which plan is suscribed currently
	whichPlanSubscribe = (subscribePlan) => {
		let subscribe;
		subscribePlan.map((item) => {
			if (item.Subscribe) {
				if (item.ProfileType === 'Leader' || item.ProfileType === 'Follower') {
					subscribe = item.ProfileType;
				} else {
					subscribe = R.strings.SubscribeNow;
				}
			}
		})
		return subscribe
	}

	// navigate to SocialProfileSubscription screen
	onUpdatePlan = () => {
		this.props.navigation.navigate('SocialProfileSubscription')
	}

	onSubscribe = () => {
		// if not subscribe any plan then redirect to SocialProfileSubscription otherwise it will go back
		if (!this.isSubscribe(this.state.SocialProfileResponse)) {
			this.props.navigation.navigate('SocialProfileSubscription')
		} else {
			this.props.navigation.goBack()
		}
	}

	// When user press on next button of Top Leader List
	onLeaderListNextPress = () => {
		// current index of item
		let index = this.state.index;
		let nextItemX;

		// to determine first and last item of array
		let isFirstItem = index == 0;
		let isLastItem = index == this.state.TopLeaderResponse.length - 1;

		// to check if its first or last item than follow below condition
		if (isFirstItem || isLastItem) {

			// Item's left margin, which will be greater than rest items
			let marginLeft = R.dimens.widget_left_right_margin;

			// To get second item's portion from whole screen
			// Formula : Screen Width - (Item Width + Item's Left margin)
			let remainingSecondItemVisiblePortion = R.screen().width - (itemWidth + marginLeft);

			// To get second item's x position
			// Formula : Screen Width - Second Item's width visible portion
			nextItemX = R.screen().width - remainingSecondItemVisiblePortion;

		} else {

			// Item's left margin, which will be smaller than first item
			let marginLeft = R.dimens.widgetMargin;

			// Item's right margin based on its current position, if its last item than it's margin will be greater than its previous margin
			let marginRight = R.dimens.widgetMargin;

			// To get next item's x position
			// Formula : Previous Item's X position + Item Width + Item's Left margin + Item's Right Margin
			nextItemX = this.state.secondItemX + itemWidth + marginLeft + marginRight;
		}

		// To scroll to nextItem X position
		this.scroll.scrollTo({ x: nextItemX, y: 0, animated: true });

		// To store next index and if last index than store 0 index, nextItem's X position
		this.setState({ index: isLastItem ? 0 : (index + 1), secondItemX: nextItemX });

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
		if (SocialProfileDashboard.oldProps !== props) {
			SocialProfileDashboard.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { topLeaderList, historicalPerformData, SocialProfileSubscriptionData } = props.SocailProfileDashboardResult;

			// SocialProfileSubscriptionData is not null 
			if (SocialProfileSubscriptionData) {
				try {
					if (state.SocialProfileSubscriptionData == null || (state.SocialProfileSubscriptionData != null && SocialProfileSubscriptionData !== state.SocialProfileSubscriptionData)) {
						// Response is validate or not and if not then alert is displayed on screen
						if (validateResponseNew({ response: SocialProfileSubscriptionData })) {
							let res = parseArray(SocialProfileSubscriptionData.SocialProfileList)
							return Object.assign({}, state, {
								SocialProfileResponse: res,
								SocialProfileSubscriptionData
							})
						} else {
							return Object.assign({}, state, {
								SocialProfileResponse: [],
								SocialProfileSubscriptionData: null
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						SocialProfileResponse: null,
						SocialProfileSubscriptionData: null
					})
				}
			}
			// topLeaderList is not null
			if (topLeaderList) {
				try {
					if (state.topLeaderList == null || (state.topLeaderList != null && topLeaderList !== state.topLeaderList)) {
						// Handle Response
						if (validateResponseNew({ response: topLeaderList, isList: true })) {
							return Object.assign({}, state, {
								topLeaderList,
								TopLeaderResponse: parseArray(topLeaderList.Response)
							})
						}
						else
							return Object.assign({}, state, { TopLeaderResponse: [], topLeaderList: null })
					}
				} catch (error) {
					return Object.assign({}, state, { TopLeaderResponse: [], topLeaderList: null })
					//logger('Error into Social Profile Dashboard', error.message)
				}
			}

			// historicalPerformData is not null
			if (historicalPerformData) {
				try {
					if (state.historicalPerformData == null || (state.historicalPerformData != null && historicalPerformData !== state.historicalPerformData)) {
						// Handle response
						if (validateResponseNew({ response: historicalPerformData, isList: true })) {

							let res = parseArray(historicalPerformData.Response)

							res.map((item, index) => {
								res[index].value = item.Year.toString()
							})

							return Object.assign({}, state, {
								HistoricalPerformance: res,
								HistoricalPerfomanceData: res[0].Data,
								historicalPerformData,
								selectedYear: res[0].value,
								displayYear: res
							})
						} else {
							return Object.assign({}, state, {
								HistoricalPerformance: [],
								HistoricalPerfomanceData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								historicalPerformData: null,
								selectedYear: R.strings.Year,
								displayYear: []
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						HistoricalPerformance: [],
						HistoricalPerfomanceData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						historicalPerformData: null,
						selectedYear: R.strings.Year,
						displayYear: []
					})
				}
			}
		}
		return null
	};

	render() {
		var conf = {
			chart: {
				type: 'column',
				zoomType: 'yx',
				backgroundColor: 'transparent',
			},
			credits: { enabled: false },
			title: {
				text: '',
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				labels: {
					style: {
						color: R.colors.textPrimary,
						fontSize: R.dimens.graphFontSize,
					}
				},
			},
			yAxis: {
				gridLineWidth: 0,
				title: {
					text: ''
				},
				labels: {
					style: {
						color: R.colors.textPrimary,
						fontSize: R.dimens.graphFontSize,
					}
				},
			},
			rangeSelector: {
				enabled: false,
				inputEnabled: false
			},
			scrollbar: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			series: [
				{
					name: 'Year',
					data: this.state.HistoricalPerfomanceData,
					// display label or text on chart
					dataLabels: {
						enabled: true,
						style: {
							fontSize: R.dimens.graphFontSize,
							color: R.colors.textPrimary
						}
					},
					color: R.colors.accent,
				},
			],
			plotOptions: {
				series: {
					boostThreshold: 500 // number of points in one series, when reaching this number, boost.js module will be used
				}
			},
		};
		const options = {
			global: {
				useUTC: false
			},
			lang: {
				decimalPoint: ',',
				thousandsSep: '.'
			}
		};
		// User subscribe leader/follwer or not
		let subScribe = this.isSubscribe(this.state.SocialProfileResponse)
		// Which plan subscribed by user
		let subScribePlanName = this.whichPlanSubscribe(this.state.SocialProfileResponse)
		// State variable
		let { TopLeaderResponse } = this.state
		// Loading variable for progressbar
		let { topLeaderLoading, historicalPerformLoading } = this.props.SocailProfileDashboardResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.SocialTrading}
					isBack={true}
					nav={this.props.navigation} />

				{/* Social Trading Intro Text */}
				<TextViewHML style={{ marginLeft: R.dimens.margin, marginRight: R.dimens.margin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.SocialTradingDesc}</TextViewHML>

				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={{ marginLeft: R.dimens.margin, marginRight: R.dimens.margin }}>

						{/* Profile Detail */}
						<View style={{ flexDirection: 'row', marginTop: R.dimens.margin_top_bottom }}>
							<Image style={this.styles().imageStyle} source={R.images.AVATAR_01} />

							<View style={{ flex: 1, marginLeft: R.dimens.margin, }}>
								{
									(this.state.FirstName !== null && this.state.LastName !== null) &&
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{this.state.FirstName.toUpperCase() + ' ' + this.state.LastName.toUpperCase()}</TextViewMR>
								}

								<TextViewHML style={{
									color: (this.state.FirstName !== null && this.state.LastName !== null) ? R.colors.textSecondary : R.colors.textPrimary,
									fontSize: (this.state.FirstName !== null && this.state.LastName !== null) ? R.dimens.smallestText : R.dimens.smallText
								}}>
									{this.state.UserName}</TextViewHML>

								{
									!subScribe ?
										<Button
											textStyle={{ fontSize: R.dimens.smallestText }}
											style={[this.styles().updateButtonStyle, { marginTop: R.dimens.margin, marginBottom: R.dimens.widgetMargin, alignSelf: 'flex-start' }]}
											title={subScribePlanName}
											isRound={true}
											onPress={() => this.onSubscribe()}
										/>
										:
										<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
											<TextViewMR style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontStyle: 'italic' }}>{subScribePlanName}</TextViewMR>
											<Button
												textStyle={{ fontSize: R.dimens.smallestText }}
												style={[this.styles().updateButtonStyle, { marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, }]}
												title={R.strings.update}
												isRound={true}
												onPress={() => this.onUpdatePlan()}
											/>
										</View>
								}
							</View>
						</View>
					</View>

					{/* Watch List and Follower List */}
					{this.state.Data.length > 0 ?
						<FlatList
							numColumns={2}
							data={this.state.Data}
							extraData={this.state}
							showsVerticalScrollIndicator={false}
							/* render all item in list */
							renderItem={({ item, index }) => {
								return (
									<CardViewItem
										index={index}
										size={this.state.Data.length}
										value={item.value}
										type={item.type}
										icon={item.icon}
										width={this.state.width}
										item={item}
										onChangeHeight={(height) => {
											if (height > this.state.viewHeight) {
												this.setState({ viewHeight: height })
											}
										}}
										viewHeight={this.state.viewHeight}
										onPress={() => { this.screenToRedirect(item.value) }} />
								)
							}}
							keyExtractor={(_item, index) => index.toString()}
						/>
						: null
					}

					{/* Horizontal ScrollView for Top Leader */}
					{
						(topLeaderLoading || historicalPerformLoading) ?
							<ListLoader style={{ marginTop: R.dimens.margin }} />
							:
							<View>
								<View style={{ marginLeft: R.dimens.margin, marginRight: R.dimens.margin }}>
									{/* Top Leader Header */}
									<View style={{ flexDirection: 'row', alignItems: 'center', }}>
										<Text style={this.styles().topLeaderText}>{R.strings.TopLeader}</Text>
										{
											TopLeaderResponse.length > 1 &&
											<ImageTextButton
												icon={R.images.RIGHT_ARROW_DOUBLE}
												iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
												style={{ margin: 0 }}
												onPress={() => this.onLeaderListNextPress()}
											/>
										}
									</View>
									<Separator color={R.colors.textSecondary} style={{ marginTop: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0, }} />
								</View>
								{
									TopLeaderResponse.length > 0 ?
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} ref={(node) => this.scroll = node}>
											{
												TopLeaderResponse.map((item, index) => {
													return <TopLeaderListItem
														item={item}
														key={index}
														index={index}
														size={this.state.TopLeaderResponse.length}
													/>
												})
											}
										</ScrollView>
										:
										<ListEmptyComponent style={{ marginTop: R.dimens.margin_left_right }} />
								}

								{/* for Line chart */}
								<CardView style={{
									borderTopLeftRadius: 0,
									borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
									borderBottomLeftRadius: R.dimens.LoginButtonBorderRadius,
									borderBottomRightRadius: 0,
									margin: R.dimens.margin,
									padding: 0,
									paddingLeft: R.dimens.margin,
									paddingRight: R.dimens.margin,
									paddingBottom: R.dimens.margin
								}}>
									{/* Historical Performance */}
									<View style={{ alignItems: 'center', flexDirection: 'row' }}>
										<TextViewMR style={this.styles().graphStyle}>{R.strings.HistoricalPerformance}</TextViewMR>
										{/* Picker for Year */}
										<Picker
											cardStyle={{ borderWidth: 0, marginBottom: 0, elevation: 0, borderRadius: 0, padding: 0, backgroundColor: 'transparent', }}
											renderItemTextStyle={{ fontSize: R.dimens.smallestText, color: R.colors.accent }}
											ref='spYear'
											data={this.state.displayYear}
											value={this.state.selectedYear ? this.state.selectedYear.toString() : ''}
											onPickerSelect={(item, object) => this.setState({ selectedYear: item, HistoricalPerfomanceData: object.Data })}
											displayArrow={true}
											arrowStyle={{ tintColor: R.colors.accent }}
											width={'50%'} />

									</View>

									<ChartView
										style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', }}
										config={conf}
										options={options}
										originWhitelist={['*']}
										javaScriptEnabled={true}
										domStorageEnabled={true} />
								</CardView>
							</View>
					}

					{/* Top Gainer / Loser Tab */}
					<CardView style={this.styles().cardViewStyle}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<TouchableWithoutFeedback
								onPress={() => this.onPressTopGainerLoser(true)}>
								<View style={{ marginRight: R.dimens.widgetMargin }}>
									<TextViewMR
										numberOfLines={1}
										ellipsizeMode={'tail'}
										style={{
											color: this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
											fontSize: R.dimens.smallText,
											paddingLeft: R.dimens.margin
										}}>{R.strings.topGainer}</TextViewMR>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback
								onPress={() => this.onPressTopGainerLoser(false)}>
								<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
									<TextViewMR
										numberOfLines={1}
										ellipsizeMode={'tail'}
										style={{
											color: !this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
											fontSize: R.dimens.smallText,
											paddingRight: R.dimens.margin
										}}>{R.strings.topLoser}</TextViewMR>
								</View>
							</TouchableWithoutFeedback>
						</View>
						{
							this.state.isGainer ?
								<SocialProfileTopGainerWidget navigation={this.props.navigation} isGainer={true} />
								:
								<SocialProfileTopLooserWidget navigation={this.props.navigation} isGainer={false} />
						}
					</CardView>

					<PortfolioList navigation={this.props.navigation} ScreenName={'SocialProfileDashboard'} />

				</ScrollView>
			</SafeView>
		)
	}

	styles = () => {
		return {
			topLeaderText: {
				flex: 1,
				color: R.colors.textPrimary,
				fontSize: R.dimens.smallText,
				fontFamily: Fonts.MontserratSemiBold,
			},
			cardStyle: {
				margin: R.dimens.CardViewElivation,
				paddingTop: R.dimens.widgetMargin,
				paddingBottom: R.dimens.widgetMargin,
				paddingLeft: R.dimens.margin,
				paddingRight: R.dimens.margin,
			},
			graphStyle: {
				color: R.colors.textPrimary,
				fontSize: R.dimens.mediumText,
				fontFamily: Fonts.MontserratSemiBold
			},
			cardViewStyle: {
				borderTopLeftRadius: 0,
				borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
				borderBottomLeftRadius: R.dimens.LoginButtonBorderRadius,
				borderBottomRightRadius: 0,
				margin: R.dimens.margin,
			},
			imageStyle: {
				height: R.dimens.profilePicWidthHeight,
				width: R.dimens.profilePicWidthHeight,
				alignItems: 'center',
				justifyContent: 'center',
				padding: R.dimens.WidgetPadding,
				borderRadius: R.dimens.profilePicBorderRadius / 2
			},
			updateButtonStyle: {
				height: R.dimens.titleIconHeightWidth,
				paddingLeft: R.dimens.margin,
				paddingRight: R.dimens.margin,
			}
		}
	}
}

export class CardViewItem extends Component {
	render() {
		//Get All Props Value 
		let { icon, value, index, size, type, cardStyle, width } = this.props
		let tintColor = R.colors.white
		let isLeft = (index % 2 == 0);
		let isRight = !isLeft;
		let isSizeEven = (size % 2 == 0)
		return (
			<AnimatableItem>
				<View style={{ width: width / 2, }}>
					<CardView
						cardBackground={type == 1 ? R.colors.cardBackground : R.colors.accent}
						style={{
							flex: 1,
							marginLeft: isLeft ? R.dimens.margin : R.dimens.widgetMargin,
							marginRight: isRight ? R.dimens.margin : R.dimens.widgetMargin,
							marginTop: (index == 0 || index == 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
							marginBottom: (index == size - 1 || (isSizeEven && index == size - 2)) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
							padding: R.dimens.widgetMargin,
							...cardStyle
						}}
						onPress={this.props.onPress}>
						<View
							style={[{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: R.dimens.CardViewElivation }, (this.props.viewHeight == 0 ? '' : { height: this.props.viewHeight })]}
							onLayout={({ nativeEvent: { layout: { height } } }) => {

								if (needScale) {
									if (largerHeight != height) {
										if (largerHeight == 0 || height > largerHeight) {
											largerHeight = height;
										} else {
											largerHeight = 0;
										}
									}

									if (index == size - 1) {
										needScale = false;
										this.props.onChangeHeight(largerHeight);
									}
								}
							}}>
							<ImageTextButton
								icon={icon}
								style={this.styles().imageButtonStyle}
								iconStyle={[this.styles(tintColor).imageButtonIcon, this.props.imageButtonStyle]}
								onPress={this.props.onPress} />
							<Text style={{ color: type == 1 ? R.colors.accent : R.colors.white, fontSize: R.dimens.smallText, textAlign: 'center', fontFamily: Fonts.MontserratSemiBold }}>{value}</Text>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
	styles = (tintColor) => {
		return {
			imageButtonStyle: {
				padding: R.dimens.widgetMargin,
				borderRadius: R.dimens.paginationButtonRadious,
				borderColor: R.colors.white,
				backgroundColor: R.colors.accent
			},
			imageButtonIcon: {
				width: R.dimens.listImageHeightWidth,
				height: R.dimens.listImageHeightWidth,
				tintColor: tintColor,
			}
		}
	}
}

// Item Design for TopLeader List
export class TopLeaderListItem extends Component {
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
		let { item, size, index } = this.props
		return (
			<AnimatableItem>
				<CardView style={{
					width: itemWidth,
					marginTop: R.dimens.margin,
					marginBottom: R.dimens.margin,
					marginLeft: R.dimens.margin,
					marginRight: index == size - 1 ? R.dimens.margin : R.dimens.widgetMargin,
					borderTopLeftRadius: 0,
					borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
					borderBottomLeftRadius: R.dimens.LoginButtonBorderRadius,
					borderBottomRightRadius: 0,
					padding: R.dimens.margin
				}}>
					<View style={{ paddingLeft: R.dimens.widgetMargin, }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ flex: 1, }}>
								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.LeaderName}</Text>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.UserDefaultVisible}</TextViewHML>
							</View>

							<ImageTextButton
								icon={R.images.IC_OUTLINE_USER}
								iconStyle={{ width: R.dimens.normalizePixels(25), height: R.dimens.normalizePixels(25), tintColor: R.colors.white }}
								style={{ padding: R.dimens.widgetMargin, borderRadius: R.dimens.paginationButtonRadious, backgroundColor: R.colors.accent, }} />
						</View>
						<View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, }}>
							<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.largeText, }}>{item.NoOfFollowers}</TextViewHML>
							<TextViewHML style={{
								color: R.colors.textPrimary,
								fontSize: R.dimens.smallestText,
								paddingLeft: R.dimens.firstCurrencyText,
								position: 'absolute',
								bottom: R.dimens.widgetMargin,
								alignSelf: 'flex-end',
							}}>{R.strings.Followers}</TextViewHML>
						</View>
					</View>
				</CardView>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	//updated for social Profile Actions
	return { SocailProfileDashboardResult: state.SocialProfileReducer, }
}

const mapDispatchToProps = (dispatch) => ({
	// Social Profile Plan Subscription
	getSocialProfileSubscription: () => dispatch(getSocialProfileSubscription()),
	// To get Top Leader List
	getTopLeaderList: () => dispatch(getSocialProfileTopLeaderList()),
	// To get historical performance chart
	getHistoricalPerfomance: (payload) => dispatch(getHistoricalPerformChart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SocialProfileDashboard);