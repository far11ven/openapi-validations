This action lists swagger schema errors and comparisons. (swagger version 2 and 3)

## Action Overview:
This action validates a swagger schema using 'swagger-parser' capabilities for swagger schema validation and using 'openapi-diff' capabilities for finding API breaking changes.


### npm packages used:
Following both packages support swagger2 & openapi3 (i.e. swagger version 2 and 3)

```
https://www.npmjs.com/package/openapi-diff

https://www.npmjs.com/package/swagger-parser
```

## Inputs

### `benchmark_file`

**Required** The name of benchmark swagger file.

### `source_file`

**Required** The name of Source swagger file.

### `blocking_decision`

**Required** Decision to be taken on remaining steps if current action fails [strict for block, none for non-block (default)].


## Outputs

### `swagger_validation_results`
Errors found in Swagger schema validation

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
        on_failure_decision:
          required: true
          type: choice
          options:
            - none
            - strict
          description: 'action if failed [strict, none (default)]'
        type_of_validations:
          required: true
          type: choice
          options:
            - all
            - schema-validation-only
          description: 'type of validations to run [all (schema-validation + schema-diff) (default), schema-validation-only ]'
jobs:
  validation_job:
    runs-on: ubuntu-latest
    name: swagger-validator
    steps:
      - name: run swagger validations
        id: step1
        uses: far11ven/openapi-validations@v1.0.2
        with:
          source_file:  ${{ github.event.inputs.source_file }}
          benchmark_file:  ${{ github.event.inputs.benchmark_file }}
          blocking_decision:  ${{ github.event.inputs.on_failure_decision }}
          validations:  ${{ github.event.inputs.type_of_validations }}
      # Use the output from the `hello` step
      - name: list the results
        id: step2
        run: |
          echo "The Errors found in Swagger schema: ${{ steps.step1.outputs.swagger_validation_results }}"
          echo "The Diffs found in Swagger schema comparison ${{ steps.step1.outputs.openapi_diff_results }}"

```

## todos:

- [x] workflow blocking decision support
- [ ] add yaml support
- [x] conditional support for only including validation