import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import R from '../../../native_theme/R';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen()

class IpProfilingDash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.listIpRange, icon: R.images.ic_list_alt, id: 1 },
                { title: R.strings.allowIpRange, icon: R.images.IC_PLUS, id: 2 },
            ],
        };
    }

    shouldComponentUpdate = (_nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(_nextProps);
    };

    onPress = (id) => {
        //redirect screen based on card select
        if (id === 1) {
            this.props.navigation.navigate('ListIpRange')
        }
        else if (id === 2) {
            this.props.navigation.navigate('AddEditAllowIp', { fromDashboard: true })
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* Statusbar */}
                <CommonStatusBar />

                {/* Set Toolbar */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.ipProfiling}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    numColumns={this.state.isGrid ? 2 : 1}
                    data={this.state.response}
                    extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                width={width}
                                icon={item.icon}
                                value={item.title}
                                index={index}
                                size={this.state.response.length}
                                isGrid={this.state.isGrid}
                                type={1}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                viewHeight={this.state.viewHeight}
                                onPress={() => this.onPress(item.id)}
                            />
                        )
                    }}
                    keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        icon={R.images.BACK_ARROW}
                        style={{ height: R.dimens.SignUpButtonHeight, margin: 0, width: '20%', backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
            </SafeView>
        );
    }
}

export default IpProfilingDash;