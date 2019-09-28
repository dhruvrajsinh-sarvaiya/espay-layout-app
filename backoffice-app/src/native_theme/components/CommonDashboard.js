import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from './CommonStatusBar';
import CustomToolbar from './CustomToolbar';
import { changeTheme } from '../../controllers/CommonUtils';
import { isEmpty } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../../components/Navigation';
import ImageButton from './ImageTextButton';
import R from '../R';
import ThemeToolbarWidget from '../../components/widget/ThemeToolbarWidget';
import CustomCard from '../../components/widget/CustomCard';
import DashboardHeader from '../../components/widget/DashboardHeader';
import SafeView from './SafeView';
const { width } = R.screen()

class CommonDashboard extends Component {
    constructor(props) {
        super(props);

        // getting data from previous screen
        let response = props.navigation.state.params && props.navigation.state.params.response
        let title = props.navigation.state.params && props.navigation.state.params.title

        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: response,
            title: title,
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    async onPress(id) {
        let { response } = this.state
        this.props.navigation.navigate(response[id].navigate,
            { screenType: response[id].screenType != undefined ? response[id].screenType : 0 })
    }

    render() {

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={this.state.title}
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
                                icon={item.icon}
                                value={isEmpty(item.value) ? item.title : item.value}
                                title={isEmpty(item.value) ? item.value : item.title}
                                index={index}
                                width={width}
                                size={this.state.response.length}
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

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        icon={R.images.BACK_ARROW}
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default CommonDashboard;