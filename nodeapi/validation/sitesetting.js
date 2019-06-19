const validator = require('validator');

// Validation for Sitesetting Input data
exports.validateSiteSettingPageInput = function (data, filedata) {
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

      if (!(data.general.locale[lg].copyrights) || typeof (data.general.locale[lg].copyrights) == 'undefined' || (data.general.locale[lg].copyrights) == "" || data.general.locale[lg].copyrights.length == 0 || validator.isEmpty(data.general.locale[lg].copyrights.trim() + '')) {
        errors[lg].copyrights = 'sitesetting.form.error.copyrights';
        localeerror = true;
      }

      if (!(data.general.locale[lg].meta_title) || typeof (data.general.locale[lg].meta_title) == 'undefined' || (data.general.locale[lg].meta_title) == "" || data.general.locale[lg].meta_title.length == 0 || validator.isEmpty(data.general.locale[lg].meta_title.trim() + '')) {
        errors[lg].metatitle = 'sitesetting.form.error.metatitle';
        localeerror = true;
      }

      if (!localeerror) {
        delete errors[lg];
      }
    });

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
    if (!(data.chatscript) || typeof (data.chatscript) == 'undefined' || Object.keys(data.chatscript).length == 0) {
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

    if (typeof filedata != undefined && filedata != null) {
      if (typeof data.image.logo != 'undefined' && data.image.logo == '') {
        if (typeof filedata.logo == 'undefined' || filedata.logo == '') {
          errors.logo = 'sitesetting.form.error.requirelogo';
        }
        else if (typeof filedata.logo != 'undefined' && typeof filedata.logo.name != 'undefined' && parseInt(filedata.logo.name.split('.').length) > 2) {
          errors.logo = 'sitesetting.form.error.doubleextesionfilename';
        }
        else if (typeof filedata.logo != 'undefined' && typeof filedata.logo.type != 'undefined' && filedata.logo.mimetype != 'image/jpeg' && filedata.logo.mimetype != 'image/jpg' && filedata.logo.mimetype != 'image/png') {
          errors.logo = 'sitesetting.form.error.validatefile';
        }
      }

      if (typeof data.image.fevicon != 'undefined' && data.image.fevicon == '') {
        if (typeof filedata.fevicon == 'undefined' || filedata.fevicon == '') {
          errors.fevicon = 'sitesetting.form.error.requirefevicon';
        }
        else if (typeof filedata.fevicon != 'undefined' && typeof filedata.fevicon.name != 'undefined' && parseInt(filedata.fevicon.name.split('.').length) > 2) {
          errors.fevicon = 'sitesetting.form.error.doubleextesionfilename';
        }
        else if (typeof filedata.fevicon != 'undefined' && typeof filedata.fevicon.mimetype != 'undefined' && filedata.fevicon.mimetype != 'image/jpeg' && filedata.fevicon.mimetype != 'image/jpg' && filedata.fevicon.mimetype != 'image/png') {
          errors.fevicon = 'sitesetting.form.error.validatefile';
        }
      }
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Get Sitesetting By ID  Require to validate siteid
exports.validategetSiteSettingByIdInput = function (data) {
  let errors = {};

  if (!data.siteid || data.siteid == undefined || data.siteid == "" || data.siteid.length == 0) {
    errors.message = 'sitesetting.err.requiresiteid';
  } else if (validator.isEmpty(data.siteid + '')) {
    errors.message = 'sitesetting.err.requiresiteid';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};