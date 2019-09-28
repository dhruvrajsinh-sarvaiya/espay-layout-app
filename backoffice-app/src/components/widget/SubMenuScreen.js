import React, { Component } from 'react';
import {
    View,
    FlatList
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme } from '../../controllers/CommonUtils';
import MenuListItem from '../../native_theme/components/MenuListItem';
import R from '../../native_theme/R';
import { addRouteToBackPress } from '../Navigation';
import { Constants } from '../../controllers/Constants';

export default class SubMenuScreen extends Component {
    constructor(props) {
        super(props)

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        let title = 'Dashboard', category = Constants.Category.Home;
        if (props.navigation.state.params !== undefined) {
            if (props.navigation.state.params.title !== undefined) {
                title = props.navigation.state.params.title;
            }

            if (props.navigation.state.params.category !== undefined) {
                category = props.navigation.state.params.category;
            }
        }

        //data pass for listing screen title,icon,redirection name
        this.state = {
            title: title,
            prevCategory: category,
            category: category,
            subLevels: [{
                id: 0,
                title: title,
                prevCategory: category,
                category: category,
            }],
            data: [
                { title: R.strings.trading, screenname: 'TradingDashboard', icon: R.images.IC_TRADEUP, category: Constants.Category.Home },
                { title: R.strings.wallet, screenname: '', icon: R.images.IC_WALLET, category: Constants.Category.Home },
                { title: 'CMS', screenname: 'CmsDashBoardScreen', icon: R.images.IC_SETTING, category: Constants.Category.Home },
                { title: R.strings.Accounts, screenname: 'MyAccountDashboard', icon: R.images.IC_ACCOUNT, category: Constants.Category.Home },
                { title: R.strings.myAccount, screenname: 'MyAccount', icon: R.images.IC_ACCOUNT, category: Constants.Category.Home },

                { title: R.strings.countries, screenname: 'CountriesListScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Constants.Category.Localization },
                { title: R.strings.states, screenname: 'StatesListScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Constants.Category.Localization },
                { title: R.strings.cities, screenname: 'CitiesListScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Constants.Category.Localization },
                { title: R.strings.zipCodes, screenname: 'ZipCodesListScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Constants.Category.Localization },
            ],
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    moveToScreen(item) {
        let { title, screenname = '', category, subCategory = '' } = item;

        if (screenname != '') {
            var { navigate } = this.props.navigation;

            let options = {};

            navigate(screenname, options);
        } else {
            if (subCategory !== '') {
                let subLevels = this.state.subLevels;
                subLevels.push({
                    id: this.state.subLevels[this.state.subLevels.length - 1].id + 1,
                    title,
                    category: subCategory,
                    prevCategory: category
                })
                this.setState({ title, category: subCategory, prevCategory: category, subLevels });
            }
        }
    }

    onBackPress() {
        if (this.state.subLevels.length > 1) {
            //To get Preivous Screen Category
            let prevItem = this.state.subLevels[this.state.subLevels.length - 2];

            //To remove last item from array
            let subLevels = this.state.subLevels;
            subLevels.splice(subLevels.length - 1, 1);

            //To update state as per previous screen
            this.setState({ ...prevItem, subLevels })
        } else {
            //refresh previous screen list
            if (this.props.navigation.state.params && this.props.navigation.state.params.refresh !== undefined) {
                this.props.navigation.state.params.refresh();
            }
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* statusbar and toolbar */}
                <CommonStatusBar />

                {this.state.category == Constants.Category.Home ?
                    <CustomToolbar
                        title={this.state.title}
                        isBack={this.state.category === Constants.Category.Home ? false : true}
                        original={true}
                        leftStyle={{ width: '10%' }}
                        titleStyle={{ justifyContent: 'center', width: '80%' }}
                        rightStyle={{ width: '10%' }} />
                    :
                    <CustomToolbar
                        title={this.state.title}
                        isBack={this.state.category === Constants.Category.Home ? false : true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress} />}

                {/* show list of screen title */}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.data.filter((item) => item.category == this.state.category)}
                    renderItem={({ item }) => (
                        <MenuListItem
                            title={item.title}
                            icon={item.icon}
                            onPress={() => this.moveToScreen(item)} />
                    )}
                    keyExtractor={item => item.title}
                />
            </View>
        )
    }
}