import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, FlatList } from 'react-native';
import R from '../../R';
import TextViewHML from '../TextViewHML';
import { getCardStyle } from '../CardView';
import { parseIntVal } from '../../../controllers/CommonUtils';
import TextViewMR from '../TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../ImageTextButton';

class MultipleSelectionButton extends Component {
	constructor(props) {
		super(props);

		//Define All initial State
		this.state = {
			width: 0,
			data: props.data ? props.data : [],
			viewMore: props.viewMore ? props.viewMore : false,
			selectedList: props.selectedList !== undefined ? props.selectedList : [],
		};
	}

	updateList = (list) => {

		//return selected items in main Screen
		this.props.selectedItems(list ? list : [])

		//store new list
		this.setState({ selectedList: list })
	}

	// for remove item from selected list
	removeItem = (item, index) => {

		//getting whole list
		let selectedList = this.state.selectedList;

		//Finding index of item to be removed
		let removalIndex = selectedList.findIndex(el => el.value == item.value);

		//If item found then remove that item from list and update record
		removalIndex > -1 && selectedList.splice(removalIndex, 1);

		//return selected items in main Screen
		this.props.selectedItems(selectedList)

		//Update array
		this.setState({ selectedList: selectedList });
	}

	static oldProps = {};

	//handle response with new life cycle
	static getDerivedStateFromProps(props, state) {

		// To Skip Render if old and new props are equal
		if (MultipleSelectionButton.oldProps !== props) {
			MultipleSelectionButton.oldProps = props;
		} else return null;

		//Get All Updated Feild of Particular actions
		const { data } = props;
		//if array is not same as state then store array
		if (state.data !== data) {
			try {
				return { data: data }
			} catch (e) {
				return null;
				//Handle Catch and Notify User to Exception.
			}
		}
		return null
	}

	render() {
		// How many column you want to need
		let numColumn = this.props.numColumns ? parseIntVal(this.props.numColumns) : 4

		// get required params from props for navigating screen
		let { navigate } = this.props;

		return (
			<View style={{ flex: 1 }}>
				{this.props.header &&
					<View style={{ flexDirection: 'row' }}>
						<TextViewMR style={this.styles().text_style}>{this.props.header}
							{this.props.isRequired && <TextViewMR style={{ color: R.colors.failRed }}> *</TextViewMR>}</TextViewMR>
					</View>
				}

				{/* Navigating Button to redirect to Selection Screen */}
				<TouchableWithoutFeedback disabled={this.props.disabled ? this.props.disabled : false} onPress={() => navigate('MultipleSelection', { data: this.state.data, selectedList: this.state.selectedList, updateList: this.updateList, })}>
					<View style={[{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						padding: R.dimens.widgetMargin,
						borderRadius: R.dimens.cardBorderRadius,
						height: R.dimens.ButtonHeight,
						backgroundColor: R.colors.cardBackground,
						marginTop: R.dimens.widgetMargin,
						...getCardStyle(R.dimens.CardViewElivation),
					}, this.props.style]}>
						<TextViewHML style={{
							flex: 1,
							paddingLeft: R.dimens.widgetMargin,
							fontSize: R.dimens.smallText,
							color: R.colors.textSecondary
						}}>{R.strings.Please_Select}</TextViewHML>

						<ImageTextButton
							style={{ marginRight: R.dimens.widgetMargin, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, margin: 0 }}
							icon={R.images.IC_RIGHT_ARROW}
							iconStyle={{ tintColor: R.colors.textSecondary, height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE }}
						/>

					</View>
				</TouchableWithoutFeedback>

				{/* Selected Items will be display here with cancel button */}
				<View style={{ flex: 1, marginTop: R.dimens.margin }} onLayout={(event) => {
					let { width } = event.nativeEvent.layout;
					this.setState({ width: width / numColumn })
				}}>
					<FlatList
						data={this.state.selectedList ? this.state.selectedList : []}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => index.toString()}
						extraData={this.state}
						numColumns={numColumn}
						renderItem={({ item, index }) => {
							if (this.state.viewMore) {
								return (
									(index < 3) ?
										<View style={this.styles().selectionView}>
											<View style={this.styles().selectionSubView}>

												<TextViewHML style={this.styles().valueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{item.value}</TextViewHML>

												<ImageTextButton
													style={{ marginRight: R.dimens.margin, marginLeft: R.dimens.LineHeight, margin: 0 }}
													icon={R.images.IC_CANCEL}
													iconStyle={{ tintColor: R.colors.textSecondary, height: R.dimens.SMALLEST_ICON_SIZE, width: R.dimens.SMALLEST_ICON_SIZE }}
													onPress={() => this.removeItem(item, index)}
												/>

											</View>
										</View>
										:
										index == 3 ?
											<View style={{ flex: 1, paddingRight: R.dimens.margin, }}>

												<ImageTextButton
													style={{ alignSelf: 'flex-end', margin: 0 }}
													icon={R.images.IC_MORE}
													iconStyle={{ tintColor: R.colors.textSecondary, height: R.dimens.IconWidthHeight, width: R.dimens.IconWidthHeight }}
													onPress={() => navigate('MultipleSelection', { data: this.state.selectedList, selectedList: this.state.selectedList, updateList: this.updateList })}
												/>
											</View>
											: null
								)
							}

							return (
								<View style={this.styles().selectionView}>
									<View style={this.styles().selectionSubView}>
										<TextViewHML style={this.styles().valueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{item.value}</TextViewHML>

										<ImageTextButton
											style={{ marginRight: R.dimens.margin, marginLeft: R.dimens.LineHeight, margin: 0 }}
											icon={R.images.IC_CANCEL}
											iconStyle={{ tintColor: R.colors.textSecondary, height: R.dimens.SMALLEST_ICON_SIZE, width: R.dimens.SMALLEST_ICON_SIZE }}
											onPress={() => this.removeItem(item, index)}
										/>
									</View>
								</View>
							);
						}}
					/>
				</View>

			</View>
		);
	}

	//Common Style For From Date and To Date
	styles = () => {
		return {
			text_style: {
				color: R.colors.textPrimary,
				fontSize: R.dimens.smallText,
				marginLeft: R.dimens.LineHeight,
				fontFamily: Fonts.MontserratRegular,
				alignSelf: 'flex-start',
			},
			selectionView: {
				width: this.state.width,
				padding: R.dimens.widgetMargin,
				justifyContent: 'center'
			},
			selectionSubView: {
				flexDirection: 'row',
				justifyContent: 'center',
				paddingLeft: R.dimens.margin,
				borderColor: R.colors.textSecondary,
				paddingRight: R.dimens.margin,
				paddingTop: R.dimens.widgetMargin,
				paddingBottom: R.dimens.widgetMargin,
				alignItems: 'center',
				borderWidth: 1,
				borderRadius: R.dimens.LoginButtonBorderRadius,
			},
			valueStyle: {
				marginLeft: R.dimens.margin,
				color: R.colors.textSecondary,
				fontSize: R.dimens.smallestText,
				justifyContent: 'center', width: '90%'
			}
		}
	}
}

export default MultipleSelectionButton;
