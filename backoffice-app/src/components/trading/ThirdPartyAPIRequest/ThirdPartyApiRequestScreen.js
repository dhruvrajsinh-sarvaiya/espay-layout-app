import React, { Component } from 'react';
import { View, FlatList, RefreshControl, } from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { connect } from 'react-redux';
import { GetApiProviderList } from '../../../actions/Trading/LiquidityAPIManagerAction'
import { changeTheme, parseArray, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ThirdPartyApiRequestScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            refreshing: false,
            searchInput: '',
            row: [],
            response: [],
            isFirstTime: true,
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Fetch provider List
            this.props.getProvidersList();
        }
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
        if (ThirdPartyApiRequestScreen.oldProps !== props) {
            ThirdPartyApiRequestScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { response, loading } = props;

            //check fetch Third party Data API response.
            if (!loading) {
                try {
                    if (response != null) {
                        //handle response of API
                        if (validateResponseNew({ response: response, isList: false })) {

                            //validate Array using parseArray
                            var res = parseArray(response.Response);

                            return { ...state, response: res, refreshing: false };
                        } else {
                            return { ...state, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            //Call Get Providers List API
            this.props.getProvidersList();

        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {
        let { loading } = this.props

        let finalItem = [];
        //for search
        if (this.state.response != undefined) {
            finalItem = this.state.response.filter((item) => (item.APIName.toUpperCase().includes(this.state.searchInput.toUpperCase())))
        }
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.third_party_api_request}
                    rightIcon={R.images.IC_PLUS}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    onRightMenuPress={() => this.props.navigation.navigate('ThirdPartyApiRequestAdd', { onRefresh: this.onRefresh })}
                    nav={this.props.navigation}
                />

                {/* For FlatList View */}
                <View style={{ flex: 1 }}>
                    {(loading && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        finalItem.length ?
                            <FlatList
                                data={finalItem}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ index, item }) => <ThirdPartyApiRequestItem
                                    item={item}
                                    index={index}
                                    size={this.state.response.length}
                                    onEdit={() => this.props.navigation.navigate('ThirdPartyApiRequestAdd', { ITEM: item, onRefresh: this.onRefresh })}
                                />
                                }
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => this.onRefresh(true, true)}
                                    />
                                }
                                keyExtractor={item => item.Id.toString()}
                            />
                            : <ListEmptyComponent module={R.strings.add_third_party_api_request}
                                onPress={() => this.props.navigation.navigate('ThirdPartyApiRequestAdd', { onRefresh: this.onRefresh })} />
                    }
                </View>
            </SafeView>
        );
    };

    styles = () => {
        return {
            headerContainer: {
                flexDirection: "row",
                backgroundColor: R.colors.background,
                alignItems: 'center',
                paddingLeft: R.dimens.widget_left_right_margin,
                paddingRight: R.dimens.widget_left_right_margin,
                paddingBottom: R.dimens.LineHeight,
            },
        }
    }
}

class ThirdPartyApiRequestItem extends Component {

    render() {
        let item = this.props.item
        let { index, size, onEdit } = this.props

        return (
            // Flatlist item animation
            <AnimatableItem>
                
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView style={{ flex: 1,  borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin, elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        {/* To show APIName */}
                        <View style={{ flex: 1 }}>
                            <TextViewMR 
                            style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.APIName ? item.APIName : '-'}</TextViewMR>
                        </View>

                        {/* To show MethodType ,AppTypeText */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.type}</TextViewHML>
                                <TextViewHML style={{
                                    color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                    paddingLeft: R.dimens.widgetMargin
                                }}>{item.MethodType ? item.MethodType : '-'}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.app_type}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.AppTypeText ? item.AppTypeText : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* To show APISendURL ,edit icon */}
                        <View style={{ marginTop: R.dimens.widgetMargin }}>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.api_send_url}</TextViewHML>
                            <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.APISendURL}</TextViewHML>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
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
                                onPress={onEdit} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //data get from the reducer and set to appData
        response: state.liquidityAPIManagerReducer.Apiproviderlistdata,
        loading: state.liquidityAPIManagerReducer.isApiproviderlistFetch
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        getProvidersList: () => dispatch(GetApiProviderList()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartyApiRequestScreen)