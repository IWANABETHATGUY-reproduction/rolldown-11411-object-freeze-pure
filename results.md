# rolldown 1.2.16

## Without a plugin: RuleB kept

```js
// cases/issue-repro/lib.js
function RuleA(ctx) {
	return { Name() {
		ctx.report("a");
	} };
}
function RuleB(ctx) {
	return { Name() {
		ctx.report("b");
	} };
}
const usedRules = Object.freeze([RuleA]);
Object.freeze([RuleA, RuleB]);
Object.freeze({ b: RuleB });
Object.freeze([]);
Object.defineProperty({}, "b", { value: RuleB });
Object.defineProperties({}, { b: { value: RuleB } });
// cases/issue-repro/main.js
console.log(usedRules);

//# sourceMappingURL=main.js.map
```

## plugin.mjs (oxc-parser + magic-string): RuleB removed

```js
// cases/issue-repro/lib.js
function RuleA(ctx) {
	return { Name() {
		ctx.report("a");
	} };
}
// cases/issue-repro/main.js
console.log(/* @__PURE__ */ Object.freeze([RuleA]));

//# sourceMappingURL=main.js.map
```

## plugin-native.mjs (this.parse + nativeMagicString): RuleB removed

```js
// cases/issue-repro/lib.js
function RuleA(ctx) {
	return { Name() {
		ctx.report("a");
	} };
}
// cases/issue-repro/main.js
console.log(/* @__PURE__ */ Object.freeze([RuleA]));

//# sourceMappingURL=main.js.map
```
