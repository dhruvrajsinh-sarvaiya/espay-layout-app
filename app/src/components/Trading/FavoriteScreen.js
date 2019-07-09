import React, { Component, PureComponent } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { validateResponseNew, isInternet } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import { getFavourites, removeFavourite as removeFavouriteApi } from '../../actions/Trade/FavouriteActions';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import CommonToast from '../../native_theme/components/CommonToast';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';
import { getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';

class FavoriteScreen extends Component {
    constructor(props) {
        super(props);

        // Create Reference
        this.toast = React.createRef();

        // Bind all methods
        this.onRefresh = this.onRefresh.bind(this);
        this.removeItemFromList = this.removeItemFromList.bind(this);
        this.moveItemToAbove = this.moveItemToAbove.bind(this);
        this.onRightMenuPress = this.onRightMenuPress.bind(this);

        //Define all initial State
        this.state = {
            favList: null,
            removeFavourite: null,
            response: [],
            refreshing: false
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check for internet connection
        if (await isInternet()) {

            //To get the favourites list based on IsMargin bit
            if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                this.props.getFavourites({ IsMargin: 1 });
            } else {
                this.props.getFavourites({});
            }
        }
    };

    shouldComponentUpdate(nextProps, nextState) {

        // stop twice api call 
        return isCurrentScreen(nextProps);
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (FavoriteScreen.oldProps !== props) {
            FavoriteScreen.oldProps = props;
        } else {
            return null;
        }

        //check for current screen
        if (isCurrentScreen(props)) {
            try {
                //Get All Updated field of Particular actions 
                let { favourites: { favouriteList, marginFavouriteList } } = props;

                let favList = getData(ServiceUtilConstant.KEY_IsMargin) ? marginFavouriteList : favouriteList;

                //if favourite response is not null then handle resposne
                if (favList) {

                    //if local favouritesData state is null or its not null and also different then new response then and only then validate response.
                    if (state.favList == null || (state.favList != null && favList !== state.favList)) {

                        //if favouriteList response is success then store array list else store empty list
                        if (validateResponseNew({ response: favList, isList: true })) {
                            let res = parseArray(favList.response);
                            return Object.assign({}, state, {
                                favList,
                                response: res,
                                refreshing: false
                            })
                        } else {
                            return Object.assign({}, state, {
                                favList,
                                response: [],
                                refreshing: false
                            })
                        }
                    }
                }
            } catch (error) {
                return Object.assign({}, state, {
                    refreshing: false
                });
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions 
        let { favourites: { removeFavourite } } = this.props;

        //If remove favourite props are different than check sub conditions
        if (removeFavourite !== prevProps.favourites.removeFavourite) {

            //If removeFavourite is not null 
            if (removeFavourite) {

                //Validate Response
                validateResponseNew({ response: removeFavourite, isList: true });

                this.toast.Show(this.props.favourites.removeFavourite.ReturnMsg);

                // check for internet connection
                if (await isInternet()) {

                    //Call Get Get Favourite list API based on IsMargin Bit
                    if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                        this.props.getFavourites({ IsMargin: 1 });
                    } else {
                        this.props.getFavourites({});
                    }
                }
                this.setState({
                    favList: null
                })
            }
        }
    };

    // To remove item from favourite
    async removeItemFromList(id) {

        //check for internet connection
        if (await isInternet()) {
            //Call Remove Favourite Item API based on IsMargin Bit
            if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                this.props.removeFavourite({ PairId: id, IsMargin: 1 });
            } else {
                this.props.removeFavourite({ PairId: id });
            }
        }
    }

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Get Favourite list API based on IsMargin Bit
            if (getData(ServiceUtilConstant.KEY_IsMargin)) {
                this.props.getFavourites({ IsMargin: 1 });
            } else {
                this.props.getFavourites({});
            }
        } else {
            this.setState({ refreshing: false });
        }
    }

    // to move records above
    moveItemToAbove(index) {

        //if moving index is not 0 then move
        if (index != 0) {

            //fetch arranged item
            let response = rearrangeItems(this.state.response, index, 0);

            //Store list
            this.setState({ response });
        }
    }

    // on done redirect to previous screen
    onRightMenuPress() {
        this.props.navigation.goBack()
    }

    render() {

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.editFavoriteTitle}
                    rightMenu={R.strings.done}
                    isBack={true}
                    nav={this.props.navigation}
                    onRightMenuPress={this.onRightMenuPress}
                />

                {/* Custom Toast */}
                <CommonToast ref={(cmp) => this.toast = cmp} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={this.props.favourites.isRemoving} />

                {this.props.favourites.isFetching && !this.state.refreshing ? <ListLoader /> :
                    <View style={{ flex: 1 }}>
                        {/* if Response Length is > 0 then display favourit list else none */}
                        {this.state.response.length > 0 && <View>
                            <View style={this.styles().headerContainer}>

                                <View style={{ flex: 1 }}>
                                    <TextViewHML
                                        style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {R.strings.pair}
                                    </TextViewHML>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <TextViewHML
                                        style={{
                                            color: R.colors.textPrimary, textAlign: 'right',
                                            fontSize: R.dimens.smallestText
                                        }}>
                                        {R.strings.top}
                                    </TextViewHML>
                                </View>
                            </View>
                            <Separator />
                        </View>}

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.response}
                            extraData={this.state}
                            ItemSeparatorComponent={() => <Separator />}
                            renderItem={({ item, index }) =>
                                <FavouriteItem
                                    key={item.PairId.toString()}
                                    item={item}
                                    onRemove={() => this.removeItemFromList(item.PairId)}
                                    onTop={() => this.moveItemToAbove(index)} />
                            }
                            keyExtractor={item => item.PairId.toString()}
                            contentContainerStyle={contentContainerStyle(this.state.response)}
                            /* for refreshing data of flatlist */
                            refreshControl={
                                <RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                            ListEmptyComponent={<ListEmptyComponent />}
                        />
                    </View>
                }
            </SafeView >
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
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

// for arrange records as per index
function rearrangeItems(items, moveFromIndex, moveToIndex) {

    const movingItem = items[moveFromIndex];
    items.splice(moveFromIndex, 1);
    items.splice(moveToIndex, 0, movingItem);

    return items;
}

class FavouriteItem extends PureComponent {
    render() {

        // Get required fields from props
        let props = this.props;
        let item = props.item;

        return (
            <AnimatableItem>
                <View style={this.styles().simpleItem}>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <ImageButton
                            style={{ padding: 0, paddingRight: R.dimens.widgetMargin, margin: 0 }}
                            icon={R.images.IC_MINUS_CIRCLE}
                            iconStyle={{ tintColor: R.colors.failRed, height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE }}
                            onPress={props.onRemove} />
                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{item.PairName.replace('_', '/')}</TextViewMR>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', alignSelf: 'center' }}>
                        <ImageButton
                            icon={R.images.IC_ARROW_COLLAPSE}
                            iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textPrimary }]}
                            onPress={props.onTop}
                            style={{ margin: 0 }}
                        />
                    </View>
                </View>
            </AnimatableItem>
        )
    }

    styles() {
        return {
            simpleItem: {
                flexDirection: "row",
                marginTop: R.dimens.widgetMargin,
                marginLeft: R.dimens.WidgetPadding,
                marginRight: R.dimens.widget_left_right_margin,
                marginBottom: R.dimens.widgetMargin,
            },
        }
    }
}

function mapStatToProps(state) {

    // Updated Data of Favourites
    return {
        favourites: state.favouriteReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {

        // Perform Favourites list Action
        getFavourites: (payload) => dispatch(getFavourites(payload)),

        // Perform Remove Favourites Action
        removeFavourite: (payload) => dispatch(removeFavouriteApi(payload)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(FavoriteScreen);