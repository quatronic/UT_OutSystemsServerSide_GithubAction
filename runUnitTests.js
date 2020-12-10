const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const targetURL = core.getInput('target-url');
  console.log(`URL ${targetURL}!`);
  const SUToken = core.getInput('outsystems-serviceuser-token');
  console.log(`Token ${SUToken}!`);  
  
  const isSuccess = true;
  core.setOutput("success", isSuccess);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}