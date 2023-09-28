const blockregex =
  /\{\{(([@!]?)([\.\w]+)[\s\S]*?)\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g;
const valregex = /\{\{([=%])(.+?)\}\}/g;

const scrub = (val) => new Option(val).innerHTML.replace(/"/g, '&quot;');

const get_value = (vars, key) =>
  key
    .split('.')
    .reduce(
      (out, part) => (out instanceof Map ? out.get(part) : out[part]) ?? false,
      vars
    );

export const renderString = (fragment, vars) => {
  return fragment
    .replace(
      blockregex,
      (_, __, meta, key, inner, if_true, has_else, if_false) => {
        const val = get_value(vars, key);
        if (!val) {
          // handle if not
          if (meta === '!') {
            return renderString(inner, vars);
          }
          // check for else
          if (has_else) {
            return renderString(if_false, vars);
          }

          return '';
        }

        // regular if
        if (!meta) {
          return renderString(if_true, vars);
        }

        // process array/obj iteration
        if (meta === '@') {
          return (
            val instanceof Map ? [...val.keys()] : Object.keys(val)
          ).reduce(
            (out, _key) =>
              out +
              renderString(inner, {
                ...vars,
                _key,
                _val: val instanceof Map ? val.get(_key) : val[_key],
              }),
            ''
          );
        }
      }
    )
    .replace(valregex, (_, meta, key) => {
      const val = get_value(vars, key);

      if (val || val === 0) {
        return meta == '%' ? scrub(val) : val;
      }
      return '';
    });
};

export const renderTpl = (id, vars) =>
  renderString(document.getElementById(id).innerHTML, vars);
