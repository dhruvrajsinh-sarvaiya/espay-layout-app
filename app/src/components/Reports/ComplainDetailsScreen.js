import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { changeTheme, convertDateTime } from '../../controllers/CommonUtils';
import R from '../../native_theme/R';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';

export default class ComplainDetailsScreen extends Component {

    constructor(props) {
        super(props);

        let { params } = this.props.navigation.state;

        //Define All initial State
        this.state = {
            item: params.ITEM,
            type: params.type
        };
        //----------
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //redirect to reply complaint screen
    onPostReplyPress = () => {
        var { navigate } = this.props.navigation
        navigate('ReplyComplainScreen', { cid: this.state.item.CompainNumber, subject: this.state.item.Subject, onRefresh: this.onRefresh })
    }

    // Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
    rightMenuRender = () => {
        let color;

        //apply colors based on status
        if ((this.state.item.Status).toLowerCase() === "open") {
            color = R.colors.successGreen
        } else if ((this.state.item.Status).toLowerCase() === "closed") {
            color = R.colors.failRed
        } else {
            color = R.colors.yellow
        }

        return <CardView style={this.styles().cardview}>
            {/* Display complain number */}
            <View style={{ paddingLeft: R.dimens.padding_left_right_margin, paddingRight: R.dimens.padding_left_right_margin }}>
                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{this.state.item.CompainNumber ? this.state.item.CompainNumber : '-'}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: color }}>{this.state.item.Status ? this.state.item.Status : '-'}</TextViewHML>
            </View>
        </CardView>
    }

    render() {

        return (
            <SafeView isDetail={true} style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Raise_Complain}
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={this.rightMenuRender()} />

                {/* Display Rest of All Details */}
                <ScrollView showsVerticalScrollIndicator={false} style={this.styles().containerView}>
                    <View style={this.styles().subjectview}>
                        <Text style={{ flex: 1, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary, marginRight: R.dimens.margin }}>{this.state.item.Subject ? this.state.item.Subject : '-'}</Text>
                        <View style={{ justifyContent: 'flex-end', }}>
                            <ImageTextButton
                                name={R.strings.postreply}
                                onPress={this.onPostReplyPress}
                                textStyle={{
                                    color: R.colors.accent,
                                    fontSize: R.dimens.dashboardSelectedTabText,
                                    textAlign: 'center'
                                }}
                                style={{
                                    margin: 0,
                                    borderWidth: R.dimens.pickerBorderWidth,
                                    borderColor: R.colors.accent,
                                    alignItems: 'center',
                                    paddingLeft: R.dimens.WidgetPadding,
                                    paddingRight: R.dimens.WidgetPadding,
                                    paddingTop: R.dimens.widgetMargin,
                                    paddingBottom: R.dimens.widgetMargin
                                }}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 1, marginBottom: R.dimens.widget_top_bottom_margin, flexDirection: 'row' }}>
                        {/* for Display Created date */}
                        <View style={{ flex: 0.70, flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{(R.strings.created_at)}: </TextViewHML>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{this.state.item.CreatedDate ? convertDateTime(this.state.item.CreatedDate) : '-'}</TextViewHML>
                        </View>
                    </View>

                    {/* for display type */}
                    <View style={{ flexDirection: 'row' }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.type} : </TextViewHML>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.state.type ? this.state.type : '-'}</TextViewHML>
                    </View>

                    {/* for display Remarks */}
                    <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.remarks} : </TextViewHML>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.state.item.Remark ? this.state.item.Remark : '-'}</TextViewHML>
                    </View>

                    {/* for display description */}
                    <CardView style={{
                        paddingTop: R.dimens.widgetMargin,
                        paddingBottom: R.dimens.widgetMargin,
                        margin: R.dimens.CardViewElivation,
                    }}
                        cardElevation={R.dimens.CardViewElivation}>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'justify' }}>{this.state.item.Description ? this.state.item.Description : '-'}</TextViewHML>
                    </CardView>

                </ScrollView>
            </SafeView>
        );
    }

    // styles for this class
    styles = () => {
        return {
            containerView: {
                padding: R.dimens.WidgetPadding,
                backgroundColor: R.colors.background
            },
            cardview: {
                backgroundColor: R.colors.white,
                borderTopLeftRadius: R.dimens.roundButtonRedius,
                borderBottomLeftRadius: R.dimens.roundButtonRedius,
                elevation: R.dimens.CardViewElivation,
                borderRightWidth: 0,
                padding: 0,
                justifyContent: 'center',
            },
            subjectview: {
                flexDirection: 'row',
                paddingTop: R.dimens.WidgetPadding,
                paddingBottom: R.dimens.WidgetPadding,
                marginTop: R.dimens.widgetMargin,
                marginBottom: R.dimens.widgetMargin,
                alignItems: 'center',
            }
        }
    }
}