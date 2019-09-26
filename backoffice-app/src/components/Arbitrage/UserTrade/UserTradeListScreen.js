import React, { Component } from 'react'
import { Text, View, Image, FlatList } from 'react-native'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme } from '../../../controllers/CommonUtils';
import SafeView from '../../../native_theme/components/SafeView';
import CardView from '../../../native_theme/components/CardView';
import { validateValue } from '../../../validations/CommonValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import Separator from '../../../native_theme/components/Separator';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import DashboardHeader from '../../widget/DashboardHeader';
import CustomCard from '../../widget/CustomCard';

export class UserTradeListScreen extends Component {
    constructor(props) {
        super(props);

        // fill data from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.UserTradeResponse;

        // if item is not null and undefind than display record otherwise no reord display 
        let array = item ? [
            { title: R.strings.Today, count: item.Today.Total, ...item.Today, icon: R.images.ic_calendar_check, id: 1 },
            { title: R.strings.This_Week, count: item.Week.Total, ...item.Week, icon: R.images.ic_calendar_plus, id: 2 },
            { title: R.strings.This_Month, count: item.Month.Total, ...item.Month, icon: R.images.ic_calendar, id: 3 },
            { title: R.strings.This_Year, count: item.Year.Total, ...item.Year, icon: R.images.ic_calendar_blank, id: 4 },
        ] : [];

        //fill all the data from previous screen
        this.state = {
            item: array,
            viewHeight: 0,
            isGrid: false,
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    async onPress(item) {

        // On Card Press Navigate User to User Trade list Detail Screen Screen 
        this.props.navigation.navigate('UserTradeListDetailScreen', { Id: item.id })
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.arbitrage + ' ' + R.strings.UserTrade}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <View style={{ flex: 1 }}>
                    <FlatList
                        key={this.state.isGrid ? 'List' : 'Grid'}
                        data={this.state.item}
                        extraData={this.state}
                        numColumns={this.state.isGrid ? 2 : 1}
                        showsVerticalScrollIndicator={false}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return <SubDashboardItem
                                index={index}
                                item={item}
                                onPress={() => this.onPress(item)}
                                isGrid={this.state.isGrid}
                                type={this.state.type}
                                size={this.state.item.length}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                viewHeight={this.state.viewHeight}
                            />
                        }}
                        // assign index as key value item
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>
            </SafeView>
        )
    }
}

function SubDashboardItem(props) {

    let { index, item, size, isGrid, onChangeHeight, viewHeight, onPress, type } = props;

    if (isGrid) {
        return <CustomCard
            icon={item.icon}
            value={item.title}
            title={validateValue(item.count)}
            index={index}
            size={size}
            isGrid={true}
            type={1}
            viewHeight={viewHeight}
            onChangeHeight={onChangeHeight}
            onPress={onPress} />
    } else {
        return <CardListType
            icon={item.icon}
            title={item.title}
            index={index}
            item={item}
            viewHeight={viewHeight}
            onChangeHeight={onChangeHeight}
            size={size}
            type={type}
            onPress={onPress} />
    }
}

function CardListType({ isFirst, isLast, onPress, item, icon, title }) {
    return (
        <CardView style={{
            flex: 1,
            marginLeft: R.dimens.widget_left_right_margin,
            marginRight: R.dimens.widget_left_right_margin,
            marginTop: isFirst ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
            marginBottom: isLast ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
        }} onPress={onPress}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* for show icon, title and total */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ padding: R.dimens.margin, backgroundColor: R.colors.accent, borderRadius: R.dimens.QRCodeIconWidthHeight }}>
                        <Image
                            source={icon}
                            style={{ alignSelf: 'flex-end', width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                        />
                    </View>
                    <Text style={{
                        marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.mediumText,
                        color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold
                    }}>{title}</Text>
                </View>
                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>
                    {validateValue(item.Total)}</Text>
            </View>

            {/* for show Separator */}
            <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }} />

            {/* for show Active, Settled, Cancel, PartialCancel and SystemFail */}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.open}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Active)}</TextViewHML>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.Settled}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Settled)}</TextViewHML>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.cancel}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Cancel)}</TextViewHML>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.partiallyCancel}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.PartialCancel)}</TextViewHML>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.Failed}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.SystemFail)}</TextViewHML>
            </View>
        </CardView >
    )
}

export default UserTradeListScreen