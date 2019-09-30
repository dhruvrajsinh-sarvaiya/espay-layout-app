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
import ColumnItem from '../../../native_theme/components/ColumnItem';

export class RequestFormatApiListDetailScreen extends Component {
    constructor(props) {
        super(props);
        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
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
                start={{ x: 0, y: 0 }}
                locations={[0, 1]}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]} style={{ flex: 1, }}
                end={{ x: 0, y: 1 }}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        textStyle={{ color: 'white' }}
                        title={R.strings.requestFormatApi}
                        isBack={true} nav={this.props.navigation}
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                    />
                    {/* To Show MethodType */}
                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                fontSize: R.dimens.smallText,
                                color: R.colors.white,
                                textAlign: 'left',
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{R.strings.method}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.mediumText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{validateValue(item.MethodType)}</Text>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                        showsVerticalScrollIndicator={false}  keyboardShouldPersistTaps={'always'}>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            backgroundColor: R.colors.cardBackground,
                            padding: 0,
                            margin: R.dimens.margin_top_bottom,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* To show RequestName */}
                            <Text style={{
                                margin: R.dimens.widget_top_bottom_margin, flex: 1,
                                textAlign: 'left',
                                marginLeft: R.dimens.padding_left_right_margin,
                                marginBottom: 0,color: R.colors.textPrimary,
                                fontSize: R.dimens.mediumText, fontWeight: 'bold',
                                fontFamily: Fonts.MontserratSemiBold
                            }}>
                            {validateValue(item.RequestName)}</Text>

                            {/* To show ContentType */}
                            <RowItem
                                title={R.strings.contentType}
                                value={validateValue(item.ContentType)}
                            />

                            {/* To show Status  */}
                            <RowItem title={R.strings.Status} value={item.statusStatic} status={true} color={item.Status == 0 ? R.colors.failRed : R.colors.successGreen} />

                            {/* To show RequestFormat */}
                            <ColumnItem
                                marginBottom={true} title={R.strings.requestFormat}
                                value={validateValue(item.RequestFormat)}
                            />
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient >
        )
    }
}

export default RequestFormatApiListDetailScreen
