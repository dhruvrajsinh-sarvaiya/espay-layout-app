import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import LinearGradient from 'react-native-linear-gradient';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { validateValue } from '../../../validations/CommonValidation';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';

export class SetTransferFeeDetailScreen extends Component {
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
		return (
			<LinearGradient style={{ flex: 1, }}
				locations={[0, 1]}
				start={{ x: 0, y: 0 }}
				 end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight,
				 R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						backIconStyle={{ tintColor: 'white' }}
						textStyle={{ color: 'white' }}
						toolbarColor={'transparent'}
						title={R.strings.setTransferFee}
						isBack={true} nav={this.props.navigation} />

					<ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

						{/* Address Merged With Toolbar using below design */}
						<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
							<TextViewMR style={
								{
									fontSize: R.dimens.smallText,
									color: R.colors.white,
									textAlign: 'left',
								}}>{R.strings.Address}</TextViewMR>
							<Text style={
								{
									fontSize: R.dimens.mediumText,
									fontWeight: 'bold',
									color: R.colors.white,
									textAlign: 'left',
									fontFamily: Fonts.MontserratSemiBold,
								}}>{validateValue(item.ContractAddress)}</Text>
						</View>

						{/* Card for rest details to display item */}
						<CardView style={{
							margin: R.dimens.margin_top_bottom,
							padding: 0,
							backgroundColor: R.colors.cardBackground,
						}} cardRadius={R.dimens.detailCardRadius}>

							{/* Holding Currency with Icon and UserName */}
							<View style={{
								flexDirection: 'row',
								margin: R.dimens.widget_top_bottom_margin,
							}}>
								<View style={{ width: '25%', justifyContent: 'center' }}>
									<View style={{
										width: R.dimens.signup_screen_logo_height,
										height: R.dimens.signup_screen_logo_height,
										backgroundColor: 'transparent',
										borderRadius: R.dimens.paginationButtonRadious,
									}}>
										<ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
									</View>
								</View>

								<View style={{ width: '75%', flexDirection: 'column' }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.WalletTypeName.toUpperCase())}</Text>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{validateValue(item.ActionByUserName)}</TextViewMR>
								</View>
							</View>

							<RowItem title={R.strings.basePoint} value={validateValue(item.BasePoint)} />
							<RowItem title={R.strings.maxFee} value={validateValue(item.Maxfee)} />
							<RowItem title={R.strings.minFee} value={validateValue(item.Minfee)} />

							{/* Trn Hash */}
							<View style={{
								marginTop: R.dimens.widgetMargin,
								paddingLeft: R.dimens.padding_left_right_margin,
								paddingRight: R.dimens.padding_left_right_margin,
							}}>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
									{R.strings.trnHash}
								</TextViewHML>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
									{validateValue(item.TrnHash)}
								</TextViewHML>
							</View>

							{/* Remarks */}
							<View style={{
								marginTop: R.dimens.widgetMargin,
								paddingLeft: R.dimens.padding_left_right_margin,
								marginBottom: R.dimens.widget_top_bottom_margin,
								paddingRight: R.dimens.padding_left_right_margin,
							}}>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
									{R.strings.remarks}
								</TextViewHML>
								<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
									{validateValue(item.Remarks)}
								</TextViewHML>
							</View>
						</CardView>

					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default SetTransferFeeDetailScreen
