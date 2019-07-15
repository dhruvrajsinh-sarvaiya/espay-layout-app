import {
    View,
    TextInput
} from 'react-native';
import ImageButton from './ImageTextButton';
import React, { Component } from 'react';
import OptionsMenu from "react-native-options-menu";
import Picker from './Picker';
import R from '../R';
import { connect } from 'react-redux';
import { Fonts } from '../../controllers/Constants';
import TextViewMR from './TextViewMR';
import { createOptions, createActions } from '../../controllers/CommonUtils';

//Create Common class for Filter View
class CustomToolbar extends Component {

    constructor(props) {
        super(props);

        // create reference 
        this.searchView = React.createRef();

        // Bind all methods
        this.cancelSearchView = this.cancelSearchView.bind(this);

        //Define All initial State
        this.state = {
            visibleSearch: props.visibleSearch ? props.visibleSearch : false,
            isShowPicker: props.isShowPicker ? props.isShowPicker : false,
        }
    }

    handleBack = () => {
        //To go back to previous screen using screen's current props.
        this.props.nav.goBack();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.visibleSearch !== undefined && state.visibleSearch != props.visibleSearch) {
            return Object.assign({}, state, {
                visibleSearch: props.visibleSearch
            })
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.visibleSearch === nextState.visibleSearch &&
            this.state.isShowPicker === nextState.isShowPicker &&
            this.props.leftIcon === nextProps.leftIcon &&
            this.props.rightIcon === nextProps.rightIcon &&
            this.props.rightMenu === nextProps.rightMenu &&
            this.props.isCancel === nextProps.isCancel &&
            this.props.searchHint === nextProps.searchHint &&
            this.props.onSearchText === nextProps.onSearchText &&
            this.props.onSearchCancel === nextProps.onSearchCancel &&
            this.props.searchable === nextProps.searchable &&
            this.props.toolbarColor === nextProps.toolbarColor &&
            this.props.isBack === nextProps.isBack &&
            this.props.title === nextProps.title &&
            this.props.titleIcon === nextProps.titleIcon &&
            this.props.pickerData === nextProps.pickerData &&
            this.props.pickerValue === nextProps.pickerValue &&
            this.props.textStyle === nextProps.textStyle &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.dimensions.isPortrait === nextProps.preference.dimensions.isPortrait) {
            return false
        }
        return true
    }

    // for on press on cancel button in search view
    cancelSearchView() {
        //To clear search result from calling screen by passing empty string.
        this.props.onSearchText && this.props.onSearchText('');

        this.searchView.clear();

        //If onSearchCancel method is passed then execute it otherwise hide search view from here.
        this.props.onSearchCancel != undefined ? this.props.onSearchCancel() : this.setState({ visibleSearch: false })
    }

    render() {

        // Get required fields from props 
        let props = this.props;
        let needLeftMenu = props.leftIcon || props.leftMenu;
        let needRightMenu = props.rightIcon || props.rightMenu;
        let isCancel = props.isCancel ? props.isCancel : false;

        return (
            <View>
                {/* Search View  */}
                {
                    (this.state.visibleSearch) &&
                    <this.SearchView
                        isCancel={isCancel}
                        placeholder={props.searchHint}
                        onChangeText={props.onSearchText}
                        onCancel={this.cancelSearchView}
                        style={props.style}
                    />
                }

                {/* Toolbar */}
                {(!this.state.visibleSearch) &&
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[this.styles().customToolbarMain, props.toolbarColor ? { backgroundColor: props.toolbarColor } : {}]}>

                            {/* Left Menu */}
                            <View style={[{ width: '20%', flexDirection: 'row' }, props.leftStyle]}>
                                {
                                    (needLeftMenu) &&
                                    <ImageButton
                                        name={props.leftMenu}
                                        icon={props.leftIcon}
                                        isHML
                                        style={{ margin: 0, padding: R.dimens.WidgetPadding }}
                                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }, props.leftIconStyle]}
                                        onPress={props.onLeftMenuPress} />
                                }
                                {
                                    props.isBack &&
                                    <ImageButton
                                        name={props.leftMenu}
                                        icon={R.images.BACK_ARROW}
                                        isHML
                                        style={{ margin: 0, padding: R.dimens.WidgetPadding }}
                                        onPress={props.onBackPress ? props.onBackPress : this.handleBack}
                                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }, props.backIconStyle]}
                                    />
                                }
                            </View>

                            {props.original !== undefined && props.original == true
                                ?
                                <ImageButton
                                    style={[{ width: '60%', justifyContent: 'center', margin: 0, padding: R.dimens.WidgetPadding }, props.titleStyle]}
                                    name={props.title}
                                    icon={props.titleIcon}
                                    onPress={props.onTitlePress}
                                    numberOfLines={1}
                                    textStyle={this.styles().customToolbarText}
                                    iconStyle={{ tintColor: R.colors.accent, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth }} />
                                :
                                <View style={{ width: '40%', justifyContent: 'center', margin: 0, padding: R.dimens.WidgetPadding }}></View>}

                            {/* Right Menu */}
                            <View style={[{ width: '40%', flexDirection: 'row-reverse' }, props.rightStyle]}>

                                {/* If there's right menu with text name and searchable icon then display text menu in three dots dialog */}
                                {
                                    needRightMenu && props.rightMenu != undefined && props.searchable &&
                                    <OptionsMenu
                                        ref='optionMenu'
                                        customButton={
                                            <ImageButton
                                                icon={R.images.VERTICAL_MENU}
                                                isHML
                                                style={{
                                                    margin: 0,
                                                    paddingTop: R.dimens.WidgetPadding,
                                                    paddingBottom: R.dimens.WidgetPadding,
                                                    paddingLeft: R.dimens.WidgetPadding,
                                                    paddingRight: R.dimens.WidgetPadding
                                                }}
                                                iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }, props.rightIconStyle]}
                                                onPress={() => this.refs.optionMenu.handlePress()} />}
                                        destructiveIndex={1}
                                        options={createOptions([props.rightMenu])}
                                        actions={createActions([props.onRightMenuPress])}
                                    />
                                }

                                {/* If there's right menu with icon and search icon then display both at a time */}
                                {
                                    needRightMenu && props.rightIcon != undefined && props.searchable &&
                                    <ImageButton
                                        name={props.rightMenu}
                                        icon={props.rightIcon}
                                        isHML
                                        style={{
                                            margin: 0, paddingTop: R.dimens.WidgetPadding,
                                            paddingBottom: R.dimens.WidgetPadding,
                                            paddingRight: R.dimens.WidgetPadding,
                                            paddingLeft: R.dimens.WidgetPadding
                                        }}
                                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }, props.rightIconStyle]}
                                        onPress={props.onRightMenuPress} />
                                }

                                {/* If there's only menu without search then directly display it. */}
                                {
                                    needRightMenu && !props.searchable &&
                                    <ImageButton
                                        name={props.rightMenu}
                                        icon={props.rightIcon}
                                        isHML
                                        textStyle={{ color: R.colors.textSecondary }}
                                        style={{ margin: 0, padding: R.dimens.WidgetPadding }}
                                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }, props.rightIconStyle]}
                                        onPress={props.onRightMenuPress} />
                                }

                                {props.rightMenuRenderChilds}

                                {/* If Searchable is enable then display search icon */}
                                {
                                    props.searchable &&
                                    <ImageButton
                                        icon={R.images.SEARCH_ICON}
                                        style={{
                                            margin: needRightMenu ? 0 : R.dimens.WidgetPadding,
                                            paddingTop: R.dimens.WidgetPadding,
                                            paddingBottom: R.dimens.WidgetPadding,
                                            paddingRight: needRightMenu ? R.dimens.WidgetPadding : 0,
                                            paddingLeft: needRightMenu ? R.dimens.WidgetPadding : 0
                                        }}
                                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }, props.rightIconStyle]}
                                        onPress={() => { props.onVisibleSearch !== undefined && props.onVisibleSearch(!this.state.visibleSearch); this.setState({ visibleSearch: !this.state.visibleSearch }) }} />
                                }
                            </View>
                        </View>

                    </View>
                }
                {(props.original === undefined || (props.original !== undefined && props.original == false)) && <ImageButton
                    style={{ justifyContent: 'flex-start', margin: 0, marginLeft: R.dimens.margin, marginBottom: R.dimens.widgetMargin }}
                    name={props.title}
                    icon={props.titleIcon}
                    onPress={props.onTitlePress}
                    numberOfLines={1}
                    isMR
                    textStyle={[this.styles().customToolbarText, props.textStyle]} />}
                {
                    (this.state.isShowPicker) &&
                    <View style={[this.styles().customToolbarMain]}>
                        <TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}></TextViewMR>
                        <Picker
                            ref='spPicker'
                            data={this.props.pickerData}
                            value={this.props.pickerValue}
                            onPickerSelect={(value) => this.props.onPickerSelect(value)}
                            displayArrow={'true'}
                            width={'50%'}
                            renderItemTextStyle={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}
                        />
                    </View>
                }
            </View>
        );
    }

    // for displaying search view
    SearchView = (props) => {

        return (
            <View style={[this.styles().customToolbarMain, props.style]}>

                {/* Search Icon */}
                <ImageButton
                    iconStyle={{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }}
                    style={{ margin: 0, padding: R.dimens.WidgetPadding }}
                    icon={R.images.SEARCH_ICON} />

                {/* Search Input */}
                <TextInput
                    ref={cmp => this.searchView = cmp}
                    numberOfLines={1}
                    placeholder={props.placeholder ? props.placeholder : R.strings.searchHere}
                    placeholderTextColor={R.colors.textSecondary}
                    underlineColorAndroid='transparent'
                    returnKeyType={'search'}
                    returnKeyLabel={'Search'}
                    autoFocus={false}
                    onChangeText={props.onChangeText}
                    style={this.styles().searchTextInput} />

                {/* Cancel Button */}
                {!props.isCancel ?
                    <ImageButton
                        textStyle={{ color: R.colors.textSecondary }}
                        name={R.strings.cancel}
                        isHML
                        onPress={props.onCancel} />
                    : null}
            </View>
        )
    }

    styles = () => {
        return {
            customToolbarMain: {
                height: R.dimens.ToolbarHeights,
                backgroundColor: R.colors.background,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            customToolbarText: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.largeText,
                fontFamily: Fonts.MontserratSemiBold
            },
            searchTextInput: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary,
                fontFamily: Fonts.MontserratSemiBold,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        preference: state.preference,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomToolbar);