// TemplateConfigurationScreen.js
import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getTemplateConfigurationList, clearTemplateConfigurationList } from '../../../actions/CMS/TemplateConfigurationAction';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue, } from '../../../validations/CommonValidation';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';

export class TemplateConfigurationScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {

            // for Template Configuration List
            TemplateConfigurationListResponse: [],
            TemplateConfigurationListState: null,

            searchInput: '',
            refreshing: false,
            isFirstTime: true,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        this.callTemplateConfigApi()
    }

    shouldComponentUpdate(nextProps, _nextState) {

        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearTemplateConfigurationList()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {
            // Call Get Template Configuration List API
            this.props.getTemplateConfigurationList();

        } else {
            this.setState({ refreshing: false });
        }
    }

    //api call
    callTemplateConfigApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call Template Configuration List Api
            this.props.getTemplateConfigurationList()
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (TemplateConfigurationScreen.oldProps !== props) {
            TemplateConfigurationScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { TemplateConfigurationList } = props.TemplateConfigResult

            // TemplateConfigurationList is not null
            if (TemplateConfigurationList) {
                try {
                    if (state.TemplateConfigurationListState == null || (state.TemplateConfigurationListState !== null && TemplateConfigurationList !== state.TemplateConfigurationListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: TemplateConfigurationList, isList: true, })) {
                            let res = parseArray(TemplateConfigurationList.Result);

                            // for set blank when value = null
                            res.map((item, index) => {
                                res[index].Value = item.Value != null ? item.Value : "";
                            })

                            return Object.assign({}, state, {
                                TemplateConfigurationListState: TemplateConfigurationList,
                                TemplateConfigurationListResponse: res,
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                TemplateConfigurationListState: null,
                                TemplateConfigurationListResponse: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        TemplateConfigurationListState: null,
                        TemplateConfigurationListResponse: [],
                        refreshing: false,
                    })
                }
            }
        }
        return null
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { TemplateConfigListLoading, } = this.props.TemplateConfigResult

        // For searching
        let finalItems = this.state.TemplateConfigurationListResponse.filter(item => (
            item.Value !== null && item.Value.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.templatesConfiguration}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (TemplateConfigListLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <TemplateConfigurationListItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length}
                                    onPress={() => { this.props.navigation.navigate('EditTemplateConfigurationScreen', { item, onSuccess: this.callTemplateConfigApi, edit: true }) }}
                                />
                                }
                                // assign index as key value to Template Configuration list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Template Configuration FlatList Item
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                // Displayed empty component when no record found 
                                ListEmptyComponent={<ListEmptyComponent />}
                            />
                    }
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class TemplateConfigurationListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
           { return false }
        return true
    }

    render() {
        let {  item, size, index, onPress } = this.props

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,  borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin, flex: 1,
                    }} >
                        <View style={{ flex: 1 }}>

                            {/* for Value and ServiceType */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{
                                        color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                        fontFamily: Fonts.MontserratSemiBold,
                                    }}>{validateValue(item.Value)/*  != null ? item.Value : '-' */}</Text>
                                </View>
                                <Text style={{
                                    color: R.colors.yellow, fontSize: R.dimens.smallestText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{item.ServiceType == 1 ? 'SMS' : 'EMAIL'}</Text>
                            </View>
                        </View>

                        {/* for status and Edit icon */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={(item.IsOnOff == 1) ? R.colors.successGreen : R.colors.failRed}
                                value={item.IsOnOff == 1 ? R.strings.active : R.strings.inActive} />
                            <ImageTextButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                    }}
                                icon={R.images.IC_EDIT}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={onPress}
                            />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Template Configuration data from reducer
        TemplateConfigResult: state.TemplateConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Template Configuration Action
    getTemplateConfigurationList: () => dispatch(getTemplateConfigurationList()),
    // Clear Template Configuration Data Action
    clearTemplateConfigurationList: () => dispatch(clearTemplateConfigurationList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TemplateConfigurationScreen)