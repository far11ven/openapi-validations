/******/ var __webpack_modules__ = ({

/***/ 517:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 700:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 682:
/***/ ((module) => {

module.exports = eval("require")("@apidevtools/swagger-parser");


/***/ }),

/***/ 547:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ }),

/***/ 370:
/***/ ((module) => {

module.exports = eval("require")("openapi-diff");


/***/ }),

/***/ 253:
/***/ ((__webpack_module__, __unused_webpack___webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(517);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(700);
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(547);
/* harmony import */ var openapi_diff__WEBPACK_IMPORTED_MODULE_3__ = __nccwpck_require__(370);
/* harmony import */ var _apidevtools_swagger_parser__WEBPACK_IMPORTED_MODULE_4__ = __nccwpck_require__(682);
 
 
    // used when pulling files from server



// Valid values [2 for swagger2, 3 for openapi3 ]
const openAPIVersion = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('openapi_version') == 2 ? 2 : 3 // default v3

const specFormat = openAPIVersion == 2 ? 'swagger2' : 'openapi3'  //default openapi3

//[Method 1: Using files from server]
const sourceFile = await node_fetch__WEBPACK_IMPORTED_MODULE_2__(`${_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('source_file')}`);
const source = await sourceFile.json();

const destinationFile = await node_fetch__WEBPACK_IMPORTED_MODULE_2__(`${_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('benchmark_file')}`);
const destination = await destinationFile.json();

_apidevtools_swagger_parser__WEBPACK_IMPORTED_MODULE_4__.validate(source, (error, api) => {
  if (error) {
    console.log("Error Log (Schema Validation) ====> ", error)

      if(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('blocking_decision').toLowerCase() === 'strict') {
        //only fail remaining workflow if blocking_decision == 'strict'
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('Swagger validation error(s) found!!');
      } else {
        console.log('Swagger validation error(s) found!!')
      }

    // validate Source file:
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput("swagger_validation_results", error);

  }
  else {
    console.log('No Swagger validation error was found!!')
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  
    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

  }
});

openapi_diff__WEBPACK_IMPORTED_MODULE_3__.diffSpecs({
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
      if(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('blocking_decision').toLowerCase() === 'strict') {
        //only fail remaining workflow if blocking_decision == 'strict'
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('Breaking change(s) found!!');
      } else {
        console.log('Breaking change(s) found!!');
      }
    } else {
        console.log('No Breaking change was found!!')
    }

    // validate Source file differences with benchmark:
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput("openapi_diff_results", diffResults);

}).catch(error => {
  console.log("Error Log (Swagger Diff) ====> ", error)
  _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error.message);
})

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && !queue.d) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = 1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(253);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 
