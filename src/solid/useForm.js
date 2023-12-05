import { createStore, unwrap } from 'solid-js/store';
import { getValueFromEl } from './inputValues';

export function useForm({ values: _values = {}, errorClass = 'error-input' }) {
  const [values, setValues] = createStore(_values);
  const [errors, setErrors] = createStore({});
  const [touched, setTouched] = createStore({});
  const fieldsConfig = {};

  const checkValid = (name) => {
    return async () => {
      const { element, validators } = fieldsConfig[name];
      element.setCustomValidity('');
      element.checkValidity();
      let message = element.validationMessage;
      if (!message) {
        for (const validator of validators || []) {
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
        setErrors(name, message);
      }
    };
  };

  const field = (fieldEl, accessor) => {
    const name = fieldEl.name;
    const validators = accessor();
    fieldsConfig[name] = {
      element: fieldEl,
      validators:
        validators === true
          ? []
          : Array.isArray(validators)
          ? validators
          : [validators],
    };
    setTimeout(() => {
      setErrors(name, undefined);
      setTouched(name, false);
      setValues(name, getValueFromEl(fieldEl));
    }, 0);
    fieldEl.onblur = (ev) => checkValid(ev.target.name);
    fieldEl.oninput = (ev) => {
      const name = ev.target.name;
      setErrors(name, undefined);
      setTouched(name, true);
      setValues(name, getValueFromEl(fieldsConfig[name].element));
      errorClass && fieldEl.classList.toggle(errorClass, false);
    };
  };

  const formSubmit = (formEl, accessor) => {
    const submitHandler = accessor() || (() => {});
    formEl.setAttribute('novalidate', '');
    formEl.onsubmit = async (ev) => {
      ev.preventDefault();
      let errored = false;

      for (const [name, config] of Object.entries(fieldsConfig)) {
        await checkValid(name)();
        if (!errored && config.element.validationMessage) {
          config.element.focus();
          errored = true;
        }
      }
      if (!errored) {
        submitHandler(unwrap(values), ev.submitter, formEl);
      }
    };
  };

  return {
    field,
    formSubmit,
    errors,
    values,
    touched,
  };
}

export default useForm;
