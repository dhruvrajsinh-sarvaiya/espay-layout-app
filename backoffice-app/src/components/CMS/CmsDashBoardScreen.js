import React, { Component } from 'react';
import {
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import { getCmsDashboardDetails, clearData } from '../../actions/CMS/CmsDashBoardAction';
import { connect } from 'react-redux';
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../../components/Navigation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CustomCard from '../../components/widget/CustomCard';
import { changeTheme } from '../../controllers/CommonUtils';
import ThemeToolbarWidget from '../widget/ThemeToolbarWidget';
import DashboardHeader from '../widget/DashboardHeader';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
const { width } = Dimensions.get("window");

class CmsDashBoardScreen extends Component {
    constructor(props) {
        super(props);

        //define all initial state
        this.state = {
            pages: '',
            faq_category: '',
            faq_question: '',
            news: '',
            contact_us: '',
            response: [
                //{ id: '1', type: 1, title: cmsDashboardData.pages, value: R.strings.pages, icon: R.images.IC_PAGES },
                //{ id: '2', type: 1, title: "2", value: R.strings.policyManagement, icon: R.images.IC_PAGES },
                //{ id: '3', type: 1, title: "2", value: R.strings.faq, icon: R.images.IC_QUESTION },
                //{ id: '4', type: 1, title: cmsDashboardData.news, value: R.strings.news, icon: R.images.IC_NOTIFICATION },
                { id: 5, type: 1, title: '0', value: R.strings.Contact_Us, icon: R.images.IC_USER },
                // { id: '6', type: 1, value: R.strings.site_setting, icon: R.images.IC_SETTINGS_OUTLINE },
                //{ id: '7', type: 1, title: "2", value: R.strings.languages, icon: R.images.IC_SETTINGS_OUTLINE },
                //{ id: '8', type: 1, title: "2", value: R.strings.Survey, icon: R.images.IC_SURVEY },
                { id: 9, type: 1, value: R.strings.template, icon: R.images.IC_EMAIL_FILLED },
                //{ id: '10', type: 1,  value: R.strings.regions, icon: R.images.IC_PAGES },
                //{ id: '11', type: 1, value: R.strings.help, icon: R.images.IC_QUESTION },
                { id: 12, type: 1, value: R.strings.coinListRequest, icon: R.images.IC_CIRCULAR_BLUR },
                { id: 13, type: 1, value: R.strings.messageQueue, icon: R.images.IC_DEVELOPER_MODE },
                { id: 14, type: 1, value: R.strings.emailQueue, icon: R.images.IC_EMAIL_FILLED },
                { id: 15, type: 1, value: R.strings.sendMessage, icon: R.images.IC_DEVELOPER_MODE },
                { id: 16, type: 1, value: R.strings.sendEmail, icon: R.images.IC_EMAIL_FILLED },
                //{ id: '17', type: 1, value: R.strings.socialMedia, icon: R.images.IC_SHARE },
                { id: 18, type: 1, value: R.strings.apiManager, icon: R.images.IC_CARDTYPE },
                { id: 19, type: 1, value: R.strings.requestFormatApi, icon: R.images.IC_CARDTYPE },
            ],
            viewHeight: 0,
            isGrid: true,
            viewListHeight: 0,
            isFirstTime: true,
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get get cms details
            this.props.getCmsDashboardDetails();
            //----------
        }
    }

    componentWillUnmount() {
        //for clear reducer data
        this.props.clearData();
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            }
        }

        // To Skip Render if old and new props are equal
        if (CmsDashBoardScreen.oldProps !== props) {
            CmsDashBoardScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch API
            const { cmsDashboardData } = props.appData;

            try {
                if (cmsDashboardData != null) {

                    //handle response of API
                    if (validateResponseNew({
                        response: cmsDashboardData,
                        returnCode: cmsDashboardData.responseCode,
                        isList: true,
                    })) {

                        let oldData = state.response

                        oldData[0].title = cmsDashboardData.data.contactUsCount

                        return {
                            response: oldData,
                        }
                    }
                }
            } catch (e) {

            }
        }
        return null;
    }

    redirectScreen = (value) => {

        //redirect screen based on card select
        if (value == 5)
            this.props.navigation.navigate('ContactUsScreen')
        else if (value == 9)
            this.props.navigation.navigate('CommonDashboard', {
                response: [
                    { title: R.strings.templatesList, icon: R.images.IC_EMAIL_FILLED, id: 0, type: 1, navigate: 'TemplateScreen' },
                    { title: R.strings.templatesConfiguration, icon: R.images.IC_EMAIL_FILLED, id: 1, type: 1, navigate: 'TemplateConfigurationScreen' },
                ], title: R.strings.Templates
            })
        else if (value == 12)
            this.props.navigation.navigate('CoinListRequestDashboard')
        else if (value == 13)
            this.props.navigation.navigate('MessageQueListScreen')
        else if (value == 14)
            this.props.navigation.navigate('EmailQueListScreen')
        else if (value == 15)
            this.props.navigation.navigate('SendSmsScreen')
        else if (value == 16)
            this.props.navigation.navigate('SendEmailScreen')
        else if (value == 18)
            this.props.navigation.navigate('ApiManagerDashboard')
        else if (value == 19)
            this.props.navigation.navigate('RequestFormatApiListScreen')
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* StatusBar as per our theme */}
                <CommonStatusBar />

                {/* toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={this.props.appData.loading} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.cms}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    data={this.state.response}
                    extraData={this.state}
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    numColumns={this.state.isGrid ? 2 : 1}
                    showsVerticalScrollIndicator={false}
                    /* render all item in list */
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                isGrid={this.state.isGrid}
                                index={index}
                                size={this.state.response.length}
                                title={item.title}
                                value={item.value}
                                type={item.type}
                                icon={item.icon}
                                width={width}
                                onChangeHeight={(height) => {
                                    if (height > this.state.viewHeight) {
                                        this.setState({ viewHeight: height })
                                    }
                                }}
                                circle
                                viewHeight={this.state.viewHeight}
                                onPress={() => this.redirectScreen(item.id)}
                            />
                        )
                    }}
                    /* assign index as key valye to Ip History list item */
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        //data get from the reducer and set to appData
        appData: state.CmsDashboardReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        getCmsDashboardDetails: () => dispatch(getCmsDashboardDetails()),
        clearData: () => dispatch(clearData()),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsDashBoardScreen)