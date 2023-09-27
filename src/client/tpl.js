const blockregex =
  /\{\{(([@!]?)([\.\w]+)[\s\S]*?)\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g;
const valregex = /\{\{([=%])(.+?)\}\}/g;

const scrub = (val) => new Option(val).innerHTML.replace(/"/g, '&quot;');

const get_value = (vars, key) =>
  key.split('.').reduce((out, part) => out[part] ?? false, vars);

export default function render(fragment, vars) {
  return fragment
    .replace(
      blockregex,
      (_, __, meta, key, inner, if_true, has_else, if_false) => {
        const val = get_value(vars, key);
        if (!val) {
          // handle if not
          if (meta === '!') {
            return render(inner, vars);
          }
          // check for else
          if (has_else) {
            return render(if_false, vars);
          }

          return '';
        }

        // regular if
        if (!meta) {
          return render(if_true, vars);
        }

        // process array/obj iteration
        if (meta === '@') {
          return Object.keys(val).reduce(
            (out, _key) =>
              out + render(inner, { ...vars, _key, _val: val[_key] }),
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
}
