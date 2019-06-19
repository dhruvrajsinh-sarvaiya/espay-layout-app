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
	request.on('error', function (e) {
		console.log('Problem with request: ' + e.message);
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
	console.log(PathInfo);
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
	request.on('error', function (e) {
		console.log('Problem with request: ' + e.message);
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
	request.on('error', function (e) {
		console.log('Problem with request: ' + e.message);
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
