import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { getProviderConfigList, clearProviderConfigrationList } from '../../../actions/Trading/ProviderConfigurationAction';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ProviderConfigurationScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            Response: [],
            search: '',
            refreshing: false,
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //call api to fetch transaction policy list
            this.props.getProviderConfigList()
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            //call api to fetchtransaction policy list
            this.props.getProviderConfigList()
            //----------
        } else {
            this.setState({ refreshing: false });
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
        if (ProviderConfigurationScreen.oldProps !== props) {
            ProviderConfigurationScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { providerConfigurationList } = props.Listdata;

            if (providerConfigurationList) {
                try {
                    //if local providerConfigurationList state is null or its not null and also different then new response then and only then validate response.
                    if (state.providerConfigurationList == null || (state.providerConfigurationList != null && providerConfigurationList !== state.providerConfigurationList)) {
                        if (validateResponseNew({ response: providerConfigurationList, isList: true })) {

                            //Get array from response
                            var res = parseArray(providerConfigurationList.Response);

                            //for add status static
                            for (var proKey in res) {
                                let item = res[proKey];
                                if (item.status == 1)
                                    item.statusStatic = R.strings.Active
                                else
                                    item.statusStatic = R.strings.Inactive
                            }

                            //Set State For Api response 
                            return { ...state, providerConfigurationList, Response: res, refreshing: false };
                        } else {
                            //Set State For Api response 
                            return { ...state, providerConfigurationList, Response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return { ...state, Response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    componentWillUnmount = () => {
        this.props.clearProviderConfigrationList()
    };

    render() {
        const { loading } = this.props.Listdata;

        let finalItems = this.state.Response;
        //For search
        finalItems = finalItems.filter(item =>
            item.statusStatic.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.APIKey.toLowerCase().includes(this.state.search.toLowerCase())
        );

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* statusbar and actionbar  */}
                <CommonStatusBar />
                <CustomToolbar
                    title={R.strings.providerConfiguration}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('AddEditProviderConfiguration', { onRefresh: this.onRefresh })}
                />

                <View style={{ flex: 1 }}>

                    {/* List Items */}
                    {
                        loading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            finalItems.length > 0 ?

                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    renderItem={({ item, index }) =>
                                        <ProviderConfigListItem
                                            index={index}
                                            item={item}
                                            onEdit={() => this.props.navigation.navigate('AddEditProviderConfiguration', { item: item, edit: true, onRefresh: this.onRefresh })}
                                            size={this.state.Response.length} />
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                />
                                :
                                <ListEmptyComponent module={R.strings.addProviderConfigTitle} onPress={() => this.props.navigation.navigate('AddEditProviderConfiguration', { onRefresh: this.onRefresh })} />
                    }
                </View>
            </SafeView>
        )
    }
    styles = () => {
        return {
            headerContainer: {
                flexDirection: "row",
                margin: R.dimens.WidgetPadding,
            },
        }
    }
}

// This Class is used for display record in list
class ProviderConfigListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        let item = this.props.item;
        let { index, size, onEdit } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1, marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>

                    <CardView style={{
                        borderRadius: 0, borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                    }}>

                        {/* for show UserName , Edit icon */}
                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.UserName === "" ? " - " : item.UserName}</TextViewMR>

                        {/* for show AppKey , apiKey ,SecretKey */}
                        <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.appkey + ': '}</TextViewHML>
                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.AppKey === "" ? " - " : item.AppKey}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.apiKey + ': '}</TextViewHML>
                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.APIKey === "" ? " - " : item.APIKey}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.secretKey + ': '}</TextViewHML>
                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.SecretKey === "" ? " - " : item.SecretKey}</TextViewHML>
                            </View>
                        </View>

                        {/* for show status */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
                            <StatusChip
                                color={item.status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.statusStatic}></StatusChip>

                            <ImageTextButton
                                style={
                                    {
                                        backgroundColor: R.colors.accent, alignItems: 'center', borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation, justifyContent: 'center',
                                    }}
                                iconStyle={{
                                    width: R.dimens.titleIconHeightWidth,
                                    height: R.dimens.titleIconHeightWidth,
                                    tintColor: 'white'
                                }}
                                icon={R.images.IC_EDIT}
                                onPress={onEdit} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated providerConfigureReducer data
        Listdata: state.providerConfigureReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getProviderConfigList action
        getProviderConfigList: () => dispatch(getProviderConfigList()),
        //Clear data
        clearProviderConfigrationList: () => dispatch(clearProviderConfigrationList()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ProviderConfigurationScreen);