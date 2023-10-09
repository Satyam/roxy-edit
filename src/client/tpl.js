const blockregex =
  /\{\{(([@!]?)([\.\w]+)[\s\S]*?)\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g;
const valregex = /\{\{([=%])([\.\w]+?)\s*(\|\s*([\w,]+))?\s*\}\}/g;

export const scrub =
  typeof Option === 'function'
    ? (val) => new Option(val).innerHTML.replace(/"/g, '&quot;')
    : (val) =>
        val
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;');

const get_value = (vars, key) =>
  key
    .split('.')
    .reduce(
      (out, part) => (out instanceof Map ? out.get(part) : out[part]) ?? false,
      vars
    );

export const renderString = (fragment, vars, formatters = {}) => {
  return fragment
    .replace(
      blockregex,
      (_, __, meta, key, inner, if_true, has_else, if_false) => {
        const val = get_value(vars, key);
        if (!val) {
          // handle if not
          if (meta === '!') {
            return renderString(inner, vars, formatters);
          }
          // check for else
          if (has_else) {
            return renderString(if_false, vars, formatters);
          }

          return '';
        }

        // regular if
        if (!meta) {
          return renderString(if_true, vars, formatters);
        }

        // process array/obj/Map iteration
        if (meta === '@') {
          const out = [];
          for (const [_key, _val] of val.entries()) {
            out.push(
              renderString(
                inner,
                {
                  ...vars,
                  _key,
                  _val,
                },
                formatters
              )
            );
          }
          return out.join('');
        }
      }
    )
    .replace(valregex, (_, meta, key, __, fns = '') => {
      const val = fns
        .split(',')
        .reduce(
          (val, fn) =>
            typeof formatters[fn] == 'function' ? formatters[fn](val) : val,
          get_value(vars, key)
        );

      if (val || val === 0) {
        return meta == '%' ? scrub(val) : val;
      }
      return '';
    });
};

export const renderTpl = (id, vars, formatters) =>
  renderString(document.getElementById(id).innerHTML, vars, formatters);
