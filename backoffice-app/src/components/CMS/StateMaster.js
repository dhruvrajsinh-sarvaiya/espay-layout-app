import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import PaginationWidget from '../../components/widget/PaginationWidget';
import { isCurrentScreen } from '../../components/Navigation';
import { connect } from 'react-redux';
import Picker from '../../native_theme/components/Picker';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { CountrylistFetchData, DeleteCountrylistData, DeleteCountrylistClear } from '../../actions/CMS/StateMasterAction'
import R from '../../native_theme/R';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import TextViewMR from '../../native_theme/components/TextViewMR';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import StatusChip from '../widget/StatusChip';

class StateMaster extends Component {

    constructor(props) {
        super(props);
        this.CountyItems = []
        this.Country = [];
        this.state = {
            row: [],
            pageNo: 2,
            selectedPage: 1,
            paginationBit: true,
            data: null,
            search: '',
            refreshing: false,
            country: 0,
            countryname: '',
            resdata: null,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.props.CountrylistFetchData()
        }
        else {
            this.setState({ refreshing: false });
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get Transfer In History API
            this.props.CountrylistFetchData();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    //for pagination
    addRow = () => {
        for (var i = 1; i <= this.state.pageNo; i++) {
            this.state.row.push(i);
            this.setState({ row: this.state.row })
        }
    }

    //call items
    onPageChange = async (pNo) => {
        this.setState({ selectedPage: pNo });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for newsdata fetch
            this.props.CountrylistFetchData()
        }
        else {
            this.setState({ refreshing: false });
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { Countrylistdata, CountrylistdataFetch, DeleteCountrylistdata, DeletedCountrylistdataFetch } = this.props;

        if (Countrylistdata != prevProps.Countrylistdata) {
            if (!CountrylistdataFetch) {
                try {
                    if (validateResponseNew({ response: Countrylistdata, returnCode: Countrylistdata.ReturnCode, returnMessage: Countrylistdata.ReturnMessage, isList: true })) {
                        //Get array from response
                        var res = parseArray(Countrylistdata.List);

                        //check pagination bit for Not Display double time pages in pagination 
                        if (this.state.paginationBit) {
                            this.addRow();
                            this.setState({ paginationBit: false })
                        }
                        for (var i = 0; i < res.length; i++) {
                            let item = res[i].county;
                            this.CountyItems[i] = item;
                            this.Country[i] = { 'value': item }
                        }
                        let index = this.state.country
                        //Set State For Api response 
                        this.setState({ data: res[index].stateList, refreshing: false, countryname: this.Country[0].value, resdata: res });
                    }
                    else {
                        this.setState({ refreshing: false, data: [], row: [] });
                    }
                } catch (e) {
                    this.setState({ refreshing: false, data: [], row: [] });
                }
            }
        }

        if (DeleteCountrylistdata != prevProps.DeleteCountrylistdata) {
            // for show responce of delete data
            if (!DeletedCountrylistdataFetch) {
                try {
                    if (validateResponseNew({ response: DeleteCountrylistdata, returnCode: DeleteCountrylistdata.ReturnCode, returnMessage: DeleteCountrylistdata.ReturnMessage })) {
                        showAlert(R.strings.status, DeleteCountrylistdata.ReturnMessage, 0, async () => {
                            //Check NetWork is Available or not
                            if (await isInternet()) {
                                this.props.DeleteCountrylistClear()
                                //  call api for Countrylist Fetch
                                this.props.CountrylistFetchData()
                            }
                        })
                    }
                    else {
                        this.props.DeleteCountrylistClear()
                    }
                } catch (e) {
                    this.props.DeleteCountrylistClear()
                }
            }
            // -------------------------------
        }
    };

    deleteRecord = async (id) => {
        showAlert(R.strings.Delete_Record, R.strings.areyousure, 3, async () => {
            //Check NetWork is Available or not
            if (await isInternet()) {
                //  call api for delete Country list data
                this.props.DeleteCountrylistData(id)
            }
        }, R.strings.cancel)
    }

    _onStatus = (value) => {
        if (this.refs.spStatus != null && value != '') {
            this.setState({ Status: value })
        }
    }

    _onCountry = (value) => {
        try {
            //Chcek if Item is Select From Select Currency DropDown
            if (this.refs.spCountry != null) {
                //Store Update DropDown Item and Perform Currency Change Action For Update Item
                var i = this.CountyItems.indexOf(value);
                this.setState({ data: this.state.resdata[i].stateList, countryname: value, country: i })
            }
        }
        catch (e) {
            //Catch Code here
        }
    }

    render() {
        const { isCountrylistfetch, isDeleteCountrylist } = this.props;

        let finalItems = this.state.data != null ? this.state.data.filter(item => (item.C_name.includes(this.state.search))) : '';

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* statusbar and actionbar  */}
                <CommonStatusBar />

                <CustomToolbar
                    title={R.strings.State}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('StateMasterAdd')}
                />

                <ProgressDialog isShow={isDeleteCountrylist} />

                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: R.dimens.padding_left_right_margin, marginRight: R.dimens.padding_left_right_margin }}>
                    <Picker
                        ref='spCountry'
                        title={R.strings.selectCurrency}
                        searchable={true}
                        withIcon={true}
                        data={this.Country}
                        value={this.state.countryname}
                        onPickerSelect={(value) => this._onCountry(value)}
                        displayArrow={'true'}
                        width={'100%'}
                    />
                </View>

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        isCountrylistfetch && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {/* for display Headers for list  */}
                                {finalItems.length > 0 ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) =>
                                                <FlatlistItem
                                                    item={item}
                                                    index={index}
                                                    size={this.state.data.length}
                                                    onEdit={() => this.props.navigation.navigate('StateMasterAdd', { data: item, countryName: this.state.countryname })}
                                                    onDelete={() => this.deleteRecord(item.C_id)}
                                                />
                                            }
                                            keyExtractor={item => item.C_id}
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
                                    <ListEmptyComponent />}
                            </View>
                    }
                    <View>
                        {finalItems.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                    </View>
                </View>
            </View>
        )
    }
}

// This Class is used for display record in list
class FlatlistItem extends Component {
    constructor(props) {
        super(props);

    }
    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }
    render() {
        let item = this.props.item;
        let { index, size } = this.props;
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin
            }}>
                <CardView style={{
                    elevation: R.dimens.listCardElevation,
                    flex: 1,
                    borderRadius: 0,
                    flexDirection: 'column',
                    borderBottomLeftRadius: R.dimens.margin,
                    borderTopRightRadius: R.dimens.margin,
                }} onPress={this.props.onDetailScreen}>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View>
                            <ImageTextButton
                                icon={R.images.IC_EARTH}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: R.dimens.margin, }}>
                            <View style={{ flex: 1, justifyContent: "space-between", flexDirection: 'row', alignItems: 'center' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.C_name ? item.C_name : '-'}</TextViewMR>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, }}
                                        icon={R.images.IC_EDIT}
                                        onPress={this.props.onEdit}
                                        iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, }}
                                        icon={R.images.IC_DELETE}
                                        onPress={this.props.onDelete}
                                        iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'flex-end', marginTop: R.dimens.widgetMargin }}>
                        <View style={{ justifyContent: 'flex-end' }}>
                            <StatusChip
                                color={item.C_status === 'Active' ? R.colors.successGreen : R.colors.failRed}
                                value={item.C_status}></StatusChip>
                        </View>
                    </View>

                </CardView>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Adddata get from the reducer and set 
        isCountrylistfetch: state.StateMasterReducer.isCountrylistfetch,
        Countrylistdata: state.StateMasterReducer.Countrylistdata,
        CountrylistdataFetch: state.StateMasterReducer.CountrylistdataFetch,

        isDeleteCountrylist: state.StateMasterReducer.isDeleteCountrylist,
        DeleteCountrylistdata: state.StateMasterReducer.DeleteCountrylistdata,
        DeletedCountrylistdataFetch: state.StateMasterReducer.DeletedCountrylistdataFetch,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        CountrylistFetchData: () => dispatch(CountrylistFetchData()),
        DeleteCountrylistData: () => dispatch(DeleteCountrylistData()),
        DeleteCountrylistClear: () => dispatch(DeleteCountrylistClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StateMaster)