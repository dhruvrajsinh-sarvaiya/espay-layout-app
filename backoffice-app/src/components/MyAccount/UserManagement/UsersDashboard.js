import React, { Component } from 'react';
import { View, FlatList, } from 'react-native';
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

class UsersDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.listUsers, icon: R.images.ic_list_alt, id: 1, type: 1 },
                { title: R.strings.AddUser, icon: R.images.IC_PLUS, id: 2, type: 2 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (_nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(_nextProps);
    };

    async onPress(id) {

        //Check NetWork is Available or not
        if (await isInternet()) {
            // if card 1 is select redirect to list screen 
            if (id === 1) {
                this.props.navigation.navigate('UsersListScreen')
            }
            //if card 2 is select redirect to add screen
            else if (id === 2) {
                this.props.navigation.navigate('AddEditUserScreen', { item: undefined })
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
                    isGrid={this.state.isGrid}
                    header={R.strings.User + ' ' + R.strings.dashboard}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    numColumns={this.state.isGrid ? 2 : 1}
                    showsVerticalScrollIndicator={false}
                    data={this.state.response}
                    extraData={this.state}
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                icon={item.icon}
                                viewHeight={this.state.viewHeight}
                                index={index}
                                width={width}
                                size={this.state.response.length}
                                value={item.title}
                                isGrid={this.state.isGrid}
                                type={item.type}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}
                            />

                        )
                    }} keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{
                    marginLeft: R.dimens.padding_left_right_margin,
                    marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin
                }}>
                    <ImageButton
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{
                            height: R.dimens.LARGE_MENU_ICON_SIZE,
                            width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent
                        }]}
                        icon={R.images.BACK_ARROW}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default UsersDashboard;