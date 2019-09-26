import React, { Component } from 'react'
import { Text, View, FlatList, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { validateValue } from '../../../validations/CommonValidation';
import { Fonts } from '../../../controllers/Constants';
import { parseFloatVal, convertDateTime, changeTheme } from '../../../controllers/CommonUtils';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import Separator from '../../../native_theme/components/Separator';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { isCurrentScreen } from '../../Navigation';

export class OpenPositionReportDetailScreen extends Component {
	constructor(props) {
		super(props)

		// get params from previous screen
		let { item } = this.props.navigation.state.params

		// define initial state
		this.state = {
			OpenPositionDetailList: item.DetailedData,
			OpenPositionList: item,
			searchInput: '',
		}
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	render() {

		let resItem = this.state.OpenPositionList

		// For searching
		let finalItems = this.state.OpenPositionDetailList.filter(item => (
			item.PairName.replace('_', '/').toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.OrderType.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
			item.BidPrice.toString().includes(this.state.searchInput) ||
			item.LandingPrice.toString().includes(this.state.searchInput) ||
			item.Qty.toString().includes(this.state.searchInput) ||
			item.TrnNo.toString().includes(this.state.searchInput)
		))

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					nav={this.props.navigation}
					title={R.strings.openPositionReport}
					searchable={true}
					onSearchText={(text) => this.setState({ searchInput: text })} />

				<ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
					<View style={{
						marginTop: R.dimens.widgetMargin,
						marginBottom: R.dimens.widgetMargin,
						marginLeft: R.dimens.widget_left_right_margin,
						marginRight: R.dimens.widget_left_right_margin,
					}}>
						<CardView style={{
							borderRadius: 0,
							elevation: R.dimens.listCardElevation,
							borderBottomLeftRadius: R.dimens.margin,
							borderTopRightRadius: R.dimens.margin,
						}}>

							{/* Holding Currency Pair with Second Currency Icon and UserName */}
							<View style={{ flexDirection: 'row', margin: R.dimens.widgetMargin, }}>
								<View style={{ justifyContent: 'center' }}>
									<View style={{
										width: R.dimens.signup_screen_logo_height,
										height: R.dimens.signup_screen_logo_height,
										backgroundColor: 'transparent',
										borderRadius: R.dimens.paginationButtonRadious,
									}}>
										<ImageViewWidget url={resItem.PairName ? resItem.PairName.split('_')[0] : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
									</View>
								</View>

								<View style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, flexDirection: 'column' }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(resItem.PairName.replace('_', '/').toUpperCase())}</Text>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{validateValue(resItem.UserName)}</TextViewMR>
								</View>
							</View>

							{/* Header of UserId and their value */}
							<View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
								<TextViewHML style={[this.styles().text_style]}>{R.strings.userId}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'right' }}>
									{resItem.UserID}
								</TextViewHML>
							</View>

							{/* Separator */}
							<Separator
								style={{
									marginLeft: R.dimens.widget_left_right_margin,
									marginRight: R.dimens.widget_left_right_margin,
									marginTop: R.dimens.widget_top_bottom_margin,
									marginBottom: R.dimens.widget_top_bottom_margin,
									backgroundColor: R.colors.background,
									height: R.dimens.blockchain_textbox_border
								}} />

							{/* Transaction Date */}
							<View style={{ flexDirection: 'row', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
								<TextViewHML style={[this.styles().text_style]}>{R.strings.txnDate}</TextViewHML>
								<TextViewHML style={{
									color: R.colors.textSecondary,
									fontSize: R.dimens.smallestText,
									textAlign: 'right',
								}}>{convertDateTime(resItem.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</CardView>
					</View>

					<TextViewMR style={{
						fontSize: R.dimens.mediumText,
						color: R.colors.textPrimary,
						margin: R.dimens.margin,
						marginBottom: R.dimens.widgetMargin,

					}}>{R.strings.Details}</TextViewMR>

					<FlatList
						data={finalItems}
						showsVerticalScrollIndicator={false}
						// render all item in list
						renderItem={({ item, index }) => <OpenPositionReportDetailItem
							index={index}
							item={item}
							size={finalItems.length}
						/>
						}
						// assign index as key valye to Withdrawal list item
						keyExtractor={(_item, index) => index.toString()}
						contentContainerStyle={contentContainerStyle(finalItems)}
						// Displayed Empty Component when no record found 
						ListEmptyComponent={<ListEmptyComponent />}
					/>
				</ScrollView>

			</SafeView>
		)
	}

	styles = () => {
		return {
			text_style: {
				flex: 1,
				color: R.colors.textSecondary,
				fontSize: R.dimens.volumeText,
			},
		}
	}
}

// This Class is used for display record in list
class OpenPositionReportDetailItem extends Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item === nextProps.item) { return false }
		return true
	}

	render() {
		let { size, index, item, } = this.props
		return (
			// for flatlist item animation
			<AnimatableItem>
				<View style={{
					marginRight: R.dimens.widget_left_right_margin,
					marginLeft: R.dimens.widget_left_right_margin,
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
				}}>
					<CardView style={{
						flex: 1,
						borderRadius: 0, elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}}>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							{/* Currency Image */}
							<ImageViewWidget url={item.PairName ? item.PairName.split('_')[0] : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

							<View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
								{/* Pair Name and Right Arrow icon for Detail Screen */}
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.PairName.replace('_', '/'))} </Text>
									<Text style={{ flex: 1, color: item.OrderType === 'Buy' ? R.colors.successGreen : R.colors.failRed, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}> - {validateValue(item.OrderType)} </Text>
								</View>
							</View>
						</View>

						{/* for show Amount, charge and leverage amount */}
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

							<View style={{ width: '30%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Qty}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
									{(item.Qty.toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Qty).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ width: '40%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.bidPrice}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.BidPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.BidPrice).toFixed(8)) : '-')}
								</TextViewHML>
							</View>

							<View style={{ width: '30%', alignItems: 'center', }}>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.landingPrice}</TextViewHML>
								<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
									{(parseFloatVal(item.LandingPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.LandingPrice).toFixed(8)) : '-')}
								</TextViewHML>
							</View>
						</View>

						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<View style={{ flexDirection: 'row', }}>
								<Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
									{R.strings.Trn_No + ': '}
								</Text>

								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
									{(parseFloatVal(item.TrnNo) !== 'NaN' ? validateValue(parseFloatVal(item.TrnNo)) : '-')}
								</Text>
							</View>

							{/* Trn No and Trn Date */}
							<View style={{
								flex: 1, justifyContent: 'flex-end',
								flexDirection: 'row',
							}}>
								<ImageTextButton style={{
									paddingRight: R.dimens.LineHeight, margin: 0,
								}}
									icon={R.images.IC_TIMER}
									iconStyle={{
										height: R.dimens.smallestText,
										width: R.dimens.smallestText,
										tintColor: R.colors.textSecondary
									}}
								/>
								<TextViewHML style={{
									alignSelf: 'center',
									color: R.colors.textSecondary, fontSize: R.dimens.smallestText,
								}}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
							</View>
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

export default OpenPositionReportDetailScreen
