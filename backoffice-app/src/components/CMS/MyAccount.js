import React, { Component } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, showAlert, sendEvent, } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import MenuListItem from '../../native_theme/components/MenuListItem';
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import ViewProfileWidget from './MyAccounts/ViewProfileWidget';
import { validateResponseNew } from '../../validations/CommonValidation';
import { Events, ServiceUtilConstant } from '../../controllers/Constants';
import Separator from '../../native_theme/components/Separator';
import { getData, setData } from '../../App';

class MyAccount extends Component {
    constructor(props) {
        super(props)

        this.onRightMenuPress = this.onRightMenuPress.bind(this);

        //data pass for listing screen title,icon,redirection name
        this.state = {
            data: [],
            plan: getData(ServiceUtilConstant.KEY_IsPlanChange)
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    static getDerivedStateFromProps(props, state) {

        if (isCurrentScreen(props)) {

            if (state.data.length == 0) {
                return Object.assign({}, state, {
                    data: [
                        { title: R.strings.updateProfileTitle, screenname: 'UpdateProfile', icons: R.images.IC_USER },
                        { title: R.strings.Security, screenname: 'Security', icons: R.images.IC_SECURITY },
                        { title: R.strings.Preferences, screenname: 'SettingScreen', icons: R.images.IC_SETTING },
                    ]
                })
            }

            try {
                // UserActivePlanData is not null
                if (props.UserActivePlanData) {

                    try {
                        if (state.UserActivePlanData == null || (state.UserActivePlanData != null && props.UserActivePlanData !== state.UserActivePlanData)) {

                            // Handle Response
                            if (validateResponseNew({ response: props.UserActivePlanData, isList: true })) {

                                let indexOfAPIPlan = state.data.findIndex(el => el.category == Category.apiPlan);

                                if (indexOfAPIPlan > -1) {
                                    let data = state.data;
                                    data[indexOfAPIPlan].status = props.UserActivePlanData.Response.PlanName;

                                    return Object.assign({}, state, {
                                        data,
                                        UserActivePlanData: props.UserActivePlanData
                                    })
                                }
                            }
                            return Object.assign({}, state, {
                                UserActivePlanData
                            })
                        }
                    } catch (error) {
                        return null;
                    }
                }
            } catch (error) {
                return null;
            }
        }

        return null;
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //If theme or locale is changed then update componenet
        if (this.state !== nextState || this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale || this.state.data !== nextState.data) {
            return true;
        } else {
            return isCurrentScreen(nextProps);
        }
    };

    moveToScreen(item) {
        if (item.screenname != '') {
            var { navigate } = this.props.navigation;
            navigate(item.screenname, { category: item.category ? item.category : '', title: item.title, refresh: this.refresh })
        }
    }

    onRightMenuPress() {

        // To get dialog show count from preference
        let dialogShowCount = getData(ServiceUtilConstant.KEY_DialogCount);

        // If dialog show count is 0 then show dialog
        if (dialogShowCount == 0) {
            //redirect user to login
            showAlert(R.strings.alert, R.strings.logout_message, 4, async () => {
                setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 })
                sendEvent(Events.SessionLogout);
            }, R.strings.cancel, () => { setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 }) });

            dialogShowCount++;
            setData({ [ServiceUtilConstant.KEY_DialogCount]: dialogShowCount })
        }
    }

    refresh = () => {

        let data = [
            { title: R.strings.updateProfileTitle, screenname: 'UpdateProfile', icons: R.images.IC_USER },
            { title: R.strings.Security, screenname: 'Security', icons: R.images.IC_SECURITY },
            { title: R.strings.Preferences, screenname: 'SettingScreen', icons: R.images.IC_SETTING },
        ];

        let newState = { data };

        this.setState(newState);
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* statusbar and toolbar */}
                <CommonStatusBar />

                <CustomToolbar
                    title={R.strings.accountSettings}
                    isBack={true}
                    original={true}
                    leftStyle={{ width: '10%' }}
                    titleStyle={{ justifyContent: 'flex-start', width: '80%' }}
                    rightStyle={{ width: '10%' }}
                    rightIcon={R.images.IC_LOGOUT}
                    onRightMenuPress={this.onRightMenuPress}
                    nav={this.props.navigation} />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <ViewProfileWidget navigation={this.props.navigation} />

                    <CardView style={{ padding: 0, margin: R.dimens.margin_left_right }}>

                        {/* To display all menus */}
                        {this.state.data.map((item, index) => {
                            return (
                                <View key={item.title}>
                                    <MenuListItem
                                        title={item.title}
                                        onPress={() => this.moveToScreen(item)}
                                        status={item.status}
                                        statusStyle={{ color: R.colors.yellow }}
                                        style={{
                                            marginTop: 0,
                                            marginBottom: 0,
                                            backgroundColor: 'transparent'
                                        }}
                                    />
                                    {/* No one Change seperator Color without Asking Dhruvit(me) Strict Instruction */}
                                    {index != this.state.data.length - 1 && <Separator />}
                                </View>
                            )
                        })}
                    </CardView>
                </ScrollView>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        preference: state.preference,
    }
}

export default connect(mapStateToProps)(MyAccount);
