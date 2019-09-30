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

class SlaSettingDash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: R.strings.priorityList, icon: R.images.ic_list_alt, id: 1, type: 1 },
                { title: R.strings.AddPriority, icon: R.images.IC_PLUS, id: 2, type: 2 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call 
        return isCurrentScreen(nextProps);
    };

    async onPress(id) {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //redirect screen based on card select
            if (id == 1) {
                this.props.navigation.navigate('SlaConfigPriorityScreen')
            }
            else if (id == 2) {
                this.props.navigation.navigate('AddEditSlaConfigPriority', { fromDashboard: true })
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
                    navigation={this.props.navigation}  header={R.strings.slaSetting}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    key={this.state.isGrid ? 'Grid' : 'List'} numColumns={this.state.isGrid ? 2 : 1}
                    data={this.state.response} extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                            viewHeight={this.state.viewHeight}
                                icon={item.icon}
                                value={item.title}  width={width}
                                size={this.state.response.length}
                                isGrid={this.state.isGrid}
                                index={index}
                                type={item.type}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}
                            />

                        )
                    }}
                    keyExtractor={(_item, index) => index.toString()}
                />

                <View 
                style={{ 
                    marginLeft: R.dimens.padding_left_right_margin, 
                    marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin 
                    }}>
                    <ImageButton
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        icon={R.images.BACK_ARROW}  style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default SlaSettingDash;