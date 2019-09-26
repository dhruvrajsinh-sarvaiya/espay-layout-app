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

export class TokenTransferDetailScreen extends Component {
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
	shouldComponentUpdate(nextProps, _nextState) {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	render() {
		let { item } = this.state
		return (
			<LinearGradient style={{ flex: 1, }}
				locations={[0, 1]}
				start={{ x: 0, y: 0 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]} end={{ x: 0, y: 1 }}>

				<SafeView style={{ flex: 1 }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar
						backIconStyle={{ tintColor: 'white' }}
						toolbarColor={'transparent'}
						textStyle={{ color: 'white' }}
						title={R.strings.tokenTransfer}
						isBack={true} nav={this.props.navigation} />

					{/* To set Amount*/}
					<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
						<Text style={
							{
								fontSize: R.dimens.smallText,
								textAlign: 'left',
								color: R.colors.white,
								fontFamily: Fonts.MontserratSemiBold,
							}}>{R.strings.Amount}</Text>

						<Text style={
							{
								fontSize: R.dimens.mediumText,
								fontFamily: Fonts.HindmaduraiSemiBold,
								color: R.colors.white,
								textAlign: 'left',
							}}>{validateValue(parseFloatVal(item.Amount).toFixed(8))}</Text>
					</View>

					<ScrollView
						contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps={'always'}>

						{/* Card for rest details to display item */}
						<CardView style={{
							padding: 0,
							margin: R.dimens.margin_top_bottom,
							backgroundColor: R.colors.cardBackground,
						}} cardRadius={R.dimens.detailCardRadius}>

							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: R.dimens.widget_top_bottom_margin,
							}}>

								{/* To set User name*/}
								<View style={{ flex: 1, justifyContent: 'center', paddingLeft: R.dimens.padding_left_right_margin, }}>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{validateValue(item.ActionByUserName)}</TextViewHML>
								</View>
							</View>

							{/* To set From Address*/}
							<TextViewHML style={[this.styles().title]}>{R.strings.From_Address}</TextViewHML>
							<TextViewHML style={[this.styles().value]}>{validateValue(item.FromAddress)}</TextViewHML>

							{/* To set To Address*/}
							<TextViewHML style={[this.styles().title]}>{R.strings.toAddress}</TextViewHML>
							<TextViewHML style={[this.styles().value]}>{validateValue(item.ToAddress)}</TextViewHML>

							{/* To set To trnHash*/}
							<TextViewHML style={[this.styles().title]}>{R.strings.txnHash}</TextViewHML>
							<TextViewHML style={[this.styles().value]}>{validateValue(item.TrnHash)}</TextViewHML>

							{/* To set To remarks*/}
							<TextViewHML style={[this.styles().value]}>{validateValue(item.Remarks)}</TextViewHML>

							{/* To set To Date*/}
							<RowItem title={R.strings.Date} style={{ marginTop: 0 }} marginBottom={true} value={convertDateTime(item.ActionDate, 'YYYY-MM-DD HH:mm:ss', false)} />
						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)

	}
	// style for this class
	styles = () => {
		return {
			title: {
				flex: 1,
				fontSize: R.dimens.smallText,
				color: R.colors.textSecondary,
				paddingLeft: R.dimens.padding_left_right_margin,
				paddingRight: R.dimens.padding_left_right_margin,
			},
			value: {
				flex: 1,
				fontSize: R.dimens.smallText,
				color: R.colors.textPrimary,
				paddingLeft: R.dimens.padding_left_right_margin,
				paddingRight: R.dimens.padding_left_right_margin,
			}
		}
	}
}

export default TokenTransferDetailScreen
