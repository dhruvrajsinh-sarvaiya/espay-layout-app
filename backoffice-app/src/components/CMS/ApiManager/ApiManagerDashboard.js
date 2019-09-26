import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CustomCard from '../../widget/CustomCard';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import DashboardHeader from '../../widget/DashboardHeader';

let { width } = R.screen()

export class ApiManagerDashboard extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            viewHeight: 0,
            isGrid: true,
            Data: [
                { title: R.strings.emailApiManager, icon: R.images.IC_TRADEUP, id: 1 },
                { title: R.strings.smsApiManager, icon: R.images.IC_TRADEUP, id: 2 },
            ],
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
    }

    shouldComponentUpdate(nextProps, nextState) {

        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    async onPress(id) {

        //Redirect screen based on card select
        if (id === 1)
            this.props.navigation.navigate('ApiManagerListScreen', { screenType: 2 })
        else if (id == 2)
            this.props.navigation.navigate('ApiManagerListScreen', { screenType: 1 })

    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.apiManager}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                {/* For Sub Dashboards*/}
                <View style={{ flex: 1 }}>
                    <FlatList
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
                        data={this.state.Data}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    icon={item.icon}
                                    value={item.title}
                                    index={index}
                                    width={width}
                                    titleStyle={{ fontWeight: 'bold' }}
                                    size={this.state.Data.length}
                                    isGrid={this.state.isGrid}
                                    type={1}
                                    viewHeight={this.state.viewHeight}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height });
                                    }}
                                    onPress={() => this.onPress(item.id)}
                                />
                            )
                        }}
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>
            </SafeView>
        )
    }
}

export default ApiManagerDashboard
