import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { changeTheme } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CustomCard from '../../widget/CustomCard';
import DashboardHeader from '../../widget/DashboardHeader';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';

class RuleManagementDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            isGrid: true,
            data: [
                { id: '1', title: null, value: R.strings.RuleModule, icon: R.images.IC_ACCOUNT, type: 1 },
                { id: '2', title: null, value: R.strings.RuleSubModule, icon: R.images.IC_ACCOUNT, type: 1 },
                { id: '3', title: null, value: R.strings.RuleFields, icon: R.images.IC_ACCOUNT, type: 1 },
                { id: '4', title: null, value: R.strings.RuleTool, icon: R.images.IC_ACCOUNT, type: 1 },
            ],
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.F
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    onCustomCardPress = (item) => {
        let { navigate } = this.props.navigation

        //redirect screen based on card select
        if (item === R.strings.RuleModule)
            navigate('RuleModuleDashboard')
        else if (item === R.strings.RuleSubModule)
            navigate('RuleSubModuleDashboard')
        else if (item === R.strings.RuleFields)
            navigate('CommonDashboard', {
                response: [
                    { title: R.strings.listRuleFields, icon: R.images.ic_list_alt, id: 0, type: 1, navigate: 'RuleFieldsListScreen' },
                    { title: R.strings.addRuleFields, icon: R.images.IC_PLUS, id: 1, type: 2, navigate: 'AddEditRuleFieldScreen' },
                ],
                title: R.strings.ruleFieldsDashboard
            })
        else if (item === R.strings.RuleTool)
            navigate('RuleToolModuleDashboard')
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
                    header={R.strings.RuleManagement}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <FlatList
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
                        data={this.state.data}
                        showsVerticalScrollIndicator={false}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    isGrid={this.state.isGrid}
                                    index={index}
                                    size={this.state.data.length}
                                    title={item.title}
                                    value={item.value}
                                    type={item.type}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height })
                                    }}
                                    icon={item.icon}
                                    viewHeight={this.state.viewHeight}
                                    onPress={() => this.onCustomCardPress(item.value)} />

                            )
                        }}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    <View style={{ margin: R.dimens.widget_top_bottom_margin }}>
                        <ImageButton
                            icon={R.images.BACK_ARROW}
                            onPress={() => this.props.navigation.goBack()}
                            style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                            iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        />
                    </View>
                </View>
            </SafeView>
        )
    }
}

export default RuleManagementDashboard;
