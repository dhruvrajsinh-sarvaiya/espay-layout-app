import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { getMembershipLevel } from '../../actions/account/MembershipLevelAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, windowPercentage, addListener } from '../../controllers/CommonUtils';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { isInternet, validateResponseNew, isEmpty, validateValue } from '../../validations/CommonValidation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import { Fonts, Events } from '../../controllers/Constants';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import ListLoader from '../../native_theme/components/ListLoader';
import SafeView from '../../native_theme/components/SafeView';

class MembershipLevels extends Component {
    constructor(props) {
        super(props);

        let { width, height } = Dimensions.get('window');
        let contentPercentage = width * 65 / 100;

        //Define All State initial state
        this.state = {
            activeSlide: 0,
            response: [],
            isShowDialog: false,
            isFirstTime: true,
            isPortrait: width < height,
            itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Get MembershipLevel API
            this.props.getMembershipLevel();
        }

        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, ({ width, height }) => {
            let contentPercentage = width * 65 / 100;
            this.setState({
                isPortrait: width < height,
                itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
            })
        });
    }

    componentWillUnmount() {
        if (this.dimensionListener) {

            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return isCurrentScreen(nextProps);
    };

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
            const { MembershipLevelData, MembershipLevelFetchData } = props;

            if (!MembershipLevelFetchData) {
                try {
                    if (validateResponseNew({ response: MembershipLevelData, isList: true })) {
                        return {
                            ...state,
                            response: parseArray(MembershipLevelData.ProfileList),
                            refreshing: false
                        };
                    } else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false
                        };
                    }
                } catch (error) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false
                    };
                }
            }
        }
        return null
    };

    render() {

        const { activeSlide } = this.state;

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { Loading } = this.props.MembershipLevelResult;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Membershiplevel}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Display Data in CardView */}
                <View style={{ flex: 1, flexDirection: 'column' }}>

                    {/* To Check Response fetch or not if Loading = true then display progress bar else display Meembershipleveldata*/}
                    {Loading && <ListLoader />}

                    {this.state.response.length > 0 ?
                        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1, }} >
                            {/* for slider */}
                            <Carousel
                                extraData={this.state}
                                ref={c => this._slider1Ref = c}
                                data={this.state.response}
                                renderItem={({ item }) => {
                                    if (item) {
                                        return <FlatListItem
                                            item={item}
                                            isPortrait={this.state.isPortrait}
                                        />
                                    }
                                    else return null
                                }}
                                sliderWidth={Dimensions.get('window').width}
                                itemWidth={this.state.itemWidth}
                                hasParallaxImages={true}
                                firstItem={0}
                                inactiveSlideScale={0.94}
                                inactiveSlideOpacity={0.7}
                                inactiveSlideShift={20}
                                loop={false}
                                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                            />
                            {/* for pagination */}
                            <Pagination
                                dotsLength={this.state.response.length}
                                activeDotIndex={activeSlide}
                                dotColor={R.colors.accent}
                                inactiveDotColor={R.colors.textSecondary}
                                inactiveDotOpacity={R.dimens.Carousel.pagination.inactiveDotOpacity}
                                inactiveDotScale={R.dimens.Carousel.pagination.inactiveDotScale}
                            />
                        </View>
                        :
                        !Loading && <ListEmptyComponent />
                    }
                </View>
            </SafeView>
        );
    }
}

// This Class is used for display record in CARD
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item
            || this.props.isPortrait != nextProps.isPortrait) {
            return true;
        }
        return false;
    }

    render() {
        let levelColor
        //To Display various Status Color 
        if (this.props.item.Type === 'Basic')
            levelColor = R.colors.yellow
        else if (this.props.item.Type === 'Standard')
            levelColor = R.colors.buyerGreen
        else if (this.props.item.Type === 'Premium')
            levelColor = R.colors.accent
        else
            levelColor = R.colors.failRed
        return (
            <CardView style={this.mystyle().container}>

                {/*if isPortrait is true than display data in column wise else row wise */}
                {this.props.isPortrait
                    ?
                    <View style={{ flex: 1 }}>

                        {/* planname */}
                        <View style={{ height: '10%', justifyContent: 'center', alignItems: 'center' }}>
                            <TextViewMR style={[this.mystyle().card_tag_value]}>{validateValue(this.props.item.LevelName)}</TextViewMR>
                        </View>

                        {/* price */}
                        <View style={{ height: '40%', padding: R.dimens.WidgetPadding, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ paddingTop: R.dimens.margin_top_bottom, fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.membershipNormal, color: R.colors.textPrimary }}>{/* this.props.item.currency */}$</Text>
                                <Text style={{ fontSize: R.dimens.membershipMedium, color: R.colors.textPrimary }}>{validateValue(this.props.item.SubscriptionAmount)}</Text>
                                <Text style={{
                                    paddingBottom: R.dimens.margin_top_bottom,
                                    fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.membershipNormal, color: R.colors.textPrimary,
                                    alignSelf: 'flex-end'
                                }}>/{R.strings.Year.toLowerCase()}</Text>
                            </View>
                        </View>

                        {/* Level */}
                        <View style={{ height: '20%', flexDirection: 'row', justifyContent: 'center' }}>
                            <View>
                                <ImageButton
                                    name={this.props.item.Type ? this.props.item.Type : '-'}
                                    textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }}
                                    style={[this.mystyle().buttonStyle, { backgroundColor: levelColor }]} />
                            </View>
                        </View>

                        <View style={{ height: '30%', justifyContent: 'flex-end', alignSelf: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end' }}>

                            {/* Depositfee */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.Depositfee}</TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{validateValue(this.props.item.DepositFee)}</TextViewHML>
                            </View>

                            {/* Withdrawelfee */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.Withdrawelfee}</TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{validateValue(this.props.item.Withdrawalfee)}</TextViewHML>
                            </View>

                            {/* Tradingfee */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.Tradingfee} </TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{validateValue(this.props.item.Tradingfee)}</TextViewHML>
                            </View>

                            {/* WithdrawelLimit */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.WithdrawelLimit} </TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{!isEmpty(this.props.item.WithdrawalLimit) ? this.props.item.WithdrawalLimit : '-'}</TextViewHML>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            {/* planname */}
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewMR style={[this.mystyle().card_tag_value]}>{validateValue(this.props.item.LevelName)}</TextViewMR>
                            </View>

                            {/* price */}
                            <View style={{ padding: R.dimens.WidgetPadding, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ paddingTop: R.dimens.margin_top_bottom, fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.membershipNormal, color: R.colors.textPrimary }}>{/* this.props.item.currency */}$</Text>
                                    <Text style={{ fontSize: R.dimens.EditTextHeights, color: R.colors.textPrimary }}>{validateValue(this.props.item.SubscriptionAmount)}</Text>
                                    <Text style={{
                                        paddingBottom: R.dimens.margin_top_bottom,
                                        fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.membershipNormal, color: R.colors.textPrimary,
                                        alignSelf: 'flex-end'
                                    }}>/{R.strings.Year.toLowerCase()}</Text>
                                </View>
                            </View>

                            {/* Level */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View>
                                    <ImageButton
                                        name={this.props.item.Type ? this.props.item.Type : '-'}
                                        textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }}
                                        style={[this.mystyle().buttonStyle, { backgroundColor: levelColor }]} />
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.margin }}>

                            {/* Depositfee */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.Depositfee}</TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{validateValue(this.props.item.DepositFee)}</TextViewHML>
                            </View>

                            {/* Withdrawelfee */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.Withdrawelfee}</TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{validateValue(this.props.item.Withdrawalfee)}</TextViewHML>
                            </View>

                            {/* Tradingfee */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.Tradingfee} </TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{validateValue(this.props.item.Tradingfee)}</TextViewHML>
                            </View>

                            {/* WithdrawelLimit */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextViewHML style={this.mystyle().card_tag_margin}>{R.strings.WithdrawelLimit} </TextViewHML>
                                <TextViewHML style={this.mystyle().card_tag_margindata}>{!isEmpty(this.props.item.WithdrawalLimit) ? this.props.item.WithdrawalLimit : '-'}</TextViewHML>
                            </View>
                        </View>
                    </View>
                }
            </CardView>
        )
    };
    mystyle = () => {
        return {
            container: {
                flex: 1,
                padding: R.dimens.margin,
                margin: R.dimens.CardViewElivation,
                paddingBottom: R.dimens.WidgetPadding,
            },
            card_tag_value: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
            },
            card_tag_margin: {
                width: '75%',
                fontSize: R.dimens.listItemText,
                color: R.colors.textPrimary
            },
            card_tag_margindata: {
                width: '25%',
                fontSize: R.dimens.listItemText,
                color: R.colors.textPrimary,
                textAlign: 'right'
            },
            buttonStyle: {
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        //Updates Data For MembershipLevel Action
        MembershipLevelResult: state.MembershipLevelReducer,
        MembershipLevelFetchData: state.MembershipLevelReducer.MembershipLevelFetchData,
        MembershipLevelData: state.MembershipLevelReducer.MembershipLevelData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform get membershiplevel Action
        getMembershipLevel: () => dispatch(getMembershipLevel()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MembershipLevels)