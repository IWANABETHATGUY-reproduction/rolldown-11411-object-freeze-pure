// Same as plugin.mjs, but with Rolldown's builtin `this.parse` and the native
// MagicString. Needs `experimental.nativeMagicString: true`.
import { Visitor } from 'rolldown/utils';

const METHODS = new Set(['freeze', 'defineProperty', 'defineProperties']);

export function pureObjectFreezeNative() {
  return {
    name: 'pure-object-freeze-native',
    transform: {
      filter: {
        moduleType: ['js', 'jsx', 'ts', 'tsx'],
        code: /\bObject\.(freeze|defineProperty|defineProperties)\b/,
      },
      handler(code, id, meta) {
        const program = this.parse(code, { lang: meta.moduleType });
        const s = meta.magicString;
        new Visitor({
          CallExpression(node) {
            const { callee, arguments: [target] } = node;
            if (
              callee.type === 'MemberExpression' &&
              !callee.computed &&
              callee.object.type === 'Identifier' &&
              callee.object.name === 'Object' &&
              METHODS.has(callee.property.name) &&
              (target?.type === 'ArrayExpression' || target?.type === 'ObjectExpression')
            ) {
              s.appendLeft(node.start, '/* @__PURE__ */ ');
            }
          },
        }).visit(program);
        if (!s.hasChanged()) return null;
        return { code: s };
      },
    },
  };
}
