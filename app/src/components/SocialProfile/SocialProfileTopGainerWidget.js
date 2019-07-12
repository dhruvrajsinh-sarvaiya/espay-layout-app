import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native'
import R from '../../native_theme/R';
import Separator from '../../native_theme/components/Separator';
import { getSocialProfileTopGainerList } from '../../actions/SocialProfile/SocialProfileActions';
import { connect } from 'react-redux';
import { changeTheme, getCurrentDate, parseArray, } from '../../controllers/CommonUtils';
import { validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import ListLoader from '../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

export class SocialProfileTopGainerWidget extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            isGainer: props.isGainer,
            isFirstTime: true,
            TopGainerResponse: [],
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        /* stop twice api call  */
        return isCurrentScreen(nextProps)
    }

    componentDidMount = async () => {
        // Change theme as per night and light mode
        changeTheme()
        // check internet connection
        if (await isInternet()) {

            let reqTopGainer = { curDate: getCurrentDate(), limit: 5 }
            // Call Top Gainer List Api
            this.props.getTopGainerList(reqTopGainer)
        }
    }

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { topGainerList } = props.SocailProfileDashboardResult;

            // topGainerList is not null
            if (topGainerList) {
                try {
                    if (state.topGainerList == null || (state.topGainerList != null && topGainerList !== state.topGainerList)) {
                        // Handle response
                        if (validateResponseNew({ response: topGainerList, isList: true })) {
                            return Object.assign({}, state, {
                                TopGainerResponse: parseArray(topGainerList.Response),
                                topGainerList,
                            })
                        } else
                            return Object.assign({}, state, { TopGainerResponse: [], topGainerList: null })
                    }
                } catch (error) {
                    return Object.assign({}, state, { TopGainerResponse: [], topGainerList: null })
                    //logger('Error into Social Profile Dashboard', error.message)
                }
            }
        }
        return null
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { topGainerLoading, } = this.props.SocailProfileDashboardResult
        let finalList = this.state.TopGainerResponse

        return (
            <SafeView style={{ flex: 1 }}>
                {
                    (topGainerLoading) ?
                        <ListLoader style={{ marginTop: R.dimens.margin }} />
                        :
                        <FlatList
                            data={finalList}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin }} />}
                            /* render all item in list */
                            renderItem={({ item }) =>
                                <TopGainerList gainerItem={item} />}
                            /* assign index as key valye to  list item */
                            contentContainerStyle={contentContainerStyle(finalList)}
                            keyExtractor={(_item, index) => index.toString()}
                            ListEmptyComponent={<ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                        />
                }
            </SafeView>
        )
    }
}

export class TopGainerList extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.gainerItem === nextProps.gainerItem)
            return false
        return true
    }

    render() {
        let gainerItem = this.props.gainerItem
        let color, icon;
        // change color and image 
        if (gainerItem.ProfitPer > 0) {
            color = R.colors.successGreen
            icon = R.images.IC_CURVE_UP_ARROW
        }
        else if (gainerItem.ProfitPer < 0) {
            icon = R.images.IC_CURVE_DOWN_ARROW
            color = R.colors.failRed
        } else {
            color = R.colors.textSecondary
            icon = R.images.IC_CURVE_UP_ARROW
        }

        return (
            <AnimatableItem>
                <View style={{ marginTop: R.dimens.widgetMargin }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{gainerItem.LeaderName}</Text>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{gainerItem.Email}</TextViewHML>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageTextButton
                                    icon={icon}
                                    iconStyle={{ width: R.dimens.normalizePixels(14), height: R.dimens.normalizePixels(14), tintColor: color }}
                                    style={{ margin: 0 }} />
                                <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: color, fontSize: R.dimens.smallText }}>{gainerItem.ProfitPer} %</TextViewHML>
                                <TextViewHML style={{ textAlignVertical: 'bottom', color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}> {R.strings.profitLossSmall}</TextViewHML>
                            </View>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>${gainerItem.Profit}</TextViewHML>
                        </View>
                    </View>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        //Updated Data For Social Profile Top Gainer list Action
        SocailProfileDashboardResult: state.SocialProfileReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // To get Top Gainer List
    getTopGainerList: (payload) => dispatch(getSocialProfileTopGainerList(payload)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SocialProfileTopGainerWidget);