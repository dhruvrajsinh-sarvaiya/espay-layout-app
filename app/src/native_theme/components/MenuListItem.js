import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableWithoutFeedback, Image } from 'react-native';
import { isEmpty } from '../../validations/CommonValidation';
import R from '../R';
import Separator from './Separator';
import TextViewHML from './TextViewHML';
import ImageViewWidget from '../../components/Widget/ImageViewWidget';
import AnimatableItem from './AnimatableItem';

class MenuListItem extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            if (this.props.title !== nextProps.title ||
                this.props.status !== nextProps.status ||
                this.props.separator !== nextProps.separator) {
                return true;
            } else {
                return false;
            }
        }
    }

    render() {

        // Get required field from props
        let props = this.props;

        padding = props.icon ? 0 : R.dimens.widget_left_right_margin;

        // ignore following strings from menu
        const ignoreStrings = [R.strings.Select_Wallet, R.strings.selectToken, R.strings.Select_Coin, R.strings.Please_Select, R.strings.selectCurrency]

        return (
            <AnimatableItem>
                <TouchableWithoutFeedback onPress={props.onPress}>
                    <View style={[{
                        backgroundColor: R.colors.background,
                        padding: R.dimens.widgetMargin,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }, props.style]}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: padding, paddingRight: padding }}>
                            {props.icon &&
                                <Image
                                    source={props.icon}
                                    style={{
                                        margin: R.dimens.widgetMargin,
                                        tintColor: R.colors.textPrimary,
                                        height: R.dimens.SMALL_MENU_ICON_SIZE,
                                        width: R.dimens.SMALL_MENU_ICON_SIZE
                                    }}
                                />
                            }
                            {
                                // if withIcon is true and provided title is not available in ignoreStrings than fetch image from internet
                                props.withIcon && !ignoreStrings.includes(props.title ? props.title : '') &&
                                <ImageViewWidget
                                    url={props.title ? props.title : null}
                                    style={{ marginRight: R.dimens.margin }}
                                    width={R.dimens.SMALL_MENU_ICON_SIZE}
                                    height={R.dimens.SMALL_MENU_ICON_SIZE} />
                            }
                            <TextViewHML style={[{
                                flex: 1,
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.smallText
                            }, props.titleStyle]}> {props.title} </TextViewHML>
                        </View>

                        <View style={{ alignContent: 'flex-end', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {props.status !== undefined &&
                                <TextViewHML style={[{
                                    marginLeft: R.dimens.widgetMargin,
                                    color: R.colors.textSecondary,
                                    fontSize: R.dimens.smallText,
                                    textAlign: 'center',
                                }, props.statusStyle]}> {isEmpty(props.status) ? '' : props.status} </TextViewHML>
                            }
                            {props.isSelected !== undefined &&
                                <Image source={props.rightIcon} style={{
                                    marginRight: R.dimens.widgetMargin,
                                    marginTop: R.dimens.widgetMargin,
                                    marginBottom: R.dimens.widgetMargin,
                                    tintColor: props.isSelected ? R.colors.textPrimary : R.colors.background,
                                    height: R.dimens.SMALL_MENU_ICON_SIZE,
                                    width: R.dimens.SMALL_MENU_ICON_SIZE
                                }} />
                            }
                            {props.isSelected === undefined &&
                                <Image source={R.images.IC_RIGHT_ARROW} style={{
                                    marginRight: R.dimens.widgetMargin,
                                    marginTop: R.dimens.widgetMargin,
                                    marginBottom: R.dimens.widgetMargin,
                                    tintColor: R.colors.textPrimary,
                                    height: R.dimens.SMALL_MENU_ICON_SIZE,
                                    width: R.dimens.SMALL_MENU_ICON_SIZE
                                }} />
                            }

                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {this.props.separator !== undefined && this.props.separator && <Separator />}
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        preference: state.preference,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuListItem);
