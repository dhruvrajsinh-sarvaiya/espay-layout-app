import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme } from '../../../controllers/CommonUtils';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import CardView from '../../../native_theme/components/CardView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';

export class ListApiMethodDetailScreen extends Component {
    constructor(props) {
        super(props)

        //fill all the data from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.item;

        // define all initial state
        this.state = {
            socketItem: Object.values(item.SocketMethods),
            restItem: Object.values(item.RestMethods),
            tabNames: [R.strings.SocketMethod, R.strings.RestMethod],
            tabPosition: 0,
            viewHeight: 0,
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    // Called when onPage Scrolling
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.ListApiMethod}
                    isBack={true}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1, }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        ref='ListApiMethodTab'
                        titles={this.state.tabNames}
                        numOfItems={2}
                        horizontalScroll={false}
                        isGradient={true}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                        onPageScroll={this.onPageScroll}>

                        {/* First Tab */}
                        <View style={{ flex: 1 }}>
                            {this.state.socketItem.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={this.state.socketItem}
                                        // render all item in list
                                        renderItem={({ item, index }) => {
                                            return <ListApiMethodDetailItem
                                                item={item}
                                                index={index}
                                                size={this.state.socketItem.length}
                                            />
                                        }}
                                        // assign index as key value to list item
                                        keyExtractor={(_item, index) => index.toString()}
                                    />
                                </View> :
                                // Displayed empty component when no record found 
                                <ListEmptyComponent />
                            }
                        </View>

                        {/* Second Tab */}
                        <View style={{ flex: 1 }}>
                            {this.state.restItem.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={this.state.restItem}
                                        // render all item in list
                                        renderItem={({ item, index }) => {
                                            return <ListApiMethodDetailItem item={item} index={index} size={this.state.restItem.length} />
                                        }}
                                        // assign index as key value to list item
                                        keyExtractor={(_item, index) => index.toString()}
                                    />
                                </View> :
                                // Displayed empty component when no record found 
                                <ListEmptyComponent />
                            }
                        </View>

                    </IndicatorViewPager>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ListApiMethodDetailItem extends Component {

    render() {

        let props = this.props
        let item = props.item;
        let size = props.size;
        let index = props.index;

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.padding_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.padding_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.activity_margin,
                    marginRight: R.dimens.activity_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={props.onDetailPress}>

                        <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>

                            <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.WidgetPadding }}>{item}</Text>

                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

export default ListApiMethodDetailScreen
