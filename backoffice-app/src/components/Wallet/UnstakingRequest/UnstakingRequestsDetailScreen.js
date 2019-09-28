import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';

export class UnstakingRequestsDetailScreen extends Component {
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

		// Change status color at runtime
		let stColor = R.colors.accent
		if (item.Status == 0)
			stColor = R.colors.yellow
		else if (item.Status == 1)
			stColor = R.colors.successGreen
		else if (item.Status == 9)
			stColor = R.colors.failRed

		return (

			<LinearGradient style={{ flex: 1, }} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>
				<SafeView style={{ flex: 1 }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						toolbarColor={'transparent'}
						textStyle={{ color: 'white' }}
						title={R.strings.unstackingRequests}
						isBack={true} nav={this.props.navigation}
						backIconStyle={{ tintColor: 'white' }} />

					<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
						<Text style={
							{
								fontSize: R.dimens.smallText,
								color: R.colors.white,
								textAlign: 'left',
								fontFamily: Fonts.MontserratSemiBold,
							}}>{R.strings.Amount}</Text>

						<Text style={
							{
								fontSize: R.dimens.mediumText,
								fontFamily: Fonts.HindmaduraiSemiBold,
								color: R.colors.white,
								textAlign: 'left',
							}}>{validateValue(parseFloatVal(item.AmountCredited).toFixed(8))}</Text>
					</View>

					<ScrollView
						keyboardShouldPersistTaps={'always'}
						contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
						showsVerticalScrollIndicator={false}
					>
						{/* Card for rest details to display item */}
						<CardView style={{
							padding: 0,
							backgroundColor: R.colors.cardBackground,
							margin: R.dimens.margin_top_bottom,
						}} cardRadius={R.dimens.detailCardRadius}>

							<View style={{
								marginTop: R.dimens.widget_top_bottom_margin,flexDirection: 'row',
								alignItems: 'center',
							}}>

								<View style={{ flex: 1, justifyContent: 'center', paddingLeft: R.dimens.padding_left_right_margin, }}>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{validateValue(item.UserName)}</TextViewHML>
								</View>
							</View>

							<RowItem title={R.strings.email} value={validateValue(item.Email)} />
							<RowItem title={R.strings.UnStaking_Type} value={validateValue(item.UnstackTypeName)} />
							<RowItem title={R.strings.Interest_Amount} value={validateValue(parseFloatVal(item.InterestCreditedValue).toFixed(8))} />
							<RowItem title={R.strings.Charge} value={validateValue(parseFloatVal(item.ChargeBeforeMaturity).toFixed(8))} />
							<RowItem title={R.strings.degradeStakingAmount} value={validateValue(parseFloatVal(item.DegradeStakingAmount).toFixed(8))} />
							<RowItem title={R.strings.requestDate} value={convertDateTime(item.RequestDate, 'YYYY-MM-DD HH:mm:ss', false)} />
							<RowItem title={R.strings.Status} value={item.statusText} marginBottom={true} status={true} color={stColor} />

						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default UnstakingRequestsDetailScreen
