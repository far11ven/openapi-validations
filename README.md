This action prints lists swagger errors and comparison diffs.

## Project Overview:
   Exploring 'openapi-diff' capabilities for finding API breaking changes, and
   exploring 'openapi-schema-validator' capabilities for swagger schema validation.


## npm packages used:
Following both packages support swagger2 & openapi3 (i.e. swagger version 2 and 3)

https://www.npmjs.com/package/openapi-diff
https://www.npmjs.com/package/openapi-schema-validator

## Inputs

### `benchmark_file`

**Required** The name of benchmark swagger file.

### `source_file`

**Required** The name of Source swagger file.

### `openapi_version`

**Required** OpenAPI version [2 for swagger2, 3 for openapi3 ].


## Outputs

### `swagger_validation_results`
Errors found in Swagger schema

### `openapi_diff_results`
Diffs found in Swagger schema comparison against the benchmark file

## Example usage

```yaml
name: test-simple-js-action
on:
    workflow_dispatch:
      inputs:
        benchmark_file:
          required: true
          type: string
          description: 'BenchMark file name:'
        source_file:
          required: true
          type: string
          description: 'Source File Name:'
        swagger_version:
          required: true
          type: choice
          options:
            - '2'
            - '3'
          description: 'openapi/swagger version:'
        on_failure_decision:
          required: true
          type: choice
          options:
            - none
            - strict
          description: 'action if failed [strict, none (default)]'
jobs:
  validation_job:
    runs-on: ubuntu-latest
    name: swagger-validator
    steps:
      - name: run swagger validations
        id: step1
        uses: kushal-omnius/openapi-validations@v1.2.1
        with:
          benchmark_file:  ${{ github.event.inputs.benchmark_file }}
          source_file:  ${{ github.event.inputs.source_file }}
          openapi_version:  ${{ github.event.inputs.swagger_version }}
          blocking_decision:  ${{ github.event.inputs.on_failure_decision }}
      # Use the output from the `hello` step
      - name: list the results
        id: step2
        run: |
          echo "The Errors found in Swagger schema: ${{ steps.step1.outputs.swagger_validation_results }}"
          echo "The Diffs found in Swagger schema comparison ${{ steps.step1.outputs.openapi_diff_results }}"
```