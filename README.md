This action supports both swagger2 and OpenAPI3.

There are two primary objectives for this action:

1) Validate provided 2 swagger json for validation errors (always performed)
2) Verify any breaking changes between the 2 swagger specifications (can be skipped)

## Action Overview:
This action validates a swagger schema using 'swagger-parser' capabilities for swagger schema validation and using 'openapi-diff' capabilities for finding API breaking changes.


### npm packages used:
Following both packages support swagger2 & openapi3 (i.e. swagger version 2 and 3)

```
https://www.npmjs.com/package/openapi-diff

https://www.npmjs.com/package/swagger-parser
```

## Inputs

### `source_file` (source.json)

**Required** The name of Source swagger file. 

### `benchmark_file` (destination.json)

**Conditionally Required** The name of benchmark swagger file. (Not Required when validations === 'schema-validation-only')

### `validations`

**Required** type of validations to run ['all' for (schema-validation + schema-diff) (default), 'schema-validation-only' ].

### `blocking_decision`

**Required** Decision to be taken on remaining steps if current action fails ['strict' for blocking, 'none' for no action (default)].


## Outputs

### `swagger_validation_results`
Errors found in Swagger schema validation

### `openapi_diff_results`
Diffs found in Swagger schema comparison against the benchmark file


## Breaking vs Non-Breaking Changes:
### Breaking Changes:
 - Response Code changed
 - Response ContentType Changed
 - Response Field Type changed (for ex array to String etc)
 - Endpoint path removed
 - Request Method changed
### Non-Breaking Changes:
 - ParamType changed (Path, Query, etc)
 - RequestBody ContentType Changed
 - RequestBody fieldType Changed
 - RequestBody field required status changed etc


## Example usage

```yaml
name: simple-action
on:
    workflow_dispatch:
      inputs:
        source_file:
          required: true
          type: string
          description: 'Source File Name: (source.json)'
        benchmark_file:
          required: false
          type: string
          description: 'Benchmark file name: (destination.json)'
        validations:
          required: true
          type: choice
          options:
            - all
            - schema-validation-only
          description: 'type of validations to run [all, schema-validation-only]'
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
        uses: far11ven/openapi-validations@v1.0.6
        with:
          source_file:   ${{ github.event.inputs.source_file }}
          benchmark_file:  ${{ github.event.inputs.benchmark_file }}
          blocking_decision:  ${{ github.event.inputs.on_failure_decision }}
          validations: ${{ github.event.inputs.validations }}
          
      # Use the output from the step1
      - name: list the results
        id: step2
        run: |
          echo "The Errors found in Swagger schema: ${{ steps.step1.outputs.swagger_validation_results }}"
          echo "The Diffs found in Swagger schema comparison ${{ steps.step1.outputs.openapi_diff_results }}"

```

## todos:

- [x] workflow blocking decision support
- [x] conditional support for only including validation
- [ ] add yaml swagger support