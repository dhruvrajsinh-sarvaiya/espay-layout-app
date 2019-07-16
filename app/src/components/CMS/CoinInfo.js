import React, { Component } from 'react';
import { View, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { changeTheme, convertDate } from '../../controllers/CommonUtils';
import CardView from '../../native_theme/components/CardView';
import R from '../../native_theme/R';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';

export default class CoinInfo extends Component {
    constructor(props) {
        super(props);

        //get values from previous screen
        const { params } = this.props.navigation.state;

        //Define All State initial state
        this.state = {
            id: params.DATA.ServiceId ? params.DATA.ServiceId : '-',
            image: params.DATA.ImageUrl ? params.DATA.ImageUrl : '-',
            currency: params.DATA.SMSCode ? params.DATA.SMSCode : '-',
            currencyName: params.DATA.Name ? params.DATA.Name : '-',
            price: params.DATA.price ? params.DATA.price : '-',
            change_24h: params.DATA.change_24h ? params.DATA.change_24h : '-',
            CirculatingSupply: params.DATA.CirculatingSupply ? params.DATA.CirculatingSupply : '-',
            IssuePrice: params.DATA.IssuePrice ? params.DATA.IssuePrice : '-',
            IssueDate: params.DATA.IssueDate ? convertDate(params.DATA.IssueDate) : '-',
            maxSupply: params.DATA.MaxSupply ? params.DATA.MaxSupply : '-',
            ConsensusProtocol: params.DATA.ProofType ? params.DATA.ProofType : '-',
            //Explorer: params.DATA.Explorer, ask front team
            TotalSupply: params.DATA.TotalSupply ? params.DATA.TotalSupply : '-',
            CryptographicAlgorithm: params.DATA.EncryptionAlgorithm ? params.DATA.EncryptionAlgorithm : '-',
            WhitePaper: params.DATA.WhitePaperPath ? params.DATA.WhitePaperPath : '-',
            Website: params.DATA.WebsiteUrl ? params.DATA.WebsiteUrl : '-',
            Type: params.DATA.Type == 1 && R.strings.Coin,
            coinHistory: params.DATA.Introduction ? params.DATA.Introduction : '-',
            sourceCode: '-',
        }

        //bind method
        this.onWebLinkPress = this.onWebLinkPress.bind(this);
        //----
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //for open url in browser
    onWebLinkPress(url) {
        try {
            //check url is available or not
            if (url)
                Linking.openURL(url);
        } catch (error) { }
    }

    render() {
        return (
            <SafeView isDetail={true} style={this.styles().container} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.currency + ' (' + this.state.currencyName + ')'}
                    isBack={true}
                    nav={this.props.navigation} />

                <View style={{ flex: 1 }}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ margin: R.dimens.WidgetPadding, }} >
                            {/* display all coin info */}
                            <View style={{ flexDirection: 'row' }}>
                                <CardView style={{ flex: 1, margin: R.dimens.widgetMargin, marginRight: R.dimens.widget_left_right_margin, padding: R.dimens.widgetMargin }}>
                                    <View style={this.styles().viewStyle}>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.issue_date}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.IssueDate}</TextViewHML>
                                    </View>
                                    <View style={this.styles().viewStyle}>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.alogrithm}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.CryptographicAlgorithm}</TextViewHML>
                                    </View>
                                </CardView>
                                <CardView style={{ flex: 1, margin: R.dimens.widgetMargin, marginLeft: R.dimens.widget_left_right_margin, padding: R.dimens.widgetMargin }}>
                                    <View style={this.styles().viewStyle}>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.issue_price}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.IssuePrice}</TextViewHML>
                                    </View>
                                    <View style={this.styles().viewStyle}>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.proof_type}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.ConsensusProtocol}</TextViewHML>
                                    </View>
                                </CardView>
                            </View>
                            <CardView style={{ flex: 1, margin: R.dimens.widgetMargin, marginTop: R.dimens.widget_top_bottom_margin, padding: R.dimens.widgetMargin }}>
                                <View style={[this.styles().viewStyle, { justifyContent: 'space-between' }]}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.total_supply}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.TotalSupply}</TextViewHML>
                                </View>
                            </CardView>
                            <CardView style={{ flex: 1, margin: R.dimens.widgetMargin, padding: R.dimens.widgetMargin }}>
                                <View style={[this.styles().viewStyle, { justifyContent: 'space-between' }]}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.max_supply}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.maxSupply}</TextViewHML>
                                </View>
                            </CardView>
                            <CardView style={{ flex: 1, margin: R.dimens.widgetMargin, padding: R.dimens.widgetMargin }}>
                                <View style={[this.styles().viewStyle, { justifyContent: 'space-between' }]}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.circulating_supply}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.CirculatingSupply}</TextViewHML>
                                </View>
                            </CardView>
                            <CardView style={{ flex: 1, margin: R.dimens.widgetMargin, padding: R.dimens.widgetMargin }}>
                                <View style={[this.styles().viewStyle, { justifyContent: 'space-between' }]}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.source_code}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.sourceCode}</TextViewHML>
                                </View>
                            </CardView>
                            <CardView style={{ flex: 1, margin: R.dimens.widgetMargin, padding: R.dimens.widgetMargin }}>
                                <View style={[this.styles().viewStyle, { justifyContent: 'space-between' }]}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.website}</TextViewHML>
                                    <TouchableOpacity onPress={() => this.onWebLinkPress(this.state.Website)}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'right' }}>{this.state.Website}</TextViewHML>
                                    </TouchableOpacity>
                                </View>
                            </CardView>
                            <CardView style={{ margin: R.dimens.widgetMargin, padding: R.dimens.widgetMargin }}>
                                <View style={{ flex: 1, margin: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.introduction}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'justify', }}>{this.state.coinHistory}</TextViewHML>
                                </View>
                            </CardView>
                        </View>
                    </ScrollView>
                </View>
            </SafeView>
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            containerView: {
                flex: 1,
                margin: R.dimens.WidgetPadding, backgroundColor: R.colors.background
            },
            viewStyle: {
                flexDirection: 'row', margin: R.dimens.widgetMargin,
            },
        }
    }
}
