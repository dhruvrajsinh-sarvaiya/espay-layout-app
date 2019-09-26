import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import DashboardHeader from '../../widget/DashboardHeader';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CustomCard from '../../widget/CustomCard';

export class ERC223ConfigDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            isGrid: true,
            data: [
                { id: 1, title: null, value: R.strings.increaseTokenSupply, icon: R.images.ic_configuration, type: 1 },
                { id: 2, title: null, value: R.strings.decreaseTokenSupply, icon: R.images.ic_configuration, type: 1 },
                { id: 3, title: null, value: R.strings.setTransferFee, icon: R.images.ic_configuration, type: 1 },
                { id: 4, title: null, value: R.strings.tokenTransfer, icon: R.images.ic_configuration, type: 1 },
                { id: 5, title: null, value: R.strings.destroyBlackFund, icon: R.images.ic_configuration, type: 1 },
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
    }

    onCustomCardPress = (id) => {
        let { navigate } = this.props.navigation
        if (id == 1)
            navigate('IncreaseTokenSupplyListScreen', { isIncrease: true })
        else if (id == 2)
            navigate('IncreaseTokenSupplyListScreen', { isIncrease: false })
        else if (id == 3)
            navigate('SetTransferFeeListScreen')
        else if (id == 4)
            navigate('TokenTransferScreen')
        else if (id == 5)
            navigate('DestroyBlackFundListScreen')
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
                    header={R.strings.erc223Configuration}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <FlatList
                        data={this.state.data}
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        numColumns={this.state.isGrid ? 2 : 1}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    isGrid={this.state.isGrid}
                                    index={index}
                                    size={this.state.data.length}
                                    value={item.value} type={item.type}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height })
                                    }}
                                    title={item.title} icon={item.icon}
                                    viewHeight={this.state.viewHeight}
                                    onPress={() => this.onCustomCardPress(item.id)} />

                            )
                        }}
                        // assign index as key valye to Withdrawal list item
                        keyExtractor={(_item, index) => index.toString()}
                    />

                    <View style={{ margin: R.dimens.widget_top_bottom_margin }}>
                        <ImageTextButton
                            icon={R.images.BACK_ARROW}
                            style={this.styles().btnStyle}
                            iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                            onPress={() => this.props.navigation.goBack()} />
                    </View>
                </View>
            </SafeView>
        )
    }

    styles = () => {
        return {
            btnStyle:
            {
                margin: 0,
                width: '20%',
                backgroundColor: R.colors.white,
                height: R.dimens.SignUpButtonHeight,
                elevation: R.dimens.CardViewElivation,
                borderRadius: R.dimens.roundButtonRedius,
                justifyContent: 'center',
                alignItems: 'center'

            }
        }
    }
}

export default ERC223ConfigDashboard
