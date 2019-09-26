import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import R from '../../../native_theme/R';
import { parseIntVal } from '../../../controllers/CommonUtils';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';

class EmailQueMultipleSelectionButton extends Component {
	constructor(props) {
		super(props);

		//Define All initial State
		this.state = {
			width: 0,
			data: props.data,
			count: false,
		};
	}

	static oldProps = {};

	//handle response with new life cycle
	static getDerivedStateFromProps(props, state) {

		// To Skip Render if old and new props are equal
		if (EmailQueMultipleSelectionButton.oldProps !== props) {
			EmailQueMultipleSelectionButton.oldProps = props;
		} else {
			return null;
		}

		//Get All Updated Feild of Particular actions
		const { data } = props;
		//if array is not same as state then store array
		if (state.data !== data) {
			try {
				return {
					data: data
				}
			} catch (e) {
				return null;
				//Handle Catch and Notify User to Exception.
			}
		}
		return null;
	}

	render() {

		// get required params from props for navigating screen
		let { navigate } = this.props;

		let numColumn = this.props.numColumns ? parseIntVal(this.props.numColumns) : 4
		return (
			<View style={{ flex: 1 }}>
				{this.props.header &&
					<View style={{ flexDirection: 'row' }}>
						<TextViewMR style={this.styles().text_style}>{this.props.header}</TextViewMR>
					</View>
				}

				{/* Selected Items will be display here with cancel button */}
				<View style={{ flex: 1 }} onLayout={(event) => {
					let { width } = event.nativeEvent.layout;
					this.setState({ width: width / numColumn })
				}}>
					<FlatList
						data={this.state.data}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => index.toString()}
						extraData={this.state}
						numColumns={numColumn}
						renderItem={({ item, index }) => {
							return (
								(index < 3) ?
									<View style={this.styles().selectionView}>
										<View style={this.styles().selectionSubView}>

											<TextViewHML style={this.styles().valueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{item.value}</TextViewHML>
										</View>

									</View>
									:
									index == 3 ?
										<View style={{ flex: 1, paddingRight: R.dimens.margin, }}>
											<ImageTextButton
												style={{ alignSelf: 'flex-end', margin: 0 }}
												icon={R.images.IC_MORE}
												iconStyle={{ tintColor: R.colors.textSecondary, height: R.dimens.IconWidthHeight, width: R.dimens.IconWidthHeight }}
												onPress={() => navigate('EmailQueMultipleSelection', { data: this.state.data, })}
											/>
										</View>
										: null

							)
						}}
					/>
				</View>

			</View >
		);
	}

	//Common Style For From Date and To Date
	styles = () => {
		return {

			text_style: {
				fontSize: R.dimens.smallText,
				color: R.colors.textPrimary,
				marginLeft: R.dimens.LineHeight,
				alignSelf: 'flex-start',
				fontFamily: Fonts.MontserratRegular,
			},
			selectionView: {
				width: this.state.width,
				padding: R.dimens.widgetMargin,
				justifyContent: 'center'
			},
			selectionSubView: {
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				paddingLeft: R.dimens.margin,
				paddingRight: R.dimens.margin,
				paddingTop: R.dimens.widgetMargin,
				paddingBottom: R.dimens.widgetMargin,
				borderRadius: R.dimens.LoginButtonBorderRadius,
				borderColor: R.colors.textSecondary,
				borderWidth: 1,
			},
			valueStyle: {
				marginLeft: R.dimens.margin,
				color: R.colors.textSecondary,
				fontSize: R.dimens.smallestText,
				justifyContent: 'center',
				width: '100%'
			}
		}
	}
}

export default EmailQueMultipleSelectionButton;
