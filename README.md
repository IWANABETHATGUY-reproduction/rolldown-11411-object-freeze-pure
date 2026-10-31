# Workaround plugin for rolldown#11411: tree-shake unused Object.freeze / defineProperty on fresh literals

Issue: https://github.com/rolldown/rolldown/issues/11411

`plugin.mjs` adds `/* @__PURE__ */` in front of `Object.freeze(...)`, `Object.defineProperty(...)` and `Object.defineProperties(...)` calls whose first argument is an array or object literal. Rolldown still checks the arguments of a pure call, so `Object.freeze([sideEffect()])` keeps its statement.

```sh
npm install
npm run verify
```

`plugin-native.mjs` does the same with Rolldown's builtin `this.parse`, `Visitor` from `rolldown/utils` and the native MagicString (`meta.magicString`). It needs `experimental.nativeMagicString: true` and no extra dependency.

`verify.mjs` builds `cases/issue-repro` (the code from the issue) without a plugin, with `plugin.mjs` and with `plugin-native.mjs`, and writes `results.md`.
