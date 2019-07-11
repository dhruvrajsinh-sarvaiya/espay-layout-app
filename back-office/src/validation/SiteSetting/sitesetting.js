import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
module.exports = function validateSiteSettingPageInput(data, lang) {
  let errors = {};

  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else if (typeof data.general == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else if (typeof data.seo == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    let localeerror = false;

    Object.keys(data.general.locale).forEach((lg, index) => {
      errors[lg] = {};

      if (!(data.general.locale[lg].sitename) || typeof (data.general.locale[lg].sitename) == 'undefined' || (data.general.locale[lg].sitename) == "" || data.general.locale[lg].sitename.length == 0 || validator.isEmpty(data.general.locale[lg].sitename.trim() + '')) {
        errors[lg].sitename = 'sitesetting.form.error.sitename';
        localeerror = true;
      }
      else if (typeof (data.general.locale[lg].sitename) !== 'undefined' && (data.general.locale[lg].sitename) !== "" && data.general.locale[lg].sitename.length > 30) { // Added By Megha Kariya (15/02/2019)
        errors[lg].sitename = 'sitesetting.form.error.sitenameLimit';
        localeerror = true;
      }

      if (!(data.general.locale[lg].copyrights) || typeof (data.general.locale[lg].copyrights) == 'undefined' || (data.general.locale[lg].copyrights) == "" || data.general.locale[lg].copyrights.length == 0 || validator.isEmpty(data.general.locale[lg].copyrights.trim() + '')) {
        errors[lg].copyrights = 'sitesetting.form.error.copyrights';
        localeerror = true;
      }
      if (!validator.isEmpty(data.general.locale[lg].copyrights)) {
        if (isScriptTag(data.general.locale[lg].copyrights)) {
          errors[lg].copyrights = "my_account.err.scriptTag";
          localeerror = true;
        }
        else if (isHtmlTag(data.general.locale[lg].copyrights)) {
          errors[lg].copyrights = "my_account.err.htmlTag";
          localeerror = true;
        }
      }
      if (!(data.general.locale[lg].meta_title) || typeof (data.general.locale[lg].meta_title) == 'undefined' || (data.general.locale[lg].meta_title) == "" || data.general.locale[lg].meta_title.length == 0 || validator.isEmpty(data.general.locale[lg].meta_title.trim() + '')) {
        errors[lg].metatitle = 'sitesetting.form.error.metatitle';
        localeerror = true;
      }
      if (!validator.isEmpty(data.general.locale[lg].meta_title)) {
        if (isScriptTag(data.general.locale[lg].meta_title)) {
          errors[lg].metatitle = "my_account.err.scriptTag";
          localeerror = true;
        }
        else if (isHtmlTag(data.general.locale[lg].meta_title)) {
          errors[lg].metatitle = "my_account.err.htmlTag";
          localeerror = true;
        }
      }
      else if ((data.general.locale[lg].meta_title) && typeof (data.general.locale[lg].meta_title) !== 'undefined' && (data.general.locale[lg].meta_title) !== "" && data.general.locale[lg].meta_title.length > 60) {  // Added By Megha Kariya (15/02/2019)
        errors[lg].metatitle = 'sitesetting.form.error.metatitleLimit';
        localeerror = true;
      }

      if (!validator.isEmpty(data.general.locale[lg].meta_keyword)) {
        if (isScriptTag(data.general.locale[lg].meta_keyword)) {
          errors[lg].meta_keyword = "my_account.err.scriptTag";
          localeerror = true;
        }
        else if (isHtmlTag(data.general.locale[lg].meta_keyword)) {
          errors[lg].meta_keyword = "my_account.err.htmlTag";
          localeerror = true;
        }
      }
      // Added By Megha Kariya (15/02/2019)
      if ((data.general.locale[lg].meta_description) && typeof (data.general.locale[lg].meta_description) !== 'undefined' && (data.general.locale[lg].meta_description) !== "" && data.general.locale[lg].meta_description.length > 160) {
        errors[lg].meta_description = 'sitesetting.form.error.metadescriptionLimit';
        localeerror = true;
      }
      if (!validator.isEmpty(data.general.locale[lg].meta_description)) {
        if (isScriptTag(data.general.locale[lg].meta_description)) {
          errors[lg].meta_description = "my_account.err.scriptTag";
          localeerror = true;
        }
        else if (isHtmlTag(data.general.locale[lg].meta_description)) {
          errors[lg].meta_description = "my_account.err.htmlTag";
          localeerror = true;
        }
      }
      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (typeof data.image.logo == 'undefined' || data.image.logo == '') {
      errors.logo = 'sitesetting.form.error.requirelogo';
    }
    else if (typeof data.image.logo.name != 'undefined' && parseInt(data.image.logo.name.split('.').length) > 2) {
      errors.logo = 'sitesetting.form.error.doubleextesionfilename';
    }
    else if (typeof data.image.logo.type != 'undefined' && data.image.logo.type != 'image/jpeg' && data.image.logo.type != 'image/jpg' && data.image.logo.type != 'image/png') {
      errors.logo = 'sitesetting.form.error.validatefile';
    }
    else if (typeof data.image.logo.size != 'undefined' && data.image.logo.size > 5767168) {
      errors.logo = 'sitesetting.form.error.filemaxsize';
    }

    if (typeof data.image.fevicon == 'undefined' || data.image.fevicon == '') {
      errors.fevicon = 'sitesetting.form.error.requirefevicon';
    }
    else if (typeof data.image.fevicon.name != 'undefined' && parseInt(data.image.fevicon.name.split('.').length) > 2) {
      errors.logo = 'sitesetting.form.error.doubleextesionfilename';
    }
    else if (typeof data.image.fevicon.name != 'undefined' && data.image.fevicon.name.split('.') > 2) {
      errors.logo = 'sitesetting.form.error.doubleextesionfilename';
    }
    else if (typeof data.image.fevicon.type != 'undefined' && data.image.fevicon.type != 'image/jpeg' && data.image.fevicon.type != 'image/jpg' && data.image.fevicon.type != 'image/png') {
      errors.fevicon = 'sitesetting.form.error.validatefile';
    }
    else if (typeof data.image.fevicon.size != 'undefined' && data.image.fevicon.size > 5767168) {
      errors.fevicon = 'sitesetting.form.error.filemaxsize';
    }

    if (typeof data.local.emailaddress == 'undefined' || validator.isEmpty(data.local.emailaddress)) {
      errors.emailaddress = 'sitesetting.form.error.emailaddress';
    } else if (typeof data.local.emailaddress != 'undefined' && !validator.isEmail(data.local.emailaddress)) {
      errors.emailaddress = 'sitesetting.form.error.isvalidemailaddress';
    }

    if (typeof (data.local.phoneno) != 'undefined' && validator.isEmpty(data.local.phoneno)) {
      errors.phoneno = "sitesetting.form.error.phonenorequire";
    } else if (typeof (data.local.phoneno) != 'undefined' && !validator.isNumeric(data.local.phoneno) || parseInt(data.local.phoneno) == 0) {
      errors.phoneno = "sitesetting.form.error.isvalidphoneno";
    }

    if (typeof (data.local.postalcode) != 'undefined' && data.local.postalcode != '' && data.local.postalcode != null && !validator.isNumeric(data.local.postalcode) || parseInt(data.local.postalcode) == 0) {
      errors.postalcode = "sitesetting.form.error.isvalidpostalcode";
    }
    if (!validator.isEmpty(data.local.postalcode)) {
      if (isScriptTag(data.local.postalcode)) {
        errors.postalcode = "my_account.err.scriptTag";
        localeerror = true;
      }
      else if (isHtmlTag(data.local.postalcode)) {
        errors.postalcode = "my_account.err.htmlTag";
        localeerror = true;
      }
    }
    if (typeof (data.social.facebooklink) != 'undefined' && data.social.facebooklink != '' && data.social.facebooklink != null && !validator.isURL(data.social.facebooklink)) {
      errors.facebooklink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.twitterlink) != 'undefined' && data.social.twitterlink != '' && data.social.twitterlink != null && !validator.isURL(data.social.twitterlink)) {
      errors.twitterlink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.linkedinlink) != 'undefined' && data.social.linkedinlink != '' && data.social.linkedinlink != null && !validator.isURL(data.social.linkedinlink)) {
      errors.linkedinlink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.googlepluslink) != 'undefined' && data.social.googlepluslink != '' && data.social.googlepluslink != null && !validator.isURL(data.social.googlepluslink)) {
      errors.googlepluslink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.skypelink) != 'undefined' && data.social.skypelink != '' && data.social.skypelink != null && !validator.isURL(data.social.skypelink)) {
      errors.skypelink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.youtubelink) != 'undefined' && data.social.youtubelink != '' && data.social.youtubelink != null && !validator.isURL(data.social.youtubelink)) {
      errors.youtubelink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.pinetrestlink) != 'undefined' && data.social.pinetrestlink != '' && data.social.pinetrestlink != null && !validator.isURL(data.social.pinetrestlink)) {
      errors.pinetrestlink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.instagramlink) != 'undefined' && data.social.instagramlink != '' && data.social.instagramlink != null && !validator.isURL(data.social.instagramlink)) {
      errors.instagramlink = "sitesetting.form.error.invalidurl";
    }

    if (typeof (data.social.whatsapplink) != 'undefined' && data.social.whatsapplink != '' && data.social.whatsapplink != null && !validator.isURL(data.social.whatsapplink)) {
      errors.whatsapplink = "sitesetting.form.error.invalidurl";
    }

    //Added by Jayesh for Chat API on 26-12-2018
    if (typeof (data.chatscript) == 'undefined' || Object.keys(data.chatscript).length == 0) {
      errors.message = "sitesetting.form.error.chatscript";
    } else if (Object.keys(data.chatscript).length > 0 && data.chatscript.zendesk_active == 0 && data.chatscript.zoho_active == 0 && data.chatscript.tawk_active == 0 && data.chatscript.livechatinc_active == 0 && data.chatscript.livehelpnow_active == 0 && data.chatscript.smartsupp_active == 0) {
      errors.message = "sitesetting.form.error.minonescript";
    } else if (Object.keys(data.chatscript).length > 0 && data.chatscript.zendesk_active == 1 && (typeof (data.chatscript.zendesk) == 'undefined' || (data.chatscript.zendesk) == "" || data.chatscript.zendesk.length == 0 || validator.isEmpty(data.chatscript.zendesk.trim() + ''))) {
      errors.message = "sitesetting.form.error.zendesk";
    } else if (Object.keys(data.chatscript).length > 0 && data.chatscript.zoho_active == 1 && (typeof (data.chatscript.zoho) == 'undefined' || (data.chatscript.zoho) == "" || data.chatscript.zoho.length == 0 || validator.isEmpty(data.chatscript.zoho.trim() + ''))) {
      errors.message = "sitesetting.form.error.zoho";
    } else if (Object.keys(data.chatscript).length > 0 && data.chatscript.tawk_active == 1 && (typeof (data.chatscript.tawk) == 'undefined' || (data.chatscript.tawk) == "" || data.chatscript.tawk.length == 0 || validator.isEmpty(data.chatscript.tawk.trim() + ''))) {
      errors.message = "sitesetting.form.error.tawk";
    } else if (Object.keys(data.chatscript).length > 0 && data.chatscript.livechatinc_active == 1 && (typeof (data.chatscript.livechatinc) == 'undefined' || (data.chatscript.livechatinc) == "" || data.chatscript.livechatinc.length == 0 || validator.isEmpty(data.chatscript.livechatinc.trim() + ''))) {
      errors.message = "sitesetting.form.error.livechatinc";
    } else if (Object.keys(data.chatscript).length > 0 && data.chatscript.livehelpnow_active == 1 && (typeof (data.chatscript.livehelpnow) == 'undefined' || (data.chatscript.livehelpnow) == "" || data.chatscript.livehelpnow.length == 0 || validator.isEmpty(data.chatscript.livehelpnow.trim() + ''))) {
      errors.message = "sitesetting.form.error.livehelpnow";
    } else if (Object.keys(data.chatscript).length > 0 && data.chatscript.smartsupp_active == 1 && (typeof (data.chatscript.smartsupp) == 'undefined' || (data.chatscript.smartsupp) == "" || data.chatscript.smartsupp.length == 0 || validator.isEmpty(data.chatscript.smartsupp.trim() + ''))) {
      errors.message = "sitesetting.form.error.smartsupp";
    }


  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
