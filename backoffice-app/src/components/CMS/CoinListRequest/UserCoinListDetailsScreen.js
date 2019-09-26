// UserCoinListDetailsScreen.js
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { validateValue } from '../../../validations/CommonValidation';
import RowItem from '../../../native_theme/components/RowItem';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';

export default class UserCoinListDetailsScreen extends Component {
    constructor(props) {
        super(props)

        // Define all initial state
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
            tabNames: [R.strings.coinInfo, R.strings.coinSpecification],
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    render() {
        let { item } = this.state
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.userCoinListRequest}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        style={{ flex: 1, flexDirection: 'column-reverse', }}
                        titles={this.state.tabNames}
                        numOfItems={2}
                        horizontalScroll={false}
                        isGradient={true}
                        style={{ marginLeft: R.dimens.margin, marginRight: R.dimens.margin, }}>

                        {/* first Tab */}
                        <View>
                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom, paddingTop: R.dimens.widgetMargin, }}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps={'always'}>

                                <RowItem title={R.strings.coinName} value={validateValue(item.coin_name)} />
                                <RowItem title={R.strings.coinTicker} value={validateValue(item.coin_ticker)} />
                                <RowItem title={R.strings.dateOfIssuance} value={validateValue(item.date_of_issuance)} />
                                <RowItem title={R.strings.coinLogo} value={validateValue(item.coin_logo)} />
                                <RowItem title={R.strings.coinWebsite} value={validateValue(item.coin_website)} />

                                {/* <RowItem title={R.strings.websiteFaq} value={validateValue(item.website_faq)} />
                                <RowItem title={R.strings.coinForum} value={validateValue(item.coin_forum)} />
                                <RowItem title={R.strings.bitcoinTalk} value={validateValue(item.bitcoin_talk)} />
                                <RowItem title={R.strings.whitepaperBusiness} value={validateValue(item.whitepaper_business)} />
                                <RowItem title={R.strings.whitepaperTechnical} value={validateValue(item.whitepaper_technical)} />
                                <RowItem title={R.strings.stackChannel} value={validateValue(item.stack_channel)} />
                                <RowItem title={R.strings.officialGitHuborRepositoryLink} value={validateValue(item.official_gitHub_repository_link)} />
                                <RowItem title={R.strings.teamContact} value={validateValue(item.team_contact)} />
                                <RowItem title={R.strings.teamBio} value={validateValue(item.team_bio)} />
                                <RowItem title={R.strings.headquarterAddress} value={validateValue(item.headquarter_address)} />
                                <RowItem title={R.strings.walletSourceCode} value={validateValue(item.wallet_source_code)} />
                                <RowItem title={R.strings.nodeSourceCode} value={validateValue(item.node_source_code)} />
                                <RowItem title={R.strings.officialBlockchainExplorerLink} value={validateValue(item.official_blockchain_explorer_link)} />
                                <RowItem title={R.strings.maxCoinSupply} value={validateValue(item.max_coin_supply)} />
                                <RowItem title={R.strings.txnFeeForTransaction} value={validateValue(item.tx_Fee_for_transaction)} />
                                <RowItem title={R.strings.socialMediaLinks} value={validateValue(item.social_media_links)} />
                                <RowItem title={R.strings.codeReviewAuditTrustedcommunity} value={validateValue(item.code_review_audit_trusted_community)} />
                                <RowItem title={R.strings.deploymentProcess} value={validateValue(item.deployment_process)} />
                                <RowItem title={R.strings.preminedCoinAmount} value={validateValue(item.premined_coin_amount)} />
                                <RowItem title={R.strings.preminedCoininEscrow} value={validateValue(item.premined_coin_in_escrow)} />
                                <RowItem title={R.strings.numberofAddressescoinswereDistributed} value={validateValue(item.number_of_addresses_coins_were_distributed)} />
                                <RowItem title={R.strings.segwitExhibition} value={validateValue(item.segwit_exhibition)} />
                                <RowItem title={R.strings.blockspeed} value={validateValue(item.blockspeed)} />
                                <RowItem title={R.strings.coreAlgorithm} value={validateValue(item.core_algorithm)} />
                                <RowItem title={R.strings.amountraisedduringPreIco} value={validateValue(item.amount_raised_during_pre_ico)} />
                                <RowItem title={R.strings.advisory} value={validateValue(item.advisory)} />
                                <RowItem title={R.strings.numberofblocksmined} value={validateValue(item.number_of_blocks_mined)} />
                                <RowItem title={R.strings.devLanguage} value={validateValue(item.dev_language)} />
                                <RowItem title={R.strings.ercCompliant} value={validateValue(item.erc_20_compliant)} />
                                <RowItem title={R.strings.difficulty} value={validateValue(item.difficulty)} />
                                <RowItem title={R.strings.wallet} value={validateValue(item.wallet)} />
                                <RowItem title={R.strings.usualCost} value={validateValue(item.usual_cost)} />
                                <RowItem title={R.strings.ifthiscoinisasecurity} value={validateValue(item.if_this_coin_is_a_security)} /> */}

                                <RowItem title={R.strings.coinType} value={validateValue(item.coin_type)} />
                                <RowItem title={R.strings.coinDescription} value={validateValue(item.coin_description)} />
                                <RowItem title={R.strings.coinShortName} value={validateValue(item.coin_short_name)} />
                                <RowItem title={R.strings.coinAddress} value={validateValue(item.coin_address)} />
                                <RowItem title={R.strings.decimal} value={validateValue(item.decimal)} />
                                <RowItem title={R.strings.totalSupply} value={validateValue(item.total_supply)} />
                                <RowItem title={R.strings.circulatingSupply} value={validateValue(item.circulating_supply)} />

                                <RowItem title={R.strings.firstName} value={validateValue(item.first_name)} />
                                <RowItem title={R.strings.lastName} value={validateValue(item.last_name)} />
                                <RowItem title={R.strings.address} value={validateValue(item.address)} />
                                <RowItem title={R.strings.addressLineTwo} value={validateValue(item.address_line_2)} />
                                <RowItem title={R.strings.city} value={validateValue(item.City)} />
                                <RowItem title={R.strings.state} value={validateValue(item.state)} />
                                <RowItem title={R.strings.postalCode} value={validateValue(item.postalCode)} />
                                <RowItem title={R.strings.country} value={validateValue(item.country)} />
                                <RowItem title={R.strings.phone} value={validateValue(item.phone)} />
                                <RowItem title={R.strings.email} value={validateValue(item.email)} />
                                <RowItem title={R.strings.projectName} value={validateValue(item.project_name)} />
                                <RowItem title={R.strings.projectWebsiteLink} value={validateValue(item.project_website_link)} />
                                <RowItem title={R.strings.doyouhaveanactivecommunity} value={validateValue(item.do_you_have_an_active_community)} />
                                <RowItem title={R.strings.informationonhowfundswereraised} value={validateValue(item.information_on_how_funds_were_raised)} />
                                <RowItem title={R.strings.currentListingOnOtherExchanges} value={validateValue(item.current_listing_on_other_exchanges)} />

                            </ScrollView>
                        </View>

                        {/* Second Tab */}
                        <View>
                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.widgetMargin, paddingTop: R.dimens.widgetMargin, }}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps={'always'}>

                                {/* <RowItem title={R.strings.coinName} value={validateValue(item.coin_name)} />
                                <RowItem title={R.strings.coinTicker} value={validateValue(item.coin_ticker)} />
                                <RowItem title={R.strings.dateOfIssuance} value={validateValue(item.date_of_issuance)} />
                                <RowItem title={R.strings.coinLogo} value={validateValue(item.coin_logo)} />
                                <RowItem title={R.strings.coinWebsite} value={validateValue(item.coin_website)} /> */}

                                <RowItem title={R.strings.websiteFaq} value={validateValue(item.website_faq)} />
                                <RowItem title={R.strings.coinForum} value={validateValue(item.coin_forum)} />
                                <RowItem title={R.strings.bitcoinTalk} value={validateValue(item.bitcoin_talk)} />
                                <RowItem title={R.strings.whitepaperBusiness} value={validateValue(item.whitepaper_business)} />
                                <RowItem title={R.strings.whitepaperTechnical} value={validateValue(item.whitepaper_technical)} />
                                <RowItem title={R.strings.stackChannel} value={validateValue(item.stack_channel)} />
                                <RowItem title={R.strings.officialGitHuborRepositoryLink} value={validateValue(item.official_gitHub_repository_link)} />
                                <RowItem title={R.strings.teamContact} value={validateValue(item.team_contact)} />
                                <RowItem title={R.strings.teamBio} value={validateValue(item.team_bio)} />
                                <RowItem title={R.strings.headquarterAddress} value={validateValue(item.headquarter_address)} />
                                <RowItem title={R.strings.walletSourceCode} value={validateValue(item.wallet_source_code)} />
                                <RowItem title={R.strings.nodeSourceCode} value={validateValue(item.node_source_code)} />
                                <RowItem title={R.strings.officialBlockchainExplorerLink} value={validateValue(item.official_blockchain_explorer_link)} />
                                <RowItem title={R.strings.maxCoinSupply} value={validateValue(item.max_coin_supply)} />
                                <RowItem title={R.strings.txnFeeForTransaction} value={validateValue(item.tx_Fee_for_transaction)} />
                                <RowItem title={R.strings.socialMediaLinks} value={validateValue(item.social_media_links)} />
                                <RowItem title={R.strings.codeReviewAuditTrustedcommunity} value={validateValue(item.code_review_audit_trusted_community)} />
                                <RowItem title={R.strings.deploymentProcess} value={validateValue(item.deployment_process)} />
                                <RowItem title={R.strings.preminedCoinAmount} value={validateValue(item.premined_coin_amount)} />
                                <RowItem title={R.strings.preminedCoininEscrow} value={validateValue(item.premined_coin_in_escrow)} />
                                <RowItem title={R.strings.numberofAddressescoinswereDistributed} value={validateValue(item.number_of_addresses_coins_were_distributed)} />{/* newLine */}
                                <RowItem title={R.strings.segwitExhibition} value={validateValue(item.segwit_exhibition)} />
                                <RowItem title={R.strings.blockspeed} value={validateValue(item.blockspeed)} />
                                <RowItem title={R.strings.coreAlgorithm} value={validateValue(item.core_algorithm)} />
                                <RowItem title={R.strings.amountraisedduringPreIco} value={validateValue(item.amount_raised_during_pre_ico)} />
                                <RowItem title={R.strings.advisory} value={validateValue(item.advisory)} />
                                <RowItem title={R.strings.numberofblocksmined} value={validateValue(item.number_of_blocks_mined)} />
                                <RowItem title={R.strings.devLanguage} value={validateValue(item.dev_language)} />
                                <RowItem title={R.strings.ercCompliant} value={validateValue(item.erc_20_compliant)} />
                                <RowItem title={R.strings.difficulty} value={validateValue(item.difficulty)} />
                                <RowItem title={R.strings.wallet} value={validateValue(item.wallet)} />
                                <RowItem title={R.strings.usualCost} value={validateValue(item.usual_cost)} />
                                <RowItem title={R.strings.ifthiscoinisasecurity} value={validateValue(item.if_this_coin_is_a_security)} />

                                {/* <RowItem title={R.strings.coinType} value={validateValue(item.coin_type)} />
                                <RowItem title={R.strings.coinDescription} value={validateValue(item.coin_description)} />
                                <RowItem title={R.strings.coinShortName} value={validateValue(item.coin_short_name)} />
                                <RowItem title={R.strings.coinAddress} value={validateValue(item.coin_address)} />
                                <RowItem title={R.strings.decimal} value={validateValue(item.decimal)} />
                                <RowItem title={R.strings.totalSupply} value={validateValue(item.total_supply)} />
                                <RowItem title={R.strings.circulatingSupply} value={validateValue(item.circulating_supply)} />

                                <RowItem title={R.strings.firstName} value={validateValue(item.first_name)} />
                                <RowItem title={R.strings.lastName} value={validateValue(item.last_name)} />
                                <RowItem title={R.strings.address} value={validateValue(item.address)} />
                                <RowItem title={R.strings.addressLineTwo} value={validateValue(item.address_line_2)} />
                                <RowItem title={R.strings.city} value={validateValue(item.City)} />
                                <RowItem title={R.strings.state} value={validateValue(item.state)} />
                                <RowItem title={R.strings.postalCode} value={validateValue(item.postalCode)} />
                                <RowItem title={R.strings.country} value={validateValue(item.country)} />
                                <RowItem title={R.strings.phone} value={validateValue(item.phone)} />
                                <RowItem title={R.strings.email} value={validateValue(item.email)} />
                                <RowItem title={R.strings.projectName} value={validateValue(item.project_name)} />
                                <RowItem title={R.strings.projectWebsiteLink} value={validateValue(item.project_website_link)} />
                                <RowItem title={R.strings.doyouhaveanactivecommunity} value={validateValue(item.do_you_have_an_active_community)} />
                                <RowItem title={R.strings.informationonhowfundswereraised} value={validateValue(item.information_on_how_funds_were_raised)} />
                                <RowItem title={R.strings.currentListingOnOtherExchanges} value={validateValue(item.current_listing_on_other_exchanges)} /> */}

                            </ScrollView>
                        </View>


                    </IndicatorViewPager>

                </View>
            </SafeView>
        )
    }
}

