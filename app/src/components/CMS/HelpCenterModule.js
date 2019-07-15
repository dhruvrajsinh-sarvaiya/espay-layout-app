import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, ScrollView, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { getHelpManualById } from '../../actions/CMS/HelpCenterAction';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import Accordion from 'react-native-collapsible/Accordion';
import HtmlViewer from '../../native_theme/components/HtmlViewer';
import R from '../../native_theme/R';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
import CardView from '../../native_theme/components/CardView';

class HelpCenterModule extends Component {
    constructor(props) {
        super(props);

        //get object from help screen
        const { params } = this.props.navigation.state;

        //Define All State initial state
        this.state = {
            data: [],           //for store array responce 
            refreshing: false,  //for refreshing data 
            search: '',         //for search value for data
            id: params == undefined ? undefined : params.id,    //store id from the params data
            activeSection: false,
            collapsed: true,
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check for internet connection
        if (await isInternet()) {

            //Call Api for get heplmanuallist by id 
            this.props.getHelpManualById(this.state.id)
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    // For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Api for get heplmanuallist by id 
            this.props.getHelpManualById(this.state.id)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    // -----------

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        //Check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated fields of Particular actions
            const { helpmanualdetails } = props;

            // check for helpmoduledetails data is available or not
            if (helpmanualdetails) {
                try {
                    if (state.helpmanualdetails == null || (state.helpmanualdetails != null && helpmanualdetails !== state.helpmanualdetails)) {
                        if (validateResponseNew({ response: helpmanualdetails, returnCode: helpmanualdetails.responseCode, returnMessage: helpmanualdetails.message, isList: true })) {
                            var res = parseArray(helpmanualdetails.data);
                            return { ...state, data: res, refreshing: false, helpmanualdetails };
                        }
                        else {
                            return { ...state, data: [], refreshing: false, helpmanualdetails };
                        }
                    }
                } catch (e) {
                    return { ...state, data: [], refreshing: false };
                }
            }
        }
        return null;
    }

    // set section for click to expand 
    setSection = section => {
        this.setState({ activeSection: section });
    };

    // for display Title
    renderHeader = (section, _, isActive) => {
        return (
            <View>
                <View style={this.styles().simpleItem}>
                    <CardView style={this.styles().cardViewStyle}>

                        <View style={{ flex: 1 }}>
                            <Text style={[{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }]}>{section.locale[R.strings.getLanguage()] ? section.locale[R.strings.getLanguage()].title : section.locale.en.title}</Text>
                        </View>

                        <View style={{ margin: R.dimens.widgetMargin, }}>
                            <Image
                                source={isActive ? R.images.IC_COLLAPSE_ARROW : R.images.IC_EXPAND_ARROW}
                                style={{
                                    tintColor: R.colors.textPrimary,
                                    height: R.dimens.SMALL_MENU_ICON_SIZE,
                                    width: R.dimens.SMALL_MENU_ICON_SIZE
                                }}
                            />
                        </View>
                    </CardView>
                </View>
            </View>
        )
    };

    // for display content when click title
    renderContent = (section, _, isActive) => {
        return (
            <View>
                {/* Add HTML View for parsing HTML tags to react native */}
                <HtmlViewer
                    style={{ backgroundColor: R.colors.cardBackground }}
                    applyMargin={true}
                    data={section.locale[R.strings.getLanguage()] ? section.locale[R.strings.getLanguage()].content : section.locale.en.content} />
            </View>
        )
    }

    render() {

        //loading bit for handling progress dialog
        let { loading } = this.props;
        let list = this.state.data;

        //for final items from search input (validate on title)
        //default searchInput is empty so it will display all records.
        let finalItems = list.filter(item => (item.locale[R.strings.getLanguage()] ? item.locale[R.strings.getLanguage()].title.toLowerCase().includes(this.state.search.toLowerCase()) : item.locale.en.title.toLowerCase().includes(this.state.search.toLowerCase())));
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.HelpCenter}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    nav={this.props.navigation} />

                <View style={{ flex: 1 }}>

                    {/* display listloader till data is not populated*/}
                    {loading && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={contentContainerStyle(finalItems)}>
                            {finalItems.length > 0 ?
                                <Accordion
                                    activeSection={this.state.activeSection}
                                    sections={finalItems}
                                    touchableComponent={TouchableWithoutFeedback}
                                    renderHeader={this.renderHeader}
                                    renderContent={this.renderContent}
                                    duration={400}
                                    onChange={this.setSection}
                                />
                                : <ListEmptyComponent />}

                        </ScrollView>
                    }
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            simpleItem: {
                flex: 1,
                marginTop: R.dimens.widgetMargin,
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
                marginBottom: R.dimens.widgetMargin,
                alignItems: 'center'
            },
            cardViewStyle: {
                elevation: R.dimens.CardViewElivation,
                flexDirection: 'row',
                padding: R.dimens.WidgetPadding,
                backgroundColor: R.colors.cardBackground,
                borderRadius: R.dimens.cardBorderRadius,
                alignItems: 'center'
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        // for get modules list of given id from the reducer data 
        helpmanualdetails: state.HelpCenterReducer.helpmanualdetails,
        loading: state.HelpCenterReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // for call action to fetch given id data from the API
        getHelpManualById: (requestModuleID) => dispatch(getHelpManualById(requestModuleID))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpCenterModule)