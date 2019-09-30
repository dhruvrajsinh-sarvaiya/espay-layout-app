import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';

export class CurrencyConfigDetailScreen extends Component {
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
		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	render() {
		let { item } = this.state

		//To Display various Status Color and status text
		let stColor = R.colors.successGreen
		if (item.Status == 0)
			stColor = R.colors.failRed

		return (
			<LinearGradient
				locations={[0, 1]}
				end={{ x: 0, y: 1 }} start={{ x: 0, y: 0 }} style={{ flex: 1, }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>
					{/* To Set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						backIconStyle={{ tintColor: 'white' }}
						textStyle={{ color: 'white' }}
						toolbarColor={'transparent'}
						title={R.strings.WalletTypes}
						isBack={true}
						nav={this.props.navigation} />

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
						keyboardShouldPersistTaps={'always'}>

						{/* Card for rest details to display item */}
						<CardView style={{
							padding: 0,
							backgroundColor: R.colors.cardBackground,
							margin: R.dimens.margin_top_bottom,
						}} cardRadius={R.dimens.detailCardRadius}>

							{/* Holding CoinName with Icon and Description */}
							<View style={{
								flexDirection: 'row',
								margin: R.dimens.widget_top_bottom_margin,
								alignItems: 'center',
							}}>
								<View style={{
									backgroundColor: 'transparent',
									width: R.dimens.signup_screen_logo_height,
									height: R.dimens.signup_screen_logo_height,
									borderRadius: R.dimens.paginationButtonRadious,
								}}>
									<ImageViewWidget
										height={R.dimens.signup_screen_logo_height}
										url={item.CoinName ? item.CoinName : ''}
										width={R.dimens.signup_screen_logo_height}
									/>

								</View>
								<View style={{
									flex: 1,
									justifyContent: 'center',
									marginLeft: R.dimens.margin
								}}>
									<Text style={{
										color: R.colors.textPrimary,
										fontWeight: 'bold',
										fontSize: R.dimens.mediumText,
										fontFamily: Fonts.MontserratSemiBold
									}}>
										{validateValue(item.CoinName.toUpperCase())}</Text>
									<TextViewHML style={{ 
										fontSize: R.dimens.smallestText,
										color: R.colors.textSecondary,
										  }}>{validateValue(item.Description)}</TextViewHML>
								</View>
							</View>

							{/* For allowDeposition  */}
							<RowItem
								color={item.IsDepositionAllow == 1 ? R.colors.successGreen : R.colors.failRed}
								title={R.strings.allowDeposition}
								status={true}
								value={item.IsDepositionAllow == 1 ? R.strings.enabled : R.strings.disabled}
							/>
							{/* For allowWithdrawal  */}
							<RowItem
								color={item.IsWithdrawalAllow == 1 ? R.colors.successGreen : R.colors.failRed}
								title={R.strings.allowWithdrawal}
								status={true}
								value={item.IsWithdrawalAllow == 1 ? R.strings.enabled : R.strings.disabled}
							/>
							{/* For allowTransaction  */}
							<RowItem
								value={item.IsTransactionWallet == 1 ? R.strings.enabled : R.strings.disabled}
								title={R.strings.allowTransaction}
								status={true}
								color={item.IsTransactionWallet == 1 ? R.colors.successGreen : R.colors.failRed}
							/>
							{/* For defaultWallet  */}
							<RowItem
								title={R.strings.defaultWallet}
								value={item.IsDefaultWallet == 1 ? R.strings.yes_text : R.strings.no}
								color={item.IsDefaultWallet == 1 ? R.colors.successGreen : R.colors.failRed}
								status={true}
							/>

							{/* For Status  */}
							<RowItem title={R.strings.Status}
								value={item.statusText} status={true}
								color={stColor} />

							{/* For confirmationCount  */}
							<RowItem
								value={validateValue(item.ConfirmationCount)}
								title={R.strings.confirmationCount}
							/>

							{/* For createdDate  */}
							<RowItem title={R.strings.createdDate}
								value={validateValue(convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false))} />

							{/* For updatedDate  */}
							<RowItem title={R.strings.updatedDate}
								value={validateValue(item.UpdatedDate) ? validateValue(convertDateTime(item.UpdatedDate, 'YYYY-MM-DD HH:mm:ss', false)) : '-'} marginBottom={true} />
						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default CurrencyConfigDetailScreen
