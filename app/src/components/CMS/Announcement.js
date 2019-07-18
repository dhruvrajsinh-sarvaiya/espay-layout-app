import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import { announcementFetchData, announcementDataClear } from '../../actions/CMS/AnnouncementAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, addListener, isHtmlData, convertDateTime } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import Separator from '../../native_theme/components/Separator';
import { Method, Fonts } from '../../controllers/Constants';
import HtmlViewer from '../../native_theme/components/HtmlViewer';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class Announcement extends Component {

    constructor(props) {
        super(props)

        //Define All initial State
        this.state = {
            row: [],
            response: [],
            refreshing: false,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //call api for get announcement data 
            this.props.AnnouncementFatchData();
        } else {
            this.setState({ refreshing: false });
        }

        this.listenerRecieveAnnouncement = addListener(Method.RecieveAnnouncement, (announmentData) => {
            let oldAnnouncementData = this.state.response
            if (announmentData) {
                let parseData = JSON.parse(announmentData)
                if (parseData.Data !== 'undefined' && parseData.Data !== '') {
                    let reparseData = JSON.parse(parseData.Data)
                    oldAnnouncementData.push(reparseData)
                    this.setState({ response: oldAnnouncementData })
                }
            }
        })
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //call api for get announcement data
            this.props.AnnouncementFatchData();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (Announcement.oldProps !== props) {
            Announcement.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { announcementdata, announcementdataFetch } = props;

            //To Check nnouncement Api Data Fetch Or Not
            if (!announcementdataFetch) {
                try {
                    if (validateResponseNew({ response: announcementdata, returnCode: announcementdata.responseCode, returnMessage: announcementdata.message, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var res = parseArray(announcementdata.data);
                        return { ...state, response: res, refreshing: false };
                    }
                    else {
                        return { ...state, response: [], refreshing: false };
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.announcementDataClear()

        if (this.listenerRecieveAnnouncement) {
            this.listenerRecieveAnnouncement.remove();
        }
    }

    render() {

        const { isannouncefetch } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.Announcement} isBack={true} nav={this.props.navigation} />

                {/* To Check Response fetch or not if isannouncefetch = true then display progress bar else display List*/}
                {(isannouncefetch && !this.state.refreshing) ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>
                        {/* response value is > 0 than display data else display No record found */}
                        {
                            this.state.response.length ?
                                <FlatList
                                    ItemSeparatorComponent={() => <Separator style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }} />}
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.response}
                                    renderItem={({ item, index }) => <Showdata
                                        key={index}
                                        title={item.locale[R.strings.getLanguage()].title}
                                        Content={item.locale[R.strings.getLanguage()].content}

                                        date_modified={item.date_modified}
                                        item={item}
                                    />}
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh} />}
                                />
                                :
                                <ListEmptyComponent />
                        }
                    </View>
                }
            </SafeView>
        )
    }
}

// for display flatlist items
class Showdata extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        return (
            <View style={{ marginLeft: R.dimens.margin, marginRight: R.dimens.margin }}>
                {/* for display title  */}
                <Text style={{ color: R.colors.accent, fontSize: R.dimens.smallText, marginLeft: R.dimens.widgetMargin, fontFamily: Fonts.MontserratSemiBold }}>{this.props.title ? this.props.title : '-'}</Text>

                {/* for dynamic response handling sometime html view and somtimes simple text */}
                {isHtmlData(this.props.Content) ?
                    /* content is display in html viewer */
                    <HtmlViewer
                        style={{ backgroundColor: R.colors.cardBackground }}
                        data={this.props.Content ? this.props.Content : '-'}
                        applyMargin={true} />
                    :
                    <View style={{ margin: R.dimens.widgetMargin }}>
                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{this.props.Content ? this.props.Content : '-'}</TextViewHML>
                    </View>
                }

                {/* for display date in bottom-right side of the view  */}
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, marginTop: R.dimens.LineHeight, marginLeft: R.dimens.widgetMargin, }}>{this.props.date_modified ? convertDateTime(this.props.date_modified) : '-'}</TextViewHML>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data get from reducer For announcements 
        isannouncefetch: state.AnnouncementReducer.isannouncefetch,
        announcementdata: state.AnnouncementReducer.announcementdata,
        announcementdataFetch: state.AnnouncementReducer.announcementdataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // performs Action for get Announcement
        AnnouncementFatchData: () => dispatch(announcementFetchData()),
        // preforms Action for Clear Announcement
        announcementDataClear: () => dispatch(announcementDataClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Announcement)