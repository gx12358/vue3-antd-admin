import { createRequire } from 'node:module'
import { build } from 'vite'

const require = createRequire(import.meta.url)

export async function buildPackage(packageName: string) {
  const camelCasePackageName = packageName.replace(/-\w/g, str => str[1].toUpperCase())
  // Call the build function with build configurations
  const result = await build({
    // Do not use a configuration file
    configFile: false,
    build: {
      commonjsOptions: {
        // Vite6 changes the default behavior of strictRequires from "auto" to "true".
        strictRequires: 'auto',
      },
      // Do not output files
      write: false,
      lib: {
        // Entry file is the specified package path
        entry: require.resolve(packageName),
        // Convert package name to camel case
        name: camelCasePackageName,
        // Output format is iife
        formats: ['iife'],
        // Output file name is the same as the package name
        fileName: packageName,
      },
      rolldownOptions: {
        output: {
          // Export method is named export
          exports: 'named',
          // Allow extension of existing global variables
          extend: true,
        },
      },
      // Do not minify
      minify: false,
    },
  })

  // Check if result is an array, if so, take the first element, otherwise use result directly
  const _result = Array.isArray(result) ? result[0] : result

  // If the _result does not have an output property, return
  if (!('output' in _result)) {
    return
  }

  return `
(function (global) {
  var module = { exports: {} };
  var exports = module.exports;

  // 执行 Rolldown 产物：这段代码会往 exports 上挂方法
  (function() {
    ${_result.output[0].code}
  })();

  // 有些 Rolldown 输出没有 return exports，因此我们手动恢复导出对象
  var exp = module.exports.${camelCasePackageName} || module.exports.default || module.exports;

  // 兼容 pathToRegexp 内部导出逻辑（直接在 exports 上挂多个函数）
  if (!exp.match && exports.match) {
    for (var key in exports) {
      exp[key] = exports[key];
    }
  }

  global.__VITE__PLUGIN__FAKE__SERVER__ = global.__VITE__PLUGIN__FAKE__SERVER__ || {};
  global.__VITE__PLUGIN__FAKE__SERVER__.${camelCasePackageName} = exp;
})(typeof globalThis !== 'undefined' ? globalThis : window);
`
}
