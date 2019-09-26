import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { getUserSignupData, clearUserSignUpReport } from '../../../actions/account/UsersSignupReportAction';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import R from '../../../native_theme/R';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen();

class UserSignUpReportDash extends Component {

    constructor(props) {
        super(props);

        // Define all initial state
        this.state = {
            CountData: null,
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { id: 0, title: R.strings.Total, icon: R.images.IC_EARTH, response: { TotalCount: '-' }, type: 1 },
                { id: 1, title: R.strings.today, icon: R.images.IC_CHECKMARK, response: { TotalCount: '-' }, type: 2 },
                { id: 2, title: R.strings.weekly, icon: R.images.IC_ROUND_CANCEL, response: { TotalCount: '-' }, type: 3 },
                { id: 3, title: R.strings.monthly, icon: R.images.IC_ROUND_CANCEL, response: { TotalCount: '-' }, type: 4 }
            ],
            isFirstTime: true,
        };
    }

    async  componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //chek internet connectivity
        if (await isInternet()) {
            //To get CountData
            this.props.getUserSignupData();
        }
    }

    componentWillUnmount() {
        //clear data on backpress
        this.props.clearUserSignUpReport();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (UserSignUpReportDash.oldProps !== props) {
            UserSignUpReportDash.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { CountData } = props.data;

            try {
                //if CountData response is not null then handle resposne
                if (CountData) {
                    //if local CountData state is null or its not null and also different then new response then and only then validate response.
                    if (state.CountData == null || (state.CountData != null && CountData !== state.CountData)) {
                        //if CountData response is success then store array list else store empty list
                        if (validateResponseNew({ response: CountData, isList: true })) {
                            let response = state.response;
                            response[0].response = {
                                TotalCount: CountData.signReportCountViewmodels[0].Total
                            }
                            response[1].response = {
                                TotalCount: CountData.signReportCountViewmodels[0].Today
                            }
                            response[2].response = {
                                TotalCount: CountData.signReportCountViewmodels[0].Weekly
                            }
                            response[3].response = {
                                TotalCount: CountData.signReportCountViewmodels[0].Monthly
                            }
                            return {
                                ...state,
                                response,
                                CountData
                            }
                        }
                    }
                }
            } catch (error) {
                return {
                    ...state,
                }
            }
        }
        return null;
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { loading } = this.props.data;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* Statusbar */}
                <CommonStatusBar />

                {/* Progressbar */}
                <ProgressDialog isShow={loading} />

                {/* Set Toolbar */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.UsersSignUpReport}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    numColumns={this.state.isGrid ? 2 : 1}
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    showsVerticalScrollIndicator={false}
                    extraData={this.state}
                    data={this.state.response}
                    // render all item in list
                    renderItem={({ item, index }) => {
                        return (

                            <CustomCard
                                width={width}
                                type={1}
                                value={item.title}
                                title={validateValue(item.response.TotalCount)}
                                icon={item.icon}
                                size={this.state.response.length}
                                index={index}
                                isGrid={this.state.isGrid}
                                viewHeight={this.state.viewHeight}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => {
                                    //redirect screens based on card selected 
                                    if (item.type) {
                                        if (item.type === 1 && (item.response.TotalCount !== '' && item.response.TotalCount !== 0)) {
                                            this.props.navigation.navigate('UserSignUpReportList', { itemStatus: R.strings.select_status, statusId: 0 })

                                        }
                                        else if (item.type === 2 && (item.response.TotalCount !== '' && item.response.TotalCount !== 0)) {
                                            this.props.navigation.navigate('UserSignUpReportList', { itemStatus: R.strings.today, statusId: 1 })

                                        }
                                        else if (item.type === 3 && (item.response.TotalCount !== '' && item.response.TotalCount !== 0)) {
                                            this.props.navigation.navigate('UserSignUpReportList', { itemStatus: R.strings.weekly, statusId: 2 })

                                        }
                                        else if (item.type === 4 && (item.response.TotalCount !== '' && item.response.TotalCount !== 0)) {
                                            this.props.navigation.navigate('UserSignUpReportList', { itemStatus: R.strings.monthly, statusId: 3 })
                                        }
                                    }
                                }}
                            />
                        )
                    }}
                    // assign index as key value to Withdraw Report list item
                    keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        onPress={() => this.props.navigation.goBack()} 
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        icon={R.images.BACK_ARROW}   style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        />

                </View>
            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    //Updated Data For UsersSignupReportReducer Data 
    return { data: state.UsersSignupReportReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //getUserSignupData action for Api call
        getUserSignupData: () => dispatch(getUserSignupData()),
        //for clear data
        clearUserSignUpReport: () => dispatch(clearUserSignUpReport()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(UserSignUpReportDash);