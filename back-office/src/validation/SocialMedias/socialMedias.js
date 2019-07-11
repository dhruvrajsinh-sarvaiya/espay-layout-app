/* 
    Created By : Megha Kariya
    Date : 12-02-2019
    Description : CMS Social Media validation file
*/
import validator from 'validator';

module.exports = function validateCmsSocialMediaInput(data) {
  let errors = {};
  
  if (typeof (data.social_media_type)=== 'undefined'  || validator.isEmpty(data.social_media_type.trim()+'')) {
    errors.social_media_type = 'cmssocialmedia.socialmediaform.error.socialMediaType';
  }
  // else if (typeof (data.social_media_type) !== 'undefined' && (data.social_media_type < 1 || data.social_media_type > 2)) {
  else if (typeof (data.social_media_type) !== 'undefined' && (!validator.isInt(data.social_media_type+'', { min: 1, max: 2 }))) {
    errors.social_media_type = 'cmssocialmedia.socialmediaform.error.socialMediaTypeInvalid';
  }

  if (typeof (data.social_media_type) !== 'undefined' && data.social_media_type === "1" && (typeof data.details === "undefined" || (typeof data.details !== "undefined" && (typeof data.details.username === "undefined" || validator.isEmpty(data.details.username+''))))) {
    errors.username = 'cmssocialmedia.socialmediaform.error.username';
  }
  else if(typeof(data.details.username) !== 'undefined' && !validator.matches(data.details.username,/^[a-zA-Z0-9_]{1,15}$/))
  {
    errors.username = 'cmssocialmedia.socialmediaform.error.usernameInvalid';
  }

  // else if(typeof(data.details.username) !== 'undefined' && !/^[a-zA-Z0-9_]{1,15}$/.test(data.details.username))
  // {
  //   errors.username = 'cmssocialmedia.socialmediaform.error.usernameInvalid';
  // }

  if (typeof (data.social_media_type) !== 'undefined' && data.social_media_type === "1" && (typeof data.details === "undefined" || (typeof data.details !== "undefined" && (typeof data.details.source === "undefined" || validator.isEmpty(data.details.source))))) {
    errors.source = 'cmssocialmedia.socialmediaform.error.source';
  }
  
  if (typeof (data.social_media_type) !== 'undefined' && data.social_media_type === "2" && (typeof data.details === "undefined" || (typeof data.details !== "undefined" && (typeof data.details.appId === "undefined" || validator.isEmpty(data.details.appId))))) {
    errors.appId = 'cmssocialmedia.socialmediaform.error.appId';
  }
  else if(typeof (data.social_media_type) !== 'undefined' && data.social_media_type === "2" && (typeof data.details !== "undefined" && (typeof data.details.appId !== "undefined" &&!validator.isInt(data.details.appId+''))))
  {
    errors.appId = 'cmssocialmedia.socialmediaform.error.appIdNum';
  }
  else if(typeof (data.social_media_type) !== 'undefined' && data.social_media_type === "2" && (typeof data.details !== "undefined" && (typeof data.details.appId !== "undefined" && data.details.appId.length > 20)))
  {
    errors.appId = 'cmssocialmedia.socialmediaform.error.appIdLength';
  }
 
  if (typeof (data.social_media_type) !== 'undefined' && data.social_media_type === "2" && (typeof data.details === "undefined" || (typeof data.details !== "undefined" && (typeof data.details.pageUrl === "undefined" || validator.isEmpty(data.details.pageUrl))))) {
    errors.pageUrl = 'cmssocialmedia.socialmediaform.error.pageUrl';
  }
  else if(typeof(data.details.pageUrl) !== 'undefined' && !validator.matches(data.details.pageUrl,/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i))
  {
    errors.pageUrl = 'cmssocialmedia.socialmediaform.error.pageUrlInvalid';
  }
  // else if(typeof(data.details.pageUrl) !== 'undefined' && !/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(data.details.pageUrl))
  // {
  //   errors.pageUrl = 'cmssocialmedia.socialmediaform.error.pageUrlInvalid';
  // }

  if( typeof data.status == 'undefined' || data.status.length == 0 || validator.isEmpty(data.status+'')) {
    errors.status = 'cmssocialmedia.socialmediaform.error.status';
  } 
  else if (!validator.isInt(data.status+'', { min: 0, max: 1 })) {
    errors.status = 'cmssocialmedia.socialmediaform.error.statusNum';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
