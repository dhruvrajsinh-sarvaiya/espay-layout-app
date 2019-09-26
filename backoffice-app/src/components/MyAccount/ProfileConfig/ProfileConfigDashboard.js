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

class ProfileConfigDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.listProfileConfiguration, icon: R.images.ic_list_alt, id: 1, type: 1 },
                { title: R.strings.AddProfileConfiguration, icon: R.images.IC_PLUS, id: 2, type: 2 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name. 
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    onPress(id) {

        //if list card select redirect to list screen else add screen 
        if (id === 1) this.props.navigation.navigate('ProfileConfigListScreen')

        else if (id === 2) this.props.navigation.navigate('ProfileConfigAddEditScreen', { fromDashboard: true })

    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* Statusbar */}
                <CommonStatusBar />

                {/* Set Toolbar */}
                <CustomToolbar
                    nav={this.props.navigation}
                    isBack={true}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    isGrid={this.state.isGrid}
                    header={R.strings.profileConfiguration}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    numColumns={this.state.isGrid ? 2 : 1}
                    extraData={this.state}
                    data={this.state.response}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                width={width}
                                icon={item.icon}
                                value={item.title}
                                size={this.state.response.length}
                                index={index}
                                isGrid={this.state.isGrid}
                                type={item.type}
                                viewHeight={this.state.viewHeight}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}

                            />

                        )
                    }}
                    keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin, }}>
                    <ImageButton
                        style={{ margin: 0, 
                            width: '20%', height: R.dimens.SignUpButtonHeight, 
                            backgroundColor: R.colors.white, 
                            elevation: R.dimens.CardViewElivation, 
                            borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        icon={R.images.BACK_ARROW}
                        iconStyle={[{ 
                            height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default ProfileConfigDashboard;