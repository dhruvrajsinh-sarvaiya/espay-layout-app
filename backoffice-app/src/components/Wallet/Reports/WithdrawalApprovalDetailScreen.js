import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import { validateValue } from '../../../validations/CommonValidation';
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';

export class WithdrawalApprovalDetailScreen extends Component {
	constructor(props) {
		super(props);

		//fill all the data from previous screen
		this.state = {
			item: props.navigation.state.params && props.navigation.state.params.item,
		};
	}

	componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	render() {
		let { item } = this.state

		// Change status color at runtime
		let color = R.colors.accent
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 9)
			color = R.colors.failRed
		return (
			<LinearGradient style={{ flex: 1, }}
				locations={[0, 1]}
				start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						backIconStyle={{ tintColor: 'white' }} toolbarColor={'transparent'}
						textStyle={{ color: 'white' }} title={R.strings.withdrawalApproval}
						isBack={true}
						nav={this.props.navigation} />

					<ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

						{/* Transaction No Merged With Toolbar using below design */}
						<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
							<TextViewMR style={{
								color: R.colors.white,
								fontSize: R.dimens.smallText,
								textAlign: 'left',
							}}>{R.strings.transactionNo}</TextViewMR>
							<Text style={{
								fontSize: R.dimens.mediumText,
								color: R.colors.white,
								textAlign: 'left',
								fontWeight: 'bold',
								fontFamily: Fonts.MontserratSemiBold,
							}}>{validateValue(item.TrnNo)}</Text>
						</View>

						{/* Card for rest details to display item */}
						<CardView style={{
							margin: R.dimens.margin_top_bottom,
							backgroundColor: R.colors.cardBackground,padding: 0,
						}} cardRadius={R.dimens.detailCardRadius}>

							<View style={{ flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin, }}>
								{/* Holding Currency with Icon and UserName */}
								<View style={{ justifyContent: 'center' }}>
									<View style={{
										width: R.dimens.signup_screen_logo_height,backgroundColor: 'transparent',
										borderRadius: R.dimens.paginationButtonRadious,
										height: R.dimens.signup_screen_logo_height,
									}}>
										<ImageViewWidget url={item.Currency ? item.Currency : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
									</View>
								</View>

								<View style={{ flex: 1, marginLeft: R.dimens.margin }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.Currency.toUpperCase())}</Text>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{validateValue(item.ActionByUserName)}</TextViewMR>
								</View>
							</View>

							{/* Amount, UserId, Status and Transaction Date */}
							<RowItem title={R.strings.Amount} value={validateValue(item.Amount)} />
							<RowItem title={R.strings.userId} value={validateValue(item.ActionByUserId)} />
							<RowItem title={R.strings.Status} value={validateValue(item.StrStatus)} status={true} color={color} />
							<RowItem title={R.strings.Trn_Date} value={validateValue(convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss A', false))} />

							{/* Remarks */}
							<View style={{
								marginBottom: R.dimens.widget_top_bottom_margin,
								paddingLeft: R.dimens.padding_left_right_margin,
								paddingRight: R.dimens.padding_left_right_margin,
								marginTop: R.dimens.widgetMargin,
							}}>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
									{R.strings.remarks}
								</TextViewHML>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
									{validateValue(item.Remarks)}
								</TextViewHML>
							</View>

							{/* Date */}
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: R.dimens.margin, marginBottom: R.dimens.margin }}>
								<TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.ActionDate, 'YYYY-MM-DD HH:mm:ss A', false)}</TextViewHML>
							</View>

						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default WithdrawalApprovalDetailScreen