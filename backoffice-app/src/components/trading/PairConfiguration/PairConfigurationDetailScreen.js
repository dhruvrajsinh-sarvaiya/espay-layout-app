import React, { Component } from 'react';
import { View, Text, ScrollView, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import { isEmpty, validateValue } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import ImageViewWidget from '../../widget/ImageViewWidget'
import LinearGradient from 'react-native-linear-gradient';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import SafeView from '../../../native_theme/components/SafeView';
import CardView from '../../../native_theme/components/CardView';

class PairConfigurationDetailScreen extends Component {
	constructor(props) {
		super(props);

		//Get required params from previous screen
		let { params } = props.navigation.state

		//Define All State initial state
		this.state = {
			item: params.ITEM
		};
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps)
	};

	componentDidMount = () => {
		//Add this method to change theme based on stored theme name.
		changeTheme()
	};

	render() {
		return (
			<LinearGradient style={{ flex: 1, }}
				locations={[0, 1]}
				start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>{/* To Set Status Bas as per out theme */}
					<CommonStatusBar />

					{/* To Set ToolBar as Per out theme */}
					<CustomToolbar
						backIconStyle={{ tintColor: 'white' }}
						toolbarColor={'transparent'}
						title={R.strings.PairConfigurationDetail}
						textStyle={{ color: 'white' }}
						isBack={true} nav={this.props.navigation} />

					{/* Detail of Pair Configuartion */}
					<ScrollView showsVerticalScrollIndicator={false}>

						{/* To show CurrencyPrice */}
						<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
							<TextViewMR style={
								{
									fontSize: R.dimens.smallText,
									color: R.colors.white,
									textAlign: 'left',
								}}>{R.strings.currencyPrice}</TextViewMR>
							<Text style={
								{
									fontSize: R.dimens.largeText,
									fontWeight: 'bold',
									color: R.colors.white,
									textAlign: 'left',
									fontFamily: Fonts.MontserratSemiBold,
								}}>{this.state.item.CurrencyPrice} {this.state.item.PairName.split('_')[1]}</Text>
						</View>

						<CardView style={{ margin: R.dimens.padding_top_bottom_margin, padding: 0, backgroundColor: R.colors.cardBackground }} cardRadius={R.dimens.detailCardRadius}>

							<View style={{ flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin }}>

								{/* To show pair logo */}
								<View style={{ justifyContent: 'center' }}>
									<View style={{
										width: R.dimens.signup_screen_logo_height,
										height: R.dimens.signup_screen_logo_height,
										backgroundColor: 'transparent',
										borderRadius: R.dimens.paginationButtonRadious,
									}}>
										<ImageViewWidget
											url={this.state.item.PairName.split('_')[1]}
											width={R.dimens.signup_screen_logo_height}
											height={R.dimens.signup_screen_logo_height} />
									</View>
								</View>

								{/* To show PairName , MarketName */}
								<View style={{ flex: 1, marginLeft: R.dimens.margin }}>
									<Text style={{
										color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold',
										fontFamily: Fonts.MontserratSemiBold
									}}>{this.state.item.PairName.replace('_', '/')}</Text>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>
										{validateValue(this.state.item.MarketName)}</TextViewMR>
								</View>
							</View>

							<View style={{ paddingBottom: R.dimens.WidgetPadding, }}>

								{/* All detail of Pair Configuration Detail */}
								{this.rowItem(R.strings.volume, this.state.item.Volume)}
								{this.rowItem(R.strings.DefaultRate, this.state.item.CurrentRate)}
								{this.rowItem(R.strings.BuyMinQty, this.state.item.BuyMinQty)}
								{this.rowItem(R.strings.BuyMaxQty, this.state.item.BuyMaxQty)}
								{this.rowItem(R.strings.SellMinQty, this.state.item.SellMinQty)}
								{this.rowItem(R.strings.SellMaxQty, this.state.item.SellMaxQty)}
								{this.rowItem(R.strings.BuyMinPrice, this.state.item.BuyMinPrice)}
								{this.rowItem(R.strings.BuyMaxPrice, this.state.item.BuyMaxPrice)}
								{this.rowItem(R.strings.SellMinPrice, this.state.item.SellMinPrice)}
								{this.rowItem(R.strings.SellMaxPrice, this.state.item.SellMaxPrice)}
								{this.rowItem(R.strings.BuyPrice, this.state.item.BuyPrice)}
								{this.rowItem(R.strings.SellPrice, this.state.item.SellPrice)}
								{this.rowItem(R.strings.TxnCharge, this.state.item.ChargeType)}
								{this.rowItem(R.strings.status, this.state.item.statusStatic, this.state.item.Status == 1 ? R.colors.successGreen : R.colors.failRed)}
							</View>
						</CardView>

					</ScrollView>
				</SafeView>
			</LinearGradient>
		);
	}

	rowItem = (title, val, color) => {
		let value = isEmpty(val) ? '-' : val

		if (typeof color === 'undefined') {
			color = R.colors.textPrimary
		}

		return <View style={{
			flexDirection: 'row',
			marginTop: R.dimens.widgetMargin,
			paddingLeft: R.dimens.WidgetPadding,
			paddingRight: R.dimens.WidgetPadding,
		}}>
			<View style={{ flex: 1 }}>
				<TextViewHML style={[this.styles().titleItem]}>{title}</TextViewHML>
			</View>
			<View style={{ flex: 1 }}>
				<TextViewHML style={[this.styles().contentItem, { textAlign: 'right', color: color }]}>{value}</TextViewHML>
			</View>
		</View>
	}

	styles = () => {
		return {
			contentItem: {
				fontSize: R.dimens.listItemText,
				color: R.colors.textPrimary
			},
			titleItem: {
				fontSize: R.dimens.listItemText,
				color: R.colors.textSecondary
			}
		}
	}
}

export default PairConfigurationDetailScreen;
