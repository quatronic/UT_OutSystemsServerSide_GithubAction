const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const targetURL = core.getInput('target-url');
  console.log(`URL ${targetURL}`);
  const SUToken = core.getInput('outsystems-serviceuser-token');
  console.log(`Token ${SUToken}`);  
  
  /*    url: ${{env.TARGET_URL}}/UTF_Connector/rest/TestControler/RunAll
          method: GET
          headers: '{"Authorization": "Bearer ${{secrets.OUTSYSTEMSSERVICEUSER_TOKEN}}"}'
  */
	// call the webservice which triggers the unit tests and returns a testRunId
	//https://www.w3schools.com/js/js_json_http.asp
	//https://stackoverflow.com/questions/32604460/xmlhttprequest-module-not-defined-found
	var testRunId = 0
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var request = new XMLHttpRequest();
    request.open("GET", targetURL+'/UTF_Connector/rest/TestControler/RunAll', false);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + SUToken); 
    request.onload = function(){
		// Begin accessing JSON data here
		var data = JSON.parse(this.response)
			
		if (request.status >= 200 && request.status < 400) {
			testRunId = data.TestRunId;
			console.log('TestRunId: ${testRunId}')
		} else {
		console.log('error')
		}
	};
    request.send();
    alert(request.responseText);
  
  const isSuccess = (testRunId!=0);
  core.setOutput("success", isSuccess);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

