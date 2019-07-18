import React, { Component } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    FlatList,
    RefreshControl,
    Text
} from 'react-native';
import { NewsSectionFatchData, NewsSectionDataClear } from '../../actions/CMS/NewsSectionAction'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, addListener, convertDateTime } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import Separator from '../../native_theme/components/Separator';
import { Method, Fonts } from '../../controllers/Constants';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class NewsSection extends Component {
    constructor(props) {
        super(props)

        // Define All State initial state 
        this.state = {
            response: this.props.navigation.state.params ? this.props.navigation.state.params.Response : [],
            isAvailable: this.props.navigation.state.params ? this.props.navigation.state.params.isAvailable : false,
            search: '',
            refreshing: false,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check for current screen
        if (isCurrentScreen(this.props)) {
            if (!this.state.isAvailable) {

                //check for internet connection
                if (await isInternet()) {
                    //  call api for newsdata fetch
                    this.props.NewsSectionFatchData()
                }
            }
        }

        this.listnerRecieveNews = addListener(Method.RecieveNews, (newsData) => {

            // check for current screen
            if (isCurrentScreen(this.props)) {
                try {
                    let oldNewsData = this.state.response

                    // check newsData is found or not
                    if (newsData) {
                        let parseData = JSON.parse(newsData)
                        if (parseData.Data !== 'undefined' && parseData.Data !== '') {
                            let reparseData = JSON.parse(parseData.Data)
                            oldNewsData.push(reparseData)
                            this.setState({ response: oldNewsData })
                        }
                    }
                } catch (_error) { }
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

            //Call news section data
            this.props.NewsSectionFatchData()
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (NewsSection.oldProps !== props) {
            NewsSection.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated fields of Particular actions
            const { newsdata, newsdatafetch } = props;

            //check news data fetch is not true
            if (!newsdatafetch) {
                try {
                    if (validateResponseNew({ response: newsdata.data, returnCode: newsdata.data.responseCode, returnMessage: newsdata.data.message, isList: true })) {
                        //Get array from response
                        var res = parseArray(newsdata.data);
                        return {
                            ...state,
                            response: res,
                            refreshing: false
                        };
                    }
                    else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false
                        };
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false
                    };
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.NewsSectionDataClear()

        // for remove listener
        if (this.listnerRecieveNews) {
            this.listnerRecieveNews.remove();
        }
    }

    render() {
        let devicelist = [];

        //fetch loading bit for progressbar handling
        const { isNewsFetch } = this.props;

        //for final items from search input (validate on title)
        //default searchInput is empty so it will display all records.
        if (this.state.response != undefined) {
            devicelist = this.state.response.filter((item) => (item.locale[R.strings.getLanguage()].title.toLowerCase().includes(this.state.search.toLowerCase())))
        }
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                {/* if user already log in than follow button not display other wise display follow */}
                <CustomToolbar
                    title={R.strings.News_Section}
                    titleClickable={false}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* data show in flatlist  */}
                <View style={{ flex: 1, marginBottom: R.dimens.margin, marginTop: R.dimens.widgetMargin, }}>
                    {
                        isNewsFetch && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <FlatList
                                ItemSeparatorComponent={() => <Separator />}
                                showsVerticalScrollIndicator={false}
                                data={devicelist}
                                renderItem={({ item, index }) => <Showdata
                                    key={index}
                                    title={item.locale[R.strings.getLanguage()].title}
                                    content={item.locale[R.strings.getLanguage()].content}
                                    createDate={item.date_created}
                                    item={item}
                                    context={this} />
                                }
                                keyExtractor={(_item, index) => index.toString()}
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                contentContainerStyle={contentContainerStyle(devicelist)}
                                ListEmptyComponent={<ListEmptyComponent />}
                            />
                    }
                </View>
            </SafeView>
        );
    }
}

// for display flatlist items
class Showdata extends Component {
    constructor(props) {
        super(props)
    }

    // for navigate to details screen
    showdetails = (title, content, date) => {
        const context = this.props.context
        context.props.navigation.navigate('NewsSectionDetail', { maintitle: title, maincontent: content, maindate: date });
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.showdetails(this.props.title, this.props.content, this.props.createDate)}>
                <View style={{ margin: R.dimens.widgetMargin, flexDirection: "row", flex: 1 }}>
                    <Separator width={R.dimens.widgetMargin} height={'100%'} style={{ marginLeft: 0 }} color={R.colors.accent} />
                    
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        
                        <View style={{ width: "100%" }}>
                            <Text style={{
                                justifyContent: 'center',
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.smallText,
                                fontFamily: Fonts.MontserratSemiBold,
                                paddingLeft: R.dimens.widgetMargin,
                                paddingRight: R.dimens.widgetMargin
                            }}>
                                {this.props.title ? this.props.title : '-'}
                            </Text>
                            <View style={{ alignItems: "flex-end" }}>
                                <TextViewHML style={{
                                    alignItems: 'center',
                                    color: R.colors.textSecondary,
                                    fontSize: R.dimens.smallestText,
                                    paddingLeft: R.dimens.widgetMargin,
                                    paddingRight: R.dimens.widgetMargin
                                }}>
                                    {this.props.createDate ? convertDateTime(this.props.createDate) : '-'}
                                </TextViewHML>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
function mapStateToProps(state) {
    return {
        //data get from the reducer and set to sectiondata
        isNewsFetch: state.NewsSectionReducer.isNewsFetch,
        newsdata: state.NewsSectionReducer.newsdata,
        newsdatafetch: state.NewsSectionReducer.newsdatafetch,

    }
}
function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        NewsSectionFatchData: () => dispatch(NewsSectionFatchData()),
        NewsSectionDataClear: () => dispatch(NewsSectionDataClear()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsSection)
