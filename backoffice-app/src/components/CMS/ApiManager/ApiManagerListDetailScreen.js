import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';

export class ApiManagerListDetailScreen extends Component {
    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
            titleScreen: props.navigation.state.params && props.navigation.state.params.titleScreen,
        }
    }

    
    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }
    
    componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }
    render() {
        let { item } = this.state
        return (
            <LinearGradient
                locations={[0, 1]}
                style={{ flex: 1, }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        textStyle={{ color: 'white' }}
                        title={this.state.titleScreen}
                        isBack={true} nav={this.props.navigation} 
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}/>

                    {/* To Show ServiceID */}
                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                fontSize: R.dimens.smallText,
                                color: R.colors.white,
                                textAlign: 'left',
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{R.strings.serviceId}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.mediumText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{validateValue(item.ServiceID)}</Text>
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

                            <Text style={{
                                margin: R.dimens.widget_top_bottom_margin,
                                textAlign: 'left',
                                color: R.colors.textPrimary,
                                marginLeft: R.dimens.padding_left_right_margin,
                                fontSize: R.dimens.mediumText,
                                marginBottom: 0,
                                flex: 1,
                                fontWeight: 'bold',
                                fontFamily: Fonts.MontserratSemiBold
                            }}>{validateValue(item.ServiceName)}</Text>


                            {/* For SenderID */}
                            <RowItem
                                title={R.strings.senderId}
                                value={validateValue(item.SenderID)}
                            />

                            {/* For Priority */}
                            <RowItem
                                title={R.strings.priority}
                                value={validateValue(item.Priority)}
                            />

                            {/* For Status  */}
                            <RowItem style={{ marginTop: R.dimens.widgetMargin }} title={R.strings.Status} value={item.statusStatic} status={true} color={item.status == 0 ? R.colors.failRed : R.colors.successGreen} />

                            {/* To set serivce provider*/}
                            <TextViewHML style={[this.styles().title]}>{R.strings.serivce_provider}</TextViewHML>
                            <TextViewHML style={[this.styles().value]}>{validateValue(item.SerproName)}</TextViewHML>

                            {/* To set User ID*/}
                            <TextViewHML style={[this.styles().title]}>{R.strings.userId}</TextViewHML>
                            <TextViewHML style={[this.styles().value]}>{validateValue(item.UserID)}</TextViewHML>

                            {/* To set Password */}
                            <TextViewHML style={[this.styles().title]}>{R.strings.Password}</TextViewHML>
                            <TextViewHML style={[this.styles().value]}>{validateValue(item.Password)}</TextViewHML>

                            {/* To set SendURL */}
                            <TextViewHML style={[this.styles().title]}>{R.strings.sendUrl}</TextViewHML>
                            <TextViewHML style={[this.styles().value, { paddingBottom: R.dimens.widget_top_bottom_margin }]}>{validateValue(item.SendURL)}</TextViewHML>
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient >
        )
    }
    // style for this class
    styles = () => {
        return {
            title: {
                flex: 1,
                fontSize: R.dimens.smallText,
                paddingRight: R.dimens.padding_left_right_margin,
                color: R.colors.textSecondary,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingTop: R.dimens.widgetMargin,
            },
            value: {
                flex: 1,
                fontSize: R.dimens.smallText,
                paddingLeft: R.dimens.padding_left_right_margin,
                color: R.colors.textPrimary,
                paddingRight: R.dimens.padding_left_right_margin,
            }
        }
    }
}

export default ApiManagerListDetailScreen
