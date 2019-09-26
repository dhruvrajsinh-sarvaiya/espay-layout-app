import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import DashboardHeader from '../../widget/DashboardHeader';
import CustomCard from '../../widget/CustomCard';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';

export class CustomerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            isGrid: true,
            data: [
                { id: 1, title: null, value: R.strings.totalCustomers, icon: R.images.IC_VIEW_LIST, type: 1 },
                { id: 2, title: null, value: R.strings.addCustomers, icon: R.images.IC_PLUS, type: 2 },
            ],
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, _nextState) {
       	// stop twice api call
        return isCurrentScreen(nextProps);
    }

    onPress = (id) => {
        let { navigate } = this.props.navigation

        //redirect screens based on card selected 
        if (id == 1)
            navigate('CustomerListScreen')
        else if (id == 2)
            navigate('CustomerAddScreen')
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.customerDashboard}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
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
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height })
                                    }}
                                    viewHeight={this.state.viewHeight}
                                    onPress={() => this.onPress(item.id)} />

                            )
                        }}
                        // assign index as key valye to Withdrawal list item
                        keyExtractor={(_item, index) => index.toString()}
                    />

                    <View style={{ margin: R.dimens.widget_top_bottom_margin }}>
                        <ImageTextButton
                            icon={R.images.BACK_ARROW}
                            style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                            iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                            onPress={() => this.props.navigation.goBack()} />
                    </View>
                </View>
            </SafeView>
        )
    }
}

export default CustomerDashboard
