import React, { Component } from 'react'
import { Text, View, FlatList, Linking, TouchableOpacity } from 'react-native'
import { changeTheme, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { validateValue } from '../../../validations/CommonValidation';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import Button from '../../../native_theme/components/Button';

export class DepositReconListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            DepositReport: props.navigation.state.params && props.navigation.state.params.item,
            IDS: props.navigation.state.params && props.navigation.state.params.IDS,
            FilterDepositResponse: [],
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        let list = []
        for (let i = 0; i < this.state.DepositReport.length; i++) {
            for (let j = 0; j < this.state.IDS.length; j++) {
                if (this.state.IDS[j] == this.state.DepositReport[i].TrnNo) {
                    list.push(this.state.DepositReport[i])
                }
            }
        }
        this.setState({ FilterDepositResponse: list })
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //This Method Is used to open Address in Browser With Specific Link
    onTrnLinkPress = (item) => {
        try {
            let res = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
            Linking.openURL((res.length) ? res[0].Data + '/' + item.TrnId : item.TrnId);
        } catch (error) {
            //handle catch block here
        }
    }

    render() {
        let finalItems = this.state.FilterDepositResponse
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.depositReconcilation}
                    isBack={true}
                    nav={this.props.navigation} />

                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, alignSelf: 'center', }}>{R.strings.depositReconcilationMessage}</TextViewHML>

                <View style={{ flex: 1, justifyContent: 'space-between', }}>
                    <FlatList
                        data={finalItems}
                        showsVerticalScrollIndicator={false}
                        // render all item in list
                        renderItem={({ item, index }) => <DepositReconListItem
                            index={index}
                            item={item}
                            size={finalItems.length}
                            onTrnIdPress={() => this.onTrnLinkPress(item)} />
                        }
                        // assign index as key value to Deposit Report list item
                        keyExtractor={(_item, index) => index.toString()}
                        contentContainerStyle={contentContainerStyle(finalItems)}
                        // Displayed empty component when no record found 
                        ListEmptyComponent={<ListEmptyComponent />}
                    />

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.confirm} onPress={() => this.props.navigation.navigate('DepositReconScreen', { IDS: this.state.IDS })}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class DepositReconListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item && this.props.isSelected === nextProps.isSelected)
            return false
        return true
    }

    render() {
        let { size, index, item, onPress, onTrnIdPress, isSelected } = this.props

        let color = R.colors.yellow
        if (item.Status == 1)
            color = R.colors.successGreen
        else if (item.Status == 9)
            color = R.colors.failRed
        else if (item.Status == 0)
            color = R.colors.accent
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? (isSelected ? R.dimens.widgetMargin : R.dimens.widget_top_bottom_margin) : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0, elevation: R.dimens.listCardElevation,
                    }} onPress={onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* Currency Image */}
                            <ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                {/* for show username,amount and currency */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.CoinName)}</Text>

                                    <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}
                                    </Text>
                                </View>

                                {/* User Name */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Username + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.UserName)}</TextViewHML>
                                </View>

                                {/* Transaction Id */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.transactionId + ': '}</TextViewHML>
                                    {
                                        (item.TrnId && item.ExplorerLink) ?
                                            <View style={{ flex: 1, }}>
                                                <TouchableOpacity onPress={onTrnIdPress}>
                                                    <TextViewHML numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: R.dimens.smallestText, color: R.colors.accent, }}>{validateValue(item.TrnId)}</TextViewHML>
                                                </TouchableOpacity>
                                            </View> :
                                            <View style={{ flex: 1 }}>
                                                <TextViewHML numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.TrnId)}</TextViewHML>
                                            </View>
                                    }
                                </View>

                                {/* Organization Name */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Organization + ': '}</TextViewHML>
                                    <TextViewHML numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.OrganizationName)}</TextViewHML>
                                </View>

                            </View>
                        </View>

                        {/* for show status and recon icon */}
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusChip
                                color={color}
                                value={item.StatusStr ? item.StatusStr : '-'} />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

export default DepositReconListScreen
