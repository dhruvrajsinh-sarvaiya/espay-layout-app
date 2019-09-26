import React, { Component } from 'react'
import { Text, View, ScrollView, Linking } from 'react-native'
import { changeTheme, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import R from '../../../native_theme/R';
import { Fonts } from '../../../controllers/Constants';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import RowItem from '../../../native_theme/components/RowItem';
import ColumnItem from '../../../native_theme/components/ColumnItem';

export class WithdrawReportDetailScreen extends Component {
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
		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	//This Method Is used to open Address in Browser With Specific Link
	onTrnLinkPress = () => {
		let { item } = this.state
		try {
			let res = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
			Linking.openURL((res.length) ? res[0].Data + '/' + item.TrnID : item.TrnID);
		} catch (error) {
			//handle catch block here
		}
	}

	render() {
		let { item } = this.state

		let color = R.colors.yellow
		//set status color based on status code
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 2 || item.Status == 3)
			color = R.colors.failRed
		else if (item.Status == 5 || item.Status == 999 || item.Status == 4)
			color = R.colors.cardBalanceBlue

		return (
			<LinearGradient style={{ flex: 1, }} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar textStyle={{ color: 'white' }}
						backIconStyle={{ tintColor: 'white' }}
						toolbarColor={'transparent'} title={R.strings.withdrawalReport}
						isBack={true} nav={this.props.navigation} />

					<ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
						{/* Address Merged With Toolbar using below design */}
						<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
							<TextViewMR style={{
								fontSize: R.dimens.smallText,
								textAlign: 'left',
								color: R.colors.white,
							}}>{R.strings.Amount}</TextViewMR>
							<Text style={{
								fontSize: R.dimens.mediumText,
								color: R.colors.white,
								fontWeight: 'bold',
								textAlign: 'left',
								fontFamily: Fonts.MontserratSemiBold,
							}}>{validateValue(parseFloatVal(item.Amount).toFixed(8))}</Text>
						</View>

						{/* Card for rest details to display item */}
						<CardView style={{
							margin: R.dimens.margin_top_bottom,
							padding: 0,
							backgroundColor: R.colors.cardBackground,
						}} cardRadius={R.dimens.detailCardRadius}>

							{/* Holding Currency with Icon and UserName */}
							<View style={{ flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin, }}>
								<View style={{ justifyContent: 'center' }}>
									<View style={{
										width: R.dimens.signup_screen_logo_height,
										height: R.dimens.signup_screen_logo_height,
										backgroundColor: 'transparent',
										borderRadius: R.dimens.paginationButtonRadious,
									}}>
										<ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
									</View>
								</View>

								{/* CoinName , UserName */}
								<View style={{ flex: 1, flexDirection: 'column', marginLeft: R.dimens.margin }}>
									<Text style={{
										color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold',
										fontFamily: Fonts.MontserratSemiBold
									}}>{validateValue(item.CoinName.toUpperCase())}</Text>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{validateValue(item.UserName)}</TextViewMR>
								</View>
							</View>

							{/* To set OrganizationName */}
							<RowItem title={R.strings.Organization} value={validateValue(item.OrganizationName)} />

							{/* To set provider */}
							<RowItem title={R.strings.provider} value={validateValue(item.ProviderName)} />

							{/* To set Status */}
							<RowItem title={R.strings.Status} value={validateValue(item.statusStatic)} status={true} color={color} />

							{/* To set Date */}
							<RowItem title={R.strings.Date} value={convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)} />

							{/* To set TrnNo */}
							<ColumnItem
								title={R.strings.Trn_No}
								value={validateValue(item.TrnNo)}
							/>

							{/* To set TrnID */}
							<ColumnItem
								onPress={() => this.onTrnLinkPress()}
								title={R.strings.transactionId}
								value={validateValue(item.TrnID)}
								valueStyle={{ color: R.colors.accent }}
							/>

							{/* To set FromAddress */}
							{/* 	<ColumnItem
								title={R.strings.From_Address}
								value={validateValue(item.FromAddress)}
							/> */}

							{/* To set toAddress */}
							<ColumnItem
								marginBottom={item.TrnResponse == '' ? true : false}
								title={R.strings.toAddress}
								value={validateValue(item.ToAddress)}
							/>

							{/* To set TrnResponse */}
							{item.TrnResponse != '' &&
								<ColumnItem
									marginBottom={true}
									title={R.strings.transactionResponse}
									value={validateValue(item.TrnResponse)}
								/>}

						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default WithdrawReportDetailScreen
