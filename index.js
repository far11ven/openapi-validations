import core from '@actions/core'; 
import github from '@actions/github'; 
import fetch from 'node-fetch';    // used when pulling files from server
import openapiDiff from 'openapi-diff';
import SwaggerParser from '@apidevtools/swagger-parser';

// Valid values [2 for swagger2, 3 for openapi3 ]
const openAPIVersion = core.getInput('openapi_version') == 2 ? 2 : 3 // default v3

const specFormat = openAPIVersion == 2 ? 'swagger2' : 'openapi3'  //default openapi3

//[Method 1: Using files from server]
const sourceFile = await fetch(`${core.getInput('source_file')}`);
const source = await sourceFile.json();

const destinationFile = await fetch(`${core.getInput('benchmark_file')}`);
const destination = await destinationFile.json();

SwaggerParser.validate(source, (error, api) => {
  if (error) {
    console.log("Error Log (Schema Validation) ====> ", error)

      if(core.getInput('blocking_decision').toLowerCase() === 'strict') {
        //only fail remaining workflow if blocking_decision == 'strict'
        core.setFailed('Swagger validation error(s) found!!');
      } else {
        console.log('Swagger validation error(s) found!!')
      }

    // validate Source file:
    core.setOutput("swagger_validation_results", error);

  }
  else {
    console.log('No Swagger validation error was found!!')
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  
    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

  }
});

openapiDiff.diffSpecs({
  sourceSpec: {
    content: JSON.stringify(source),
    location: 'source.json',
    format: specFormat
  },
  destinationSpec: {
    content: JSON.stringify(destination),
    location: 'destination.json',
    format: specFormat
  }
}).then(result => {
    let diffResults = result.breakingDifferences;
    console.log('Result: (Swagger Diff): \n ', diffResults)

    if (diffResults) {
      if(core.getInput('blocking_decision').toLowerCase() === 'strict') {
        //only fail remaining workflow if blocking_decision == 'strict'
        core.setFailed('Breaking change(s) found!!');
      } else {
        console.log('Breaking change(s) found!!');
      }
    } else {
        console.log('No Breaking change was found!!')
    }

    // validate Source file differences with benchmark:
    core.setOutput("openapi_diff_results", diffResults);

}).catch(error => {
  console.log("Error Log (Swagger Diff) ====> ", error)
  core.setFailed(error.message);
})
