import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import R from '../../../native_theme/R';
import { changeTheme } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CustomCard from '../../widget/CustomCard';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';

class RoleManagementDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            isGrid: true,
            data: [
                { id: 1, title: null, value: R.strings.ListRoles, icon: R.images.IC_VIEW_LIST, type: 1 },
                { id: 2, title: null, value: R.strings.RoleAssignHistory, icon: R.images.IC_WITHDRAW_HISTORY, type: 1 },
                { id: 3, title: null, value: R.strings.listUnasignUserRole, icon: R.images.IC_VIEW_LIST, type: 1 },
                { id: 4, value: R.strings.AddRoles, icon: R.images.IC_PLUS, type: 2 },
            ],
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.F
        changeTheme();
    }

    onCustomCardPress = (item) => {
        let { navigate } = this.props.navigation

        //redirect screen based on card select
        if (item == 1)
            navigate('RoleModuleScreen')
        else if (item == 2)
            navigate('RoleAssignHistoryScreen')
        else if (item == 3)
            navigate('UnSignedUserRoleScreen')
        else if (item == 4)
            navigate('AddEditRoleModuleScreen', { item: undefined })
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
                <DashboardHeader navigation={this.props.navigation} header={R.strings.RoleManagement} isGrid={this.state.isGrid} onPress={() => this.setState({ isGrid: !this.state.isGrid })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <FlatList
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
                        showsVerticalScrollIndicator={false}
                        data={this.state.data}
                        extraData={this.state}
                        /* render all item in list */
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    index={index}
                                    isGrid={this.state.isGrid}
                                    title={item.title}
                                    value={item.value}
                                    size={this.state.data.length}
                                    type={item.type}
                                    icon={item.icon}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height })
                                    }}
                                    viewHeight={this.state.viewHeight}
                                    onPress={() => this.onCustomCardPress(item.id)} />
                            )
                        }} keyExtractor={(item, index) => index.toString()}
                    />

                    <View style={{ margin: R.dimens.widget_top_bottom_margin }}>
                        <ImageButton
                            style={{ 
                                margin: 0, width: '20%', 
                                height: R.dimens.SignUpButtonHeight, 
                                backgroundColor: R.colors.white, 
                                elevation: R.dimens.CardViewElivation, 
                                borderRadius: R.dimens.roundButtonRedius, 
                                justifyContent: 'center', alignItems: 'center' }}
                                iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                                icon={R.images.BACK_ARROW}
                            onPress={() => this.props.navigation.goBack()} 
                            />
                    </View>
                </View>
            </SafeView>
        );
    }
}

export default RoleManagementDashboard;
