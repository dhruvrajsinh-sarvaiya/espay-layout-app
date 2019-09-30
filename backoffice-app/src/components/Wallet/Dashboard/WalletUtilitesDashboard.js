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

class WalletUtilitesDashboard extends Component {

    constructor(props) {
        super(props);

        // Define all initial state
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { title: null, value: R.strings.withdrawRoute, icon: R.images.ic_case_download, id: 1 },
                { title: null, value: R.strings.addressGenrationRoute, icon: R.images.ic_case_download, id: 2 },
                { title: null, value: R.strings.deposit_route, icon: R.images.ic_arrow_up_box, id: 3 },
                { title: null, value: R.strings.walletTransactionTypes, icon: R.images.IC_ROUND_CANCEL, id: 4 },
                { title: null, value: R.strings.roleWiseTransactionTypes, icon: R.images.ic_widgets, id: 5 },
                { title: null, value: R.strings.unstackingRequests, icon: R.images.ic_bell_plus, id: 6 },
            ],
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    async onPress(id) {
        // screen navigation
        if (await isInternet()) {
            if (id === 1) {
                this.props.navigation.navigate('AddressGenrationRoute', { TrnType: 6 })
            }
            else if (id === 2) {
                this.props.navigation.navigate('AddressGenrationRoute', { TrnType: 9 })
            }
            else if (id === 3) {
                this.props.navigation.navigate('DepositRouteListScreen')
            }
            else if (id === 4) {
                this.props.navigation.navigate('WalletTrnTypesListScreen')
            }
            else if (id === 5) {
                this.props.navigation.navigate('RoleWiseTransactionTypesScreen')
            }
            else if (id === 6) {
                this.props.navigation.navigate('UnstakingRequestsScreen')
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
                    header={R.strings.utilits}
                    isGrid={this.state.isGrid}
                    navigation={this.props.navigation}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    data={this.state.response}  extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    key={this.state.isGrid ? 'Grid' : 'List'}  numColumns={this.state.isGrid ? 2 : 1}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                icon={item.icon}
                                size={this.state.response.length}
                                title={item.title}
                                viewHeight={this.state.viewHeight}
                                index={index}
                                width={width}
                                value={item.value}
                                type={1}
                                isGrid={this.state.isGrid}
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
                    marginBottom: R.dimens.widget_top_bottom_margin, 
                    marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        icon={R.images.BACK_ARROW} style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.goBack()} />

                </View>
            </SafeView>
        );
    }
}

export default WalletUtilitesDashboard;