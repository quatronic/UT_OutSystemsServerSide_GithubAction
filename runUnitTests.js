const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const targetURL = core.getInput('target-url');
  console.log(`URL ${targetURL}`);
  const SUToken = core.getInput('outsystems-serviceuser-token');
  console.log(`Token ${SUToken}`);  
  

	// call the webservice which triggers the unit tests and returns a testRunId
	//https://dev.to/isalevine/three-ways-to-retrieve-json-from-the-web-using-node-js-3c88
	var testRunId = 0
	const request = require('request');

	var options = {	url: targetURL+'/UTF_Connector/rest/TestControler/RunAll',
					json: true,
					Authorization: 'Bearer '+SUToken
					};
	var callback = (error,response,body) => {
			if (error) {
				return  console.log(error)
			};
			if (!error && response.statusCode == 200) {
				// do something with JSON, using the 'body' variable
				console.log(body)
				testRunId = body.TestRunId
			};
		};
		
	request(options, callback);
	
	/*
		//https://www.w3schools.com/js/js_json_http.asp
	//https://stackoverflow.com/questions/32604460/xmlhttprequest-module-not-defined-found
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var request = new XMLHttpRequest();
    request.open("GET", targetURL+'/UTF_Connector/rest/TestControler/RunAll', false);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + SUToken); 
    request.onload = function(){
		// Begin accessing JSON data here		
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(this.response)
			testRunId = data.TestRunId;
			console.log('TestRunId: ${testRunId}')
		} else {
			console.log('TestRunId: ${request.status}')
			throw 'https request status is ${request.status}';
		}
	};
    request.send();
	*/
  
  const isSuccess = (testRunId!=0);
  core.setOutput("success", isSuccess);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

