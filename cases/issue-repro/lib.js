function RuleA(ctx) {
  return {
    Name() {
      ctx.report('a');
    },
  };
}
function RuleB(ctx) {
  return {
    Name() {
      ctx.report('b');
    },
  };
}

export const usedRules = Object.freeze([RuleA]);
export const unusedRules = Object.freeze([RuleA, RuleB]);
export const unusedObj = Object.freeze({b: RuleB});
export const unusedEmpty = Object.freeze([]);
export const unusedDefine = Object.defineProperty({}, 'b', {value: RuleB});
export const unusedDefines = Object.defineProperties({}, {b: {value: RuleB}});
