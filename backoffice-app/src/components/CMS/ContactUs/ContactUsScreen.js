// ContactUs.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages, convertDateTime, } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { GetContactusList } from '../../../actions/CMS/ContactUsAction';
import PaginationWidget from '../../widget/PaginationWidget';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ContactUsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // ------- for pagination
            row: [],
            selectedPage: 1,
            // -----------------
            data: [],/* for store data from the responce */
            search: '',/* for search value for data */
            refreshing: false,/* for refresh data */
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {
        /* for set current theme */
        changeTheme();

        // Check Internet is Available or not
        if (await isInternet()) {
            //  call api for Contactuslist data fetch
            let requestContactusList = {}

            //call GetContactusList api
            this.props.GetContactusList(requestContactusList)
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Api for get Contactuslistdata
            let requestContactusList = {}

            //call GetContactusList api
            this.props.GetContactusList(requestContactusList)
            //----------
        } else {
            this.setState({ refreshing: false });
        }

    }
    //-----------

    //call items
    onPageChange = async (pNo) => {
        this.setState({ selectedPage: pNo });

        // Check Internet is Available or not
        if (await isInternet()) {
            //  call api for get Contactuslistdata
            let requestContactusList = {}

            //call GetContactusList api
            this.props.GetContactusList(requestContactusList)
        }
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
        if (ContactUsScreen.oldProps !== props) {
            ContactUsScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { contactuslistDataget, contactuslistdataFetch } = props;

            if (!contactuslistdataFetch) {
                try {
                    if (validateResponseNew({ response: contactuslistDataget, returnCode: contactuslistDataget.ReturnCode, returnMessage: contactuslistDataget.ReturnMessage, isList: true })) {
                        //Get array from response
                        var res = parseArray(contactuslistDataget.List);

                        return { ...state, data: res, refreshing: false, row: addPages(20 /* total count */), }
                    }
                    else {
                        return { ...state, refreshing: false, data: [], row: [] }
                    }
                } catch (e) {
                    return { ...state, refreshing: false, data: [], row: [] }
                }
            }
        }
        return null;
    }

    render() {
        const { iscontactuslistFetch } = this.props;

        //for search
        let finalItems = this.state.data.filter(item => (item.email.toLowerCase().includes(this.state.search.toLowerCase())));

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* statusbar and actionbar  */}
                <CommonStatusBar />

                <CustomToolbar
                    title={R.strings.Contact_Us}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        iscontactuslistFetch && !this.state.refreshing ?
                            <ListLoader />
                            :
                            finalItems.length > 0 ?
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <ContactUsItem
                                            item={item}
                                            index={index}
                                            size={this.state.data.length}
                                        />
                                    }
                                    keyExtractor={item => item.id}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />}
                                />
                                :
                                <ListEmptyComponent />
                    }
                    <View>
                        {finalItems.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ContactUsItem extends Component 
{
    constructor(props) 
    {
        super(props); 
    }
    
    shouldComponentUpdate(nextProps) 
    {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item === nextProps.item) 
        {
            return false
        }
        return true
    }

    render() 
    {
        let item = this.props.item;
        let { index, size } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View 
                style={{ flex: 1,  marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{ elevation: R.dimens.listCardElevation, flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,  borderBottomLeftRadius: R.dimens.margin,
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View>
                                {/* icon for user */}
                                <ImageTextButton
                                    icon={R.images.IC_USER}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>
                            {/* for show email , subject ,description */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.email ? item.email : '-'}</TextViewMR>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.subject ? item.subject : '-'}</TextViewHML>
                                <TextViewHML style={{
                                    color: R.colors.textSecondary, fontSize: R.dimens.smallestText,
                                    paddingRight: R.dimens.widgetMargin,
                                }}>{item.description ? item.description : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show date */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.date ? convertDateTime(item.date) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        //for get contactus data 
        iscontactuslistFetch: state.ContactUsReducer.iscontactuslistFetch,
        contactuslistDataget: state.ContactUsReducer.contactuslistDataget,
        contactuslistdataFetch: state.ContactUsReducer.contactuslistdataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for get contactuslist
        GetContactusList: (requestContactusList) => dispatch(GetContactusList(requestContactusList)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsScreen)