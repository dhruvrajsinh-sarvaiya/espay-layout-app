import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { validateValue, isEmpty } from '../../../validations/CommonValidation';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import RowItem from '../../../native_theme/components/RowItem';

export class ChargesCollectedDetailScreen extends Component {
	constructor(props) {
		super(props);

		//fill all the data from previous screen
		this.state = {
			item: props.navigation.state.params && props.navigation.state.params.item,
		}
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

		//To Display various Status Color 
		let color = R.colors.accent;
		//initialize 
		if (item.Status === 0) {
			color = R.colors.cardBalanceBlue
		}
		//success 
		else if (item.Status === 1) {
			color = R.colors.successGreen
		}
		//hold 
		else if (item.Status === 6) {
			color = R.colors.cardBalanceBlue
		}
		//refunded 
		else if (item.Status === 5) {
			color = R.colors.cardBalanceBlue
		}
		//fail 
		else if (item.Status === 9) {
			color = R.colors.failRed
		}
		else {
			color = R.colors.accent
		}

		return (
			<LinearGradient
				locations={[0, 1]}
				start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}
				style={{ flex: 1, }}>

				<SafeView style={{ flex: 1 }}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						toolbarColor={'transparent'}
						textStyle={{ color: 'white' }}
						title={R.strings.chargesCollected}
						backIconStyle={{ tintColor: 'white' }}
						isBack={true} nav={this.props.navigation}
					/>

					<ScrollView
						contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
						keyboardShouldPersistTaps={'always'}
						showsVerticalScrollIndicator={false}>

						{/*  Amount With Toolbar using below design */}
						<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
							<TextViewMR style={
								{
									color: R.colors.white,
									textAlign: 'left',
									fontSize: R.dimens.smallText,
								}}>
								{R.strings.Amount}
							</TextViewMR>
							<Text style={
								{
									fontSize: R.dimens.mediumText,
									fontWeight: 'bold',
									color: R.colors.white,
									fontFamily: Fonts.MontserratSemiBold,
									textAlign: 'left',
								}}>{validateValue(parseFloatVal(item.Amount).toFixed(8))}</Text>
						</View>

						{/* Card for rest details to display item */}
						<CardView style={{
							margin: R.dimens.margin_top_bottom,
							padding: 0,
							backgroundColor: R.colors.cardBackground,
						}}
							cardRadius={R.dimens.detailCardRadius}>

							{/* Holding Currency with Icon and SlabType */}
							<View style={{
								flexDirection: 'row',
								margin: R.dimens.widget_top_bottom_margin,
								alignItems: 'center',
							}}>
								<View style={{
									width: R.dimens.signup_screen_logo_height,
									height: R.dimens.signup_screen_logo_height,
									backgroundColor: 'transparent',
									borderRadius: R.dimens.paginationButtonRadious,
								}}>
									<ImageViewWidget
										url={item.WalletTypeName ? item.WalletTypeName : ''}
										height={R.dimens.signup_screen_logo_height}
										width={R.dimens.signup_screen_logo_height}
										 />

								</View>
								<View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.margin }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.WalletTypeName.toUpperCase())}</Text>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{!isEmpty(item.SlabTypeName) ? item.SlabTypeName : '-'}</TextViewHML>
								</View>
							</View>

							{/* TrnNo,TrnTypeName, Charge, debitWallet , creditWallet,debitUser,creditUser ,Status title and value */}
							<RowItem title={R.strings.Trn_No} value={validateValue(item.TrnNo)} />
							<RowItem title={R.strings.TrnType} value={validateValue(item.TrnTypeName)} />
							<RowItem title={R.strings.Charge} value={validateValue(parseFloatVal(item.Charge).toFixed(8))} />
							<RowItem title={R.strings.debitWallet} value={validateValue(item.DWalletName)} />
							<RowItem title={R.strings.creditWallet} value={validateValue(item.OWalletName)} />
							<RowItem title={R.strings.debitUser} value={validateValue(item.DUserName)} />
							<RowItem title={R.strings.creditUser} value={validateValue(item.OUserName)} />
							<RowItem title={R.strings.Date} value={convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)} />
							<RowItem title={R.strings.Status} value={validateValue(item.StrStatus)} marginBottom={true} status={true} color={color} />

						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default ChargesCollectedDetailScreen
