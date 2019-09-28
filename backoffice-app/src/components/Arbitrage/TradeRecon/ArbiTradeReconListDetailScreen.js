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
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';

export class ArbiTradeReconListDetailScreen extends Component {
	constructor(props) {
		super(props);

		//fill all the data from previous screen
		this.state = {
			item: props.navigation.state.params && props.navigation.state.params.item,
			titleScreen: props.navigation.state.params && props.navigation.state.params.titleScreen,
		}
	}

	componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate(nextProps, nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	render() {
		let { item } = this.state

		let statusColor = R.colors.accent

		//To Display various Status Color and status text
		// Cancelled
		if (item.IsCancelled == 1) {
			statusColor = R.colors.failRed
		}
		// Success == 1, Active == 4
		else if (item.StatusCode == 1 || item.StatusCode == 4) {
			statusColor = R.colors.successGreen
		}
		// OperatorFail = 2, SystemFail = 3, Inactive = 9
		else if (item.StatusCode == 2 || item.StatusCode == 3 || item.StatusCode == 9) {
			statusColor = R.colors.failRed
		}

		return (<LinearGradient locations={[0, 1]}
			start={{ x: 0, y: 0 }} style={{ flex: 1, }} end={{ x: 0, y: 1 }}
			colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

			<SafeView style={{ flex: 1 }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					backIconStyle={{ tintColor: 'white' }} title={this.state.titleScreen}
					textStyle={{ color: 'white' }}
					toolbarColor={'transparent'}
					isBack={true} nav={this.props.navigation} />

				{/* For show Price */}
				<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
					<Text style={
						{
							fontSize: R.dimens.smallText,
							color: R.colors.white,
							textAlign: 'left',
							fontFamily: Fonts.MontserratSemiBold,
						}}>{R.strings.price}</Text>

					<Text style={
						{
							fontSize: R.dimens.mediumText,
							fontFamily: Fonts.HindmaduraiSemiBold,
							color: R.colors.white,
							textAlign: 'left',
						}}>{(parseFloatVal(item.Price).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Price).toFixed(8)) : '-')}</Text>
				</View>

				<ScrollView
					contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={'always'}>

					{/* Card for rest details to display item */}
					<CardView style={{
						margin: R.dimens.margin_top_bottom,
						padding: 0, backgroundColor: R.colors.cardBackground,
					}}
						cardRadius={R.dimens.detailCardRadius}>

						{/* Holding PairName with Icon and OrderType ,MarketType  */}
						<View style={{
							margin: R.dimens.widget_top_bottom_margin,
							flexDirection: 'row', alignItems: 'center',
						}}>
							<View style={{backgroundColor: 'transparent',width: R.dimens.signup_screen_logo_height,
								height: R.dimens.signup_screen_logo_height, borderRadius: R.dimens.paginationButtonRadious,
							}}>
								<ImageViewWidget url={!isEmpty(item.PairName) ? item.PairName.split('_')[0] : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />

							</View>
							<View style={{
								flex: 1,
								justifyContent: 'center', marginLeft: R.dimens.margin
							}}>
								<View style={{
									flexDirection: 'row', alignItems: 'center',
								}}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{!isEmpty(item.PairName) ? item.PairName.replace('_', '/') + ' ' : ''}</Text>
									<TextViewHML style={{ color: item.Type.toLowerCase() === 'buy' ? R.colors.successGreen : R.colors.failRed, fontSize: R.dimens.smallestText, }}>{validateValue(item.OrderType) + ' - ' + validateValue(item.Type)}</TextViewHML>
								</View>

								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(item.UserName)}</TextViewHML>
							</View>
						</View>


						{/* For transactionNo */}
						<RowItem
							title={R.strings.transactionNo}
							value={validateValue(item.TrnNo)}
						/>

						{/* For provider */}
						<RowItem
							title={R.strings.provider}
							value={validateValue(item.ProviderName)}
						/>

						{/* For Amount */}
						<RowItem
							title={R.strings.Amount}
							value={(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}
						/>

						{/* For Total */}
						<RowItem
							title={R.strings.total}
							value={(parseFloatVal(item.Total).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Total).toFixed(8)) : '-')}
						/>

						{/* For SettleQty */}
						<RowItem
							title={R.strings.settledQty}
							value={(parseFloatVal(item.SettleQty).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.SettleQty).toFixed(8)) : '-')}
						/>

						{/* For Charge  */}
						<RowItem
							title={R.strings.Charge}
							value={(parseFloatVal(item.ChargeRs) !== 'NaN' ? validateValue(parseFloatVal(item.ChargeRs)) : '-')}
						/>

						{/* For DateTime  */}
						<RowItem title={R.strings.Date} value={convertDateTime(item.DateTime, 'YYYY-MM-DD HH:mm:ss', false)} />

						{/* For Status  */}
						<RowItem marginBottom={true} title={R.strings.Status} value={item.statusStatic} status={true} color={statusColor} />

					</CardView>
				</ScrollView>
			</SafeView>
		</LinearGradient >
		)
	}
}

export default ArbiTradeReconListDetailScreen
