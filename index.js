import core from "@actions/core";
import github from "@actions/github";
import fetch from "node-fetch"; // used when pulling files
import openapiDiff from "openapi-diff";
import SwaggerParser from "@apidevtools/swagger-parser";

// Valid values [2 for swagger2, 3 for openapi3 ]
let openAPIVersion;

//fetch source Swagger file
const sourceFile = await fetch(`${core.getInput("source_file")}`)
const source = await sourceFile.json()

if (typeof source.swagger !== "undefined" && source.swagger === "2.0") {
  openAPIVersion = "2";
} else {
  openAPIVersion = "3";
}

console.log("Source file swagger version: ", openAPIVersion)

const specFormat = openAPIVersion == "2" ? "swagger2" : "openapi3";

// OpenAPI Schema Validation (always run on source file)
SwaggerParser.validate(source, (validationResultsOrError, api) => {
  console.log("# Running Schema Validations...")

  if (validationResultsOrError) {
    console.log("Result: (Schema Validation) ====> ", validationResultsOrError)

    if (core.getInput("blocking_decision").toLowerCase() === "strict") {
      //only fail remaining workflow if blocking_decision == 'strict'
      core.setFailed("Swagger validation error(s) found!!")
    } else {
      console.log("Swagger validation error(s) found!!")
    }

    // validate Source file:
    core.setOutput("swagger_validation_results", validationResultsOrError)
  } else {
    console.log("No Swagger validation error was found!!")
    console.log("API name: %s, Version: %s", api.info.title, api.info.version)

    // console.log(JSON.stringify(api.swagger | api.open_api)) // add a check here for comparison with openAPIVersion

    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`)
  }
})

// OpenAPI Diff (only run when validations = all)
if (
  core.getInput("validations").toLowerCase() !== "schema-validation-only" ||
  core.getInput("validations").toLowerCase() === "all"
) {

  console.log("# Running Schema Diff...");

  //fetch benchmark Swagger file
  const benchmarkFile = await fetch(`${core.getInput("benchmark_file")}`)
  const benchmark = await benchmarkFile.json()

  let benchmark_openAPIVersion;

  if (
    typeof benchmark.swagger !== "undefined" &&
    benchmark.swagger === "2.0"
  ) {
    benchmark_openAPIVersion = "2";
  } else {
    benchmark_openAPIVersion = "3";
  }

  // check if source and benchmark swagger file have same openAPI spec-format
  openAPIVersion === benchmark_openAPIVersion
    ? console.log(
        "Source and Benchmark swagger file have same OpenAPI spec-format/version."
      )
    : core.setFailed(
        `Different OpenAPI spec-format/version used in Source swagger file: ${openAPIVersion} and Benchmark swagger file: ${benchmark_openAPIVersion}`
      )

  openapiDiff
    .diffSpecs({
      sourceSpec: {
        content: JSON.stringify(source),
        location: "source.json",
        format: specFormat,
      },
      destinationSpec: {
        content: JSON.stringify(benchmark),
        location: "benchmark.json",
        format: specFormat,
      },
    })
    .then((result) => {
      let diffResults = result.breakingDifferences;

      if (diffResults) {
        console.log("Result: (Schema Diff): \n ", diffResults)

        if (core.getInput("blocking_decision").toLowerCase() === "strict") {
          //only fail remaining workflow if blocking_decision == 'strict'
          core.setFailed("Breaking change(s) found!!")
        } else {
          console.log("Breaking change(s) found!!")
        }
      } else {
        console.log("No Breaking change was found!!")
      }

      // validate Source file differences with benchmark:
      core.setOutput("openapi_diff_results", diffResults)
    })
    .catch((error) => {
      console.log("Error Log (Swagger Diff) ====> ", error)
      core.setFailed(error.message)
    })
}
