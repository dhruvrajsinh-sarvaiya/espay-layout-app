/**
 * Create By Sanjay 
 * Created Date 06-06-2019
 * Validation File Advance HTML Block 
 */

import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateAdvanceHTMLBlockFormInput(data) {
    let errors = {};    

    if (validator.isEmpty(data.name.trim())) {
        errors.name = "my_account.err.fieldRequired";
    } else if (typeof (data.name) !== 'undefined' && isScriptTag(data.name)) {
        errors.name = "my_account.err.scriptTag";
    }

    if (validator.isEmpty(data.type.toString())) {
        errors.type = "my_account.err.fieldRequired";
    }

    if(data.type.toString() === "1"){
        if(data.content.tabs !== undefined){
            data.content.tabs.map((item,key) => {            
                errors[key] = {};
                if (validator.isEmpty(data.content.tabs[key].tabtype.toString())) {
                    errors[key].tabtype = "my_account.err.fieldRequired";
                }

                if (validator.isEmpty(data.content.tabs[key].tabtitle)) {
                    errors[key].tabtitle = "my_account.err.fieldRequired";
                } else if (typeof (data.content.tabs[key].tabtitle) !== 'undefined' && isScriptTag(data.content.tabs[key].tabtitle)) {
                    errors[key].tabtitle = "my_account.err.scriptTag";
                }

                if (validator.isEmpty(data.content.tabs[key].tabcontenttype.toString())) {
                    errors[key].tabcontenttype = "my_account.err.fieldRequired";
                }                

                if (validator.isEmpty(data.content.tabs[key].tabcontent)) {
                    errors[key].tabcontent = "my_account.err.fieldRequired";
                } else if (typeof (data.content.tabs[key].tabcontent) !== 'undefined' && isScriptTag(data.content.tabs[key].tabcontent)) {
                    errors[key].tabcontent = "my_account.err.scriptTag";
                }

                if(data.content.tabs[key].tabcontenttype.toString() === 2){
                    if (typeof (data.content.tabs[key].tabcontent) !== 'undefined' && (!validator.isURL(data.content.tabs[key].tabcontent))) {
                        errors[key].tabcontent = "sitesetting.form.error.invalidurl";
                    }
                }

                if (validator.isEmpty(data.content.tabs[key].sortorder.toString())) {
                    errors[key].sortorder = "my_account.err.fieldRequired";
                }

            })
        }
    }

    if(data.type.toString() === "2"){
        if(data.content.panles !== undefined){
            data.content.panles.map((item,key) => {            
                errors[key] = {};
                if (validator.isEmpty(data.content.panles[key].panlecontenttype.toString())) {
                    errors[key].panlecontenttype = "my_account.err.fieldRequired";
                }

                if (validator.isEmpty(data.content.panles[key].panletitle)) {
                    errors[key].panletitle = "my_account.err.fieldRequired";
                } else if (typeof (data.content.panles[key].panletitle) !== 'undefined' && isScriptTag(data.content.panles[key].panletitle)) {
                    errors[key].panletitle = "my_account.err.scriptTag";
                }                

                if (validator.isEmpty(data.content.panles[key].panlecontent)) {
                    errors[key].panlecontent = "my_account.err.fieldRequired";
                } else if (typeof (data.content.panles[key].panlecontent) !== 'undefined' && isScriptTag(data.content.panles[key].panlecontent)) {
                    errors[key].panlecontent = "my_account.err.scriptTag";
                }

                if(data.content.panles[key].panlecontenttype.toString() === 2){
                    if (typeof (data.content.panles[key].panlecontent) !== 'undefined' && (!validator.isURL(data.content.panles[key].panlecontent))) {
                        errors[key].panlecontent = "sitesetting.form.error.invalidurl";
                    }
                }
                
                if (validator.isEmpty(data.content.panles[key].sortorder.toString())) {
                    errors[key].sortorder = "my_account.err.fieldRequired";
                }

            })
        }
    }
    
    if(data.type.toString() === "3"){
        if(data.content.modals !== undefined){
            data.content.modals.map((item,key) => {            
                errors[key] = {};
                if (validator.isEmpty(data.content.modals[key].modaltype.toString())) {
                    errors[key].modaltype = "my_account.err.fieldRequired";
                }

                if (validator.isEmpty(data.content.modals[key].modalcaption)) {
                    errors[key].modalcaption = "my_account.err.fieldRequired";
                } else if (typeof (data.content.modals[key].modalcaption) !== 'undefined' && isScriptTag(data.content.modals[key].modalcaption)) {
                    errors[key].modalcaption = "my_account.err.scriptTag";
                }

                if (validator.isEmpty(data.content.modals[key].modaltitle)) {
                    errors[key].modaltitle = "my_account.err.fieldRequired";
                } else if (typeof (data.content.modals[key].modaltitle) !== 'undefined' && isScriptTag(data.content.modals[key].modaltitle)) {
                    errors[key].modaltitle = "my_account.err.scriptTag";
                }

                if (validator.isEmpty(data.content.modals[key].modalcontenttype.toString())) {
                    errors[key].modalcontenttype = "my_account.err.fieldRequired";
                }

                if (validator.isEmpty(data.content.modals[key].modalcontent)) {
                    errors[key].modalcontent = "my_account.err.fieldRequired";
                } else if (typeof (data.content.modals[key].modalcontent) !== 'undefined' && isScriptTag(data.content.modals[key].modalcontent)) {
                    errors[key].modalcontent = "my_account.err.scriptTag";
                }

                if(data.content.modals[key].modalcontenttype.toString() === 2){
                    if (typeof (data.content.modals[key].modalcontent) !== 'undefined' && (!validator.isURL(data.content.modals[key].modalcontent))) {
                        errors[key].modalcontent = "sitesetting.form.error.invalidurl";
                    }
                }

                if (validator.isEmpty(data.content.modals[key].sortorder.toString())) {
                    errors[key].sortorder = "my_account.err.fieldRequired";
                }

            })
        }
    }
    // console.log(Object.values(Object.values(errors)[0]).length === 0)
    return {
        errors : Object.values(Object.values(errors)[0]).length === 0 ? {} : errors,
        isValid: Object.keys(errors).length > 0 ? false : Object.values(Object.values(errors)[0]).length === 0 ? true : false
    };

}