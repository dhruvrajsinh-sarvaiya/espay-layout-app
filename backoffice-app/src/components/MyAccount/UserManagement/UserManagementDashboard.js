import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../../controllers/CommonUtils';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CustomCard from '../../widget/CustomCard';
import DashboardHeader from '../../widget/DashboardHeader';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';

class UserManagementDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            isGrid: true,
            data: [
                { id: '1', title: null, value: R.strings.RuleManagement, icon: R.images.IC_KEY, type: 1 },
                { id: '2', title: null, value: R.strings.RoleManagement, icon: R.images.IC_CARDTYPE, type: 1 },
                // { id: '3', title: null, value: R.strings.PermissionGroups, icon: R.images.IC_ACCOUNT, type: 1 },
                { id: '4', title: null, value: R.strings.Users, icon: R.images.IC_ACCOUNT, type: 1 },
            ],
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    onCustomCardPress = (item) => {
        let { navigate } = this.props.navigation
        if (item === R.strings.RuleManagement)
            navigate('RuleManagementDashboard')
        else if (item === R.strings.RoleManagement)
            navigate('RoleManagementDashboard')
        else if (item === R.strings.PermissionGroups)
            navigate('CommonDashboard', {
                response: [
                    { title: R.strings.listPermissionGroups, icon: R.images.ic_list_alt, id: 0, navigate: '' },
                    { title: R.strings.addPermissionGroups, icon: R.images.IC_PLUS, id: 1, navigate: '' },
                ],
                title: R.strings.PermissionGroups
            })
        else if (item === R.strings.Users)
            navigate('UsersDashboard')
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* statusbar and actionbar  */}
                <CommonStatusBar />
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.UserManagement}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                    isGrid={this.state.isGrid}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <FlatList
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
                        data={this.state.data}
                        showsVerticalScrollIndicator={false}
                        extraData={this.state}
                        /* render all item in list */
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    index={index}
                                    isGrid={this.state.isGrid}
                                    size={this.state.data.length}
                                    title={item.title}
                                    icon={item.icon}
                                    value={item.value}
                                    type={item.type}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height })
                                    }}
                                    viewHeight={this.state.viewHeight}
                                    onPress={() => this.onCustomCardPress(item.value)} />

                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    <View style={{ margin: R.dimens.widget_top_bottom_margin }}>
                        <ImageButton
                            style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                            icon={R.images.BACK_ARROW}
                            iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                            onPress={() => this.props.navigation.goBack()} />
                    </View>
                </View>

            </SafeView>
        );
    }
}

export default UserManagementDashboard;
