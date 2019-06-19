const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const SettingSchema = new Schema({
    siteid: Int32,
    general: {
        locale: {}
    },
    image: {
        logo: { type: String },
        logoPreviewUrl: { type: String },
        fevicon: { type: String },
        feviconPreviewUrl: { type: String },
    },
    local: {
        streetaddress: { type: String },
        city: { type: String },
        postalcode: { type: String },
        country: { type: String },
        state: { type: String },
        phoneno: { type: String },
        emailaddress: { type: String },
        language: { type: String },
    },
    seo: {
        //Removed meta tags & add google analytics by Jayesh on 28-12-2018
        googleanalytics: { type: String },
        googleanalytics_url: { type: String }
    },
    social: {
        facebooklink: { type: String },
        twitterlink: { type: String },
        linkedinlink: { type: String },
        googlepluslink: { type: String },
        skypelink: { type: String },
        youtubelink: { type: String },
        pinetrestlink: { type: String },
        instagramlink: { type: String },
        whatsapplink: { type: String },
    },
    server: {
        maintenance_mode: { type: Int32, default: 0 },
    },
    chatscript: {
        //Added by Jayesh on 26-12-2018
        zendesk: { type: String },
        zoho: { type: String },
        tawk: { type: String },
        livechatinc: { type: String },
        livehelpnow: { type: String },
        smartsupp: { type: String },
        zendesk_active: { type: Int32 },
        zoho_active: { type: Int32 },
        tawk_active: { type: Int32 },
        livechatinc_active: { type: Int32 },
        livehelpnow_active: { type: Int32 },
        smartsupp_active: { type: Int32 }
    },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports = Setting = mongoose.model('sitesettings', SettingSchema);