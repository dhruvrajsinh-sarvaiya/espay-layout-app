import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import RowItem from '../../../native_theme/components/RowItem';

export class AdminAssetsDetailScreen extends Component {
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

		// Getting usage type from id
		let usageType = ''
		if (item.WalletUsageType == 0)
			usageType = R.strings.tradingWallet
		else if (item.WalletUsageType == 1)
			usageType = R.strings.marketWallet
		else if (item.WalletUsageType == 2)
			usageType = R.strings.coldWallet
		else if (item.WalletUsageType == 3)
			usageType = R.strings.changeCrWalletOrg
		else if (item.WalletUsageType == 4)
			usageType = R.strings.depositionAdminWallet

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
						backIconStyle={{ tintColor: 'white' }}
						toolbarColor={'transparent'}
						textStyle={{ color: 'white' }}
						title={R.strings.admin_asset}
						isBack={true} nav={this.props.navigation} />

					<ScrollView
						contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps={'always'}>

						{/* Balance Merged With Toolbar using below design */}
						<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
							<TextViewMR style={
								{
									fontSize: R.dimens.smallText,
									color: R.colors.white,
									textAlign: 'left',
								}}>{R.strings.Balance}</TextViewMR>
							<Text style={
								{
									fontSize: R.dimens.mediumText,
									fontWeight: 'bold',
									color: R.colors.white,
									textAlign: 'left',
									fontFamily: Fonts.MontserratSemiBold,
								}}>{validateValue(parseFloatVal(item.Balance).toFixed(8))}</Text>
						</View>

						{/* Card for rest details to display item */}
						<CardView style={{
							padding: 0,
							margin: R.dimens.margin_top_bottom,
							backgroundColor: R.colors.cardBackground,
						}} cardRadius={R.dimens.detailCardRadius}>

							{/* Holding Currency with Icon and Email */}
							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								margin: R.dimens.widget_top_bottom_margin,
							}}>
								<View style={{
									width: R.dimens.signup_screen_logo_height,
									height: R.dimens.signup_screen_logo_height,
									backgroundColor: 'transparent',
									borderRadius: R.dimens.paginationButtonRadious,
								}}>
									<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />

								</View>
								<View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.margin }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.WalletTypeName.toUpperCase())}</Text>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{validateValue(item.Email)}</TextViewHML>
								</View>
							</View>

							{/* Usage Type, Wallet Name, In/Out Bound Balance, Organization and Status title and value */}
							<RowItem title={R.strings.usageType} value={validateValue(usageType)} />
							<RowItem title={R.strings.WalletName} value={validateValue(item.WalletName)} />
							<RowItem title={R.strings.InBoundBal} value={validateValue(parseFloatVal(item.InBoundBalance).toFixed(8))} />
							<RowItem title={R.strings.OutBoundBal} value={validateValue(parseFloatVal(item.OutBoundBalance).toFixed(8))} />
							<RowItem title={R.strings.Organization} value={validateValue(item.OrganizationName)} />
							<RowItem title={R.strings.Status} value={validateValue(item.StrStatus)} marginBottom={true} status={true} color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed} />

						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default AdminAssetsDetailScreen
