const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `unit test` input defined in action metadata file
  targetURL = core.getInput('target-url');
  console.log(`TargetURL: ${targetURL}`);
  SUToken = core.getInput('outsystems-serviceuser-token');
  console.log(`BearerToken: ${SUToken}`);  
  

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
				console.log(error)
				return error
			}else if(response.statusCode == 200 || response.statusCode ==204) {
				// do something with JSON, using the 'body' variable
				console.log(body)
				testRunId = body.TestRunId
			}else{
				console.log('statuscode: ',response.statuscode)
				console.log(`an issue occurred, response statuscode is: ${response.statusCode}`)
				return `an issue occurred, response statuscode is: ${response.statusCode}`;
			};
		};
		
	request(options, callback);
	
  
  const isSuccess = (testRunId!=0);
  core.setOutput("success", isSuccess);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

