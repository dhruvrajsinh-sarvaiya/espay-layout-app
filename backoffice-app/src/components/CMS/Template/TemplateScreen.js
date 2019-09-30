import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../Navigation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { connect } from 'react-redux';
import { getEmailTemplates, updateTemplateStatus, clearTemplateStatusChange, clearTemplate } from '../../../actions/CMS/EmailTemplatesActions';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import R from '../../../native_theme/R';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import SafeView from '../../../native_theme/components/SafeView';

class TemplateScreen extends Component {
    constructor(props) {
        super(props);

        //define all initial state
        this.state = {
            data: [],//for store data from the responce
            search: '',//for search value for data
            refreshing: false,//for refresh data
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for Templatelist data fetch
            this.props.getEmailTemplates()
        }
    }

    componentWillUnmount() {
        //clear reducer data
        this.props.clearTemplate();
    }

    shouldComponentUpdate = (nextProps, nextState) => {

        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {
            //  call api for Templatelist data fetch
            this.props.getEmailTemplates()
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

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
        if (TemplateScreen.oldProps !== props) {
            TemplateScreen.oldProps = props;
        } else {
            return null;
        }


        if (isCurrentScreen(props)) {
            //for fetch News API
            const { templates_list, statusResponse } = props;

            // for get templatelist data 
            if (templates_list) {
                try {
                    // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                    if (state.templates_list == null || (state.templates_list != null && templates_list !== state.templates_list)) {
                        if (validateResponseNew({ response: templates_list, returnCode: templates_list.ReturnCode, returnMessage: templates_list.ReturnMsg, statusCode: templates_list.statusCode, isList: true })) {
                            var responseData = parseArray(templates_list.TemplateMasterObj);//set array or convert responce in array 
                            return { ...state, templates_list, data: responseData, refreshing: false, };
                        }
                        else {
                            return { ...state, refreshing: false, data: [], templates_list };
                        }
                    }
                } catch (e) {
                    return { ...state, refreshing: false, data: [], };
                }
            }

            if (statusResponse !== null) {
                try {
                    if (validateResponseNew({ response: statusResponse, returnCode: statusResponse.ReturnCode, returnMessage: statusResponse.ReturnMsg, isList: true })) {
                        let res = state.data;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.ID === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = res[findIndexOfChangeID].Status == 1 ? 0 : 1;
                        }

                        //clear data
                        props.clearTemplateStatusChange();

                        return { data: res }
                    }

                } catch (e) {
                }
            }

        }
        return null;
    }

    editRecord = (item) => {

        //redirect screen for edit
        this.props.navigation.navigate('TemplateAddScreen', { ITEM: item, onRefresh: this.onRefresh })
    }

    templateStatusUpdate = async (item) => {
        this.setState({ statusId: item.ID })

        //Check NetWork is Available or not
        if (await isInternet()) {
            //To update status value 
            let requestUpdateTemplate = {
                status: item.Status == 0 ? 1 : 0,
                id: item.ID
            }

            //call updateTemplateStatus api
            this.props.updateTemplateStatus(requestUpdateTemplate);
        }
    }

    render() {

        const { loading, statusChange } = this.props;

        // for search record using template name
        let finalItems = this.state.data.filter(item => (item.TemplateName.toLowerCase().includes(this.state.search.toLowerCase())));

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Templates}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('TemplateAddScreen', { onRefresh: this.onRefresh })
                    }}
                />

                {/* To set ProgressDialog as per our theme */}
                <ProgressDialog isShow={statusChange} />

                <View style={{ flex: 1 }}>
                    {/* display listloader till data is not populated*/}
                    {loading && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {/* for display Headers for list  */}
                            {
                                finalItems.length > 0
                                    ?
                                    <View style={{ flex: 1, marginBottom: R.dimens.widgetMargin }}>
                                        {/* for display data in row using flatlist  */}
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) =>
                                                <TemplateItem
                                                    item={item}
                                                    index={index}
                                                    size={this.state.data.length}
                                                    onEdit={() => this.editRecord(item)}
                                                    onUpdateFeature={() => this.templateStatusUpdate(item)}
                                                />
                                            }
                                            keyExtractor={item => item.ID.toString()}
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={() => this.onRefresh(true, true)}
                                                />}
                                        />

                                    </View>
                                    :
                                    !loading && <ListEmptyComponent module={R.strings.add_template} onPress={() => this.props.navigation.navigate('TemplateAddScreen', { onRefresh: this.onRefresh })} />
                            }
                        </View>
                    }
                </View>
            </SafeView>
        )
    }
    styles = () => {
        return {
            headerContainer: {
                flexDirection: "row",
                backgroundColor: R.colors.background,
                paddingTop: R.dimens.widgetMargin,
                paddingLeft: R.dimens.WidgetPadding,
                paddingRight: R.dimens.WidgetPadding,
                paddingBottom: R.dimens.widgetMargin
            },
        }
    }
}

// This Class is used for display record in list
class TemplateItem extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item !== nextProps.item || this.props.onUpdateFeature !== nextProps.onUpdateFeature) {
            return true
        }
        return false
    }

    render() {
        let item = this.props.item
        let size = this.props.size;
        let index = this.props.index;

        return (
            <View style={{
                flex: 1,
                marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin
            }}>
                <CardView style={{
                    elevation: R.dimens.listCardElevation,
                    flex: 1,
                    borderRadius: 0,
                    borderBottomLeftRadius: R.dimens.margin,
                    borderTopRightRadius: R.dimens.margin,
                }}>
                    <View style={{ flexDirection: 'row' }}>

                        {/* icon for email */}
                        <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                            <ImageTextButton
                                icon={R.images.IC_EMAIL_FILLED}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />
                        </View>

                        {/* for show TemplateName , TemplateType,  commercial service */}
                        <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                            <Text style={{
                                color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                fontFamily: Fonts.MontserratSemiBold
                            }}>{item.TemplateName}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.template_type + ': '}</TextViewHML>
                                <TextViewHML style={{
                                    flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText,
                                    marginLeft: R.dimens.widgetMargin
                                }}>{item.TemplateType ? item.TemplateType : '-'}</TextViewHML>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.commercial + ' ' + R.strings.service_type + ': '}</TextViewHML>
                                <TextViewHML style={{
                                    flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText,
                                    marginLeft: R.dimens.widgetMargin
                                }}>{item.CommServiceType ? item.CommServiceType : '-'}</TextViewHML>
                            </View>
                        </View>
                    </View>

                    {/* toggle for status change , edit icon*/}
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', }}>
                        <FeatureSwitch
                            isToggle={item.Status == 1 ? true : false}
                            onValueChange={this.props.onUpdateFeature}
                            style={{
                                backgroundColor: 'transparent',
                                padding: 0,
                                paddingTop: R.dimens.widgetMargin,
                                paddingBottom: R.dimens.widgetMargin,
                                paddingLeft: R.dimens.widgetMargin,
                                paddingRight: R.dimens.widgetMargin,
                            }}
                            textStyle={{ marginTop: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}
                        />
                        <ImageTextButton
                            style={
                                {
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: R.colors.accent,
                                    borderRadius: R.dimens.titleIconHeightWidth,
                                    margin: 0,
                                    padding: R.dimens.CardViewElivation,
                                    marginRight: R.dimens.widgetMargin,
                                }}
                            icon={R.images.IC_EDIT}
                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                            onPress={this.props.onEdit} />
                    </View>
                </CardView>
            </View>
        )
    }
    styles = () => {
        return {
            simpleItem: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: R.dimens.widgetMargin,
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
                marginBottom: R.dimens.widgetMargin,
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        // get data from reducer 
        loading: state.TemplateReducer.loading,
        templates_list: state.TemplateReducer.templates_list,
        statusChange: state.TemplateReducer.statusChange,
        statusResponse: state.TemplateReducer.statusResponse,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        // call action for get templatelist
        getEmailTemplates: () => dispatch(getEmailTemplates()),
        // call action for change status
        updateTemplateStatus: (requestUpdateTemplate) => dispatch(updateTemplateStatus(requestUpdateTemplate)),
        //clear data
        clearTemplateStatusChange: () => dispatch(clearTemplateStatusChange()),
        clearTemplate: () => dispatch(clearTemplate()),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateScreen)