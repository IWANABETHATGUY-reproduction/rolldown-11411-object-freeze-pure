// Workaround for https://github.com/rolldown/rolldown/issues/11411
// Marks `Object.freeze` / `Object.defineProperty` / `Object.defineProperties`
// calls on a fresh array or object literal as pure.
import MagicString from 'magic-string';
import { parseSync, Visitor } from 'oxc-parser';

const METHODS = new Set(['freeze', 'defineProperty', 'defineProperties']);

export function pureObjectFreeze() {
  return {
    name: 'pure-object-freeze',
    transform: {
      filter: { code: /\bObject\.(freeze|defineProperty|defineProperties)\b/ },
      handler(code, id) {
        const { program } = parseSync(id, code);
        const s = new MagicString(code);
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
        return { code: s.toString(), map: s.generateMap({ hires: true }) };
      },
    },
  };
}
