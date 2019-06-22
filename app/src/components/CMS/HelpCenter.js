import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { getHelpManualModules } from '../../actions/CMS/HelpCenterAction';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import CardView from '../../native_theme/components/CardView';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class HelpCenter extends Component {
    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            data: [],           //for store array responce 
            refreshing: false,  //for refreshing data 
            search: '',         //for search value for data
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet connection
        if (await isInternet()) {

            //Call Api for Get HelpModuleList data
            this.props.getHelpManualModules();
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Api for Get HelpModuleList data
            this.props.getHelpManualModules();
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
        if (HelpCenter.oldProps !== props) {
            HelpCenter.oldProps = props;
        } else {
            return null;
        }
        
        //check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated fields of Particular actions
            const { moduleList } = props;

            //check for list data available or not
            if (moduleList) {
                try {
                    if (state.moduleList == null || (state.moduleList != null && moduleList !== state.moduleList)) {
                        if (validateResponseNew({ response: moduleList, returnCode: moduleList.responseCode, returnMessage: moduleList.message, isList: true })) {
                            var res = parseArray(moduleList.data);
                            return { ...state, data: res, refreshing: false, moduleList };
                        }
                        else {
                            return { ...state, data: [], refreshing: false, moduleList };
                        }
                    }
                } catch (e) {
                    return { ...state, data: [], refreshing: false };
                }
            }
        }
        return null;
    }


    // pass id to next screen for get idwisedata from api 
    onModuleSelect(id) {
        this.props.navigation.navigate('HelpCenterModule', { id: id })
    }

    render() {

        //loading bit for handling progress dialog
        let { loading } = this.props;
        let list = this.state.data;

        //for final items from search input (validate on module_name)
        //default searchInput is empty so it will display all records.
        let finalItems = list.filter(item => (item.locale[R.strings.getLanguage()] ? item.locale[R.strings.getLanguage()].module_name.toLowerCase().includes(this.state.search.toLowerCase()) : item.locale.en.module_name.toLowerCase().includes(this.state.search.toLowerCase())));;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.HelpCenter}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })} />

                <View style={{ flex: 1 }}>

                    {/* display listloader till data is not populated*/}
                    {loading && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>

                            {/* for display Headers for list  */}
                            {
                                finalItems.length
                                    ?
                                    <View style={{ flex: 1, marginBottom: R.dimens.widgetMargin }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => <FlatListItem
                                                item={item}
                                                onPress={() => { this.onModuleSelect(item._id) }}></FlatListItem>}
                                            /* assign index as key valye to Withdrawal list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={[
                                                { flexGrow: 1 },
                                                this.state.data.length ? null : { justifyContent: 'center' }
                                            ]}
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />}
                                        />
                                    </View>
                                    :
                                    <ListEmptyComponent />
                            }
                        </View>
                    }
                </View>
            </SafeView>
        );
    }
}

// This class is used for display records in list
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // get single item response from props
        let item = this.props.item;

        return (
            <AnimatableItem>
                <View style={this.styles().simpleItem}>

                    {/* for display module name and description in list  */}
                    <CardView style={{ flexDirection: 'row', alignItems: 'center' }} onPress={this.props.onPress}>

                        <View style={{ flex: 1 }}>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.locale[R.strings.getLanguage()] ? item.locale[R.strings.getLanguage()].module_name : item.locale.en.module_name}</Text>
                        </View>
                        <ImageButton
                            onPress={this.props.onPress}
                            icon={R.images.IC_RIGHT_ARROW}
                            style={{
                                margin: R.dimens.widgetMargin,
                            }}
                            iconStyle={{
                                tintColor: R.colors.textPrimary,
                                height: R.dimens.SMALL_MENU_ICON_SIZE,
                                width: R.dimens.SMALL_MENU_ICON_SIZE
                            }}
                        />
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }

    // styles for this class
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
        }
    }
}

function mapStateToProps(state) {
    return {
        // for get data from the reducer 
        moduleList: state.HelpCenterReducer.moduleList,
        loading: state.HelpCenterReducer.loading,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        // call action for get HelpMenuModuleList 
        getHelpManualModules: () => dispatch(getHelpManualModules())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HelpCenter)