var validateInput = require('../helper/apiHelper');
const Validator = require('validator');

exports.validateCoinListFieldsInput = function (data) {
    let errors = {};
    if (typeof data == 'undefined') {
        errors.message = 'common.api.invalidrequest';
    }
    else {
        data.forEach((info, index) => {
            if (Validator.isEmpty(info.fieldname + '')) {
                errors.fieldname = 'coinListField.error.fieldname';
            }
            if (typeof info.status == 'undefined') {
                errors.status = 'coinListField.error.status';
            } else if (!Validator.isInt(info.status + '', { min: 0, max: 1 })) {
                errors.status = 'coinListField.error.statusNum';
            }
        });
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? true : false
    };
};


exports.validateCoinListRequestFormInput = function (requestdata, coinListFields) {
    let errors = {};
    if (typeof requestdata.coinListdata == 'undefined' || typeof requestdata.coinListdata.coinFields == 'undefined') {
        errors.message = 'common.api.invalidrequest';
    }
    else if (typeof coinListFields == 'undefined') {
        errors.message = 'coinListRequestForm.error.common';
    }
    else if (typeof requestdata.coinListdata.userId == 'undefined' || requestdata.coinListdata.userId == "" || requestdata.coinListdata.userId.length == 0 || Validator.isEmpty(requestdata.coinListdata.userId + '')) {
        errors.message = 'surveys.surveyform.error.userIdReq';
    }
    else {
        let data = requestdata.coinListdata.coinFields;
        // 1)CoinName 
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_name")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_name"))].status == 1) {

            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_name"))].Isrequired == 1 && (!data.coin_name || typeof data.coin_name == 'undefined' || data.coin_name == "" || data.coin_name.length == 0 || Validator.isEmpty(data.coin_name.trim() + ''))) {
                errors.coin_name = 'coinListRequestForm.error.CoinName';
            }

            if (typeof data.coin_name != 'undefined' && data.coin_name != "" && data.coin_name.length > 0 && validateInput.isHtmlTag(data.coin_name)) {
                errors.coin_name = 'my_account.err.scriptTag';
            } else if (typeof data.coin_name != 'undefined' && data.coin_name != "" && data.coin_name.length > 0 && !Validator.isLength(data.coin_name + '', { min: 2, max: 100 })) {
                errors.coin_name = 'coinListRequestForm.error.CoinNameLimit';
            }
        }

        //2)CoinTicker
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_ticker")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_ticker"))].status == 1) {

            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_ticker"))].Isrequired == 1 && (!data.coin_ticker || typeof data.coin_ticker == 'undefined' || data.coin_ticker == "" || data.coin_ticker.length == 0 || Validator.isEmpty(data.coin_ticker.trim() + ''))) {
                errors.coin_ticker = 'coinListRequestForm.error.CoinTicker';
            }

            if (validateInput.isHtmlTag(data.coin_ticker)) {
                errors.coin_ticker = 'my_account.err.scriptTag';
            }
        }

        //3)Date Of Issuance
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "date_of_issuance")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "date_of_issuance"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "date_of_issuance"))].Isrequired == 1 && (!data.date_of_issuance || typeof data.date_of_issuance == 'undefined' || data.date_of_issuance == "" || data.date_of_issuance.length == 0 || Validator.isEmpty(data.date_of_issuance.trim() + ''))) {
                errors.date_of_issuance = 'coinListRequestForm.error.DateOfIssuance';
            }

            if (validateInput.isHtmlTag(data.date_of_issuance)) {
                errors.date_of_issuance = 'my_account.err.scriptTag';
            }
        }

        //4)coin logo
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_logo")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_logo"))].status == 1) {

            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_logo"))].Isrequired == 1 && (!data.coin_logo || typeof data.coin_logo == 'undefined' || data.coin_logo == "" || data.coin_logo.length == 0 || Validator.isEmpty(data.coin_logo.trim() + ''))) {
                errors.coin_logo = 'coinListRequestForm.error.coinLogo';
            }


            if (validateInput.isHtmlTag(data.coin_logo)) {
                errors.coin_logo = 'my_account.err.scriptTag';
            } else if (typeof data.coin_logo != 'undefined' && data.coin_logo != "" && data.coin_logo.length > 0 && !Validator.isURL(data.coin_logo + "", ['http', 'https'])) {
                errors.coin_logo = 'coinListRequestForm.error.validUrl';
            }
        }

        //5)coin_website
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_website")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_website"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_website"))].Isrequired == 1 && (!data.coin_website || typeof data.coin_website == 'undefined' || data.coin_website == "" || data.coin_website.length == 0 || Validator.isEmpty(data.coin_website.trim() + ''))) {
                errors.coin_website = 'coinListRequestForm.error.coinWebsite';
            }
            if (validateInput.isHtmlTag(data.coin_website)) {
                errors.coin_website = 'my_account.err.scriptTag';
            } else if (typeof data.coin_website != 'undefined' && data.coin_website != "" && data.coin_website.length > 0 && Validator.isEmpty(data.coin_website.trim() + '') && !Validator.isURL(data.coin_website + "", ['http', 'https'])) {
                errors.coin_website = 'coinListRequestForm.error.validUrl';
            }
        }

        //6)website faq
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "website_faq")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "website_faq"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "website_faq"))].Isrequired == 1 && (!data.website_faq || typeof data.website_faq == 'undefined' || data.website_faq == "" || data.website_faq.length == 0 || Validator.isEmpty(data.website_faq.trim() + ''))) {
                errors.website_faq = 'coinListRequestForm.error.websiteFaq';
            }

            if (validateInput.isHtmlTag(data.website_faq)) {
                errors.website_faq = 'my_account.err.scriptTag';
            }
        }

        //7)Coin forum
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_forum")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_forum"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_forum"))].Isrequired == 1 && (!data.coin_forum || typeof data.coin_forum == 'undefined' || data.coin_forum == "" || data.coin_forum.length == 0 || Validator.isEmpty(data.coin_forum.trim() + ''))) {
                errors.coin_forum = 'coinListRequestForm.error.coin_forum';
            }

            if (validateInput.isHtmlTag(data.coin_forum)) {
                errors.coin_forum = 'my_account.err.scriptTag';
            }
        }

        //8)bitcoin_talk
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "bitcoin_talk")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "bitcoin_talk"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "bitcoin_talk"))].Isrequired == 1 && (!data.bitcoin_talk || typeof data.bitcoin_talk == 'undefined' || data.bitcoin_talk == "" || data.bitcoin_talk.length == 0 || Validator.isEmpty(data.bitcoin_talk.trim() + ''))) {
                errors.bitcoin_talk = 'coinListRequestForm.error.bitcoin_talk';
            }

            if (validateInput.isHtmlTag(data.bitcoin_talk)) {
                errors.bitcoin_talk = 'my_account.err.scriptTag';
            }
        }

        //9)Whitepaper business
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_business")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_business"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_business"))].Isrequired == 1 && (!data.whitepaper_business || typeof data.whitepaper_business == 'undefined' || data.whitepaper_business == "" || data.whitepaper_business.length == 0 || Validator.isEmpty(data.whitepaper_business.trim() + ''))) {
                errors.whitepaper_business = 'coinListRequestForm.error.whitepaper_business';
            }

            if (validateInput.isHtmlTag(data.whitepaper_business)) {
                errors.whitepaper_business = 'my_account.err.scriptTag';
            }
        }

        //10)Whitepaper business
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_technical")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_technical"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "whitepaper_technical"))].Isrequired == 1 && (!data.whitepaper_technical || typeof data.whitepaper_technical == 'undefined' || data.whitepaper_technical == "" || data.whitepaper_technical.length == 0 || Validator.isEmpty(data.whitepaper_technical.trim() + ''))) {
                errors.whitepaper_technical = 'coinListRequestForm.error.whitepaper_technical';
            }

            if (validateInput.isHtmlTag(data.whitepaper_technical)) {
                errors.whitepaper_technical = 'my_account.err.scriptTag';
            }
        }

        //11)stack_channel
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "stack_channel")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "stack_channel"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "stack_channel"))].Isrequired == 1 && (!data.stack_channel || typeof data.stack_channel == 'undefined' || data.stack_channel == "" || data.stack_channel.length == 0 || Validator.isEmpty(data.stack_channel.trim() + ''))) {
                errors.stack_channel = 'coinListRequestForm.error.stack_channel';
            }
            if (validateInput.isHtmlTag(data.stack_channel)) {
                errors.stack_channel = 'my_account.err.scriptTag';
            }
        }

        //12)official_gitHub_repository_link
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "official_gitHub_repository_link")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_gitHub_repository_link"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_gitHub_repository_link"))].Isrequired == 1 && (!data.official_gitHub_repository_link || typeof data.official_gitHub_repository_link == 'undefined' || data.official_gitHub_repository_link == "" || data.official_gitHub_repository_link.length == 0 || Validator.isEmpty(data.official_gitHub_repository_link.trim() + ''))) {
                errors.official_gitHub_repository_link = 'coinListRequestForm.error.official_gitHub_repository_link';
            }

            if (validateInput.isHtmlTag(data.official_gitHub_repository_link)) {
                errors.official_gitHub_repository_link = 'my_account.err.scriptTag';
            } else if (typeof data.official_gitHub_repository_link != 'undefined' && data.official_gitHub_repository_link != "" && data.official_gitHub_repository_link.length > 0 && !Validator.isURL(data.official_gitHub_repository_link + "", ['http', 'https'])) {
                errors.official_gitHub_repository_link = 'coinListRequestForm.error.official_gitHub_repository_link_url';
            }
        }

        //13)team contact
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "team_contact")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_contact"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_contact"))].Isrequired == 1 && (!data.team_contact || typeof data.team_contact == 'undefined' || data.team_contact == "" || data.team_contact.length == 0 || Validator.isEmpty(data.team_contact.trim() + ''))) {
                errors.team_contact = 'coinListRequestForm.error.team_contact';
            }

            if (validateInput.isHtmlTag(data.team_contact)) {
                errors.team_contact = 'my_account.err.scriptTag';
            }
        }

        //14)team_bio
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "team_bio")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_bio"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "team_bio"))].Isrequired == 1 && (!data.team_bio || typeof data.team_bio == 'undefined' || data.team_bio == "" || data.team_bio.length == 0 || Validator.isEmpty(data.team_bio.trim() + ''))) {
                errors.team_bio = 'coinListRequestForm.error.team_bio';
            }

            if (validateInput.isHtmlTag(data.team_bio)) {
                errors.team_bio = 'my_account.err.scriptTag';
            }
        }

        //15)headquarter_address
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "headquarter_address")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "headquarter_address"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "headquarter_address"))].Isrequired == 1 && !data.headquarter_address || typeof data.headquarter_address == 'undefined' || data.headquarter_address == "" || data.headquarter_address.length == 0 || Validator.isEmpty(data.headquarter_address.trim() + '')) {
                errors.headquarter_address = 'coinListRequestForm.error.headquarter_address';
            }

            if (validateInput.isHtmlTag(data.headquarter_address)) {
                errors.headquarter_address = 'my_account.err.scriptTag';
            }
        }

        //16)wallet_source_code
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet_source_code")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet_source_code"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet_source_code"))].Isrequired == 1 && (!data.wallet_source_code || typeof data.wallet_source_code == 'undefined' || data.wallet_source_code == "" || data.wallet_source_code.length == 0 || Validator.isEmpty(data.wallet_source_code.trim() + ''))) {
                errors.wallet_source_code = 'coinListRequestForm.error.walletSourceCode';
            }
            if (validateInput.isHtmlTag(data.wallet_source_code)) {
                errors.wallet_source_code = 'my_account.err.scriptTag';
            } else if (typeof data.wallet_source_code != 'undefined' && data.wallet_source_code != "" && data.wallet_source_code != null && !Validator.isURL(data.wallet_source_code + "", ['http', 'https'])) {
                errors.wallet_source_code = 'coinListRequestForm.error.validUrl';
            }
        }

        //17)node_source_code
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "node_source_code")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "node_source_code"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "node_source_code"))].Isrequired == 1 && (!data.node_source_code || typeof data.node_source_code == 'undefined' || data.node_source_code == "" || data.node_source_code.length == 0 || Validator.isEmpty(data.node_source_code.trim() + ''))) {
                errors.node_source_code = 'coinListRequestForm.error.nodeSourceCode';
            }
            if (validateInput.isHtmlTag(data.node_source_code)) {
                errors.node_source_code = 'my_account.err.scriptTag';
            } else if (typeof data.node_source_code != 'undefined' && data.node_source_code != "" && data.node_source_code != null && !Validator.isURL(data.node_source_code + "", ['http', 'https'])) {
                errors.node_source_code = 'coinListRequestForm.error.validUrl';
            }
        }

        //18)official_blockchain_explorer_link
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "official_blockchain_explorer_link")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_blockchain_explorer_link"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "official_blockchain_explorer_link"))].Isrequired == 1 && (!data.official_blockchain_explorer_link || typeof data.official_blockchain_explorer_link == 'undefined' || data.official_blockchain_explorer_link == "" || data.official_blockchain_explorer_link.length == 0 || Validator.isEmpty(data.official_blockchain_explorer_link.trim() + ''))) {
                errors.official_blockchain_explorer_link = 'coinListRequestForm.error.official_blockchain_explorer_link';
            }

            if (validateInput.isHtmlTag(data.official_blockchain_explorer_link)) {
                errors.official_blockchain_explorer_link = 'my_account.err.scriptTag';
            } else if (!Validator.isURL(data.official_blockchain_explorer_link + "", ['http', 'https'])) {
                errors.official_blockchain_explorer_link = 'coinListRequestForm.error.official_gitHub_repository_link_url';
            }
        }

        //19)max_coin_supply
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "max_coin_supply")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "max_coin_supply"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "max_coin_supply"))].Isrequired == 1 && (!data.max_coin_supply || typeof data.max_coin_supply == 'undefined' || data.max_coin_supply == "" || data.max_coin_supply.length == 0 || Validator.isEmpty(data.max_coin_supply.trim() + ''))) {
                errors.max_coin_supply = 'coinListRequestForm.error.max_coin_supply';
            }

            if (validateInput.isHtmlTag(data.max_coin_supply)) {
                errors.max_coin_supply = 'my_account.err.scriptTag';
            }
        }

        //20)tx_Fee_for_transaction
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "tx_Fee_for_transaction")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "tx_Fee_for_transaction"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "tx_Fee_for_transaction"))].Isrequired == 1 && (!data.tx_Fee_for_transaction || typeof data.tx_Fee_for_transaction == 'undefined' || data.tx_Fee_for_transaction == "" || data.tx_Fee_for_transaction.length == 0 || Validator.isEmpty(data.tx_Fee_for_transaction.trim() + ''))) {
                errors.tx_Fee_for_transaction = 'coinListRequestForm.error.tx_Fee_for_transaction';
            }

            if (validateInput.isHtmlTag(data.tx_Fee_for_transaction)) {
                errors.tx_Fee_for_transaction = 'my_account.err.scriptTag';
            }
        }

        //21)social_media_links
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "social_media_links")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "social_media_links"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "social_media_links"))].Isrequired == 1 && (typeof data.social_media_links == 'undefined' && data.social_media_links == "" && data.social_media_links == null || Validator.isEmpty(data.social_media_links.trim() + ''))) {
                errors.social_media_links = 'coinListRequestForm.error.socialMediaLinks';
            }
            if (validateInput.isHtmlTag(data.social_media_links)) {
                errors.social_media_links = 'my_account.err.scriptTag';
            } else if (typeof data.social_media_links != 'undefined' && data.social_media_links != "" && data.social_media_links != null && !Validator.isURL(data.social_media_links + "", ['http', 'https'])) {
                errors.social_media_links = 'coinListRequestForm.error.validUrl';
            }
        }

        //22)code_review_audit_trusted_community
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "code_review_audit_trusted_community")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "code_review_audit_trusted_community"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "code_review_audit_trusted_community"))].Isrequired == 1 && (!data.code_review_audit_trusted_community || typeof data.code_review_audit_trusted_community == 'undefined' || data.code_review_audit_trusted_community == "" || data.code_review_audit_trusted_community.length == 0 || Validator.isEmpty(data.code_review_audit_trusted_community.trim() + ''))) {
                errors.code_review_audit_trusted_community = 'coinListRequestForm.error.code_review_audit_trusted_community';
            }

            if (validateInput.isHtmlTag(data.code_review_audit_trusted_community)) {
                errors.code_review_audit_trusted_community = 'my_account.err.scriptTag';
            }
        }

        //23)deployment_process
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "deployment_process")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "deployment_process"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "deployment_process"))].Isrequired == 1 && (!data.deployment_process || typeof data.deployment_process == 'undefined' || data.deployment_process == "" || data.deployment_process.length == 0 || Validator.isEmpty(data.deployment_process.trim() + ''))) {
                errors.deployment_process = 'coinListRequestForm.error.deployment_process';
            }

            if (validateInput.isHtmlTag(data.deployment_process)) {
                errors.deployment_process = 'my_account.err.scriptTag';
            }
        }

        //24)premined_coin_amount
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_amount")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_amount"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_amount"))].Isrequired == 1 && (!data.premined_coin_amount || typeof data.premined_coin_amount == 'undefined' || data.premined_coin_amount == "" || data.premined_coin_amount.length == 0 || Validator.isEmpty(data.premined_coin_amount.trim() + ''))) {
                errors.premined_coin_amount = 'coinListRequestForm.error.premined_coin_amount';
            }

            if (validateInput.isHtmlTag(data.premined_coin_amount)) {
                errors.premined_coin_amount = 'my_account.err.scriptTag';
            } else if (typeof data.premined_coin_amount != 'undefined' && data.premined_coin_amount != "" && data.premined_coin_amount.length > 0 && !Validator.isNumeric(data.premined_coin_amount + "")) {
                errors.premined_coin_amount = 'my_account.err.fieldNum';
            }
        }

        //25)premined_coin_in_escrow
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_in_escrow")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_in_escrow"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "premined_coin_in_escrow"))].Isrequired == 1 && (!data.premined_coin_in_escrow || typeof data.premined_coin_in_escrow == 'undefined' || data.premined_coin_in_escrow == "" || data.premined_coin_in_escrow.length == 0 || Validator.isEmpty(data.premined_coin_in_escrow.trim() + ''))) {
                errors.premined_coin_in_escrow = 'coinListRequestForm.error.premined_coin_in_escrow';
            }

            if (validateInput.isHtmlTag(data.premined_coin_in_escrow)) {
                errors.premined_coin_in_escrow = 'my_account.err.scriptTag';
            }
        }

        //26)number_of_addresses_coins_were_distributed
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_addresses_coins_were_distributed")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_addresses_coins_were_distributed"))].status == 1) {

            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_addresses_coins_were_distributed"))].Isrequired == 1 && (!data.number_of_addresses_coins_were_distributed || typeof data.number_of_addresses_coins_were_distributed == 'undefined' || data.number_of_addresses_coins_were_distributed == "" || data.number_of_addresses_coins_were_distributed.length == 0 || Validator.isEmpty(data.number_of_addresses_coins_were_distributed.trim() + ''))) {
                errors.number_of_addresses_coins_were_distributed = 'coinListRequestForm.error.number_of_addresses_coins_were_distributed';
            }

            if (validateInput.isHtmlTag(data.number_of_addresses_coins_were_distributed)) {
                errors.number_of_addresses_coins_were_distributed = 'my_account.err.scriptTag';
            }
        }

        //27)segwit_exhibition
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "segwit_exhibition")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "segwit_exhibition"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "segwit_exhibition"))].Isrequired == 1 && (!data.segwit_exhibition || typeof data.segwit_exhibition == 'undefined' || data.segwit_exhibition == "" || data.segwit_exhibition.length == 0 || Validator.isEmpty(data.segwit_exhibition.trim() + ''))) {
                errors.segwit_exhibition = 'coinListRequestForm.error.segwit_exhibition';
            }
            if (validateInput.isHtmlTag(data.segwit_exhibition)) {
                errors.segwit_exhibition = 'my_account.err.scriptTag';
            }
        }

        //28)blockspeed
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "blockspeed")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "blockspeed"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "blockspeed"))].Isrequired == 1 && (!data.blockspeed || typeof data.blockspeed == 'undefined' || data.blockspeed == "" || data.blockspeed.length == 0 || Validator.isEmpty(data.blockspeed.trim() + ''))) {
                errors.blockspeed = 'coinListRequestForm.error.blockspeed';
            }

            if (validateInput.isHtmlTag(data.blockspeed)) {
                errors.blockspeed = 'my_account.err.scriptTag';
            }
        }

        //29)core_algorithm
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm"))].Isrequired == 1 && (!data.core_algorithm || typeof data.core_algorithm == 'undefined' || data.core_algorithm == "" || data.core_algorithm.length == 0 || Validator.isEmpty(data.core_algorithm.trim() + ''))) {
                errors.core_algorithm = 'coinListRequestForm.error.core_algorithm';
            }

            if (validateInput.isHtmlTag(data.core_algorithm)) {
                errors.core_algorithm = 'my_account.err.scriptTag';
            }
        }

        //30)amount_raised_during_pre_ico
        if ((coinListFields.findIndex(coinListformField => (coinListformField.key === "amount_raised_during_pre_ico")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "amount_raised_during_pre_ico"))].status == 1)) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "core_algorithm"))].Isrequired == 1 && (typeof data.amount_raised_during_pre_ico == 'undefined' && data.amount_raised_during_pre_ico == "" && data.amount_raised_during_pre_ico == null)) {
                errors.amount_raised_during_pre_ico = 'my_account.err.amount_raised_during_pre_ico';
            }
            if (validateInput.isHtmlTag(data.amount_raised_during_pre_ico)) {
                errors.amount_raised_during_pre_ico = 'my_account.err.scriptTag';
            } else if (typeof data.amount_raised_during_pre_ico != 'undefined' && data.amount_raised_during_pre_ico != "" && data.amount_raised_during_pre_ico != null && !Validator.isNumeric(data.amount_raised_during_pre_ico + "")) {
                errors.amount_raised_during_pre_ico = 'my_account.err.fieldNum';
            }
        }

        //31)Advisory
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "Advisory")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "Advisory"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "Advisory"))].Isrequired == 1 && (!data.advisory || typeof data.advisory == 'undefined' || data.advisory == "" || data.advisory.length == 0 || Validator.isEmpty(data.advisory.trim() + ''))) {
                errors.advisory = 'coinListRequestForm.error.Advisory';
            }

            if (validateInput.isHtmlTag(data.advisory)) {
                errors.advisory = 'my_account.err.scriptTag';
            }
        }

        //32)number_of_blocks_mined
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_blocks_mined")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_blocks_mined"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "number_of_blocks_mined"))].Isrequired == 1 && (!data.number_of_blocks_mined || typeof data.number_of_blocks_mined == 'undefined' || data.number_of_blocks_mined == "" || data.number_of_blocks_mined.length == 0 || Validator.isEmpty(data.number_of_blocks_mined.trim() + ''))) {
                errors.number_of_blocks_mined = 'coinListRequestForm.error.number_of_blocks_mined';
            }

            if (validateInput.isHtmlTag(data.number_of_blocks_mined)) {
                errors.number_of_blocks_mined = 'my_account.err.scriptTag';
            }
        }

        //33)dev_language
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "dev_language")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "dev_language"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "dev_language"))].Isrequired == 1 && (!data.dev_language || typeof data.dev_language == 'undefined' || data.dev_language == "" || data.dev_language.length == 0 || Validator.isEmpty(data.dev_language.trim() + ''))) {
                errors.dev_language = 'coinListRequestForm.error.dev_language';
            }

            if (validateInput.isHtmlTag(data.dev_language)) {
                errors.dev_language = 'my_account.err.scriptTag';
            }
        }

        //34)erc_20_compliant
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "erc_20_compliant")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "erc_20_compliant"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "erc_20_compliant"))].Isrequired == 1 && (!data.erc_20_compliant || typeof data.erc_20_compliant == 'undefined' || data.erc_20_compliant == "" || data.erc_20_compliant.length == 0 || Validator.isEmpty(data.erc_20_compliant.trim() + ''))) {
                errors.erc_20_compliant = 'coinListRequestForm.error.erc_20_compliant';
            }

            if (validateInput.isHtmlTag(data.erc_20_compliant)) {
                errors.erc_20_compliant = 'my_account.err.scriptTag';
            }
        }

        //35)difficulty
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "difficulty")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "difficulty"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "difficulty"))].Isrequired == 1 && (!data.difficulty || typeof data.difficulty == 'undefined' || data.difficulty == "" || data.difficulty.length == 0 || Validator.isEmpty(data.difficulty.trim() + ''))) {
                errors.difficulty = 'coinListRequestForm.error.difficulty';
            }

            if (validateInput.isHtmlTag(data.difficulty)) {
                errors.difficulty = 'my_account.err.scriptTag';
            }
        }

        //36)wallet
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "wallet"))].Isrequired == 1 && (!data.wallet || typeof data.wallet == 'undefined' || data.wallet == "" || data.wallet.length == 0 || Validator.isEmpty(data.wallet.trim() + ''))) {
                errors.wallet = 'coinListRequestForm.error.wallet';
            }

            if (validateInput.isHtmlTag(data.wallet)) {
                errors.wallet = 'my_account.err.scriptTag';
            }
        }

        //37)usual_cost
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "usual_cost")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "usual_cost"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "usual_cost"))].Isrequired == 1 && (!data.usual_cost || typeof data.usual_cost == 'undefined' || data.usual_cost == "" || data.usual_cost.length == 0 || Validator.isEmpty(data.usual_cost.trim() + ''))) {
                errors.usual_cost = 'coinListRequestForm.error.usual_cost';
            }
            if (validateInput.isHtmlTag(data.usual_cost)) {
                errors.usual_cost = 'my_account.err.scriptTag';
            }
        }

        //38)if_this_coin_is_a_security
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "if_this_coin_is_a_security")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "if_this_coin_is_a_security"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "if_this_coin_is_a_security"))].Isrequired == 1 && (!data.if_this_coin_is_a_security || typeof data.if_this_coin_is_a_security == 'undefined' || data.if_this_coin_is_a_security == "" || data.if_this_coin_is_a_security.length == 0 || Validator.isEmpty(data.if_this_coin_is_a_security.trim() + ''))) {
                errors.if_this_coin_is_a_security = 'coinListRequestForm.error.if_this_coin_is_a_security';
            }

            if (validateInput.isHtmlTag(data.if_this_coin_is_a_security)) {
                errors.if_this_coin_is_a_security = 'my_account.err.scriptTag';
            }
        }

        //39)coin_type
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_type")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_type"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_type"))].Isrequired == 1 && (!data.coin_type || typeof data.coin_type == 'undefined' || data.coin_type == "" || data.coin_type.length == 0 || Validator.isEmpty(data.coin_type.trim() + ''))) {
                errors.coin_type = 'coinListRequestForm.error.coinType';
            }

            if (validateInput.isHtmlTag(data.coin_type)) {
                errors.coin_type = 'my_account.err.scriptTag';
            }
        }

        //40)coin_description
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_description")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_description"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_description"))].Isrequired == 1 && (!data.coin_description || typeof data.coin_description == 'undefined' || data.coin_description == "" || data.coin_description.length == 0 || Validator.isEmpty(data.coin_description.trim() + ''))) {
                errors.coin_description = 'coinListRequestForm.error.coinDescription';
            }

            if (validateInput.isHtmlTag(data.coin_description)) {
                errors.coin_description = 'my_account.err.scriptTag';
            }
        }

        //41)coin_short_name
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_short_name")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_short_name"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_short_name"))].Isrequired == 1 && (!data.coin_short_name || typeof data.coin_short_name == 'undefined' || data.coin_short_name == "" || data.coin_short_name.length == 0 || Validator.isEmpty(data.coin_short_name.trim() + ''))) {
                errors.coin_short_name = 'coinListRequestForm.error.coin_short_name';
            }

            if (validateInput.isHtmlTag(data.coin_short_name)) {
                errors.coin_short_name = 'my_account.err.scriptTag';
            }
        }

        //42)coin_address
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_address")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_address"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "coin_address"))].Isrequired == 1 && (!data.coin_address || typeof data.coin_address == 'undefined' || data.coin_address == "" || data.coin_address.length == 0 || Validator.isEmpty(data.coin_address.trim() + ''))) {
                errors.coin_address = 'coinListRequestForm.error.coinAddress';
            }

            if (validateInput.isHtmlTag(data.coin_address)) {
                errors.coin_address = 'my_account.err.scriptTag';
            }
        }

        //43)decimal
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "decimal")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "decimal"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "decimal"))].Isrequired == 1 && (!data.decimal || typeof data.decimal == 'undefined' || data.decimal == "" || data.decimal.length == 0 || Validator.isEmpty(data.decimal.trim() + ''))) {
                errors.decimal = 'coinListRequestForm.error.decimal';
            }
            if (validateInput.isHtmlTag(data.decimal)) {
                errors.decimal = 'my_account.err.scriptTag';
            }
        }

        //44)total_supply
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "total_supply")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "total_supply"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "total_supply"))].Isrequired == 1 && (!data.total_supply || typeof data.total_supply == 'undefined' || data.total_supply == "" || data.total_supply.length == 0 || Validator.isEmpty(data.total_supply.trim() + ''))) {
                errors.total_supply = 'coinListRequestForm.error.totalSupply';
            }
            if (validateInput.isHtmlTag(data.total_supply)) {
                errors.total_supply = 'my_account.err.scriptTag';
            }
        }

        //45)circulating_supply
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "circulating_supply")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "circulating_supply"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "circulating_supply"))].Isrequired == 1 && (!data.circulating_supply || typeof data.circulating_supply == 'undefined' || data.circulating_supply == "" || data.circulating_supply.length == 0 || Validator.isEmpty(data.circulating_supply.trim() + ''))) {
                errors.circulating_supply = 'coinListRequestForm.error.circulatingSupply';
            }

            if (validateInput.isHtmlTag(data.circulating_supply)) {
                errors.circulating_supply = 'my_account.err.scriptTag';
            }
        }

        //46)first_name
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "first_name")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "first_name"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "first_name"))].Isrequired == 1 && (!data.first_name || typeof data.first_name == 'undefined' || data.first_name == "" || data.first_name.length == 0 || Validator.isEmpty(data.first_name.trim() + ''))) {
                errors.first_name = 'coinListRequestForm.error.firstName';
            }
            if (typeof data.first_name != 'undefined' && data.first_name != "" && data.first_name.length > 0 && validateInput.isHtmlTag(data.first_name)) {
                errors.first_name = 'my_account.err.scriptTag';
            } else if (typeof data.first_name != 'undefined' && data.first_name != "" && data.first_name.length > 0 && !Validator.isAlpha(data.first_name + "")) {
                errors.first_name = 'coinListRequestForm.error.validAlpha';
            }
        }

        //47)last_name
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "last_name")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "last_name"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "last_name"))].Isrequired == 1 && (!data.last_name || typeof data.last_name == 'undefined' || data.last_name == "" || data.last_name.length == 0 || Validator.isEmpty(data.last_name.trim() + ''))) {
                errors.last_name = 'coinListRequestForm.error.last_name';
            }
            if (validateInput.isHtmlTag(data.last_name)) {
                errors.last_name = 'my_account.err.scriptTag';
            } else if (typeof data.last_name != 'undefined' && data.last_name != "" && data.last_name != null && !Validator.isAlpha(data.last_name + "")) {
                errors.last_name = 'coinListRequestForm.error.validAlpha';
            }
        }

        //48)address
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "address")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address"))].Isrequired == 1 && (!data.address || typeof data.address == 'undefined' || data.address == "" || data.address.length == 0 || Validator.isEmpty(data.address.trim() + ''))) {
                errors.address = 'coinListRequestForm.error.Address';
            }

            if (validateInput.isHtmlTag(data.address)) {
                errors.address = 'my_account.err.scriptTag';
            }
        }

        //49)address_line_2
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "address_line_2")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address_line_2"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "address_line_2"))].Isrequired == 1 && (!data.address_line_2 || typeof data.address_line_2 == 'undefined' || data.address_line_2 == "" || data.address_line_2.length == 0 || Validator.isEmpty(data.address_line_2.trim() + ''))) {
                errors.address_line_2 = 'coinListRequestForm.error.address_line_2';
            }

            if (validateInput.isHtmlTag(data.address_line_2)) {
                errors.address_line_2 = 'my_account.err.scriptTag';
            }
        }

        //50)city
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "city")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "city"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "city"))].Isrequired == 1 && (!data.city || typeof data.city == 'undefined' || data.city == "" || data.city.length == 0 || Validator.isEmpty(data.city.trim() + ''))) {
                errors.city = 'coinListRequestForm.error.city';
            }

            if (validateInput.isHtmlTag(data.city)) {
                errors.city = 'my_account.err.scriptTag';
            }
        }

        //51)state
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "state")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "state"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "state"))].Isrequired == 1 && (!data.state || typeof data.state == 'undefined' || data.state == "" || data.state.length == 0 || Validator.isEmpty(data.state.trim() + ''))) {
                errors.state = 'coinListRequestForm.error.state';
            }

            if (validateInput.isHtmlTag(data.state)) {
                errors.state = 'my_account.err.scriptTag';
            }
        }

        //52)postalCode
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "postalCode")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "postalCode"))].status == 1) {

            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "postalCode"))].Isrequired == 1 && !data.postalCode || typeof data.postalCode == 'undefined' || data.postalCode == "" || data.postalCode.length == 0 || Validator.isEmpty(data.postalCode.trim() + '')) {
                errors.postalCode = 'coinListRequestForm.error.postalCode';
            }
            if (typeof data.postalCode != 'undefined' && data.postalCode != "" && data.postalCode.length > 0 && !Validator.isNumeric(data.postalCode + "")) {
                errors.postalCode = 'coinListRequestForm.error.postalCodeNumber';
            }
        }

        //53)country
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "country")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "country"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "country"))].Isrequired == 1 && (!data.country || typeof data.country == 'undefined' || data.country == "" || data.country.length == 0 || Validator.isEmpty(data.country.trim() + ''))) {
                errors.country = 'coinListRequestForm.error.country';
            }

            if (validateInput.isHtmlTag(data.country)) {
                errors.country = 'my_account.err.scriptTag';
            }
        }

        //54)phone
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "phone")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "phone"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "phone"))].Isrequired == 1 && (typeof data.phone == 'undefined' && data.phone == "" && data.phone == null)) {
                errors.phone = 'coinListRequestForm.error.phone';
            }
            if (validateInput.isHtmlTag(data.phone)) {
                errors.phone = 'my_account.err.scriptTag';
            } else if (typeof data.phone != 'undefined' && data.phone != "" && data.phone != null && !Validator.isNumeric(data.phone + "")) {
                errors.phone = 'my_account.err.fieldNum';
            }
        }

        //55)email
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "email")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "email"))].status == 1) {

            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "email"))].Isrequired == 1 && (!data.email || typeof data.email == 'undefined' || data.email == "" || data.email.length == 0 || Validator.isEmpty(data.email.trim() + ''))) {
                errors.email = 'coinListRequestForm.error.email';
            }
            if (validateInput.isHtmlTag(data.email)) {
                errors.email = 'my_account.err.scriptTag';
            } else if (typeof data.email != 'undefined' && data.email != "" && data.email.length > 0 && !Validator.isEmail(data.email)) {
                errors.email = 'coinListRequestForm.error.emailValidation';
            }
        }

        //56)project_name
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "project_name")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_name"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_name"))].Isrequired == 1 && (!data.project_name && typeof data.project_name == 'undefined' && data.project_name == "" && data.project_name.length > 0 && Validator.isEmpty(data.project_name.trim() + ''))) {
                errors.project_name = 'coinListRequestForm.error.project_name';
            }

            if (validateInput.isHtmlTag(data.project_name)) {
                errors.project_name = 'my_account.err.scriptTag';
            }
        }

        //57)project_website_link
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "project_website_link")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_website_link"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "project_website_link"))].Isrequired == 1 && (typeof data.project_website_link == 'undefined' || data.project_website_link == "" || data.project_website_link == null)) {
                errors.project_website_link = 'coinListRequestForm.error.projectWebsiteLink';
            }

            if (validateInput.isHtmlTag(data.project_website_link)) {
                errors.project_website_link = 'my_account.err.scriptTag';
            } else if (typeof data.project_website_link != 'undefined' && data.project_website_link != "" && data.project_website_link != null && !Validator.isURL(data.project_website_link + "", ['http', 'https'])) {
                errors.project_website_link = 'coinListRequestForm.error.official_gitHub_repository_link_url';
            }
        }

        //58)do_you_have_an_active_community
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "do_you_have_an_active_community")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "do_you_have_an_active_community"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "do_you_have_an_active_community"))].Isrequired == 1 && (!data.do_you_have_an_active_community || typeof data.do_you_have_an_active_community == 'undefined' || data.do_you_have_an_active_community == "" || data.do_you_have_an_active_community.length == 0 || Validator.isEmpty(data.do_you_have_an_active_community.trim() + ''))) {
                errors.do_you_have_an_active_community = 'coinListRequestForm.error.doYouHaveActiveCommunity';
            }

            if (validateInput.isHtmlTag(data.do_you_have_an_active_community)) {
                errors.do_you_have_an_active_community = 'my_account.err.scriptTag';
            }
        }

        //59)information_on_how_funds_were_raised
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "information_on_how_funds_were_raised")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "information_on_how_funds_were_raised"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "information_on_how_funds_were_raised"))].Isrequired == 1 && (!data.information_on_how_funds_were_raised || typeof data.information_on_how_funds_were_raised == 'undefined' || data.information_on_how_funds_were_raised == "" || data.information_on_how_funds_were_raised.length == 0 || Validator.isEmpty(data.information_on_how_funds_were_raised.trim() + ''))) {
                errors.information_on_how_funds_were_raised = 'coinListRequestForm.error.information_on_how_funds_were_raised';
            }

            if (validateInput.isHtmlTag(data.information_on_how_funds_were_raised)) {
                errors.information_on_how_funds_were_raised = 'my_account.err.scriptTag';
            }
        }

        //60)current_listing_on_other_exchanges
        if (coinListFields.findIndex(coinListformField => (coinListformField.key === "current_listing_on_other_exchanges")) != -1 && coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "current_listing_on_other_exchanges"))].status == 1) {
            if (coinListFields[coinListFields.findIndex(coinListformField => (coinListformField.key === "current_listing_on_other_exchanges"))].Isrequired == 1 && (!data.current_listing_on_other_exchanges || typeof data.current_listing_on_other_exchanges == 'undefined' || data.current_listing_on_other_exchanges == "" || data.current_listing_on_other_exchanges.length == 0 || Validator.isEmpty(data.current_listing_on_other_exchanges.trim() + ''))) {
                errors.current_listing_on_other_exchanges = 'coinListRequestForm.error.currentListingOtherExchanges';
            }
            if (validateInput.isHtmlTag(data.current_listing_on_other_exchanges)) {
                errors.current_listing_on_other_exchanges = 'my_account.err.scriptTag';
            }
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? true : false
    };

};