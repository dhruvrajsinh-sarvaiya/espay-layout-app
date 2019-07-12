import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Image, FlatList } from 'react-native';
import R from '../../R';
import TextViewHML from '../TextViewHML';
import { getCardStyle } from '../CardView';

class MultipleSelectionButton extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            width: 0,
            data: props.data ? props.data : [],
            selectedList: props.selectedList ? props.selectedList : [],
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

        return (
            <View style={{ flex: 1 }}>

                {/* Navigating Button to redirect to Selection Screen */}
                <TouchableWithoutFeedback onPress={() => navigate('MultipleSelection', { data: this.state.data, selectedList: this.state.selectedList, updateList: this.updateList })}>
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
                        <Image source={R.images.IC_RIGHT_ARROW} style={{
                            marginRight: R.dimens.widgetMargin,
                            marginTop: R.dimens.widgetMargin,
                            marginBottom: R.dimens.widgetMargin,
                            tintColor: R.colors.textSecondary,
                            height: R.dimens.SMALL_MENU_ICON_SIZE,
                            width: R.dimens.SMALL_MENU_ICON_SIZE
                        }} />
                    </View>
                </TouchableWithoutFeedback>


                {/* Selected Items will be display here with cancel button */}
                <View style={{ flex: 1 }} onLayout={(event) => {
                    let { width } = event.nativeEvent.layout;
                    this.setState({ width: width / 4 })
                }}>
                    <FlatList
                        data={this.state.selectedList ? this.state.selectedList : []}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        extraData={this.state}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{
                                    width: this.state.width,
                                    padding: R.dimens.widgetMargin,
                                    justifyContent: 'center'
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: R.dimens.widgetMargin,
                                        borderRadius: R.dimens.LoginButtonBorderRadius,
                                        borderColor: R.colors.textSecondary,
                                        borderWidth: 1,
                                    }}>
                                        <TextViewHML style={{
                                            paddingLeft: R.dimens.margin,
                                            // paddingRight: R.dimens.widgetMargin,
                                            color: R.colors.textSecondary,
                                            fontSize: R.dimens.smallestText,
                                            justifyContent: 'center',
                                        }} ellipsizeMode={'tail'} numberOfLines={1}>{item.value}</TextViewHML>

                                        <TouchableWithoutFeedback onPress={() => this.removeItem(item, index)}>
                                            <Image source={R.images.IC_CANCEL} style={{
                                                marginRight: R.dimens.margin,
                                                marginLeft: R.dimens.LineHeight,
                                                tintColor: R.colors.textSecondary,
                                                height: R.dimens.SMALLEST_ICON_SIZE,
                                                width: R.dimens.SMALLEST_ICON_SIZE
                                            }} />
                                        </TouchableWithoutFeedback>

                                    </View>

                                </View>
                            );
                        }}
                        numColumns={4}
                    />
                </View>

            </View>
        );
    }
}

export default MultipleSelectionButton;
