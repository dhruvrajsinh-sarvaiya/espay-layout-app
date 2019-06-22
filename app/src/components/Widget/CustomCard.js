import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import { Fonts } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

var largerHeight = 0;
var needScale = true;

class CustomCard extends Component {

	constructor(props) {
		super(props);
	}

	// return status related color
	valueget = (value) => {
		if (value === R.strings.VerifyNumbers)
			return R.colors.successGreen
		if (value === R.strings.UnverifiedNumbers)
			return R.colors.failRed
		if (value === R.strings.AddNumbers)
			return R.colors.accent
		else
			return R.colors.accent
	}

	render() {

		//Get All Props Value 
		let icon = this.props.icon
		let title = this.props.title
		let value = this.props.value
		let tintColor = this.props.tintColor ? this.props.tintColor : R.colors.white
		let index = this.props.index;
		let size = this.props.size;
		let type = this.props.type;
		let isGrid = this.props.isGrid;
		let screenname = this.props.screenname ? this.props.screenname : ' '
		let cardStyle = this.props.cardStyle
		let imageBack = this.props.imageBack ? this.props.imageBack : ''

		if (isGrid) {
			let isLeft = (index % 2 == 0);
			let isRight = !isLeft;
			let isSizeEven = (size % 2 == 0)

			return (
				<AnimatableItem>
					<View style={{ width: this.props.width / 2, }}>
						<CardView
							cardBackground={type === 1 ? R.colors.cardBackground : R.colors.accent}
							style={{
								flex: 1,
								marginLeft: isLeft ? R.dimens.widget_left_right_margin : R.dimens.widgetMargin,
								marginRight: isRight ? R.dimens.widget_left_right_margin : R.dimens.widgetMargin,
								marginTop: (index == 0 || index == 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
								marginBottom: (index == size - 1 || (isSizeEven && index == size - 2)) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
								padding: 0,
								...cardStyle
							}}
							onPress={this.props.onPress}>
							<View style={[{ flex: 1, margin: R.dimens.margin }, this.props.mainviewstyle]}>
								{type == 1 ?
									<View style={{ flex: 1 }}>
										<View
											style={[this.props.style, (this.props.viewHeight == 0) ? {} : { height: this.props.viewHeight }]}
											onLayout={({ nativeEvent: { layout: { height } } }) => {

												if (needScale) {
													if (largerHeight != height) {
														if (largerHeight == 0) {
															largerHeight = height;
														} else if (height > largerHeight) {
															largerHeight = height;
														}
													}

													if (index == size - 1) {
														needScale = false;
														this.props.onChangeHeight(largerHeight);
													}
												}
											}}>
											{title ?
												<Text style={[{ color: imageBack != '' ? R.colors.white : R.colors.textPrimary, paddingTop: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, textAlign: 'left', fontFamily: Fonts.MontserratSemiBold }, this.props.titleStyle]}>{title}</Text>
												: null
											}
											<TextViewHML style={{ color: imageBack != '' ? R.colors.white : this.valueget(value), paddingTop: R.dimens.widgetMargin, fontSize: R.dimens.smallText, textAlign: 'left', }}>{value}</TextViewHML>
											<View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', margin: R.dimens.widgetMargin }}>
												<View style={{ backgroundColor: imageBack != '' ? imageBack : this.valueget(value), borderRadius: R.dimens.QRCodeIconWidthHeight }}>
													<ImageButton
														icon={icon}
														iconStyle={[{ width:/*  imageBack != '' ? R.dimens.listImageHeightWidth : */ R.dimens.dashboardMenuIcon, height: /* imageBack != '' ? R.dimens.listImageHeightWidth : */ R.dimens.dashboardMenuIcon, tintColor: tintColor }, this.props.imageStyle]}
														onPress={this.props.onPress}
													/>
												</View>
											</View>
										</View>
									</View> :
									<View
										style={[{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: R.dimens.CardViewElivation }, (this.props.viewHeight == 0 ? '' : { height: this.props.viewHeight })]}
										onLayout={({ nativeEvent: { layout: { height } } }) => {

											if (needScale) {
												if (largerHeight != height) {
													if (largerHeight == 0) {
														largerHeight = height;
													} else if (height > largerHeight) {
														largerHeight = height;
													}
												}

												if (index == size - 1) {
													needScale = false;
													this.props.onChangeHeight(largerHeight);
												}
											}
										}}>
										<ImageButton
											icon={icon}
											style={[!this.props.circle && { borderWidth: R.dimens.CardViewElivation, borderRadius: R.dimens.paginationButtonRadious, borderColor: R.colors.white, }]}
											iconStyle={[{ width: R.dimens.listImageHeightWidth, height: R.dimens.listImageHeightWidth, tintColor: tintColor }, this.props.imageButtonStyle]}
											onPress={this.props.onPress} />
										<TextViewHML style={{ color: R.colors.white, paddingTop: R.dimens.widgetMargin, fontSize: R.dimens.smallText, textAlign: 'center', }}>{value}</TextViewHML>

									</View>
								}
							</View >
						</CardView>
					</View>
				</AnimatableItem>
			);
		} else {
			if (screenname === 'email') {

				return (
					<AnimatableItem>

						<CardView
							onPress={this.props.onPress}
							cardBackground={type === 1 ? R.colors.cardBackground : R.colors.accent}
							style={{
								...this.styles().cardViewStyle,
								marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
								marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
							}}>

							{/* Image */}
							<View style={{ marginLeft: R.dimens.widgetMargin, alignItems: 'flex-start', }}>
								{type === 1 ?
									<ImageButton
										icon={icon}
										style={{ marginLeft: 0, padding: R.dimens.widgetMargin, backgroundColor: this.valueget(value), borderRadius: R.dimens.paginationButtonRadious }}
										iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }, this.props.imageStyle]}
										onPress={this.props.onPress}
									/>
									:
									<ImageButton
										icon={icon}
										style={[!this.props.circle && { marginLeft: 0, padding: R.dimens.widgetMargin, borderRadius: R.dimens.paginationButtonRadious, backgroundColor: R.colors.white, }]}
										iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.cardValue, alignItems: 'center', }, this.props.imageButtonStyle]}
										onPress={this.props.onPress}
									/>
								}
							</View>

							<View style={{ width: wp('70%'), justifyContent: 'center' }}>
								<Text style={{ color: type === 1 ? this.valueget(value) : R.colors.white, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{value}</Text>
								{title === null ? null : <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{title}</Text>}
							</View>
						</CardView>
					</AnimatableItem>
				)
			} else {

				return (
					<AnimatableItem>

						<CardView
							onPress={this.props.onPress}
							cardBackground={type === 1 ? R.colors.cardBackground : R.colors.accent}
							style={{
								...this.styles().cardViewStyle,
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
								marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
								...cardStyle
							}}>

							{/* Image */}
							<View style={{ marginLeft: R.dimens.widgetMargin, width: wp('15%'), justifyContent: 'center', alignItems: 'center', }}>
								{type === 1 ?

									<ImageButton
										icon={icon}
										style={{ marginLeft: 0, padding: R.dimens.widgetMargin, backgroundColor: imageBack != '' ? imageBack : this.valueget(value), borderRadius: R.dimens.paginationButtonRadious }}
										iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }, this.props.imageStyle]}
										onPress={this.props.onPress}
									/>
									:
									<ImageButton
										icon={icon}
										style={[!this.props.circle && { marginLeft: 0, padding: R.dimens.widgetMargin, borderRadius: R.dimens.paginationButtonRadious, backgroundColor: R.colors.white }]}
										iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.accent }, this.props.imageButtonStyle]}
										onPress={this.props.onPress}
									/>
								}
							</View>

							<View style={{ width: wp('70%') }}>
								<TextViewHML style={{ color: type === 1 ? imageBack != '' ? R.colors.white : this.valueget(value) : R.colors.white, fontSize: R.dimens.smallText, }}>{value}</TextViewHML>
							</View>

							<View style={{ flex: 1, width: wp('15%'), alignItems: 'flex-end', marginRight: R.dimens.widget_left_right_margin }}>
								<Text style={{ color: imageBack != '' ? R.colors.white : R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{title}</Text>
							</View>
						</CardView>
					</AnimatableItem>
				)
			}
		}
	}
	styles = () => {
		return {
			cardViewStyle: {
				flex: 1,
				flexDirection: 'row',
				marginLeft: R.dimens.widget_left_right_margin,
				marginRight: R.dimens.widget_left_right_margin,
				padding: 0,
			},
		}
	}
}

function mapStateToProps(state) {
	return {
		//For Update isPortrait true or false
		width: state.preference.dimensions.width,
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomCard)