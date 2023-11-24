import { createStore } from 'solid-js/store';

function checkValid({ element, validators = [] }, setErrors, errorClass) {
  return async () => {
    element.setCustomValidity('');
    element.checkValidity();
    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = await validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }
    if (message) {
      errorClass && element.classList.toggle(errorClass, true);
      setErrors({ [element.name]: message });
    }
  };
}

export function useForm({ errorClass }) {
  const [errors, setErrors] = createStore({}),
    fields = {};

  const validate = (fieldEl, accessor) => {
    const accessorValue = accessor();
    const validators = Array.isArray(accessorValue) ? accessorValue : [];
    let config;
    fields[fieldEl.name] = config = { element: fieldEl, validators };
    fieldEl.onblur = checkValid(config, setErrors, errorClass);
    fieldEl.oninput = () => {
      if (!errors[fieldEl.name]) return;
      setErrors({ [fieldEl.name]: undefined });
      errorClass && fieldEl.classList.toggle(errorClass, false);
    };
  };

  const getFormValues = (formEl) => {
    const data = {};
    /*
    Data is read from the form through a `FormData` instance.
    Since that might not work with some Solid Components, 
    there are some options through `data-*` attributes:

    * `data-name`: much like `name` in any other input element
    * `data-value`: identifies the element that contains the value.
    * 
    If the `data-value` is in the same element, it produces a single value.
    If the `data-value` attr is in child elements, it produces an array of values.
    
    Further attributes:
      * `data-in-value` the values is in the `value` property of the element.
      * `data-in-html` the value is in the `innerHTML` property of the element.
      If none of this is present, the value of the `data-value` attribute itself is the value.

     */
    const setValue = (key, value) => {
      if (key in data) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    };

    for (const [key, value] of new FormData(formEl)) {
      setValue(key, value);
    }

    const getValueFromEl = (el) => {
      if ('inValue' in el.dataset) return el.value;
      if ('inHtml' in el.dataset) return el.innerHTML;
      return el.dataset.value;
    };
    formEl.querySelectorAll('[data-name]').forEach((dataEl) => {
      const name = dataEl.dataset.name;
      if ('value' in dataEl.dataset) {
        setValue(name, getValueFromEl(dataEl));
      } else {
        setValue(
          name,
          Array.from(dataEl.querySelectorAll('[data-value]')).map(
            getValueFromEl
          )
        );
      }
    });
    return data;
  };

  const formSubmit = (formEl, accessor) => {
    const submitHandler = accessor() || (() => {});
    formEl.setAttribute('novalidate', '');
    formEl.onsubmit = async (e) => {
      e.preventDefault();
      let errored = false;

      for (const k in fields) {
        const field = fields[k];
        await checkValid(field, setErrors, errorClass)();
        if (!errored && field.element.validationMessage) {
          field.element.focus();
          errored = true;
        }
      }
      if (!errored) {
        submitHandler(getFormValues(formEl), e.submitter, formEl);
      }
    };
  };

  return { validate, formSubmit, errors, getFormValues };
}

export default useForm;
