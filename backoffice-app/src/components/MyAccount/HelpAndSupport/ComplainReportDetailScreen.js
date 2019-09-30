import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import { validateValue, isEmpty } from '../../../validations/CommonValidation';
import SafeView from '../../../native_theme/components/SafeView';

class ComplainReportDetailScreen extends Component {
    constructor(props) {
        super(props);

        //fill data from list screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.ITEM
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        /* stop twice api call */
        return isCurrentScreen(nextProps)
    };

    onPostReplyPress = () => {
        let { navigate } = this.props.navigation
        //redirect ReplyComplainScreen screenF
        navigate('ReplyComplainScreen', { ComplainId: this.state.item.ComplainId, Subject: this.state.item.Subject })
    }

    // Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
    rightMenuRender = () => {
        let color;

        //apply colors based on status
        if ((this.state.item.Status).toLowerCase() === "open")
            color = R.colors.successGreen
        else if ((this.state.item.Status).toLowerCase() === "closed")
            color = R.colors.failRed
        else
            color = R.colors.yellow


        return <CardView style={this.styles().cardview}>
            {/* Display complain number */}
            <View style={{ paddingLeft: R.dimens.padding_left_right_margin, paddingRight: R.dimens.padding_left_right_margin }}>
                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{this.state.item.ComplainId ? this.state.item.ComplainId : '-'}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: color }}>{this.state.item.Status ? this.state.item.Status : '-'}</TextViewHML>
            </View>
        </CardView>
    }

    render() {

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Raise_Complain}
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={this.rightMenuRender()} />

                {/* Detail */}
                <ScrollView showsVerticalScrollIndicator={false} style={{ padding: R.dimens.WidgetPadding, }}>
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

                    {/* for Display Created date */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.created_at + ': '}</TextViewHML>
                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{this.state.item.CreatedDate ? convertDateTime(this.state.item.CreatedDate) : '-'}</TextViewHML>
                    </View>

                    {/* Name */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widget_top_bottom_margin }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.Username + ': '}</TextViewHML>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{validateValue(this.state.item.UserName)}</TextViewHML>
                    </View>

                    {/* Type */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widget_top_bottom_margin }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.type + ': '}</TextViewHML>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{validateValue(this.state.item.Type)}</TextViewHML>
                    </View>

                    {/* Remarks */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widget_top_bottom_margin, }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.remarks + ': '}</TextViewHML>
                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{validateValue(this.state.item.Remark)}</TextViewHML>
                    </View>

                    {/* for display remarks */}
                    {
                        !isEmpty(this.state.item.Description) &&
                        <View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.description + ': '}</TextViewHML>
                            <CardView style={{
                                paddingTop: R.dimens.widgetMargin,
                                paddingBottom: R.dimens.widgetMargin,
                                margin: R.dimens.CardViewElivation,
                            }}
                                cardElevation={R.dimens.CardViewElivation}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'justify' }}>{this.state.item.Description}</TextViewHML>
                            </CardView>
                        </View>
                    }

                </ScrollView>
            </SafeView>
        )
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
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

export default ComplainReportDetailScreen;
