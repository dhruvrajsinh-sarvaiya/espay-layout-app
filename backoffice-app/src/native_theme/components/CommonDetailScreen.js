import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../../components/Navigation';
import SafeView from './SafeView';
import CommonStatusBar from './CommonStatusBar';
import CustomToolbar from './CustomToolbar';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from './TextViewMR';
import R from '../R';
import { Fonts } from '../../controllers/Constants';
import CardView from './CardView';
import ImageViewWidget from '../../components/widget/ImageViewWidget';
import RowItem from './RowItem';
import ColumnItem from './ColumnItem';

export class CommonDetailScreen extends Component {
	constructor(props) {
		super(props);

		//fill all the data from previous screen
		this.state = {
			screenTitle: props.navigation.state.params && props.navigation.state.params.screenTitle,

			topTitle: props.navigation.state.params && props.navigation.state.params.topTitle,
			topValue: props.navigation.state.params && props.navigation.state.params.topValue,

			coinName: props.navigation.state.params && props.navigation.state.params.coinName,
			coinValue: props.navigation.state.params && props.navigation.state.params.coinValue,

			rowData: props.navigation.state.params && props.navigation.state.params.rowData,
			colData: props.navigation.state.params && props.navigation.state.params.colData,

			widgetType: props.navigation.state.params && props.navigation.state.params.widgetType,
			widgetTypeOneTitle: props.navigation.state.params && props.navigation.state.params.widgetTypeOneTitle,
			widgetTypeOneValue: props.navigation.state.params && props.navigation.state.params.widgetTypeOneValue,
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

	render() {

		return (
			<LinearGradient style={{ flex: 1, }}
				start={{ x: 0, y: 0 }}
				locations={[0, 1]}  end={{ x: 0, y: 1 }}
				colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

				<SafeView style={{ flex: 1 }}>

					{/* To set status bar as per our theme */}
					<CommonStatusBar />

					{/* To set toolbar as per our theme */}
					<CustomToolbar textStyle={{ color: 'white' }}
						backIconStyle={{ tintColor: 'white' }}
						toolbarColor={'transparent'} title={this.state.screenTitle}
						isBack={true} nav={this.props.navigation} />

					<ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

						{
							this.state.topTitle != undefined &&
							<View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
								<TextViewMR style={{
									fontSize: R.dimens.smallText,
									textAlign: 'left',
									color: R.colors.white,
								}}>{this.state.topTitle}</TextViewMR>
								<Text style={{
									fontSize: R.dimens.mediumText,
									color: R.colors.white,
									fontWeight: 'bold',
									textAlign: 'left',
									fontFamily: Fonts.MontserratSemiBold,
								}}>{this.state.topValue}</Text>
							</View>}

						{/* Card for rest details to display item */}
						<CardView style={{
							margin: R.dimens.margin_top_bottom,
							padding: 0,
							backgroundColor: R.colors.cardBackground,
						}} cardRadius={R.dimens.detailCardRadius}>

							{/* Holding Currency with Icon and UserName */}
							{this.state.coinName != undefined &&
								<View style={{ flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin, }}>
									<View style={{ justifyContent: 'center' }}>
										<View style={{
											width: R.dimens.signup_screen_logo_height,
											height: R.dimens.signup_screen_logo_height,
											backgroundColor: 'transparent',
											borderRadius: R.dimens.paginationButtonRadious,
										}}>
											<ImageViewWidget url={this.state.coinName} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
										</View>
									</View>

									{/* coinName , UserName */}
									<View style={{ flex: 1, flexDirection: 'column', marginLeft: R.dimens.margin }}>
										<Text style={{
											color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold',
											fontFamily: Fonts.MontserratSemiBold
										}}>{this.state.coinName}</Text>
										<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{this.state.coinValue}</TextViewMR>
									</View>
								</View>}

							{this.state.widgetType == 1 &&
								<View>
									<Text style={{
										textAlign: 'left',
										margin: R.dimens.widget_top_bottom_margin,
										marginLeft: R.dimens.padding_left_right_margin,
										marginBottom: 0,
										flex: 1,
										color: R.colors.textPrimary,
										fontSize: R.dimens.mediumText,
										fontWeight: 'bold',
										fontFamily: Fonts.MontserratSemiBold
									}}>{this.state.widgetTypeOneTitle}</Text>

									{/* For SerProIDName */}
									<Text style={{
										textAlign: 'left',
										marginLeft: R.dimens.padding_left_right_margin,
										marginBottom: 0,
										flex: 1,
										color: R.colors.textSecondary,
										fontSize: R.dimens.smallestText,
										fontFamily: Fonts.MontserratSemiBold
									}}>{this.state.widgetTypeOneValue}</Text>
								</View>
							}

							{(this.state.rowData != undefined && this.state.rowData != null) &&
								this.state.rowData.map((item, index) => {
									return (
										<RowItem
											key={index.toString()}
											title={item.title}
											value={item.value}
											status={item.status}
											color={item.color}
											marginBottom={item.marginBottom}
										/>
									)
								}
								)
							}

							{(this.state.colData != undefined && this.state.colData != null) &&
								this.state.colData.map((item, index) => {
									return (
										<ColumnItem
											key={index.toString()}
											title={item.title}
											value={item.value}
											status={item.status}
											color={item.color}
											marginBottom={item.marginBottom}
										/>
									)
								}
								)
							}
						</CardView>
					</ScrollView>
				</SafeView>
			</LinearGradient>
		)
	}
}

export default CommonDetailScreen
