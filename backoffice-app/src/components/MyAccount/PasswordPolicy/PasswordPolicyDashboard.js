import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import R from '../../../native_theme/R';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen()

class PasswordPolicyDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CountData: null,
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.listPassPolicy, icon: R.images.ic_list_alt, id: 1, type: 1 },
                { title: R.strings.addPasswordPolicy, icon: R.images.IC_PLUS, id: 2, type: 2 },
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
    async onPress(id) {
        if (id === 1) {
            this.props.navigation.navigate('PasswordPolicyListScreen')
        }
        else if (id === 2) {
            this.props.navigation.navigate('AddEditPasswordPolicy', { fromDashboard: true })
        }
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* Statusbar */}
                <CommonStatusBar />

                {/* Set Toolbar */}
                <CustomToolbar
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                    isBack={true}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    isGrid={this.state.isGrid}
                    header={R.strings.passPolicyConfig}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    extraData={this.state}
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    numColumns={this.state.isGrid ? 2 : 1}
                    data={this.state.response}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                width={width}
                                value={item.title}
                                type={item.type}
                                viewHeight={this.state.viewHeight}
                                index={index}
                                isGrid={this.state.isGrid}
                                size={this.state.response.length}
                                onPress={() => this.onPress(item.id)}
                                icon={item.icon}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}

                            />
                        )
                    }}  keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ 
                    marginLeft: R.dimens.padding_left_right_margin, 
                    marginBottom: R.dimens.widget_top_bottom_margin, marginTop: 
                    R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        icon={R.images.BACK_ARROW}
                        style={{ width: '20%', margin: 0, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{
                            height: R.dimens.LARGE_MENU_ICON_SIZE,
                            width: R.dimens.LARGE_MENU_ICON_SIZE,
                            tintColor: R.colors.accent
                        }]}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default PasswordPolicyDashboard;