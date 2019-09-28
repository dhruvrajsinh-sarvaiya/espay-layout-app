import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseIntVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import Separator from '../../../native_theme/components/Separator';
import RowItem from '../../../native_theme/components/RowItem';
import { validateValue } from '../../../validations/CommonValidation';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';

export class ApiPlanConfigDetailScreen extends Component {
	constructor(props) {
		super(props);

		let item = props.navigation.state.params && props.navigation.state.params.item

		// Define all initial state
		this.state = {
			tabsName: [R.strings.Info, R.strings.apiMethods],
			item: item,
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	// Get Plan validity
	getPlanValidity = (planValidityType) => {
		let validity = ''
		if (planValidityType == 1)
			validity = R.strings.day
		else if (planValidityType == 2)
			validity = R.strings.month
		else if (planValidityType == 3)
			validity = R.strings.Year
		return validity
	}
	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()
	}
	render() {

		// get plan validity in day/month/
		let { item } = this.state

		let planValidity = this.getPlanValidity(item.PlanValidityType)

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.planDetail}
					nav={this.props.navigation}
				/>

				<IndicatorViewPager
					isGradient={true}
					titles={this.state.tabsName}
					numOfItems={2}
					style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin }}>

					{/* Info Tab */}
					<View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{ flex: 1, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, }}>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center', justifyContent: 'space-between'
								}}>
									<TextViewMR style={{
										color: R.colors.textPrimary, fontSize: R.dimens.mediumText,
									}}>{item.PlanName}</TextViewMR>
									<TextViewHML style={{
										color: item.Status == 1
											? R.colors.successGreen :
											R.colors.failRed, fontSize: R.dimens.smallText,
									}}>{item.Status == 1 ? R.strings.active : R.strings.inActive}</TextViewHML>
								</View>

								{/* Price and PlanValidity */}
								<View style={{
									alignItems: 'center', flexDirection: 'row',
									marginTop: R.dimens.margin,
								}}>
									<TextViewMR style={{
										fontSize: R.dimens.mediumText,
										color: R.colors.textPrimary,
									}}>{parseIntVal(item.Price)}</TextViewMR>
									<TextViewMR style={{
										marginLeft: R.dimens.widgetMargin,
										color: R.colors.textSecondary, fontSize: R.dimens.mediumText,
									}}>USD</TextViewMR>
									<TextViewHML style={{ color: R.colors.textSecondary, marginLeft: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
								</View>

								{/* Plan Description */}
								<View style={{ marginTop: R.dimens.margin, }}>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.PlanDesc ? item.PlanDesc : ''}</TextViewHML>
								</View>

								<Separator style={{ marginTop: R.dimens.margin, marginLeft: 0, marginRight: 0, }} />

								<ScrollView showsVerticalScrollIndicator={false}>
									<View style={{ marginTop: R.dimens.margin }}>
										<RowItem title={R.strings.Charge} value={validateValue(item.Charge)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.maxOrderPerSec} value={validateValue(item.MaxOrderPerSec)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.maxPerMin} value={validateValue(item.MaxPerMinute)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.maxPerDay} value={validateValue(item.MaxPerDay)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.maxPerMonth} value={validateValue(item.MaxPerMonth)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.maxRequestSize} value={validateValue(item.MaxReqSize)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.maxResponseSize} value={validateValue(item.MaxResSize)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.maxRecPerRequest} value={validateValue(item.MaxRecPerRequest)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.priority} value={validateValue(item.Priority)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.concurrenctEndPoint} value={validateValue(item.ConcurrentEndPoints)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.whitelistEndPoint} value={validateValue(item.Whitelistendpoints)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.historicalData} value={validateValue(item.HistoricalDataMonth)} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.createdDate} value={validateValue(item.CreatedDate ? convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false) : '')} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
										<RowItem title={R.strings.updatedDate} value={validateValue(item.UpdatedDate ? convertDateTime(item.UpdatedDate, 'YYYY-MM-DD HH:mm:ss', false) : '')} style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0 }} />
									</View>
								</ScrollView>
							</View>
						</ScrollView>
					</View>

					{/* API Method Tab */}
					<View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{
								flex: 1,
								paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin,
							}}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{item.PlanName}</TextViewMR>
									<TextViewHML style={{ color: item.Status == 1 ? R.colors.successGreen : R.colors.failRed, fontSize: R.dimens.smallText, }}>{item.Status == 1 ? R.strings.active : R.strings.inActive}</TextViewHML>
								</View>

								{/* Price and PlanValidity */}
								<View style={{ alignItems: 'center', flexDirection: 'row', marginTop: R.dimens.margin, }}>
									<TextViewMR style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, }}>{parseIntVal(item.Price)}</TextViewMR>
									<TextViewMR style={{ color: R.colors.textSecondary, marginLeft: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, }}>USD</TextViewMR>
									<TextViewHML style={{ color: R.colors.textSecondary, marginLeft: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
								</View>

								{
									(item.ReadOnlyAPI != null && Object.values(item.ReadOnlyAPI).length > 0 || item.FullAccessAPI != null && Object.values(item.FullAccessAPI).length > 0) ?
										<View style={{ flex: 1 }}>
											<ScrollView showsVerticalScrollIndicator={false}>

												{/* Read Only Method List Title */}
												{
													item.ReadOnlyAPI != null && Object.values(item.ReadOnlyAPI).length > 0 &&
													<View style={{ marginTop: R.dimens.margin, }}>
														<Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.readOnly}</Text>
														<Separator style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />
													</View>
												}

												{/* Read Only Method List Detail */}
												<View>
													{
														item.ReadOnlyAPI != null && Object.values(item.ReadOnlyAPI).map((itemReadOnly, index) =>
															<View style={{ flexDirection: 'row' }} key={index.toString()}>
																<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{itemReadOnly}</TextViewHML>
																<ImageTextButton
																	style={{ margin: 0, }}
																	icon={R.images.IC_CHECK_CIRCLE}
																	iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.successGreen }}
																/>
															</View>
														)
													}
												</View>

												{/* Full Access Method List Title */}
												{
													item.FullAccessAPI != null && Object.values(item.FullAccessAPI).length > 0 &&
													<View style={{ marginTop: R.dimens.margin_top_bottom, }}>
														<Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.fullAccess}</Text>
														<Separator style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />
													</View>
												}

												{/* Full Access Method List Title */}
												<View>
													{
														item.FullAccessAPI != null && Object.values(item.FullAccessAPI).map((itemFullAccess, index) =>
															<View style={{ flexDirection: 'row' }} key={index.toString()}>
																<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{itemFullAccess}</TextViewHML>
																<ImageTextButton
																	style={{ margin: 0, }}
																	icon={R.images.IC_CHECK_CIRCLE}
																	iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.successGreen }}
																/>
															</View>
														)
													}
												</View>
											</ScrollView>
										</View>
										:
										// Displayed empty component when no record found 
										<ListEmptyComponent message={R.strings.noApiMethodRequested} />
								}
							</View>
						</ScrollView>
					</View>
				</IndicatorViewPager>
			</SafeView>
		)
	}
}

export default ApiPlanConfigDetailScreen
