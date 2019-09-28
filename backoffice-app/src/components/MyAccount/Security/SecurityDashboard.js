import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isInternet } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import R from '../../../native_theme/R';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen()

class SecurityDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CountData: null,
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.changePassword, icon: R.images.IC_KEY, id: 1 },
                { title: R.strings.security_question, icon: R.images.IC_WHITE_SECURITY, id: 2 },
                { title: R.strings.Ip_History, icon: R.images.IC_LOCATION, id: 3 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    async onPress(id) {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //redirect sccreen based on card select
            if (id === 1) {
                this.props.navigation.navigate('ResetPasswordComponent')
            }
            else if (id === 2) {
                this.props.navigation.navigate('SecurityQue')
            }
            else if (id === 3) {
                this.props.navigation.navigate('IpHistoryScreen')
            }
        }
    }

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
                    header={R.strings.Security}
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
                                value={item.title}
                                index={index}
                                width={width}
                                size={this.state.response.length}
                                isGrid={this.state.isGrid}
                                type={1}
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

export default SecurityDashboard;