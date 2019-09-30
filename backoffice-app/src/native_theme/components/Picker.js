import React, { Component } from 'react';
import { View, Image, YellowBox, TouchableWithoutFeedback, Modal, FlatList } from 'react-native';
import Dropdown from './DropDownLib/dropdown';
import R from '../R';
import CardView, { getCardStyle } from './CardView';
import LinearGradient from 'react-native-linear-gradient';
import TextViewHML from './TextViewHML';
import { Fonts, ServiceUtilConstant, Events } from '../../controllers/Constants';
import CustomToolbar from './CustomToolbar';
import MenuListItem from './MenuListItem';
import { contentContainerStyle, ListEmptyComponent } from './FlatListWidgets';
import TextViewMR from './TextViewMR';
import { isEmpty } from '../../validations/CommonValidation';
import CommonStatusBar from './CommonStatusBar';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { getData } from '../../App';
import { addListener } from '../../controllers/CommonUtils';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

class PickerComponent extends Component {
    constructor(props) {
        super(props);

        // for get data from props
        let finalData = PickerComponent.getData(props);
        let data = finalData.data, selectedIndex = finalData.selectedIndex;

        //Define All initial State
        this.state = {
            selectedIndex,
            data,
            showModal: false,
            searchInput: '',
            width: getData(ServiceUtilConstant.KEY_DIMENSIONS).width,
            height: getData(ServiceUtilConstant.KEY_DIMENSIONS).height,
        }
    }

    componentDidMount() {
        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => this.setState(Object.assign({}, this.state, data)));
    }

    componentWillUnmount() {
        if (this.dimensionListener) {
            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    // called on selection of picker
    onPickerSelect = (object) => {

        // Send selected item to its parent view
        this.props.onPickerSelect(object.value, object);

        // Store selected object's index, Hide Modal if its showing, clear search input
        this.setState({ selectedIndex: object.index, showModal: false, searchInput: '' })
    }

    static getDerivedStateFromProps(props, state) {
        // if cached data and new data is different
        if (state.data !== props.data) {
            return Object.assign({}, state, PickerComponent.getData(props));
        }

        // if cached data and new data is different
        if (state.value !== props.value) {
            return Object.assign({}, state, PickerComponent.getData(props));
        }

        return null;
    }

    // for Get required data from props
    static getData(props) {

        let data = [], selectedIndex = 0;
        // if props data length is not undefined and greater than 0 size
        if (props.data !== undefined && props.data.length > 0) {
            data = props.data;

            // add index field in whole array to indetify particular item
            data.map((_item, index) => {
                data[index].index = index;
            });

            // find currently selected item
            selectedIndex = data.findIndex(el => el.value === props.value);
        }

        return { data, selectedIndex: selectedIndex == -1 ? 0 : selectedIndex }
    }

    render() {

        // for Get required field from props
        let props = this.props;

        //filter search with list
        let filteredList = [];

        if (this.state.data !== undefined && this.state.data.length > 0) {

            //for final items from search input (validate on value)
            //default searchInput is empty so it will display all records.
            filteredList = this.state.data.filter(item => (
                item.value.toLowerCase().includes(this.state.searchInput.toLowerCase())
            ));
        }

        // if searchable property is passed then show dialog
        if (props.searchable !== undefined && props.searchable) {

            return (
                <View>
                    <MainRenderItem
                        onPress={() => this.setState({ showModal: true })}
                        isGradient={props.isGradient}
                        arrowStyle={props.arrowStyle}
                        title={props.value ? props.value : ''}
                        displayArrow={props.displayArrow}
                        style={props.renderItemStyle}
                        textStyle={props.renderItemTextStyle}
                        dynamicHeight={typeof props.dynamicHeight === 'undefined' ? false : true} />

                    <Modal
                        supportedOrientations={['portrait', 'landscape']}
                        visible={this.state.showModal}
                        transparent={true}
                        animationType={"fade"}
                        onRequestClose={() => { }}>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0, 0.2)',
                        }}>
                            <CommonStatusBar backgroundColor={R.colors.progressStatusColor} />
                            <View
                                style={[
                                    {
                                        width: widthPercentageToDP(80),
                                        height: this.state.height * 80 / 100,
                                        backgroundColor: R.colors.background,
                                        borderRadius: R.dimens.detailCardRadius,
                                        ...getCardStyle(R.dimens.CardViewElivation)
                                    },
                                    R.colors.getTheme().includes('ni') ? { borderColor: R.colors.textPrimary, borderWidth: R.dimens.pickerBorderWidth } : {},
                                ]}>

                                {/* Title of picker */}
                                <TextViewMR style={{
                                    fontSize: R.dimens.mediumText,
                                    color: R.colors.textPrimary,
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                    alignSelf: 'center'
                                }}>{isEmpty(props.title) ? R.strings.Please_Select : props.title}</TextViewMR>

                                {/* Search View */}
                                <CustomToolbar
                                    visibleSearch={true}
                                    searchHint={R.strings.searchHere}
                                    onSearchText={(text) => this.setState({ searchInput: text })}
                                    onSearchCancel={() => {
                                        if (this.state.searchInput !== '') {
                                            this.setState({ searchInput: '' });
                                        } else {
                                            this.setState({ showModal: false });
                                        }
                                    }} />

                                {/* List */}
                                <FlatList
                                    data={filteredList}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return <MenuListItem
                                            key={index + ''}
                                            icon={item.icon}
                                            iconStyle={item.iconStyle}
                                            title={item.value}
                                            titleStyle={{ color: (props.isolateSelection !== undefined && props.isolateSelection ? (item.index === this.state.selectedIndex ? R.colors.textPrimary : R.colors.textSecondary) : R.colors.textPrimary) }}
                                            isSelected={false}
                                            onPress={() => this.onPickerSelect(item)}
                                            style={{
                                                marginTop: 0,
                                                marginBottom: 0,
                                                backgroundColor: 'transparent'
                                            }}
                                            withIcon={props.withIcon}
                                            separator={index != filteredList.length - 1}
                                        />
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={contentContainerStyle(filteredList)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        } else {
            return (
                <Dropdown
                    data={this.state.data}
                    value={props.value}
                    selectedItemColor={R.colors.textPrimary}
                    itemColor={R.colors.textSecondary}
                    disabled={props.disabled}
                    dropDownStyle={{ backgroundColor: R.colors.pickerBackground }}
                    onChangeText={(value, index, data) => this.onPickerSelect(data[index])}
                    rippleInsets={{ top: 0, bottom: R.dimens.rippleInsetsBottom }}
                    renderBase={props.renderBase == null ? () => {
                        return <MainRenderItem
                            isGradient={props.isGradient}
                            arrowStyle={props.arrowStyle}
                            title={props.value ? props.value : ''}
                            displayArrow={props.displayArrow}
                            style={props.renderItemStyle}
                            textStyle={props.renderItemTextStyle}
                            dynamicHeight={typeof props.dynamicHeight === 'undefined' ? false : true} />
                    } : props.renderBase}
                    containerStyle={{ width: props.width }}
                    dropDownTextStyle={{ fontFamily: Fonts.HindmaduraiLight }}
                    supportedOrientations={['portrait', 'landscape']}
                />
            );
        }
    }
}

function MainRenderItem(props) {

    let style = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: R.dimens.ButtonHeight,
        paddingTop: R.dimens.widgetMargin,
        paddingBottom: R.dimens.widgetMargin,
        paddingLeft: R.dimens.widget_left_right_margin,
        paddingRight: R.dimens.widget_left_right_margin,
    }

    if (typeof props.dynamicHeight !== 'undefined' && props.dynamicHeight) {
        delete style['height'];
        delete style['paddingTop'];
        delete style['paddingBottom'];
    }

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={[style, props.style]}>
                <View style={{ width: '90%' }}>
                    <TextViewHML style={[{
                        color: props.isGradient ? R.colors.white : R.colors.textSecondary,
                        fontSize: R.dimens.smallText,
                    }, props.textStyle]}>
                        {props.title}
                    </TextViewHML>
                </View>

                {
                    props.displayArrow &&
                    <View style={{ width: '10%', alignItems: 'flex-end' }}>
                        <Image source={R.images.IC_EXPAND_ARROW} style={[{ height: R.dimens.titleIconHeightWidth - 5, width: R.dimens.titleIconHeightWidth - 5, tintColor: props.isGradient ? R.colors.white : R.colors.textSecondary }, props.arrowStyle]} />
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    );
}

class Picker extends Component {

    render() {
        let isGradient = this.props.isGradient;
        let isRound = this.props.isRound !== undefined ? this.props.isRound : false;

        let radius = 0;
        if (isRound) {
            radius = R.dimens.LoginButtonBorderRadius;
        }

        //If isGradient Property is passed than it will show gradient background.
        if (isGradient !== undefined && isGradient) {
            return (
                <LinearGradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={[R.colors.linearStart, R.colors.linearEnd]}
                    style={{
                        width: this.props.width,
                        marginTop: R.dimens.widgetMargin,
                        marginBottom: R.dimens.margin,
                        marginLeft: R.dimens.CardViewElivation,
                        marginRight: R.dimens.CardViewElivation,
                        ...this.props.cardStyle
                    }}>
                    <PickerComponent isolateSelection={false} {...this.props} />
                </LinearGradient >
            )
        } else {
            return (
                <CardView
                    style={{
                        marginTop: R.dimens.widgetMargin,
                        marginBottom: R.dimens.margin,
                        marginLeft: R.dimens.CardViewElivation,
                        marginRight: R.dimens.CardViewElivation,
                        padding: 0,
                        paddingLeft: isRound ? R.dimens.margin_left_right : 0,
                        paddingRight: isRound ? R.dimens.widget_left_right_margin : 0,
                        ...this.props.cardStyle
                    }}
                    cardElevation={R.dimens.CardViewElivation}
                    cardRadius={radius}>
                    <PickerComponent isolateSelection={false} {...this.props} />
                </CardView>
            )
        }
    }
}
export default Picker;