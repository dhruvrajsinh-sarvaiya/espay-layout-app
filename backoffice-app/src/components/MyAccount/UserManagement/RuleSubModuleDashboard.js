import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import R from '../../../native_theme/R';
import { changeTheme } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CustomCard from '../../widget/CustomCard';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import DashboardHeader from '../../widget/DashboardHeader';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';

class RuleSubModuleDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            isGrid: true,
            data: [
                { id: '1', title: null, value: R.strings.ListRuleSubModule, icon: R.images.IC_VIEW_LIST, type: 1 },
                { id: '2', title: null, value: R.strings.AddRuleSubModule, icon: R.images.IC_PLUS, type: 2 },
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

        //redirect screen based on card select
        if (item === R.strings.ListRuleSubModule)
            navigate('RuleSubModuleScreen')
        else if (item === R.strings.AddRuleSubModule)
            navigate('AddEditRuleSubModuleScreen', { item: undefined })
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* statusbar and actionbar  */}
                <CommonStatusBar />
                <CustomToolbar isBack={true} nav={this.props.navigation} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.RuleSubModule}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <FlatList
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
                        data={this.state.data}
                        extraData={this.state}
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
                                    icon={item.icon}
                                    onPress={() => this.onCustomCardPress(item.value)}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height })
                                    }}
                                    viewHeight={this.state.viewHeight}
                                />
                            )
                        }}
                        // assign index as key value to  Rule Sub Module Dashboard item
                        keyExtractor={(_item, index) => index.toString()}
                    />

                    <View style={{ margin: R.dimens.widget_top_bottom_margin }}>
                        <ImageButton
                            icon={R.images.BACK_ARROW}
                            iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                            style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.props.navigation.goBack()} />
                    </View>
                </View>
            </SafeView>
        );
    }
}

export default RuleSubModuleDashboard;
