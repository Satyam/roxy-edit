function getValueFromCheckbox(el) {
  const els = el.form.querySelectorAll(`input[name="${el.name}"]:checked`);
  switch (els.length) {
    case 0:
      return false;
    case 1:
      return els[0].hasAttribute('value') ? els.value : true;
    default:
      return Array.from(els.values());
  }
}

export function getValueFromEl(el) {
  switch (el.nodeName) {
    case 'TEXTAREA':
      return el.value;
    case 'SELECT':
      return el.multiple
        ? Array.from(el.selectedOptions).map((optEl) => optEl.value)
        : el.selectedOptions[0].value;
    case 'INPUT':
      switch (el.type) {
        case 'week':
        case 'number':
        case 'range':
          return el.valueAsNumber ?? Number(el.value);
        case 'checkbox':
          return getValueFromCheckbox(el);
        case 'radio':
          return el.form.namedItems(el.name).value;
        // case 'text':
        // case 'email':
        // case 'hidden':
        // case 'password':
        // case 'tel':
        // case 'search':
        // case 'color':
        // case 'date':
        // case 'datetime-local':
        // case 'month':
        // case 'time':
        // case 'url':
        default:
          return el.value;
      }
  }
}
