var http = require('https');
var url = require('url');

exports.callAPIMethod = function (apiURL, methodName, apiRequest, apiHeader, callback) {

	var PathInfo = '';
	var urlInfo = url.parse(apiURL);

	if (urlInfo.path) {
		PathInfo = urlInfo.path + methodName;
	} else {
		PathInfo = "/" + method_name;
	}

	var RequestBody = JSON.stringify(apiRequest);
	var d = new Date();
	var currentTime = d.getTime();
	var options = {
		host: urlInfo.hostname, // host name
		path: PathInfo,
		method: 'POST',
		Id: currentTime,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': RequestBody.length,
			'authorization': apiHeader.token
		} // headers for core API
	};

	var request = http.request(options, function (response) {

		var body = [];

		response.on('data', function (data) {
			body.push(data);
		});

		response.on('end', function () {
			var ResponseString = Buffer.concat(body).toString();

			var APIResponse;
			try {
				APIResponse = JSON.parse(ResponseString);
				APIResponse.StatusCode = response.statusCode;

			} catch (err) {
				APIResponse = { ResponseStatus: 0 };
				APIResponse.StatusCode = response.statusCode;
			}
			callback(APIResponse);
		});

	});
	request.write(RequestBody);
	request.end();
};

exports.callAPIMethodGet = function (apiURL, methodName, apiRequest, apiHeader, callback) {

	var PathInfo = '';
	var urlInfo = url.parse(apiURL);

	if (urlInfo.path) {
		PathInfo = urlInfo.path + methodName;
	} else {
		PathInfo = "/" + method_name;
	}
	var queryString = '';

	for (var i in apiRequest) {

		queryString += i + "=" + apiRequest[i] + "&";
	}
	if (queryString != '') {
		queryString = queryString.slice(0, -1);
		PathInfo += "?" + queryString;
	}
	var RequestBody = JSON.stringify(apiRequest);
	var d = new Date();
	var currentTime = d.getTime();
	var options = {
		host: urlInfo.hostname, // host name
		path: PathInfo,
		method: 'GET',
		Id: currentTime,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': RequestBody.length,
			'authorization': apiHeader.token
		} // headers for core API
	};

	var request = http.request(options, function (response) {

		var body = [];

		response.on('data', function (data) {
			body.push(data);

		});

		response.on('end', function () {
			var ResponseString = Buffer.concat(body).toString();
			var APIResponse;
			try {

				APIResponse = JSON.parse(ResponseString);
				APIResponse.StatusCode = response.statusCode;
			} catch (err) {

				APIResponse = { ResponseStatus: 0 };
				APIResponse.StatusCode = response.statusCode;
			}
			callback(APIResponse);
		});

	});
	request.write(RequestBody);
	request.end();
};

exports.callAPIMethodPut = function (apiURL, methodName, apiRequest, apiHeader, callback) {

	var PathInfo = '';
	var urlInfo = url.parse(apiURL);

	if (urlInfo.path) {
		PathInfo = urlInfo.path + methodName;
	} else {
		PathInfo = "/" + method_name;
	}

	var RequestBody = JSON.stringify(apiRequest);
	var d = new Date();
	var currentTime = d.getTime();
	var options = {
		host: urlInfo.hostname, // host name
		path: PathInfo,
		method: 'PUT',
		Id: currentTime,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': RequestBody.length,
			'authorization': apiHeader.token
		} // headers for core API
	};

	var request = http.request(options, function (response) {

		var body = [];

		response.on('data', function (data) {
			body.push(data);
		});

		response.on('end', function () {
			var ResponseString = Buffer.concat(body).toString();
			var APIResponse;
			try {
				APIResponse = JSON.parse(ResponseString);
				APIResponse.StatusCode = response.statusCode;

			} catch (err) {
				APIResponse = { ResponseStatus: 0 };
				APIResponse.StatusCode = response.statusCode;
			}
			callback(APIResponse);
		});

	});
	request.write(RequestBody);
	request.end();
};

//check token
exports.isTokenExist = function (token, callback) {
	var access_token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NDsgcnY6NjIuMCkgR2Vja28vMjAxMDAxMDEgRmlyZWZveC82Mi4wIiwiYnJvd3NlciI6eyJuYW1lIjoiRmlyZWZveCIsInZlcnNpb24iOiI2Mi4wIiwibWFqb3IiOiI2MiJ9LCJlbmdpbmUiOnsibmFtZSI6IkdlY2tvIiwidmVyc2lvbiI6IjYyLjAifSwib3MiOnsibmFtZSI6IldpbmRvd3MiLCJ2ZXJzaW9uIjoiMTAifSwiZGV2aWNlIjp7fSwiY3B1Ijp7ImFyY2hpdGVjdHVyZSI6ImFtZDY0In19LCJpYXQiOjE1Mzg0NzQzNTAsImV4cCI6MTUzODQ3Nzk1MH0.koeuMpryYz7NrsdJw7GoDxPKzkZnwhFSojKwfxfiOCc';
	var response = {};
	response.status = 200;
	response.access_token = access_token;
	callback(response);
};

/**
 * Added by dhara gajera 30/1/2019
 * Function to Strip and HTML Tags validation
 */
exports.isHtmlTag = function (string, callback) {
	// export function isHtmlTag(string) {
	let check = /(<([^>]+)>)/ig.test(string);
	return check
}

// added by jinesh bhatt for check request 
exports.validateRequest = function (request, callback) {

	let IsError = validateObject(request);
	return IsError;
}
// added by jinesh bhatt for validate object 
function validateObject(RequestObject) {

	var IsError = false;

	let ObjectKeys = Object.keys(RequestObject);
	if (ObjectKeys.length === 1) {

		IsError = validateString(ObjectKeys[0]);

		if (IsError === true) {
			return IsError;
		} else {
			let Keys = Object.keys(RequestObject[ObjectKeys]);

			for (let i = 0; i < Keys.length; i++) {
				var IsError1 = validateString(Keys[i]);

				if (IsError1 === true) {
					return IsError1;
				} else {
					if (typeof RequestObject[ObjectKeys][Keys[i]] === 'string' && typeof RequestObject[ObjectKeys][Keys[i]] !== 'undefined') {

						IsError = validateString(RequestObject[ObjectKeys][Keys[i]]);

						if (IsError === true) {
							return IsError;
						}

					} else if (typeof RequestObject[ObjectKeys][Keys[i]] === 'object') {

						IsError = validateObject(RequestObject[ObjectKeys][Keys[i]]);
						if (IsError === true) {
							return IsError;
						}
					}
				}
			}
		}
	} else if (ObjectKeys.length > 1) {

		for (var j = 0; j < ObjectKeys.length; j++) {

			IsError = validateString(ObjectKeys[j]);
			if (IsError === true) {
				return IsError;
			} else {

				if (typeof RequestObject[ObjectKeys[j]] === 'object') {

					var Key = Object.keys(RequestObject[ObjectKeys[j]]);

					for (var k = 0; k < Key.length; k++) {

						IsError = validateString(Key[k]);
						if (IsError === true) {
							return IsError;
						} else {
							if (typeof RequestObject[ObjectKeys[j]][Key[k]] === 'string') {

								IsError = validateString(RequestObject[ObjectKeys[j]][Key[k]]);
								if (IsError === true) {
									return IsError;
								}
							} else if (typeof RequestObject[ObjectKeys[j]][Key[k]] === 'number') {

								validateNumber(RequestObject[ObjectKeys[j]][Key[k]]);

							} else if (typeof RequestObject[ObjectKeys[j]][Key[k]] === 'object') {

								IsError = validateObject(RequestObject[ObjectKeys[j]][Key[k]]);
								if (IsError === true) {
									return IsError;
								}
							}
						}
					}
				} else if (typeof RequestObject[ObjectKeys[j]] === 'string') {
					IsError = validateString(RequestObject[ObjectKeys[j]]);
					if (IsError === true) {
						return IsError;
					}
				}
			}
		}
	} else {

		IsError = validateObject(RequestObject[ObjectKeys]);
		if (IsError === true) {
			return IsError;
		}
	}
	return IsError;
}

// added by Jinesh bhatt for validate string 
function validateString(string) {

	let IsError = false;
	const Keywords = ['$eq', '$gt', '$gte', '$in', '$lt', '$lte', '$ne', '$nin', '$and', '$not', '$nor', '$or', '$exists', '$type', '$expr', '$jsonSchema', '$mod', '$regex', '$text', '$where', '$all', '$elemMatch', '$size', '$bitsAllClear', '$bitsAllSet', '$bitsAnyClear', '$bitsAnySet', '$comment', '$elemMatch', '$meta', '$slice', '$comment'];
	for (let i = 0; i < Keywords.length; i++) {
		if (string.indexOf(Keywords[i]) !== -1) {
			IsError = true;
			break;
		}
	}
	return IsError;
}
