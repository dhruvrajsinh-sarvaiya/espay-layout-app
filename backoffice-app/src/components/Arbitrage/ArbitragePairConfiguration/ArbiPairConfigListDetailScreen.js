import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import { validateValue, isEmpty } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';

export class ArbiPairConfigListDetailScreen extends Component {
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

	shouldComponentUpdate(nextProps, nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	render() {
		let { item } = this.state

		return (
			<LinearGradient style={{ flex: 1, }}
				start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
				locations={[0, 1]}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>
					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						textStyle={{ color: 'white' }}
						backIconStyle={{ tintColor: 'white' }}
						title={R.strings.arbitragePairConfig}
						toolbarColor={'transparent'}
						isBack={true} nav={this.props.navigation} />

					<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
						<Text style={
							{
								fontSize: R.dimens.smallText,
								color: R.colors.white,
								textAlign: 'left',
								fontFamily: Fonts.MontserratSemiBold,
							}}>{R.strings.Rate}</Text>

						<Text style={
							{
								fontSize: R.dimens.mediumText,
								fontFamily: Fonts.HindmaduraiSemiBold,
								color: R.colors.white,
								textAlign: 'left',
							}}>{(parseFloatVal(item.CurrentRate).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.CurrentRate).toFixed(8)) : '-')}</Text>
					</View>

					<ScrollView
						contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps={'always'}>

						{/* Card for rest details to display item */}
						<CardView style={{
							backgroundColor: R.colors.cardBackground,
							padding: 0,
							margin: R.dimens.margin_top_bottom,
						}} cardRadius={R.dimens.detailCardRadius}>

							{/* Holding CoinName with Icon and Description */}
							<View style={{
								flexDirection: 'row',
								margin: R.dimens.widget_top_bottom_margin,
								alignItems: 'center',
							}}>
								<View style={{
									width: R.dimens.signup_screen_logo_height,
									backgroundColor: 'transparent',
									height: R.dimens.signup_screen_logo_height,
									borderRadius: R.dimens.paginationButtonRadious,
								}}>
									<ImageViewWidget url={!isEmpty(item.PairName) ? item.PairName.split('_')[0] : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />

								</View>
								<View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.margin }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{!isEmpty(item.PairName) ? item.PairName.replace('_', '/') : ''}</Text>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(item.MarketName)}</TextViewHML>
								</View>
							</View>


							{/* For BuyQty min  */}
							<RowItem
								title={R.strings.BuyMinQty}
								value={validateValue(item.BuyMinQty)}
							/>

							{/* For BuyQty max */}
							<RowItem
								title={R.strings.BuyMaxQty}
								value={validateValue(item.BuyMaxQty)}
							/>

							{/* For SellQty min  */}
							<RowItem
								title={R.strings.SellMinQty}
								value={validateValue(item.SellMinQty)}
							/>

							{/* For SellQty max  */}
							<RowItem
								title={R.strings.SellMaxQty}
								value={validateValue(item.SellMaxQty)}
							/>

							{/* For BuyMinPrice  */}
							<RowItem
								title={R.strings.BuyMinPrice}
								value={validateValue(parseFloatVal(item.BuyMinPrice).toFixed(8))}
							/>

							{/* For BuyMinPrice  */}
							<RowItem
								title={R.strings.BuyMaxPrice}
								value={validateValue(parseFloatVal(item.BuyMaxPrice).toFixed(8))}
							/>

							{/* For SellPrice min  */}
							<RowItem
								title={R.strings.SellMinPrice}
								value={validateValue(parseFloatVal(item.SellMinPrice).toFixed(8))}
							/>

							{/* For SellPrice Max  */}
							<RowItem
								title={R.strings.SellMaxPrice}
								value={validateValue(parseFloatVal(item.SellMaxPrice).toFixed(8))}
							/>

							{/* For SellPrice Max  */}
							<RowItem
								title={R.strings.volume}
								value={(parseFloatVal(item.Volume) !== 'NaN' ? validateValue(parseFloatVal(item.Volume)) : '-')}
							/>

							{/* For OpenOrderExp Max  */}
							<RowItem
								title={R.strings.OpenOrderExp}
								value={validateValue(item.OpenOrderExpiration)}
							/>

							{/* For Status  */}
							<RowItem marginBottom={true} title={R.strings.Status} value={item.statusStatic} status={true} color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed} />

						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default ArbiPairConfigListDetailScreen
