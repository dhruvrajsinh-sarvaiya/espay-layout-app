import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import { validateValue } from '../../../validations/CommonValidation';
import ImageViewWidget from '../../widget/ImageViewWidget';
import CardView from '../../../native_theme/components/CardView';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';

export class DepositReportDetailScreen extends Component {

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

	//This Method Is used to open Address in Browser With Specific Link
	onTrnLinkPress = () => {
		try {
			let res = (this.state.item.hasOwnProperty('ExplorerLink')) ? JSON.parse(this.state.item.ExplorerLink) : '';
			Linking.openURL((res.length) ? res[0].Data + '/' + this.state.item.TrnId : this.state.item.TrnId);
		} catch (error) {
			// handle catch block here
		}
	}

	render() {
		let { item } = this.state

		// Change status color at runtime
		let color = R.colors.yellow
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 9)
			color = R.colors.failRed
		else if (item.Status == 0)
			color = R.colors.accent
		return (
			<LinearGradient style={{ flex: 1,  }}
				locations={[0, 1]}
				start={{ x: 0,  y: 0 }} end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>
				
				<SafeView style={{ flex: 1 }}>
					{/* To set status bar as per Our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar backIconStyle={{ tintColor: 'white' }}
						title={R.strings.deposit_report}
						toolbarColor={'transparent'}
						textStyle={{ color: 'white' }}
						isBack={true} nav={this.props.navigation} />

					<ScrollView contentContainerStyle={{ flexGrow: 1, }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
						{/* Transaction No Merged With Toolbar using below design */}
						<View style={{
							 marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
							<TextViewMR style={{
								fontSize: R.dimens.smallText,
								textAlign: 'left',
								color: R.colors.white,
							}}>{R.strings.Amount}</TextViewMR>
							<Text style={{
								fontSize: R.dimens.mediumText,
								textAlign: 'left',
								fontWeight: 'bold',
								color: R.colors.white,
								fontFamily: Fonts.MontserratSemiBold,
							}}>{(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}</Text>
						</View>

						{/* Card for rest details to display item */}
						<CardView style={{ padding: 0,
							margin: R.dimens.margin_top_bottom,backgroundColor: R.colors.cardBackground,
						}} cardRadius={R.dimens.detailCardRadius}>

							<View style={{ flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin, }}>
								{/* Holding Currency with Icon and UserName */}
								<View style={{ justifyContent: 'center' }}>
									<View style={{
										height: R.dimens.signup_screen_logo_height,
										backgroundColor: 'transparent',
										width: R.dimens.signup_screen_logo_height,
										borderRadius: R.dimens.paginationButtonRadious,
									}}>
										<ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
									</View>
								</View>

								<View style={{ flex: 1, marginLeft: R.dimens.margin }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.CoinName.toUpperCase())}</Text>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{validateValue(item.UserName)}</TextViewMR>
								</View>
							</View>

							{/* Organization Name, Transaction No and Status */}
							<RowItem title={R.strings.Organization} value={validateValue(item.OrganizationName)} />
							<RowItem title={R.strings.Trn_No} value={validateValue(item.TrnNo)} />
							<RowItem title={R.strings.Status} value={validateValue(item.StatusStr)} color={color} status={true} />

							{/* Transaction Id */}
							<View style={{
								marginTop: R.dimens.widgetMargin,
								marginBottom: R.dimens.widget_top_bottom_margin,
								paddingLeft: R.dimens.padding_left_right_margin,
								paddingRight: R.dimens.padding_left_right_margin,
							}}>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
									{R.strings.transactionId}
								</TextViewHML>
								{
									(item.TrnId && item.ExplorerLink) ?
										<TouchableOpacity onPress={() => this.onTrnLinkPress()}>
											<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.accent }}>{validateValue(item.TrnId)}</TextViewHML>
										</TouchableOpacity> :
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{validateValue(item.TrnId)}</TextViewHML>
								}
							</View>

							{/* Address */}
							<View style={{
								marginTop: R.dimens.widgetMargin,
								marginBottom: R.dimens.widget_top_bottom_margin,
								paddingLeft: R.dimens.padding_left_right_margin,
								paddingRight: R.dimens.padding_left_right_margin,
							}}>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
									{R.strings.Address}
								</TextViewHML>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
									{validateValue(item.Address)}
								</TextViewHML>
							</View>
							{/* Date */}
							<View style={{ flex: 1, 
								flexDirection: 'row',
								justifyContent: 'flex-end', marginRight: R.dimens.margin, marginBottom: R.dimens.margin }}>
								<TextViewHML style={{ alignSelf: 'center',
								 color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss A', false)}</TextViewHML>
							</View>
						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default DepositReportDetailScreen
