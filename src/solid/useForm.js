import { createStore, produce } from 'solid-js/store';
import { getValueFromEl } from './inputValues';

export function useForm({ errorClass }) {
  const [fields, setFields] = createStore({
    touched: {},
    values: {},
    errors: {},
  });
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
        setFields('errors', name, message);
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
      setFields(
        produce((f) => {
          f.errors[name] = undefined;
          f.touched[name] = false;
          f.values[name] = getValueFromEl(fieldEl);
        })
      );
    }, 0);
    fieldEl.onblur = (ev) => checkValid(ev.target.name);
    fieldEl.oninput = (ev) => {
      const name = ev.target.name;
      setFields(
        produce((f) => {
          f.errors[name] = undefined;
          f.touched[name] = true;
          f.values[name] = getValueFromEl(fieldsConfig[name].element);
        })
      );
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
        submitHandler(fields.values, ev.submitter, formEl);
      }
    };
  };

  return {
    field,
    formSubmit,
    errors: fields.errors,
    values: fields.values,
    touched: fields.touched,
  };
}

export default useForm;
