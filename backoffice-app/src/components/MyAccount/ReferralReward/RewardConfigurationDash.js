import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import { changeTheme } from '../../../controllers/CommonUtils';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CustomCard from '../../widget/CustomCard';
import { isCurrentScreen } from '../../Navigation';
import { isInternet } from '../../../validations/CommonValidation';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen()

class RewardConfigurationDash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.addReferralReward, icon: R.images.IC_PLUS, id: 2, type: 1 },
                { title: R.strings.listReferralReward, icon: R.images.ic_list_alt, id: 1, type: 1 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    async onPress(id) {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //if list card select redirect to list screen  
            if (id === 1) {
                this.props.navigation.navigate('ReferralRewardList')
            }
            //if add referral card select redirect to Add Referral screen  
            else if (id === 2) {
                this.props.navigation.navigate('AddEditRefferalReward', { fromDashboard: true })
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
                    nav={this.props.navigation}
                    isBack={true}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    isGrid={this.state.isGrid}
                    header={R.strings.rewardConfiguration}
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
                                value={item.title}
                                isGrid={this.state.isGrid}
                                icon={item.icon}
                                onPress={() => this.onPress(item.id)}
                                viewHeight={this.state.viewHeight}
                                width={width}
                                size={this.state.response.length}
                                type={item.type}
                                index={index}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                            />
                        )
                    }}  keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ 
                    marginLeft: R.dimens.padding_left_right_margin, 
                    marginBottom: R.dimens.widget_top_bottom_margin, 
                    marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        icon={R.images.BACK_ARROW}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
            </SafeView>
        );
    }
}

export default RewardConfigurationDash;