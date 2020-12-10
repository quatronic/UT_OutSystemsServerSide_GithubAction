const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `unit test` input defined in action metadata file
  targetURL = core.getInput('target-url');
  console.log(`TargetURL: ${targetURL}`);
  SUToken = core.getInput('outsystems-serviceuser-token');
  console.log(`BearerToken: ${SUToken}`);  
  
	/* F. Grooten
		looked at 'request' nodejs library. though found out it is outdated. > best to use the nodejs included https library for webservice requests
		https://stackoverflow.com/questions/13121590/steps-to-send-a-https-request-to-a-rest-service-in-node-js		
	*/
	
	// call the webservice which triggers the unit tests and returns a testRunId

	var testRunId = 0	
	
	const https = require('https');

	const options = {
	  host: targetURL,
	  port: 443,
	  path: '/UTF_Connector/rest/TestControler/RunAll',
	  method: 'GET',
	  headers:{
		  Authorization: 'Bearer '+SUToken
	  }
	};

	const req = https.request(options, (res) => {
	  console.log('statusCode:', res.statusCode);
	  console.log('headers:', res.headers);

	  res.on('data', (d) => {
		process.stdout.write(d);
		testRunId = d.TestRunId;
	  });
	});
	req.on('error', (e) => {
	  console.error(e);
	});
	req.end();

	
	/*
	//https://dev.to/isalevine/three-ways-to-retrieve-json-from-the-web-using-node-js-3c88
	const request = require('request');

	var options = {	url: targetURL,
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
	*/
  
  const isSuccess = (testRunId!=0);
  core.setOutput("success", isSuccess);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

