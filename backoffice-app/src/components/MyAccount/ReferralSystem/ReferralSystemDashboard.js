// ReferralSystemDashboard
import React, { Component } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import ChartView from 'react-native-highcharts';
import { getReferalSystemDashData } from '../../../actions/account/ReferralSystemAction';
import CustomCard from '../../widget/CustomCard';
import DashboardHeader from '../../widget/DashboardHeader';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import SafeView from '../../../native_theme/components/SafeView';

const { width } = R.screen();

class ReferralSystemDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for show initial value in pie chart
			emailInvite: 0,
			smsInvite: 0,
			facebookShare: 0,
			twitterShare: 0,
			linkedinShare: 0,
			gplusShare: 0,
			instagramShare: 0,
			pinterestShare: 0,
			telegramShare: 0,
			// ---------------------
			viewHeight: 0,
			isGrid: true,
			// for set initial value to '-'
			data: [
				{ id: '1', title: '-', value: R.strings.participant, icon: R.images.IC_ACCOUNT, type: 1 },
				{ id: '2', title: '-', value: R.strings.invites, icon: R.images.IC_SHARE, type: 1 },
				{ id: '3', title: '-', value: R.strings.clicks, icon: R.images.IC_CLICK, type: 1 },
				{ id: '4', title: '-', value: R.strings.converts, icon: R.images.IC_SHOPPINGCART, type: 1 },
				{ id: '5', title: '-', value: R.strings.emailInvite, icon: R.images.IC_EMAIL_FILLED, type: 1 },
				{ id: '6', title: '-', value: R.strings.smsInvite, icon: R.images.IC_SMS_LOGO, type: 1 },
				{ id: '7', title: '-', value: R.strings.facebookShare, icon: R.images.IC_FACEBOOK_LOGO, type: 1 },
				{ id: '8', title: '-', value: R.strings.twitterShare, icon: R.images.IC_TWITTER, type: 1 },
				{ id: '9', title: '-', value: R.strings.linkedinShare, icon: R.images.IC_LINKEDIN_LOGO, type: 1 },
				{ id: '10', title: '-', value: R.strings.googlePlusShare, icon: R.images.IC_GPLUS_LOGO, type: 1 },
				{ id: '11', title: '-', value: R.strings.instagramShare, icon: R.images.IC_INSTAGRAM_LOGO, type: 1 },
				{ id: '12', title: '-', value: R.strings.pinterest, icon: R.images.IC_PINTEREST_LOGO, type: 1 },
				{ id: '13', title: '-', value: R.strings.telegram, icon: R.images.IC_TELEGRAM_LOGO, type: 1 },
				{ id: '14', title: null, value: R.strings.rewardConfiguration, icon: R.images.IC_SETTINGS_OUTLINE, type: 1 },
				{ id: '15', title: null, value: R.strings.referralPayType, icon: R.images.IC_CARDTYPE, type: 1 },
				{ id: '16', title: null, value: R.strings.referralChannelType, icon: R.images.IC_PIN, type: 1 },
				{ id: '17', title: null, value: R.strings.referralServiceType, icon: R.images.IC_PIN, type: 1 },
			],
			isFirstTime: true,
			// --------------------------
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		//stop twice api call
		return isCurrentScreen(nextProps);
	};

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (await isInternet()) {
			//  call api for referral Data fetch
			this.props.getReferalSystemDashData()
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
		if (ReferralSystemDashboard.oldProps !== props) {
			ReferralSystemDashboard.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			const { referalData } = props;
			if (referalData) {
				try {
					if (state.referalData == null || (state.referalData != null && referalData !== state.referalData)) {

						if (validateResponseNew({ response: referalData, isList: true })) {
							//Get array from response
							var res = parseArray(referalData.ReferralChannelAdminCount);
							var oldData = state.data

							oldData[0].title = res[0].TotalParticipants.toString()
							oldData[1].title = res[0].Invite.toString()
							oldData[2].title = res[0].Clicks.toString()
							oldData[3].title = res[0].Converts.toString()
							oldData[4].title = res[0].EmailInvite.toString()
							oldData[5].title = res[0].SMSInvite.toString()
							oldData[6].title = res[0].FacebookShare.toString()
							oldData[7].title = res[0].TwitterShare.toString()
							oldData[8].title = res[0].LinkedIn.toString()
							oldData[9].title = res[0].GoogleShare.toString()
							oldData[10].title = res[0].InstaShare.toString()
							oldData[11].title = res[0].Pinterest.toString()
							oldData[12].title = res[0].Telegram.toString()

							//Set State For Api response 
							return Object.assign({}, state, {
								data: oldData,
								emailInvite: res[0].EmailInvite,
								smsInvite: res[0].SMSInvite,
								facebookShare: res[0].FacebookShare,
								twitterShare: res[0].TwitterShare,
								linkedinShare: res[0].LinkedIn,
								gplusShare: res[0].GoogleShare,
								instagramShare: res[0].InstaShare,
								pinterestShare: res[0].Pinterest,
								telegramShare: res[0].Telegram,
								referalData,
							})
						}
						else {
							return Object.assign({}, state, {
								data: state.data,
								emailInvite: 0,
								smsInvite: 0,
								facebookShare: 0,
								twitterShare: 0,
								linkedinShare: 0,
								gplusShare: 0,
								instagramShare: 0,
								pinterestShare: 0,
								telegramShare: 0,
								referalData: null,
							})
						}
					}
				} catch (e) {
					return Object.assign({}, state, {
						data: state.data,
						emailInvite: 0,
						smsInvite: 0,
						facebookShare: 0,
						twitterShare: 0,
						linkedinShare: 0,
						gplusShare: 0,
						instagramShare: 0,
						pinterestShare: 0,
						telegramShare: 0,
						referalData: null,
					})
				}
			}
		}
		return null
	}

	// for redirect to selected screen 
	screenToRedirect = (value) => {
		if (value === R.strings.emailInvite) {
			this.props.navigation.navigate('SMSAndEmailInviteScreen', { ReferralChannelTypeId: 1 })
		}
		if (value === R.strings.smsInvite) {
			this.props.navigation.navigate('SMSAndEmailInviteScreen', { ReferralChannelTypeId: 2 })
		}
		if (value === R.strings.facebookShare) {
			this.props.navigation.navigate('SocialMediaShareScreen', { ReferralChannelTypeId: 3 })
		}
		if (value === R.strings.twitterShare) {
			this.props.navigation.navigate('SocialMediaShareScreen', { ReferralChannelTypeId: 4 })
		}
		if (value === R.strings.linkedinShare) {
			this.props.navigation.navigate('SocialMediaShareScreen', { ReferralChannelTypeId: 5 })
		}
		if (value === R.strings.googlePlusShare) {
			this.props.navigation.navigate('SocialMediaShareScreen', { ReferralChannelTypeId: 6 })
		}
		if (value === R.strings.instagramShare) {
			this.props.navigation.navigate('SocialMediaShareScreen', { ReferralChannelTypeId: 7 })
		}
		if (value === R.strings.pinterest) {
			this.props.navigation.navigate('SocialMediaShareScreen', { ReferralChannelTypeId: 8 })
		}
		if (value === R.strings.telegram) {
			this.props.navigation.navigate('SocialMediaShareScreen', { ReferralChannelTypeId: 9 })
		}
		if (value === R.strings.rewardConfiguration) {
			this.props.navigation.navigate('RewardConfigurationDash')
		}
		if (value === R.strings.referralPayType) {
			this.props.navigation.navigate('CommonDashboard', {
				response: [
					{ title: R.strings.referralPayType, icon: R.images.ic_list_alt, id: 0, navigate: 'ReferralPayTypeScreen' },
					{ title: R.strings.add_referral_pay_type, icon: R.images.IC_PLUS, id: 1, navigate: 'ReferralPayTypeAddScreen' },
				],
				title: R.strings.referralPaytypeDashboard
			})
		}
		
		if (value === R.strings.referralChannelType) {
			this.props.navigation.navigate('CommonDashboard', {
				response: [
					{ title: R.strings.listReferralChanelType, icon: R.images.ic_list_alt, id: 0, navigate: 'ReferralChannelTypeScreen' },
					{ title: R.strings.add_referral_channel_type, icon: R.images.IC_PLUS, id: 1, navigate: 'ReferralChannelTypeAddScreen' },
				],
				title: R.strings.referralChannelType
			})
		}

		if (value === R.strings.referralServiceType) {
			this.props.navigation.navigate('CommonDashboard', {
				response: [
					{ title: R.strings.listReferralServiceType, icon: R.images.ic_list_alt, id: 0, navigate: 'ReferralServiceTypeScreen' },
					{ title: R.strings.add_referral_service_type, icon: R.images.IC_PLUS, id: 1, navigate: 'ReferralServiceTypeAddScreen' },
				],
				title: R.strings.referralServiceType
			})
		}

		if (value === R.strings.invites) {
			this.props.navigation.navigate('ReferralInvitesScreen')
		}
		if (value === R.strings.participant) {
			this.props.navigation.navigate('ReferralParticipantScreen')
		}
		if (value === R.strings.clicks) {
			this.props.navigation.navigate('ReferralClickOnReportScreen')
		}
		if (value === R.strings.converts) {
			this.props.navigation.navigate('ConvetsListScreen')
		}
	}

	render() {
		const { loading } = this.props;
		var pia_conf = {
			chart: {
				backgroundColor: 'transparent',
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			credits: { enabled: false },
			exporting: {
				enabled: false
			},
			title: {
				text: '',
			},
			legend: {
				symbolPadding: R.dimens.widgetMargin,
				itemStyle: {
					color: R.colors.textPrimary,
					fontWeight: 'bold',
					fontFamily: Fonts.HindmaduraiRegular,
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false,
						style: {
							color: R.colors.failRed
						}
					},
					showInLegend: true,
				}
			},

			series: [{
				name: "percentage",
				colorByPoint: true,
				data: [
					{
						name: R.strings.emailInvite,
						y: this.state.emailInvite,
						// sliced: true,
						// selected: true
					},
					{
						name: R.strings.smsInvite,
						y: this.state.smsInvite,
					},
					{
						name: R.strings.facebookShare,
						y: this.state.facebookShare,
					},
					{
						name: R.strings.twitterShare,
						y: this.state.twitterShare,
					},
					{
						name: R.strings.linkedinShare,
						y: this.state.linkedinShare,
						style: {
							color: R.colors.failRed
						}
					},
					{
						name: R.strings.googlePlusShare,
						y: this.state.gplusShare,
					},
					{
						name: R.strings.instagramShare,
						y: this.state.instagramShare,
					},
					{
						name: R.strings.pinterest,
						y: this.state.pinterestShare,
					},
					{
						name: R.strings.telegram,
						y: this.state.telegramShare,
					}
				]
			}]


		};
		const pia_options = {
			global: {
				useUTC: false
			},
			lang: {
				decimalPoint: ',',
				thousandsSep: '.'
			}
		};

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
				{/* statusbar and actionbar  */}
				<CommonStatusBar />

				<CustomToolbar
					isBack={true}
					nav={this.props.navigation} />

				{/* Progress Dialog*/}
				<ProgressDialog isShow={loading} />

				<View style={{ flex: 1, }}>

					{/* for header name and icon */}
					<DashboardHeader
						navigation={this.props.navigation}
						header={R.strings.referralSystem}
						isGrid={this.state.isGrid}
						onPress={() => this.setState({ isGrid: !this.state.isGrid })}
					/>

					<ScrollView showsVerticalScrollIndicator={false}>
						{/* for display Headers for list  */}
						<View style={{ flex: 1, }}>

							{this.state.data.length > 0 ?
								<FlatList
									key={this.state.isGrid ? 'Grid' : 'List'}
									numColumns={this.state.isGrid ? 2 : 1}
									data={this.state.data}
									showsVerticalScrollIndicator={false}
									extraData={this.state}
									/* render all item in list */
									renderItem={({ item, index }) => {
										return (
											<CustomCard
												isGrid={this.state.isGrid}
												index={index}
												size={this.state.data.length}
												title={item.title}
												value={item.value}
												type={item.type}
												icon={item.icon}
												width={width}
												onChangeHeight={(height) => {
													if (height > this.state.viewHeight) {
														this.setState({ viewHeight: height })
													}
												}}
												viewHeight={this.state.viewHeight}
												onPress={() => this.screenToRedirect(item.value)} />

										)
									}}
									keyExtractor={(item, index) => index.toString()}
								/>
								: null}

						</View>

						{/* Card for rest details to display item for Pie chart */}
						<CardView style={this.styles().cardViewStyle}>

							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<TextViewMR style={this.styles().graphStyle}>{R.strings.referralInvitesStatistics}</TextViewMR>
							</View>

							<ChartView
								style={{ height: R.dimens.highChartHeight, backgroundColor: 'transparent', }}
								config={pia_conf}
								options={pia_options} />
						</CardView>
					</ScrollView>
				</View>
			</SafeView>
		)
	}

	styles = () => {
		return {
			cardViewStyle: {
				borderTopLeftRadius: 0,
				borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
				borderBottomLeftRadius: R.dimens.LoginButtonBorderRadius,
				borderBottomRightRadius: 0,
				marginLeft: R.dimens.margin,
				marginRight: R.dimens.margin,
				marginBottom: R.dimens.margin,
			},
			graphStyle: {
				color: R.colors.textPrimary,
				fontSize: R.dimens.mediumText,
				fontFamily: Fonts.MontserratSemiBold
			},
		}
	}
}

function mapStateToProps(state) {
	return {
		// get data from Referral reducer 
		loading: state.ReferralSystemReducer.loading,
		referalData: state.ReferralSystemReducer.referalData,
		isReferalDataFetch: state.ReferralSystemReducer.isReferalDataFetch,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// call action for Referral data
		getReferalSystemDashData: () => dispatch(getReferalSystemDashData()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralSystemDashboard)