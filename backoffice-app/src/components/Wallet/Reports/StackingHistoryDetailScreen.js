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
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import RowItem from '../../../native_theme/components/RowItem';

export class StackingHistoryDetailScreen extends Component {
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

		//To Display various Status Color and status text
		let color = R.colors.accent;
		let statusText = ''

		//inActive 
		if (item.Status === 0) {
			statusText = R.strings.inActive
			color = R.colors.failRed
		}
		//Active 
		else if (item.Status === 1) {
			statusText = R.strings.Active
			color = R.colors.successGreen
		}
		//Pending 
		else if (item.Status === 4) {color = R.colors.yellow
			statusText = R.strings.Pending}
		//unstakeAndRefunded 
		else if (item.Status === 5) {
			statusText = R.strings.unstakeAndRefunded
			color = R.colors.cardBalanceBlue
		}
		//removed 
		else if (item.Status === 9) {color = R.colors.failRed
			statusText = R.strings.removed}


		return (
			<LinearGradient style={{ flex: 1, }}
				locations={[0, 1]}
				start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />
					{/* To Set Toolbar as per our theme */}
					<CustomToolbar
						toolbarColor={'transparent'}
						textStyle={{ color: 'white' }}
						backIconStyle={{ tintColor: 'white' }}
						isBack={true}
						title={R.strings.stackingHistoryReport}
						nav={this.props.navigation} />

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							flexGrow: 1,
							paddingBottom: R.dimens.margin_top_bottom
						}}
						keyboardShouldPersistTaps={'always'}>

						{/* Card for rest details to display item */}
						<CardView style={{
							padding: 0,
							backgroundColor: R.colors.cardBackground,
							margin: R.dimens.margin_top_bottom,
						}}
						 cardRadius={R.dimens.detailCardRadius}>

							{/* Holding Currency with Icon and SlabType */}
							<View style={{
								flexDirection: 'row',
								margin: R.dimens.widget_top_bottom_margin,
								alignItems: 'center',
							}}>
								<View style={{
									height: R.dimens.signup_screen_logo_height,
									backgroundColor: 'transparent',
									borderRadius: R.dimens.paginationButtonRadious,
									width: R.dimens.signup_screen_logo_height,
								}}>
									<ImageViewWidget url={item.StakingCurrency ? item.StakingCurrency : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />

								</View>
								<View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.margin }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.StakingCurrency.toUpperCase())}</Text>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{!isEmpty(item.SlabTypeName) ? item.SlabTypeName : '-'}</TextViewHML>
								</View>
							</View>


							{/* stackingType,duration title and value */}
							<RowItem title={R.strings.stackingType} value={validateValue(item.stackingTypeText)} />
							<RowItem title={R.strings.duration}
								value={validateValue(item.DurationMonth) + " " + R.strings.months + ' , ' + validateValue(item.DurationWeek) + " " + R.strings.weeks}
							/>

							{/* InterestType,maturityCurrency,enableUnstakingBeforeMaturity,MaturityDate title and value */}
							{item.StakingType === 1 &&
								<View>
									< RowItem title={R.strings.Interest_Type} value={validateValue(item.InterestTypeName)} />
									< RowItem title={R.strings.maturityCurrency} value={validateValue(item.MaturityCurrency)} />
									< RowItem title={R.strings.enableUnstakingBeforeMaturity} value={item.EnableStakingBeforeMaturity ? R.strings.yes_text : R.strings.no} />
									<RowItem title={R.strings.MaturityDate} value={convertDateTime(item.MaturityDate, 'YYYY-MM-DD HH:mm:ss', false)} />
								</View>
							}

							{/*MarkerCharges title and value */}
							{item.StakingType === 2 &&
								<RowItem title={R.strings.Maker_Charges} value={validateValue(parseFloatVal(item.MakerCharges).toFixed(8))} />
							}

							{/*renewstakingEnable,amountCredited,slabType,stakingAmount title and value */}
							<RowItem title={R.strings.renewstakingEnable} value={item.RenewUnstakingEnable ? R.strings.yes_text : R.strings.no} />
							<RowItem title={R.strings.amountCredited} value={validateValue(parseFloatVal(item.AmountCredited).toFixed(8))} />
							<RowItem title={R.strings.slabType} value={validateValue(item.SlabTypeName)} />
							<RowItem title={R.strings.stakingAmount} value={validateValue(parseFloatVal(item.StakingAmount).toFixed(8))} />


							{/*tarkerCharges title and value */}
							{item.StakingType === 2 &&
								<RowItem title={R.strings.Taker_Charges} value={validateValue(parseFloatVal(item.TakerCharges).toFixed(8))} />
							}

							{/*Interest,MaturityAmount,unstakingBeforeMaturityCharge title and value */}
							{item.StakingType === 1 &&
								<View>
									< RowItem title={R.strings.Interest} value={validateValue(parseFloatVal(item.InterestValue).toFixed(2))} />
									< RowItem title={R.strings.Maturity_Amount} value={validateValue(parseFloatVal(item.MaturityAmount).toFixed(8))} />
									< RowItem title={R.strings.unstakingBeforeMaturityCharge} value={validateValue(item.EnableStakingBeforeMaturityCharge)} />
								</View>
							}

							{/*enableAutoUnStacking,renewUnstakingPeriod,Status title and value */}
							<RowItem title={R.strings.enableAutoUnStacking} value={item.EnableAutoUnstaking ? R.strings.yes_text : R.strings.no} />
							<RowItem title={R.strings.renewUnstakingPeriod} value={validateValue(item.RenewUnstakingPeriod)} />
							<RowItem title={R.strings.Status} value={statusText} marginBottom={true} status={true} color={color} />

						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default StackingHistoryDetailScreen
